package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;


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