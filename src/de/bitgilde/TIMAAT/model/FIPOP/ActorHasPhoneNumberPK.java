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
 * The primary key class for the actor_has_phone_number database table.
 *
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Embeddable
public class ActorHasPhoneNumberPK implements Serializable {
	//default serial version id, required for serializable classes.
	private static final long serialVersionUID = 1L;

	@Column(name="actor_id", insertable=false, updatable=false)
	private int actorId;

	@Column(name="phone_number_id", insertable=false, updatable=false)
	private int phoneNumberId;

	public ActorHasPhoneNumberPK() {
	}

	public ActorHasPhoneNumberPK(int actorId, int phoneNumberId) {
		this.actorId = actorId;
		this.phoneNumberId = phoneNumberId;
	}

	public int getActorId() {
		return this.actorId;
	}

	public void setActorId(int actorId) {
		this.actorId = actorId;
	}

	public int getPhoneNumberId() {
		return this.phoneNumberId;
	}

	public void setPhoneNumberId(int phoneNumberId) {
		this.phoneNumberId = phoneNumberId;
	}

	public boolean equals(Object other) {
		if (this == other) {
			return true;
		}
		if (!(other instanceof ActorHasPhoneNumberPK)) {
			return false;
		}
		ActorHasPhoneNumberPK castOther = (ActorHasPhoneNumberPK)other;
		return
			(this.actorId == castOther.actorId)
			&& (this.phoneNumberId == castOther.phoneNumberId);
	}

	public int hashCode() {
		final int prime = 31;
		int hash = 17;
		hash = hash * prime + this.actorId;
		hash = hash * prime + this.phoneNumberId;

		return hash;
	}
}