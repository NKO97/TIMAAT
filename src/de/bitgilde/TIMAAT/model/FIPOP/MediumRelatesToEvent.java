package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonBackReference;

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
 * The persistent class for the medium_relates_to_event database table.
 *
 * @author Jens-Martin Loebel <loebel@bitgilde.de>
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Entity
@Table(name="medium_relates_to_event")
@NamedQuery(name="MediumRelatesToEvent.findAll", query="SELECT m FROM MediumRelatesToEvent m")
public class MediumRelatesToEvent implements Serializable {
	private static final long serialVersionUID = 1L;

	@EmbeddedId
	private MediumRelatesToEventPK id;

	//bi-directional many-to-one association to Event
	@ManyToOne
	@JsonBackReference(value = "Event-MediumRelatesToEvent")
	private Event event;

	//bi-directional many-to-one association to Medium
	@ManyToOne
	// @JsonBackReference(value = "Medium-MediumRelatesToEvent")
	private Medium medium;

	//bi-directional many-to-one association to MediumEventRelationshipType
	@ManyToOne
	@JoinColumn(name="medium_event_relationship_type_id")
	@JsonBackReference(value = "MediumEventRelationshipType-MediumRelatesToEvent")
	private MediumEventRelationshipType mediumEventRelationshipType;

	public MediumRelatesToEvent() {
	}

	public MediumRelatesToEventPK getId() {
		return this.id;
	}

	public void setId(MediumRelatesToEventPK id) {
		this.id = id;
	}

	public Event getEvent() {
		return this.event;
	}

	public void setEvent(Event event) {
		this.event = event;
	}

	public Medium getMedium() {
		return this.medium;
	}

	public void setMedium(Medium medium) {
		this.medium = medium;
	}

	public MediumEventRelationshipType getMediumEventRelationshipType() {
		return this.mediumEventRelationshipType;
	}

	public void setMediumEventRelationshipType(MediumEventRelationshipType mediumEventRelationshipType) {
		this.mediumEventRelationshipType = mediumEventRelationshipType;
	}

}