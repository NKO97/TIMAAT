package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.*;

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
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int locationID;

	private String countryCallingCode;

	private String dst;

	private String internationalDialingPrefix;

	private String timeZone;

	private String trunkPrefix;

	//bi-directional many-to-one association to ActorIsLocatedInCountry
	// @OneToMany(mappedBy="country")
	// private List<ActorIsLocatedInCountry> actorIsLocatedInCountries;

	//bi-directional many-to-many association to Citizenship
	@ManyToMany
	@JoinTable(
		name="country_has_citizenship"
		, joinColumns={
			@JoinColumn(name="Country_LocationID")
			}
		, inverseJoinColumns={
			@JoinColumn(name="CitizenshipID")
			}
		)
	private List<Citizenship> citizenships;

	//bi-directional one-to-one association to Location
	@OneToOne
	@PrimaryKeyJoinColumn(name="LocationID")
	private Location location;

	//bi-directional many-to-one association to Phonenumber
	@OneToMany(mappedBy="country")
	private List<Phonenumber> phonenumbers;

	//bi-directional many-to-one association to Province
	@OneToMany(mappedBy="country")
	private List<Province> provinces;

	public Country() {
	}

	public int getLocationID() {
		return this.locationID;
	}

	public void setLocationID(int locationID) {
		this.locationID = locationID;
	}

	public int getId() {
		return this.getLocation().getId();
	}

	public void setId(int id) {
		this.getLocation().setId(id);
	}

	public String getName() {
		return this.getLocation().getLocationtranslations().get(0).getName(); // TODO get correct list item
	}

	public void setName(String name) {
		this.getLocation().getLocationtranslations().get(0).setName(name); // TODO get correct list item
	}

	public String getCountryCallingCode() {
		return this.countryCallingCode;
	}

	public void setCountryCallingCode(String countryCallingCode) {
		this.countryCallingCode = countryCallingCode;
	}

	public String getDst() {
		return this.dst;
	}

	public void setDst(String dst) {
		this.dst = dst;
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

	public int getCreatedByUserAccountID() {
		return this.getLocation().getCreatedByUserAccountID();
	}

	public void setCreatedByUserAccountID(int created_by_user_account_id) {
		this.getLocation().setCreatedByUserAccountID(created_by_user_account_id);
	}
	
	public int getLastEditedByUserAccountID() {
		return this.getLocation().getLastEditedByUserAccountID();
	}

	public void setLastEditedByUserAccountID(int last_edited_by_user_account_id) {
		this.getLocation().setLastEditedByUserAccountID(last_edited_by_user_account_id);
	}

	public Timestamp getCreatedAt() {
		return this.location.getCreatedAt();
	}

	public void setCreatedAt(Timestamp created_at) {
		this.getLocation().setCreatedAt(created_at);
	}

	public Timestamp getLastEditedAt() {
		return this.location.getLastEditedAt();
	}

	public void setLastEditedAt(Timestamp last_edited_at) {
		this.getLocation().setLastEditedAt(last_edited_at);
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

	public List<Citizenship> getCitizenships() {
		return this.citizenships;
	}

	public void setCitizenships(List<Citizenship> citizenships) {
		this.citizenships = citizenships;
	}

	public Location getLocation() {
		return this.location;
	}

	public void setLocation(Location location) {
		this.location = location;
	}

	public List<Phonenumber> getPhonenumbers() {
		return this.phonenumbers;
	}

	public void setPhonenumbers(List<Phonenumber> phonenumbers) {
		this.phonenumbers = phonenumbers;
	}

	public Phonenumber addPhonenumber(Phonenumber phonenumber) {
		getPhonenumbers().add(phonenumber);
		phonenumber.setCountry(this);

		return phonenumber;
	}

	public Phonenumber removePhonenumber(Phonenumber phonenumber) {
		getPhonenumbers().remove(phonenumber);
		phonenumber.setCountry(null);

		return phonenumber;
	}

	public List<Province> getProvinces() {
		return this.provinces;
	}

	public void setProvinces(List<Province> provinces) {
		this.provinces = provinces;
	}

	public Province addProvince(Province province) {
		getProvinces().add(province);
		province.setCountry(this);

		return province;
	}

	public Province removeProvince(Province province) {
		getProvinces().remove(province);
		province.setCountry(null);

		return province;
	}

	public List<Locationtranslation> getLocationtranslations() {
		return this.getLocation().getLocationtranslations();
	}

	public void setLocationtranslations(List<Locationtranslation> locationtranslations) {
		this.getLocation().setLocationtranslations(locationtranslations);
	}

	public Locationtranslation addLocationtranslation(Locationtranslation locationtranslation) {
		getLocation().getLocationtranslations().add(locationtranslation);
		// locationtranslation.setLocation(this);
		getLocation().getLocationtranslations().get(0).setLocation(this.getLocation()); // TODO verify
		return locationtranslation;
	}

	public Locationtranslation removeLocationtranslation(Locationtranslation locationtranslation) {
		getLocationtranslations().remove(locationtranslation);
		return locationtranslation;
	}

}