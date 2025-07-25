package de.bitgilde.TIMAAT.task.execution;

import de.bitgilde.TIMAAT.task.api.MediumAudioAnalysisTask;
import de.bitgilde.TIMAAT.task.exception.TaskExecutionException;

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
 * This {@link TaskExecutor} is responsible to execute the medium audio analysis
 *
 * @author Nico Kotlenga
 * @since 20.07.25
 */
public class MediumAudioAnalysisTaskExecutor extends TaskExecutor<MediumAudioAnalysisTask> {

    private static final Logger logger = Logger.getLogger(MediumAudioAnalysisTaskExecutor.class.getName());

    public MediumAudioAnalysisTaskExecutor(MediumAudioAnalysisTask task) {
        super(task);
    }

    @Override
    public void execute() throws TaskExecutionException {
        logger.log(Level.INFO, "Executing medium audio analysis task for medium having id {}", this.task.getMediumId());
    }
}
