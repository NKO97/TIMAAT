package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToMany;
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
 * The persistent class for the voice_leading_pattern database table.
 *
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Entity
@Table(name="voice_leading_pattern")
@NamedQuery(name="VoiceLeadingPattern.findAll", query="SELECT vlp FROM VoiceLeadingPattern vlp")
public class VoiceLeadingPattern implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	//bi-directional many-to-many association to Music
	@ManyToMany(mappedBy = "voiceLeadingPatternList")
	@JsonIgnore
	private List<Music> musicList;

  //bi-directional many-to-one association to VoiceLeadingPatternTranslation
	@OneToMany(mappedBy="voiceLeadingPattern")
	private List<VoiceLeadingPatternTranslation> voiceLeadingPatternTranslationList;

	public VoiceLeadingPattern() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public List<Music> getMusicList() {
		return this.musicList;
	}

	public void setMusicList(List<Music> musicList) {
		this.musicList = musicList;
	}

  public List<VoiceLeadingPatternTranslation> getVoiceLeadingPatternTranslationList() {
		return this.voiceLeadingPatternTranslationList;
	}

	public void setVoiceLeadingPatternTranslationList(List<VoiceLeadingPatternTranslation> voiceLeadingPatternTranslationList) {
		this.voiceLeadingPatternTranslationList = voiceLeadingPatternTranslationList;
	}

	public VoiceLeadingPatternTranslation addVoiceLeadingPatternTranslation(VoiceLeadingPatternTranslation voiceLeadingPatternTranslation) {
		getVoiceLeadingPatternTranslationList().add(voiceLeadingPatternTranslation);
		voiceLeadingPatternTranslation.setVoiceLeadingPattern(this);

		return voiceLeadingPatternTranslation;
	}

	public VoiceLeadingPatternTranslation removeVoiceLeadingPatternTranslation(VoiceLeadingPatternTranslation voiceLeadingPatternTranslation) {
		getVoiceLeadingPatternTranslationList().remove(voiceLeadingPatternTranslation);
		voiceLeadingPatternTranslation.setVoiceLeadingPattern(null);

		return voiceLeadingPatternTranslation;
	}

}