package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the event_relates_to_event database table.
 * 
 */
@Entity
@Table(name="event_relates_to_event")
@NamedQuery(name="EventRelatesToEvent.findAll", query="SELECT e FROM EventRelatesToEvent e")
public class EventRelatesToEvent implements Serializable {
	private static final long serialVersionUID = 1L;

	@EmbeddedId
	private EventRelatesToEventPK id;

	//bi-directional many-to-one association to Event
	@ManyToOne
	@JoinColumn(name="EventID")
	private Event event1;

	//bi-directional many-to-one association to Event
	@ManyToOne
	@JoinColumn(name="Relates_to_EventID")
	private Event event2;

	//bi-directional many-to-one association to EventEventRelationshiptype
	@ManyToOne
	@JoinColumn(name="Event_Event_RelationshipTypeID")
	private EventEventRelationshiptype eventEventRelationshiptype;

	public EventRelatesToEvent() {
	}

	public EventRelatesToEventPK getId() {
		return this.id;
	}

	public void setId(EventRelatesToEventPK id) {
		this.id = id;
	}

	public Event getEvent1() {
		return this.event1;
	}

	public void setEvent1(Event event1) {
		this.event1 = event1;
	}

	public Event getEvent2() {
		return this.event2;
	}

	public void setEvent2(Event event2) {
		this.event2 = event2;
	}

	public EventEventRelationshiptype getEventEventRelationshiptype() {
		return this.eventEventRelationshiptype;
	}

	public void setEventEventRelationshiptype(EventEventRelationshiptype eventEventRelationshiptype) {
		this.eventEventRelationshiptype = eventEventRelationshiptype;
	}

}