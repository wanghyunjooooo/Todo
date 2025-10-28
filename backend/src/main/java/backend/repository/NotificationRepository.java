package backend.repository;

import backend.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
    List<Notification> findByUser_UserId(Long userId);
    
    @Query("""
        SELECT n FROM Notification n JOIN FETCH n.task t JOIN FETCH t.category c WHERE n.user.userId = :userId ORDER BY n.createdAt DESC """)
    List<Notification> findAllByUserWithTask(@Param("userId") Long userId);
}