package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.*;
import java.util.Date;
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
	private Date beginsAtDate;

	@Temporal(TemporalType.TIMESTAMP)
	private Date endsAtDate;

	private String name;

	private String description;

	//bi-directional many-to-one association to UserAccount
	// @ManyToOne
	// @JoinColumn(name="created_by_user_account_id")
	// private UserAccount created_by_user_account_id;
	private int created_by_user_account_id;

	//bi-directional many-to-one association to UserAccount
	// @ManyToOne
	// @JoinColumn(name="last_Edited_by_user_account_id")
	// private UserAccount last_edited_by_user_account_id;
	private int last_edited_by_user_account_id;

	private Timestamp created_at;

	private Timestamp last_edited_at;

	//bi-directional many-to-many association to ActorHasRole
	// @ManyToMany(mappedBy="events")
	// private List<ActorHasRole> actorHasRoles;

	// //bi-directional many-to-many association to ActorHasRole
	// @ManyToMany
	// @JoinTable(
	// 	name="event_has_actor_with_role"
	// 	, joinColumns={
	// 		@JoinColumn(name="EventID")
	// 		}
	// 	, inverseJoinColumns={
	// 		@JoinColumn(name="actor_has_role_ActorID", referencedColumnName="ActorID"),
	// 		@JoinColumn(name="actor_has_role_RoleID", referencedColumnName="RoleID")
	// 		}
	// 	)
	// private List<ActorHasRole> actorHasRoles;

	// //bi-directional many-to-many association to Annotation
	// @ManyToMany
	// @JoinTable(
	// 	name="annotation_has_event"
	// 	, joinColumns={
	// 		@JoinColumn(name="EventID")
	// 		}
	// 	, inverseJoinColumns={
	// 		@JoinColumn(name="AnnotationID")
	// 		}
	// 	)
	// private List<Annotation> annotations;

	// //bi-directional many-to-many association to Tag
	@ManyToMany(mappedBy="events", cascade=CascadeType.PERSIST)
	private List<Tag> tags;
	
	//bi-directional many-to-many association to Tag
	// @ManyToMany
	// @JoinTable(
	// 	name="Event_has_Tag"
	// 	, joinColumns={
	// 		@JoinColumn(name="Event_ID")
	// 		}
	// 	, inverseJoinColumns={
	// 		@JoinColumn(name="Tag_ID")
	// 		}
	// 	)
	// private List<Tag> tags;

	//bi-directional many-to-one association to Location
	@ManyToOne
	// @JoinColumn(name="LocationID")
	private Location location;

	// private int locationID;

	//bi-directional many-to-one association to EventRelatesToEvent
	@OneToMany(mappedBy="event1")
	private List<EventRelatesToEvent> eventRelatesToEvents1;

	//bi-directional many-to-one association to EventRelatesToEvent
	@OneToMany(mappedBy="event2")
	private List<EventRelatesToEvent> eventRelatesToEvents2;

	//bi-directional many-to-many association to Eventdomain
	@ManyToMany(mappedBy="events")
	private List<Eventdomain> eventdomains;

	//bi-directional many-to-one association to Eventtranslation
	@OneToMany(mappedBy="event")
	private List<Eventtranslation> eventtranslations;

	//bi-directional many-to-many association to Eventtype
	@ManyToMany(mappedBy="events")
	private List<Eventtype> eventtypes;

	//bi-directional many-to-one association to MediumRelatesToEvent
	@OneToMany(mappedBy="event")
	private List<MediumRelatesToEvent> mediumRelatesToEvents;

	public Event() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getName() {
		return this.name;
		// return this.eventtranslations.get(id).getName();
	}

	public void setName(String name) {
		this.name = name;
		// this.eventtranslations.get(id).setName(name);
	}

	public String getDescription() {
		return this.description;
		// return this.eventtranslations.get(id).getDescription();
	}

	public void setDescription(String description) {
		this.description = description;
		// this.eventtranslations.get(id).setDescription(description);
	}

	public Date getBeginsAtDate() {
		return this.beginsAtDate;
	}

	public void setBeginsAtDate(Date beginsAtDate) {
		this.beginsAtDate = beginsAtDate;
	}

	public Date getEndsAtDate() {
		return this.endsAtDate;
	}

	public void setEndsAtDate(Date endsAtDate) {
		this.endsAtDate = endsAtDate;
	}

	// public UserAccount getCreatedByUserAccount() {
	// 	return this.created_by_user_account;
	// }

	// public void setCreatedByUserAccount(UserAccount created_by_user_account) {
	// 	this.created_by_user_account = created_by_user_account;
	// }
	
	// public UserAccount getLastEditedByUserAccount() {
	// 	return this.last_edited_by_user_account;
	// }

	// public void setLastEditedByUserAccount(UserAccount last_edited_by_user_account) {
	// 	this.last_edited_by_user_account = last_edited_by_user_account;
	// }

	public int getCreatedByUserAccountID() {
		return this.created_by_user_account_id;
	}

	public void setCreatedByUserAccountID(int created_by_user_account_id) {
		this.created_by_user_account_id = created_by_user_account_id;
	}
	
	public int getLastEditedByUserAccountID() {
		return this.last_edited_by_user_account_id;
	}

	public void setLastEditedByUserAccountID(int last_edited_by_user_account_id) {
		this.last_edited_by_user_account_id = last_edited_by_user_account_id;
	}

	public Timestamp getCreatedAt() {
		return this.created_at;
	}

	public void setCreatedAt(Timestamp created_at) {
		this.created_at = created_at;
	}

	public Timestamp getLastEditedAt() {
		return this.last_edited_at;
	}

	public void setLastEditedAt(Timestamp last_edited_at) {
		this.last_edited_at = last_edited_at;
	}

	// public List<ActorHasRole> getActorHasRoles() {
	// 	return this.actorHasRoles;
	// }

	// public void setActorHasRoles(List<ActorHasRole> actorHasRoles) {
	// 	this.actorHasRoles = actorHasRoles;
	// }

	// public List<Annotation> getAnnotations() {
	// 	return this.annotations;
	// }

	// public void setAnnotations(List<Annotation> annotations) {
	// 	this.annotations = annotations;
	// }

	public Location getLocation() {
		return this.location;
	}

	public void setLocation(Location location) {
		this.location = location;
	}

	// public int getLocationID() {
	// 	return this.locationID;
	// }

	// public void setLocationID(int locationID) {
	// 	this.locationID = locationID;
	// }

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

	public List<Eventdomain> getEventdomains() {
		return this.eventdomains;
	}

	public void setEventdomains(List<Eventdomain> eventdomains) {
		this.eventdomains = eventdomains;
	}

	public List<Eventtranslation> getEventtranslations() {
		return this.eventtranslations;
	}

	public void setEventtranslations(List<Eventtranslation> eventtranslations) {
		this.eventtranslations = eventtranslations;
	}

	public Eventtranslation addEventtranslation(Eventtranslation eventtranslation) {
		getEventtranslations().add(eventtranslation);
		eventtranslation.setEvent(this);

		return eventtranslation;
	}

	public Eventtranslation removeEventtranslation(Eventtranslation eventtranslation) {
		getEventtranslations().remove(eventtranslation);
		eventtranslation.setEvent(null);

		return eventtranslation;
	}

	public List<Eventtype> getEventtypes() {
		return this.eventtypes;
	}

	public void setEventtypes(List<Eventtype> eventtypes) {
		this.eventtypes = eventtypes;
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

	public List<Tag> getTags() {
		return this.tags;
	}

	public void setTags(List<Tag> tags) {
		this.tags = tags;
	}

}