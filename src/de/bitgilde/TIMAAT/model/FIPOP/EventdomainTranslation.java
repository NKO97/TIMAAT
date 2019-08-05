package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the eventdomain_translation database table.
 * 
 */
@Entity
@Table(name="eventdomain_translation")
@NamedQuery(name="EventdomainTranslation.findAll", query="SELECT e FROM EventdomainTranslation e")
public class EventdomainTranslation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private int id;

	private String type;

	//bi-directional many-to-one association to Eventdomain
	@ManyToOne
	@JoinColumn(name="EventDomainID")
	private Eventdomain eventdomain;

	//bi-directional many-to-one association to Language
	@ManyToOne
	@JoinColumn(name="LanguageID")
	private Language language;

	public EventdomainTranslation() {
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

	public Eventdomain getEventdomain() {
		return this.eventdomain;
	}

	public void setEventdomain(Eventdomain eventdomain) {
		this.eventdomain = eventdomain;
	}

	public Language getLanguage() {
		return this.language;
	}

	public void setLanguage(Language language) {
		this.language = language;
	}

}