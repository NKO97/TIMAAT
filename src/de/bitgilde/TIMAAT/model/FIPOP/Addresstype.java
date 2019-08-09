package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;
import java.util.List;


/**
 * The persistent class for the addresstype database table.
 * 
 */
@Entity
@NamedQuery(name="Addresstype.findAll", query="SELECT a FROM Addresstype a")
public class Addresstype implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private int id;

	//bi-directional many-to-one association to ActorHasAddress
	@OneToMany(mappedBy="addresstype")
	private List<ActorHasAddress> actorHasAddresses;

	//bi-directional many-to-one association to Addresstypetranslation
	@OneToMany(mappedBy="addresstype")
	private List<Addresstypetranslation> addresstypetranslations;

	public Addresstype() {
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
		actorHasAddress.setAddresstype(this);

		return actorHasAddress;
	}

	public ActorHasAddress removeActorHasAddress(ActorHasAddress actorHasAddress) {
		getActorHasAddresses().remove(actorHasAddress);
		actorHasAddress.setAddresstype(null);

		return actorHasAddress;
	}

	public List<Addresstypetranslation> getAddresstypetranslations() {
		return this.addresstypetranslations;
	}

	public void setAddresstypetranslations(List<Addresstypetranslation> addresstypetranslations) {
		this.addresstypetranslations = addresstypetranslations;
	}

	public Addresstypetranslation addAddresstypetranslation(Addresstypetranslation addresstypetranslation) {
		getAddresstypetranslations().add(addresstypetranslation);
		addresstypetranslation.setAddresstype(this);

		return addresstypetranslation;
	}

	public Addresstypetranslation removeAddresstypetranslation(Addresstypetranslation addresstypetranslation) {
		getAddresstypetranslations().remove(addresstypetranslation);
		addresstypetranslation.setAddresstype(null);

		return addresstypetranslation;
	}

}