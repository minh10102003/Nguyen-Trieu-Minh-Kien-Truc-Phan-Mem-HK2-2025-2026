package com.food.payment.event;

import com.food.payment.client.KitchenClient;
import com.food.payment.model.KitchenRequest;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class PaymentEventListener {

    private final KitchenClient kitchenClient;

    public PaymentEventListener(KitchenClient kitchenClient) {
        this.kitchenClient = kitchenClient;
    }

    @EventListener
    public void onPaymentCompleted(PaymentCompletedEvent event) {
        kitchenClient.publishPaymentCompleted(new KitchenRequest(event.orderId(), event.itemName(), event.quantity()));
    }
}
