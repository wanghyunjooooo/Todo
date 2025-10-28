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
}
