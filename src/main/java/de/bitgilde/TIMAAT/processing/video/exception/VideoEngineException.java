package de.bitgilde.TIMAAT.processing.video.exception;

/**
 * This exception will be thrown when an error occurred during using the {@link de.bitgilde.TIMAAT.processing.video.FfmpegVideoEngine}
 *
 * @author Nico Kotlenga
 * @since 30.10.25
 */
public class VideoEngineException extends Exception{

  public VideoEngineException() {
  }

  public VideoEngineException(String message) {
    super(message);
  }

  public VideoEngineException(String message, Throwable cause) {
    super(message, cause);
  }

  public VideoEngineException(Throwable cause) {
    super(cause);
  }

  public VideoEngineException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
    super(message, cause, enableSuppression, writableStackTrace);
  }
}
