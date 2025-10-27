package backend.dto;

import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonProperty;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationDTO {

    @JsonProperty("notification_id")
    private Long notificationId;

    private String status;

    @JsonProperty("created_at")
    private LocalDateTime createdAt;

    @JsonProperty("task_id")
    private Long taskId;

    @JsonProperty("task_name")
    private String taskName;

    @JsonProperty("task_date")
    private LocalDate taskDate;

    @JsonProperty("category_name")
    private String categoryName;
}
