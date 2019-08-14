package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.*;
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

	private byte isFictional;

	//bi-directional many-to-one association to UserAccount
	// @ManyToOne
	// @JoinColumn(name="created_by_user_account_id")
	// private UserAccount created_by_user_account_id;
	private int created_by_user_account_id;

	//bi-directional many-to-one association to UserAccount
	// @ManyToOne
	// @JoinColumn(name="last_edited_by_user_account_id")
	// private UserAccount last_edited_by_user_account_id;
	private int last_edited_by_user_account_id;

	private Timestamp created_at;

	private Timestamp last_edited_at;

	//bi-directional many-to-one association to ActorHasAddress
	@OneToMany(mappedBy="actor")
	private List<ActorHasAddress> actorHasAddresses;

	//bi-directional many-to-one association to ActorHasEmailaddress
	@OneToMany(mappedBy="actor")
	private List<ActorHasEmailaddress> actorHasEmailaddresses;

	//bi-directional many-to-one association to ActorIsLocatedInCountry
	// @OneToMany(mappedBy="actor")
	// private List<ActorIsLocatedInCountry> actorIsLocatedInCountries;

	//bi-directional many-to-one association to ActorRelatesToActor
	@OneToMany(mappedBy="actor1")
	private List<ActorRelatesToActor> actorRelatesToActors1;

	//bi-directional many-to-one association to ActorRelatesToActor
	@OneToMany(mappedBy="actor2")
	private List<ActorRelatesToActor> actorRelatesToActors2;

	//bi-directional many-to-one association to Actorname
	@OneToMany(mappedBy="actor")
	private List<Actorname> actornames;

	//bi-directional many-to-many association to Actortype
	@ManyToMany(mappedBy="actors")
	private List<Actortype> actortypes;

	//bi-directional many-to-many association to Annotation
	// @ManyToMany(mappedBy="actors")
	// private List<Annotation> annotations;

	//bi-directional one-to-one association to Collective
	@OneToOne(mappedBy="actor")
	private Collective collective;

	//bi-directional many-to-one association to GreimasactantialmodelHasActor
	// @OneToMany(mappedBy="actor")
	// private List<GreimasactantialmodelHasActor> greimasactantialmodelHasActors;

	//bi-directional one-to-one association to Person
	@OneToOne(mappedBy="actor")
	private Person person;

	//bi-directional many-to-many association to Phonenumber
	@ManyToMany(mappedBy="actors")
	private List<Phonenumber> phonenumbers;

	//bi-directional many-to-many association to Role
	// @ManyToMany(mappedBy="actors")
	// private List<Role> roles;

	//bi-directional many-to-many association to Role
	// @ManyToMany(mappedBy="actor")
	// private List<ActorHasRole> actorHasRoles;

	//bi-directional many-to-one association to Siocuseraccount
	// @OneToMany(mappedBy="actor")
	// private List<Siocuseraccount> siocuseraccounts;

	//bi-directional many-to-one association to Source // TODO there should be no connection between actor and source
	// @OneToMany(mappedBy="actor")
	// private List<Source> sources;

	//bi-directional many-to-one association to Spatialsemanticstypeperson
	// @OneToMany(mappedBy="actor")
	// private List<Spatialsemanticstypeperson> spatialsemanticstypepersons;

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
		return this.actornames.get(0).getName(); // TODO get correct list item
	}

	public void setName(String name) {
		this.actornames.get(0).setName(name); // TODO get correct list item
	}

	public int getCreatedByUserAccountID() {
		return this.created_by_user_account_id;
	}

	public void setCreatedByUserAccountID(int created_by_user_account_id) {
		this.created_by_user_account_id = created_by_user_account_id;
	}
	
	public int getLastEditedByUserAccountID() {
		return this.last_edited_by_user_account_id;
	}

	public void setLastEditedByUserAccountID(int last_edited_by_user_account_id) {
		this.last_edited_by_user_account_id = last_edited_by_user_account_id;
	}

	// public UserAccount getCreatedByUserAccountID() {
	// 	return this.created_by_user_account_id;
	// }

	// public void setCreatedByUserAccountID(UserAccount created_by_user_account_id) {
	// 	this.created_by_user_account_id = created_by_user_account_id;
	// }
	
	// public UserAccount getLastEditedByUserAccountID() {
	// 	return this.last_edited_by_user_account_id;
	// }

	// public void setLastEditedByUserAccountID(UserAccount last_edited_by_user_account_id) {
	// 	this.last_edited_by_user_account_id = last_edited_by_user_account_id;
	// }

	public Timestamp getCreatedAt() {
		return this.created_at;
	}

	public void setCreatedAt(Timestamp created_at) {
		this.created_at = created_at;
	}

	public Timestamp getLastEditedAt() {
		return this.last_edited_at;
	}

	public void setLastEditedAt(Timestamp last_edited_at) {
		this.last_edited_at = last_edited_at;
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

	public List<ActorHasEmailaddress> getActorHasEmailaddresses() {
		return this.actorHasEmailaddresses;
	}

	public void setActorHasEmailaddresses(List<ActorHasEmailaddress> actorHasEmailaddresses) {
		this.actorHasEmailaddresses = actorHasEmailaddresses;
	}

	public ActorHasEmailaddress addActorHasEmailaddress(ActorHasEmailaddress actorHasEmailaddress) {
		getActorHasEmailaddresses().add(actorHasEmailaddress);
		actorHasEmailaddress.setActor(this);

		return actorHasEmailaddress;
	}

	public ActorHasEmailaddress removeActorHasEmailaddress(ActorHasEmailaddress actorHasEmailaddress) {
		getActorHasEmailaddresses().remove(actorHasEmailaddress);
		actorHasEmailaddress.setActor(null);

		return actorHasEmailaddress;
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

	public List<Actorname> getActornames() {
		return this.actornames;
	}

	public void setActornames(List<Actorname> actornames) {
		this.actornames = actornames;
	}

	public Actorname addActorname(Actorname actorname) {
		getActornames().add(actorname);
		actorname.setActor(this);

		return actorname;
	}

	public Actorname removeActorname(Actorname actorname) {
		getActornames().remove(actorname);
		actorname.setActor(null);

		return actorname;
	}

	public List<Actortype> getActortypes() {
		return this.actortypes;
	}

	public void setActortypes(List<Actortype> actortypes) {
		this.actortypes = actortypes;
	}

	// public List<Annotation> getAnnotations() {
	// 	return this.annotations;
	// }

	// public void setAnnotations(List<Annotation> annotations) {
	// 	this.annotations = annotations;
	// }

	public Collective getCollective() {
		return this.collective;
	}

	public void setCollective(Collective collective) {
		this.collective = collective;
	}

	// public List<GreimasactantialmodelHasActor> getGreimasactantialmodelHasActors() {
	// 	return this.greimasactantialmodelHasActors;
	// }

	// public void setGreimasactantialmodelHasActors(List<GreimasactantialmodelHasActor> greimasactantialmodelHasActors) {
	// 	this.greimasactantialmodelHasActors = greimasactantialmodelHasActors;
	// }

	// public GreimasactantialmodelHasActor addGreimasactantialmodelHasActor(GreimasactantialmodelHasActor greimasactantialmodelHasActor) {
	// 	getGreimasactantialmodelHasActors().add(greimasactantialmodelHasActor);
	// 	greimasactantialmodelHasActor.setActor(this);

	// 	return greimasactantialmodelHasActor;
	// }

	// public GreimasactantialmodelHasActor removeGreimasactantialmodelHasActor(GreimasactantialmodelHasActor greimasactantialmodelHasActor) {
	// 	getGreimasactantialmodelHasActors().remove(greimasactantialmodelHasActor);
	// 	greimasactantialmodelHasActor.setActor(null);

	// 	return greimasactantialmodelHasActor;
	// }

	public Person getPerson() {
		return this.person;
	}

	public void setPerson(Person person) {
		this.person = person;
	}

	public List<Phonenumber> getPhonenumbers() {
		return this.phonenumbers;
	}

	public void setPhonenumbers(List<Phonenumber> phonenumbers) {
		this.phonenumbers = phonenumbers;
	}

	// public List<Role> getRoles() {
	// 	return this.roles;
	// }

	// public void setRoles(List<Role> roles) {
	// 	this.roles = roles;
	// }

	// public List<ActorHasRole> getActorHasRoles() {
	// 	return this.actorHasRoles;
	// }

	// public void setActorHasRoles(List<ActorHasRole> actorHasRoles) {
	// 	this.actorHasRoles = actorHasRoles;
	// }

	// public ActorHasRole addActorHasRole(ActorHasRole actorHasRole) {
	// 	getActorHasRoles().add(actorHasRole);
	// 	actorHasRole.setActor(this);

	// 	return actorHasRole;
	// }

	// public ActorHasRole removeActorHasRole(ActorHasRole actorHasRole) {
	// 	getActorHasRoles().remove(actorHasRole);
	// 	actorHasRole.setActor(null);

	// 	return actorHasRole;
	// }

	// public List<Siocuseraccount> getSiocuseraccounts() {
	// 	return this.siocuseraccounts;
	// }

	// public void setSiocuseraccounts(List<Siocuseraccount> siocuseraccounts) {
	// 	this.siocuseraccounts = siocuseraccounts;
	// }

	// public Siocuseraccount addSiocuseraccount(Siocuseraccount siocuseraccount) {
	// 	getSiocuseraccounts().add(siocuseraccount);
	// 	siocuseraccount.setActor(this);

	// 	return siocuseraccount;
	// }

	// public Siocuseraccount removeSiocuseraccount(Siocuseraccount siocuseraccount) {
	// 	getSiocuseraccounts().remove(siocuseraccount);
	// 	siocuseraccount.setActor(null);

	// 	return siocuseraccount;
	// }

	// public List<Source> getSources() {
	// 	return this.sources;
	// }

	// public void setSources(List<Source> sources) {
	// 	this.sources = sources;
	// }

	// public Source addSource(Source source) { // TODO connection between Actor and Source?
	// 	getSources().add(source);
	// 	source.setActor(this);

	// 	return source;
	// }

	// public Source removeSource(Source source) {
	// 	getSources().remove(source);
	// 	source.setActor(null);

	// 	return source;
	// }

	// public List<Spatialsemanticstypeperson> getSpatialsemanticstypepersons() {
	// 	return this.spatialsemanticstypepersons;
	// }

	// public void setSpatialsemanticstypepersons(List<Spatialsemanticstypeperson> spatialsemanticstypepersons) {
	// 	this.spatialsemanticstypepersons = spatialsemanticstypepersons;
	// }

	// public Spatialsemanticstypeperson addSpatialsemanticstypeperson(Spatialsemanticstypeperson spatialsemanticstypeperson) {
	// 	getSpatialsemanticstypepersons().add(spatialsemanticstypeperson);
	// 	spatialsemanticstypeperson.setActor(this);

	// 	return spatialsemanticstypeperson;
	// }

	// public Spatialsemanticstypeperson removeSpatialsemanticstypeperson(Spatialsemanticstypeperson spatialsemanticstypeperson) {
	// 	getSpatialsemanticstypepersons().remove(spatialsemanticstypeperson);
	// 	spatialsemanticstypeperson.setActor(null);

	// 	return spatialsemanticstypeperson;
	// }

}