package com.food.order.client;

import com.food.order.model.KitchenRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class KitchenClient {

    private final RestTemplate restTemplate;
    private final String kitchenBaseUrl;

    public KitchenClient(RestTemplate restTemplate, @Value("${services.kitchen.base-url}") String kitchenBaseUrl) {
        this.restTemplate = restTemplate;
        this.kitchenBaseUrl = kitchenBaseUrl;
    }

    public void cook(KitchenRequest request) {
        restTemplate.postForEntity(kitchenBaseUrl + "/cook", request, String.class);
    }
}
