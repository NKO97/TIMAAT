package de.bitgilde.TIMAAT.model.FIPOP;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.io.Serializable;

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
 * The persistent class for the audio_analysis database table.
 *
 * @author Nico Kotlenga
 * @since 18.07.25
 */
@Entity
@Table(name = "audio_analysis")
public class AudioAnalysis implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "channels", nullable = false, updatable = false)
    private int channels;

    @Column(name = "sample_rate", nullable = false, updatable = false)
    private int sampleRate;

    @Column(name = "bitrate", nullable = false, updatable = false)
    private int bitrate;

    @Column(name = "audio_codec", nullable = false, updatable = false)
    private String audioCodec;

    @Column(name = "sample_count", nullable = false, updatable = false)
    private long sampleCount;

    /**
     * The path information should not be included inside the json send to the client
     */
    @Column(name = "waveform_path", nullable = false, updatable = false)
    @JsonIgnore
    private String waveformPath;

    /**
     * The path information should not be included inside the json send to the client
     */
    @Column(name = "frequency_information_path", nullable = false, updatable = false)
    @JsonIgnore
    private String frequencyInformationPath;

    @OneToOne(mappedBy = "audioAnalysis")
    @JsonIgnore //// Avoid circular json serializing
    private MediumAudioAnalysis mediumAudioAnalysis;

    public int getChannels() {
        return channels;
    }

    public void setChannels(int channels) {
        this.channels = channels;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getSampleRate() {
        return sampleRate;
    }

    public void setSampleRate(int sampleRate) {
        this.sampleRate = sampleRate;
    }

    public int getBitrate() {
        return bitrate;
    }

    public void setBitrate(int bitrate) {
        this.bitrate = bitrate;
    }

    public String getAudioCodec() {
        return audioCodec;
    }

    public void setAudioCodec(String audioCodec) {
        this.audioCodec = audioCodec;
    }

    public long getSampleCount() {
        return sampleCount;
    }

    public void setSampleCount(long sampleCount) {
        this.sampleCount = sampleCount;
    }

    public String getWaveformPath() {
        return waveformPath;
    }

    public void setWaveformPath(String waveformPath) {
        this.waveformPath = waveformPath;
    }

    public String getFrequencyInformationPath() {
        return frequencyInformationPath;
    }

    public void setFrequencyInformationPath(String frequencyInformationPath) {
        this.frequencyInformationPath = frequencyInformationPath;
    }

    public MediumAudioAnalysis getMediumAudioAnalysis() {
        return mediumAudioAnalysis;
    }

    public void setMediumAudioAnalysis(MediumAudioAnalysis mediumAudioAnalysis) {
        this.mediumAudioAnalysis = mediumAudioAnalysis;
    }
}
