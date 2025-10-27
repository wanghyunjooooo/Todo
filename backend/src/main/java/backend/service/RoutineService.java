package backend.service;

import backend.dto.RoutineDTO;
import backend.entity.Routine;
import backend.entity.Task;
import backend.entity.User;
import backend.repository.RoutineRepository;
import backend.repository.TaskRepository;
import backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class RoutineService {

    private final RoutineRepository routineRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final TaskService taskService;

    public RoutineService(RoutineRepository routineRepository, TaskRepository taskRepository, UserRepository userRepository, TaskService taskService) {
        this.routineRepository = routineRepository;
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.taskService = taskService;
    }

    @Transactional
    public Routine createRoutine(RoutineDTO dto, Task baseTask) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

        Routine routine = new Routine();
        routine.setRoutineType(dto.getRoutineType());
        routine.setStartDate(dto.getStartDate());
        routine.setEndDate(dto.getEndDate());
        routine.setUser(user);

        Routine savedRoutine = routineRepository.save(routine);

        baseTask.setRoutine(savedRoutine);
        taskRepository.save(baseTask);

        List<Task> repeatedTasks = generateRoutineTasks(savedRoutine, baseTask);
        taskRepository.saveAll(repeatedTasks);

        return savedRoutine;
    }

    @Transactional
    public Routine updateRoutine(Long routineId, RoutineDTO dto) {
        Routine routine = routineRepository.findById(routineId)
                .orElseThrow(() -> new IllegalArgumentException("루틴을 찾을 수 없습니다."));

        if (dto.getStartDate() != null) routine.setStartDate(dto.getStartDate());
        if (dto.getEndDate() != null) routine.setEndDate(dto.getEndDate());

        routine.setRoutineType(dto.getRoutineType());
        routineRepository.saveAndFlush(routine);

        LocalDate today = LocalDate.now();

        taskRepository.deleteByRoutine_RoutineIdAndTaskDateGreaterThanEqual(routineId, today.plusDays(1));

        if ("반복없음".equals(dto.getRoutineType())) {
            List<Task> tasks = taskRepository.findByRoutine_RoutineId(routineId);
            for (Task t : tasks) {
                t.setRoutine(null);
            }
            taskRepository.saveAll(tasks);

            routineRepository.delete(routine);
            return null;
        }

        List<Task> pastOrToday = taskRepository
                .findByRoutine_RoutineIdAndTaskDateLessThanEqualOrderByTaskDateAsc(routineId, today);

        if (pastOrToday.isEmpty()) {
            throw new IllegalArgumentException("기준 Task를 찾을 수 없습니다.");
        }

        Task baseTask = pastOrToday.get(pastOrToday.size() - 1);

        List<Task> newTasks = generateRoutineTasks(routine, baseTask);
        taskRepository.saveAll(newTasks);

        return routineRepository.save(routine);
    }


    @Transactional
    public void deleteRoutine(Long routineId) {
        Routine routine = routineRepository.findById(routineId)
                .orElseThrow(() -> new IllegalArgumentException("루틴을 찾을 수 없습니다."));

        List<Task> tasks = taskRepository.findAll().stream()
                .filter(t -> t.getRoutine() != null && t.getRoutine().getRoutineId().equals(routineId))
                .toList();

        for (Task t : tasks) {
            t.setRoutine(null);
        }
        taskRepository.saveAll(tasks);

        routineRepository.delete(routine);
    }

    private List<Task> generateRoutineTasks(Routine routine, Task baseTask) {
        List<Task> list = new ArrayList<>();
        LocalDate start = routine.getStartDate();
        LocalDate end = routine.getEndDate();

        LocalDate date = start.plusDays(1);
        LocalDate day = start;

        while (!date.isAfter(end)) {
            Task newTask = new Task();
            newTask.setTaskName(baseTask.getTaskName());
            newTask.setStatus("미완료");
            newTask.setMemo(baseTask.getMemo());
            newTask.setTaskDate(date);
            newTask.setNotificationType(baseTask.getNotificationType());
            newTask.setNotificationTime(baseTask.getNotificationTime());
            newTask.setUser(baseTask.getUser());
            newTask.setCategory(baseTask.getCategory());
            newTask.setRoutine(routine);
            list.add(newTask);

            switch (routine.getRoutineType()) {
                case "매일" -> date = date.plusDays(1);
                case "매주" -> day = day.plusWeeks(1);
                case "매달" -> day = day.plusMonths(1);
                case "반복없음" -> date = end.plusDays(1);
                default -> throw new IllegalArgumentException("잘못된 반복 타입입니다: " + routine.getRoutineType());
            }
        }

        return list;
    }
}
