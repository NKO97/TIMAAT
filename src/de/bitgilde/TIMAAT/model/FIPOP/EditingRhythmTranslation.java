package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;


/**
 * The persistent class for the editing_rhythm_translation database table.
 * 
 */
@Entity
@Table(name="editing_rhythm_translation")
@NamedQuery(name="EditingRhythmTranslation.findAll", query="SELECT ert FROM EditingRhythmTranslation ert")
public class EditingRhythmTranslation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	private String name;

	//bi-directional many-to-one association to EditingRhythm
	@ManyToOne
	@JoinColumn(name="editing_rhythm_analysis_method_id")
	@JsonIgnore
	private EditingRhythm editingRhythm;

	//bi-directional many-to-one association to Language
	@ManyToOne
	private Language language;

	public EditingRhythmTranslation() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public EditingRhythm getEditingRhythm() {
		return this.editingRhythm;
	}

	public void setEditingRhythm(EditingRhythm editingRhythm) {
		this.editingRhythm = editingRhythm;
	}

	public Language getLanguage() {
		return this.language;
	}

	public void setLanguage(Language language) {
		this.language = language;
	}

}