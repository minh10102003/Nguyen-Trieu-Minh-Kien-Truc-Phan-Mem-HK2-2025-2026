package com.food.order.event;

public record OrderCreatedEvent(Long orderId, String customerName, String itemName, int quantity) {
}
