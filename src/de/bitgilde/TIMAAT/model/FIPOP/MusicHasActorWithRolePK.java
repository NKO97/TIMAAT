package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import jakarta.persistence.*;

/**
 * The primary key class for the music_has_actor_with_role database table.
 * 
 */
@Embeddable
public class MusicHasActorWithRolePK implements Serializable {
	//default serial version id, required for serializable classes.
	private static final long serialVersionUID = 1L;

	@Column(name="music_id", insertable=false, updatable=false, unique=true, nullable=false)
	private int musicId;

	@Column(name="actor_has_role_actor_id", insertable=false, updatable=false, unique=true, nullable=false)
	private int actorHasRoleActorId;

	@Column(name="actor_has_role_role_id", insertable=false, updatable=false, unique=true, nullable=false)
	private int actorHasRoleRoleId;

	public MusicHasActorWithRolePK() {
	}
	public int getMusicId() {
		return this.musicId;
	}
	public void setMusicId(int musicId) {
		this.musicId = musicId;
	}
	public int getActorHasRoleActorId() {
		return this.actorHasRoleActorId;
	}
	public void setActorHasRoleActorId(int actorHasRoleActorId) {
		this.actorHasRoleActorId = actorHasRoleActorId;
	}
	public int getActorHasRoleRoleId() {
		return this.actorHasRoleRoleId;
	}
	public void setActorHasRoleRoleId(int actorHasRoleRoleId) {
		this.actorHasRoleRoleId = actorHasRoleRoleId;
	}

	public boolean equals(Object other) {
		if (this == other) {
			return true;
		}
		if (!(other instanceof MusicHasActorWithRolePK)) {
			return false;
		}
		MusicHasActorWithRolePK castOther = (MusicHasActorWithRolePK)other;
		return 
			(this.musicId == castOther.musicId)
			&& (this.actorHasRoleActorId == castOther.actorHasRoleActorId)
			&& (this.actorHasRoleRoleId == castOther.actorHasRoleRoleId);
	}

	public int hashCode() {
		final int prime = 31;
		int hash = 17;
		hash = hash * prime + this.musicId;
		hash = hash * prime + this.actorHasRoleActorId;
		hash = hash * prime + this.actorHasRoleRoleId;
		
		return hash;
	}
}