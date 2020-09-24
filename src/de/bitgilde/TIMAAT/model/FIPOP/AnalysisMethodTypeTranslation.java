package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the analysis_method_type_translation database table.
 * 
 */
@Entity
@Table(name="analysis_method_type_translation")
@NamedQuery(name="AnalysisMethodTypeTranslation.findAll", query="SELECT a FROM AnalysisMethodTypeTranslation a")
public class AnalysisMethodTypeTranslation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private int id;

	private String name;

	//bi-directional many-to-one association to AnalysisMethodType
	@ManyToOne
	@JoinColumn(name="analysis_method_type_id")
	private AnalysisMethodType analysisMethodType;

	//bi-directional many-to-one association to Language
	@ManyToOne
	private Language language;

	public AnalysisMethodTypeTranslation() {
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

	public AnalysisMethodType getAnalysisMethodType() {
		return this.analysisMethodType;
	}

	public void setAnalysisMethodType(AnalysisMethodType analysisMethodType) {
		this.analysisMethodType = analysisMethodType;
	}

	public Language getLanguage() {
		return this.language;
	}

	public void setLanguage(Language language) {
		this.language = language;
	}

}