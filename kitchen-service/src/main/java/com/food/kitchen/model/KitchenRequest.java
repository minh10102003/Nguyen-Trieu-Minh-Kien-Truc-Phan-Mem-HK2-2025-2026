package com.food.kitchen.model;

public record KitchenRequest(Long orderId, String itemName, int quantity) {
}
