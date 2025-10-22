package backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserDTO {
    private String userEmail;
    private String userPassword;
    private String userName;
}
