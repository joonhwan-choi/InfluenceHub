package com.influencehub.backend.store.service;

import com.influencehub.backend.auth.domain.CreatorSession;
import com.influencehub.backend.auth.service.CreatorAuthService;
import com.influencehub.backend.room.domain.CreatorRoom;
import com.influencehub.backend.store.domain.StoreProduct;
import com.influencehub.backend.store.domain.StoreProductSourceType;
import com.influencehub.backend.store.dto.CreateStoreProductRequest;
import com.influencehub.backend.store.dto.StoreImportPreviewRequest;
import com.influencehub.backend.store.dto.StoreImportPreviewResponse;
import com.influencehub.backend.store.dto.StoreItemResponse;
import com.influencehub.backend.store.repository.StoreProductRepository;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class StoreBoardService {

    private static final Pattern META_TAG_PATTERN = Pattern.compile("<meta\\s+[^>]*>", Pattern.CASE_INSENSITIVE);
    private static final Pattern TITLE_TAG_PATTERN = Pattern.compile("<title[^>]*>(.*?)</title>", Pattern.CASE_INSENSITIVE | Pattern.DOTALL);
    private static final Pattern JSON_LD_PRICE_PATTERN = Pattern.compile("\"price\"\\s*:\\s*\"([^\"]+)\"", Pattern.CASE_INSENSITIVE);
    private static final HttpClient HTTP_CLIENT = HttpClient.newBuilder()
        .connectTimeout(Duration.ofSeconds(5))
        .followRedirects(HttpClient.Redirect.NORMAL)
        .build();

    private final CreatorAuthService creatorAuthService;
    private final StoreProductRepository storeProductRepository;

    public StoreBoardService(
        CreatorAuthService creatorAuthService,
        StoreProductRepository storeProductRepository
    ) {
        this.creatorAuthService = creatorAuthService;
        this.storeProductRepository = storeProductRepository;
    }

    @Transactional(readOnly = true)
    public List<StoreItemResponse> getMine(String sessionToken) {
        CreatorSession session = creatorAuthService.requireSession(sessionToken);
        return storeProductRepository.findTop20ByRoomOrderByCreatedAtDesc(session.getRoom()).stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }

    @Transactional
    public StoreItemResponse createProduct(String sessionToken, CreateStoreProductRequest request) {
        CreatorSession session = creatorAuthService.requireSession(sessionToken);
        CreatorRoom room = session.getRoom();

        String productName = requiredValue(request.getName(), "상품 이름이 필요합니다.");
        StoreProduct saved = storeProductRepository.save(
            new StoreProduct(
                room,
                isBlank(request.getExternalUrl()) ? StoreProductSourceType.MANUAL : StoreProductSourceType.LINK_IMPORT,
                productName,
                blankToNull(request.getDescription()),
                blankToNull(request.getImageUrl()),
                blankToNull(request.getExternalUrl()),
                blankToNull(request.getPriceText()),
                defaultIfBlank(request.getStatusLabel(), "판매 준비"),
                defaultIfBlank(request.getSalesLabel(), "외부 링크 판매"),
                defaultIfBlank(request.getSourceLabel(), "직접 등록")
            )
        );

        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public StoreImportPreviewResponse previewImport(String sessionToken, StoreImportPreviewRequest request) {
        creatorAuthService.requireSession(sessionToken);
        String sourceUrl = requiredValue(request.getSourceUrl(), "상품 링크가 필요합니다.");
        ImportedStoreProductData data = fetchPreviewData(sourceUrl);
        return new StoreImportPreviewResponse(
            sourceUrl,
            data.productName,
            data.description,
            data.imageUrl,
            data.priceText,
            data.sourceLabel,
            data.note
        );
    }

    private StoreItemResponse toResponse(StoreProduct product) {
        return new StoreItemResponse(
            product.getId(),
            product.getName(),
            product.getDescription(),
            product.getImageUrl(),
            product.getExternalUrl(),
            product.getPriceText(),
            product.getStatusLabel(),
            product.getSalesLabel(),
            product.getSourceLabel()
        );
    }

    private ImportedStoreProductData fetchPreviewData(String sourceUrl) {
        URI uri = toHttpUri(sourceUrl);
        HttpRequest request = HttpRequest.newBuilder(uri)
            .GET()
            .timeout(Duration.ofSeconds(8))
            .header("User-Agent", "Mozilla/5.0 InfluenceHub Goods Import")
            .build();

        try {
            HttpResponse<String> response = HTTP_CLIENT.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() >= 400) {
                throw new IllegalStateException("상품 링크를 불러오지 못했습니다.");
            }

            String html = response.body();
            String productName = firstNonBlank(
                findMetaContent(html, "og:title"),
                findMetaContent(html, "twitter:title"),
                extractTitle(html),
                "링크 상품"
            );
            String description = firstNonBlank(
                findMetaContent(html, "og:description"),
                findMetaContent(html, "description"),
                "링크에서 기본 정보를 가져왔습니다."
            );
            String imageUrl = firstNonBlank(
                findMetaContent(html, "og:image"),
                findMetaContent(html, "twitter:image"),
                ""
            );
            String priceValue = firstNonBlank(
                findMetaContent(html, "product:price:amount"),
                extractJsonLdPrice(html),
                ""
            );
            return new ImportedStoreProductData(
                productName,
                description,
                imageUrl,
                priceValue.isEmpty() ? "" : normalizePrice(priceValue),
                sourceLabel(uri.getHost()),
                "공개 메타데이터 기준으로 초안을 채웠습니다. 저장 전에 한 번 확인하는 방식이 안전합니다."
            );
        } catch (IOException exception) {
            throw new IllegalStateException("상품 링크를 읽어오지 못했습니다.");
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException("상품 링크를 읽어오지 못했습니다.");
        }
    }

    private String normalizePrice(String rawValue) {
        String trimmed = rawValue.trim();
        if (trimmed.matches("\\d+[\\d,]*")) {
            return trimmed + "원";
        }
        return trimmed;
    }

    private URI toHttpUri(String sourceUrl) {
        try {
            URI uri = new URI(sourceUrl.trim());
            String scheme = Optional.ofNullable(uri.getScheme()).orElse("").toLowerCase(Locale.ROOT);
            if (!scheme.equals("http") && !scheme.equals("https")) {
                throw new IllegalStateException("http 또는 https 링크만 가져올 수 있습니다.");
            }
            return uri;
        } catch (URISyntaxException exception) {
            throw new IllegalStateException("유효한 상품 링크가 필요합니다.");
        }
    }

    private String sourceLabel(String host) {
        String normalizedHost = host == null ? "" : host.toLowerCase(Locale.ROOT);
        if (normalizedHost.contains("smartstore.naver.com") || normalizedHost.contains("shopping.naver.com")) {
            return "네이버 쇼핑 링크";
        }
        return normalizedHost.isBlank() ? "외부 링크" : normalizedHost.replace("www.", "");
    }

    private String findMetaContent(String html, String key) {
        Matcher matcher = META_TAG_PATTERN.matcher(html);
        while (matcher.find()) {
            String tag = matcher.group();
            String property = firstNonBlank(extractAttribute(tag, "property"), extractAttribute(tag, "name"), "");
            if (!property.equalsIgnoreCase(key)) {
                continue;
            }
            return decodeHtml(extractAttribute(tag, "content"));
        }
        return "";
    }

    private String extractTitle(String html) {
        Matcher matcher = TITLE_TAG_PATTERN.matcher(html);
        if (!matcher.find()) {
            return "";
        }
        return decodeHtml(matcher.group(1).replaceAll("\\s+", " ").trim());
    }

    private String extractJsonLdPrice(String html) {
        Matcher matcher = JSON_LD_PRICE_PATTERN.matcher(html);
        if (!matcher.find()) {
            return "";
        }
        return decodeHtml(matcher.group(1));
    }

    private String extractAttribute(String tag, String attribute) {
        Pattern pattern = Pattern.compile(attribute + "\\s*=\\s*[\"']([^\"']+)[\"']", Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(tag);
        if (!matcher.find()) {
            return "";
        }
        return matcher.group(1).trim();
    }

    private String decodeHtml(String value) {
        return value
            .replace("&amp;", "&")
            .replace("&lt;", "<")
            .replace("&gt;", ">")
            .replace("&quot;", "\"")
            .replace("&#39;", "'");
    }

    private String firstNonBlank(String... values) {
        for (String value : values) {
            if (!isBlank(value)) {
                return value.trim();
            }
        }
        return "";
    }

    private String requiredValue(String value, String message) {
        if (isBlank(value)) {
            throw new IllegalArgumentException(message);
        }
        return value.trim();
    }

    private String defaultIfBlank(String value, String fallback) {
        return isBlank(value) ? fallback : value.trim();
    }

    private String blankToNull(String value) {
        return isBlank(value) ? null : value.trim();
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    private static class ImportedStoreProductData {
        private final String productName;
        private final String description;
        private final String imageUrl;
        private final String priceText;
        private final String sourceLabel;
        private final String note;

        private ImportedStoreProductData(
            String productName,
            String description,
            String imageUrl,
            String priceText,
            String sourceLabel,
            String note
        ) {
            this.productName = productName;
            this.description = description;
            this.imageUrl = imageUrl;
            this.priceText = priceText;
            this.sourceLabel = sourceLabel;
            this.note = note;
        }
    }
}
