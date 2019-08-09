package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

/**
 * The primary key class for the actor_has_role database table.
 * 
 */
@Embeddable
public class ActorHasRolePK implements Serializable {
	//default serial version id, required for serializable classes.
	private static final long serialVersionUID = 1L;

	@Column(insertable=false, updatable=false)
	private int actorID;

	@Column(insertable=false, updatable=false)
	private int roleID;

	public ActorHasRolePK() {
	}
	public int getActorID() {
		return this.actorID;
	}
	public void setActorID(int actorID) {
		this.actorID = actorID;
	}
	public int getRoleID() {
		return this.roleID;
	}
	public void setRoleID(int roleID) {
		this.roleID = roleID;
	}

	public boolean equals(Object other) {
		if (this == other) {
			return true;
		}
		if (!(other instanceof ActorHasRolePK)) {
			return false;
		}
		ActorHasRolePK castOther = (ActorHasRolePK)other;
		return 
			(this.actorID == castOther.actorID)
			&& (this.roleID == castOther.roleID);
	}

	public int hashCode() {
		final int prime = 31;
		int hash = 17;
		hash = hash * prime + this.actorID;
		hash = hash * prime + this.roleID;
		
		return hash;
	}
}