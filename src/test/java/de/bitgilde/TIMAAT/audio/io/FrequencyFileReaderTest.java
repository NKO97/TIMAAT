package de.bitgilde.TIMAAT.audio.io;

import de.bitgilde.TIMAAT.processing.audio.api.FrequencyInformation;
import de.bitgilde.TIMAAT.processing.audio.io.FrequencyFileReader;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.nio.file.Path;

/**
 * Testsuite of {@link FrequencyFileReader}
 *
 * @author Nico Kotlenga
 * @since 08.08.25
 */
public class FrequencyFileReaderTest {

    @Test
    public void testSuccessfulReadingOfCompleteFrequencyFile() throws IOException {
        Path frequencyFilePath = Path.of(WaveformBinaryFileReaderTest.class.getResource("/frequency-files/1.frequency").getPath());
        FrequencyFileReader reader = new FrequencyFileReader(frequencyFilePath);
        FrequencyInformation frequencyInformation = reader.getFrequencyInformation(null, null).get();

        Assertions.assertEquals(10.0, frequencyInformation.getMaximumFrequency(), 0.01);
        Assertions.assertEquals(1.0, frequencyInformation.getMinimumFrequency(), 0.01);
        Assertions.assertEquals(1, frequencyInformation.getMinimumFrequencyTimeSpans().size());
        Assertions.assertEquals(1, frequencyInformation.getMaximumFrequencyTimeSpans().size());
        Assertions.assertEquals(28500 , frequencyInformation.getMaximumFrequencyTimeSpans().get(0));
        Assertions.assertEquals(1500 , frequencyInformation.getMinimumFrequencyTimeSpans().get(0));
    }

    @Test
    public void testSuccessfulReadingOfFrequencyFileWithStartTimeLimit()  throws IOException {
        Path frequencyFilePath = Path.of(WaveformBinaryFileReaderTest.class.getResource("/frequency-files/1.frequency").getPath());
        FrequencyFileReader reader = new FrequencyFileReader(frequencyFilePath);
        FrequencyInformation frequencyInformation = reader.getFrequencyInformation(5000, null).get();


        Assertions.assertEquals(10.0, frequencyInformation.getMaximumFrequency(), 0.01);
        Assertions.assertEquals(3.0, frequencyInformation.getMinimumFrequency(), 0.01);
        Assertions.assertEquals(1, frequencyInformation.getMinimumFrequencyTimeSpans().size());
        Assertions.assertEquals(1, frequencyInformation.getMaximumFrequencyTimeSpans().size());
        Assertions.assertEquals(28500 , frequencyInformation.getMaximumFrequencyTimeSpans().get(0));
        Assertions.assertEquals(7500 , frequencyInformation.getMinimumFrequencyTimeSpans().get(0));
    }

    @Test
    public void testSuccessfulReadingOfFrequencyFileWithEndTimeLimit() throws IOException {
        Path frequencyFilePath = Path.of(WaveformBinaryFileReaderTest.class.getResource("/frequency-files/1.frequency").getPath());
        FrequencyFileReader reader = new FrequencyFileReader(frequencyFilePath);
        FrequencyInformation frequencyInformation = reader.getFrequencyInformation(null, 5000).get();

        Assertions.assertEquals(2.0, frequencyInformation.getMaximumFrequency(), 0.01);
        Assertions.assertEquals(1.0, frequencyInformation.getMinimumFrequency(), 0.01);
        Assertions.assertEquals(1, frequencyInformation.getMinimumFrequencyTimeSpans().size());
        Assertions.assertEquals(1, frequencyInformation.getMaximumFrequencyTimeSpans().size());
        Assertions.assertEquals(4500 , frequencyInformation.getMaximumFrequencyTimeSpans().get(0));
        Assertions.assertEquals(1500 , frequencyInformation.getMinimumFrequencyTimeSpans().get(0));
    }

    @Test
    public void testSuccessfulReadingOfFrequencyFileWithStartAndEndTimeLimit() throws IOException {
        Path frequencyFilePath = Path.of(WaveformBinaryFileReaderTest.class.getResource("/frequency-files/1.frequency").getPath());
        FrequencyFileReader reader = new FrequencyFileReader(frequencyFilePath);
        FrequencyInformation frequencyInformation = reader.getFrequencyInformation(5000, 12000).get();

        Assertions.assertEquals(4.0, frequencyInformation.getMaximumFrequency(), 0.01);
        Assertions.assertEquals(3.0, frequencyInformation.getMinimumFrequency(), 0.01);
        Assertions.assertEquals(1, frequencyInformation.getMinimumFrequencyTimeSpans().size());
        Assertions.assertEquals(1, frequencyInformation.getMaximumFrequencyTimeSpans().size());
        Assertions.assertEquals(10500 , frequencyInformation.getMaximumFrequencyTimeSpans().get(0));
        Assertions.assertEquals(7500 , frequencyInformation.getMinimumFrequencyTimeSpans().get(0));
    }
}
