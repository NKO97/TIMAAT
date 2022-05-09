package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToMany;


/**
 * The persistent class for the address database table.
 *
 */
@Entity
@NamedQuery(name="Address.findAll", query="SELECT a FROM Address a")
public class Address implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	@Column(name="post_office_box")
	private String postOfficeBox;

	@Column(name="postal_code")
	private String postalCode;

	@Column(name="street_addition")
	private String streetAddition;

	@Column(name="street_number")
	private String streetNumber;

	//bi-directional many-to-one association to ActorHasAddress
	@OneToMany(mappedBy="address")
	@JsonIgnore
	private List<ActorHasAddress> actorHasAddresses;

	//bi-directional many-to-one association to Street
	@ManyToOne
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

	public String getStreetAddition() {
		return this.streetAddition;
	}

	public void setStreetAddition(String streetAddition) {
		this.streetAddition = streetAddition;
	}

	public String getStreetNumber() {
		return this.streetNumber;
	}

	public void setStreetNumber(String streetNumber) {
		this.streetNumber = streetNumber;
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