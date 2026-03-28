package com.influencehub.backend.store.api;

import com.influencehub.backend.store.dto.CreateStoreProductRequest;
import com.influencehub.backend.store.dto.StoreImageUploadResponse;
import com.influencehub.backend.store.dto.StoreImportPreviewRequest;
import com.influencehub.backend.store.dto.StoreImportPreviewResponse;
import com.influencehub.backend.store.dto.StoreItemResponse;
import com.influencehub.backend.store.dto.UpdateStoreProductRequest;
import com.influencehub.backend.store.service.StoreBoardService;
import java.util.List;
import javax.validation.Valid;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/store")
public class StoreBoardController {

    private final StoreBoardService storeBoardService;

    public StoreBoardController(StoreBoardService storeBoardService) {
        this.storeBoardService = storeBoardService;
    }

    @GetMapping("/mine")
    public List<StoreItemResponse> mine(@RequestHeader("Authorization") String authorizationHeader) {
        return storeBoardService.getMine(extractBearerToken(authorizationHeader));
    }

    @PostMapping("/mine")
    public StoreItemResponse create(
        @RequestHeader("Authorization") String authorizationHeader,
        @Valid @RequestBody CreateStoreProductRequest request
    ) {
        return storeBoardService.createProduct(extractBearerToken(authorizationHeader), request);
    }

    @PostMapping("/import-preview")
    public StoreImportPreviewResponse importPreview(
        @RequestHeader("Authorization") String authorizationHeader,
        @Valid @RequestBody StoreImportPreviewRequest request
    ) {
        return storeBoardService.previewImport(extractBearerToken(authorizationHeader), request);
    }

    @PostMapping("/upload-image")
    public StoreImageUploadResponse uploadImage(
        @RequestHeader("Authorization") String authorizationHeader,
        MultipartFile file
    ) {
        return storeBoardService.uploadImage(extractBearerToken(authorizationHeader), file);
    }

    @PatchMapping("/mine/{productId}")
    public StoreItemResponse update(
        @RequestHeader("Authorization") String authorizationHeader,
        @PathVariable Long productId,
        @RequestBody UpdateStoreProductRequest request
    ) {
        return storeBoardService.updateProduct(extractBearerToken(authorizationHeader), productId, request);
    }

    @PatchMapping("/mine/{productId}/visibility")
    public StoreItemResponse updateVisibility(
        @RequestHeader("Authorization") String authorizationHeader,
        @PathVariable Long productId,
        @RequestBody UpdateStoreProductRequest request
    ) {
        boolean visible = request.getVisible() != null && request.getVisible();
        return storeBoardService.updateVisibility(extractBearerToken(authorizationHeader), productId, visible);
    }

    @DeleteMapping("/mine/{productId}")
    public void delete(
        @RequestHeader("Authorization") String authorizationHeader,
        @PathVariable Long productId
    ) {
        storeBoardService.deleteProduct(extractBearerToken(authorizationHeader), productId);
    }

    private String extractBearerToken(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new IllegalArgumentException("유효한 Bearer 토큰이 필요합니다.");
        }
        return authorizationHeader.substring("Bearer ".length()).trim();
    }
}
