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

    @GetMapping("/date")
    public ResponseEntity<List<Task>> searchByDate(@RequestParam Long userId, @RequestParam String date) {
        LocalDate localDate = LocalDate.parse(date);
        List<Task> results = searchService.searchByDate(userId, localDate);
        return ResponseEntity.ok(results);
    }
}
