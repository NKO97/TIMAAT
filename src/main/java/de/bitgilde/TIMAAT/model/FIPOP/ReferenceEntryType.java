package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
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
 * The persistent class for the reference_entry_type database table.
 *
 * @author Jens-Martin Loebel <loebel@bitgilde.de>
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Entity
@Table(name="reference_entry_type")
@NamedQuery(name="ReferenceEntryType.findAll", query="SELECT r FROM ReferenceEntryType r")
public class ReferenceEntryType implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	private String type;

	//bi-directional many-to-one association to Reference
	@OneToMany(mappedBy="referenceEntryType")
	@JsonManagedReference(value = "ReferenceEntryType-Reference")
	private List<Reference> references;

	//bi-directional many-to-one association to ReferenceDataFieldRequirement
	@OneToMany(mappedBy="referenceEntryType")
	@JsonManagedReference(value = "ReferenceEntryType-ReferenceDataFieldRequirement")
	private List<ReferenceDataFieldRequirement> referenceDataFieldRequirements;

	public ReferenceEntryType() {
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

	public List<Reference> getReferences() {
		return this.references;
	}

	public void setReferences(List<Reference> references) {
		this.references = references;
	}

	public Reference addReference(Reference reference) {
		getReferences().add(reference);
		reference.setReferenceEntryType(this);

		return reference;
	}

	public Reference removeReference(Reference reference) {
		getReferences().remove(reference);
		reference.setReferenceEntryType(null);

		return reference;
	}

	public List<ReferenceDataFieldRequirement> getReferenceDataFieldRequirements() {
		return this.referenceDataFieldRequirements;
	}

	public void setReferenceDataFieldRequirements(List<ReferenceDataFieldRequirement> referenceDataFieldRequirements) {
		this.referenceDataFieldRequirements = referenceDataFieldRequirements;
	}

	public ReferenceDataFieldRequirement addReferenceDataFieldRequirement(ReferenceDataFieldRequirement referenceDataFieldRequirement) {
		getReferenceDataFieldRequirements().add(referenceDataFieldRequirement);
		referenceDataFieldRequirement.setReferenceEntryType(this);

		return referenceDataFieldRequirement;
	}

	public ReferenceDataFieldRequirement removeReferenceDataFieldRequirement(ReferenceDataFieldRequirement referenceDataFieldRequirement) {
		getReferenceDataFieldRequirements().remove(referenceDataFieldRequirement);
		referenceDataFieldRequirement.setReferenceEntryType(null);

		return referenceDataFieldRequirement;
	}

}