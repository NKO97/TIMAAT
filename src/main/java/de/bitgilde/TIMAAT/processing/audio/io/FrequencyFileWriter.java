package de.bitgilde.TIMAAT.processing.audio.io;

import java.io.Closeable;
import java.io.DataOutputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Path;

/*
 Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
 */

/**
 * Class responsible to read frequency files
 *
 * @author Nico Kotlenga
 * @since 08.08.25
 */
public class FrequencyFileWriter implements Closeable {

    private final DataOutputStream stream;

    public FrequencyFileWriter(Path frequencyBinaryPath, int timespanMsPerDataPoint) throws IOException {
        this.stream = new DataOutputStream(new FileOutputStream(frequencyBinaryPath.toFile()));
        writeHeader(timespanMsPerDataPoint);
    }

    public void writeFrequencyDataPoint(double frequency) throws IOException {
        stream.writeDouble(frequency);
    }

    private void writeHeader(int timespanMsPerDataPoint) throws IOException {
        this.stream.writeInt(timespanMsPerDataPoint);
    }

    @Override
    public void close() throws IOException {
        stream.close();
    }
}
