package com.food.kitchen.controller;

import com.food.kitchen.model.KitchenRequest;
import com.food.kitchen.service.KitchenService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping
public class KitchenController {

    private final KitchenService kitchenService;

    public KitchenController(KitchenService kitchenService) {
        this.kitchenService = kitchenService;
    }

    @PostMapping("/cook")
    public ResponseEntity<String> cook(@RequestBody KitchenRequest request) {
        return ResponseEntity.ok(kitchenService.cook(request));
    }

    @PostMapping("/events/payment-completed")
    public ResponseEntity<String> onPaymentCompleted(@RequestBody KitchenRequest request) {
        kitchenService.cook(request);
        return ResponseEntity.ok("Payment-completed event consumed by kitchen-service.");
    }
}
