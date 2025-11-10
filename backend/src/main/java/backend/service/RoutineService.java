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

    public RoutineService(RoutineRepository routineRepository, TaskRepository taskRepository, UserRepository userRepository) {
        this.routineRepository = routineRepository;
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Routine createRoutine(RoutineDTO dto, Task baseTask) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

        Routine routine = Routine.builder()
            .routineType(dto.getRoutineType())
            .startDate(dto.getStartDate())
            .endDate(dto.getEndDate())
            .user(user)
            .build();

        Routine savedRoutine = routineRepository.saveAndFlush(routine);

        baseTask.setRoutine(savedRoutine);
        baseTask.setRoutineType(dto.getRoutineType());
        taskRepository.save(baseTask);

        List<Task> repeatedTasks = generateRoutineTasks(savedRoutine, baseTask, dto.getStartDate());
        taskRepository.saveAll(repeatedTasks);

        return savedRoutine;
    }

    @Transactional
    public Routine updateRoutine(Long routineId, RoutineDTO dto) {
        Routine routine = routineRepository.findById(routineId)
                .orElseThrow(() -> new IllegalArgumentException("해당 루틴을 찾을 수 없습니다."));

        LocalDate changeDate = (dto.getStartDate() != null) ? dto.getStartDate() : LocalDate.now();

        Task baseTask = taskRepository.findFirstByRoutine_RoutineIdOrderByTaskDateAsc(routineId)
                .orElseThrow(() -> new IllegalArgumentException("기준 Task를 찾을 수 없습니다."));

        if (dto.getRoutineType() != null) {
            List<Task> todays = taskRepository.findByRoutineIdAndExactDate(routineId, changeDate);
            for (Task t : todays) t.setRoutineType(dto.getRoutineType());
            if (!todays.isEmpty()) taskRepository.saveAll(todays);
        }

        if ("반복없음".equals(dto.getRoutineType())) {
            taskRepository.deleteFutureTasks(routineId, changeDate);

            List<Task> remainTasks = taskRepository.findByRoutine_RoutineId(routineId);
            for (Task t : remainTasks) {
                t.setRoutine(null);
                t.setRoutineType("반복없음");
            }
            taskRepository.saveAll(remainTasks);

            routineRepository.delete(routine);
            return routine;
        }


        if (dto.getRoutineType() != null) routine.setRoutineType(dto.getRoutineType());
        routine.setStartDate(changeDate);
        if (dto.getEndDate() != null) routine.setEndDate(dto.getEndDate());
        routineRepository.save(routine);

        taskRepository.deleteFutureTasks(routineId, changeDate);
        List<Task> newTasks = generateRoutineTasks(routine, baseTask, changeDate);
        taskRepository.saveAll(newTasks);

        return routine;
    }

    @Transactional
    public void deleteRoutine(Long routineId) {
        Routine routine = routineRepository.findById(routineId)
                .orElseThrow(() -> new IllegalArgumentException("루틴을 찾을 수 없습니다."));
        routineRepository.delete(routine);
    }

    private List<Task> generateRoutineTasks(Routine routine, Task baseTask, LocalDate baseTaskDateInclusive) {
        List<Task> list = new ArrayList<>();
        LocalDate end = routine.getEndDate();

        LocalDate next = stepNext(baseTaskDateInclusive, routine.getRoutineType());

        while (next != null && !next.isAfter(end)) {
            Task t = Task.builder()
                    .taskName(baseTask.getTaskName())
                    .status("미완료")
                    .memo(null)
                    .taskDate(next)
                    .notificationType(baseTask.getNotificationType())
                    .notificationTime(baseTask.getNotificationTime())
                    .user(baseTask.getUser())
                    .category(baseTask.getCategory())
                    .routine(routine)
                    .routineType(routine.getRoutineType())
                    .build();
            list.add(t);


            next = stepNext(next, routine.getRoutineType());
        }
        return list;
    }

    private LocalDate stepNext(LocalDate current, String routineType) {
        return switch (routineType) {
            case "매일" -> current.plusDays(1);
            case "매주" -> current.plusWeeks(1);
            case "매달" -> current.plusMonths(1);
            case "반복없음" -> null;
            default -> throw new IllegalArgumentException("잘못된 반복 타입: " + routineType);
        };
    }
}
