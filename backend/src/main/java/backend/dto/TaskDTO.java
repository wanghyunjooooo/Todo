package backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class TaskDTO {

    @JsonProperty("task_id")
    private Long taskId;

    @JsonProperty("task_name")
    private String taskName;

    @JsonProperty("status")
    private String status;

    @JsonProperty("memo")
    private String memo;

    @JsonProperty("task_date")
    private LocalDate taskDate;

    @JsonProperty("notification_type")
    private String notificationType;

    @JsonProperty("notification_time")
    private LocalDateTime notificationTime;

    @JsonProperty("user_id")
    private Long userId;

    @JsonProperty("category_id")
    private Long categoryId;

    @JsonProperty("routine_id")
    private Long routineId;

    @JsonProperty("created_at")
    private LocalDateTime createdAt;
}
