package org.example;

import com.rabbitmq.client.ConnectionFactory;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.Channel;

public class Service1 {
    private final static String QUEUE_NAME = "event_queue";

    public static void main(String[] argv) throws Exception {
        // 1. Thiết lập kết nối
        ConnectionFactory factory = new ConnectionFactory();
        factory.setHost("localhost"); // Địa chỉ RabbitMQ server

        try (Connection connection = factory.newConnection();
             Channel channel = connection.createChannel()) {

            // 2. Khai báo queue (tên, bền vững, độc quyền, tự xóa, tham số)
            channel.queueDeclare(QUEUE_NAME, false, false, false, null);

            String message = "Hello from Service 1: Event triggered!";

            // 3. Gửi tin nhắn
            channel.basicPublish("", QUEUE_NAME, null, message.getBytes("UTF-8"));
            System.out.println(" [Service 1] Sent: '" + message + "'");
        }
    }
}