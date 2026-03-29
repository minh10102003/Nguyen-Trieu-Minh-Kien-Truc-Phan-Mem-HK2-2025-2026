package com.food.order.service;

import com.food.order.client.KitchenClient;
import com.food.order.client.PaymentClient;
import com.food.order.model.KitchenRequest;
import com.food.order.model.OrderEntity;
import com.food.order.model.PaymentRequest;
import org.springframework.stereotype.Component;

@Component
public class WorkflowOrchestrator {

    private final PaymentClient paymentClient;
    private final KitchenClient kitchenClient;

    public WorkflowOrchestrator(PaymentClient paymentClient, KitchenClient kitchenClient) {
        this.paymentClient = paymentClient;
        this.kitchenClient = kitchenClient;
    }

    public void process(OrderEntity order) {
        PaymentRequest paymentRequest = new PaymentRequest(
                order.getId(),
                order.getCustomerName(),
                order.getQuantity() * 10,
                order.getItemName(),
                order.getQuantity()
        );
        paymentClient.pay(paymentRequest);
        KitchenRequest kitchenRequest = new KitchenRequest(order.getId(), order.getItemName(), order.getQuantity());
        kitchenClient.cook(kitchenRequest);
    }
}
