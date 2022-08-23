package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

/*
 Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
 */

/**
 * The persistent class for the location_type database table.
 *
 * @author Jens-Martin Loebel <loebel@bitgilde.de>
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Entity
@Table(name="location_type")
@NamedQuery(name="LocationType.findAll", query="SELECT lt FROM LocationType lt")
public class LocationType implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	//bi-directional many-to-one association to Location
	@OneToMany(mappedBy="locationType")
	@JsonIgnore
	private List<Location> locations;

	//bi-directional many-to-one association to LocationTypeTranslation
	@OneToMany(mappedBy="locationType")
	@JsonManagedReference(value = "LocationType-LocationTypeTranslation")
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