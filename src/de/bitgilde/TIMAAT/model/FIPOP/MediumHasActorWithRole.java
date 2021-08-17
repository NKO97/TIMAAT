package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import jakarta.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;


/**
 * The persistent class for the medium_has_actor_with_role database table.
 * 
 */
@Entity
@Table(name="medium_has_actor_with_role")
@NamedQuery(name="MediumHasActorWithRole.findAll", query="SELECT m FROM MediumHasActorWithRole m")
public class MediumHasActorWithRole implements Serializable {
	private static final long serialVersionUID = 1L;

	@EmbeddedId
	private MediumHasActorWithRolePK id;

	@JoinColumn(name="actor_has_role_actor_id", nullable=false)
	private Actor actor;

	@JoinColumn(name="actor_has_role_role_id", nullable=false)
	private Role role;

	//bi-directional many-to-one association to Medium
	@ManyToOne
	@JoinColumn(name="medium_id")
	@JsonIgnore
	private Medium medium;

	public MediumHasActorWithRole() {
	}

	public MediumHasActorWithRolePK getId() {
		return this.id;
	}

	public void setId(MediumHasActorWithRolePK id) {
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

	public Medium getMedium() {
		return this.medium;
	}

	public void setMedium(Medium medium) {
		this.medium = medium;
	}

}