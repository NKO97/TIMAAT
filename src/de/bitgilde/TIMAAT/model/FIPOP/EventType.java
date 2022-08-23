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

/*
 Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
 */

/**
 * The persistent class for the event_type database table.
 *
 * @author Mirko Scherf <mscherf@uni-mainz.de>
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