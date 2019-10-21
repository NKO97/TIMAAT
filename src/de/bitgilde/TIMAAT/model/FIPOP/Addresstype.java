package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.util.List;


/**
 * The persistent class for the address_type database table.
 * 
 */
@Entity
@Table(name="address_type")
@NamedQuery(name="AddressType.findAll", query="SELECT a FROM AddressType a")
public class AddressType implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private int id;

	//bi-directional many-to-one association to ActorHasAddress
	@OneToMany(mappedBy="addressType")
	@JsonManagedReference(value = "AddressType-ActorHasAddress")
	private List<ActorHasAddress> actorHasAddresses;

	//bi-directional many-to-one association to AddressTypeTranslation
	@OneToMany(mappedBy="addressType")
	@JsonManagedReference(value = "AddressType-AddressTypeTranslation")
	private List<AddressTypeTranslation> addressTypeTranslations;

	public AddressType() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public List<ActorHasAddress> getActorHasAddresses() {
		return this.actorHasAddresses;
	}

	public void setActorHasAddresses(List<ActorHasAddress> actorHasAddresses) {
		this.actorHasAddresses = actorHasAddresses;
	}

	public ActorHasAddress addActorHasAddress(ActorHasAddress actorHasAddress) {
		getActorHasAddresses().add(actorHasAddress);
		actorHasAddress.setAddressType(this);

		return actorHasAddress;
	}

	public ActorHasAddress removeActorHasAddress(ActorHasAddress actorHasAddress) {
		getActorHasAddresses().remove(actorHasAddress);
		actorHasAddress.setAddressType(null);

		return actorHasAddress;
	}

	public List<AddressTypeTranslation> getAddressTypeTranslations() {
		return this.addressTypeTranslations;
	}

	public void setAddressTypeTranslations(List<AddressTypeTranslation> addressTypeTranslations) {
		this.addressTypeTranslations = addressTypeTranslations;
	}

	public AddressTypeTranslation addAddressTypeTranslation(AddressTypeTranslation addressTypeTranslation) {
		getAddressTypeTranslations().add(addressTypeTranslation);
		addressTypeTranslation.setAddressType(this);

		return addressTypeTranslation;
	}

	public AddressTypeTranslation removeAddressTypeTranslation(AddressTypeTranslation addressTypeTranslation) {
		getAddressTypeTranslations().remove(addressTypeTranslation);
		addressTypeTranslation.setAddressType(null);

		return addressTypeTranslation;
	}

}