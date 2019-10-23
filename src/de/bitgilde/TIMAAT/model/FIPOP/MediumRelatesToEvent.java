package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonBackReference;


/**
 * The persistent class for the medium_relates_to_event database table.
 * 
 */
@Entity
@Table(name="medium_relates_to_event")
@NamedQuery(name="MediumRelatesToEvent.findAll", query="SELECT m FROM MediumRelatesToEvent m")
public class MediumRelatesToEvent implements Serializable {
	private static final long serialVersionUID = 1L;

	@EmbeddedId
	private MediumRelatesToEventPK id;

	//bi-directional many-to-one association to Event
	@ManyToOne
	@JsonBackReference(value = "Event-MediumRelatesToEvent")
	private Event event;

	//bi-directional many-to-one association to Medium
	@ManyToOne
	@JsonBackReference(value = "Medium-MediumRelatesToEvent")
	private Medium medium;

	//bi-directional many-to-one association to MediumEventRelationshipType
	@ManyToOne
	@JoinColumn(name="medium_event_relationship_type_id")
	@JsonBackReference(value = "MediumEventRelationshipType-MediumRelatesToEvent")
	private MediumEventRelationshipType mediumEventRelationshipType;

	public MediumRelatesToEvent() {
	}

	public MediumRelatesToEventPK getId() {
		return this.id;
	}

	public void setId(MediumRelatesToEventPK id) {
		this.id = id;
	}

	public Event getEvent() {
		return this.event;
	}

	public void setEvent(Event event) {
		this.event = event;
	}

	public Medium getMedium() {
		return this.medium;
	}

	public void setMedium(Medium medium) {
		this.medium = medium;
	}

	public MediumEventRelationshipType getMediumEventRelationshipType() {
		return this.mediumEventRelationshipType;
	}

	public void setMediumEventRelationshipType(MediumEventRelationshipType mediumEventRelationshipType) {
		this.mediumEventRelationshipType = mediumEventRelationshipType;
	}

}