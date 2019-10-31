package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.sql.Timestamp;
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

	@Column(name="created_at")
	private Timestamp createdAt;

	@Column(name="last_edited_at")
	private Timestamp lastEditedAt;

	//bi-directional many-to-many association to Annotation
	@ManyToMany
	@JoinTable(
		name="annotation_has_location"
		, joinColumns={
			@JoinColumn(name="location_id")
			}
		, inverseJoinColumns={
			@JoinColumn(name="annotation_id")
			}
		)
	@JsonIgnore
	private List<Annotation> annotations;

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
    @JsonManagedReference(value = "Location-Event")
	private List<Event> events;

	//bi-directional many-to-one association to Location
	@ManyToOne
	@JsonIgnore // TODO might have to be removed once location hierarchy is developed
	@JoinColumn(name="parent_location_id")
	private Location location;

	//bi-directional many-to-one association to Location
	@OneToMany(mappedBy="location")
	@JsonIgnore // TODO might have to be removed once location hierarchy is developed
	private List<Location> locations;

	//bi-directional many-to-one association to LocationType
	@ManyToOne
	@JoinColumn(name="location_type_id")
	private LocationType locationType;

	//bi-directional many-to-one association to UserAccount
	@ManyToOne
	@JoinColumn(name="created_by_user_account_id")
	@JsonBackReference(value = "UserAccount-Location")
	private UserAccount createdByUserAccount;

	//bi-directional many-to-one association to UserAccount
	@ManyToOne
	@JoinColumn(name="last_edited_by_user_account_id")
	@JsonBackReference(value = "UserAccount-Location2")
	private UserAccount lastEditedByUserAccount;

	//bi-directional many-to-one association to LocationTranslation
	@OneToMany(mappedBy="location")
    // @JsonManagedReference(value = "Location-LocationTranslation")
	private List<LocationTranslation> locationTranslations;

	//bi-directional many-to-one association to Person
	@OneToMany(mappedBy="location1")
    @JsonManagedReference(value = "Location-Person1")
	private List<Person> persons1;

	//bi-directional many-to-one association to Person
	@OneToMany(mappedBy="location2")
    @JsonManagedReference(value = "Location-Person2")
	private List<Person> persons2;

	//bi-directional one-to-one association to Province
	@JsonIgnore
	@OneToOne(mappedBy="location")
	private Province province;

	//bi-directional one-to-one association to Street
	@OneToOne(mappedBy="location")
	@JsonManagedReference(value = "Location-Street")
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
	// 	return this.locationTranslations.get(0).getName(); // TODO get correct list item
	// }

	// public void setName(String name) {
	// 	this.locationTranslations.get(0).setName(name); // TODO get correct list item
	// }

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

	public List<Annotation> getAnnotations() {
		return this.annotations;
	}

	public void setAnnotations(List<Annotation> annotations) {
		this.annotations = annotations;
	}

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

	public Location getLocation() {
		return this.location;
	}

	public void setLocation(Location location) {
		this.location = location;
	}

	public List<Location> getLocations() {
		return this.locations;
	}

	public void setLocations(List<Location> locations) {
		this.locations = locations;
	}

	public Location addLocation(Location location) {
		getLocations().add(location);
		location.setLocation(this);

		return location;
	}

	public Location removeLocation(Location location) {
		getLocations().remove(location);
		location.setLocation(null);

		return location;
	}

	public LocationType getLocationType() {
		return this.locationType;
	}

	public void setLocationType(LocationType locationType) {
		this.locationType = locationType;
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

	public List<LocationTranslation> getLocationTranslations() {
		return this.locationTranslations;
	}

	public void setLocationTranslations(List<LocationTranslation> locationTranslations) {
		this.locationTranslations = locationTranslations;
	}

	public LocationTranslation addLocationTranslation(LocationTranslation locationTranslation) {
		getLocationTranslations().add(locationTranslation);
		locationTranslation.setLocation(this);

		return locationTranslation;
	}

	public LocationTranslation removeLocationTranslation(LocationTranslation locationTranslation) {
		getLocationTranslations().remove(locationTranslation);
		locationTranslation.setLocation(null);

		return locationTranslation;
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