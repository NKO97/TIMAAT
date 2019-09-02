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

	@Column(name="actor_id") //, insertable=false, updatable=false) // TODO check why this has to be commented out to work
	private int actorId;

	@Column(name="role_id") //, insertable=false, updatable=false) // TODO check why this has to be commented out to work
	private int roleId;

	public ActorHasRolePK() {
	}
	// public ActorHasRolePK(int actorId, int roleId) {
	// 	this.actorId = actorId;
	// 	this.roleId = roleId;
	// }
	public int getActorId() {
		return this.actorId;
	}
	public void setActorId(int actorId) {
		this.actorId = actorId;
	}
	public int getRoleId() {
		return this.roleId;
	}
	public void setRoleId(int roleId) {
		this.roleId = roleId;
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
			(this.actorId == castOther.actorId)
			&& (this.roleId == castOther.roleId);
	}

	public int hashCode() {
		final int prime = 31;
		int hash = 17;
		hash = hash * prime + this.actorId;
		hash = hash * prime + this.roleId;
		
		return hash;
	}
}