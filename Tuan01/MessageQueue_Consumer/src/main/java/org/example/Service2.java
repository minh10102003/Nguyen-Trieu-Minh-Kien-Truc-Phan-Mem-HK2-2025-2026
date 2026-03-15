package org.example;

import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;
import com.rabbitmq.client.DeliverCallback;

public class Service2 {
    private final static String QUEUE_NAME = "event_queue";

    public static void main(String[] argv) throws Exception {
        // 1. Thiết lập kết nối
        ConnectionFactory factory = new ConnectionFactory();
        factory.setHost("localhost");
        Connection connection = factory.newConnection();
        Channel channel = connection.createChannel();

        // 2. Khai báo queue (đảm bảo queue tồn tại)
        channel.queueDeclare(QUEUE_NAME, false, false, false, null);
        System.out.println(" [Service 2] Đang chờ nhận tin nhắn...");

        // 3. Định nghĩa hàm xử lý khi có tin nhắn đến (Callback)
        DeliverCallback deliverCallback = (consumerTag, delivery) -> {
            String message = new String(delivery.getBody(), "UTF-8");
            System.out.println(" [Service 2] Received: '" + message + "'");
            // Xử lý logic tại đây...
        };

        // 4. Bắt đầu lắng nghe
        channel.basicConsume(QUEUE_NAME, true, deliverCallback, consumerTag -> { });
    }
}