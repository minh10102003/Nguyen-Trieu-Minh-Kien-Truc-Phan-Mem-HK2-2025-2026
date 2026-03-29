package com.food.order.model;

public record PaymentRequest(Long orderId, String customerName, int amount, String itemName, int quantity) {
}
