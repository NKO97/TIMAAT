package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.Table;

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
 * The persistent class for the audio_codec_information database table.
 *
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Entity
@Table(name="audio_codec_information")
@NamedQuery(name="AudioCodecInformation.findAll", query="SELECT a FROM AudioCodecInformation a")
public class AudioCodecInformation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private int id;

	@Column(name="audio_codec")
	private String audioCodec;

	private String bitrate;

	private String channels;

	@Column(name="sample_rate")
	private String sampleRate;

	//bi-directional many-to-one association to MediumAudio
	// @OneToMany(mappedBy="audioCodecInformation")
	// private List<MediumAudio> mediumAudios;

	public AudioCodecInformation() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getAudioCodec() {
		return this.audioCodec;
	}

	public void setAudioCodec(String audioCodec) {
		this.audioCodec = audioCodec;
	}

	public String getBitrate() {
		return this.bitrate;
	}

	public void setBitrate(String bitrate) {
		this.bitrate = bitrate;
	}

	public String getChannels() {
		return this.channels;
	}

	public void setChannels(String channels) {
		this.channels = channels;
	}

	public String getSampleRate() {
		return this.sampleRate;
	}

	public void setSampleRate(String sampleRate) {
		this.sampleRate = sampleRate;
	}

	// public List<MediumAudio> getMediumAudios() {
	// 	return this.mediumAudios;
	// }

	// public void setMediumAudios(List<MediumAudio> mediumAudios) {
	// 	this.mediumAudios = mediumAudios;
	// }

	// public MediumAudio addMediumAudio(MediumAudio mediumAudio) {
	// 	getMediumAudios().add(mediumAudio);
	// 	mediumAudio.setAudioCodecInformation(this);

	// 	return mediumAudio;
	// }

	// public MediumAudio removeMediumAudio(MediumAudio mediumAudio) {
	// 	getMediumAudios().remove(mediumAudio);
	// 	mediumAudio.setAudioCodecInformation(null);

	// 	return mediumAudio;
	// }

}