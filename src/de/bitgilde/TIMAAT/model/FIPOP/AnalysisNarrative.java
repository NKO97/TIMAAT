package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;
import java.util.List;


/**
 * The persistent class for the AnalysisNarrative database table.
 * 
 */
@Entity
@NamedQuery(name="AnalysisNarrative.findAll", query="SELECT a FROM AnalysisNarrative a")
public class AnalysisNarrative implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	//bi-directional many-to-one association to Annotation
	@OneToMany(mappedBy="analysisNarrative")
	private List<Annotation> annotations;


	public AnalysisNarrative() {
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
		annotation.setAnalysisNarrative(this);

		return annotation;
	}

	public Annotation removeAnnotation(Annotation annotation) {
		getAnnotations().remove(annotation);
		annotation.setAnalysisNarrative(null);

		return annotation;
	}

}