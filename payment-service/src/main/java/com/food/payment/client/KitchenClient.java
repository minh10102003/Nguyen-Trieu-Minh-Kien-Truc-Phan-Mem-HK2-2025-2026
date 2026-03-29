package com.food.payment.client;

import com.food.payment.model.KitchenRequest;
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

    public void publishPaymentCompleted(KitchenRequest request) {
        restTemplate.postForEntity(kitchenBaseUrl + "/events/payment-completed", request, String.class);
    }
}
