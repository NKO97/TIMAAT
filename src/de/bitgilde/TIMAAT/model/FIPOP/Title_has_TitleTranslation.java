package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the Title_has_TitleTranslation database table.
 * 
 */
@Entity
@NamedQuery(name="Title_has_TitleTranslation.findAll", query="SELECT t FROM Title_has_TitleTranslation t")
public class Title_has_TitleTranslation implements Serializable {
	private static final long serialVersionUID = 1L;

	@EmbeddedId
	private Title_has_TitleTranslationPK id;

	public Title_has_TitleTranslation() {
	}

	public Title_has_TitleTranslationPK getId() {
		return this.id;
	}

	public void setId(Title_has_TitleTranslationPK id) {
		this.id = id;
	}

}