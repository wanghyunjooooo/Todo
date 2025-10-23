package backend.repository;

import backend.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByUser_UserId(Long userId);
    List<Task> findByUser_UserIdAndTaskDate(Long userId, LocalDate taskDate);
    List<Task> findByUser_UserIdAndStatus(Long userId, String status);
    
    @Query("SELECT t FROM Task t WHERE t.user.userId = :userId AND t.taskDate BETWEEN :start AND :end")
    List<Task> findTasksInRange(Long userId, LocalDate start, LocalDate end);
}
