package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;


/**
 * The persistent class for the phone_number database table.
 *
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Entity
@Table(name="phone_number")
@NamedQuery(name="PhoneNumber.findAll", query="SELECT pn FROM PhoneNumber pn")
public class PhoneNumber implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	@Column(name="phone_number")
	private String phoneNumber;

	//bi-directional many-to-one association to ActorHasPhoneNumber
	@OneToMany(mappedBy="phoneNumber")
	@JsonIgnore
	private List<ActorHasPhoneNumber> actorHasPhoneNumbers;

	//bi-directional many-to-one association to Medium
	@OneToMany(mappedBy="primaryPhoneNumber")
	@JsonIgnore
	private List<Actor> actors;

	public PhoneNumber() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getPhoneNumber() {
		return this.phoneNumber;
	}

	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}

	public List<ActorHasPhoneNumber> getActorHasPhoneNumbers() {
		return this.actorHasPhoneNumbers;
	}

	public void setActorHasPhoneNumbers(List<ActorHasPhoneNumber> actorHasPhoneNumbers) {
		this.actorHasPhoneNumbers = actorHasPhoneNumbers;
	}

	public ActorHasPhoneNumber addActorHasPhoneNumber(ActorHasPhoneNumber actorHasPhoneNumber) {
		getActorHasPhoneNumbers().add(actorHasPhoneNumber);
		actorHasPhoneNumber.setPhoneNumber(this);

		return actorHasPhoneNumber;
	}

	public ActorHasPhoneNumber removeActorHasPhoneNumber(ActorHasPhoneNumber actorHasPhoneNumber) {
		getActorHasPhoneNumbers().remove(actorHasPhoneNumber);
		actorHasPhoneNumber.setPhoneNumber(null);

		return actorHasPhoneNumber;
	}

	public List<Actor> getActors() {
		return this.actors;
	}

	public void setActors(List<Actor> actors) {
		this.actors = actors;
	}

	public Actor addActors(Actor actors) {
		getActors().add(actors);
		actors.setPrimaryPhoneNumber(this);

		return actors;
	}

	public Actor removeActors(Actor actors) {
		getActors().remove(actors);
		actors.setPrimaryPhoneNumber(null);

		return actors;
	}

}