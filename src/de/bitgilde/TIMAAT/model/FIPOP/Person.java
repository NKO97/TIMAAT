package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

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
	@Column(name="actor_id")
	private int actorId;

	@Temporal(TemporalType.DATE)
	@Column(name="date_of_birth")
	private Date dateOfBirth;

	@Temporal(TemporalType.DATE)
	@Column(name="day_of_death")
	private Date dayOfDeath;

	//bi-directional many-to-one association to LineupMember
	// @OneToMany(mappedBy="person")
	// private List<LineupMember> lineupMembers;

	//bi-directional many-to-one association to AcademicTitle
	@ManyToOne
	@JoinColumn(name="academic_title_id")
	@JsonBackReference(value = "AcademicTitle-Person")
	private AcademicTitle academicTitle;

	//bi-directional one-to-one association to Actor
	@OneToOne
	@PrimaryKeyJoinColumn(name="actor_id")
	private Actor actor;

	//bi-directional many-to-one association to Location
	@ManyToOne
	@JoinColumn(name="place_of_birth_location_id")
    @JsonBackReference(value = "Location-Person1")
	private Location location1;

	//bi-directional many-to-one association to Location
	@ManyToOne
	@JoinColumn(name="place_of_death_location_id")
    @JsonBackReference(value = "Location-Person2")
	private Location location2;

	//bi-directional many-to-one association to Sex
	@ManyToOne
	@JsonBackReference(value = "Sex-Person")
	private Sex sex;

	//bi-directional many-to-many association to Citizenship
	@ManyToMany
	@JoinTable(
		name="person_has_citizenship"
		, joinColumns={
			@JoinColumn(name="person_actor_id")
			}
		, inverseJoinColumns={
			@JoinColumn(name="citizenship_id")
			}
		)
	private List<Citizenship> citizenships;

	//bi-directional many-to-one association to PersonIsMemberOfCollective
	@OneToMany(mappedBy="person")
	@JsonManagedReference(value = "Person-PersonIsMemberOfCollective")
	private List<PersonIsMemberOfCollective> personIsMemberOfCollectives;

	//bi-directional many-to-one association to PersonTranslation
	@OneToMany(mappedBy="person")
	// @JsonManagedReference(value = "Person-PersonTranslation")
	private List<PersonTranslation> personTranslations;

	public Person() {
	}

	public int getActorId() {
		return this.actorId;
	}

	public void setActorId(int actorId) {
		this.actorId = actorId;
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

	// public List<LineupMember> getLineupMembers() {
	// 	return this.lineupMembers;
	// }

	// public void setLineupMembers(List<LineupMember> lineupMembers) {
	// 	this.lineupMembers = lineupMembers;
	// }

	// public LineupMember addLineupMember(LineupMember lineupMember) {
	// 	getLineupMembers().add(lineupMember);
	// 	lineupMember.setPerson(this);

	// 	return lineupMember;
	// }

	// public LineupMember removeLineupMember(LineupMember lineupMember) {
	// 	getLineupMembers().remove(lineupMember);
	// 	lineupMember.setPerson(null);

	// 	return lineupMember;
	// }

	public AcademicTitle getAcademicTitle() {
		return this.academicTitle;
	}

	public void setAcademicTitle(AcademicTitle academicTitle) {
		this.academicTitle = academicTitle;
	}

	public Actor getActor() {
		return this.actor;
	}

	public void setActor(Actor actor) {
		this.actor = actor;
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

	public List<Citizenship> getCitizenships() {
		return this.citizenships;
	}

	public void setCitizenships(List<Citizenship> citizenships) {
		this.citizenships = citizenships;
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

	public List<PersonTranslation> getPersonTranslations() {
		return this.personTranslations;
	}

	public void setPersonTranslations(List<PersonTranslation> personTranslations) {
		this.personTranslations = personTranslations;
	}

	public PersonTranslation addPersonTranslation(PersonTranslation personTranslation) {
		getPersonTranslations().add(personTranslation);
		personTranslation.setPerson(this);

		return personTranslation;
	}

	public PersonTranslation removePersonTranslation(PersonTranslation personTranslation) {
		getPersonTranslations().remove(personTranslation);
		personTranslation.setPerson(null);

		return personTranslation;
	}

}