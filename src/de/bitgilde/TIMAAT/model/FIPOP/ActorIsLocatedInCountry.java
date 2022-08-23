package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQuery;
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
 * The persistent class for the actor_is_located_in_country database table.
 *
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Entity
@Table(name="actor_is_located_in_country")
@NamedQuery(name="ActorIsLocatedInCountry.findAll", query="SELECT ailic FROM ActorIsLocatedInCountry ailic")
public class ActorIsLocatedInCountry implements Serializable {
	private static final long serialVersionUID = 1L;

	@EmbeddedId
	private ActorIsLocatedInCountryPK id;

	@Column(columnDefinition = "DATE")
	private Date from;

	@Column(columnDefinition = "DATE")
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