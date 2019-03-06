package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the Medium_has_Title database table.
 * 
 */
@Entity
@NamedQuery(name="Medium_has_Title.findAll", query="SELECT m FROM Medium_has_Title m")
public class Medium_has_Title implements Serializable {
	private static final long serialVersionUID = 1L;

	@EmbeddedId
	private Medium_has_TitlePK id;

	public Medium_has_Title() {
	}

	public Medium_has_TitlePK getId() {
		return this.id;
	}

	public void setId(Medium_has_TitlePK id) {
		this.id = id;
	}

}