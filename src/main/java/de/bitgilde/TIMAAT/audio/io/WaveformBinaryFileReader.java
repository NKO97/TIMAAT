package de.bitgilde.TIMAAT.audio.io;

import java.io.DataInputStream;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

/**
 * Class responsible to read waveform binary files
 *
 * @author Nico Kotlenga
 * @since 26.07.25
 */
public class WaveformBinaryFileReader {

    private final Path waveformBinaryPath;

    public WaveformBinaryFileReader(Path waveformBinaryPath) {
        this.waveformBinaryPath = waveformBinaryPath;
    }

    public List<Float> readMinValues() throws IOException {
        try (DataInputStream dataInputStream = new DataInputStream(new FileInputStream(waveformBinaryPath.toFile()))) {
            List<Float> minValues = new ArrayList<>();
            while (dataInputStream.available() > 0) {
                minValues.add(dataInputStream.readFloat());
                dataInputStream.skipBytes(Float.BYTES);
                dataInputStream.skipBytes(Float.BYTES);
            }
            return minValues;
        }
    }

    public List<Float> readAverageValues() throws IOException {
        try (DataInputStream dataInputStream = new DataInputStream(new FileInputStream(waveformBinaryPath.toFile()))) {
            List<Float> averageValues = new ArrayList<>();
            while (dataInputStream.available() > 0) {
                dataInputStream.skipBytes(Float.BYTES);
                averageValues.add(dataInputStream.readFloat());
                dataInputStream.skipBytes(Float.BYTES);
            }

            return averageValues;
        }
    }

    public List<Float> readMaxValues() throws IOException{
        try (DataInputStream dataInputStream = new DataInputStream(new FileInputStream(waveformBinaryPath.toFile()))) {
            List<Float> averageValues = new ArrayList<>();
            while (dataInputStream.available() > 0) {
                dataInputStream.skipBytes(Float.BYTES);
                dataInputStream.skipBytes(Float.BYTES);
                averageValues.add(dataInputStream.readFloat());
            }

            return averageValues;
        }
    }
}
