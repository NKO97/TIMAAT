package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;
import java.util.List;


/**
 * The persistent class for the city database table.
 * 
 */
@Entity
@NamedQuery(name="City.findAll", query="SELECT c FROM City c")
public class City implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private int locationID;

	//bi-directional many-to-one association to County
	@ManyToOne
	private County county;

	//bi-directional one-to-one association to Location
	@OneToOne
	@PrimaryKeyJoinColumn(name="LocationID")
	private Location location;

	//bi-directional many-to-one association to Street
	@OneToMany(mappedBy="city")
	private List<Street> streets;

	public City() {
	}

	public int getLocationID() {
		return this.locationID;
	}

	public void setLocationID(int locationID) {
		this.locationID = locationID;
	}

	public County getCounty() {
		return this.county;
	}

	public void setCounty(County county) {
		this.county = county;
	}

	public Location getLocation() {
		return this.location;
	}

	public void setLocation(Location location) {
		this.location = location;
	}

	public List<Street> getStreets() {
		return this.streets;
	}

	public void setStreets(List<Street> streets) {
		this.streets = streets;
	}

	public Street addStreet(Street street) {
		getStreets().add(street);
		street.setCity(this);

		return street;
	}

	public Street removeStreet(Street street) {
		getStreets().remove(street);
		street.setCity(null);

		return street;
	}

}