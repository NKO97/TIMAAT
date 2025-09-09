package de.bitgilde.TIMAAT.audio;

import de.bitgilde.TIMAAT.PropertyConstants;
import de.bitgilde.TIMAAT.PropertyManagement;
import de.bitgilde.TIMAAT.audio.api.FrequencyInformation;
import de.bitgilde.TIMAAT.audio.api.PcmMono16BitLittleEndian;
import de.bitgilde.TIMAAT.audio.exception.AudioEngineException;
import de.bitgilde.TIMAAT.audio.io.FrequencyFileReader;
import de.bitgilde.TIMAAT.storage.file.TemporaryFileStorage;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

/**
 * Testsuite of {@link FfmpegAudioEngine}
 *
 * @author Nico Kotlenga
 * @since 11.08.25
 */
public class FfmpegAudioEngineTest {

    private static final Path TEST_OUTPUT_DIRECTORY = Paths.get("./test_output");

    @BeforeAll
    public static void setup() throws IOException {
        Files.createDirectories(TEST_OUTPUT_DIRECTORY);
    }

    /**
     * Tests the extraction of frequency information.
     * The test file has 2 second intervals of following frequencies:
     * <ul>
     *     <li>50Hz</li>
     *     <li>100Hz</li>
     *     <li>150Hz</li>
     * </ul>
     *
     * @throws InstantiationException
     */
    @Test
    public void shouldReadFrequencyInformationCorrectly() throws InstantiationException, AudioEngineException, IOException {
        PropertyManagement propertyManagement = mock(PropertyManagement.class);
        when(propertyManagement.getProp(eq(PropertyConstants.STORAGE_TEMP_LOCATION))).thenReturn(TEST_OUTPUT_DIRECTORY.toString());
        when(propertyManagement.getProp(eq(PropertyConstants.FFMPEG_LOCATION))).thenReturn("ffmpeg");

        TemporaryFileStorage temporaryFileStorage = new TemporaryFileStorage(propertyManagement);
        FfmpegAudioEngine ffmpegAudioEngine = new FfmpegAudioEngine(propertyManagement, temporaryFileStorage);

        Path audioPath = Path.of(FfmpegAudioEngineTest.class.getResource("/test-audio/test_frequency.pcm").getPath());
        PcmMono16BitLittleEndian pcmMono16BitLittleEndian = mock(PcmMono16BitLittleEndian.class);
        when(pcmMono16BitLittleEndian.getAudioFilePath()).thenReturn(audioPath);

        Path frequencyOutputPath = TEST_OUTPUT_DIRECTORY.resolve("test_frequency.frequency");

        ffmpegAudioEngine.createFrequencyBinary(pcmMono16BitLittleEndian, frequencyOutputPath);
        Assertions.assertTrue(Files.exists(frequencyOutputPath));

        FrequencyFileReader frequencyFileReader = new FrequencyFileReader(frequencyOutputPath);
        Optional<FrequencyInformation> firstInterval = frequencyFileReader.getFrequencyInformation(0, 2000);
        Assertions.assertTrue(firstInterval.isPresent());
        Assertions.assertEquals(50.0, firstInterval.get().getMinimumFrequency(), 1);
        Assertions.assertEquals(50.0, firstInterval.get().getMaximumFrequency(), 1);

        Optional<FrequencyInformation> secondInterval = frequencyFileReader.getFrequencyInformation(2000, 4000);
        Assertions.assertTrue(secondInterval.isPresent());
        Assertions.assertEquals(100.0, secondInterval.get().getMinimumFrequency(), 1);
        Assertions.assertEquals(100.0, secondInterval.get().getMaximumFrequency(), 1);

        Optional<FrequencyInformation> thirdInterval = frequencyFileReader.getFrequencyInformation(4000, 6000);
        Assertions.assertTrue(thirdInterval.isPresent());
        Assertions.assertEquals(150, thirdInterval.get().getMinimumFrequency(), 1);
        Assertions.assertEquals(150, thirdInterval.get().getMaximumFrequency(), 1);

        Optional<FrequencyInformation> wholeFile = frequencyFileReader.getFrequencyInformation(null, null);
        Assertions.assertTrue(wholeFile.isPresent());
        Assertions.assertEquals(50, wholeFile.get().getMinimumFrequency(), 1);
        Assertions.assertEquals(150, wholeFile.get().getMaximumFrequency(), 1);

        Optional<FrequencyInformation> firstAndSecondInterval = frequencyFileReader.getFrequencyInformation(0, 4000);
        Assertions.assertTrue(firstAndSecondInterval.isPresent());
        Assertions.assertEquals(50, firstAndSecondInterval.get().getMinimumFrequency(), 1);
        Assertions.assertEquals(100, firstAndSecondInterval.get().getMaximumFrequency(), 1);


        Optional<FrequencyInformation> secondAndThirdInterval = frequencyFileReader.getFrequencyInformation(2000, 6000);
        Assertions.assertTrue(secondAndThirdInterval.isPresent());
        Assertions.assertEquals(100, secondAndThirdInterval.get().getMinimumFrequency(), 1);
        Assertions.assertEquals(150, secondAndThirdInterval.get().getMaximumFrequency(), 1);
    }
}
