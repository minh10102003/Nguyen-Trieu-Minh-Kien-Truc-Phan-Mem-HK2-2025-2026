package com.food.payment.controller;

import com.food.payment.model.PaymentRequest;
import com.food.payment.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/pay")
    public ResponseEntity<String> pay(@RequestBody PaymentRequest request) {
        String result = paymentService.processPayment(request);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/events/order-created")
    public ResponseEntity<String> onOrderCreated(@RequestBody PaymentRequest request) {
        paymentService.processPayment(request);
        paymentService.publishPaymentCompleted(request);
        return ResponseEntity.ok("Order-created event consumed by payment-service.");
    }
}
