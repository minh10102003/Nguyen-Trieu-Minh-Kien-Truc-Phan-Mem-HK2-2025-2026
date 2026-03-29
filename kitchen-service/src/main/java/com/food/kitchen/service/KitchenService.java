package com.food.kitchen.service;

import com.food.kitchen.model.KitchenRequest;
import org.springframework.stereotype.Service;

@Service
public class KitchenService {

    public String cook(KitchenRequest request) {
        return "Cooking started for orderId=" + request.orderId()
                + ", item=" + request.itemName()
                + ", quantity=" + request.quantity();
    }
}
