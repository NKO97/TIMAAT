package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

/**
 * The primary key class for the medium_has_language database table.
 *
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Embeddable
public class MediumHasLanguagePK implements Serializable {
	//default serial version id, required for serializable classes.
	private static final long serialVersionUID = 1L;

	@Column(name="medium_id", insertable=false, updatable=false)
	private int mediumId;

	@Column(name="language_id", insertable=false, updatable=false)
	private int languageId;

	@Column(name="medium_language_type_id", insertable=false, updatable=false)
	private int mediumLanguageTypeId;

	public MediumHasLanguagePK() {
	}
	public int getMediumId() {
		return this.mediumId;
	}
	public void setMediumId(int mediumId) {
		this.mediumId = mediumId;
	}
	public int getLanguageId() {
		return this.languageId;
	}
	public void setLanguageId(int languageId) {
		this.languageId = languageId;
	}
	public int getMediumLanguageTypeId() {
		return this.mediumLanguageTypeId;
	}
	public void setMediumLanguageTypeId(int mediumLanguageTypeId) {
		this.mediumLanguageTypeId = mediumLanguageTypeId;
	}

	public boolean equals(Object other) {
		if (this == other) {
			return true;
		}
		if (!(other instanceof MediumHasLanguagePK)) {
			return false;
		}
		MediumHasLanguagePK castOther = (MediumHasLanguagePK)other;
		return
			(this.mediumId == castOther.mediumId)
			&& (this.languageId == castOther.languageId)
			&& (this.mediumLanguageTypeId == castOther.mediumLanguageTypeId);
	}

	public int hashCode() {
		final int prime = 31;
		int hash = 17;
		hash = hash * prime + this.mediumId;
		hash = hash * prime + this.languageId;
		hash = hash * prime + this.mediumLanguageTypeId;

		return hash;
	}
}