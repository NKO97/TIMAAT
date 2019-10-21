package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.util.Date;
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

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name="begins_at_date")
	private Date beginsAtDate;

	@Column(name="created_at")
	private Timestamp createdAt;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name="ends_at_date")
	private Date endsAtDate;

	@Column(name="last_edited_at")
	private Timestamp lastEditedAt;

	//bi-directional many-to-many association to Annotation
	@ManyToMany
	@JoinTable(
		name="annotation_has_event"
		, joinColumns={
			@JoinColumn(name="event_id")
			}
		, inverseJoinColumns={
			@JoinColumn(name="annotation_id")
			}
		)
	private List<Annotation> annotations;

	//bi-directional many-to-one association to Location
	@ManyToOne
	@JsonBackReference(value = "Location-Event")
	private Location location;

	//bi-directional many-to-one association to UserAccount
	@ManyToOne
	@JoinColumn(name="created_by_user_account_id")
	@JsonBackReference(value = "UserAccount-Event")
	private UserAccount createdByUserAccount;

	//bi-directional many-to-one association to UserAccount
	@ManyToOne
	@JoinColumn(name="last_edited_by_user_account_id")
	@JsonBackReference(value = "UserAccount-Event2")
	private UserAccount lastEditedByUserAccount;

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
	@ManyToMany(mappedBy="events", cascade=CascadeType.PERSIST)
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

	public Date getBeginsAtDate() {
		return this.beginsAtDate;
	}

	public void setBeginsAtDate(Date beginsAtDate) {
		this.beginsAtDate = beginsAtDate;
	}

	public Timestamp getCreatedAt() {
		return this.createdAt;
	}

	public void setCreatedAt(Timestamp createdAt) {
		this.createdAt = createdAt;
	}

	public Date getEndsAtDate() {
		return this.endsAtDate;
	}

	public void setEndsAtDate(Date endsAtDate) {
		this.endsAtDate = endsAtDate;
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

	public UserAccount getLastEditedByUserAccount() {
		return this.lastEditedByUserAccount;
	}

	public void setLastEditedByUserAccount(UserAccount lastEditedByUserAccount) {
		this.lastEditedByUserAccount = lastEditedByUserAccount;
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