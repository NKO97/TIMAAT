package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;
import java.util.List;


/**
 * The persistent class for the medium_event_relationshiptype database table.
 * 
 */
@Entity
@Table(name="medium_event_relationshiptype")
@NamedQuery(name="MediumEventRelationshiptype.findAll", query="SELECT m FROM MediumEventRelationshiptype m")
public class MediumEventRelationshiptype implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private int id;

	//bi-directional many-to-one association to MediumEventRelationshiptypeTranslation
	@OneToMany(mappedBy="mediumEventRelationshiptype")
	private List<MediumEventRelationshiptypeTranslation> mediumEventRelationshiptypeTranslations;

	//bi-directional many-to-one association to MediumRelatesToEvent
	@OneToMany(mappedBy="mediumEventRelationshiptype")
	private List<MediumRelatesToEvent> mediumRelatesToEvents;

	public MediumEventRelationshiptype() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public List<MediumEventRelationshiptypeTranslation> getMediumEventRelationshiptypeTranslations() {
		return this.mediumEventRelationshiptypeTranslations;
	}

	public void setMediumEventRelationshiptypeTranslations(List<MediumEventRelationshiptypeTranslation> mediumEventRelationshiptypeTranslations) {
		this.mediumEventRelationshiptypeTranslations = mediumEventRelationshiptypeTranslations;
	}

	public MediumEventRelationshiptypeTranslation addMediumEventRelationshiptypeTranslation(MediumEventRelationshiptypeTranslation mediumEventRelationshiptypeTranslation) {
		getMediumEventRelationshiptypeTranslations().add(mediumEventRelationshiptypeTranslation);
		mediumEventRelationshiptypeTranslation.setMediumEventRelationshiptype(this);

		return mediumEventRelationshiptypeTranslation;
	}

	public MediumEventRelationshiptypeTranslation removeMediumEventRelationshiptypeTranslation(MediumEventRelationshiptypeTranslation mediumEventRelationshiptypeTranslation) {
		getMediumEventRelationshiptypeTranslations().remove(mediumEventRelationshiptypeTranslation);
		mediumEventRelationshiptypeTranslation.setMediumEventRelationshiptype(null);

		return mediumEventRelationshiptypeTranslation;
	}

	public List<MediumRelatesToEvent> getMediumRelatesToEvents() {
		return this.mediumRelatesToEvents;
	}

	public void setMediumRelatesToEvents(List<MediumRelatesToEvent> mediumRelatesToEvents) {
		this.mediumRelatesToEvents = mediumRelatesToEvents;
	}

	public MediumRelatesToEvent addMediumRelatesToEvent(MediumRelatesToEvent mediumRelatesToEvent) {
		getMediumRelatesToEvents().add(mediumRelatesToEvent);
		mediumRelatesToEvent.setMediumEventRelationshiptype(this);

		return mediumRelatesToEvent;
	}

	public MediumRelatesToEvent removeMediumRelatesToEvent(MediumRelatesToEvent mediumRelatesToEvent) {
		getMediumRelatesToEvents().remove(mediumRelatesToEvent);
		mediumRelatesToEvent.setMediumEventRelationshiptype(null);

		return mediumRelatesToEvent;
	}

}