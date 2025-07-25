package de.bitgilde.TIMAAT.task.execution;

import de.bitgilde.TIMAAT.task.api.Task;
import de.bitgilde.TIMAAT.task.api.TaskState;
import de.bitgilde.TIMAAT.task.storage.TaskStateUpdater;

import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.logging.Level;
import java.util.logging.Logger;

/*
 Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
 */

/**
 * This service is responsible to execute async tasks. These tasks are performing actions
 * which could have a longer execution time. So performing these during handling a http-request could result
 * in to long waiting times.
 * <br/>
 * One example are audio file analysis tasks which are extracting audio file meta information as well as waveform
 * and frequency information. For further information see <a href="https://github.com/NKO97/TIMAAT/issues/3">TIMAAT Weiterentwicklung #3</a>
 * <br/>
 * The {@link TaskExecutorService} is creating an {@link ExecutorService} in which the
 * async tasks are executed in. The maximum amount of parallel tasks are configurable inside the configuration file.
 *
 * @author Nico Kotlenga
 * @since 18.07.25
 */
public class TaskExecutorService {

    private static final Logger logger = Logger.getLogger(TaskExecutorService.class.getName());
    private static final AtomicInteger THREAD_COUNTER = new AtomicInteger(0);

    private final ThreadPoolExecutor executor;
    private final TaskStateUpdater taskStateUpdater;
    private final TaskExecutorFactory taskExecutorFactory;


    public TaskExecutorService(int coreParallelTask, int maxParallelTask, int maximumQueueSize, TaskStateUpdater taskStateUpdater, TaskExecutorFactory taskExecutorFactory) {
        logger.log(Level.INFO, "Initializing task executor service with {0} parallel worker threads and a queue size of {1}", new Object[]{maxParallelTask, maximumQueueSize});
        this.taskStateUpdater = taskStateUpdater;
        this.taskExecutorFactory = taskExecutorFactory;
        executor = new ThreadPoolExecutor(coreParallelTask, maxParallelTask, 60L, TimeUnit.SECONDS, new ArrayBlockingQueue<>(maximumQueueSize), runnable -> {
            Thread thread = new Thread(runnable);
            thread.setDaemon(true);
            thread.setName("task-executor-thread[" + THREAD_COUNTER.getAndIncrement() + "]");

            return thread;
        });
    }

    /**
     * Add task for execution
     *
     * @param task which will be added to queue
     */
    public void executeTask(Task task) {
        logger.log(Level.FINE, "Adding task of type {0} to queue", task.getTaskType());
        TaskExecutor<?> taskExecutor = taskExecutorFactory.createTaskExecutor(task);
        executor.execute(new TaskExecutorRunnable(task, taskStateUpdater, taskExecutor));
    }

    public void shutdown() {
        logger.log(Level.INFO, "Shutting down task executor service");
        executor.shutdown();
    }

    private static class TaskExecutorRunnable implements Runnable {
        private static final Logger logger = Logger.getLogger(TaskExecutorService.class.getName());

        private final Task task;
        private final TaskStateUpdater taskStateUpdater;
        private final TaskExecutor<?> taskExecutor;

        public TaskExecutorRunnable(Task task, TaskStateUpdater taskStateUpdater, TaskExecutor<?> taskExecutor) {
            this.task = task;
            this.taskStateUpdater = taskStateUpdater;
            this.taskExecutor = taskExecutor;
        }

        @Override
        public void run() {
            logger.log(Level.FINE, "Start executing task of type {0}", task.getTaskType());
            try {
                taskStateUpdater.updateTaskState(task, TaskState.RUNNING);
                taskExecutor.execute();
                taskStateUpdater.updateTaskState(task, TaskState.DONE);
            } catch (Exception ex) {
                logger.log(Level.SEVERE, "Error while executing task of type {0}", new Object[]{task.getTaskType(), ex});
                taskStateUpdater.updateTaskState(task, TaskState.FAILED);
            }
        }
    }
}
