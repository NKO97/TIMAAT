package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import jakarta.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;


/**
 * The persistent class for the dynamic_marking_translation database table.
 * 
 */
@Entity
@Table(name="dynamic_marking_translation")
@NamedQuery(name="DynamicMarkingTranslation.findAll", query="SELECT d FROM DynamicMarkingTranslation d")
public class DynamicMarkingTranslation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	private String type;

	//bi-directional many-to-one association to DynamicMarking
	@ManyToOne
	@JoinColumn(name="dynamic_marking_id")
	@JsonIgnore
	private DynamicMarking dynamicMarking;

	//bi-directional many-to-one association to Language
	@ManyToOne
	private Language language;

	public DynamicMarkingTranslation() {
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

	public DynamicMarking getDynamicMarking() {
		return this.dynamicMarking;
	}

	public void setDynamicMarking(DynamicMarking dynamicMarking) {
		this.dynamicMarking = dynamicMarking;
	}

	public Language getLanguage() {
		return this.language;
	}

	public void setLanguage(Language language) {
		this.language = language;
	}

}