package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonBackReference;

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
 * The persistent class for the reference_data_field_requirements database table.
 *
 * @author Jens-Martin Loebel <loebel@bitgilde.de>
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Entity
@Table(name="reference_data_field_requirements")
@NamedQuery(name="ReferenceDataFieldRequirement.findAll", query="SELECT r FROM ReferenceDataFieldRequirement r")
public class ReferenceDataFieldRequirement implements Serializable {
	private static final long serialVersionUID = 1L;

	@EmbeddedId
	private ReferenceDataFieldRequirementPK id;

	@Column(name="is_not_standard_style")
	private int isNotStandardStyle;

	@Column(name="is_optional")
	private int isOptional;

	@Column(name="is_required")
	private int isRequired;

	//bi-directional many-to-one association to Reference
	@ManyToOne
	@JsonBackReference(value = "Reference-ReferenceDataFieldRequirement")
	private Reference reference;

	//bi-directional many-to-one association to ReferenceEntryType
	@ManyToOne
	@JoinColumn(name="reference_entry_type_id")
	@JsonBackReference(value = "ReferenceEntryType-ReferenceDataFieldRequirement")
	private ReferenceEntryType referenceEntryType;

	public ReferenceDataFieldRequirement() {
	}

	public ReferenceDataFieldRequirementPK getId() {
		return this.id;
	}

	public void setId(ReferenceDataFieldRequirementPK id) {
		this.id = id;
	}

	public int getIsNotStandardStyle() {
		return this.isNotStandardStyle;
	}

	public void setIsNotStandardStyle(int isNotStandardStyle) {
		this.isNotStandardStyle = isNotStandardStyle;
	}

	public int getIsOptional() {
		return this.isOptional;
	}

	public void setIsOptional(int isOptional) {
		this.isOptional = isOptional;
	}

	public int getIsRequired() {
		return this.isRequired;
	}

	public void setIsRequired(int isRequired) {
		this.isRequired = isRequired;
	}

	public Reference getReference() {
		return this.reference;
	}

	public void setReference(Reference reference) {
		this.reference = reference;
	}

	public ReferenceEntryType getReferenceEntryType() {
		return this.referenceEntryType;
	}

	public void setReferenceEntryType(ReferenceEntryType referenceEntryType) {
		this.referenceEntryType = referenceEntryType;
	}

}