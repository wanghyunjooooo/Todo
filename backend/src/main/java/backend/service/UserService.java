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

    public String login(UserDTO dto) {
        Optional<User> optionalUser = userRepository.findByUserEmail(dto.getUserEmail());
        if (optionalUser.isEmpty()) throw new IllegalArgumentException("존재하지 않는 사용자입니다.");

        User user = optionalUser.get();
        if (!passwordEncoder.matches(dto.getUserPassword(), user.getUserPassword())) {
            throw new IllegalArgumentException("비밀번호가 올바르지 않습니다.");
        }

        return jwtoken.createToken(user.getUserId(), user.getUserName());
    }

    public User getProfile(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
    }

    public User updateProfile(Long userId, UserDTO dto) {
        User user = getProfile(userId);
        if (dto.getUserName() != null) user.setUserName(dto.getUserName());
        if (dto.getUserPassword() != null)
            user.setUserPassword(passwordEncoder.encode(dto.getUserPassword()));
        return userRepository.save(user);
    }
}
