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
 * The persistent class for the analysis_action database table.
 *
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Entity
@Table(name="analysis_action")
@NamedQuery(name="AnalysisAction.findAll", query="SELECT a FROM AnalysisAction a")
public class AnalysisAction implements Serializable, SegmentStructureEntity {
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
		name="analysis_action_has_category"
		, inverseJoinColumns={
			@JoinColumn(name="category_id")
			}
		, joinColumns={
			@JoinColumn(name="analysis_action_id")
			}
		)
	private List<Category> categories;

	//bi-directional many-to-one association to AnalysisScene
	@ManyToOne
	@JoinColumn(name="analysis_scene_id")
	@JsonBackReference(value = "AnalysisScene-AnalysisAction")
	private AnalysisScene analysisScene;

	//bi-directional many-to-one association to AnalysisActionTranslation
	@OneToMany(mappedBy="analysisAction", cascade = CascadeType.ALL)
	private List<AnalysisActionTranslation> analysisActionTranslations;

	@Transient
	@JsonProperty("sceneId")
	private int sceneId;

	public AnalysisAction() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public int getSceneId() {
		return this.sceneId;
	}

	public void setSceneId(int sceneId) {
		this.sceneId = sceneId;
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
    return analysisActionTranslations.get(0).getName();
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
    return getAnalysisScene().getAnalysisSegment().getMediumAnalysisList();
  }

  public AnalysisScene getAnalysisScene() {
		return this.analysisScene;
	}

	public void setAnalysisScene(AnalysisScene analysisScene) {
		this.analysisScene = analysisScene;
	}

	public List<AnalysisActionTranslation> getAnalysisActionTranslations() {
		return this.analysisActionTranslations;
	}

	public void setAnalysisActionTranslations(List<AnalysisActionTranslation> analysisActionTranslations) {
		this.analysisActionTranslations = analysisActionTranslations;
	}

	public AnalysisActionTranslation addAnalysisActionTranslation(AnalysisActionTranslation analysisActionTranslation) {
		getAnalysisActionTranslations().add(analysisActionTranslation);
		analysisActionTranslation.setAnalysisAction(this);

		return analysisActionTranslation;
	}

	public AnalysisActionTranslation removeAnalysisActionTranslation(AnalysisActionTranslation analysisActionTranslation) {
		getAnalysisActionTranslations().remove(analysisActionTranslation);
		analysisActionTranslation.setAnalysisAction(null);

		return analysisActionTranslation;
	}

}