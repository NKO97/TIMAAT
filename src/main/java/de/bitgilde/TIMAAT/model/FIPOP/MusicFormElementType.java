package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
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
@Table(name="music_form_element_type")
@NamedQuery(name="MusicFormElementType.findAll", query="SELECT m FROM MusicFormElementType m")
public class MusicFormElementType implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	@Column(name="color_hex")
	private String colorHex;

	//bi-directional many-to-one association to Music
	@OneToMany(mappedBy="musicFormElementType")
	@JsonIgnore
	private List<MusicFormElement> musicFormElementList;

	//bi-directional many-to-one association to MusicFormElementTypeTranslation
	@OneToMany(mappedBy="musicFormElementType")
	private List<MusicFormElementTypeTranslation> musicFormElementTypeTranslationList;

	public MusicFormElementType() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getColorHex() {
		return this.colorHex;
	}

	public void setColorHex(String colorHex) {
		this.colorHex = colorHex;
	}

	public List<MusicFormElement> getMusicFormElementList() {
		return this.musicFormElementList;
	}

	public void setMusicFormElementList(List<MusicFormElement> musicFormElementList) {
		this.musicFormElementList = musicFormElementList;
	}

	public MusicFormElement addMusic(MusicFormElement musicFormElement) {
		getMusicFormElementList().add(musicFormElement);
		musicFormElement.setMusicFormElementType(this);

		return musicFormElement;
	}

	public MusicFormElement removeMusic(MusicFormElement musicFormElement) {
		getMusicFormElementList().remove(musicFormElement);
		musicFormElement.setMusicFormElementType(null);

		return musicFormElement;
	}

	public List<MusicFormElementTypeTranslation> getMusicFormElementTypeTranslations() {
		return this.musicFormElementTypeTranslationList;
	}

	public void setMusicFormElementTypeTranslations(List<MusicFormElementTypeTranslation> musicFormElementTypeTranslationList) {
		this.musicFormElementTypeTranslationList = musicFormElementTypeTranslationList;
	}

	public MusicFormElementTypeTranslation addMusicFormElementTypeTranslation(MusicFormElementTypeTranslation musicFormElementTypeTranslation) {
		getMusicFormElementTypeTranslations().add(musicFormElementTypeTranslation);
		musicFormElementTypeTranslation.setMusicFormElementType(this);

		return musicFormElementTypeTranslation;
	}

	public MusicFormElementTypeTranslation removeMusicFormElementTypeTranslation(MusicFormElementTypeTranslation musicFormElementTypeTranslation) {
		getMusicFormElementTypeTranslations().remove(musicFormElementTypeTranslation);
		musicFormElementTypeTranslation.setMusicFormElementType(null);

		return musicFormElementTypeTranslation;
	}

}