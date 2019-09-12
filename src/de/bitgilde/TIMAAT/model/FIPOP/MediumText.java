package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;
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

	//bi-directional many-to-one association to AnalysisContentAudio
	@OneToMany(mappedBy="mediumText")
	private Set<AnalysisContentAudio> analysisContentAudios;

	//bi-directional one-to-one association to Medium
	@OneToOne
	@PrimaryKeyJoinColumn(name="medium_id")
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

	public int getId() { // TODO not necessary with getMediumId? (BUG: removing these unused functions prevents text list from being displayed=)
		return this.getMedium().getId();
	}

	public void setId(int id) { // TODO not necessary with setMediumId?
		this.getMedium().setId(id);
	}

	public String getContent() {
		return this.content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public Set<AnalysisContentAudio> getAnalysisContentAudios() {
		return this.analysisContentAudios;
	}

	public void setAnalysisContentAudios(Set<AnalysisContentAudio> analysisContentAudios) {
		this.analysisContentAudios = analysisContentAudios;
	}

	public AnalysisContentAudio addAnalysisContentAudio(AnalysisContentAudio analysisContentAudio) {
		getAnalysisContentAudios().add(analysisContentAudio);
		analysisContentAudio.setMediumText(this);

		return analysisContentAudio;
	}

	public AnalysisContentAudio removeAnalysisContentAudio(AnalysisContentAudio analysisContentAudio) {
		getAnalysisContentAudios().remove(analysisContentAudio);
		analysisContentAudio.setMediumText(null);

		return analysisContentAudio;
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