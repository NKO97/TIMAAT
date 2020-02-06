package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import java.util.List;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;


/**
 * The persistent class for the city database table.
 * 
 */
@Entity
@Table(name="city")
@NamedQuery(name="City.findAll", query="SELECT c FROM City c")
public class City implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name="location_id")
	private int locationId;

	//bi-directional one-to-one association to Location
	@OneToOne
	@PrimaryKeyJoinColumn(name="location_id")
	@JsonIgnore // City is accessed through Location
	private Location location;

	//bi-directional many-to-one association to ActorPerson
	@OneToMany(mappedBy="placeOfBirthCityLocation")
	// @JsonManagedReference(value = "City-ActorPerson1")
	private List<ActorPerson> actorPersons1;

	//bi-directional many-to-one association to ActorPerson
	@OneToMany(mappedBy="placeOfDeathCityLocation")
  // @JsonManagedReference(value = "City-ActorPerson2")
	private List<ActorPerson> actorPersons2;

	public City() {
	}

	public int getLocationId() {
		return this.locationId;
	}

	public void setLocationId(int locationId) {
		this.locationId = locationId;
	}

	// public int getId() { // TODO not necessary with getLocationId?
	// 	return this.getLocation().getId();
	// }

	// public void setId(int id) { // TODO not necessary with setLocationId?
	// 	this.getLocation().setId(id);
	// }

	public Location getLocation() {
		return this.location;
	}

	public void setLocation(Location location) {
		this.location = location;
	}

	public List<ActorPerson> getActorPersons1() {
		return this.actorPersons1;
	}

	public void setActorPersons1(List<ActorPerson> actorPersons1) {
		this.actorPersons1 = actorPersons1;
	}

	public ActorPerson addActorPersons1(ActorPerson actorPersons1) {
		getActorPersons1().add(actorPersons1);
		actorPersons1.setPlaceOfBirth(this);

		return actorPersons1;
	}

	public ActorPerson removeActorPersons1(ActorPerson actorPersons1) {
		getActorPersons1().remove(actorPersons1);
		actorPersons1.setPlaceOfBirth(null);

		return actorPersons1;
	}

	public List<ActorPerson> getActorPersons2() {
		return this.actorPersons2;
	}

	public void setActorPersons2(List<ActorPerson> actorPersons2) {
		this.actorPersons2 = actorPersons2;
	}

	public ActorPerson addActorPersons2(ActorPerson actorPersons2) {
		getActorPersons2().add(actorPersons2);
		actorPersons2.setPlaceOfDeath(this);

		return actorPersons2;
	}

	public ActorPerson removeActorPersons2(ActorPerson actorPersons2) {
		getActorPersons2().remove(actorPersons2);
		actorPersons2.setPlaceOfDeath(null);

		return actorPersons2;
	}

}