package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;


import java.util.List;


/**
 * The persistent class for the event_domain database table.
 * 
 */
@Entity
@Table(name="event_domain")
@NamedQuery(name="EventDomain.findAll", query="SELECT e FROM EventDomain e")
public class EventDomain implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private int id;

	//bi-directional many-to-one association to EventDomainTranslation
	@OneToMany(mappedBy="eventDomain")
	// @JsonManagedReference(value = "EventDomain-EventDomainTranslation")
	private List<EventDomainTranslation> eventDomainTranslations;

	//bi-directional many-to-many association to Event
	@ManyToMany
	@JoinTable(
		name="event_has_event_domain"
		, joinColumns={
			@JoinColumn(name="event_domain_id")
			}
		, inverseJoinColumns={
			@JoinColumn(name="event_id")
			}
		)
	private List<Event> events;

	public EventDomain() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public List<EventDomainTranslation> getEventDomainTranslations() {
		return this.eventDomainTranslations;
	}

	public void setEventDomainTranslations(List<EventDomainTranslation> eventDomainTranslations) {
		this.eventDomainTranslations = eventDomainTranslations;
	}

	public EventDomainTranslation addEventDomainTranslation(EventDomainTranslation eventDomainTranslation) {
		getEventDomainTranslations().add(eventDomainTranslation);
		eventDomainTranslation.setEventDomain(this);

		return eventDomainTranslation;
	}

	public EventDomainTranslation removeEventDomainTranslation(EventDomainTranslation eventDomainTranslation) {
		getEventDomainTranslations().remove(eventDomainTranslation);
		// eventDomainTranslation.setEventDomain(null);

		return eventDomainTranslation;
	}

	public List<Event> getEvents() {
		return this.events;
	}

	public void setEvents(List<Event> events) {
		this.events = events;
	}

}