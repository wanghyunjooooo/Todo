package backend.scheduler;

import backend.entity.Task;
import org.quartz.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.Date;

@Service
public class NotificationSchedulerService {

    private final Scheduler scheduler;

    @Autowired
    public NotificationSchedulerService(Scheduler scheduler) {
        this.scheduler = scheduler;
    }

    public void scheduleNotification(Task task) {
        try {
            if (task.getNotificationTime() == null || !"알림".equals(task.getNotificationType())) {
                return;
            }

            cancelNotification(task.getTaskId());

            LocalDate taskDate = task.getTaskDate();
            LocalTime notiTime = task.getNotificationTime();
            LocalDateTime triggerDateTime = LocalDateTime.of(taskDate, notiTime);

            if (triggerDateTime.isBefore(LocalDateTime.now())) {
                System.out.println("알림 등록 실패(과거): " + triggerDateTime);
                return;
            }

            JobDetail jobDetail = JobBuilder.newJob(NotificationJob.class)
                    .withIdentity("task_" + task.getTaskId(), "notifications")
                    .usingJobData("taskId", task.getTaskId())
                    .build();

            Trigger trigger = TriggerBuilder.newTrigger()
                    .withIdentity("trigger_" + task.getTaskId(), "notifications")
                    .startAt(Date.from(triggerDateTime.atZone(ZoneId.systemDefault()).toInstant()))
                    .withSchedule(SimpleScheduleBuilder.simpleSchedule()
                            .withMisfireHandlingInstructionFireNow())
                    .build();

            scheduler.scheduleJob(jobDetail, trigger);
            System.out.println("알림 등록 Task ID: " + task.getTaskId() + " / " + triggerDateTime);

        } catch (SchedulerException e) {
            e.printStackTrace();
            System.err.println("알림 등록 실패: " + e.getMessage());
        }
    }

    public void cancelNotification(Long taskId) {
        try {
            JobKey jobKey = new JobKey("task_" + taskId, "notifications");
            if (scheduler.checkExists(jobKey)) {
                scheduler.deleteJob(jobKey);
                System.out.println("알림 삭제 Task ID: " + taskId);
            }
        } catch (SchedulerException e) {
            e.printStackTrace();
            System.err.println("알림 삭제 실패: " + e.getMessage());
        }
    }
}
