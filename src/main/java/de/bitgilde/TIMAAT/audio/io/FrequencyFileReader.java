package de.bitgilde.TIMAAT.audio.io;

import de.bitgilde.TIMAAT.audio.api.FrequencyInformation;
import jakarta.annotation.Nullable;

import java.io.DataInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Reader responsible to read a frequency file
 *
 * @author Nico Kotlenga
 * @since 08.08.25
 */
public class FrequencyFileReader {

    private static final int FREQUENCY_FILE_HEADER_SIZE = Integer.BYTES;
    //0.01 HZ tolerance which is necessary because of possible floating point errors
    private static final double FREQUENCY_EPSILON = 0.01;

    private final File frequencyFile;
    private final int timeSpanMsPerDataPoint;

    public FrequencyFileReader(Path frequencyFilePath) throws IOException {
        this.frequencyFile = frequencyFilePath.toFile();
        this.timeSpanMsPerDataPoint = readTimeSpanMsPerDataPoint();
    }

    private int readTimeSpanMsPerDataPoint() throws IOException {
        try(DataInputStream stream = new DataInputStream(new FileInputStream(frequencyFile))) {
            return stream.readInt();
        }
    }

    /**
     * Reads frequency information
     * @param startPositionMs optional parameter which will reads frequency information which are after or equal specified time
     * @param endPositionMs optional parameter which will reads frequency information which are before or equal specified time
     * @return the read {@link FrequencyInformation} if present. If the defined timespan doesn't have frequency information, no information will be returned
     * @throws IOException when error occurred during accessing frequency file
     */
    public Optional<FrequencyInformation> getFrequencyInformation(@Nullable Integer startPositionMs, @Nullable Integer endPositionMs) throws IOException {
        try(DataInputStream stream = new DataInputStream(new FileInputStream(frequencyFile))) {
            stream.skipBytes(FREQUENCY_FILE_HEADER_SIZE); //skip header

            //To simplify the result we approximate the frequency at the half of the interval
            int currentPositionMs = timeSpanMsPerDataPoint / 2;
            if(startPositionMs != null) {
                //calculate number of skippable data points
                int numberOfSkippableBytes = Math.round(startPositionMs / (float) timeSpanMsPerDataPoint) * Double.BYTES;
                currentPositionMs += (numberOfSkippableBytes / Double.BYTES) * timeSpanMsPerDataPoint;
                stream.skip(numberOfSkippableBytes);
            }

            double minimumFrequency = Double.MAX_VALUE;
            double maximumFrequency = Double.MIN_VALUE;
            List<Integer> minimumFrequencyTimeSpans = new ArrayList<>();
            List<Integer> maximumFrequencyTimeSpans = new ArrayList<>();

            while(stream.available() >= Double.BYTES && (endPositionMs == null || endPositionMs > currentPositionMs)) {
                double currentFrequency = stream.readDouble();

                if(Math.abs(currentFrequency - minimumFrequency) < FREQUENCY_EPSILON) {
                    minimumFrequencyTimeSpans.add(currentPositionMs);
                }

                if(Math.abs(currentFrequency - maximumFrequency) < FREQUENCY_EPSILON) {
                    maximumFrequencyTimeSpans.add(currentPositionMs);
                }

                if(currentFrequency < minimumFrequency - FREQUENCY_EPSILON) {
                    minimumFrequency = currentFrequency;
                    minimumFrequencyTimeSpans.clear();
                    minimumFrequencyTimeSpans.add(currentPositionMs);
                }

                if(currentFrequency > maximumFrequency + FREQUENCY_EPSILON) {
                    maximumFrequency = currentFrequency;
                    maximumFrequencyTimeSpans.clear();
                    maximumFrequencyTimeSpans.add(currentPositionMs);
                }

                currentPositionMs += timeSpanMsPerDataPoint;
            }
            if(minimumFrequencyTimeSpans.isEmpty() || maximumFrequencyTimeSpans.isEmpty()) {
                return Optional.empty();
            }
            return Optional.of(new FrequencyInformation(minimumFrequency, maximumFrequency, minimumFrequencyTimeSpans, maximumFrequencyTimeSpans));
        }
    }
}
