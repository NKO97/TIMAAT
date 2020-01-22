package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.util.Date;
import java.util.List;


/**
 * The persistent class for the person database table.
 * 
 */
@Entity
@Table(name="actor_person")
@NamedQuery(name="ActorPerson.findAll", query="SELECT p FROM ActorPerson p")
public class ActorPerson implements Serializable {
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
	// @OneToMany(mappedBy="actorPerson")
	// private List<LineupMember> lineupMembers;

	//bi-directional many-to-one association to AcademicTitle
	@ManyToOne
	@JoinColumn(name="academic_title_id")
	@JsonBackReference(value = "AcademicTitle-ActorPerson")
	private AcademicTitle academicTitle;

	//bi-directional one-to-one association to Actor
	@OneToOne
	@PrimaryKeyJoinColumn(name="actor_id")
	@JsonIgnore
	private Actor actor;

	//bi-directional many-to-one association to Location
	@ManyToOne
	@JoinColumn(name="place_of_birth_location_id")
    @JsonBackReference(value = "Location-ActorPerson1")
	private Location location1;

	//bi-directional many-to-one association to Location
	@ManyToOne
	@JoinColumn(name="place_of_death_location_id")
    @JsonBackReference(value = "Location-ActorPerson2")
	private Location location2;

	//bi-directional many-to-one association to Sex
	@ManyToOne
	// @JsonBackReference(value = "Sex-ActorPerson")
	private Sex sex;

	//bi-directional many-to-many association to Citizenship
	@ManyToMany
	@JoinTable(
		name="actor_person_has_citizenship"
		, joinColumns={
			@JoinColumn(name="actor_person_actor_id")
			}
		, inverseJoinColumns={
			@JoinColumn(name="citizenship_id")
			}
		)
	private List<Citizenship> citizenships;

	//bi-directional many-to-one association to ActorPersonIsMemberOfActorCollective
	@OneToMany(mappedBy="actorPerson")
	// @JsonManagedReference(value = "ActorPerson-ActorPersonIsMemberOfActorCollective")
	@JsonIgnore
	private List<ActorPersonIsMemberOfActorCollective> actorPersonIsMemberOfActorCollectives;

	//bi-directional many-to-one association to ActorPersonTranslation
	@OneToMany(mappedBy="actorPerson")
	// @JsonManagedReference(value = "ActorPerson-ActorPersonTranslation")
	private List<ActorPersonTranslation> actorPersonTranslations;

	public ActorPerson() {
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
	// 	lineupMember.setActorPerson(this);

	// 	return lineupMember;
	// }

	// public LineupMember removeLineupMember(LineupMember lineupMember) {
	// 	getLineupMembers().remove(lineupMember);
	// 	lineupMember.setActorPerson(null);

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

	public List<ActorPersonIsMemberOfActorCollective> getActorPersonIsMemberOfActorCollectives() {
		return this.actorPersonIsMemberOfActorCollectives;
	}

	public void setActorPersonIsMemberOfActorCollectives(List<ActorPersonIsMemberOfActorCollective> actorPersonIsMemberOfActorCollectives) {
		this.actorPersonIsMemberOfActorCollectives = actorPersonIsMemberOfActorCollectives;
	}

	public ActorPersonIsMemberOfActorCollective addActorPersonIsMemberOfActorCollective(ActorPersonIsMemberOfActorCollective actorPersonIsMemberOfActorCollective) {
		getActorPersonIsMemberOfActorCollectives().add(actorPersonIsMemberOfActorCollective);
		actorPersonIsMemberOfActorCollective.setActorPerson(this);

		return actorPersonIsMemberOfActorCollective;
	}

	public ActorPersonIsMemberOfActorCollective removeActorPersonIsMemberOfActorCollective(ActorPersonIsMemberOfActorCollective actorPersonIsMemberOfActorCollective) {
		getActorPersonIsMemberOfActorCollectives().remove(actorPersonIsMemberOfActorCollective);
		actorPersonIsMemberOfActorCollective.setActorPerson(null);

		return actorPersonIsMemberOfActorCollective;
	}

	public List<ActorPersonTranslation> getActorPersonTranslations() {
		return this.actorPersonTranslations;
	}

	public void setActorPersonTranslations(List<ActorPersonTranslation> actorPersonTranslations) {
		this.actorPersonTranslations = actorPersonTranslations;
	}

	public ActorPersonTranslation addActorPersonTranslation(ActorPersonTranslation actorPersonTranslation) {
		getActorPersonTranslations().add(actorPersonTranslation);
		actorPersonTranslation.setActorPerson(this);

		return actorPersonTranslation;
	}

	public ActorPersonTranslation removeActorPersonTranslation(ActorPersonTranslation actorPersonTranslation) {
		getActorPersonTranslations().remove(actorPersonTranslation);
		actorPersonTranslation.setActorPerson(null);

		return actorPersonTranslation;
	}

}