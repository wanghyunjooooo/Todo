package backend.service;

import backend.dto.TaskDTO;
import backend.entity.Category;
import backend.entity.Task;
import backend.entity.User;
import backend.repository.CategoryRepository;
import backend.repository.TaskRepository;
import backend.repository.UserRepository;
import org.springframework.stereotype.Service;

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
}
