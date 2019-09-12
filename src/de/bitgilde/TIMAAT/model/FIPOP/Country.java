package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.List;


/**
 * The persistent class for the country database table.
 * 
 */
@Entity
@NamedQuery(name="Country.findAll", query="SELECT c FROM Country c")
public class Country implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name="location_id")
	private int locationId;

	//bi-directional one-to-one association to Location
	@OneToOne
	@PrimaryKeyJoinColumn(name="location_id")
	private Location location;

	@Column(name="country_calling_code")
	private String countryCallingCode;

	@Column(name="daylight_saving_time")
	private String daylightSavingTime;

	@Column(name="international_dialing_prefix")
	private String internationalDialingPrefix;

	@Column(name="time_zone")
	private String timeZone;

	@Column(name="trunk_prefix")
	private String trunkPrefix;

	//bi-directional many-to-one association to ActorIsLocatedInCountry
	// @OneToMany(mappedBy="country")
	// private List<ActorIsLocatedInCountry> actorIsLocatedInCountries;

	//bi-directional many-to-many association to Citizenship
	@ManyToMany
	@JsonIgnore
	@JoinTable(
		name="country_has_citizenship"
		, joinColumns={
			@JoinColumn(name="country_location_id")
			}
		, inverseJoinColumns={
			@JoinColumn(name="citizenship_id")
			}
		)
	private List<Citizenship> citizenships;

	//bi-directional many-to-one association to PhoneNumber
	@OneToMany(mappedBy="country")
	@JsonIgnore
	private List<PhoneNumber> phoneNumbers;

	public Country() {
	}

	public int getLocationId() {
		return this.locationId;
	}

	public void setLocationId(int locationId) {
		this.locationId = locationId;
	}

	public int getId() { // TODO not necessary with getLocationId?
		return this.getLocation().getId();
	}

	public void setId(int id) { // TODO not necessary with setLocationId?
		this.getLocation().setId(id);
	}

	public String getName() {
		return this.getLocation().getLocationTranslations().get(0).getName(); // TODO get correct list item
	}

	public void setName(String name) {
		this.getLocation().getLocationTranslations().get(0).setName(name); // TODO get correct list item
	}

	public String getCountryCallingCode() {
		return this.countryCallingCode;
	}

	public void setCountryCallingCode(String countryCallingCode) {
		this.countryCallingCode = countryCallingCode;
	}

	public String getDaylightSavingTime() {
		return this.daylightSavingTime;
	}

	public void setDaylightSavingTime(String daylightSavingTime) {
		this.daylightSavingTime = daylightSavingTime;
	}

	public String getInternationalDialingPrefix() {
		return this.internationalDialingPrefix;
	}

	public void setInternationalDialingPrefix(String internationalDialingPrefix) {
		this.internationalDialingPrefix = internationalDialingPrefix;
	}

	public String getTimeZone() {
		return this.timeZone;
	}

	public void setTimeZone(String timeZone) {
		this.timeZone = timeZone;
	}

	public String getTrunkPrefix() {
		return this.trunkPrefix;
	}

	public void setTrunkPrefix(String trunkPrefix) {
		this.trunkPrefix = trunkPrefix;
	}

	// public List<ActorIsLocatedInCountry> getActorIsLocatedInCountries() {
	// 	return this.actorIsLocatedInCountries;
	// }

	// public void setActorIsLocatedInCountries(List<ActorIsLocatedInCountry> actorIsLocatedInCountries) {
	// 	this.actorIsLocatedInCountries = actorIsLocatedInCountries;
	// }

	// public ActorIsLocatedInCountry addActorIsLocatedInCountry(ActorIsLocatedInCountry actorIsLocatedInCountry) {
	// 	getActorIsLocatedInCountries().add(actorIsLocatedInCountry);
	// 	actorIsLocatedInCountry.setCountry(this);

	// 	return actorIsLocatedInCountry;
	// }

	// public ActorIsLocatedInCountry removeActorIsLocatedInCountry(ActorIsLocatedInCountry actorIsLocatedInCountry) {
	// 	getActorIsLocatedInCountries().remove(actorIsLocatedInCountry);
	// 	actorIsLocatedInCountry.setCountry(null);

	// 	return actorIsLocatedInCountry;
	// }

	public Location getLocation() {
		return this.location;
	}

	public void setLocation(Location location) {
		this.location = location;
	}

	public List<Citizenship> getCitizenships() {
		return this.citizenships;
	}

	public void setCitizenships(List<Citizenship> citizenships) {
		this.citizenships = citizenships;
	}

	public List<PhoneNumber> getPhoneNumbers() {
		return this.phoneNumbers;
	}

	public void setPhoneNumbers(List<PhoneNumber> phoneNumbers) {
		this.phoneNumbers = phoneNumbers;
	}

	public PhoneNumber addPhoneNumber(PhoneNumber phoneNumber) {
		getPhoneNumbers().add(phoneNumber);
		phoneNumber.setCountry(this);

		return phoneNumber;
	}

	public PhoneNumber removePhoneNumber(PhoneNumber phoneNumber) {
		getPhoneNumbers().remove(phoneNumber);
		phoneNumber.setCountry(null);

		return phoneNumber;
	}

	public List<LocationTranslation> getLocationTranslations() {
		return this.getLocation().getLocationTranslations();
	}

	public void setLocationTranslations(List<LocationTranslation> locationTranslations) {
		this.getLocation().setLocationTranslations(locationTranslations);
	}

	public LocationTranslation addLocationTranslation(LocationTranslation locationTranslation) {
		getLocation().getLocationTranslations().add(locationTranslation);
		// locationTranslation.setLocation(this);
		getLocation().getLocationTranslations().get(0).setLocation(this.getLocation()); // TODO verify
		return locationTranslation;
	}

	public LocationTranslation removeLocationTranslation(LocationTranslation locationTranslation) {
		getLocationTranslations().remove(locationTranslation);
		return locationTranslation;
	}

}