package com.food.order.event;

import com.food.order.client.PaymentClient;
import com.food.order.model.PaymentRequest;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class OrderEventListener {

    private final PaymentClient paymentClient;

    public OrderEventListener(PaymentClient paymentClient) {
        this.paymentClient = paymentClient;
    }

    @EventListener
    public void onOrderCreated(OrderCreatedEvent event) {
        PaymentRequest paymentRequest = new PaymentRequest(
                event.orderId(),
                event.customerName(),
                event.quantity() * 10,
                event.itemName(),
                event.quantity()
        );
        paymentClient.publishOrderCreatedEvent(paymentRequest);
    }
}
