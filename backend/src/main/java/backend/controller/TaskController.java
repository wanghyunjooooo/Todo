package backend.controller;

import backend.dto.TaskDTO;
import backend.entity.Task;
import backend.service.TaskService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/tasks")
public class TaskController {

    private final TaskService taskService;
    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping
    public ResponseEntity<?> createTask(@RequestBody TaskDTO dto) {
        try {
            Task task = taskService.createTask(dto);
            return ResponseEntity.ok(Map.of("message", "할 일이 생성되었습니다.", "task", task));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks() {
        return ResponseEntity.ok(taskService.getAllTasks());
    }

    @GetMapping("/{userId}/day")
    public ResponseEntity<List<Task>> getTasksByDate(
            @PathVariable Long userId,
            @RequestParam("date") String dateStr
    ) {
        LocalDate date = LocalDate.parse(dateStr);
        return ResponseEntity.ok(taskService.getTasksByDate(userId, date));
    }

    @GetMapping("/{userId}/complete")
    public ResponseEntity<List<Task>> getCompletedTasks(@PathVariable Long userId) {
        return ResponseEntity.ok(taskService.getCompletedTasks(userId));
    }

    @GetMapping("/{userId}/incomplete")
    public ResponseEntity<List<Task>> getIncompleteTasks(@PathVariable Long userId) {
        return ResponseEntity.ok(taskService.getIncompleteTasks(userId));
    }

    @PutMapping("/{taskId}")
    public ResponseEntity<?> updateTask(@PathVariable Long taskId, @RequestBody TaskDTO dto) {
        try {
            Task updated = taskService.updateTask(taskId, dto);
            return ResponseEntity.ok(Map.of("message", "수정 완료", "task", updated));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<?> deleteTask(@PathVariable Long taskId) {
        try {
            taskService.deleteTask(taskId);
            return ResponseEntity.ok(Map.of("message", "삭제 완료"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
