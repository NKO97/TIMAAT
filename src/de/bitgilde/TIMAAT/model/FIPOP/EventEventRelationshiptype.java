package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;
import java.util.List;


/**
 * The persistent class for the event_event_relationship_type database table.
 * 
 */
@Entity
@Table(name="event_event_relationship_type")
@NamedQuery(name="EventEventRelationshipType.findAll", query="SELECT e FROM EventEventRelationshipType e")
public class EventEventRelationshipType implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private int id;

	//bi-directional many-to-one association to EventEventRelationshipTypeTranslation
	@OneToMany(mappedBy="eventEventRelationshipType")
	private List<EventEventRelationshipTypeTranslation> eventEventRelationshipTypeTranslations;

	//bi-directional many-to-one association to EventRelatesToEvent
	@OneToMany(mappedBy="eventEventRelationshipType")
	private List<EventRelatesToEvent> eventRelatesToEvents;

	public EventEventRelationshipType() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public List<EventEventRelationshipTypeTranslation> getEventEventRelationshipTypeTranslations() {
		return this.eventEventRelationshipTypeTranslations;
	}

	public void setEventEventRelationshipTypeTranslations(List<EventEventRelationshipTypeTranslation> eventEventRelationshipTypeTranslations) {
		this.eventEventRelationshipTypeTranslations = eventEventRelationshipTypeTranslations;
	}

	public EventEventRelationshipTypeTranslation addEventEventRelationshipTypeTranslation(EventEventRelationshipTypeTranslation eventEventRelationshipTypeTranslation) {
		getEventEventRelationshipTypeTranslations().add(eventEventRelationshipTypeTranslation);
		eventEventRelationshipTypeTranslation.setEventEventRelationshipType(this);

		return eventEventRelationshipTypeTranslation;
	}

	public EventEventRelationshipTypeTranslation removeEventEventRelationshipTypeTranslation(EventEventRelationshipTypeTranslation eventEventRelationshipTypeTranslation) {
		getEventEventRelationshipTypeTranslations().remove(eventEventRelationshipTypeTranslation);
		// eventEventRelationshipTypeTranslation.setEventEventRelationshipType(null);

		return eventEventRelationshipTypeTranslation;
	}

	public List<EventRelatesToEvent> getEventRelatesToEvents() {
		return this.eventRelatesToEvents;
	}

	public void setEventRelatesToEvents(List<EventRelatesToEvent> eventRelatesToEvents) {
		this.eventRelatesToEvents = eventRelatesToEvents;
	}

	public EventRelatesToEvent addEventRelatesToEvent(EventRelatesToEvent eventRelatesToEvent) {
		getEventRelatesToEvents().add(eventRelatesToEvent);
		eventRelatesToEvent.setEventEventRelationshipType(this);

		return eventRelatesToEvent;
	}

	public EventRelatesToEvent removeEventRelatesToEvent(EventRelatesToEvent eventRelatesToEvent) {
		getEventRelatesToEvents().remove(eventRelatesToEvent);
		// eventRelatesToEvent.setEventEventRelationshipType(null);

		return eventRelatesToEvent;
	}

}