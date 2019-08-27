package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;
import java.util.List;


/**
 * The persistent class for the actornameparttype database table.
 * 
 */
@Entity
@NamedQuery(name="Actornameparttype.findAll", query="SELECT a FROM Actornameparttype a")
public class Actornameparttype implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private int id;

	private byte displayPosition;

	//bi-directional many-to-one association to Actornamepart
	@OneToMany(mappedBy="actornameparttype")
	private List<Actornamepart> actornameparts;

	//bi-directional many-to-one association to Actornameparttypetranslation
	@OneToMany(mappedBy="actornameparttype")
	private List<Actornameparttypetranslation> actornameparttypetranslations;

	public Actornameparttype() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public byte getDisplayPosition() {
		return this.displayPosition;
	}

	public void setDisplayPosition(byte displayPosition) {
		this.displayPosition = displayPosition;
	}

	public List<Actornamepart> getActornameparts() {
		return this.actornameparts;
	}

	public void setActornameparts(List<Actornamepart> actornameparts) {
		this.actornameparts = actornameparts;
	}

	public Actornamepart addActornamepart(Actornamepart actornamepart) {
		getActornameparts().add(actornamepart);
		actornamepart.setActornameparttype(this);

		return actornamepart;
	}

	public Actornamepart removeActornamepart(Actornamepart actornamepart) {
		getActornameparts().remove(actornamepart);
		actornamepart.setActornameparttype(null);

		return actornamepart;
	}

	public List<Actornameparttypetranslation> getActornameparttypetranslations() {
		return this.actornameparttypetranslations;
	}

	public void setActornameparttypetranslations(List<Actornameparttypetranslation> actornameparttypetranslations) {
		this.actornameparttypetranslations = actornameparttypetranslations;
	}

	public Actornameparttypetranslation addActornameparttypetranslation(Actornameparttypetranslation actornameparttypetranslation) {
		getActornameparttypetranslations().add(actornameparttypetranslation);
		actornameparttypetranslation.setActornameparttype(this);

		return actornameparttypetranslation;
	}

	public Actornameparttypetranslation removeActornameparttypetranslation(Actornameparttypetranslation actornameparttypetranslation) {
		getActornameparttypetranslations().remove(actornameparttypetranslation);
		actornameparttypetranslation.setActornameparttype(null);

		return actornameparttypetranslation;
	}

}