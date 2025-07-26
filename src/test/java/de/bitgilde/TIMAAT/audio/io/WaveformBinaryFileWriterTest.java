package de.bitgilde.TIMAAT.audio.io;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * Testsuite of {@link WaveformBinaryFileWriter}
 *
 * @author Nico Kotlenga
 * @since 26.07.25
 */
public class WaveformBinaryFileWriterTest {

    private static final Path TEST_OUTPUT_DIRECTORY = Paths.get("./test_output");

    @BeforeAll
    public static void setup() throws IOException {
        Files.createDirectories(TEST_OUTPUT_DIRECTORY);
    }

    @Test
    public void testSuccessfulWritingOfWaveformData() throws Exception {
        Path waveformFilePath = TEST_OUTPUT_DIRECTORY.resolve("1.waveform");
        try (WaveformBinaryFileWriter writer = new WaveformBinaryFileWriter(waveformFilePath)) {
            writer.writeValues(1, 2, 3);
            writer.writeValues(4, 5, 6);
            writer.writeValues(7, 8, 9);
        }

        File createdWaveformFile = waveformFilePath.toFile();
        Assertions.assertTrue(createdWaveformFile.exists());
        Assertions.assertEquals(9 * Float.BYTES, createdWaveformFile.length());
    }
}
