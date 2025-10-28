package backend.scheduler;

import backend.entity.Notification;
import backend.entity.Task;
import backend.repository.NotificationRepository;
import backend.repository.TaskRepository;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class NotificationJob implements Job {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Override
    public void execute(JobExecutionContext context) {
        Long taskId = context.getMergedJobDataMap().getLong("taskId");
        Task task = taskRepository.findById(taskId).orElse(null);

        if (task == null) return;

        Notification notification = new Notification();
        notification.setTask(task);
        notification.setUser(task.getUser());
        notification.setStatus("안읽음");

        notificationRepository.save(notification);
        System.out.println("알림 생성" + task.getTaskName() + " - " + task.getTaskDate());
    }
}
