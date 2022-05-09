package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;


/**
 * The persistent class for the event_type database table.
 *
 */
@Entity
@Table(name="event_type")
@NamedQuery(name="EventType.findAll", query="SELECT e FROM EventType e")
public class EventType implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private int id;

	//bi-directional many-to-many association to Event
	@ManyToMany
	@JoinTable(
		name="event_has_event_type"
		, joinColumns={
			@JoinColumn(name="event_type_id")
			}
		, inverseJoinColumns={
			@JoinColumn(name="event_id")
			}
		)
	private List<Event> events;

	//bi-directional many-to-one association to EventTypeTranslation
	@OneToMany(mappedBy="eventType")
	@JsonManagedReference(value = "EventType-EventTypeTranslation")
	private List<EventTypeTranslation> eventTypeTranslations;

	public EventType() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public List<Event> getEvents() {
		return this.events;
	}

	public void setEvents(List<Event> events) {
		this.events = events;
	}

	public List<EventTypeTranslation> getEventTypeTranslations() {
		return this.eventTypeTranslations;
	}

	public void setEventTypeTranslations(List<EventTypeTranslation> eventTypeTranslations) {
		this.eventTypeTranslations = eventTypeTranslations;
	}

	public EventTypeTranslation addEventTypeTranslation(EventTypeTranslation eventTypeTranslation) {
		getEventTypeTranslations().add(eventTypeTranslation);
		eventTypeTranslation.setEventType(this);

		return eventTypeTranslation;
	}

	public EventTypeTranslation removeEventTypeTranslation(EventTypeTranslation eventTypeTranslation) {
		getEventTypeTranslations().remove(eventTypeTranslation);
		// eventTypeTranslation.setEventType(null);

		return eventTypeTranslation;
	}

}