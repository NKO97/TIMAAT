package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

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
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	@Column(name="phone_number")
	private String phoneNumber;

	//bi-directional many-to-one association to ActorHasPhoneNumber
	@OneToMany(mappedBy="phoneNumber")
	@JsonIgnore
	private List<ActorHasPhoneNumber> actorHasPhoneNumbers;

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

}