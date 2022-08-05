package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.Table;


/**
 * The persistent class for the event_event_relationship_type_translation database table.
 *
 * @author Jens-Martin Loebel <loebel@bitgilde.de>
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Entity
@Table(name="event_event_relationship_type_translation")
@NamedQuery(name="EventEventRelationshipTypeTranslation.findAll", query="SELECT e FROM EventEventRelationshipTypeTranslation e")
public class EventEventRelationshipTypeTranslation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private int id;

	private String type;

	//bi-directional many-to-one association to EventEventRelationshipType
	@ManyToOne
	@JoinColumn(name="event_event_relationship_type_id")
	@JsonBackReference(value = "EventEventRelationshipType-EventEventRelationshipTypeTranslation")
	private EventEventRelationshipType eventEventRelationshipType;

	//bi-directional many-to-one association to Language
	@ManyToOne
	private Language language;

	public EventEventRelationshipTypeTranslation() {
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

	public EventEventRelationshipType getEventEventRelationshipType() {
		return this.eventEventRelationshipType;
	}

	public void setEventEventRelationshipType(EventEventRelationshipType eventEventRelationshipType) {
		this.eventEventRelationshipType = eventEventRelationshipType;
	}

	public Language getLanguage() {
		return this.language;
	}

	public void setLanguage(Language language) {
		this.language = language;
	}

}