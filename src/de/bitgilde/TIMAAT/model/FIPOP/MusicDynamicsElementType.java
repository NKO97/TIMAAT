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
@Table(name="music_dynamics_element_type")
@NamedQuery(name="MusicDynamicsElementType.findAll", query="SELECT m FROM MusicDynamicsElementType m")
public class MusicDynamicsElementType implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	//bi-directional many-to-one association to Music
	@OneToMany(mappedBy="musicDynamicsElementType")
	@JsonIgnore
	private List<MusicDynamicsElement> musicDynamicsElementList;

	//bi-directional many-to-one association to MusicDynamicsElementTypeTranslation
	@OneToMany(mappedBy="musicDynamicsElementType")
	private List<MusicDynamicsElementTypeTranslation> musicDynamicsElementTypeTranslationList;

	public MusicDynamicsElementType() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public List<MusicDynamicsElement> getMusicDynamicsElementList() {
		return this.musicDynamicsElementList;
	}

	public void setMusicDynamicsElementList(List<MusicDynamicsElement> musicDynamicsElementList) {
		this.musicDynamicsElementList = musicDynamicsElementList;
	}

	public MusicDynamicsElement addMusic(MusicDynamicsElement musicDynamicsElement) {
		getMusicDynamicsElementList().add(musicDynamicsElement);
		musicDynamicsElement.setMusicDynamicsElementType(this);

		return musicDynamicsElement;
	}

	public MusicDynamicsElement removeMusic(MusicDynamicsElement musicDynamicsElement) {
		getMusicDynamicsElementList().remove(musicDynamicsElement);
		musicDynamicsElement.setMusicDynamicsElementType(null);

		return musicDynamicsElement;
	}

	public List<MusicDynamicsElementTypeTranslation> getMusicDynamicsElementTypeTranslations() {
		return this.musicDynamicsElementTypeTranslationList;
	}

	public void setMusicDynamicsElementTypeTranslations(List<MusicDynamicsElementTypeTranslation> musicDynamicsElementTypeTranslationList) {
		this.musicDynamicsElementTypeTranslationList = musicDynamicsElementTypeTranslationList;
	}

	public MusicDynamicsElementTypeTranslation addMusicDynamicsElementTypeTranslation(MusicDynamicsElementTypeTranslation musicDynamicsElementTypeTranslation) {
		getMusicDynamicsElementTypeTranslations().add(musicDynamicsElementTypeTranslation);
		musicDynamicsElementTypeTranslation.setMusicDynamicsElementType(this);

		return musicDynamicsElementTypeTranslation;
	}

	public MusicDynamicsElementTypeTranslation removeMusicDynamicsElementTypeTranslation(MusicDynamicsElementTypeTranslation musicDynamicsElementTypeTranslation) {
		getMusicDynamicsElementTypeTranslations().remove(musicDynamicsElementTypeTranslation);
		musicDynamicsElementTypeTranslation.setMusicDynamicsElementType(null);

		return musicDynamicsElementTypeTranslation;
	}

}