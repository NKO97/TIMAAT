package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import jakarta.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;


/**
 * The persistent class for the sound_effect_descriptive database table.
 * 
 */
@Entity
@Table(name="sound_effect_descriptive")
@NamedQuery(name="SoundEffectDescriptive.findAll", query="SELECT s FROM SoundEffectDescriptive s")
public class SoundEffectDescriptive implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name="analysis_method_id")
	private int analysisMethodId;

	@Lob
	@Column(name="answer_q1")
	private String answerQ1;

	@Lob
	@Column(name="answer_q2")
	private String answerQ2;

	@Lob
	@Column(name="answer_q3")
	private String answerQ3;

	@Lob
	@Column(name="answer_q4")
	private String answerQ4;

	@Lob
	@Column(name="answer_q5")
	private String answerQ5;

	@Lob
	@Column(name="answer_q6")
	private String answerQ6;

	//bi-directional one-to-one association to AnalysisMethod
	@OneToOne
	@PrimaryKeyJoinColumn(name="analysis_method_id")
	@JsonIgnore // SoundEffectDescriptive is accessed through AnalysisMethod --> avoid reference cycle
	private AnalysisMethod analysisMethod;

	public SoundEffectDescriptive() {
	}

	public int getAnalysisMethodId() {
		return this.analysisMethodId;
	}

	public void setAnalysisMethodId(int analysisMethodId) {
		this.analysisMethodId = analysisMethodId;
	}

	public String getAnswerQ1() {
		return this.answerQ1;
	}

	public void setAnswerQ1(String answerQ1) {
		this.answerQ1 = answerQ1;
	}

	public String getAnswerQ2() {
		return this.answerQ2;
	}

	public void setAnswerQ2(String answerQ2) {
		this.answerQ2 = answerQ2;
	}

	public String getAnswerQ3() {
		return this.answerQ3;
	}

	public void setAnswerQ3(String answerQ3) {
		this.answerQ3 = answerQ3;
	}

	public String getAnswerQ4() {
		return this.answerQ4;
	}

	public void setAnswerQ4(String answerQ4) {
		this.answerQ4 = answerQ4;
	}

	public String getAnswerQ5() {
		return this.answerQ5;
	}

	public void setAnswerQ5(String answerQ5) {
		this.answerQ5 = answerQ5;
	}

	public String getAnswerQ6() {
		return this.answerQ6;
	}

	public void setAnswerQ6(String answerQ6) {
		this.answerQ6 = answerQ6;
	}

	public AnalysisMethod getAnalysisMethod() {
		return this.analysisMethod;
	}

	public void setAnalysisMethod(AnalysisMethod analysisMethod) {
		this.analysisMethod = analysisMethod;
	}

}