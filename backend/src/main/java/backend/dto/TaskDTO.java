package backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TaskDTO {

    @JsonProperty("task_id")
    private Long taskId;

    @JsonProperty("task_name")
    private String taskName;

    private String status;
    private String memo;

    @JsonProperty("task_date")
    private LocalDate taskDate;
    
    @JsonProperty("routine_type")
    private String routineType;

    @JsonProperty("notification_type")
    private String notificationType;

    @JsonProperty("notification_time")
    private LocalTime notificationTime;

    @JsonProperty("user_id")
    private Long userId;

    @JsonProperty("category_id")
    private Long categoryId;

    @JsonProperty("category_name")
    private String categoryName;

    @JsonProperty("routine_id")
    private Long routineId;

    @JsonProperty("created_at")
    private LocalDateTime createdAt;
}
