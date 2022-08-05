package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

/**
 * The persistent class for the maqam_type database table.
 *
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Entity
@Table(name="maqam_type")
@NamedQuery(name="MaqamType.findAll", query="SELECT m FROM MaqamType m")
public class MaqamType implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	//bi-directional many-to-one association to Maqam
	@OneToMany(mappedBy="maqamType")
	@JsonIgnore
	private List<Maqam> maqams;

	//bi-directional many-to-one association to MaqamTypeTranslation
	@OneToMany(mappedBy="maqamType")
	private List<MaqamTypeTranslation> maqamTypeTranslations;

	public MaqamType() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public List<Maqam> getMaqams() {
		return this.maqams;
	}

	public void setMaqams(List<Maqam> maqams) {
		this.maqams = maqams;
	}

	public Maqam addMaqam(Maqam maqam) {
		getMaqams().add(maqam);
		maqam.setMaqamType(this);

		return maqam;
	}

	public Maqam removeMaqam(Maqam maqam) {
		getMaqams().remove(maqam);
		maqam.setMaqamType(null);

		return maqam;
	}

	public List<MaqamTypeTranslation> getMaqamTypeTranslations() {
		return this.maqamTypeTranslations;
	}

	public void setMaqamTypeTranslations(List<MaqamTypeTranslation> maqamTypeTranslations) {
		this.maqamTypeTranslations = maqamTypeTranslations;
	}

	public MaqamTypeTranslation addMaqamTypeTranslation(MaqamTypeTranslation maqamTypeTranslation) {
		getMaqamTypeTranslations().add(maqamTypeTranslation);
		maqamTypeTranslation.setMaqamType(this);

		return maqamTypeTranslation;
	}

	public MaqamTypeTranslation removeMaqamTypeTranslation(MaqamTypeTranslation maqamTypeTranslation) {
		getMaqamTypeTranslations().remove(maqamTypeTranslation);
		maqamTypeTranslation.setMaqamType(null);

		return maqamTypeTranslation;
	}

}