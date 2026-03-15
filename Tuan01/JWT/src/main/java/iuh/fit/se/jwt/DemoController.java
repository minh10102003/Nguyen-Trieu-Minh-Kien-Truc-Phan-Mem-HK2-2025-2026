package iuh.fit.se.jwt;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DemoController {

    @GetMapping("/api/public/hello")
    public String publicHello() {
        return "Đây là API công khai!";
    }

    @GetMapping("/api/private/hello")
    public String privateHello() {
        return "Chúc mừng! Bạn đã truy cập API bảo mật bằng JWT RSA thành công.";
    }
}