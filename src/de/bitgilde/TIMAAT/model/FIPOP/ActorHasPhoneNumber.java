package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import jakarta.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;


/**
 * The persistent class for the actor_has_phone_number database table.
 * 
 */
@Entity
@Table(name="actor_has_phone_number")
@NamedQuery(name="ActorHasPhoneNumber.findAll", query="SELECT ahea FROM ActorHasPhoneNumber ahea")
public class ActorHasPhoneNumber implements Serializable {
	private static final long serialVersionUID = 1L;

	@EmbeddedId
	private ActorHasPhoneNumberPK id;

	//bi-directional many-to-one association to Actor
	@ManyToOne
	@JoinColumn(name="actor_id")
	@JsonIgnore
	private Actor actor;

	//bi-directional many-to-one association to PhoneNumber
	@ManyToOne
	@JoinColumn(name="phone_number_id")
	private PhoneNumber phoneNumber;

	//bi-directional many-to-one association to PhoneNumberType
	@ManyToOne
	@JoinColumn(name="phone_number_type_id")
	private PhoneNumberType phoneNumberType;

	public ActorHasPhoneNumber() {
	}

	public ActorHasPhoneNumber(Actor actor, PhoneNumber phoneNumber) {
		this.actor = actor;
		this.phoneNumber = phoneNumber;
		this.id = new ActorHasPhoneNumberPK(actor.getId(), phoneNumber.getId());
	}

	public ActorHasPhoneNumberPK getId() {
		return this.id;
	}

	public void setId(ActorHasPhoneNumberPK id) {
		this.id = id;
	}

	public Actor getActor() {
		return this.actor;
	}

	public void setActor(Actor actor) {
		this.actor = actor;
	}

	public PhoneNumber getPhoneNumber() {
		return this.phoneNumber;
	}

	public void setPhoneNumber(PhoneNumber phoneNumber) {
		this.phoneNumber = phoneNumber;
	}

	public PhoneNumberType getPhoneNumberType() {
		return this.phoneNumberType;
	}

	public void setPhoneNumberType(PhoneNumberType phoneNumberType) {
		this.phoneNumberType = phoneNumberType;
	}

}