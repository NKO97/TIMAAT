package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;


/**
 * The persistent class for the editing_rhythm database table.
 *
 */
@Entity
@Table(name="editing_rhythm")
@NamedQuery(name="EditingRhythm.findAll", query="SELECT er FROM EditingRhythm er")
public class EditingRhythm implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name="analysis_method_id")
	private int analysisMethodId;

	//bi-directional one-to-one association to AnalysisMethod
	@OneToOne
	@PrimaryKeyJoinColumn(name="analysis_method_id")
	@JsonIgnore // EditingRhythm is accessed through AnalysisMethod --> avoid reference cycle
	private AnalysisMethod analysisMethod;

	//bi-directional many-to-one association to EditingRhythmTranslation
	@OneToMany(mappedBy="editingRhythm")
	private List<EditingRhythmTranslation> editingRhythmTranslations;

	public EditingRhythm() {
	}

	public int getAnalysisMethodId() {
		return this.analysisMethodId;
	}

	public void setAnalysisMethodId(int analysisMethodId) {
		this.analysisMethodId = analysisMethodId;
	}

	public AnalysisMethod getAnalysisMethod() {
		return this.analysisMethod;
	}

	public void setAnalysisMethod(AnalysisMethod analysisMethod) {
		this.analysisMethod = analysisMethod;
	}

	public List<EditingRhythmTranslation> getEditingRhythmTranslations() {
		return this.editingRhythmTranslations;
	}

	public void setEditingRhythmTranslations(List<EditingRhythmTranslation> editingRhythmTranslations) {
		this.editingRhythmTranslations = editingRhythmTranslations;
	}

	public EditingRhythmTranslation addEditingRhythmTranslation(EditingRhythmTranslation editingRhythmTranslation) {
		getEditingRhythmTranslations().add(editingRhythmTranslation);
		editingRhythmTranslation.setEditingRhythm(this);

		return editingRhythmTranslation;
	}

	public EditingRhythmTranslation removeEditingRhythmTranslation(EditingRhythmTranslation editingRhythmTranslation) {
		getEditingRhythmTranslations().remove(editingRhythmTranslation);
		editingRhythmTranslation.setEditingRhythm(null);

		return editingRhythmTranslation;
	}

}