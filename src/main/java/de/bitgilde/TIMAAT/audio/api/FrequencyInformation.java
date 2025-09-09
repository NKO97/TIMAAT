package de.bitgilde.TIMAAT.audio.api;

import java.util.List;

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
 * Extracted information from a frequency file
 *
 * @author Nico Kotlenga
 * @since 08.08.25
 */
public class FrequencyInformation {
    private final double minimumFrequency;
    private final double maximumFrequency;
    private final List<Integer> minimumFrequencyTimeSpans;
    private final List<Integer> maximumFrequencyTimeSpans;

    public FrequencyInformation(double minimumFrequency, double maximumFrequency, List<Integer> minimumFrequencyTimeSpans, List<Integer> maximumFrequencyTimeSpans) {
        this.minimumFrequency = minimumFrequency;
        this.maximumFrequency = maximumFrequency;
        this.minimumFrequencyTimeSpans = minimumFrequencyTimeSpans;
        this.maximumFrequencyTimeSpans = maximumFrequencyTimeSpans;
    }

    public double getMaximumFrequency() {
        return maximumFrequency;
    }

    public List<Integer> getMinimumFrequencyTimeSpans() {
        return minimumFrequencyTimeSpans;
    }

    public List<Integer> getMaximumFrequencyTimeSpans() {
        return maximumFrequencyTimeSpans;
    }

    public double getMinimumFrequency() {
        return minimumFrequency;
    }
}
