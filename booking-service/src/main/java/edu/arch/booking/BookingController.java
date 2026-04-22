package edu.arch.booking;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/bookings")
public class BookingController {

    private final BookingRepository bookingRepository;
    private final JwtParser jwtParser;
    private final BookingEventPublisher bookingEventPublisher;

    public BookingController(
            BookingRepository bookingRepository,
            JwtParser jwtParser,
            BookingEventPublisher bookingEventPublisher) {
        this.bookingRepository = bookingRepository;
        this.jwtParser = jwtParser;
        this.bookingEventPublisher = bookingEventPublisher;
    }

    @PostMapping
    public ResponseEntity<?> create(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authorization,
            @RequestBody Map<String, Object> body) {
        try {
            var claims = jwtParser.parse(authorization);
            Long userId = jwtParser.userId(claims);
            String username = jwtParser.username(claims);
            Long movieId = toLong(body.get("movieId"));
            String seat = body.get("seat") != null ? body.get("seat").toString().trim() : "";
            if (movieId == null || seat.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "movieId and seat required"));
            }
            BookingEntity b = new BookingEntity();
            b.setUserId(userId);
            b.setUsername(username);
            b.setMovieId(movieId);
            b.setSeat(seat);
            b.setStatus("PENDING");
            b = bookingRepository.save(b);
            bookingEventPublisher.publishBookingCreated(b);
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                    "id", b.getId(),
                    "userId", b.getUserId(),
                    "username", b.getUsername(),
                    "movieId", b.getMovieId(),
                    "seat", b.getSeat(),
                    "status", b.getStatus()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "invalid token"));
        }
    }

    @GetMapping
    public ResponseEntity<?> list(@RequestHeader(HttpHeaders.AUTHORIZATION) String authorization) {
        try {
            var claims = jwtParser.parse(authorization);
            Long userId = jwtParser.userId(claims);
            List<Map<String, Object>> rows = bookingRepository.findByUserIdOrderByIdDesc(userId).stream()
                    .map(b -> Map.<String, Object>of(
                            "id", b.getId(),
                            "movieId", b.getMovieId(),
                            "seat", b.getSeat(),
                            "status", b.getStatus()))
                    .collect(Collectors.toList());
            return ResponseEntity.ok(rows);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "invalid token"));
        }
    }

    private static Long toLong(Object v) {
        if (v instanceof Number n) {
            return n.longValue();
        }
        return null;
    }
}
