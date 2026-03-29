package com.food.order.service;

import com.food.order.event.OrderCreatedEvent;
import com.food.order.model.CreateOrderRequest;
import com.food.order.model.OrderEntity;
import com.food.order.repository.OrderRepository;
import java.time.LocalDateTime;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ApplicationEventPublisher eventPublisher;

    public OrderService(OrderRepository orderRepository, ApplicationEventPublisher eventPublisher) {
        this.orderRepository = orderRepository;
        this.eventPublisher = eventPublisher;
    }

    public OrderEntity createOrder(CreateOrderRequest request) {
        OrderEntity order = new OrderEntity();
        order.setCustomerName(request.customerName());
        order.setItemName(request.itemName());
        order.setQuantity(request.quantity());
        order.setStatus("CREATED");
        order.setCreatedAt(LocalDateTime.now());
        return orderRepository.save(order);
    }

    public void publishOrderCreatedEvent(OrderEntity order) {
        eventPublisher.publishEvent(new OrderCreatedEvent(
                order.getId(),
                order.getCustomerName(),
                order.getItemName(),
                order.getQuantity()
        ));
    }
}
