package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;
import java.util.Date;


/**
 * The persistent class for the actor_has_address database table.
 * 
 */
@Entity
@Table(name="actor_has_address")
@NamedQuery(name="ActorHasAddress.findAll", query="SELECT a FROM ActorHasAddress a")
public class ActorHasAddress implements Serializable {
	private static final long serialVersionUID = 1L;

	@EmbeddedId
	private ActorHasAddressPK id;

	@Temporal(TemporalType.DATE)
	private Date usedSince;

	@Temporal(TemporalType.DATE)
	private Date usedUntil;

	//bi-directional many-to-one association to Actor
	@ManyToOne
	@JoinColumn(name="ActorID")
	private Actor actor;

	//bi-directional many-to-one association to Address
	@ManyToOne
	@JoinColumn(name="AddressID")
	private Address address;

	//bi-directional many-to-one association to Addresstype
	@ManyToOne
	@JoinColumn(name="AddressTypeID")
	private Addresstype addresstype;

	public ActorHasAddress() {
	}

	public ActorHasAddressPK getId() {
		return this.id;
	}

	public void setId(ActorHasAddressPK id) {
		this.id = id;
	}

	public Date getUsedSince() {
		return this.usedSince;
	}

	public void setUsedSince(Date usedSince) {
		this.usedSince = usedSince;
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

	public Addresstype getAddresstype() {
		return this.addresstype;
	}

	public void setAddresstype(Addresstype addresstype) {
		this.addresstype = addresstype;
	}

}