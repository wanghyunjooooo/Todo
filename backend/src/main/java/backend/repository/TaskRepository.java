package backend.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import backend.entity.Task;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByUser_UserId(Long userId);
    List<Task> findByTaskId(Long taskId);
    List<Task> findByUser_UserIdAndTaskDate(Long userId, LocalDate taskDate);
    List<Task> findByUser_UserIdAndStatus(Long userId, String status);

    @Query("SELECT t FROM Task t WHERE t.user.userId = :userId AND t.taskDate BETWEEN :start AND :end")
    List<Task> findTasksInRange(@Param("userId") Long userId, @Param("start") LocalDate start, @Param("end") LocalDate end);

    List<Task> findByRoutine_RoutineId(Long routineId);

    List<Task> findByRoutine_RoutineIdAndTaskDateLessThanEqualOrderByTaskDateAsc(Long routineId, LocalDate taskDate);

    Optional<Task> findFirstByRoutine_RoutineIdOrderByTaskDateAsc(Long routineId);

    @Modifying
    @Transactional
    @Query("DELETE FROM Task t WHERE t.routine.routineId = :routineId AND t.taskDate > :targetDate")
    void deleteFutureTasks(@Param("routineId") Long routineId, @Param("targetDate") LocalDate targetDate);

    @Query("SELECT t FROM Task t WHERE t.routine.routineId = :routineId AND t.taskDate = :taskDate")
    List<Task> findByRoutineIdAndExactDate(@Param("routineId") Long routineId, @Param("taskDate") LocalDate taskDate);
}