package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;
import java.util.List;


/**
 * The persistent class for the emailaddresstype database table.
 * 
 */
@Entity
@NamedQuery(name="Emailaddresstype.findAll", query="SELECT e FROM Emailaddresstype e")
public class Emailaddresstype implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private int id;

	//bi-directional many-to-one association to ActorHasEmailaddress
	@OneToMany(mappedBy="emailaddresstype")
	private List<ActorHasEmailaddress> actorHasEmailaddresses;

	//bi-directional many-to-one association to Emailaddresstypetranslation
	@OneToMany(mappedBy="emailaddresstype")
	private List<Emailaddresstypetranslation> emailaddresstypetranslations;

	public Emailaddresstype() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public List<ActorHasEmailaddress> getActorHasEmailaddresses() {
		return this.actorHasEmailaddresses;
	}

	public void setActorHasEmailaddresses(List<ActorHasEmailaddress> actorHasEmailaddresses) {
		this.actorHasEmailaddresses = actorHasEmailaddresses;
	}

	public ActorHasEmailaddress addActorHasEmailaddress(ActorHasEmailaddress actorHasEmailaddress) {
		getActorHasEmailaddresses().add(actorHasEmailaddress);
		actorHasEmailaddress.setEmailaddresstype(this);

		return actorHasEmailaddress;
	}

	public ActorHasEmailaddress removeActorHasEmailaddress(ActorHasEmailaddress actorHasEmailaddress) {
		getActorHasEmailaddresses().remove(actorHasEmailaddress);
		actorHasEmailaddress.setEmailaddresstype(null);

		return actorHasEmailaddress;
	}

	public List<Emailaddresstypetranslation> getEmailaddresstypetranslations() {
		return this.emailaddresstypetranslations;
	}

	public void setEmailaddresstypetranslations(List<Emailaddresstypetranslation> emailaddresstypetranslations) {
		this.emailaddresstypetranslations = emailaddresstypetranslations;
	}

	public Emailaddresstypetranslation addEmailaddresstypetranslation(Emailaddresstypetranslation emailaddresstypetranslation) {
		getEmailaddresstypetranslations().add(emailaddresstypetranslation);
		emailaddresstypetranslation.setEmailaddresstype(this);

		return emailaddresstypetranslation;
	}

	public Emailaddresstypetranslation removeEmailaddresstypetranslation(Emailaddresstypetranslation emailaddresstypetranslation) {
		getEmailaddresstypetranslations().remove(emailaddresstypetranslation);
		emailaddresstypetranslation.setEmailaddresstype(null);

		return emailaddresstypetranslation;
	}

}