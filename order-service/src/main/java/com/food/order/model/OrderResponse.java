package com.food.order.model;

public record OrderResponse(
        Long orderId,
        String status,
        String mode,
        String message
) {
}
