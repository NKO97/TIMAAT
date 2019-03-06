package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the TitleTranslation_has_TitleTranslationAlternative database table.
 * 
 */
@Entity
@NamedQuery(name="TitleTranslation_has_TitleTranslationAlternative.findAll", query="SELECT t FROM TitleTranslation_has_TitleTranslationAlternative t")
public class TitleTranslation_has_TitleTranslationAlternative implements Serializable {
	private static final long serialVersionUID = 1L;

	@EmbeddedId
	private TitleTranslation_has_TitleTranslationAlternativePK id;

	public TitleTranslation_has_TitleTranslationAlternative() {
	}

	public TitleTranslation_has_TitleTranslationAlternativePK getId() {
		return this.id;
	}

	public void setId(TitleTranslation_has_TitleTranslationAlternativePK id) {
		this.id = id;
	}

}