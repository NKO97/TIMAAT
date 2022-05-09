package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.Table;


/**
 * The persistent class for the music_has_actor_with_role database table.
 *
 */
@Entity
@Table(name="music_has_actor_with_role")
@NamedQuery(name="MusicHasActorWithRole.findAll", query="SELECT m FROM MusicHasActorWithRole m")
public class MusicHasActorWithRole implements Serializable {
	private static final long serialVersionUID = 1L;

	@EmbeddedId
	private MusicHasActorWithRolePK id;

	@JoinColumn(name="actor_has_role_actor_id", nullable=false)
	private Actor actor;

	@JoinColumn(name="actor_has_role_role_id", nullable=false)
	private Role role;

	//bi-directional many-to-one association to Music
	@ManyToOne
	@JoinColumn(name="music_id")
	@JsonIgnore
	private Music music;

	public MusicHasActorWithRole() {
	}

	public MusicHasActorWithRolePK getId() {
		return this.id;
	}

	public void setId(MusicHasActorWithRolePK id) {
		this.id = id;
	}

	public Actor getActor() {
		return actor;
	}

	public void setActor(Actor actor) {
		this.actor = actor;
	}

	public Role getRole() {
		return role;
	}

	public void setRole(Role role) {
		this.role = role;
	}

	public Music getMusic() {
		return this.music;
	}

	public void setMusic(Music music) {
		this.music = music;
	}

}