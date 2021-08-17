package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import jakarta.persistence.*;

import com.fasterxml.jackson.annotation.JsonBackReference;


/**
 * The persistent class for the segment_selector_type_translation database table.
 * 
 */
@Entity
@Table(name="segment_selector_type_translation")
@NamedQuery(name="SegmentSelectorTypeTranslation.findAll", query="SELECT s FROM SegmentSelectorTypeTranslation s")
public class SegmentSelectorTypeTranslation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private int id;

	private String type;

	//bi-directional many-to-one association to Language
	@ManyToOne
	// @JsonBackReference(value = "Language-SegmentSelectorTypeTranslation")
	private Language language;

	//bi-directional many-to-one association to SegmentSelectorType
	@ManyToOne
	@JoinColumn(name="segment_selector_type_id")
	@JsonBackReference(value = "SegmentSelectorType-SegmentSelectorTypeTranslation")
	private SegmentSelectorType segmentSelectorType;

	public SegmentSelectorTypeTranslation() {
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

	public Language getLanguage() {
		return this.language;
	}

	public void setLanguage(Language language) {
		this.language = language;
	}

	public SegmentSelectorType getSegmentSelectorType() {
		return this.segmentSelectorType;
	}

	public void setSegmentSelectorType(SegmentSelectorType segmentSelectorType) {
		this.segmentSelectorType = segmentSelectorType;
	}

}