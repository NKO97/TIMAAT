package de.bitgilde.TIMAAT.processing.audio.api;

import de.bitgilde.TIMAAT.storage.file.TemporaryFileStorage.TemporaryFile;

import java.io.Closeable;
import java.io.IOException;
import java.nio.file.Path;

/**
 * Represents a PCM mono 16 bit little endian file
 *
 * @author Nico Kotlenga
 * @since 09.08.25
 */
public class PcmMono16BitLittleEndian implements Closeable {

    private final TemporaryFile temporaryFile;

    public PcmMono16BitLittleEndian(TemporaryFile temporaryFile) {
        this.temporaryFile = temporaryFile;
    }

    public Path getAudioFilePath() {
        return temporaryFile.getTemporaryFilePath();
    }

    @Override
    public void close() throws IOException {
        temporaryFile.close();
    }
}
