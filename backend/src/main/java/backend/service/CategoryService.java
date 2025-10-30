package backend.service;

import backend.dto.CategoryDTO;
import backend.entity.Category;
import backend.entity.User;
import backend.repository.CategoryRepository;
import backend.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public Category createCategory(CategoryDTO dto) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

        List<Category> existingCategories = categoryRepository.findByUser_UserId(user.getUserId());
        for (Category c : existingCategories) {
            if (c.getCategoryName().equalsIgnoreCase(dto.getCategoryName().trim())) {
                return c;
            }
        }

        Category category = new Category();
        category.setCategoryName(dto.getCategoryName().trim());
        category.setUser(user);

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

        if (dto.getCategoryName() != null && !dto.getCategoryName().isBlank()) {
            category.setCategoryName(dto.getCategoryName());
        }

        return categoryRepository.save(category);
    }

    @Transactional
    public void deleteCategory(Long userId, Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("해당 카테고리를 찾을 수 없습니다."));

        if (!category.getUser().getUserId().equals(userId)) {
            throw new IllegalArgumentException("해당 사용자의 카테고리가 아닙니다.");
        }

        categoryRepository.delete(category);
    }

    @Transactional
    public void deleteEmptyCategories(Long userId) {
        List<Category> categories = categoryRepository.findByUser_UserId(userId);
        for (Category category : categories) {
            if (category.getTasks() == null || category.getTasks().isEmpty()) {
                categoryRepository.delete(category);
            }
        }
    }
}
