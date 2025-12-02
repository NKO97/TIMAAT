package de.bitgilde.TIMAAT.audio.io;

import de.bitgilde.TIMAAT.processing.audio.io.FrequencyFileWriter;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * Testsuite of {@link FrequencyFileWriter}
 *
 * @author Nico Kotlenga
 * @since 08.08.25
 */
public class FrequencyFileWriterTest {

    private static final Path TEST_OUTPUT_DIRECTORY = Paths.get("./test_output");

    @BeforeAll
    public static void setup() throws IOException {
        Files.createDirectories(TEST_OUTPUT_DIRECTORY);
    }

    @Test
    public void testSuccessfulWritingOfFrequencyData() throws Exception {
        Path frequencyFilePath = TEST_OUTPUT_DIRECTORY.resolve("1.frequency");
        try (FrequencyFileWriter writer = new FrequencyFileWriter(frequencyFilePath, 3000)) {
            writer.writeFrequencyDataPoint(1.0);
            writer.writeFrequencyDataPoint(2.0);
            writer.writeFrequencyDataPoint(3.0);
            writer.writeFrequencyDataPoint(4.0);
            writer.writeFrequencyDataPoint(5.0);
            writer.writeFrequencyDataPoint(6.0);
            writer.writeFrequencyDataPoint(7.0);
            writer.writeFrequencyDataPoint(8.0);
            writer.writeFrequencyDataPoint(9.0);
            writer.writeFrequencyDataPoint(10.0);
        }

        Assertions.assertTrue(frequencyFilePath.toFile().exists());
        Assertions.assertEquals(10 * Double.BYTES + Integer.BYTES, frequencyFilePath.toFile().length());
    }
}
