package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonBackReference;

import java.util.List;


/**
 * The persistent class for the phone_number database table.
 * 
 */
@Entity
@Table(name="phone_number")
@NamedQuery(name="PhoneNumber.findAll", query="SELECT pn FROM PhoneNumber pn")
public class PhoneNumber implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private int id;

	@Column(name="area_code")
	private int areaCode;

	@Column(name="phone_number")
	private int phoneNumber;

	//bi-directional many-to-many association to Actor
	@ManyToMany
	@JoinTable(
		name="actor_has_phone_number"
		, joinColumns={
			@JoinColumn(name="phone_number_id")
			}
		, inverseJoinColumns={
			@JoinColumn(name="actor_id")
			}
		)
	private List<Actor> actors;

	//bi-directional many-to-one association to Country
	@ManyToOne
	@JoinColumn(name="idd_prefix_country_location_id")
	@JsonBackReference(value = "Country-PhoneNumber")
	private Country country;

	//bi-directional many-to-one association to PhoneNumberType
	@ManyToOne
	@JoinColumn(name="phone_number_type_id")
	@JsonBackReference(value = "PhoneNumberType-PhoneNumber")
	private PhoneNumberType phoneNumberType;

	public PhoneNumber() {
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

	public PhoneNumberType getPhoneNumberType() {
		return this.phoneNumberType;
	}

	public void setPhoneNumberType(PhoneNumberType phoneNumberType) {
		this.phoneNumberType = phoneNumberType;
	}

}