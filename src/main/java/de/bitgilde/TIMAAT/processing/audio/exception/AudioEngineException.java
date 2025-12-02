package de.bitgilde.TIMAAT.processing.audio.exception;


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

import de.bitgilde.TIMAAT.processing.audio.FfmpegAudioEngine;

/**
 * This exception will be thrown by the {@link FfmpegAudioEngine}
 *
 * @author Nico Kotlenga
 * @since 25.07.25
 */
public class AudioEngineException extends Exception {
    public AudioEngineException() {
    }

    public AudioEngineException(String message) {
        super(message);
    }

    public AudioEngineException(String message, Throwable cause) {
        super(message, cause);
    }

    public AudioEngineException(Throwable cause) {
        super(cause);
    }

    public AudioEngineException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
