package com.food.payment.model;

public record KitchenRequest(Long orderId, String itemName, int quantity) {
}
