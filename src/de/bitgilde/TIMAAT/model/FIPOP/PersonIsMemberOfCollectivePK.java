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

	@Column(insertable=false, updatable=false)
	private int person_ActorID;

	@Column(insertable=false, updatable=false)
	private int memberOf_Collective_ActorID;

	public PersonIsMemberOfCollectivePK() {
	}
	public int getPerson_ActorID() {
		return this.person_ActorID;
	}
	public void setPerson_ActorID(int person_ActorID) {
		this.person_ActorID = person_ActorID;
	}
	public int getMemberOf_Collective_ActorID() {
		return this.memberOf_Collective_ActorID;
	}
	public void setMemberOf_Collective_ActorID(int memberOf_Collective_ActorID) {
		this.memberOf_Collective_ActorID = memberOf_Collective_ActorID;
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
			(this.person_ActorID == castOther.person_ActorID)
			&& (this.memberOf_Collective_ActorID == castOther.memberOf_Collective_ActorID);
	}

	public int hashCode() {
		final int prime = 31;
		int hash = 17;
		hash = hash * prime + this.person_ActorID;
		hash = hash * prime + this.memberOf_Collective_ActorID;
		
		return hash;
	}
}