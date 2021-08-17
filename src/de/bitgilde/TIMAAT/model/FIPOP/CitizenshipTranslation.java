package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import jakarta.persistence.*;

// import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;


/**
 * The persistent class for the citizenship_translation database table.
 * 
 */
@Entity
@Table(name="citizenship_translation")
@NamedQuery(name="CitizenshipTranslation.findAll", query="SELECT ct FROM CitizenshipTranslation ct")
public class CitizenshipTranslation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	private String name;

	//bi-directional many-to-one association to Citizenship
	@ManyToOne
	@JoinColumn(name="citizenship_id")
	@JsonIgnore
	// @JsonBackReference(value = "Citizenship-CitizenshipTranslation") //? Jsonignore does NOT work here
	private Citizenship citizenship;

	//bi-directional many-to-one association to Language
	@ManyToOne
	private Language language;

	public CitizenshipTranslation() {
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