package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;
import java.util.Date;
import java.util.List;


/**
 * The persistent class for the person database table.
 * 
 */
@Entity
@NamedQuery(name="Person.findAll", query="SELECT p FROM Person p")
public class Person implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private int actorID;

	@Temporal(TemporalType.DATE)
	private Date dateOfBirth;

	@Temporal(TemporalType.DATE)
	private Date dayOfDeath;

	private String specialFeatures;

	//bi-directional many-to-one association to Lineupmember
	// @OneToMany(mappedBy="person")
	// private List<Lineupmember> lineupmembers;

	//bi-directional many-to-one association to Academictitle
	@ManyToOne
	@JoinColumn(name="AcademicTitleID")
	private Academictitle academictitle;

	//bi-directional one-to-one association to Actor
	@OneToOne
	@JoinColumn(name="ActorID")
	private Actor actor;

	//bi-directional many-to-many association to Citizenship
	@ManyToMany
	@JoinTable(
		name="person_has_citizenship"
		, joinColumns={
			@JoinColumn(name="Person_ActorID")
			}
		, inverseJoinColumns={
			@JoinColumn(name="CitizenshipID")
			}
		)
	private List<Citizenship> citizenships;

	//bi-directional many-to-one association to Location
	@ManyToOne
	@JoinColumn(name="PlaceOfBirth_LocationID")
	private Location location1;

	//bi-directional many-to-one association to Location
	@ManyToOne
	@JoinColumn(name="PlaceOfDeath_LocationID")
	private Location location2;

	//bi-directional many-to-one association to Sex
	@ManyToOne
	@JoinColumn(name="SexID")
	private Sex sex;

	//bi-directional many-to-one association to PersonIsMemberOfCollective
	@OneToMany(mappedBy="person")
	private List<PersonIsMemberOfCollective> personIsMemberOfCollectives;

	//bi-directional many-to-one association to Persontranslation
	@OneToMany(mappedBy="person")
	private List<Persontranslation> persontranslations;

	public Person() {
	}

	public int getActorID() {
		return this.actorID;
	}

	public void setActorID(int actorID) {
		this.actorID = actorID;
	}

	public Date getDateOfBirth() {
		return this.dateOfBirth;
	}

	public void setDateOfBirth(Date dateOfBirth) {
		this.dateOfBirth = dateOfBirth;
	}

	public Date getDayOfDeath() {
		return this.dayOfDeath;
	}

	public void setDayOfDeath(Date dayOfDeath) {
		this.dayOfDeath = dayOfDeath;
	}

	public String getSpecialFeatures() {
		return this.specialFeatures;
	}

	public void setSpecialFeatures(String specialFeatures) {
		this.specialFeatures = specialFeatures;
	}

	// public List<Lineupmember> getLineupmembers() {
	// 	return this.lineupmembers;
	// }

	// public void setLineupmembers(List<Lineupmember> lineupmembers) {
	// 	this.lineupmembers = lineupmembers;
	// }

	// public Lineupmember addLineupmember(Lineupmember lineupmember) {
	// 	getLineupmembers().add(lineupmember);
	// 	lineupmember.setPerson(this);

	// 	return lineupmember;
	// }

	// public Lineupmember removeLineupmember(Lineupmember lineupmember) {
	// 	getLineupmembers().remove(lineupmember);
	// 	lineupmember.setPerson(null);

	// 	return lineupmember;
	// }

	public Academictitle getAcademictitle() {
		return this.academictitle;
	}

	public void setAcademictitle(Academictitle academictitle) {
		this.academictitle = academictitle;
	}

	public Actor getActor() {
		return this.actor;
	}

	public void setActor(Actor actor) {
		this.actor = actor;
	}

	public List<Citizenship> getCitizenships() {
		return this.citizenships;
	}

	public void setCitizenships(List<Citizenship> citizenships) {
		this.citizenships = citizenships;
	}

	public Location getLocation1() {
		return this.location1;
	}

	public void setLocation1(Location location1) {
		this.location1 = location1;
	}

	public Location getLocation2() {
		return this.location2;
	}

	public void setLocation2(Location location2) {
		this.location2 = location2;
	}

	public Sex getSex() {
		return this.sex;
	}

	public void setSex(Sex sex) {
		this.sex = sex;
	}

	public List<PersonIsMemberOfCollective> getPersonIsMemberOfCollectives() {
		return this.personIsMemberOfCollectives;
	}

	public void setPersonIsMemberOfCollectives(List<PersonIsMemberOfCollective> personIsMemberOfCollectives) {
		this.personIsMemberOfCollectives = personIsMemberOfCollectives;
	}

	public PersonIsMemberOfCollective addPersonIsMemberOfCollective(PersonIsMemberOfCollective personIsMemberOfCollective) {
		getPersonIsMemberOfCollectives().add(personIsMemberOfCollective);
		personIsMemberOfCollective.setPerson(this);

		return personIsMemberOfCollective;
	}

	public PersonIsMemberOfCollective removePersonIsMemberOfCollective(PersonIsMemberOfCollective personIsMemberOfCollective) {
		getPersonIsMemberOfCollectives().remove(personIsMemberOfCollective);
		personIsMemberOfCollective.setPerson(null);

		return personIsMemberOfCollective;
	}

	public List<Persontranslation> getPersontranslations() {
		return this.persontranslations;
	}

	public void setPersontranslations(List<Persontranslation> persontranslations) {
		this.persontranslations = persontranslations;
	}

	public Persontranslation addPersontranslation(Persontranslation persontranslation) {
		getPersontranslations().add(persontranslation);
		persontranslation.setPerson(this);

		return persontranslation;
	}

	public Persontranslation removePersontranslation(Persontranslation persontranslation) {
		getPersontranslations().remove(persontranslation);
		persontranslation.setPerson(null);

		return persontranslation;
	}

}