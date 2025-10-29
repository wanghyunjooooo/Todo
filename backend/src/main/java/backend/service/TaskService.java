package backend.service;

import backend.dto.TaskDTO;
import backend.entity.Category;
import backend.entity.Task;
import backend.entity.User;
import backend.repository.CategoryRepository;
import backend.repository.TaskRepository;
import backend.repository.UserRepository;
import backend.scheduler.NotificationSchedulerService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final NotificationSchedulerService notificationSchedulerService;

    public TaskService(TaskRepository taskRepository, UserRepository userRepository, CategoryRepository categoryRepository, NotificationSchedulerService notificationSchedulerService) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.notificationSchedulerService = notificationSchedulerService;
    }

    public Task createTask(TaskDTO dto) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));
        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 카테고리입니다."));

        Task task = new Task();
        task.setTaskName(dto.getTaskName());
        task.setStatus(dto.getStatus() != null ? dto.getStatus() : "미완료");
        task.setMemo(dto.getMemo());
        task.setTaskDate(dto.getTaskDate());
        task.setNotificationType(dto.getNotificationType() != null ? dto.getNotificationType() : "미알림");
        task.setNotificationTime(dto.getNotificationTime());
        task.setUser(user);
        task.setCategory(category);

        return taskRepository.save(task);
    }

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public List<Task> getTasksById(Long taskId) {
        return taskRepository.findByTaskId(taskId);
    }

    public List<Task> getTasksByDate(Long userId, LocalDate date) {
        return taskRepository.findTasksByUserAndDateWithCategory(userId, date);
    }

    public List<Task> getCompletedTasks(Long userId) {
        return taskRepository.findByUser_UserIdAndStatus(userId, "완료");
    }

    public List<Task> getIncompleteTasks(Long userId) {
        return taskRepository.findByUser_UserIdAndStatus(userId, "미완료");
    }

    public Task updateTask(Long taskId, TaskDTO dto) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("해당 할 일을 찾을 수 없습니다."));

        if (dto.getTaskName() != null) task.setTaskName(dto.getTaskName());
        if (dto.getMemo() != null) task.setMemo(dto.getMemo());
        if (dto.getTaskDate() != null) task.setTaskDate(dto.getTaskDate());
        if (dto.getStatus() != null) task.setStatus(dto.getStatus());
        if (dto.getNotificationType() != null) task.setNotificationType(dto.getNotificationType());
        if (dto.getNotificationTime() != null) task.setNotificationTime(dto.getNotificationTime());

        if (dto.getCategoryId() != null) {
            Category category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new IllegalArgumentException("해당 카테고리를 찾을 수 없습니다."));
            task.setCategory(category);
        }

        Task updated = taskRepository.save(task);

        notificationSchedulerService.cancelNotification(updated.getTaskId());

        if ("알림".equals(updated.getNotificationType()) && updated.getNotificationTime() != null) {
            notificationSchedulerService.scheduleNotification(updated);
        }

        return updated;
    }

    public void deleteTask(Long taskId) {
        if (!taskRepository.existsById(taskId)) {
            throw new IllegalArgumentException("삭제할 할 일을 찾을 수 없습니다.");
        }
        notificationSchedulerService.cancelNotification(taskId);
        taskRepository.deleteById(taskId);
    }

    public Task toggleStatus(Long taskId, String newStatus) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("해당 할 일을 찾을 수 없습니다."));
        task.setStatus(newStatus);
        return taskRepository.save(task);
    }

    public Map<String, Object> getWeeklyStats(Long userId, LocalDate start, LocalDate end) {
        List<Task> tasks = taskRepository.findTasksInRange(userId, start, end);
        Map<String, Object> result = buildStatsResponse(userId, start, end, tasks);

        String[] days = {"일", "월", "화", "수", "목", "금", "토"};
        Map<String, Double> weeklyRates = new LinkedHashMap<>();

        for (String day : days) {
            weeklyRates.put(day, 0.0);
        }

        // ✅ 요일별 완료율 계산
        for (int i = 0; i < days.length; i++) {
            int dayIndex = i == 0 ? 7 : i; // 일요일=7 (LocalDate 기준)
            List<Task> dailyTasks = tasks.stream()
                    .filter(t -> t.getTaskDate().getDayOfWeek().getValue() == dayIndex)
                    .collect(Collectors.toList());

            long total = dailyTasks.size();
            long completed = dailyTasks.stream()
                    .filter(t -> "완료".equals(t.getStatus()))
                    .count();

            double rate = total == 0 ? 0.0 : ((double) completed / total) * 100.0;
            weeklyRates.put(days[i], Math.round(rate * 10.0) / 10.0); // 소수점 1자리 반올림
        }

        List<Map<String, Object>> weeklyData = weeklyRates.entrySet().stream()
                .map(e -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("day", e.getKey());
                    map.put("rate", e.getValue());
                    return map;
                })
                .collect(Collectors.toList());

        result.put("weekly_data", weeklyData);
        return result;
    }

    public Map<String, Object> getMonthlyStats(Long userId, LocalDate start, LocalDate end) {
        List<Task> tasks = taskRepository.findTasksInRange(userId, start, end);
        Map<String, Object> result = buildStatsResponse(userId, start, end, tasks);

        Map<LocalDate, Double> dailyRates = new LinkedHashMap<>();
        LocalDate tempDate = start;

        while (!tempDate.isAfter(end)) {
            // ✅ 하루치만 직접 계산 (람다 안에서 tempDate를 수정하지 않음)
            final LocalDate currentDate = tempDate;

            List<Task> dailyTasks = tasks.stream()
                    .filter(t -> t.getTaskDate().equals(currentDate))
                    .collect(Collectors.toList());

            long total = dailyTasks.size();
            long completed = dailyTasks.stream()
                    .filter(t -> "완료".equals(t.getStatus()))
                    .count();

            double rate = total == 0 ? 0.0 : ((double) completed / total) * 100.0;
            dailyRates.put(currentDate, Math.round(rate * 10.0) / 10.0);

            tempDate = tempDate.plusDays(1); // ✅ 스트림 외부에서 안전하게 증가
        }

        List<Map<String, Object>> dailyData = dailyRates.entrySet().stream()
                .map(e -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("date", e.getKey().toString());
                    map.put("rate", e.getValue());
                    return map;
                })
                .collect(Collectors.toList());

        result.put("daily_data", dailyData);
        return result;
    }

    public List<Task> getTasksInRange(Long userId, LocalDate start, LocalDate end) {
        return taskRepository.findTasksInRange(userId, start, end);
    }

    public Map<String, Object> getRangeStats(Long userId, LocalDate start, LocalDate end) {
        List<Task> tasks = taskRepository.findTasksInRange(userId, start, end);
        return buildStatsResponse(userId, start, end, tasks);
    }

    private Map<String, Object> buildStatsResponse(Long userId, LocalDate start, LocalDate end, List<Task> tasks) {
        Map<String, Object> result = new HashMap<>();

        long completed = tasks.stream().filter(t -> "완료".equals(t.getStatus())).count();
        long incomplete = tasks.stream().filter(t -> !"완료".equals(t.getStatus())).count();
        double rate = tasks.isEmpty() ? 0.0 : Math.round(((double) completed / tasks.size()) * 1000.0) / 10.0;

        List<Map<String, Object>> categoryStats = tasks.stream()
                .collect(Collectors.groupingBy(t -> t.getCategory().getCategoryName(), Collectors.counting()))
                .entrySet().stream()
                .map(e -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("category_name", e.getKey());
                    map.put("count", e.getValue());
                    return map;
                })
                .collect(Collectors.toList());

        result.put("user_id", userId);
        result.put("start_date", start);
        result.put("end_date", end);
        result.put("summary", Map.of(
                "total_tasks", tasks.size(),
                "completed", completed,
                "incomplete", incomplete,
                "completion_rate", rate
        ));
        result.put("categories", categoryStats);

        return result;
    }
}