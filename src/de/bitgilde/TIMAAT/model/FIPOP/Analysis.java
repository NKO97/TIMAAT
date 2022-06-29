package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQuery;


/**
 * The persistent class for the analysis database table.
 *
 */
@Entity
@NamedQuery(name="Analysis.findAll", query="SELECT a FROM Analysis a")
public class Analysis implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	@Lob
	@Column(name="preproduction")
	private String preProduction;

	@Lob
	private String remark;

	//bi-directional many-to-one association to AnalysisMethod
	@ManyToOne
	@JoinColumn(name="analysis_method_id")
	private AnalysisMethod analysisMethod;

	//bi-directional many-to-one association to Annotation
	@ManyToOne
	@JsonBackReference(value= "Annotation-Analysis")
	private Annotation annotation;

	public Analysis() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getpreProduction() {
		return this.preProduction;
	}

	public void setpreProduction(String preProduction) {
		this.preProduction = preProduction;
	}

	public String getRemark() {
		return this.remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public AnalysisMethod getAnalysisMethod() {
		return this.analysisMethod;
	}

	public void setAnalysisMethod(AnalysisMethod analysisMethod) {
		this.analysisMethod = analysisMethod;
	}

	public Annotation getAnnotation() {
		return this.annotation;
	}

	public void setAnnotation(Annotation annotation) {
		this.annotation = annotation;
	}

}