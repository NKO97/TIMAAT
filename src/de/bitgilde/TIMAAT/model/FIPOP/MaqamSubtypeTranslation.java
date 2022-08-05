package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.Table;


/**
 * The persistent class for the maqam_subtype_translation database table.
 *
 * @author Mirko Scherf <mscherf@uni-mainz.de>
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