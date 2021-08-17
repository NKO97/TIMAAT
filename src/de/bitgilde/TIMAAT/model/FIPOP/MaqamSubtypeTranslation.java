package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import jakarta.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;


/**
 * The persistent class for the maqam_subtype_translation database table.
 * 
 */
@Entity
@Table(name="maqam_subtype_translation")
@NamedQuery(name="MaqamSubtypeTranslation.findAll", query="SELECT m FROM MaqamSubtypeTranslation m")
public class MaqamSubtypeTranslation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	//bi-directional many-to-one association to Language
	@ManyToOne
	private Language language;

	private String subtype;

	//bi-directional many-to-one association to MaqamSubtype
	@ManyToOne
	@JoinColumn(name="maqam_subtype_id")
	@JsonIgnore
	private MaqamSubtype maqamSubtype;

	public MaqamSubtypeTranslation() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public Language getLanguage() {
		return this.language;
	}

	public void setLanguage(Language language) {
		this.language = language;
	}

	public String getSubtype() {
		return this.subtype;
	}

	public void setSubtype(String subtype) {
		this.subtype = subtype;
	}

	public MaqamSubtype getMaqamSubtype() {
		return this.maqamSubtype;
	}

	public void setMaqamSubtype(MaqamSubtype maqamSubtype) {
		this.maqamSubtype = maqamSubtype;
	}

}