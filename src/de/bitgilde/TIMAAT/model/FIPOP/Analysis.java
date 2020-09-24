package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;


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
	private String preproduction;

	@Lob
	private String remark;

	//bi-directional many-to-one association to AnalysisMethod
	@ManyToOne
	@JoinColumn(name="analysis_method_id")
	private AnalysisMethod analysisMethod;

	//bi-directional many-to-one association to Annotation
	@ManyToOne
	private Annotation annotation;

	public Analysis() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getPreproduction() {
		return this.preproduction;
	}

	public void setPreproduction(String preproduction) {
		this.preproduction = preproduction;
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