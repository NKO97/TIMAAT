package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.List;
import java.util.Objects;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Transient;

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
 * The persistent class for the event database table.
 *
 * @author Jens-Martin Loebel <loebel@bitgilde.de>
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Entity
@NamedQuery(name="Event.findAll", query="SELECT e FROM Event e")
public class Event implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;


	@Column(name="began_at")
	private Timestamp beganAt;

	@Column(name="created_at")
	private Timestamp createdAt;

	@Column(name="ended_at")
	private Timestamp endedAt;

	@Column(name="last_edited_at")
	private Timestamp lastEditedAt;

	//bi-directional many-to-many association to Annotation
	@ManyToMany(mappedBy = "events")
	@JsonIgnore
	private List<Annotation> annotations;

	// TODO m-n-relationship
	//bi-directional many-to-one association to Location
	@ManyToOne
	@JsonBackReference(value = "Location-Event")
	private Location location;

	//bi-directional many-to-one association to UserAccount
	@ManyToOne
	@JoinColumn(name="created_by_user_account_id")
	@JsonBackReference(value = "Event-CreatedByUserAccount")
	private UserAccount createdByUserAccount;

	@Transient
	@JsonProperty("createdByUserAccountId")
	private int createdByUserAccountId;

	//bi-directional many-to-one association to UserAccount
	@ManyToOne
	@JoinColumn(name="last_edited_by_user_account_id")
	@JsonBackReference(value = "Event-LastEditedByUserAccount")
	private UserAccount lastEditedByUserAccount;

	@Transient
	@JsonProperty("lastEditedByUserAccountId")
	private int lastEditedByUserAccountId;

	//bi-directional many-to-many association to ActorHasRole
	@ManyToMany
	@JoinTable(
		name="event_has_actor_with_role"
		, joinColumns={
			@JoinColumn(name="event_id")
			}
		, inverseJoinColumns={
			@JoinColumn(name="actor_has_role_actor_id", referencedColumnName="actor_id"),
			@JoinColumn(name="actor_has_role_role_id", referencedColumnName="role_id")
			}
		)
	private List<ActorHasRole> actorHasRoles;

	//bi-directional many-to-many association to EventDomain
	@ManyToMany(mappedBy="events")
	@JsonIgnore
	private List<EventDomain> eventDomains;

	//bi-directional many-to-many association to EventType
	@ManyToMany(mappedBy="events")
	@JsonIgnore
	private List<EventType> eventTypes;

	//bi-directional many-to-many association to Tag
	@ManyToMany
	@JoinTable(
		name="event_has_tag"
		, inverseJoinColumns={
			@JoinColumn(name="tag_id")
			}
		, joinColumns={
			@JoinColumn(name="event_id")
			}
		)
	private List<Tag> tags;

	//bi-directional many-to-one association to EventRelatesToEvent
	@OneToMany(mappedBy="event1")
	@JsonManagedReference(value = "Event-EventRelatesToEvent1")
	private List<EventRelatesToEvent> eventRelatesToEvents1;

	//bi-directional many-to-one association to EventRelatesToEvent
	@OneToMany(mappedBy="event2")
	@JsonManagedReference(value = "Event-EventRelatesToEvent2")
	private List<EventRelatesToEvent> eventRelatesToEvents2;

	//bi-directional many-to-one association to EventTranslation
	@OneToMany(mappedBy="event")
	@JsonManagedReference(value = "Event-EventTranslation")
	private List<EventTranslation> eventTranslations;

	//bi-directional many-to-one association to MediumRelatesToEvent
	@OneToMany(mappedBy="event")
	@JsonManagedReference(value = "Event-MediumRelatesToEvent")
	private List<MediumRelatesToEvent> mediumRelatesToEvents;

	public Event() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public Timestamp getBeganAt() {
		return this.beganAt;
	}

	public void setBeganAt(Timestamp beganAt) {
		this.beganAt = beganAt;
	}

	public Timestamp getCreatedAt() {
		return this.createdAt;
	}

	public void setCreatedAt(Timestamp createdAt) {
		this.createdAt = createdAt;
	}

	public Timestamp getEndedAt() {
		return this.endedAt;
	}

	public void setEndedAt(Timestamp endedAt) {
		this.endedAt = endedAt;
	}

	public Timestamp getLastEditedAt() {
		return this.lastEditedAt;
	}

	public void setLastEditedAt(Timestamp lastEditedAt) {
		this.lastEditedAt = lastEditedAt;
	}

	public List<Annotation> getAnnotations() {
		return this.annotations;
	}

	public void setAnnotations(List<Annotation> annotations) {
		this.annotations = annotations;
	}

	public Location getLocation() {
		return this.location;
	}

	public void setLocation(Location location) {
		this.location = location;
	}

	public UserAccount getCreatedByUserAccount() {
		return this.createdByUserAccount;
	}

	public void setCreatedByUserAccount(UserAccount createdByUserAccount) {
		this.createdByUserAccount = createdByUserAccount;
	}

	public int getCreatedByUserAccountId() {
		return this.getCreatedByUserAccount().getId();
	}

	public UserAccount getLastEditedByUserAccount() {
		return this.lastEditedByUserAccount;
	}

	public void setLastEditedByUserAccount(UserAccount lastEditedByUserAccount) {
		this.lastEditedByUserAccount = lastEditedByUserAccount;
	}

	public int getLastEditedByUserAccountId() {
		if (Objects.isNull(this.getLastEditedByUserAccount())) return 0;
		return this.getLastEditedByUserAccount().getId();
	}

	public List<ActorHasRole> getActorHasRoles() {
		return this.actorHasRoles;
	}

	public void setActorHasRoles(List<ActorHasRole> actorHasRoles) {
		this.actorHasRoles = actorHasRoles;
	}

	public List<EventDomain> getEventDomains() {
		return this.eventDomains;
	}

	public void setEventDomains(List<EventDomain> eventDomains) {
		this.eventDomains = eventDomains;
	}

	public List<EventType> getEventTypes() {
		return this.eventTypes;
	}

	public void setEventTypes(List<EventType> eventTypes) {
		this.eventTypes = eventTypes;
	}

	public List<Tag> getTags() {
		return this.tags;
	}

	public void setTags(List<Tag> tags) {
		this.tags = tags;
	}

	public List<EventRelatesToEvent> getEventRelatesToEvents1() {
		return this.eventRelatesToEvents1;
	}

	public void setEventRelatesToEvents1(List<EventRelatesToEvent> eventRelatesToEvents1) {
		this.eventRelatesToEvents1 = eventRelatesToEvents1;
	}

	public EventRelatesToEvent addEventRelatesToEvents1(EventRelatesToEvent eventRelatesToEvents1) {
		getEventRelatesToEvents1().add(eventRelatesToEvents1);
		eventRelatesToEvents1.setEvent1(this);

		return eventRelatesToEvents1;
	}

	public EventRelatesToEvent removeEventRelatesToEvents1(EventRelatesToEvent eventRelatesToEvents1) {
		getEventRelatesToEvents1().remove(eventRelatesToEvents1);
		eventRelatesToEvents1.setEvent1(null);

		return eventRelatesToEvents1;
	}

	public List<EventRelatesToEvent> getEventRelatesToEvents2() {
		return this.eventRelatesToEvents2;
	}

	public void setEventRelatesToEvents2(List<EventRelatesToEvent> eventRelatesToEvents2) {
		this.eventRelatesToEvents2 = eventRelatesToEvents2;
	}

	public EventRelatesToEvent addEventRelatesToEvents2(EventRelatesToEvent eventRelatesToEvents2) {
		getEventRelatesToEvents2().add(eventRelatesToEvents2);
		eventRelatesToEvents2.setEvent2(this);

		return eventRelatesToEvents2;
	}

	public EventRelatesToEvent removeEventRelatesToEvents2(EventRelatesToEvent eventRelatesToEvents2) {
		getEventRelatesToEvents2().remove(eventRelatesToEvents2);
		eventRelatesToEvents2.setEvent2(null);

		return eventRelatesToEvents2;
	}

	public List<EventTranslation> getEventTranslations() {
		return this.eventTranslations;
	}

	public void setEventTranslations(List<EventTranslation> eventTranslations) {
		this.eventTranslations = eventTranslations;
	}

	public EventTranslation addEventTranslation(EventTranslation eventTranslation) {
		getEventTranslations().add(eventTranslation);
		eventTranslation.setEvent(this);

		return eventTranslation;
	}

	public EventTranslation removeEventTranslation(EventTranslation eventTranslation) {
		getEventTranslations().remove(eventTranslation);
		// eventTranslation.setEvent(null);

		return eventTranslation;
	}

	public List<MediumRelatesToEvent> getMediumRelatesToEvents() {
		return this.mediumRelatesToEvents;
	}

	public void setMediumRelatesToEvents(List<MediumRelatesToEvent> mediumRelatesToEvents) {
		this.mediumRelatesToEvents = mediumRelatesToEvents;
	}

	public MediumRelatesToEvent addMediumRelatesToEvent(MediumRelatesToEvent mediumRelatesToEvent) {
		getMediumRelatesToEvents().add(mediumRelatesToEvent);
		mediumRelatesToEvent.setEvent(this);

		return mediumRelatesToEvent;
	}

	public MediumRelatesToEvent removeMediumRelatesToEvent(MediumRelatesToEvent mediumRelatesToEvent) {
		getMediumRelatesToEvents().remove(mediumRelatesToEvent);
		mediumRelatesToEvent.setEvent(null);

		return mediumRelatesToEvent;
	}

}