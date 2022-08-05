package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.Table;


/**
 * The persistent class for the analysis_method_type_translation database table.
 *
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Entity
@Table(name="analysis_method_type_translation")
@NamedQuery(name="AnalysisMethodTypeTranslation.findAll", query="SELECT a FROM AnalysisMethodTypeTranslation a")
public class AnalysisMethodTypeTranslation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	private String name;

	//bi-directional many-to-one association to AnalysisMethodType
	@ManyToOne
	@JoinColumn(name="analysis_method_type_id")
	@JsonIgnore
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