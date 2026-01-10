package de.bitgilde.TIMAAT.model.FIPOP;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
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
 * The persistent class for the analysis_sequence database table.
 *
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Entity
@Table(name="analysis_sequence")
@NamedQuery(name="AnalysisSequence.findAll", query="SELECT a FROM AnalysisSequence a")
public class AnalysisSequence implements Serializable, SegmentStructureEntity {
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
		name="analysis_sequence_has_category"
		, inverseJoinColumns={
			@JoinColumn(name="category_id")
			}
		, joinColumns={
			@JoinColumn(name="analysis_sequence_id")
			}
		)
	private List<Category> categories;

	//bi-directional many-to-one association to AnalysisSegment
	@ManyToOne
	@JoinColumn(name="analysis_segment_id")
	@JsonBackReference(value = "AnalysisSegment-AnalysisSequence")
	private AnalysisSegment analysisSegment;

	//bi-directional many-to-one association to AnalysisSequenceTranslation
	@OneToMany(mappedBy="analysisSequence", cascade = CascadeType.ALL)
	private List<AnalysisSequenceTranslation> analysisSequenceTranslations;

	//bi-directional many-to-one association to AnalysisTake
	@OneToMany(mappedBy="analysisSequence")
	@JsonManagedReference(value = "AnalysisSequence-AnalysisTake")
	private List<AnalysisTake> analysisTakes;

	@Transient
	@JsonProperty("segmentId")
	private int segmentId;

	public AnalysisSequence() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public int getSegmentId() {
		return this.segmentId;
	}

	public void setSegmentId(int segmentId) {
		this.segmentId = segmentId;
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
  @Override
	public List<Category> getCategories() {
		return this.categories;
	}
  @Override
	public void setCategories(List<Category> categories) {
		this.categories = categories;
	}

  @JsonIgnore
  @Override
  public MediumAnalysisList getMediumAnalysisList() {
    return analysisSegment.getMediumAnalysisList();
  }

  public AnalysisSegment getAnalysisSegment() {
		return this.analysisSegment;
	}

	public void setAnalysisSegment(AnalysisSegment analysisSegment) {
		this.analysisSegment = analysisSegment;
	}

	public List<AnalysisSequenceTranslation> getAnalysisSequenceTranslations() {
		return this.analysisSequenceTranslations;
	}

	public void setAnalysisSequenceTranslations(List<AnalysisSequenceTranslation> analysisSequenceTranslations) {
		this.analysisSequenceTranslations = analysisSequenceTranslations;
	}

	public AnalysisSequenceTranslation addAnalysisSequenceTranslation(AnalysisSequenceTranslation analysisSequenceTranslation) {
		getAnalysisSequenceTranslations().add(analysisSequenceTranslation);
		analysisSequenceTranslation.setAnalysisSequence(this);

		return analysisSequenceTranslation;
	}

	public AnalysisSequenceTranslation removeAnalysisSequenceTranslation(AnalysisSequenceTranslation analysisSequenceTranslation) {
		getAnalysisSequenceTranslations().remove(analysisSequenceTranslation);
		analysisSequenceTranslation.setAnalysisSequence(null);

		return analysisSequenceTranslation;
	}

	public List<AnalysisTake> getAnalysisTakes() {
		return this.analysisTakes;
	}

	public void setAnalysisTakes(List<AnalysisTake> analysisTakes) {
		this.analysisTakes = analysisTakes;
	}

	public AnalysisTake addAnalysisTake(AnalysisTake analysisTake) {
		getAnalysisTakes().add(analysisTake);
		analysisTake.setAnalysisSequence(this);

		return analysisTake;
	}

	public AnalysisTake removeAnalysisTake(AnalysisTake analysisTake) {
		getAnalysisTakes().remove(analysisTake);
		analysisTake.setAnalysisSequence(null);

		return analysisTake;
	}

}