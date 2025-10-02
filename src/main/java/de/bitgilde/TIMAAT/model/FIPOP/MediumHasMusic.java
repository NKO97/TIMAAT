package de.bitgilde.TIMAAT.model.FIPOP;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

import java.io.Serializable;
import java.util.List;

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
 * The persistent class for the medium_has_music database table.
 *
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Entity
@Table(name="medium_has_music")
@NamedQuery(name="MediumHasMusic.findAll", query="SELECT m FROM MediumHasMusic m")
public class MediumHasMusic implements Serializable {
	private static final long serialVersionUID = 1L;

	@EmbeddedId
	private MediumHasMusicPK id;

	//bi-directional many-to-one association to Medium
	@ManyToOne
	@JsonBackReference(value = "Medium-MediumHasMusic")
  @JoinColumn(name="medium_id")
	private Medium medium;

	//bi-directional many-to-one association to Music
	@ManyToOne
  @JsonBackReference(value = "Music-MediumHasMusic")
  @JoinColumn(name="music_id")
	private Music music;

	//bi-directional many-to-one association to MediumHasMusicDetail
	@OneToMany(mappedBy="mediumHasMusic")
	private List<MediumHasMusicDetail> mediumHasMusicDetailList;


	public MediumHasMusic() {
	}

  public MediumHasMusic(Medium medium, Music music) {
    this.medium = medium;
    this.music = music;
    this.id = new MediumHasMusicPK(medium.getId(), music.getId());
  }

	public MediumHasMusicPK getId() {
		return this.id;
	}

	public void setId(MediumHasMusicPK id) {
		this.id = id;
	}

	public Medium getMedium() {
		return this.medium;
	}

	public void setMedium(Medium medium) {
		this.medium = medium;
	}

	public Music getMusic() {
		return this.music;
	}

	public void setMusic(Music music) {
		this.music = music;
	}

	public List<MediumHasMusicDetail> getMediumHasMusicDetailList() {
		return this.mediumHasMusicDetailList;
	}

	public void setMediumHasMusicDetailList(List<MediumHasMusicDetail> mediumHasMusicDetailList) {
		this.mediumHasMusicDetailList = mediumHasMusicDetailList;
	}

	public MediumHasMusicDetail addMediumHasMusicDetail(MediumHasMusicDetail mediumHasMusicDetail) {
		getMediumHasMusicDetailList().add(mediumHasMusicDetail);
		mediumHasMusicDetail.setMediumHasMusic(this);

		return mediumHasMusicDetail;
	}

	public MediumHasMusicDetail removeMediumHasMusicDetail(MediumHasMusicDetail mediumHasMusicDetail) {
		getMediumHasMusicDetailList().remove(mediumHasMusicDetail);
		mediumHasMusicDetail.setMediumHasMusic(null);

		return mediumHasMusicDetail;
	}


}