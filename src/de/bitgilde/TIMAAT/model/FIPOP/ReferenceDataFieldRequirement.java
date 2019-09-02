package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the reference_data_field_requirements database table.
 * 
 */
@Entity
@Table(name="reference_data_field_requirements")
@NamedQuery(name="ReferenceDataFieldRequirement.findAll", query="SELECT r FROM ReferenceDataFieldRequirement r")
public class ReferenceDataFieldRequirement implements Serializable {
	private static final long serialVersionUID = 1L;

	@EmbeddedId
	private ReferenceDataFieldRequirementPK id;

	@Column(name="is_not_standard_style")
	private byte isNotStandardStyle;

	@Column(name="is_optional")
	private byte isOptional;

	@Column(name="is_required")
	private byte isRequired;

	//bi-directional many-to-one association to Reference
	@ManyToOne
	private Reference reference;

	//bi-directional many-to-one association to ReferenceEntryType
	@ManyToOne
	@JoinColumn(name="reference_entry_type_id")
	private ReferenceEntryType referenceEntryType;

	public ReferenceDataFieldRequirement() {
	}

	public ReferenceDataFieldRequirementPK getId() {
		return this.id;
	}

	public void setId(ReferenceDataFieldRequirementPK id) {
		this.id = id;
	}

	public byte getIsNotStandardStyle() {
		return this.isNotStandardStyle;
	}

	public void setIsNotStandardStyle(byte isNotStandardStyle) {
		this.isNotStandardStyle = isNotStandardStyle;
	}

	public byte getIsOptional() {
		return this.isOptional;
	}

	public void setIsOptional(byte isOptional) {
		this.isOptional = isOptional;
	}

	public byte getIsRequired() {
		return this.isRequired;
	}

	public void setIsRequired(byte isRequired) {
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