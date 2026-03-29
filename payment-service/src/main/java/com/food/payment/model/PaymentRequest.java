package com.food.payment.model;

public record PaymentRequest(Long orderId, String customerName, int amount, String itemName, int quantity) {
}
