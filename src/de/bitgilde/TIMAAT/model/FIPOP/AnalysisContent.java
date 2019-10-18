package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.util.List;


/**
 * The persistent class for the analysis_content database table.
 * 
 */
@Entity
@Table(name="analysis_content")
@NamedQuery(name="AnalysisContent.findAll", query="SELECT a FROM AnalysisContent a")
public class AnalysisContent implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private int id;

	//bi-directional many-to-one association to GreimasActantialModel
	// @ManyToOne
	// @JoinColumn(name="greimas_actantial_model_id")
	// private GreimasActantialModel greimasActantialModel;

	//bi-directional many-to-one association to LotmanRennerSpatialSemantic
	// @ManyToOne
	// @JoinColumn(name="lotman_renner_spatial_semantics_id")
	// private LotmanRennerSpatialSemantic lotmanRennerSpatialSemantic;

	//bi-directional many-to-one association to MartinezScheffelUnreliableNarration
	// @ManyToOne
	// @JoinColumn(name="martinez_scheffel_unreliable_narration_id")
	// private MartinezScheffelUnreliableNarration martinezScheffelUnreliableNarration;

	//bi-directional many-to-one association to GenetteNarrativeDiscourse
	// @ManyToOne
	// @JoinColumn(name="genette_narrative_discourse_id")
	// private GenetteNarrativeDiscourse genetteNarrativeDiscourse;

	//bi-directional many-to-one association to StanzelNarrativeSituation
	// @ManyToOne
	// @JoinColumn(name="stanzel_narrative_situations_id")
	// private StanzelNarrativeSituation stanzelNarrativeSituation;

	//bi-directional many-to-one association to VanSijllCinematicStorytelling
	// @ManyToOne
	// @JoinColumn(name="van_sijll_cinematic_storytelling_id")
	// private VanSijllCinematicStorytelling vanSijllCinematicStorytelling;

	//bi-directional many-to-many association to ReligiousReference
	// @ManyToMany(mappedBy="analysisContents")
	// private List<ReligiousReference> religiousReferences;

	//bi-directional many-to-one association to Annotation
	@OneToMany(mappedBy="analysisContent")
	@JsonManagedReference(value = "analysisContent")
	private List<Annotation> annotations;

	public AnalysisContent() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	// public GreimasActantialModel getGreimasActantialModel() {
	// 	return this.greimasActantialModel;
	// }

	// public void setGreimasActantialModel(GreimasActantialModel greimasActantialModel) {
	// 	this.greimasActantialModel = greimasActantialModel;
	// }

	// public LotmanRennerSpatialSemantic getLotmanRennerSpatialSemantic() {
	// 	return this.lotmanRennerSpatialSemantic;
	// }

	// public void setLotmanRennerSpatialSemantic(LotmanRennerSpatialSemantic lotmanRennerSpatialSemantic) {
	// 	this.lotmanRennerSpatialSemantic = lotmanRennerSpatialSemantic;
	// }

	// public MartinezScheffelUnreliableNarration getMartinezScheffelUnreliableNarration() {
	// 	return this.martinezScheffelUnreliableNarration;
	// }

	// public void setMartinezScheffelUnreliableNarration(MartinezScheffelUnreliableNarration martinezScheffelUnreliableNarration) {
	// 	this.martinezScheffelUnreliableNarration = martinezScheffelUnreliableNarration;
	// }

	// public GenetteNarrativeDiscourse getGenetteNarrativeDiscourse() {
	// 	return this.genetteNarrativeDiscourse;
	// }

	// public void setGenetteNarrativeDiscourse(GenetteNarrativeDiscourse genetteNarrativeDiscourse) {
	// 	this.genetteNarrativeDiscourse = genetteNarrativeDiscourse;
	// }

	// public StanzelNarrativeSituation getStanzelNarrativeSituation() {
	// 	return this.stanzelNarrativeSituation;
	// }

	// public void setStanzelNarrativeSituation(StanzelNarrativeSituation stanzelNarrativeSituation) {
	// 	this.stanzelNarrativeSituation = stanzelNarrativeSituation;
	// }

	// public VanSijllCinematicStorytelling getVanSijllCinematicStorytelling() {
	// 	return this.vanSijllCinematicStorytelling;
	// }

	// public void setVanSijllCinematicStorytelling(VanSijllCinematicStorytelling vanSijllCinematicStorytelling) {
	// 	this.vanSijllCinematicStorytelling = vanSijllCinematicStorytelling;
	// }

	// public List<ReligiousReference> getReligiousReferences() {
	// 	return this.religiousReferences;
	// }

	// public void setReligiousReferences(List<ReligiousReference> religiousReferences) {
	// 	this.religiousReferences = religiousReferences;
	// }

	public List<Annotation> getAnnotations() {
		return this.annotations;
	}

	public void setAnnotations(List<Annotation> annotations) {
		this.annotations = annotations;
	}

	public Annotation addAnnotation(Annotation annotation) {
		getAnnotations().add(annotation);
		annotation.setAnalysisContent(this);

		return annotation;
	}

	public Annotation removeAnnotation(Annotation annotation) {
		getAnnotations().remove(annotation);
		annotation.setAnalysisContent(null);

		return annotation;
	}

}