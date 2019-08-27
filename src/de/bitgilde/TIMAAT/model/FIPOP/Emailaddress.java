package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;
import java.util.List;


/**
 * The persistent class for the emailaddress database table.
 * 
 */
@Entity
@NamedQuery(name="Emailaddress.findAll", query="SELECT e FROM Emailaddress e")
public class Emailaddress implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private int id;

	private String email;

	//bi-directional many-to-one association to ActorHasEmailaddress
	@OneToMany(mappedBy="emailaddress")
	private List<ActorHasEmailaddress> actorHasEmailaddresses;

	//bi-directional many-to-one association to Siocuseraccount
	// @OneToMany(mappedBy="emailaddress")
	// private List<Siocuseraccount> siocuseraccounts;

	public Emailaddress() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getEmail() {
		return this.email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public List<ActorHasEmailaddress> getActorHasEmailaddresses() {
		return this.actorHasEmailaddresses;
	}

	public void setActorHasEmailaddresses(List<ActorHasEmailaddress> actorHasEmailaddresses) {
		this.actorHasEmailaddresses = actorHasEmailaddresses;
	}

	public ActorHasEmailaddress addActorHasEmailaddress(ActorHasEmailaddress actorHasEmailaddress) {
		getActorHasEmailaddresses().add(actorHasEmailaddress);
		actorHasEmailaddress.setEmailaddress(this);

		return actorHasEmailaddress;
	}

	public ActorHasEmailaddress removeActorHasEmailaddress(ActorHasEmailaddress actorHasEmailaddress) {
		getActorHasEmailaddresses().remove(actorHasEmailaddress);
		actorHasEmailaddress.setEmailaddress(null);

		return actorHasEmailaddress;
	}

	// public List<Siocuseraccount> getSiocuseraccounts() {
	// 	return this.siocuseraccounts;
	// }

	// public void setSiocuseraccounts(List<Siocuseraccount> siocuseraccounts) {
	// 	this.siocuseraccounts = siocuseraccounts;
	// }

	// public Siocuseraccount addSiocuseraccount(Siocuseraccount siocuseraccount) {
	// 	getSiocuseraccounts().add(siocuseraccount);
	// 	siocuseraccount.setEmailaddress(this);

	// 	return siocuseraccount;
	// }

	// public Siocuseraccount removeSiocuseraccount(Siocuseraccount siocuseraccount) {
	// 	getSiocuseraccounts().remove(siocuseraccount);
	// 	siocuseraccount.setEmailaddress(null);

	// 	return siocuseraccount;
	// }

}