package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.util.List;


/**
 * The persistent class for the analysis_content_visual database table.
 * 
 */
@Entity
@Table(name="analysis_content_visual")
@NamedQuery(name="AnalysisContentVisual.findAll", query="SELECT a FROM AnalysisContentVisual a")
public class AnalysisContentVisual implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	@Column(name="has_image")
	private int hasImage;

	@Column(name="has_text")
	private int hasText;

	@Column(name="has_visual_effects")
	private int hasVisualEffects;

	private String layer;

	//bi-directional many-to-one association to AnalysisImage
	// @OneToMany(mappedBy="analysisContentVisual")
	// private List<AnalysisImage> analysisImages;

	//bi-directional many-to-one association to AnalysisText
	// @OneToMany(mappedBy="analysisContentVisual")
	// private List<AnalysisText> analysisTexts;

	//bi-directional many-to-one association to AnalysisVisualEffect
	// @OneToMany(mappedBy="analysisContentVisual")
	// private List<AnalysisVisualEffect> analysisVisualEffects;

	//bi-directional many-to-one association to Annotation
	@OneToMany(mappedBy="analysisContentVisual")
	@JsonManagedReference(value = "AnalysisContentVisual-Annotation")
	private List<Annotation> annotations;

	public AnalysisContentVisual() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public int getHasImage() {
		return this.hasImage;
	}

	public void setHasImage(int hasImage) {
		this.hasImage = hasImage;
	}

	public int getHasText() {
		return this.hasText;
	}

	public void setHasText(int hasText) {
		this.hasText = hasText;
	}

	public int getHasVisualEffects() {
		return this.hasVisualEffects;
	}

	public void setHasVisualEffects(int hasVisualEffects) {
		this.hasVisualEffects = hasVisualEffects;
	}

	public String getLayer() {
		return this.layer;
	}

	public void setLayer(String layer) {
		this.layer = layer;
	}

	// public List<AnalysisImage> getAnalysisImages() {
	// 	return this.analysisImages;
	// }

	// public void setAnalysisImages(List<AnalysisImage> analysisImages) {
	// 	this.analysisImages = analysisImages;
	// }

	// public AnalysisImage addAnalysisImage(AnalysisImage analysisImage) {
	// 	getAnalysisImages().add(analysisImage);
	// 	analysisImage.setAnalysisContentVisual(this);

	// 	return analysisImage;
	// }

	// public AnalysisImage removeAnalysisImage(AnalysisImage analysisImage) {
	// 	getAnalysisImages().remove(analysisImage);
	// 	analysisImage.setAnalysisContentVisual(null);

	// 	return analysisImage;
	// }

	// public List<AnalysisText> getAnalysisTexts() {
	// 	return this.analysisTexts;
	// }

	// public void setAnalysisTexts(List<AnalysisText> analysisTexts) {
	// 	this.analysisTexts = analysisTexts;
	// }

	// public AnalysisText addAnalysisText(AnalysisText analysisText) {
	// 	getAnalysisTexts().add(analysisText);
	// 	analysisText.setAnalysisContentVisual(this);

	// 	return analysisText;
	// }

	// public AnalysisText removeAnalysisText(AnalysisText analysisText) {
	// 	getAnalysisTexts().remove(analysisText);
	// 	analysisText.setAnalysisContentVisual(null);

	// 	return analysisText;
	// }

	// public List<AnalysisVisualEffect> getAnalysisVisualEffects() {
	// 	return this.analysisVisualEffects;
	// }

	// public void setAnalysisVisualEffects(List<AnalysisVisualEffect> analysisVisualEffects) {
	// 	this.analysisVisualEffects = analysisVisualEffects;
	// }

	// public AnalysisVisualEffect addAnalysisVisualEffect(AnalysisVisualEffect analysisVisualEffect) {
	// 	getAnalysisVisualEffects().add(analysisVisualEffect);
	// 	analysisVisualEffect.setAnalysisContentVisual(this);

	// 	return analysisVisualEffect;
	// }

	// public AnalysisVisualEffect removeAnalysisVisualEffect(AnalysisVisualEffect analysisVisualEffect) {
	// 	getAnalysisVisualEffects().remove(analysisVisualEffect);
	// 	analysisVisualEffect.setAnalysisContentVisual(null);

	// 	return analysisVisualEffect;
	// }

	public List<Annotation> getAnnotations() {
		return this.annotations;
	}

	public void setAnnotations(List<Annotation> annotations) {
		this.annotations = annotations;
	}

	public Annotation addAnnotation(Annotation annotation) {
		getAnnotations().add(annotation);
		annotation.setAnalysisContentVisual(this);

		return annotation;
	}

	public Annotation removeAnnotation(Annotation annotation) {
		getAnnotations().remove(annotation);
		annotation.setAnalysisContentVisual(null);

		return annotation;
	}

}