package com.food.order.model;

public record KitchenRequest(Long orderId, String itemName, int quantity) {
}
