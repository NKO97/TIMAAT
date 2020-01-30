package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

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

	@Column(name="post_office_box")
	private String postOfficeBox;

	@Column(name="postal_code")
	private String postalCode;

	@Column(name="street_address_addition")
	private String streetAddressAddition;

	@Column(name="street_address_number")
	private String streetAddressNumber;

	//bi-directional many-to-one association to ActorHasAddress
	@OneToMany(mappedBy="address")
	@JsonManagedReference(value = "Address-ActorHasAddress")
	private List<ActorHasAddress> actorHasAddresses;

	//bi-directional many-to-one association to Street
	@ManyToOne
	@JsonBackReference(value = "Street-Address")
	private Street street;

	//bi-directional many-to-one association to Medium
	@OneToMany(mappedBy="primaryAddress")
	@JsonIgnore
	private List<Actor> actors;

	public Address() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getPostOfficeBox() {
		return this.postOfficeBox;
	}

	public void setPostOfficeBox(String postOfficeBox) {
		this.postOfficeBox = postOfficeBox;
	}

	public String getPostalCode() {
		return this.postalCode;
	}

	public void setPostalCode(String postalCode) {
		this.postalCode = postalCode;
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

	public ActorHasAddress addActorHasAddress(ActorHasAddress primaryAddress) {
		getActorHasAddresses().add(primaryAddress);
		primaryAddress.setAddress(this);

		return primaryAddress;
	}

	public ActorHasAddress removeActorHasAddress(ActorHasAddress primaryAddress) {
		getActorHasAddresses().remove(primaryAddress);
		primaryAddress.setAddress(null);

		return primaryAddress;
	}

	public Street getStreet() {
		return this.street;
	}

	public void setStreet(Street street) {
		this.street = street;
	}

	public List<Actor> getActors() {
		return this.actors;
	}

	public void setActors(List<Actor> actors) {
		this.actors = actors;
	}

	public Actor addActors(Actor actors) {
		getActors().add(actors);
		actors.setPrimaryAddress(this);

		return actors;
	}

	public Actor removeActors(Actor actors) {
		getActors().remove(actors);
		actors.setPrimaryAddress(null);

		return actors;
	}

}