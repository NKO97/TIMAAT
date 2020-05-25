package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.List;


/**
 * The persistent class for the actor_has_role database table.
 * 
 */
@Entity
@Table(name="actor_has_role")
@NamedQuery(name="ActorHasRole.findAll", query="SELECT ahr FROM ActorHasRole ahr")
public class ActorHasRole implements Serializable {
	private static final long serialVersionUID = 1L;

	@EmbeddedId
	private ActorHasRolePK id;

	//bi-directional many-to-many association to Event
	@ManyToMany(mappedBy="actorHasRoles")
	@JsonIgnore
	private List<Event> events;

	//bi-directional many-to-many association to Medium
	@ManyToMany(mappedBy="actorHasRoles")
	@JsonIgnore
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