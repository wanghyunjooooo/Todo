package backend.service;

import backend.dto.NotificationDTO;
import backend.entity.Notification;
import backend.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public List<NotificationDTO> getNotificationsWithTask(Long userId) {
        return notificationRepository.findAllByUserWithTask(userId).stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    private NotificationDTO convertToDTO(Notification n) {
        return NotificationDTO.builder()
                .notificationId(n.getNotificationId())
                .status(n.getStatus())
                .createdAt(n.getCreatedAt())
                .taskId(n.getTask().getTaskId())
                .taskName(n.getTask().getTaskName())
                .taskDate(n.getTask().getTaskDate())
                .categoryName(n.getTask().getCategory().getCategoryName())
                .build();
    }
}
