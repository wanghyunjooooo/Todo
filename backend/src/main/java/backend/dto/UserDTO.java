package backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {

    @JsonProperty("user_id")
    private Long userId;

    @JsonProperty("name")
    private String Name;

    @JsonProperty("email")
    private String Email;

    @JsonProperty("password")
    private String Password;

    @JsonProperty("created_at")
    private LocalDateTime createdAt;
}