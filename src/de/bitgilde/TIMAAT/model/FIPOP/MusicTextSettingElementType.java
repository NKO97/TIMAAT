package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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
 * The persistent class for the music_type database table.
 *
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Entity
@Table(name="music_text_setting_element_type")
@NamedQuery(name="MusicTextSettingElementType.findAll", query="SELECT m FROM MusicTextSettingElementType m")
public class MusicTextSettingElementType implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	//bi-directional many-to-one association to Music
	@OneToMany(mappedBy="musicTextSettingElementType")
	@JsonIgnore
	private List<MusicTextSettingElement> musicTextSettingElementList;

	//bi-directional many-to-one association to Music
	@OneToMany(mappedBy="musicTextSettingElementType")
	@JsonIgnore
	private List<Music> musicList;

	//bi-directional many-to-one association to MusicTextSettingElementTypeTranslation
	@OneToMany(mappedBy="musicTextSettingElementType")
	private List<MusicTextSettingElementTypeTranslation> musicTextSettingElementTypeTranslationList;

	public MusicTextSettingElementType() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public List<MusicTextSettingElement> getMusicTextSettingElementList() {
		return this.musicTextSettingElementList;
	}

	public void setMusicTextSettingElementList(List<MusicTextSettingElement> musicTextSettingElementList) {
		this.musicTextSettingElementList = musicTextSettingElementList;
	}

	public MusicTextSettingElement addMusic(MusicTextSettingElement musicTextSettingElement) {
		getMusicTextSettingElementList().add(musicTextSettingElement);
		musicTextSettingElement.setMusicTextSettingElementType(this);

		return musicTextSettingElement;
	}

	public MusicTextSettingElement removeMusic(MusicTextSettingElement musicTextSettingElement) {
		getMusicTextSettingElementList().remove(musicTextSettingElement);
		musicTextSettingElement.setMusicTextSettingElementType(null);

		return musicTextSettingElement;
	}

	public List<MusicTextSettingElementTypeTranslation> getMusicTextSettingElementTypeTranslations() {
		return this.musicTextSettingElementTypeTranslationList;
	}

	public void setMusicTextSettingElementTypeTranslations(List<MusicTextSettingElementTypeTranslation> musicTextSettingElementTypeTranslationList) {
		this.musicTextSettingElementTypeTranslationList = musicTextSettingElementTypeTranslationList;
	}

	public MusicTextSettingElementTypeTranslation addMusicTextSettingElementTypeTranslation(MusicTextSettingElementTypeTranslation musicTextSettingElementTypeTranslation) {
		getMusicTextSettingElementTypeTranslations().add(musicTextSettingElementTypeTranslation);
		musicTextSettingElementTypeTranslation.setMusicTextSettingElementType(this);

		return musicTextSettingElementTypeTranslation;
	}

	public MusicTextSettingElementTypeTranslation removeMusicTextSettingElementTypeTranslation(MusicTextSettingElementTypeTranslation musicTextSettingElementTypeTranslation) {
		getMusicTextSettingElementTypeTranslations().remove(musicTextSettingElementTypeTranslation);
		musicTextSettingElementTypeTranslation.setMusicTextSettingElementType(null);

		return musicTextSettingElementTypeTranslation;
	}

	public List<Music> getMusicList() {
		return this.musicList;
	}

	public void setMusicList(List<Music> musicList) {
		this.musicList = musicList;
	}

}