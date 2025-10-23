package backend.service;

import backend.dto.CategoryDTO;
import backend.entity.Category;
import backend.entity.User;
import backend.repository.CategoryRepository;
import backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private UserRepository userRepository;

    public Category createCategory(CategoryDTO dto) {
        Optional<User> userOpt = userRepository.findById(dto.getUserId());
        if (userOpt.isEmpty()) {
            throw new IllegalArgumentException("존재하지 않는 사용자입니다.");
        }

        Category category = new Category();
        category.setCategoryName(dto.getCategoryName());
        category.setUser(userOpt.get());
        category.setCreatedAt(LocalDateTime.now());
        return categoryRepository.save(category);
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }
    
    public List<Category> getCategoryByUserId(Long userId) {
        return categoryRepository.findByUser_UserId(userId);
    }

    public Category getCategoryById(Long userId, Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("해당 ID의 카테고리를 찾을 수 없습니다."));

        if (!category.getUser().getUserId().equals(userId)) {
            throw new IllegalArgumentException("해당 사용자의 카테고리가 아닙니다.");
        }

        return category;
    }

    public Category updateCategory(Long userId, Long categoryId, CategoryDTO dto) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("해당 카테고리를 찾을 수 없습니다."));

        if (!category.getUser().getUserId().equals(userId)) {
            throw new IllegalArgumentException("해당 사용자의 카테고리가 아닙니다.");
        }

        category.setCategoryName(dto.getCategoryName());
        return categoryRepository.save(category);
    }

}
