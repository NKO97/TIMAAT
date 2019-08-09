package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the event_event_relationshiptypetranslation database table.
 * 
 */
@Entity
@Table(name="event_event_relationshiptypetranslation")
@NamedQuery(name="EventEventRelationshiptypetranslation.findAll", query="SELECT e FROM EventEventRelationshiptypetranslation e")
public class EventEventRelationshiptypetranslation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private int id;

	private String type;

	//bi-directional many-to-one association to EventEventRelationshiptype
	@ManyToOne
	@JoinColumn(name="Event_Event_RelationshipTypeID")
	private EventEventRelationshiptype eventEventRelationshiptype;

	//bi-directional many-to-one association to Language
	@ManyToOne
	@JoinColumn(name="LanguageID")
	private Language language;

	public EventEventRelationshiptypetranslation() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getType() {
		return this.type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public EventEventRelationshiptype getEventEventRelationshiptype() {
		return this.eventEventRelationshiptype;
	}

	public void setEventEventRelationshiptype(EventEventRelationshiptype eventEventRelationshiptype) {
		this.eventEventRelationshiptype = eventEventRelationshiptype;
	}

	public Language getLanguage() {
		return this.language;
	}

	public void setLanguage(Language language) {
		this.language = language;
	}

}