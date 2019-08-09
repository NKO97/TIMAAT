package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;
import java.util.List;


/**
 * The persistent class for the address database table.
 * 
 */
@Entity
@NamedQuery(name="Address.findAll", query="SELECT a FROM Address a")
public class Address implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private int id;

	private String postalCode;

	private String postOfficeBox;

	private String streetAddressAddition;

	private String streetAddressNumber;

	//bi-directional many-to-one association to ActorHasAddress
	@OneToMany(mappedBy="address")
	private List<ActorHasAddress> actorHasAddresses;

	//bi-directional many-to-one association to Street
	@ManyToOne
	private Street street;

	public Address() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getPostalCode() {
		return this.postalCode;
	}

	public void setPostalCode(String postalCode) {
		this.postalCode = postalCode;
	}

	public String getPostOfficeBox() {
		return this.postOfficeBox;
	}

	public void setPostOfficeBox(String postOfficeBox) {
		this.postOfficeBox = postOfficeBox;
	}

	public String getStreetAddressAddition() {
		return this.streetAddressAddition;
	}

	public void setStreetAddressAddition(String streetAddressAddition) {
		this.streetAddressAddition = streetAddressAddition;
	}

	public String getStreetAddressNumber() {
		return this.streetAddressNumber;
	}

	public void setStreetAddressNumber(String streetAddressNumber) {
		this.streetAddressNumber = streetAddressNumber;
	}

	public List<ActorHasAddress> getActorHasAddresses() {
		return this.actorHasAddresses;
	}

	public void setActorHasAddresses(List<ActorHasAddress> actorHasAddresses) {
		this.actorHasAddresses = actorHasAddresses;
	}

	public ActorHasAddress addActorHasAddress(ActorHasAddress actorHasAddress) {
		getActorHasAddresses().add(actorHasAddress);
		actorHasAddress.setAddress(this);

		return actorHasAddress;
	}

	public ActorHasAddress removeActorHasAddress(ActorHasAddress actorHasAddress) {
		getActorHasAddresses().remove(actorHasAddress);
		actorHasAddress.setAddress(null);

		return actorHasAddress;
	}

	public Street getStreet() {
		return this.street;
	}

	public void setStreet(Street street) {
		this.street = street;
	}

}