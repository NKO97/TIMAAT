package de.bitgilde.TIMAAT.task.execution;

import de.bitgilde.TIMAAT.task.api.MediumAudioAnalysisTask;
import de.bitgilde.TIMAAT.task.api.Task;
import de.bitgilde.TIMAAT.task.api.TaskType;

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
 * This factory is responsible to create {@link TaskExecutor} for the passed {@link de.bitgilde.TIMAAT.task.api.Task}
 *
 * @author Nico Kotlenga
 * @since 20.07.25
 */
public class TaskExecutorFactory {

    @SuppressWarnings("unchecked")
    public <T extends Task> TaskExecutor<T> createTaskExecutor(T task) {
        if (TaskType.MEDIUM_AUDIO_ANALYSIS.equals(task.getTaskType())) {
            return (TaskExecutor<T>) new MediumAudioAnalysisTaskExecutor((MediumAudioAnalysisTask) task);
        }
        return null;
    }
}
