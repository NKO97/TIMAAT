package de.bitgilde.TIMAAT.audio.api;

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
 * Meta information of an audio file extracted by the {@link de.bitgilde.TIMAAT.audio.FfmpegAudioEngine}
 *
 * @author Nico Kotlenga
 * @since 25.07.25
 */
public class AudioMetaInformation {

    private final String codecName;
    private final int sampleRate;
    private final int channelCount;
    private final float durationInSeconds;
    private final int bitRate;

    public AudioMetaInformation(String codecName, int sampleRate, int channelCount, float durationInSeconds, int bitRate) {
        this.codecName = codecName;
        this.sampleRate = sampleRate;
        this.channelCount = channelCount;
        this.durationInSeconds = durationInSeconds;
        this.bitRate = bitRate;
    }

    public String getCodecName() {
        return codecName;
    }

    public int getSampleRate() {
        return sampleRate;
    }

    public int getChannelCount() {
        return channelCount;
    }

    public float getDurationInSeconds() {
        return durationInSeconds;
    }

    public int getBitRate() {
        return bitRate;
    }
}
