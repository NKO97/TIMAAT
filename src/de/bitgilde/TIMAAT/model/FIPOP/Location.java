package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.List;


/**
 * The persistent class for the location database table.
 * 
 */
@Entity
@NamedQuery(name="Location.findAll", query="SELECT l FROM Location l")
public class Location implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

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

	//bi-directional one-to-one association to City
	@JsonIgnore
	@OneToOne(mappedBy="location")
	private City city;

	//bi-directional one-to-one association to Country
	@JsonIgnore
	@OneToOne(mappedBy="location")
	private Country country;

	//bi-directional one-to-one association to County
	@JsonIgnore
	@OneToOne(mappedBy="location")
	private County county;

	//bi-directional many-to-one association to Event
	@OneToMany(mappedBy="location")
	private List<Event> events;

	//bi-directional many-to-many association to Annotation
	@ManyToMany
	@JoinTable(
		name="annotation_has_location"
		, joinColumns={
			@JoinColumn(name="LocationID")
			}
		, inverseJoinColumns={
			@JoinColumn(name="AnnotationID")
			}
		)
	private List<Annotation> annotations;

	//bi-directional many-to-one association to Locationtype
	@ManyToOne
	@JoinColumn(name="LocationTypeID")
	private Locationtype locationtype;

	//bi-directional many-to-one association to Locationtranslation
	@OneToMany(mappedBy="location")
	private List<Locationtranslation> locationtranslations;

	//bi-directional many-to-one association to Person
	@OneToMany(mappedBy="location1")
	private List<Person> persons1;

	//bi-directional many-to-one association to Person
	@OneToMany(mappedBy="location2")
	private List<Person> persons2;

	//bi-directional one-to-one association to Province
	@JsonIgnore
	@OneToOne(mappedBy="location")
	private Province province;

	//bi-directional one-to-one association to Street
	@JsonIgnore
	@OneToOne(mappedBy="location")
	private Street street;

	//bi-directional many-to-many association to Territory
	@ManyToMany(mappedBy="locations")
	private List<Territory> territories;

	public Location() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	// public String getName() {
	// 	return this.locationtranslations.get(0).getName(); // TODO get correct list item
	// }

	// public void setName(String name) {
	// 	this.locationtranslations.get(0).setName(name); // TODO get correct list item
	// }

	public City getCity() {
		return this.city;
	}

	public void setCity(City city) {
		this.city = city;
	}

	public Country getCountry() {
		return this.country;
	}

	public void setCountry(Country country) {
		this.country = country;
	}

	public County getCounty() {
		return this.county;
	}

	public void setCounty(County county) {
		this.county = county;
	}

	public List<Event> getEvents() {
		return this.events;
	}

	public void setEvents(List<Event> events) {
		this.events = events;
	}

	public Event addEvent(Event event) {
		getEvents().add(event);
		event.setLocation(this);

		return event;
	}

	public Event removeEvent(Event event) {
		getEvents().remove(event);
		event.setLocation(null);

		return event;
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

	public List<Annotation> getAnnotations() {
		return this.annotations;
	}

	public void setAnnotations(List<Annotation> annotations) {
		this.annotations = annotations;
	}

	public Locationtype getLocationtype() {
		return this.locationtype;
	}

	public void setLocationtype(Locationtype locationtype) {
		this.locationtype = locationtype;
	}

	public List<Locationtranslation> getLocationtranslations() {
		return this.locationtranslations;
	}

	public void setLocationtranslations(List<Locationtranslation> locationtranslations) {
		this.locationtranslations = locationtranslations;
	}

	public Locationtranslation addLocationtranslation(Locationtranslation locationtranslation) {
		getLocationtranslations().add(locationtranslation);
		locationtranslation.setLocation(this);
		return locationtranslation;
	}

	public Locationtranslation removeLocationtranslation(Locationtranslation locationtranslation) {
		getLocationtranslations().remove(locationtranslation);
		// locationtranslation.setLocation(null);
		return locationtranslation;
	}

	public List<Person> getPersons1() {
		return this.persons1;
	}

	public void setPersons1(List<Person> persons1) {
		this.persons1 = persons1;
	}

	public Person addPersons1(Person persons1) {
		getPersons1().add(persons1);
		persons1.setLocation1(this);

		return persons1;
	}

	public Person removePersons1(Person persons1) {
		getPersons1().remove(persons1);
		persons1.setLocation1(null);

		return persons1;
	}

	public List<Person> getPersons2() {
		return this.persons2;
	}

	public void setPersons2(List<Person> persons2) {
		this.persons2 = persons2;
	}

	public Person addPersons2(Person persons2) {
		getPersons2().add(persons2);
		persons2.setLocation2(this);

		return persons2;
	}

	public Person removePersons2(Person persons2) {
		getPersons2().remove(persons2);
		persons2.setLocation2(null);

		return persons2;
	}

	public Province getProvince() {
		return this.province;
	}

	public void setProvince(Province province) {
		this.province = province;
	}

	public Street getStreet() {
		return this.street;
	}

	public void setStreet(Street street) {
		this.street = street;
	}

	public List<Territory> getTerritories() {
		return this.territories;
	}

	public void setTerritories(List<Territory> territories) {
		this.territories = territories;
	}

}