package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;
import java.util.List;


/**
 * The persistent class for the segment_selector_type database table.
 * 
 */
@Entity
@Table(name="segment_selector_type")
@NamedQuery(name="SegmentSelectorType.findAll", query="SELECT s FROM SegmentSelectorType s")
public class SegmentSelectorType implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	// TODO get type from translations
	//bi-directional many-to-one association to Annotation
	@OneToMany(mappedBy="segmentSelectorType")
	private List<Annotation> annotations;

	//bi-directional many-to-one association to SegmentSelectorTypeTranslation
	@OneToMany(mappedBy="segmentSelectorType")
	private List<SegmentSelectorTypeTranslation> segmentSelectorTypeTranslations;

	public SegmentSelectorType() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public List<Annotation> getAnnotations() {
		return this.annotations;
	}

	public void setAnnotations(List<Annotation> annotations) {
		this.annotations = annotations;
	}

	public Annotation addAnnotation(Annotation annotation) {
		getAnnotations().add(annotation);
		annotation.setSegmentSelectorType(this);

		return annotation;
	}

	public Annotation removeAnnotation(Annotation annotation) {
		getAnnotations().remove(annotation);
		annotation.setSegmentSelectorType(null);

		return annotation;
	}

	public List<SegmentSelectorTypeTranslation> getSegmentSelectorTypeTranslations() {
		return this.segmentSelectorTypeTranslations;
	}

	public void setSegmentSelectorTypeTranslations(List<SegmentSelectorTypeTranslation> segmentSelectorTypeTranslations) {
		this.segmentSelectorTypeTranslations = segmentSelectorTypeTranslations;
	}

	public SegmentSelectorTypeTranslation addSegmentSelectorTypeTranslation(SegmentSelectorTypeTranslation segmentSelectorTypeTranslation) {
		getSegmentSelectorTypeTranslations().add(segmentSelectorTypeTranslation);
		segmentSelectorTypeTranslation.setSegmentSelectorType(this);

		return segmentSelectorTypeTranslation;
	}

	public SegmentSelectorTypeTranslation removeSegmentSelectorTypeTranslation(SegmentSelectorTypeTranslation segmentSelectorTypeTranslation) {
		getSegmentSelectorTypeTranslations().remove(segmentSelectorTypeTranslation);
		segmentSelectorTypeTranslation.setSegmentSelectorType(null);

		return segmentSelectorTypeTranslation;
	}

}