package de.bitgilde.TIMAAT.audio.io;

import java.io.DataOutputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Path;

/**
 * TODO: Add javadoc
 *
 * @author Nico Kotlenga
 * @since 25.07.25
 */
public class WaveformBinaryFileWriter implements AutoCloseable {

    private final DataOutputStream stream;

    public WaveformBinaryFileWriter(Path waveformBinaryPath) throws FileNotFoundException {
        this.stream = new DataOutputStream(new FileOutputStream(waveformBinaryPath.toFile()));
    }

    public void writeValues(float minValue, float averageValue, float maxValue)  throws IOException {
        stream.writeFloat(minValue);
        stream.writeFloat(averageValue);
        stream.writeFloat(maxValue);
    }

    @Override
    public void close() throws Exception {
        stream.close();
    }
}
