package com.influencehub.backend.store.dto;

public class StoreItemResponse {

    private final String name;
    private final String stock;
    private final String sales;

    public StoreItemResponse(String name, String stock, String sales) {
        this.name = name;
        this.stock = stock;
        this.sales = sales;
    }

    public String getName() {
        return name;
    }

    public String getStock() {
        return stock;
    }

    public String getSales() {
        return sales;
    }
}
