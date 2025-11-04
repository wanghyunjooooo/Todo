package backend.controller;

import backend.dto.RoutineDTO;
import backend.entity.Routine;
import backend.entity.Task;
import backend.repository.TaskRepository;
import backend.service.RoutineService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/tasks/routine")
public class RoutineController {

    private final RoutineService routineService;
    private final TaskRepository taskRepository;

    public RoutineController(RoutineService routineService, TaskRepository taskRepository) {
        this.routineService = routineService;
        this.taskRepository = taskRepository;
    }

    @PostMapping("/{taskId}")
    public ResponseEntity<?> createRoutine(
            @PathVariable Long taskId,
            @RequestBody RoutineDTO dto
    ) {
        Task baseTask = taskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("Task를 찾을 수 없습니다."));

        Routine routine = routineService.createRoutine(dto, baseTask);

        return ResponseEntity.ok(Map.of(
                "message", "루틴 생성 완료",
                "routine_id", routine.getRoutineId(),
                "routine_type", routine.getRoutineType(),
                "start_date", routine.getStartDate(),
                "end_date", routine.getEndDate()
        ));
    }


    @PatchMapping("/{routineId}")
    public ResponseEntity<?> updateRoutine(
            @PathVariable Long routineId,
            @RequestBody Map<String, String> body
    ) {
        RoutineDTO dto = new RoutineDTO();
        dto.setRoutineType(body.getOrDefault("routineType", body.get("routine_type")));

        if (body.containsKey("start_date")) {
            dto.setStartDate(LocalDate.parse(body.get("start_date")));
        }
        if (body.containsKey("end_date")) {
            dto.setEndDate(LocalDate.parse(body.get("end_date")));
        }

        Routine updated = routineService.updateRoutine(routineId, dto);
        return ResponseEntity.ok(Map.of("message", "루틴 수정 완료", "routine", updated));
    }

    @DeleteMapping("/{routineId}")
    public ResponseEntity<?> deleteRoutine(@PathVariable Long routineId) {
        routineService.deleteRoutine(routineId);
        return ResponseEntity.ok(Map.of("message", "루틴이 삭제되었습니다."));
    }
}
