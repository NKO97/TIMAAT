package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
 * The persistent class for the music_type database table.
 *
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Entity
@Table(name="music_text_setting_element")
@NamedQuery(name="MusicTextSettingElement.findAll", query="SELECT m FROM MusicTextSettingElement m")
public class MusicTextSettingElement implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	@Column(name="end_time", columnDefinition = "INT")
	private long endTime;

	@Column(name="start_time", columnDefinition = "INT")
	private long startTime;

	//bi-directional many-to-one association to Music
	@ManyToOne
	@JoinColumn(name = "music_id")
	@JsonBackReference(value = "Music-MusicTextSettingElement")
	private Music music;

	// bi-directional many-to-one association to MusicTextSettingElementType
	@ManyToOne
	@JoinColumn(name="music_text_setting_element_type_id")
	private MusicTextSettingElementType musicTextSettingElementType;

	public MusicTextSettingElement() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public long getEndTime() {
		return this.endTime;
	}

	public void setEndTime(long endTime) {
		this.endTime = endTime;
	}

	public long getStartTime() {
		return this.startTime;
	}

	public void setStartTime(long startTime) {
		this.startTime = startTime;
	}

	public Music getMusic() {
		return this.music;
	}

	public void setMusic(Music music) {
		this.music = music;
	}

	public MusicTextSettingElementType getMusicTextSettingElementType() {
		return this.musicTextSettingElementType;
	}

	public void setMusicTextSettingElementType (MusicTextSettingElementType musicTextSettingElementType) {
		this.musicTextSettingElementType = musicTextSettingElementType;
	}


}