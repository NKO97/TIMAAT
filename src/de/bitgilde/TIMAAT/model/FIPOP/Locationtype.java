package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;
import java.util.List;


/**
 * The persistent class for the location_type database table.
 * 
 */
@Entity
@Table(name="location_type")
@NamedQuery(name="LocationType.findAll", query="SELECT l FROM LocationType l")
public class LocationType implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	//bi-directional many-to-one association to Location
	@OneToMany(mappedBy="locationType")
	private List<Location> locations;

	//bi-directional many-to-one association to LocationTypeTranslation
	@OneToMany(mappedBy="locationType")
	private List<LocationTypeTranslation> locationTypeTranslations;

	public LocationType() {
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
		location.setLocationType(this);

		return location;
	}

	public Location removeLocation(Location location) {
		getLocations().remove(location);
		location.setLocationType(null);

		return location;
	}

	public List<LocationTypeTranslation> getLocationTypeTranslations() {
		return this.locationTypeTranslations;
	}

	public void setLocationTypeTranslations(List<LocationTypeTranslation> locationTypeTranslations) {
		this.locationTypeTranslations = locationTypeTranslations;
	}

	public LocationTypeTranslation addLocationTypeTranslation(LocationTypeTranslation locationTypeTranslation) {
		getLocationTypeTranslations().add(locationTypeTranslation);
		locationTypeTranslation.setLocationType(this);

		return locationTypeTranslation;
	}

	public LocationTypeTranslation removeLocationTypeTranslation(LocationTypeTranslation locationTypeTranslation) {
		getLocationTypeTranslations().remove(locationTypeTranslation);
		locationTypeTranslation.setLocationType(null);

		return locationTypeTranslation;
	}

}