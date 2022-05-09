package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

/**
 * The primary key class for the medium_has_music database table.
 *
 */
@Embeddable
public class MediumHasMusicPK implements Serializable {
	//default serial version id, required for serializable classes.
	private static final long serialVersionUID = 1L;

	@Column(name="medium_id", insertable=false, updatable=false)
	private int mediumId;

	@Column(name="music_id", insertable=false, updatable=false)
	private int musicId;

	public MediumHasMusicPK() {
	}
  public MediumHasMusicPK(int mediumId, int musicId) {
    this.mediumId = mediumId;
    this.musicId = musicId;
  }
	public int getMediumId() {
		return this.mediumId;
	}
	public void setMediumId(int mediumId) {
		this.mediumId = mediumId;
	}
	public int getMusicId() {
		return this.musicId;
	}
	public void setMusicId(int musicId) {
		this.musicId = musicId;
	}

	public boolean equals(Object other) {
		if (this == other) {
			return true;
		}
		if (!(other instanceof MediumHasMusicPK)) {
			return false;
		}
		MediumHasMusicPK castOther = (MediumHasMusicPK)other;
		return
			(this.mediumId == castOther.mediumId)
			&& (this.musicId == castOther.musicId);
	}

	public int hashCode() {
		final int prime = 31;
		int hash = 17;
		hash = hash * prime + this.mediumId;
		hash = hash * prime + this.musicId;

		return hash;
	}
}