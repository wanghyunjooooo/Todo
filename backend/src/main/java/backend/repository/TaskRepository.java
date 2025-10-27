package backend.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import backend.entity.Task;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByUser_UserId(Long userId);
    List<Task> findByTaskId(Long taskId);
    List<Task> findByUser_UserIdAndTaskDate(Long userId, LocalDate taskDate);
    List<Task> findByUser_UserIdAndStatus(Long userId, String status);
    
    @Query("SELECT t FROM Task t WHERE t.user.userId = :userId AND t.taskDate BETWEEN :start AND :end")
    List<Task> findTasksInRange(Long userId, LocalDate start, LocalDate end);

    List<Task> findByRoutine_RoutineId(Long routineId);

    List<Task> findByRoutine_RoutineIdAndTaskDateLessThanEqualOrderByTaskDateAsc(Long routineId, LocalDate taskDate);

    @Modifying
    @Query("DELETE FROM Task t WHERE t.routine.routineId = :routineId AND t.taskDate >= :fromDate")
    void deleteByRoutine_RoutineIdAndTaskDateGreaterThanEqual(Long routineId, LocalDate fromDate);
}
