package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import jakarta.persistence.*;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;


/**
 * The persistent class for the medium_event_relationship_type_translation database table.
 * 
 */
@Entity
@Table(name="medium_event_relationship_type_translation")
@NamedQuery(name="MediumEventRelationshipTypeTranslation.findAll", query="SELECT m FROM MediumEventRelationshipTypeTranslation m")
public class MediumEventRelationshipTypeTranslation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private int id;

	private String type;

	//bi-directional many-to-one association to Language
	@ManyToOne
	private Language language;

	//bi-directional many-to-one association to MediumEventRelationshipType
	@ManyToOne
	@JoinColumn(name="medium_event_relationship_type_id")
	@JsonIgnore
	private MediumEventRelationshipType mediumEventRelationshipType;

	public MediumEventRelationshipTypeTranslation() {
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

	public MediumEventRelationshipType getMediumEventRelationshipType() {
		return this.mediumEventRelationshipType;
	}

	public void setMediumEventRelationshipType(MediumEventRelationshipType mediumEventRelationshipType) {
		this.mediumEventRelationshipType = mediumEventRelationshipType;
	}

}