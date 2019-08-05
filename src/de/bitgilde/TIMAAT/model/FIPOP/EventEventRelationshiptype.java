package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;
import java.util.List;


/**
 * The persistent class for the event_event_relationshiptype database table.
 * 
 */
@Entity
@Table(name="event_event_relationshiptype")
@NamedQuery(name="EventEventRelationshiptype.findAll", query="SELECT e FROM EventEventRelationshiptype e")
public class EventEventRelationshiptype implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private int id;

	//bi-directional many-to-one association to EventEventRelationshiptypetranslation
	@OneToMany(mappedBy="eventEventRelationshiptype")
	private List<EventEventRelationshiptypetranslation> eventEventRelationshiptypetranslations;

	//bi-directional many-to-one association to EventRelatesToEvent
	@OneToMany(mappedBy="eventEventRelationshiptype")
	private List<EventRelatesToEvent> eventRelatesToEvents;

	public EventEventRelationshiptype() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public List<EventEventRelationshiptypetranslation> getEventEventRelationshiptypetranslations() {
		return this.eventEventRelationshiptypetranslations;
	}

	public void setEventEventRelationshiptypetranslations(List<EventEventRelationshiptypetranslation> eventEventRelationshiptypetranslations) {
		this.eventEventRelationshiptypetranslations = eventEventRelationshiptypetranslations;
	}

	public EventEventRelationshiptypetranslation addEventEventRelationshiptypetranslation(EventEventRelationshiptypetranslation eventEventRelationshiptypetranslation) {
		getEventEventRelationshiptypetranslations().add(eventEventRelationshiptypetranslation);
		eventEventRelationshiptypetranslation.setEventEventRelationshiptype(this);

		return eventEventRelationshiptypetranslation;
	}

	public EventEventRelationshiptypetranslation removeEventEventRelationshiptypetranslation(EventEventRelationshiptypetranslation eventEventRelationshiptypetranslation) {
		getEventEventRelationshiptypetranslations().remove(eventEventRelationshiptypetranslation);
		eventEventRelationshiptypetranslation.setEventEventRelationshiptype(null);

		return eventEventRelationshiptypetranslation;
	}

	public List<EventRelatesToEvent> getEventRelatesToEvents() {
		return this.eventRelatesToEvents;
	}

	public void setEventRelatesToEvents(List<EventRelatesToEvent> eventRelatesToEvents) {
		this.eventRelatesToEvents = eventRelatesToEvents;
	}

	public EventRelatesToEvent addEventRelatesToEvent(EventRelatesToEvent eventRelatesToEvent) {
		getEventRelatesToEvents().add(eventRelatesToEvent);
		eventRelatesToEvent.setEventEventRelationshiptype(this);

		return eventRelatesToEvent;
	}

	public EventRelatesToEvent removeEventRelatesToEvent(EventRelatesToEvent eventRelatesToEvent) {
		getEventRelatesToEvents().remove(eventRelatesToEvent);
		eventRelatesToEvent.setEventEventRelationshiptype(null);

		return eventRelatesToEvent;
	}

}