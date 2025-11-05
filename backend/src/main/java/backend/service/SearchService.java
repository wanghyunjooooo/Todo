package backend.service;

import backend.entity.Task;
import backend.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class SearchService {

    private final TaskRepository taskRepository;

    public SearchService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public List<Task> searchByKeyword(Long userId, String keyword) {
        return taskRepository.searchTasksByKeyword(userId, keyword);
    }
}
