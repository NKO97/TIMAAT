package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the citizenshiptranslation database table.
 * 
 */
@Entity
@NamedQuery(name="Citizenshiptranslation.findAll", query="SELECT c FROM Citizenshiptranslation c")
public class Citizenshiptranslation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private int id;

	private String name;

	//bi-directional many-to-one association to Citizenship
	@ManyToOne
	@JoinColumn(name="CitizenshipID")
	private Citizenship citizenship;

	//bi-directional many-to-one association to Language
	@ManyToOne
	@JoinColumn(name="LanguageID")
	private Language language;

	public Citizenshiptranslation() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Citizenship getCitizenship() {
		return this.citizenship;
	}

	public void setCitizenship(Citizenship citizenship) {
		this.citizenship = citizenship;
	}

	public Language getLanguage() {
		return this.language;
	}

	public void setLanguage(Language language) {
		this.language = language;
	}

}