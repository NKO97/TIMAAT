package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;
import java.util.List;


/**
 * The persistent class for the locationtype database table.
 * 
 */
@Entity
@NamedQuery(name="Locationtype.findAll", query="SELECT l FROM Locationtype l")
public class Locationtype implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	//bi-directional many-to-one association to Location
	@OneToMany(mappedBy="locationtype")
	private List<Location> locations;

	//bi-directional many-to-one association to Locationtypetranslation
	@OneToMany(mappedBy="locationtype")
	private List<Locationtypetranslation> locationtypetranslations;

	public Locationtype() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public List<Location> getLocations() {
		return this.locations;
	}

	public void setLocations(List<Location> locations) {
		this.locations = locations;
	}

	public Location addLocation(Location location) {
		getLocations().add(location);
		location.setLocationtype(this);

		return location;
	}

	public Location removeLocation(Location location) {
		getLocations().remove(location);
		location.setLocationtype(null);

		return location;
	}

	public List<Locationtypetranslation> getLocationtypetranslations() {
		return this.locationtypetranslations;
	}

	public void setLocationtypetranslations(List<Locationtypetranslation> locationtypetranslations) {
		this.locationtypetranslations = locationtypetranslations;
	}

	public Locationtypetranslation addLocationtypetranslation(Locationtypetranslation locationtypetranslation) {
		getLocationtypetranslations().add(locationtypetranslation);
		locationtypetranslation.setLocationtype(this);

		return locationtypetranslation;
	}

	public Locationtypetranslation removeLocationtypetranslation(Locationtypetranslation locationtypetranslation) {
		getLocationtypetranslations().remove(locationtypetranslation);
		locationtypetranslation.setLocationtype(null);

		return locationtypetranslation;
	}

}