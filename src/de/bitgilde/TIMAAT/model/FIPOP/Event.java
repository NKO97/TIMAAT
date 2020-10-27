package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.sql.Timestamp;
import java.util.List;


/**
 * The persistent class for the event database table.
 * 
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

	//bi-directional many-to-one association to Location
	@ManyToOne
	@JsonBackReference(value = "Location-Event")
	private Location location;

	//bi-directional many-to-one association to UserAccount
	@ManyToOne
	@JsonIgnore
	@JoinColumn(name="created_by_user_account_id")
	private UserAccount createdByUserAccount;
	@Transient
	@JsonProperty("createdByUserAccountID")
	private int createdByUserAccountID;

	//bi-directional many-to-one association to UserAccount
	@ManyToOne
	@JsonIgnore
	@JoinColumn(name="last_edited_by_user_account_id")
	private UserAccount lastEditedByUserAccount;
	@Transient
	@JsonProperty("lastEditedByUserAccountID")
	private int lastEditedByUserAccountID;

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
	private List<EventDomain> eventDomains;

	//bi-directional many-to-many association to EventType
	@ManyToMany(mappedBy="events")
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
	// @JsonManagedReference(value = "Event-EventTranslation")
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

	public int getCreatedByUserAccountID() {
		if ( this.createdByUserAccount != null ) return this.createdByUserAccount.getId();
		return 0;
	}

	public UserAccount getLastEditedByUserAccount() {
		return this.lastEditedByUserAccount;
	}

	public void setLastEditedByUserAccount(UserAccount lastEditedByUserAccount) {
		this.lastEditedByUserAccount = lastEditedByUserAccount;
	}

	public int getLastEditedByUserAccountID() {
		if ( this.lastEditedByUserAccount != null ) return this.lastEditedByUserAccount.getId();
		return 0;
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