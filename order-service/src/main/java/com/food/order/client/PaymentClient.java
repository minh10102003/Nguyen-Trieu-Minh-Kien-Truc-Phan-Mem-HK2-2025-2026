package com.food.order.client;

import com.food.order.model.PaymentRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class PaymentClient {

    private final RestTemplate restTemplate;
    private final String paymentBaseUrl;

    public PaymentClient(RestTemplate restTemplate, @Value("${services.payment.base-url}") String paymentBaseUrl) {
        this.restTemplate = restTemplate;
        this.paymentBaseUrl = paymentBaseUrl;
    }

    public void pay(PaymentRequest request) {
        restTemplate.postForEntity(paymentBaseUrl + "/pay", request, String.class);
    }

    public void publishOrderCreatedEvent(PaymentRequest request) {
        restTemplate.postForEntity(paymentBaseUrl + "/events/order-created", request, String.class);
    }
}
