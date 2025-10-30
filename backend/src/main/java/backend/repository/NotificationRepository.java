package backend.repository;

import backend.entity.Notification;
import jakarta.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
    List<Notification> findByUser_UserId(Long userId);

    @Modifying
    @Transactional
    void deleteByTask_TaskId(Long taskId);

    @Query("""
        SELECT n FROM Notification n JOIN FETCH n.task t JOIN FETCH t.category c WHERE n.user.userId = :userId ORDER BY n.createdAt DESC """)
    List<Notification> findAllByUserWithTask(@Param("userId") Long userId);

    @Query("""
        SELECT n FROM Notification n JOIN FETCH n.task t JOIN FETCH t.category c WHERE n.user.userId = :userId AND n.notificationId = :notificationId """)
    Optional<Notification> findByUserIdAndNotificationId(@Param("userId") Long userId, @Param("notificationId") Long notificationId);
}