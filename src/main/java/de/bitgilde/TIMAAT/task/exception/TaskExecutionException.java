package de.bitgilde.TIMAAT.task.exception;


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
 * This exception will be thrown when an error occurred during {@link de.bitgilde.TIMAAT.task.api.Task}
 * execution.
 *
 * @author Nico Kotlenga
 * @since 18.07.25
 */
public class TaskExecutionException extends Exception {
    public TaskExecutionException(String message, Throwable cause) {
        super(message, cause);
    }

    public TaskExecutionException(Throwable cause) {
        super(cause);
    }

    public TaskExecutionException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }

    public TaskExecutionException() {
    }

    public TaskExecutionException(String message) {
        super(message);
    }
}
