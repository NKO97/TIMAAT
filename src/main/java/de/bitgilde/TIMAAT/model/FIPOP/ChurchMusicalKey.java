package de.bitgilde.TIMAAT.model.FIPOP;


import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
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
 * The persistent class for the church_musical_key database table.
 *
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Entity
@Table(name="church_musical_key")
@NamedQuery(name="ChurchMusicalKey.findAll", query="SELECT cmk FROM ChurchMusicalKey cmk")
public class ChurchMusicalKey implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	// @GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	//bi-directional many-to-one association to ChurchMusicalKeyTranslation
	@OneToMany(mappedBy="churchMusicalKey")
	private List<ChurchMusicalKeyTranslation> churchMusicalKeyTranslations;

	//bi-directional many-to-one association to MusicChurchMusic
	@OneToMany(mappedBy="churchMusicalKey")
	@JsonIgnore
	private List<MusicChurchMusic> musicChurchMusicList;

	public ChurchMusicalKey() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public List<ChurchMusicalKeyTranslation> getChurchMusicalKeyTranslations() {
		return this.churchMusicalKeyTranslations;
	}

	public void setChurchMusicalKeyTranslations(List<ChurchMusicalKeyTranslation> churchMusicalKeyTranslations) {
		this.churchMusicalKeyTranslations = churchMusicalKeyTranslations;
	}

	public ChurchMusicalKeyTranslation addChurchMusicalKeyTranslation(ChurchMusicalKeyTranslation churchMusicalKeyTranslation) {
		getChurchMusicalKeyTranslations().add(churchMusicalKeyTranslation);
		churchMusicalKeyTranslation.setChurchMusicalKey(this);

		return churchMusicalKeyTranslation;
	}

	public ChurchMusicalKeyTranslation removeChurchMusicalKeyTranslation(ChurchMusicalKeyTranslation churchMusicalKeyTranslation) {
		getChurchMusicalKeyTranslations().remove(churchMusicalKeyTranslation);
		churchMusicalKeyTranslation.setChurchMusicalKey(null);

		return churchMusicalKeyTranslation;
	}

	public List<MusicChurchMusic> getMusicChurchMusicList() {
		return this.musicChurchMusicList;
	}

	public void setMusicChurchMusicList(List<MusicChurchMusic> musicChurchMusicList) {
		this.musicChurchMusicList = musicChurchMusicList;
	}

	public MusicChurchMusic addMusicChurchMusic(MusicChurchMusic musicChurchMusic) {
		getMusicChurchMusicList().add(musicChurchMusic);
		musicChurchMusic.setChurchMusicalKey(this);

		return musicChurchMusic;
	}

	public MusicChurchMusic removeMusicChurchMusic(MusicChurchMusic musicChurchMusic) {
		getMusicChurchMusicList().remove(musicChurchMusic);
		musicChurchMusic.setChurchMusicalKey(null);

		return musicChurchMusic;
	}

}