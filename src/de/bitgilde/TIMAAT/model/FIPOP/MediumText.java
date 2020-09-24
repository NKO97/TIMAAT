package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.util.Set;


/**
 * The persistent class for the medium_text database table.
 * 
 */
@Entity
@Table(name="medium_text")
@NamedQuery(name="MediumText.findAll", query="SELECT m FROM MediumText m")
public class MediumText implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name="medium_id")
	private int mediumId;

	private String content;

	//bi-directional one-to-one association to Medium
	@OneToOne
	@PrimaryKeyJoinColumn(name="medium_id")
	@JsonIgnore // MediumText is accessed through Medium --> avoid reference cycle
	private Medium medium;

	//bi-directional many-to-one association to ReligiousReference
	// @OneToMany(mappedBy="mediumText")
	// private Set<ReligiousReference> religiousReferences;

	public MediumText() {
	}

	public int getMediumId() {
		return this.mediumId;
	}

	public void setMediumId(int mediumId) {
		this.mediumId = mediumId;
	}

	public String getContent() {
		return this.content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public Medium getMedium() {
		return this.medium;
	}

	public void setMedium(Medium medium) {
		this.medium = medium;
	}

	// public Set<ReligiousReference> getReligiousReferences() {
	// 	return this.religiousReferences;
	// }

	// public void setReligiousReferences(Set<ReligiousReference> religiousReferences) {
	// 	this.religiousReferences = religiousReferences;
	// }

	// public ReligiousReference addReligiousReference(ReligiousReference religiousReference) {
	// 	getReligiousReferences().add(religiousReference);
	// 	religiousReference.setMediumText(this);

	// 	return religiousReference;
	// }

	// public ReligiousReference removeReligiousReference(ReligiousReference religiousReference) {
	// 	getReligiousReferences().remove(religiousReference);
	// 	religiousReference.setMediumText(null);

	// 	return religiousReference;
	// }

}