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
 * The persistent class for the event_domain database table.
 *
 * @author Mirko Scherf <mscherf@uni-mainz.de>
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
	@JsonManagedReference(value = "EventDomain-EventDomainTranslation")
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