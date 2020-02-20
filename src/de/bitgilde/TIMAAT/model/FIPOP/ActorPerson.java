package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.Date;
import java.util.List;
import java.util.Set;


/**
 * The persistent class for the actor_person database table.
 * 
 */
@Entity
@Table(name="actor_person")
@NamedQuery(name="ActorPerson.findAll", query="SELECT ap FROM ActorPerson ap")
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

	private String title;

	//bi-directional one-to-one association to Actor
	@OneToOne
	@PrimaryKeyJoinColumn(name="actor_id")
	@JsonIgnore // ActorPerson is accessed through Actor --> avoid reference cycle
	private Actor actor;

	//bi-directional many-to-one association to Location
	@ManyToOne(cascade=CascadeType.PERSIST)
	@JoinColumn(name="place_of_birth_city_location_id")
	// @JsonBackReference(value = "City-ActorPerson1")
	private City placeOfBirthCityLocation;

	//bi-directional many-to-one association to Location
	@ManyToOne(cascade=CascadeType.PERSIST)
	@JoinColumn(name="place_of_death_city_location_id")
  // @JsonBackReference(value = "City-ActorPerson2")
	private City placeOfDeathCityLocation;

	//bi-directional many-to-one association to Sex
	@ManyToOne(cascade=CascadeType.PERSIST)
	@JoinColumn(name="sex_id")
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
	// @JsonIgnore
	private Set<ActorPersonIsMemberOfActorCollective> actorPersonIsMemberOfActorCollectives;

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

	public String getTitle() {
		return this.title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public Actor getActor() {
		return this.actor;
	}

	public void setActor(Actor actor) {
		this.actor = actor;
	}

	public City getPlaceOfBirth() {
		return this.placeOfBirthCityLocation;
	}

	public void setPlaceOfBirth(City placeOfBirthCityLocation) {
		this.placeOfBirthCityLocation = placeOfBirthCityLocation;
	}

	public City getPlaceOfDeath() {
		return this.placeOfDeathCityLocation;
	}

	public void setPlaceOfDeath(City placeOfDeathCityLocation) {
		this.placeOfDeathCityLocation = placeOfDeathCityLocation;
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

	public Set<ActorPersonIsMemberOfActorCollective> getActorPersonIsMemberOfActorCollectives() {
		return this.actorPersonIsMemberOfActorCollectives;
	}

	public void setActorPersonIsMemberOfActorCollectives(Set<ActorPersonIsMemberOfActorCollective> actorPersonIsMemberOfActorCollectives) {
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

	// public void addCollectives(List<ActorCollective> actorCollectives) {

	// }

	// public void addCollective(ActorCollective actorCollective) {
	// 	ActorPersonIsMemberOfActorCollective actorPersonIsMemberOfActorCollective = new ActorPersonIsMemberOfActorCollective(this, actorCollective);
	// }

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