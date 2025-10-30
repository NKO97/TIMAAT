package de.bitgilde.TIMAAT.processing.video;

import de.bitgilde.TIMAAT.PropertyConstants;
import de.bitgilde.TIMAAT.PropertyManagement;
import de.bitgilde.TIMAAT.processing.ExternalProcessExecutor;
import de.bitgilde.TIMAAT.processing.video.exception.VideoEngineException;
import jakarta.inject.Inject;

import java.nio.file.Path;
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
 * This component gives access to video capabilities of ffmpeg
 *
 * @author Nico Kotlenga
 * @since 23.10.25
 */
public final class FfmpegVideoEngine extends ExternalProcessExecutor {

  private static final Logger logger = Logger.getLogger(FfmpegVideoEngine.class.getName());

  private final Path pathToFfmpeg;


  @Inject
  public FfmpegVideoEngine(PropertyManagement propertyManagement) {
    Path baseFfmpegPath = Path.of(propertyManagement.getProp(PropertyConstants.FFMPEG_LOCATION));
    this.pathToFfmpeg = baseFfmpegPath.resolve("ffmpeg");
  }

  /**
   * This method will extract a frame at the specified position and persist it inside the result path
   * @param videoFile from which the frame will be extracted
   * @param frameResult in which the frame will be persisted in
   * @param frameTimeStampInSeconds defines the position of the frame, which will be extracted
   */
  public void extractFrameOfVideo(Path videoFile, Path frameResult, float frameTimeStampInSeconds) throws VideoEngineException {
    logger.log(Level.FINE, "Extracting frame at {} from video located at {}",
            new Object[]{frameTimeStampInSeconds, videoFile});

    String[] commandLine = {pathToFfmpeg.toString() , "-i", videoFile.toString(), "-ss", String.valueOf(
            frameTimeStampInSeconds), // timecode of thumbnail
            "-vframes", "1", "-y", "-f", "image2", "-vcodec", "png", "-update", "1", frameResult.toString()};

    try{
      syncExecuteProcess(commandLine);
    }catch (Exception e){
      throw new VideoEngineException("Failed to extract frame of video", e);
    }
  }
}
