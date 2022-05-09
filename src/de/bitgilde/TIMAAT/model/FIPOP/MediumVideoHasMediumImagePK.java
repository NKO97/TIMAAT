package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

/**
 * The primary key class for the medium_video_has_medium_image database table.
 *
 */
@Embeddable
public class MediumVideoHasMediumImagePK implements Serializable {
	//default serial version id, required for serializable classes.
	private static final long serialVersionUID = 1L;

	@Column(name="medium_video_medium_id", insertable=false, updatable=false)
	private int mediumVideoMediumId;

	@Column(name="medium_image_medium_id", insertable=false, updatable=false)
	private int mediumImageMediumId;

	public MediumVideoHasMediumImagePK() {
	}
	public int getMediumVideoMediumId() {
		return this.mediumVideoMediumId;
	}
	public void setMediumVideoMediumId(int mediumVideoMediumId) {
		this.mediumVideoMediumId = mediumVideoMediumId;
	}
	public int getMediumImageMediumId() {
		return this.mediumImageMediumId;
	}
	public void setMediumImageMediumId(int mediumImageMediumId) {
		this.mediumImageMediumId = mediumImageMediumId;
	}

	public boolean equals(Object other) {
		if (this == other) {
			return true;
		}
		if (!(other instanceof MediumVideoHasMediumImagePK)) {
			return false;
		}
		MediumVideoHasMediumImagePK castOther = (MediumVideoHasMediumImagePK)other;
		return
			(this.mediumVideoMediumId == castOther.mediumVideoMediumId)
			&& (this.mediumImageMediumId == castOther.mediumImageMediumId);
	}

	public int hashCode() {
		final int prime = 31;
		int hash = 17;
		hash = hash * prime + this.mediumVideoMediumId;
		hash = hash * prime + this.mediumImageMediumId;

		return hash;
	}
}