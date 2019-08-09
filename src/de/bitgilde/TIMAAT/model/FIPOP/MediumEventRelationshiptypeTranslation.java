package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the medium_event_relationshiptype_translation database table.
 * 
 */
@Entity
@Table(name="medium_event_relationshiptype_translation")
@NamedQuery(name="MediumEventRelationshiptypeTranslation.findAll", query="SELECT m FROM MediumEventRelationshiptypeTranslation m")
public class MediumEventRelationshiptypeTranslation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private int id;

	private String type;

	//bi-directional many-to-one association to Language
	@ManyToOne
	@JoinColumn(name="LanguageID")
	private Language language;

	//bi-directional many-to-one association to MediumEventRelationshiptype
	@ManyToOne
	@JoinColumn(name="Medium_Event_RelationshipTypeID")
	private MediumEventRelationshiptype mediumEventRelationshiptype;

	public MediumEventRelationshiptypeTranslation() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getType() {
		return this.type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public Language getLanguage() {
		return this.language;
	}

	public void setLanguage(Language language) {
		this.language = language;
	}

	public MediumEventRelationshiptype getMediumEventRelationshiptype() {
		return this.mediumEventRelationshiptype;
	}

	public void setMediumEventRelationshiptype(MediumEventRelationshiptype mediumEventRelationshiptype) {
		this.mediumEventRelationshiptype = mediumEventRelationshiptype;
	}

}