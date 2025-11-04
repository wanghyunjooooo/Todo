package backend.controller;

import backend.dto.TaskDTO;
import backend.entity.Task;
import backend.service.TaskService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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

    @GetMapping("/{taskId}")
    public ResponseEntity<List<Task>> getTasksById(@PathVariable Long taskId) {
        return ResponseEntity.ok(taskService.getTasksById(taskId));
    }

    @PostMapping("/{userId}/day")
    public ResponseEntity<List<TaskDTO>> getTasksByDate(@PathVariable Long userId, @RequestBody Map<String, Object> body) {
        String dateStr = body.get("date").toString();
        LocalDate date = LocalDate.parse(dateStr);
        List<Task> tasks = taskService.getTasksByDate(userId, date);
        return ResponseEntity.ok(tasks.stream().map(taskService::convertToDTO).collect(Collectors.toList()));
    }

    @GetMapping("/{userId}/complete")
    public ResponseEntity<List<TaskDTO>> getCompletedTasks(@PathVariable Long userId) {
        List<Task> tasks = taskService.getCompletedTasks(userId);
        List<TaskDTO> dtoList = tasks.stream()
                .map(taskService::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtoList);
    }

    @GetMapping("/{userId}/incomplete")
    public ResponseEntity<List<TaskDTO>> getIncompleteTasks(@PathVariable Long userId) {
        List<Task> tasks = taskService.getIncompleteTasks(userId);
        List<TaskDTO> dtoList = tasks.stream()
                .map(taskService::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtoList);
    }

    @PutMapping("/{taskId}")
    public ResponseEntity<?> updateTask(@PathVariable Long taskId, @RequestBody TaskDTO dto) {
        try {
            Task updated = taskService.updateTask(taskId, dto);
            TaskDTO response = taskService.convertToDTO(updated);
            return ResponseEntity.ok(Map.of("message", "수정 완료", "task", response));
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

    @PatchMapping("/{taskId}/status")
    public ResponseEntity<?> changeStatus(@PathVariable Long taskId, @RequestBody Map<String, String> body) {
        try {
            String newStatus = body.get("status");
            Task updated = taskService.toggleStatus(taskId, newStatus);
            return ResponseEntity.ok(Map.of("message", "상태가 변경되었습니다.", "task", updated));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/stats/weekly/{userId}")
    public ResponseEntity<?> getWeeklyStats(@PathVariable Long userId, @RequestBody Map<String, String> body) {
        LocalDate startDate = LocalDate.parse(body.get("start_date"));
        LocalDate endDate = LocalDate.parse(body.get("end_date"));
        return ResponseEntity.ok(taskService.getWeeklyStats(userId, startDate, endDate));
    }

    @PostMapping("/stats/monthly/{userId}")
    public ResponseEntity<?> getMonthlyStats(@PathVariable Long userId, @RequestBody Map<String, String> body) {
        LocalDate startDate = LocalDate.parse(body.get("start_date"));
        LocalDate endDate = LocalDate.parse(body.get("end_date"));
        return ResponseEntity.ok(taskService.getMonthlyStats(userId, startDate, endDate));
    }

    @PostMapping("/{userId}/month")
    public ResponseEntity<List<TaskDTO>> getTasksInMonth(@PathVariable Long userId, @RequestBody Map<String, String> body) {
        LocalDate startDate = LocalDate.parse(body.get("start_date"));
        LocalDate endDate = LocalDate.parse(body.get("end_date"));
        List<Task> tasks = taskService.getTasksInRange(userId, startDate, endDate);
        List<TaskDTO> dtoList = tasks.stream()
                .map(taskService::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtoList);
    }
}
