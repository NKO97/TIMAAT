package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.util.List;


/**
 * The persistent class for the medium_event_relationship_type database table.
 * 
 */
@Entity
@Table(name="medium_event_relationship_type")
@NamedQuery(name="MediumEventRelationshipType.findAll", query="SELECT m FROM MediumEventRelationshipType m")
public class MediumEventRelationshipType implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private int id;

	//bi-directional many-to-one association to MediumEventRelationshipTypeTranslation
	@OneToMany(mappedBy="mediumEventRelationshipType")
	@JsonManagedReference(value = "MediumEventRelationshipType-MediumEventRelationshipTypeTranslation")
	private List<MediumEventRelationshipTypeTranslation> mediumEventRelationshipTypeTranslations;

	//bi-directional many-to-one association to MediumRelatesToEvent
	@OneToMany(mappedBy="mediumEventRelationshipType")
	@JsonManagedReference(value = "MediumEventRelationshipType-MediumRelatesToEvent")
	private List<MediumRelatesToEvent> mediumRelatesToEvents;

	public MediumEventRelationshipType() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public List<MediumEventRelationshipTypeTranslation> getMediumEventRelationshipTypeTranslations() {
		return this.mediumEventRelationshipTypeTranslations;
	}

	public void setMediumEventRelationshipTypeTranslations(List<MediumEventRelationshipTypeTranslation> mediumEventRelationshipTypeTranslations) {
		this.mediumEventRelationshipTypeTranslations = mediumEventRelationshipTypeTranslations;
	}

	public MediumEventRelationshipTypeTranslation addMediumEventRelationshipTypeTranslation(MediumEventRelationshipTypeTranslation mediumEventRelationshipTypeTranslation) {
		getMediumEventRelationshipTypeTranslations().add(mediumEventRelationshipTypeTranslation);
		mediumEventRelationshipTypeTranslation.setMediumEventRelationshipType(this);

		return mediumEventRelationshipTypeTranslation;
	}

	public MediumEventRelationshipTypeTranslation removeMediumEventRelationshipTypeTranslation(MediumEventRelationshipTypeTranslation mediumEventRelationshipTypeTranslation) {
		getMediumEventRelationshipTypeTranslations().remove(mediumEventRelationshipTypeTranslation);
		mediumEventRelationshipTypeTranslation.setMediumEventRelationshipType(null);

		return mediumEventRelationshipTypeTranslation;
	}

	public List<MediumRelatesToEvent> getMediumRelatesToEvents() {
		return this.mediumRelatesToEvents;
	}

	public void setMediumRelatesToEvents(List<MediumRelatesToEvent> mediumRelatesToEvents) {
		this.mediumRelatesToEvents = mediumRelatesToEvents;
	}

	public MediumRelatesToEvent addMediumRelatesToEvent(MediumRelatesToEvent mediumRelatesToEvent) {
		getMediumRelatesToEvents().add(mediumRelatesToEvent);
		mediumRelatesToEvent.setMediumEventRelationshipType(this);

		return mediumRelatesToEvent;
	}

	public MediumRelatesToEvent removeMediumRelatesToEvent(MediumRelatesToEvent mediumRelatesToEvent) {
		getMediumRelatesToEvents().remove(mediumRelatesToEvent);
		mediumRelatesToEvent.setMediumEventRelationshipType(null);

		return mediumRelatesToEvent;
	}

}