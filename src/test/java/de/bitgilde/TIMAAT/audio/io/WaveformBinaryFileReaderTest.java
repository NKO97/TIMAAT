package de.bitgilde.TIMAAT.audio.io;

import de.bitgilde.TIMAAT.processing.audio.io.WaveformBinaryFileReader;
import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.nio.file.Path;
import java.util.List;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

/**
 * Testsuite of {@link WaveformBinaryFileReader}
 *
 * @author Nico Kotlenga
 * @since 26.07.25
 */
public class WaveformBinaryFileReaderTest {

    @Test
    public void testSuccessfulReadingOfWaveformData() throws IOException {
        Path waveformFilePath = Path.of(WaveformBinaryFileReaderTest.class.getResource("/waveform-files/1.waveform").getPath());
        WaveformBinaryFileReader reader = new WaveformBinaryFileReader(waveformFilePath);
        List<Float> expectedMinValues = List.of(1f, 4f, 7f);
        List<Float> expectedAverageValues = List.of(2f, 5f, 8f);
        List<Float> expectedMaxValues = List.of(3f, 6f, 9f);

        List<Float> minValues = reader.readMinValues();
        List<Float> averageValues = reader.readAverageValues();
        List<Float> maxValues = reader.readMaxValues();

        assertThat(minValues).isEqualTo(expectedMinValues);
        assertThat(averageValues).isEqualTo(expectedAverageValues);
        assertThat(maxValues).isEqualTo(expectedMaxValues);
    }
}
