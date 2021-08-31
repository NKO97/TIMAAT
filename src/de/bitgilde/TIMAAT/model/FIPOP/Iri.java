package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import jakarta.persistence.*;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.util.List;


/**
 * The persistent class for the iri database table.
 * 
 */
@Entity
@NamedQuery(name="Iri.findAll", query="SELECT i FROM Iri i")
public class Iri implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	private String iri;

	//bi-directional many-to-one association to Annotation
	@OneToMany(mappedBy="iri")
	@JsonManagedReference(value = "Iri-Annotation")
	private List<Annotation> annotations;

	public Iri() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getIri() {
		return this.iri;
	}

	public void setIri(String iri) {
		this.iri = iri;
	}

	public List<Annotation> getAnnotations() {
		return this.annotations;
	}

	public void setAnnotations(List<Annotation> annotations) {
		this.annotations = annotations;
	}

	public Annotation addAnnotation(Annotation annotation) {
		getAnnotations().add(annotation);
		// annotation.setIri(this);

		return annotation;
	}

	public Annotation removeAnnotation(Annotation annotation) {
		getAnnotations().remove(annotation);
		// annotation.setIri(null);

		return annotation;
	}

}