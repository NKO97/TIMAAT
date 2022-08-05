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
 * The persistent class for the maqam_type_translation database table.
 *
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Entity
@Table(name="maqam_type_translation")
@NamedQuery(name="MaqamTypeTranslation.findAll", query="SELECT m FROM MaqamTypeTranslation m")
public class MaqamTypeTranslation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	//bi-directional many-to-one association to Language
	@ManyToOne
	private Language language;

	private String type;

	//bi-directional many-to-one association to MaqamType
	@ManyToOne
	@JoinColumn(name="maqam_type_id")
	@JsonIgnore
	private MaqamType maqamType;

	public MaqamTypeTranslation() {
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

	public String getType() {
		return this.type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public MaqamType getMaqamType() {
		return this.maqamType;
	}

	public void setMaqamType(MaqamType maqamType) {
		this.maqamType = maqamType;
	}

}