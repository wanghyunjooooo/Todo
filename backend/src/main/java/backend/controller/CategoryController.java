package backend.controller;

import backend.dto.CategoryDTO;
import backend.entity.Category;
import backend.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/categories")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @PostMapping
    public ResponseEntity<?> createCategory(@RequestBody CategoryDTO dto) {
        try {
            Category category = categoryService.createCategory(dto);

            CategoryDTO response = new CategoryDTO(
                category.getCategoryId(),
                category.getCategoryName(),
                dto.getUserId(),
                category.getCreatedAt(),
                null
            );

            return ResponseEntity.ok(Map.of(
                "message", "카테고리가 생성되었습니다.",
                "category", response
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", "서버 오류가 발생했습니다."));
        }
    }


    @GetMapping
    public ResponseEntity<?> getAllCategories() {
        try {
            List<Category> categories = categoryService.getAllCategories();
            return ResponseEntity.ok(categories);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "카테고리를 불러오지 못했습니다."));
        }
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> getCategoryByUserId(@PathVariable Long userId) {
        try {
            List<Category> categories = categoryService.getCategoryByUserId(userId);
            return ResponseEntity.ok(categories);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{userId}/{categoryId}")
    public ResponseEntity<?> getCategoryByUserAndId(@PathVariable Long userId, @PathVariable Long categoryId) {
        try {
            Category category = categoryService.getCategoryById(userId, categoryId);
            return ResponseEntity.ok(category);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{userId}/{categoryId}")
    public ResponseEntity<?> updateCategory(@PathVariable Long userId, @PathVariable Long categoryId, @RequestBody CategoryDTO dto) {
        try {
            Category updatedCategory = categoryService.updateCategory(userId, categoryId, dto);
            CategoryDTO response = new CategoryDTO(
                updatedCategory.getCategoryId(),
                updatedCategory.getCategoryName(),
                updatedCategory.getUser().getUserId(),
                updatedCategory.getCreatedAt(),
                null
            );
            return ResponseEntity.ok(Map.of(
                "message", "카테고리가 수정되었습니다.",
                "category", response
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "서버 오류가 발생했습니다."));
        }
    }

    @DeleteMapping("/{userId}/{categoryId}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long userId, @PathVariable Long categoryId) {
        try {
            categoryService.deleteCategory(userId, categoryId);
            return ResponseEntity.ok(Map.of(
                "message", "카테고리가 삭제되었습니다.",
                "category_id", categoryId
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "서버 오류가 발생했습니다."));
        }
    }
}
