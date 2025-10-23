package backend.controller;

import backend.service.TaskService;

public class TaskController {
    
    private final TaskService taskService;
    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }
    

}