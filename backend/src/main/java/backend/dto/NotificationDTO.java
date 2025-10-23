package backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDTO {

    @JsonProperty("notification_id")
    private Long notificationId;

    private String status;

    @JsonProperty("user_id")
    private Long userId;

    @JsonProperty("task_id")
    private Long taskId;

    @JsonProperty("created_at")
    private LocalDateTime createdAt;
}