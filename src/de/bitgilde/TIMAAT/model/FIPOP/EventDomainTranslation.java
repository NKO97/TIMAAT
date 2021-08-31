package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import jakarta.persistence.*;

import com.fasterxml.jackson.annotation.JsonBackReference;


/**
 * The persistent class for the event_domain_translation database table.
 * 
 */
@Entity
@Table(name="event_domain_translation")
@NamedQuery(name="EventDomainTranslation.findAll", query="SELECT e FROM EventDomainTranslation e")
public class EventDomainTranslation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private int id;

	private String type;

	//bi-directional many-to-one association to EventDomain
	@ManyToOne
	@JoinColumn(name="event_domain_id")
	@JsonBackReference(value = "EventDomain-EventDomainTranslation")
	private EventDomain eventDomain;

	//bi-directional many-to-one association to Language
	@ManyToOne
	private Language language;

	public EventDomainTranslation() {
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

	public EventDomain getEventDomain() {
		return this.eventDomain;
	}

	public void setEventDomain(EventDomain eventDomain) {
		this.eventDomain = eventDomain;
	}

	public Language getLanguage() {
		return this.language;
	}

	public void setLanguage(Language language) {
		this.language = language;
	}

}