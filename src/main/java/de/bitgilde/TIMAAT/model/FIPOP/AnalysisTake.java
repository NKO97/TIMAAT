package de.bitgilde.TIMAAT.model.FIPOP;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;

import java.io.Serializable;
import java.util.List;

/*
 Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
 */

/**
 * The persistent class for the analysis_take database table.
 *
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Entity
@Table(name="analysis_take")
@NamedQuery(name="AnalysisTake.findAll", query="SELECT a FROM AnalysisTake a")
public class AnalysisTake implements Serializable, SegmentStructureEntity {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	@Column(name="end_time", columnDefinition = "INT")
	private long endTime;

	@Column(name="start_time", columnDefinition = "INT")
	private long startTime;

	//bi-directional many-to-many association to Category
	@ManyToMany
	@JoinTable(
		name="analysis_take_has_category"
		, inverseJoinColumns={
			@JoinColumn(name="category_id")
			}
		, joinColumns={
			@JoinColumn(name="analysis_take_id")
			}
		)
	private List<Category> categories;

	//bi-directional many-to-one association to AnalysisSequence
	@ManyToOne
	@JoinColumn(name="analysis_sequence_id")
	@JsonBackReference(value = "AnalysisSequence-AnalysisTake")
	private AnalysisSequence analysisSequence;

	//bi-directional many-to-one association to AnalysisTakeTranslation
	@OneToMany(mappedBy="analysisTake", cascade = CascadeType.ALL)
	private List<AnalysisTakeTranslation> analysisTakeTranslations;

	@Transient
	@JsonProperty("sequenceId")
	private int sequenceId;

	public AnalysisTake() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public int getSequenceId() {
		return this.sequenceId;
	}

	public void setSequenceId(int sequenceId) {
		this.sequenceId = sequenceId;
	}

	public long getEndTime() {
		return this.endTime;
	}

	public void setEndTime(long endTime) {
		this.endTime = endTime;
	}

	public long getStartTime() {
		return this.startTime;
	}

	public void setStartTime(long startTime) {
		this.startTime = startTime;
	}

	public List<Category> getCategories() {
		return this.categories;
	}

	public void setCategories(List<Category> categories) {
		this.categories = categories;
	}

  @Override
  @JsonIgnore
  public MediumAnalysisList getMediumAnalysisList() {
    return analysisSequence.getAnalysisSegment().getMediumAnalysisList();
  }

  public AnalysisSequence getAnalysisSequence() {
		return this.analysisSequence;
	}

	public void setAnalysisSequence(AnalysisSequence analysisSequence) {
		this.analysisSequence = analysisSequence;
	}

	public List<AnalysisTakeTranslation> getAnalysisTakeTranslations() {
		return this.analysisTakeTranslations;
	}

	public void setAnalysisTakeTranslations(List<AnalysisTakeTranslation> analysisTakeTranslations) {
		this.analysisTakeTranslations = analysisTakeTranslations;
	}

	public AnalysisTakeTranslation addAnalysisTakeTranslation(AnalysisTakeTranslation analysisTakeTranslation) {
		getAnalysisTakeTranslations().add(analysisTakeTranslation);
		analysisTakeTranslation.setAnalysisTake(this);

		return analysisTakeTranslation;
	}

	public AnalysisTakeTranslation removeAnalysisTakeTranslation(AnalysisTakeTranslation analysisTakeTranslation) {
		getAnalysisTakeTranslations().remove(analysisTakeTranslation);
		analysisTakeTranslation.setAnalysisTake(null);

		return analysisTakeTranslation;
	}

}