package de.bitgilde.TIMAAT.audio.io;

import de.bitgilde.TIMAAT.audio.api.WaveformDataPoint;

import java.io.DataOutputStream;
import java.io.FileNotFoundException;
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
 * Writer responsible to create a waveform binary file
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
