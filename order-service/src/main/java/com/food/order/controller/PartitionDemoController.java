package com.food.order.controller;

import com.food.order.service.PartitionDemoService;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/partition")
public class PartitionDemoController {

    private final PartitionDemoService partitionDemoService;

    public PartitionDemoController(PartitionDemoService partitionDemoService) {
        this.partitionDemoService = partitionDemoService;
    }

    @PostMapping("/horizontal")
    public ResponseEntity<String> horizontal(@RequestBody Map<String, String> body) {
        String result = partitionDemoService.horizontalPartition(body.get("name"), body.get("gender"));
        return ResponseEntity.ok(result);
    }

    @PostMapping("/vertical")
    public ResponseEntity<String> vertical(@RequestBody Map<String, String> body) {
        String result = partitionDemoService.verticalPartition(body.get("name"), body.get("address"));
        return ResponseEntity.ok(result);
    }

    @PostMapping("/function")
    public ResponseEntity<String> function(@RequestBody Map<String, String> body) {
        String result = partitionDemoService.functionPartition(body.getOrDefault("payload", "sample-payload"));
        return ResponseEntity.ok(result);
    }
}
