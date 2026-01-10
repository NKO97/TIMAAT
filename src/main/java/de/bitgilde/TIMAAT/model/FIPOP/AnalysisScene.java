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
 * The persistent class for the analysis_scene database table.
 *
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Entity
@Table(name="analysis_scene")
@NamedQuery(name="AnalysisScene.findAll", query="SELECT a FROM AnalysisScene a")
public class AnalysisScene implements Serializable, SegmentStructureEntity {
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
		name="analysis_scene_has_category"
		, inverseJoinColumns={
			@JoinColumn(name="category_id")
			}
		, joinColumns={
			@JoinColumn(name="analysis_scene_id")
			}
		)
	private List<Category> categories;

	//bi-directional many-to-one association to AnalysisAction
	@OneToMany(mappedBy="analysisScene")
	@JsonManagedReference(value = "AnalysisScene-AnalysisAction")
	private List<AnalysisAction> analysisActions;

	//bi-directional many-to-one association to AnalysisSegment
	@ManyToOne
	@JoinColumn(name="analysis_segment_id")
	@JsonBackReference(value = "AnalysisSegment-AnalysisScene")
	private AnalysisSegment analysisSegment;

	//bi-directional many-to-one association to AnalysisSceneTranslation
	@OneToMany(mappedBy="analysisScene", cascade = CascadeType.ALL)
	private List<AnalysisSceneTranslation> analysisSceneTranslations;

	@Transient
	@JsonProperty("segmentId")
	private int segmentId;

	public AnalysisScene() {
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

  @JsonIgnore
  @Override
  public String getName() {
    return analysisSceneTranslations.get(0).getName();
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

  public List<AnalysisAction> getAnalysisActions() {
		return this.analysisActions;
	}

	public void setAnalysisActions(List<AnalysisAction> analysisActions) {
		this.analysisActions = analysisActions;
	}

	public AnalysisAction addAnalysisAction(AnalysisAction analysisAction) {
		getAnalysisActions().add(analysisAction);
		analysisAction.setAnalysisScene(this);

		return analysisAction;
	}

	public AnalysisAction removeAnalysisAction(AnalysisAction analysisAction) {
		getAnalysisActions().remove(analysisAction);
		analysisAction.setAnalysisScene(null);

		return analysisAction;
	}

	public AnalysisSegment getAnalysisSegment() {
		return this.analysisSegment;
	}

	public void setAnalysisSegment(AnalysisSegment analysisSegment) {
		this.analysisSegment = analysisSegment;
	}

	public List<AnalysisSceneTranslation> getAnalysisSceneTranslations() {
		return this.analysisSceneTranslations;
	}

	public void setAnalysisSceneTranslations(List<AnalysisSceneTranslation> analysisSceneTranslations) {
		this.analysisSceneTranslations = analysisSceneTranslations;
	}

	public AnalysisSceneTranslation addAnalysisSceneTranslation(AnalysisSceneTranslation analysisSceneTranslation) {
		getAnalysisSceneTranslations().add(analysisSceneTranslation);
		analysisSceneTranslation.setAnalysisScene(this);

		return analysisSceneTranslation;
	}

	public AnalysisSceneTranslation removeAnalysisSceneTranslation(AnalysisSceneTranslation analysisSceneTranslation) {
		getAnalysisSceneTranslations().remove(analysisSceneTranslation);
		analysisSceneTranslation.setAnalysisScene(null);

		return analysisSceneTranslation;
	}

}