package com.food.payment.event;

public record PaymentCompletedEvent(Long orderId, String itemName, int quantity) {
}
