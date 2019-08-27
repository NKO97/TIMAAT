package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the actortypetranslaton database table.
 * 
 */
@Entity
@NamedQuery(name="Actortypetranslaton.findAll", query="SELECT a FROM Actortypetranslaton a")
public class Actortypetranslaton implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private int id;

	private String type;

	//bi-directional many-to-one association to Actortype
	@ManyToOne
	@JoinColumn(name="ActorTypeID")
	private Actortype actortype;

	//bi-directional many-to-one association to Language
	@ManyToOne
	@JoinColumn(name="LanguageID")
	private Language language;

	public Actortypetranslaton() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getType() {
		return this.type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public Actortype getActortype() {
		return this.actortype;
	}

	public void setActortype(Actortype actortype) {
		this.actortype = actortype;
	}

	public Language getLanguage() {
		return this.language;
	}

	public void setLanguage(Language language) {
		this.language = language;
	}

}