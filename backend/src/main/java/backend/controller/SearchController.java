package backend.controller;

import backend.entity.Task;
import backend.service.SearchService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/search")
public class SearchController {

    private final SearchService searchService;

    public SearchController(SearchService searchService) {
        this.searchService = searchService;
    }

    @GetMapping("/word")
    public ResponseEntity<List<Task>> searchByWord(@RequestParam Long userId, @RequestParam String keyword) {
        List<Task> results = searchService.searchByKeyword(userId, keyword);
        return ResponseEntity.ok(results);
    }
}
