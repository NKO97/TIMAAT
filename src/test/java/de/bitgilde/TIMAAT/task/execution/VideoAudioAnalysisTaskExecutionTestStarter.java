package de.bitgilde.TIMAAT.task.execution;

import de.bitgilde.TIMAAT.audio.FfmpegAudioEngine;
import de.bitgilde.TIMAAT.storage.TemporaryFileStorage;
import de.bitgilde.TIMAAT.storage.VideoFileStorage;
import de.bitgilde.TIMAAT.task.api.VideoAudioAnalysisTask;
import de.bitgilde.TIMAAT.task.exception.TaskExecutionException;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

/**
 * This is a starter class to test the execution of the {@link VideoAudioAnalysisTaskExecutor}
 * The path to ffmpeg and the path to the video file will be passed as program argument.
 *
 * @author Nico Kotlenga
 * @since 26.07.25
 */
public class VideoAudioAnalysisTaskExecutionTestStarter {

    private static final Path TEST_OUTPUT_DIRECTORY = Paths.get("test_output");

    public static void main(String[] args) throws InstantiationException, TaskExecutionException {
        Path pathToFffmpeg = Path.of(args[0]);
        Path pathToVideoFile = Path.of(args[1]);
        VideoFileStorage videFileStorage = mock(VideoFileStorage.class);
        when(videFileStorage.getPathToOriginalVideoFile(anyInt())).thenReturn(Optional.of(pathToVideoFile));


        System.out.println("Class location: " + FfmpegAudioEngine.class.getProtectionDomain().getCodeSource().getLocation());

        TemporaryFileStorage temporaryFileStorage = new TemporaryFileStorage(TEST_OUTPUT_DIRECTORY);
        FfmpegAudioEngine ffmpegAudioEngine = new FfmpegAudioEngine(pathToFffmpeg, pathToFffmpeg, temporaryFileStorage);


        VideoAudioAnalysisTaskExecutor executor = new VideoAudioAnalysisTaskExecutor(temporaryFileStorage, new VideoAudioAnalysisTask(1), videFileStorage, ffmpegAudioEngine);
        executor.execute();

    }
}
