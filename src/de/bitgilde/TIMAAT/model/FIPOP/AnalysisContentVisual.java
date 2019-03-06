package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;
import java.util.List;


/**
 * The persistent class for the AnalysisContentVisual database table.
 * 
 */
@Entity
@NamedQuery(name="AnalysisContentVisual.findAll", query="SELECT a FROM AnalysisContentVisual a")
public class AnalysisContentVisual implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	private byte hasImage;

	private byte hasText;

	private byte hasVisualEffects;

	private String layer;

	//bi-directional many-to-one association to Annotation
	@OneToMany(mappedBy="analysisContentVisual")
	private List<Annotation> annotations;

	public AnalysisContentVisual() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public byte getHasImage() {
		return this.hasImage;
	}

	public void setHasImage(byte hasImage) {
		this.hasImage = hasImage;
	}

	public byte getHasText() {
		return this.hasText;
	}

	public void setHasText(byte hasText) {
		this.hasText = hasText;
	}

	public byte getHasVisualEffects() {
		return this.hasVisualEffects;
	}

	public void setHasVisualEffects(byte hasVisualEffects) {
		this.hasVisualEffects = hasVisualEffects;
	}

	public String getLayer() {
		return this.layer;
	}

	public void setLayer(String layer) {
		this.layer = layer;
	}

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