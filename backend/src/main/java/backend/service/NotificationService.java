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

    @Transactional(readOnly = true)
    public NotificationDTO getNotificationDetail(Long userId, Long notificationId) {
        Notification notification = notificationRepository.findByUserIdAndNotificationId(userId, notificationId)
                .orElseThrow(() -> new IllegalArgumentException("해당 알림을 찾을 수 없습니다."));
        return convertToDTO(notification);
    }

    public NotificationDTO readNotification(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 알림이 없습니다."));
        notification.setStatus("읽음");
        return convertToDTO(notificationRepository.save(notification));
    }

    public void deleteNotification(Long id) {
        if (!notificationRepository.existsById(id)) {
            throw new IllegalArgumentException("삭제할 알림이 없습니다.");
        }
        notificationRepository.deleteById(id);
    }

    private NotificationDTO convertToDTO(Notification n) {
        return NotificationDTO.builder()
                .notificationId(n.getNotificationId())
                .status(n.getStatus())
                .createdAt(n.getCreatedAt())
                .taskId(n.getTask().getTaskId())
                .taskName(n.getTask().getTaskName())
                .taskDate(n.getTask().getTaskDate())
                .categoryName(
                    n.getTask().getCategory() != null
                        ? n.getTask().getCategory().getCategoryName()
                        : null
                )
                .build();
    }
}
