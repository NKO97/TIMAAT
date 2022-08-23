package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
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
 * The persistent class for the song_structure_element database table.
 *
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Entity
@Table(name="song_structure_element")
@NamedQuery(name="SongStructureElement.findAll", query="SELECT s FROM SongStructureElement s")
public class SongStructureElement implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	private byte order;

	//bi-directional many-to-one association to SongStructureElementTranslation
	@OneToMany(mappedBy="songStructureElement")
	private List<SongStructureElementTranslation> songStructureElementTranslations;

	//bi-directional many-to-many association to SongStructure
	@ManyToMany
	@JsonIgnore
	@JoinTable(
		name="song_structure_has_song_structure_element"
		, joinColumns={
			@JoinColumn(name="song_structure_element_id")
			}
		, inverseJoinColumns={
			@JoinColumn(name="song_structure_id")
			}
		)
	private List<SongStructure> songStructures;

	public SongStructureElement() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public byte getOrder() {
		return this.order;
	}

	public void setOrder(byte order) {
		this.order = order;
	}

	public List<SongStructureElementTranslation> getSongStructureElementTranslations() {
		return this.songStructureElementTranslations;
	}

	public void setSongStructureElementTranslations(List<SongStructureElementTranslation> songStructureElementTranslations) {
		this.songStructureElementTranslations = songStructureElementTranslations;
	}

	public SongStructureElementTranslation addSongStructureElementTranslation(SongStructureElementTranslation songStructureElementTranslation) {
		getSongStructureElementTranslations().add(songStructureElementTranslation);
		songStructureElementTranslation.setSongStructureElement(this);

		return songStructureElementTranslation;
	}

	public SongStructureElementTranslation removeSongStructureElementTranslation(SongStructureElementTranslation songStructureElementTranslation) {
		getSongStructureElementTranslations().remove(songStructureElementTranslation);
		songStructureElementTranslation.setSongStructureElement(null);

		return songStructureElementTranslation;
	}

	public List<SongStructure> getSongStructures() {
		return this.songStructures;
	}

	public void setSongStructures(List<SongStructure> songStructures) {
		this.songStructures = songStructures;
	}

}