package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the actornameparttypetranslation database table.
 * 
 */
@Entity
@NamedQuery(name="Actornameparttypetranslation.findAll", query="SELECT a FROM Actornameparttypetranslation a")
public class Actornameparttypetranslation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private int id;

	private String type;

	//bi-directional many-to-one association to Actornameparttype
	@ManyToOne
	@JoinColumn(name="ActorNamePartTypeID")
	private Actornameparttype actornameparttype;

	//bi-directional many-to-one association to Language
	@ManyToOne
	@JoinColumn(name="LanguageID")
	private Language language;

	public Actornameparttypetranslation() {
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

	public Actornameparttype getActornameparttype() {
		return this.actornameparttype;
	}

	public void setActornameparttype(Actornameparttype actornameparttype) {
		this.actornameparttype = actornameparttype;
	}

	public Language getLanguage() {
		return this.language;
	}

	public void setLanguage(Language language) {
		this.language = language;
	}

}