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
public class RoutineDTO {

    @JsonProperty("routine_id")
    private Long routineId;

    @JsonProperty("routine_type")
    private String routineType;

    @JsonProperty("start_date")
    private LocalDate startDate;

    @JsonProperty("end_date")
    private LocalDate endDate;

    @JsonProperty("user_id")
    private Long userId;

    @JsonProperty("task_template_id")
    private Long taskTemplateId;

    @JsonProperty("created_at")
    private LocalDateTime createdAt;
}
