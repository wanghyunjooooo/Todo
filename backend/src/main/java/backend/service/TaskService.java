package backend.service;

import backend.dto.TaskDTO;
import backend.entity.Category;
import backend.entity.Task;
import backend.entity.User;
import backend.repository.CategoryRepository;
import backend.repository.TaskRepository;
import backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;

    public TaskService(TaskRepository taskRepository, UserRepository userRepository, CategoryRepository categoryRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
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

    public List<Task> getTasksByDate(Long userId, LocalDate date) {
        return taskRepository.findByUser_UserIdAndTaskDate(userId, date);
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

        return taskRepository.save(task);
    }

    public void deleteTask(Long taskId) {
        if (!taskRepository.existsById(taskId)) {
            throw new IllegalArgumentException("삭제할 할 일을 찾을 수 없습니다.");
        }
        taskRepository.deleteById(taskId);
    }
}
