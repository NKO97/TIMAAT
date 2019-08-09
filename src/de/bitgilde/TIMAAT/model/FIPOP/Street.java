package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;
import java.util.List;


/**
 * The persistent class for the street database table.
 * 
 */
@Entity
@NamedQuery(name="Street.findAll", query="SELECT s FROM Street s")
public class Street implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private int locationID;

	//bi-directional many-to-one association to Address
	@OneToMany(mappedBy="street")
	private List<Address> addresses;

	//bi-directional many-to-one association to City
	@ManyToOne
	private City city;

	//bi-directional one-to-one association to Location
	@OneToOne
	@JoinColumn(name="LocationID")
	private Location location;

	public Street() {
	}

	public int getLocationID() {
		return this.locationID;
	}

	public void setLocationID(int locationID) {
		this.locationID = locationID;
	}

	public List<Address> getAddresses() {
		return this.addresses;
	}

	public void setAddresses(List<Address> addresses) {
		this.addresses = addresses;
	}

	public Address addAddress(Address address) {
		getAddresses().add(address);
		address.setStreet(this);

		return address;
	}

	public Address removeAddress(Address address) {
		getAddresses().remove(address);
		address.setStreet(null);

		return address;
	}

	public City getCity() {
		return this.city;
	}

	public void setCity(City city) {
		this.city = city;
	}

	public Location getLocation() {
		return this.location;
	}

	public void setLocation(Location location) {
		this.location = location;
	}

}