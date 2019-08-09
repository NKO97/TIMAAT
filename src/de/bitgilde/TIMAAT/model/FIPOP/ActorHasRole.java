package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;
import java.util.List;


/**
 * The persistent class for the actor_has_role database table.
 * 
 */
@Entity
@Table(name="actor_has_role")
@NamedQuery(name="ActorHasRole.findAll", query="SELECT a FROM ActorHasRole a")
public class ActorHasRole implements Serializable {
	private static final long serialVersionUID = 1L;

	@EmbeddedId
	private ActorHasRolePK id;

	//bi-directional many-to-many association to Event
	@ManyToMany
	@JoinTable(
		name="event_has_actor_with_role"
		, joinColumns={
			@JoinColumn(name="Actor_has_Role_ActorID", referencedColumnName="ActorID"),
			@JoinColumn(name="Actor_has_Role_RoleID", referencedColumnName="RoleID")
			}
		, inverseJoinColumns={
			@JoinColumn(name="EventID")
			}
		)
	private List<Event> events;

	//bi-directional many-to-many association to Medium
	@ManyToMany
	@JoinTable(
		name="medium_has_actor_with_role"
		, joinColumns={
			@JoinColumn(name="Actor_has_Role_ActorID", referencedColumnName="ActorID"),
			@JoinColumn(name="Actor_has_Role_RoleID", referencedColumnName="RoleID")
			}
		, inverseJoinColumns={
			@JoinColumn(name="MediumID")
			}
		)
	private List<Medium> mediums;

	public ActorHasRole() {
	}

	public ActorHasRolePK getId() {
		return this.id;
	}

	public void setId(ActorHasRolePK id) {
		this.id = id;
	}

	public List<Event> getEvents() {
		return this.events;
	}

	public void setEvents(List<Event> events) {
		this.events = events;
	}

	public List<Medium> getMediums() {
		return this.mediums;
	}

	public void setMediums(List<Medium> mediums) {
		this.mediums = mediums;
	}

}