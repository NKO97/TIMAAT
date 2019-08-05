package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;
import java.util.List;


/**
 * The persistent class for the eventtype database table.
 * 
 */
@Entity
@NamedQuery(name="Eventtype.findAll", query="SELECT e FROM Eventtype e")
public class Eventtype implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private int id;

	//bi-directional many-to-many association to Event
	@ManyToMany
	@JoinTable(
		name="event_has_eventtype"
		, joinColumns={
			@JoinColumn(name="EventTypeID")
			}
		, inverseJoinColumns={
			@JoinColumn(name="EventID")
			}
		)
	private List<Event> events;

	//bi-directional many-to-one association to Eventtypetranslation
	@OneToMany(mappedBy="eventtype")
	private List<Eventtypetranslation> eventtypetranslations;

	public Eventtype() {
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

	public List<Eventtypetranslation> getEventtypetranslations() {
		return this.eventtypetranslations;
	}

	public void setEventtypetranslations(List<Eventtypetranslation> eventtypetranslations) {
		this.eventtypetranslations = eventtypetranslations;
	}

	public Eventtypetranslation addEventtypetranslation(Eventtypetranslation eventtypetranslation) {
		getEventtypetranslations().add(eventtypetranslation);
		eventtypetranslation.setEventtype(this);

		return eventtypetranslation;
	}

	public Eventtypetranslation removeEventtypetranslation(Eventtypetranslation eventtypetranslation) {
		getEventtypetranslations().remove(eventtypetranslation);
		eventtypetranslation.setEventtype(null);

		return eventtypetranslation;
	}

}