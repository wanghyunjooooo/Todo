package backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserDTO {
    
    @JsonProperty("user_email")
    private String userEmail;
    
    @JsonProperty("user_password")
    private String userPassword;

    @JsonProperty("user_name")
    private String userName;
}
