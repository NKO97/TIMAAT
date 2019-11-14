package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.util.List;


/**
 * The persistent class for the actor database table.
 * 
 */
@Entity
@NamedQuery(name="Actor.findAll", query="SELECT a FROM Actor a")
public class Actor implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	@Column(name="is_fictional")
	private byte isFictional;

	//bi-directional many-to-many association to ActorType
	@ManyToMany(mappedBy="actors")	
	private List<ActorType> actorTypes;

	@JoinColumn(name="created_by_user_account_id")
	private UserAccount createdByUserAccount;

	@JoinColumn(name="last_edited_by_user_account_id")
	private UserAccount lastEditedByUserAccount;

	@Column(name="created_at")
	private Timestamp createdAt;

	@Column(name="last_edited_at")
	private Timestamp lastEditedAt;
	
	//bi-directional many-to-one association to ActorHasAddress
	@OneToMany(mappedBy="actor")
	@JsonManagedReference(value = "Actor-ActorHasAddress")
	private List<ActorHasAddress> actorHasAddresses;

	//bi-directional many-to-one association to ActorHasEmailAddress
	@OneToMany(mappedBy="actor")
	@JsonManagedReference(value = "Actor-ActorHasEmailAddress")
	private List<ActorHasEmailAddress> actorHasEmailAddresses;

	//bi-directional many-to-many association to PhoneNumber
	@ManyToMany(mappedBy="actors")
	private List<PhoneNumber> phoneNumbers;

	//bi-directional many-to-many association to Role
	@ManyToMany(mappedBy="actors")
	private List<Role> roles;

	//bi-directional many-to-one association to ActorIsLocatedInCountry
	// @OneToMany(mappedBy="actor")
	// private List<ActorIsLocatedInCountry> actorIsLocatedInCountries;

	//bi-directional many-to-one association to ActorName
	@OneToMany(mappedBy="actor")
	@JsonManagedReference(value = "Actor-ActorName")
	private List<ActorName> actorNames;

	//bi-directional many-to-one association to ActorRelatesToActor
	@OneToMany(mappedBy="actor1")
	@JsonManagedReference(value = "Actor-ActorRelatesToActor1")
	private List<ActorRelatesToActor> actorRelatesToActors1;

	//bi-directional many-to-one association to ActorRelatesToActor
	@OneToMany(mappedBy="actor2")
	@JsonManagedReference(value = "Actor-ActorRelatesToActor2")
	private List<ActorRelatesToActor> actorRelatesToActors2;

	//bi-directional many-to-many association to Annotation
	@ManyToMany(mappedBy="actors")
	private List<Annotation> annotations;

	//bi-directional one-to-one association to Collective
	@OneToOne(mappedBy="actor")
	private Collective collective;

	//bi-directional many-to-one association to GreimasActantialModelHasActor
	// @OneToMany(mappedBy="actor")
	// private List<GreimasActantialModelHasActor> greimasActantialModelHasActors;

	//bi-directional one-to-one association to Person
	@OneToOne(mappedBy="actor")
	private Person person;

	//bi-directional many-to-one association to SiocUserAccount
	// @OneToMany(mappedBy="actor")
	// private List<SiocUserAccount> siocUserAccounts;

	//bi-directional many-to-one association to SpatialSemanticsTypePerson
	// @OneToMany(mappedBy="actor")
	// private List<SpatialSemanticsTypePerson> spatialSemanticsTypePersons;

	public Actor() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public byte getIsFictional() {
		return this.isFictional;
	}

	public void setIsFictional(byte isFictional) {
		this.isFictional = isFictional;
	}

	public String getName() {
		return this.actorNames.get(0).getName(); // TODO get correct list item
	}

	public void setName(String name) {
		this.actorNames.get(0).setName(name); // TODO get correct list item
	}

	public UserAccount getCreatedByUserAccount() {
		return this.createdByUserAccount;
	}

	public void setCreatedByUserAccount(UserAccount createdByUserAccount) {
		this.createdByUserAccount = createdByUserAccount;
	}
	
	public UserAccount getLastEditedByUserAccount() {
		return this.lastEditedByUserAccount;
	}

	public void setLastEditedByUserAccount(UserAccount lastEditedByUserAccount) {
		this.lastEditedByUserAccount = lastEditedByUserAccount;
	}

	public Timestamp getCreatedAt() {
		return this.createdAt;
	}

	public void setCreatedAt(Timestamp createdAt) {
		this.createdAt = createdAt;
	}

	public Timestamp getLastEditedAt() {
		return this.lastEditedAt;
	}

	public void setLastEditedAt(Timestamp lastEditedAt) {
		this.lastEditedAt = lastEditedAt;
	}

	public List<ActorType> getActorTypes() {
		return this.actorTypes;
	}

	public void setActorTypes(List<ActorType> actorTypes) {
		this.actorTypes = actorTypes;
	}

	public List<ActorHasAddress> getActorHasAddresses() {
		return this.actorHasAddresses;
	}

	public void setActorHasAddresses(List<ActorHasAddress> actorHasAddresses) {
		this.actorHasAddresses = actorHasAddresses;
	}

	public ActorHasAddress addActorHasAddress(ActorHasAddress actorHasAddress) {
		getActorHasAddresses().add(actorHasAddress);
		actorHasAddress.setActor(this);

		return actorHasAddress;
	}

	public ActorHasAddress removeActorHasAddress(ActorHasAddress actorHasAddress) {
		getActorHasAddresses().remove(actorHasAddress);
		actorHasAddress.setActor(null);

		return actorHasAddress;
	}

	public List<ActorHasEmailAddress> getActorHasEmailAddresses() {
		return this.actorHasEmailAddresses;
	}

	public void setActorHasEmailAddresses(List<ActorHasEmailAddress> actorHasEmailAddresses) {
		this.actorHasEmailAddresses = actorHasEmailAddresses;
	}

	public ActorHasEmailAddress addActorHasEmailAddress(ActorHasEmailAddress actorHasEmailAddress) {
		getActorHasEmailAddresses().add(actorHasEmailAddress);
		actorHasEmailAddress.setActor(this);

		return actorHasEmailAddress;
	}

	public ActorHasEmailAddress removeActorHasEmailAddress(ActorHasEmailAddress actorHasEmailAddress) {
		getActorHasEmailAddresses().remove(actorHasEmailAddress);
		actorHasEmailAddress.setActor(null);

		return actorHasEmailAddress;
	}

	public List<PhoneNumber> getPhoneNumbers() {
		return this.phoneNumbers;
	}

	public void setPhoneNumbers(List<PhoneNumber> phoneNumbers) {
		this.phoneNumbers = phoneNumbers;
	}

	public List<Role> getRoles() {
		return this.roles;
	}

	public void setRoles(List<Role> roles) {
		this.roles = roles;
	}

	// public List<ActorIsLocatedInCountry> getActorIsLocatedInCountries() {
	// 	return this.actorIsLocatedInCountries;
	// }

	// public void setActorIsLocatedInCountries(List<ActorIsLocatedInCountry> actorIsLocatedInCountries) {
	// 	this.actorIsLocatedInCountries = actorIsLocatedInCountries;
	// }

	// public ActorIsLocatedInCountry addActorIsLocatedInCountry(ActorIsLocatedInCountry actorIsLocatedInCountry) {
	// 	getActorIsLocatedInCountries().add(actorIsLocatedInCountry);
	// 	actorIsLocatedInCountry.setActor(this);

	// 	return actorIsLocatedInCountry;
	// }

	// public ActorIsLocatedInCountry removeActorIsLocatedInCountry(ActorIsLocatedInCountry actorIsLocatedInCountry) {
	// 	getActorIsLocatedInCountries().remove(actorIsLocatedInCountry);
	// 	actorIsLocatedInCountry.setActor(null);

	// 	return actorIsLocatedInCountry;
	// }

	public List<ActorName> getActorNames() {
		return this.actorNames;
	}

	public void setActorNames(List<ActorName> actorNames) {
		this.actorNames = actorNames;
	}

	public ActorName addActorName(ActorName actorName) {
		getActorNames().add(actorName);
		actorName.setActor(this);

		return actorName;
	}

	public ActorName removeActorName(ActorName actorName) {
		getActorNames().remove(actorName);
		actorName.setActor(null);

		return actorName;
	}

	public List<ActorRelatesToActor> getActorRelatesToActors1() {
		return this.actorRelatesToActors1;
	}

	public void setActorRelatesToActors1(List<ActorRelatesToActor> actorRelatesToActors1) {
		this.actorRelatesToActors1 = actorRelatesToActors1;
	}

	public ActorRelatesToActor addActorRelatesToActors1(ActorRelatesToActor actorRelatesToActors1) {
		getActorRelatesToActors1().add(actorRelatesToActors1);
		actorRelatesToActors1.setActor1(this);

		return actorRelatesToActors1;
	}

	public ActorRelatesToActor removeActorRelatesToActors1(ActorRelatesToActor actorRelatesToActors1) {
		getActorRelatesToActors1().remove(actorRelatesToActors1);
		actorRelatesToActors1.setActor1(null);

		return actorRelatesToActors1;
	}

	public List<ActorRelatesToActor> getActorRelatesToActors2() {
		return this.actorRelatesToActors2;
	}

	public void setActorRelatesToActors2(List<ActorRelatesToActor> actorRelatesToActors2) {
		this.actorRelatesToActors2 = actorRelatesToActors2;
	}

	public ActorRelatesToActor addActorRelatesToActors2(ActorRelatesToActor actorRelatesToActors2) {
		getActorRelatesToActors2().add(actorRelatesToActors2);
		actorRelatesToActors2.setActor2(this);

		return actorRelatesToActors2;
	}

	public ActorRelatesToActor removeActorRelatesToActors2(ActorRelatesToActor actorRelatesToActors2) {
		getActorRelatesToActors2().remove(actorRelatesToActors2);
		actorRelatesToActors2.setActor2(null);

		return actorRelatesToActors2;
	}

	public List<Annotation> getAnnotations() {
		return this.annotations;
	}

	public void setAnnotations(List<Annotation> annotations) {
		this.annotations = annotations;
	}

	public Collective getCollective() {
		return this.collective;
	}

	public void setCollective(Collective collective) {
		this.collective = collective;
	}

	// public List<GreimasActantialModelHasActor> getGreimasActantialModelHasActors() {
	// 	return this.greimasActantialModelHasActors;
	// }

	// public void setGreimasActantialModelHasActors(List<GreimasActantialModelHasActor> greimasActantialModelHasActors) {
	// 	this.greimasActantialModelHasActors = greimasActantialModelHasActors;
	// }

	// public GreimasActantialModelHasActor addGreimasActantialModelHasActor(GreimasActantialModelHasActor greimasActantialModelHasActor) {
	// 	getGreimasActantialModelHasActors().add(greimasActantialModelHasActor);
	// 	greimasActantialModelHasActor.setActor(this);

	// 	return greimasActantialModelHasActor;
	// }

	// public GreimasActantialModelHasActor removeGreimasActantialModelHasActor(GreimasActantialModelHasActor greimasActantialModelHasActor) {
	// 	getGreimasActantialModelHasActors().remove(greimasActantialModelHasActor);
	// 	greimasActantialModelHasActor.setActor(null);

	// 	return greimasActantialModelHasActor;
	// }

	public Person getPerson() {
		return this.person;
	}

	public void setPerson(Person person) {
		this.person = person;
	}

	// public List<SiocUserAccount> getSiocUserAccounts() {
	// 	return this.siocUserAccounts;
	// }

	// public void setSiocUserAccounts(List<SiocUserAccount> siocUserAccounts) {
	// 	this.siocUserAccounts = siocUserAccounts;
	// }

	// public SiocUserAccount addSiocUserAccount(SiocUserAccount siocUserAccount) {
	// 	getSiocUserAccounts().add(siocUserAccount);
	// 	siocUserAccount.setActor(this);

	// 	return siocUserAccount;
	// }

	// public SiocUserAccount removeSiocUserAccount(SiocUserAccount siocUserAccount) {
	// 	getSiocUserAccounts().remove(siocUserAccount);
	// 	siocUserAccount.setActor(null);

	// 	return siocUserAccount;
	// }

	// public List<SpatialSemanticsTypePerson> getSpatialSemanticsTypePersons() {
	// 	return this.spatialSemanticsTypePersons;
	// }

	// public void setSpatialSemanticsTypePersons(List<SpatialSemanticsTypePerson> spatialSemanticsTypePersons) {
	// 	this.spatialSemanticsTypePersons = spatialSemanticsTypePersons;
	// }

	// public SpatialSemanticsTypePerson addSpatialSemanticsTypePerson(SpatialSemanticsTypePerson spatialSemanticsTypePerson) {
	// 	getSpatialSemanticsTypePersons().add(spatialSemanticsTypePerson);
	// 	spatialSemanticsTypePerson.setActor(this);

	// 	return spatialSemanticsTypePerson;
	// }

	// public SpatialSemanticsTypePerson removeSpatialSemanticsTypePerson(SpatialSemanticsTypePerson spatialSemanticsTypePerson) {
	// 	getSpatialSemanticsTypePersons().remove(spatialSemanticsTypePerson);
	// 	spatialSemanticsTypePerson.setActor(null);

	// 	return spatialSemanticsTypePerson;
	// }

}