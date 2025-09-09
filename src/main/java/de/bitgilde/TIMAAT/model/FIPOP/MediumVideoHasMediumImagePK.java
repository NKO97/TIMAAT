package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

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
 * The primary key class for the medium_video_has_medium_image database table.
 *
 * @author Mirko Scherf <mscherf@uni-mainz.de>
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