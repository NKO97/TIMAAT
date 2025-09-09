package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
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
 * The persistent class for the event_event_relationship_type database table.
 *
 * @author Mirko Scherf <mscherf@uni-mainz.de>
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
	@JsonManagedReference(value = "EventEventRelationshipType-EventEventRelationshipTypeTranslation")
	private List<EventEventRelationshipTypeTranslation> eventEventRelationshipTypeTranslations;

	//bi-directional many-to-one association to EventRelatesToEvent
	@OneToMany(mappedBy="eventEventRelationshipType")
	@JsonManagedReference(value = "EventEventRelationshipType-EventRelatesToEvent")
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