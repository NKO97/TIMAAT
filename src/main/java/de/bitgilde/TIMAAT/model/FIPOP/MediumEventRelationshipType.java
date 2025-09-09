package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToMany;
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
 * The persistent class for the medium_event_relationship_type database table.
 *
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Entity
@Table(name="medium_event_relationship_type")
@NamedQuery(name="MediumEventRelationshipType.findAll", query="SELECT m FROM MediumEventRelationshipType m")
public class MediumEventRelationshipType implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private int id;

	//bi-directional many-to-one association to MediumEventRelationshipTypeTranslation
	@OneToMany(mappedBy="mediumEventRelationshipType")
	private List<MediumEventRelationshipTypeTranslation> mediumEventRelationshipTypeTranslations;

	//bi-directional many-to-one association to MediumRelatesToEvent
	@OneToMany(mappedBy="mediumEventRelationshipType")
	@JsonManagedReference(value = "MediumEventRelationshipType-MediumRelatesToEvent")
	private List<MediumRelatesToEvent> mediumRelatesToEvents;

	public MediumEventRelationshipType() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public List<MediumEventRelationshipTypeTranslation> getMediumEventRelationshipTypeTranslations() {
		return this.mediumEventRelationshipTypeTranslations;
	}

	public void setMediumEventRelationshipTypeTranslations(List<MediumEventRelationshipTypeTranslation> mediumEventRelationshipTypeTranslations) {
		this.mediumEventRelationshipTypeTranslations = mediumEventRelationshipTypeTranslations;
	}

	public MediumEventRelationshipTypeTranslation addMediumEventRelationshipTypeTranslation(MediumEventRelationshipTypeTranslation mediumEventRelationshipTypeTranslation) {
		getMediumEventRelationshipTypeTranslations().add(mediumEventRelationshipTypeTranslation);
		mediumEventRelationshipTypeTranslation.setMediumEventRelationshipType(this);

		return mediumEventRelationshipTypeTranslation;
	}

	public MediumEventRelationshipTypeTranslation removeMediumEventRelationshipTypeTranslation(MediumEventRelationshipTypeTranslation mediumEventRelationshipTypeTranslation) {
		getMediumEventRelationshipTypeTranslations().remove(mediumEventRelationshipTypeTranslation);
		mediumEventRelationshipTypeTranslation.setMediumEventRelationshipType(null);

		return mediumEventRelationshipTypeTranslation;
	}

	public List<MediumRelatesToEvent> getMediumRelatesToEvents() {
		return this.mediumRelatesToEvents;
	}

	public void setMediumRelatesToEvents(List<MediumRelatesToEvent> mediumRelatesToEvents) {
		this.mediumRelatesToEvents = mediumRelatesToEvents;
	}

	public MediumRelatesToEvent addMediumRelatesToEvent(MediumRelatesToEvent mediumRelatesToEvent) {
		getMediumRelatesToEvents().add(mediumRelatesToEvent);
		mediumRelatesToEvent.setMediumEventRelationshipType(this);

		return mediumRelatesToEvent;
	}

	public MediumRelatesToEvent removeMediumRelatesToEvent(MediumRelatesToEvent mediumRelatesToEvent) {
		getMediumRelatesToEvents().remove(mediumRelatesToEvent);
		mediumRelatesToEvent.setMediumEventRelationshipType(null);

		return mediumRelatesToEvent;
	}

}