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
 * The primary key class for the medium_relates_to_event database table.
 *
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Embeddable
public class MediumRelatesToEventPK implements Serializable {
	//default serial version id, required for serializable classes.
	private static final long serialVersionUID = 1L;

	@Column(name="medium_id", insertable=false, updatable=false)
	private int mediumId;

	@Column(name="event_id", insertable=false, updatable=false)
	private int eventId;

	@Column(name="medium_event_relationship_type_id", insertable=false, updatable=false)
	private int mediumEventRelationshipTypeId;

	public MediumRelatesToEventPK() {
	}
	public int getMediumId() {
		return this.mediumId;
	}
	public void setMediumId(int mediumId) {
		this.mediumId = mediumId;
	}
	public int getEventId() {
		return this.eventId;
	}
	public void setEventId(int eventId) {
		this.eventId = eventId;
	}
	public int getMediumEventRelationshipTypeId() {
		return this.mediumEventRelationshipTypeId;
	}
	public void setMediumEventRelationshipTypeId(int mediumEventRelationshipTypeId) {
		this.mediumEventRelationshipTypeId = mediumEventRelationshipTypeId;
	}

	public boolean equals(Object other) {
		if (this == other) {
			return true;
		}
		if (!(other instanceof MediumRelatesToEventPK)) {
			return false;
		}
		MediumRelatesToEventPK castOther = (MediumRelatesToEventPK)other;
		return
			(this.mediumId == castOther.mediumId)
			&& (this.eventId == castOther.eventId)
			&& (this.mediumEventRelationshipTypeId == castOther.mediumEventRelationshipTypeId);
	}

	public int hashCode() {
		final int prime = 31;
		int hash = 17;
		hash = hash * prime + this.mediumId;
		hash = hash * prime + this.eventId;
		hash = hash * prime + this.mediumEventRelationshipTypeId;

		return hash;
	}
}