package de.bitgilde.TIMAAT.audio.io;

import de.bitgilde.TIMAAT.audio.api.WaveformDataPoint;

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

    public void writeValues(WaveformDataPoint waveformDataPoint)  throws IOException {
        stream.writeFloat(waveformDataPoint.getNormalizedMinValue());
        stream.writeFloat(waveformDataPoint.getNormalizedAverageValue());
        stream.writeFloat(waveformDataPoint.getNormalizedMaxValue());
    }

    @Override
    public void close() throws Exception {
        stream.close();
    }
}
