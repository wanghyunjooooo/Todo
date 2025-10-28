package backend.controller;

import backend.dto.NotificationDTO;
import backend.entity.Notification;
import backend.repository.NotificationRepository;
import backend.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    private final NotificationRepository notificationRepository;

    public NotificationController(NotificationRepository notificationRepository, NotificationService notificationService) {
        this.notificationRepository = notificationRepository;
        this.notificationService = notificationService;
    }

    @GetMapping("/{userId}")
    public List<NotificationDTO> getNotifications(@PathVariable Long userId) {
        return notificationService.getNotificationsWithTask(userId);
    }

    @GetMapping("/{userId}/{notificationId}")
    public NotificationDTO getNotificationDetail(@PathVariable Long userId, @PathVariable Long notificationId) {
        return notificationService.getNotificationDetail(userId, notificationId);
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Long id) {
        Notification n = notificationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 알림을 찾을 수 없습니다."));
        n.setStatus("읽음");
        notificationRepository.save(n);
        return ResponseEntity.ok(Map.of("message", "알림이 읽음 처리되었습니다."));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNotification(@PathVariable Long id) {
        if (!notificationRepository.existsById(id)) {
            return ResponseEntity.badRequest().body(Map.of("error", "해당 알림을 찾을 수 없습니다."));
        }
        notificationRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "알림이 삭제되었습니다."));
    }
}
