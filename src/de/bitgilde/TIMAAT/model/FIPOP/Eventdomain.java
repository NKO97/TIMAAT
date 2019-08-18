package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;
import java.util.List;


/**
 * The persistent class for the eventdomain database table.
 * 
 */
@Entity
@NamedQuery(name="Eventdomain.findAll", query="SELECT e FROM Eventdomain e")
public class Eventdomain implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private int id;

	//bi-directional many-to-many association to Event
	@ManyToMany
	@JoinTable(
		name="event_has_eventdomain"
		, joinColumns={
			@JoinColumn(name="EventDomainID")
			}
		, inverseJoinColumns={
			@JoinColumn(name="EventID")
			}
		)
	private List<Event> events;

	//bi-directional many-to-one association to EventdomainTranslation
	@OneToMany(mappedBy="eventdomain")
	private List<EventdomainTranslation> eventdomainTranslations;

	public Eventdomain() {
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

	public List<EventdomainTranslation> getEventdomainTranslations() {
		return this.eventdomainTranslations;
	}

	public void setEventdomainTranslations(List<EventdomainTranslation> eventdomainTranslations) {
		this.eventdomainTranslations = eventdomainTranslations;
	}

	public EventdomainTranslation addEventdomainTranslation(EventdomainTranslation eventdomainTranslation) {
		getEventdomainTranslations().add(eventdomainTranslation);
		eventdomainTranslation.setEventdomain(this);

		return eventdomainTranslation;
	}

	public EventdomainTranslation removeEventdomainTranslation(EventdomainTranslation eventdomainTranslation) {
		getEventdomainTranslations().remove(eventdomainTranslation);
		eventdomainTranslation.setEventdomain(null);

		return eventdomainTranslation;
	}

}