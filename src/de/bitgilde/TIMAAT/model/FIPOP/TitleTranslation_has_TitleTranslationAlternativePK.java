package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

/**
 * The primary key class for the TitleTranslation_has_TitleTranslationAlternative database table.
 * 
 */
@Embeddable
public class TitleTranslation_has_TitleTranslationAlternativePK implements Serializable {
	//default serial version id, required for serializable classes.
	private static final long serialVersionUID = 1L;

	private int titleTranslation_TitleID;

	private int titleTranslationAlternative_TitleID;

	public TitleTranslation_has_TitleTranslationAlternativePK() {
	}
	public int getTitleTranslation_TitleID() {
		return this.titleTranslation_TitleID;
	}
	public void setTitleTranslation_TitleID(int titleTranslation_TitleID) {
		this.titleTranslation_TitleID = titleTranslation_TitleID;
	}
	public int getTitleTranslationAlternative_TitleID() {
		return this.titleTranslationAlternative_TitleID;
	}
	public void setTitleTranslationAlternative_TitleID(int titleTranslationAlternative_TitleID) {
		this.titleTranslationAlternative_TitleID = titleTranslationAlternative_TitleID;
	}

	public boolean equals(Object other) {
		if (this == other) {
			return true;
		}
		if (!(other instanceof TitleTranslation_has_TitleTranslationAlternativePK)) {
			return false;
		}
		TitleTranslation_has_TitleTranslationAlternativePK castOther = (TitleTranslation_has_TitleTranslationAlternativePK)other;
		return 
			(this.titleTranslation_TitleID == castOther.titleTranslation_TitleID)
			&& (this.titleTranslationAlternative_TitleID == castOther.titleTranslationAlternative_TitleID);
	}

	public int hashCode() {
		final int prime = 31;
		int hash = 17;
		hash = hash * prime + this.titleTranslation_TitleID;
		hash = hash * prime + this.titleTranslationAlternative_TitleID;
		
		return hash;
	}
}