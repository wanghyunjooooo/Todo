package backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "\"User\"")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    @Column(nullable = false, length = 50)
    private String userName;

    @Column(nullable = false, length = 255)
    private String userPassword;

    @Column(nullable = false, unique = true, length = 100)
    private String userEmail;

    @Column(columnDefinition = "TIMESTAMP DEFAULT now()")
    private LocalDateTime createdAt = LocalDateTime.now();
}
