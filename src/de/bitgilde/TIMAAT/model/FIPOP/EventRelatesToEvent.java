package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;


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
	@JoinColumn(name="event_id")
	@JsonBackReference(value = "Event-EventRelatesToEvent1")
	private Event event1;

	//bi-directional many-to-one association to Event
	@ManyToOne
	@JoinColumn(name="relates_to_event_id")
	@JsonBackReference(value = "Event-EventRelatesToEvent2")
	private Event event2;

	//bi-directional many-to-one association to EventEventRelationshipType
	@ManyToOne
	@JoinColumn(name="event_event_relationship_type_id")
	@JsonBackReference(value = "EventEventRelationshipType-EventRelatesToEvent")
	private EventEventRelationshipType eventEventRelationshipType;

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

	public EventEventRelationshipType getEventEventRelationshipType() {
		return this.eventEventRelationshipType;
	}

	public void setEventEventRelationshipType(EventEventRelationshipType eventEventRelationshipType) {
		this.eventEventRelationshipType = eventEventRelationshipType;
	}

}