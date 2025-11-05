package backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Entity
@Table(name = "\"Task\"")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty("task_id")
    private Long taskId;

    @Column(nullable = false, length = 100)
    @JsonProperty("task_name")
    private String taskName;

    @Column(nullable = false, length = 10)
    private String status = "미완료";

    @Column(columnDefinition = "TEXT")
    private String memo;

    @Column(nullable = false)
    @JsonProperty("task_date")
    private LocalDate taskDate;
    
    @Column(length = 20)
    @JsonProperty("routine_type")
    private String routineType = "반복없음";

    @Column(nullable = false, length = 10)
    @JsonProperty("notification_type")
    private String notificationType = "미알림";

    @JsonProperty("notification_time")
    private LocalTime notificationTime;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    @JsonProperty("category")
    private Category category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "routine_id")
    @JsonIgnore
    private Routine routine;

    @CreationTimestamp
    @JsonProperty("created_at")
    private LocalDateTime createdAt;

    @JsonIgnore
    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Notification> notifications;
}