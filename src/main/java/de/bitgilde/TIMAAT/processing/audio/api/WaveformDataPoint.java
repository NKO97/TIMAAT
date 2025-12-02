package de.bitgilde.TIMAAT.processing.audio.api;

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
 * Represents a single data point of the waveform
 */
public class WaveformDataPoint {
    private final float normalizedMinValue;
    private final float normalizedMaxValue;
    private final float normalizedAverageValue;

    public WaveformDataPoint(float normalizedMinValue, float normalizedMaxValue, float normalizedAverageValue) {
        this.normalizedMinValue = normalizedMinValue;
        this.normalizedMaxValue = normalizedMaxValue;
        this.normalizedAverageValue = normalizedAverageValue;
    }

    public float getNormalizedMinValue() {
        return normalizedMinValue;
    }

    public float getNormalizedMaxValue() {
        return normalizedMaxValue;
    }

    public float getNormalizedAverageValue() {
        return normalizedAverageValue;
    }
}