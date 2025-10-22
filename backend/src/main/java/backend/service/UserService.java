package backend.service;

import backend.dto.UserDTO;
import backend.entity.User;
import backend.repository.UserRepository;
import backend.security.JWToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final JWToken jwtoken;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UserService(UserRepository userRepository, JWToken jwtoken) {
        this.userRepository = userRepository;
        this.jwtoken = jwtoken;
    }

    public User signup(UserDTO dto) {
        if (userRepository.findByUserEmail(dto.getUserEmail()).isPresent()) {
            throw new IllegalArgumentException("이미 존재하는 이메일입니다.");
        }

        User user = new User();
        user.setUserEmail(dto.getUserEmail());
        user.setUserName(dto.getUserName());
        user.setUserPassword(passwordEncoder.encode(dto.getUserPassword()));

        return userRepository.save(user);
    }
}
