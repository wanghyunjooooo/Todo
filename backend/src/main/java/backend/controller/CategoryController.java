package backend.controller;

import backend.dto.CategoryDTO;
import backend.entity.Category;
import backend.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @PostMapping
    public ResponseEntity<?> createCategory(@RequestBody CategoryDTO dto) {
        Category category = categoryService.createCategory(dto);
        CategoryDTO response = new CategoryDTO(
            category.getCategoryId(),
            category.getCategoryName(),
            category.getUser().getUserId(),
            category.getCreatedAt()
        );
        return ResponseEntity.ok(response);
    }


    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories() {
        List<Category> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> getCategoryByUserId(@PathVariable Long userId) {
        List<Category> categories = categoryService.getCategoryByUserId(userId);
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/{userId}/{categoryId}")
    public ResponseEntity<?> getCategoryByUserAndId(
            @PathVariable Long userId,
            @PathVariable Long categoryId
    ) {
        try {
            Category category = categoryService.getCategoryById(userId, categoryId);
            return ResponseEntity.ok(category);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{userId}/{categoryId}")
    public ResponseEntity<?> updateCategory(
            @PathVariable Long userId,
            @PathVariable Long categoryId,
            @RequestBody CategoryDTO dto
    ) {
        try {
            Category updatedCategory = categoryService.updateCategory(userId, categoryId, dto);
            return ResponseEntity.ok(updatedCategory);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
