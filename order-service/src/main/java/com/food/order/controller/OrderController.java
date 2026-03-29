package com.food.order.controller;

import com.food.order.model.CreateOrderRequest;
import com.food.order.model.OrderEntity;
import com.food.order.model.OrderResponse;
import com.food.order.service.OrderService;
import com.food.order.service.WorkflowOrchestrator;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/order")
public class OrderController {

    private final OrderService orderService;
    private final WorkflowOrchestrator workflowOrchestrator;

    public OrderController(OrderService orderService, WorkflowOrchestrator workflowOrchestrator) {
        this.orderService = orderService;
        this.workflowOrchestrator = workflowOrchestrator;
    }

    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(@Valid @RequestBody CreateOrderRequest request) {
        OrderEntity order = orderService.createOrder(request);
        String normalizedMode = request.mode().trim().toLowerCase();

        if ("orchestration".equals(normalizedMode)) {
            workflowOrchestrator.process(order);
            return ResponseEntity.ok(new OrderResponse(order.getId(), order.getStatus(), normalizedMode,
                    "Processed by orchestrator (order -> payment -> kitchen)."));
        }

        orderService.publishOrderCreatedEvent(order);
        return ResponseEntity.ok(new OrderResponse(order.getId(), order.getStatus(), "choreography",
                "Order created and event published for choreography flow."));
    }
}
