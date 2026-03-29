package com.food.order.model;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record CreateOrderRequest(
        @NotBlank String customerName,
        @NotBlank String itemName,
        @Min(1) int quantity,
        @NotBlank String mode
) {
}
