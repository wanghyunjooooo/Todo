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

    @PostMapping
    public ResponseEntity<?> createRoutine(@RequestBody RoutineDTO dto, @RequestParam Long taskId) {
        Task baseTask = taskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("Task를 찾을 수 없습니다."));

        Routine routine = routineService.createRoutine(dto, baseTask);
        return ResponseEntity.ok(Map.of("message", "루틴 생성 완료", "routine", routine));
    }

    @PatchMapping("/{routineId}")
    public ResponseEntity<?> updateRoutine(
            @PathVariable Long routineId,
            @RequestParam String newType,
            @RequestParam String today
    ) {
        Routine updated = routineService.updateRoutine(routineId, newType, LocalDate.parse(today));
        return ResponseEntity.ok(Map.of("message", "루틴 수정 완료", "routine", updated));
    }

    @DeleteMapping("/{routineId}")
    public ResponseEntity<?> deleteRoutine(@PathVariable Long routineId) {
        routineService.deleteRoutine(routineId);
        return ResponseEntity.ok(Map.of("message", "루틴이 삭제되었습니다."));
    }
}
