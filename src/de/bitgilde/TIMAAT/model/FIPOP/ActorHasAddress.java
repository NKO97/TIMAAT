package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.Table;


/**
 * The persistent class for the actor_has_address database table.
 *
 */
@Entity
@Table(name="actor_has_address")
@NamedQuery(name="ActorHasAddress.findAll", query="SELECT aha FROM ActorHasAddress aha")
public class ActorHasAddress implements Serializable {
	private static final long serialVersionUID = 1L;

	@EmbeddedId
	private ActorHasAddressPK id;

	@Column(name="used_from", columnDefinition = "DATE")
	private Date usedFrom;

	@Column(name="used_until", columnDefinition = "DATE")
	private Date usedUntil;

	//bi-directional many-to-one association to Actor
	@ManyToOne
	@JoinColumn(name="actor_id")
	@JsonIgnore
	private Actor actor;

	//bi-directional many-to-one association to Address
	@ManyToOne
	@JoinColumn(name="address_id")
	private Address address;

	//bi-directional many-to-one association to AddressType
	@ManyToOne
	@JoinColumn(name="address_type_id")
	private AddressType addressType;

	public ActorHasAddress() {
	}

	public ActorHasAddress(Actor actor, Address address) {
		this.actor = actor;
		this.address = address;
		this.id = new ActorHasAddressPK(actor.getId(), address.getId());
	}

	public ActorHasAddressPK getId() {
		return this.id;
	}

	public void setId(ActorHasAddressPK id) {
		this.id = id;
	}

	public Date getUsedFrom() {
		return this.usedFrom;
	}

	public void setUsedFrom(Date usedFrom) {
		this.usedFrom = usedFrom;
	}

	public Date getUsedUntil() {
		return this.usedUntil;
	}

	public void setUsedUntil(Date usedUntil) {
		this.usedUntil = usedUntil;
	}

	public Actor getActor() {
		return this.actor;
	}

	public void setActor(Actor actor) {
		this.actor = actor;
	}

	public Address getAddress() {
		return this.address;
	}

	public void setAddress(Address address) {
		this.address = address;
	}

	public AddressType getAddressType() {
		return this.addressType;
	}

	public void setAddressType(AddressType addressType) {
		this.addressType = addressType;
	}

}