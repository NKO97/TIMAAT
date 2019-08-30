package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

/**
 * The primary key class for the person_is_member_of_collective database table.
 * 
 */
@Embeddable
public class PersonIsMemberOfCollectivePK implements Serializable {
	//default serial version id, required for serializable classes.
	private static final long serialVersionUID = 1L;

	@Column(name="person_actor_id", insertable=false, updatable=false)
	private int personActorId;

	@Column(name="member_of_collective_actor_id", insertable=false, updatable=false)
	private int memberOfCollectiveActorId;

	public PersonIsMemberOfCollectivePK() {
	}
	public int getPersonActorId() {
		return this.personActorId;
	}
	public void setPersonActorId(int personActorId) {
		this.personActorId = personActorId;
	}
	public int getMemberOfCollectiveActorId() {
		return this.memberOfCollectiveActorId;
	}
	public void setMemberOfCollectiveActorId(int memberOfCollectiveActorId) {
		this.memberOfCollectiveActorId = memberOfCollectiveActorId;
	}

	public boolean equals(Object other) {
		if (this == other) {
			return true;
		}
		if (!(other instanceof PersonIsMemberOfCollectivePK)) {
			return false;
		}
		PersonIsMemberOfCollectivePK castOther = (PersonIsMemberOfCollectivePK)other;
		return 
			(this.personActorId == castOther.personActorId)
			&& (this.memberOfCollectiveActorId == castOther.memberOfCollectiveActorId);
	}

	public int hashCode() {
		final int prime = 31;
		int hash = 17;
		hash = hash * prime + this.personActorId;
		hash = hash * prime + this.memberOfCollectiveActorId;
		
		return hash;
	}
}