package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the sextranslation database table.
 * 
 */
@Entity
@NamedQuery(name="Sextranslation.findAll", query="SELECT s FROM Sextranslation s")
public class Sextranslation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private int id;

	private String type;

	//bi-directional many-to-one association to Language
	@ManyToOne
	@JoinColumn(name="LanguageID")
	private Language language;

	//bi-directional many-to-one association to Sex
	@ManyToOne
	@JoinColumn(name="SexID")
	private Sex sex;

	public Sextranslation() {
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

	public Language getLanguage() {
		return this.language;
	}

	public void setLanguage(Language language) {
		this.language = language;
	}

	public Sex getSex() {
		return this.sex;
	}

	public void setSex(Sex sex) {
		this.sex = sex;
	}

}