package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;


/**
 * The persistent class for the concept_direction_translation database table.
 * 
 */
@Entity
@Table(name="concept_direction_translation")
@NamedQuery(name="ConceptDirectionTranslation.findAll", query="SELECT c FROM ConceptDirectionTranslation c")
public class ConceptDirectionTranslation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	private String type;

	//bi-directional many-to-one association to ConceptDirection
	@ManyToOne
	@JoinColumn(name="concept_direction_analysis_method_id")
	@JsonIgnore
	private ConceptDirection conceptDirection;

	//bi-directional many-to-one association to Language
	@ManyToOne
	private Language language;

	public ConceptDirectionTranslation() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getType() {
		return this.type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public ConceptDirection getConceptDirection() {
		return this.conceptDirection;
	}

	public void setConceptDirection(ConceptDirection conceptDirection) {
		this.conceptDirection = conceptDirection;
	}

	public Language getLanguage() {
		return this.language;
	}

	public void setLanguage(Language language) {
		this.language = language;
	}

}