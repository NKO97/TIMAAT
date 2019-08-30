package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;
import java.util.Date;


/**
 * The persistent class for the actor_is_located_in_country database table.
 * 
 */
@Entity
@Table(name="actor_is_located_in_country")
@NamedQuery(name="ActorIsLocatedInCountry.findAll", query="SELECT a FROM ActorIsLocatedInCountry a")
public class ActorIsLocatedInCountry implements Serializable {
	private static final long serialVersionUID = 1L;

	@EmbeddedId
	private ActorIsLocatedInCountryPK id;

	@Temporal(TemporalType.DATE)
	private Date from;

	@Temporal(TemporalType.DATE)
	private Date until;

	//bi-directional many-to-one association to Actor
	@ManyToOne
	@JoinColumn(name="actor_id")
	private Actor actor;

	//bi-directional many-to-one association to Country
	@ManyToOne
	@JoinColumn(name="country_location_id")
	private Country country;

	public ActorIsLocatedInCountry() {
	}

	public ActorIsLocatedInCountryPK getId() {
		return this.id;
	}

	public void setId(ActorIsLocatedInCountryPK id) {
		this.id = id;
	}

	public Date getFrom() {
		return this.from;
	}

	public void setFrom(Date from) {
		this.from = from;
	}

	public Date getUntil() {
		return this.until;
	}

	public void setUntil(Date until) {
		this.until = until;
	}

	public Actor getActor() {
		return this.actor;
	}

	public void setActor(Actor actor) {
		this.actor = actor;
	}

	public Country getCountry() {
		return this.country;
	}

	public void setCountry(Country country) {
		this.country = country;
	}

}