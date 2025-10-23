package backend.repository;

import backend.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByUser_UserId(Long userId);
    boolean existsByUser_UserIdAndCategoryName(Long userId, String categoryName);
}