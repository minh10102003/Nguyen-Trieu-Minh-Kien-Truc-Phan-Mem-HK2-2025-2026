package com.food.payment.service;

import com.food.payment.event.PaymentCompletedEvent;
import com.food.payment.model.PaymentRequest;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

@Service
public class PaymentService {

    private final ApplicationEventPublisher eventPublisher;

    public PaymentService(ApplicationEventPublisher eventPublisher) {
        this.eventPublisher = eventPublisher;
    }

    public String processPayment(PaymentRequest request) {
        return "Payment success for orderId=" + request.orderId() + ", amount=" + request.amount();
    }

    public void publishPaymentCompleted(PaymentRequest request) {
        eventPublisher.publishEvent(new PaymentCompletedEvent(request.orderId(), request.itemName(), request.quantity()));
    }
}
