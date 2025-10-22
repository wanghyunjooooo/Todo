package backend.controller;

import backend.dto.UserDTO;
import backend.entity.User;
import backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody UserDTO dto) {
        try {
            User newUser = userService.signup(dto);
            return ResponseEntity.ok(Map.of("message", "회원가입 성공", "user", newUser));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
