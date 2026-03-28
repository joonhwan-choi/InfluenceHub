package com.influencehub.backend.store.repository;

import com.influencehub.backend.room.domain.CreatorRoom;
import com.influencehub.backend.store.domain.StoreProduct;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StoreProductRepository extends JpaRepository<StoreProduct, Long> {

    List<StoreProduct> findTop20ByRoomOrderByCreatedAtDesc(CreatorRoom room);

    java.util.Optional<StoreProduct> findByIdAndRoom(Long id, CreatorRoom room);
}
