package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

/**
 * The primary key class for the Title_has_TitleTranslation database table.
 * 
 */
@Embeddable
public class Title_has_TitleTranslationPK implements Serializable {
	//default serial version id, required for serializable classes.
	private static final long serialVersionUID = 1L;

	private int titleID;

	private int titleTranslation_TitleID;

	public Title_has_TitleTranslationPK() {
	}
	public int getTitleID() {
		return this.titleID;
	}
	public void setTitleID(int titleID) {
		this.titleID = titleID;
	}
	public int getTitleTranslation_TitleID() {
		return this.titleTranslation_TitleID;
	}
	public void setTitleTranslation_TitleID(int titleTranslation_TitleID) {
		this.titleTranslation_TitleID = titleTranslation_TitleID;
	}

	public boolean equals(Object other) {
		if (this == other) {
			return true;
		}
		if (!(other instanceof Title_has_TitleTranslationPK)) {
			return false;
		}
		Title_has_TitleTranslationPK castOther = (Title_has_TitleTranslationPK)other;
		return 
			(this.titleID == castOther.titleID)
			&& (this.titleTranslation_TitleID == castOther.titleTranslation_TitleID);
	}

	public int hashCode() {
		final int prime = 31;
		int hash = 17;
		hash = hash * prime + this.titleID;
		hash = hash * prime + this.titleTranslation_TitleID;
		
		return hash;
	}
}