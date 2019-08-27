package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;
import java.util.List;


/**
 * The persistent class for the phonenumber database table.
 * 
 */
@Entity
@NamedQuery(name="Phonenumber.findAll", query="SELECT p FROM Phonenumber p")
public class Phonenumber implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private int id;

	private int areaCode;

	private int phoneNumber;

	//bi-directional many-to-many association to Actor
	@ManyToMany
	@JoinTable(
		name="actor_has_phonenumber"
		, joinColumns={
			@JoinColumn(name="PhoneNumberID")
			}
		, inverseJoinColumns={
			@JoinColumn(name="ActorID")
			}
		)
	private List<Actor> actors;

	//bi-directional many-to-one association to Country
	@ManyToOne
	@JoinColumn(name="IDDPrefix_Country_LocationID")
	private Country country;

	//bi-directional many-to-one association to Phonenumbertype
	@ManyToOne
	@JoinColumn(name="PhoneNumberTypeID")
	private Phonenumbertype phonenumbertype;

	public Phonenumber() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public int getAreaCode() {
		return this.areaCode;
	}

	public void setAreaCode(int areaCode) {
		this.areaCode = areaCode;
	}

	public int getPhoneNumber() {
		return this.phoneNumber;
	}

	public void setPhoneNumber(int phoneNumber) {
		this.phoneNumber = phoneNumber;
	}

	public List<Actor> getActors() {
		return this.actors;
	}

	public void setActors(List<Actor> actors) {
		this.actors = actors;
	}

	public Country getCountry() {
		return this.country;
	}

	public void setCountry(Country country) {
		this.country = country;
	}

	public Phonenumbertype getPhonenumbertype() {
		return this.phonenumbertype;
	}

	public void setPhonenumbertype(Phonenumbertype phonenumbertype) {
		this.phonenumbertype = phonenumbertype;
	}

}