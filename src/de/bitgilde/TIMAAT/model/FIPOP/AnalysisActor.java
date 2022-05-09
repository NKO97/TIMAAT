package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;


/**
 * The persistent class for the analysis_actor database table.
 *
 */
@Entity
@Table(name="analysis_actor")
@NamedQuery(name="AnalysisActor.findAll", query="SELECT a FROM AnalysisActor a")
public class AnalysisActor implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name="analysis_method_id")
	private int analysisMethodId;

	//bi-directional many-to-one association to ActingTechnique
	@OneToOne
	@JoinColumn(name="acting_technique_analysis_method_id")
	private ActingTechnique actingTechnique;

	//bi-directional one-to-one association to AnalysisMethod
	@OneToOne
	@PrimaryKeyJoinColumn(name="analysis_method_id")
	@JsonIgnore // AnalysisActor is accessed through AnalysisMethod --> avoid reference cycle
	private AnalysisMethod analysisMethod;

	//bi-directional many-to-one association to FacialExpression
	@OneToOne
	@JoinColumn(name="facial_expression_analysis_method_id")
	private FacialExpression facialExpression;

	//bi-directional many-to-one association to FacialExpressionIntensity
	@OneToOne
	@JoinColumn(name="facial_expression_intensity_analysis_method_id")
	private FacialExpressionIntensity facialExpressionIntensity;

	//bi-directional many-to-one association to GesturalEmotion
	@OneToOne
	@JoinColumn(name="gestural_emotion_analysis_method_id")
	private GesturalEmotion gesturalEmotion;

	//bi-directional many-to-one association to GesturalEmotionIntensity
	@OneToOne
	@JoinColumn(name="gestural_emotion_intensity_analysis_method_id")
	private GesturalEmotionIntensity gesturalEmotionIntensity;

	//bi-directional many-to-one association to PhysicalExpression
	@OneToOne
	@JoinColumn(name="physical_expression_analysis_method_id")
	private PhysicalExpression physicalExpression;

	//bi-directional many-to-one association to PhysicalExpressionIntensity
	@OneToOne
	@JoinColumn(name="physical_expression_intensity_analysis_method_id")
	private PhysicalExpressionIntensity physicalExpressionIntensity;

	public AnalysisActor() {
	}

	public int getAnalysisMethodId() {
		return this.analysisMethodId;
	}

	public void setAnalysisMethodId(int analysisMethodId) {
		this.analysisMethodId = analysisMethodId;
	}

	public ActingTechnique getActingTechnique() {
		return this.actingTechnique;
	}

	public void setActingTechnique(ActingTechnique actingTechnique) {
		this.actingTechnique = actingTechnique;
	}

	public AnalysisMethod getAnalysisMethod() {
		return this.analysisMethod;
	}

	public void setAnalysisMethod(AnalysisMethod analysisMethod) {
		this.analysisMethod = analysisMethod;
	}

	public FacialExpression getFacialExpression() {
		return this.facialExpression;
	}

	public void setFacialExpression(FacialExpression facialExpression) {
		this.facialExpression = facialExpression;
	}

	public FacialExpressionIntensity getFacialExpressionIntensity() {
		return this.facialExpressionIntensity;
	}

	public void setFacialExpressionIntensity(FacialExpressionIntensity facialExpressionIntensity) {
		this.facialExpressionIntensity = facialExpressionIntensity;
	}

	public GesturalEmotion getGesturalEmotion() {
		return this.gesturalEmotion;
	}

	public void setGesturalEmotion(GesturalEmotion gesturalEmotion) {
		this.gesturalEmotion = gesturalEmotion;
	}

	public GesturalEmotionIntensity getGesturalEmotionIntensity() {
		return this.gesturalEmotionIntensity;
	}

	public void setGesturalEmotionIntensity(GesturalEmotionIntensity gesturalEmotionIntensity) {
		this.gesturalEmotionIntensity = gesturalEmotionIntensity;
	}

	public PhysicalExpression getPhysicalExpression() {
		return this.physicalExpression;
	}

	public void setPhysicalExpression(PhysicalExpression physicalExpression) {
		this.physicalExpression = physicalExpression;
	}

	public PhysicalExpressionIntensity getPhysicalExpressionIntensity() {
		return this.physicalExpressionIntensity;
	}

	public void setPhysicalExpressionIntensity(PhysicalExpressionIntensity physicalExpressionIntensity) {
		this.physicalExpressionIntensity = physicalExpressionIntensity;
	}

}