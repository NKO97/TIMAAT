package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

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
 * The persistent class for the change_in_dynamics database table.
 *
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Entity
@Table(name="change_in_dynamics")
@NamedQuery(name="ChangeInDynamics.findAll", query="SELECT c FROM ChangeInDynamics c")
public class ChangeInDynamics implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	//bi-directional many-to-one association to AnalysisMusic
	@OneToMany(mappedBy="changeInDynamics")
	@JsonIgnore
	private List<AnalysisMusic> analysisMusicList;

	//bi-directional many-to-one association to ChangeInDynamicsTranslation
	@OneToMany(mappedBy="changeInDynamics")
	private List<ChangeInDynamicsTranslation> changeInDynamicsTranslations;

	public ChangeInDynamics() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public List<AnalysisMusic> getAnalysisMusicList() {
		return this.analysisMusicList;
	}

	public void setAnalysisMusicList(List<AnalysisMusic> analysisMusicList) {
		this.analysisMusicList = analysisMusicList;
	}

	public AnalysisMusic addAnalysisMusic(AnalysisMusic analysisMusic) {
		getAnalysisMusicList().add(analysisMusic);
		analysisMusic.setChangeInDynamics(this);

		return analysisMusic;
	}

	public AnalysisMusic removeAnalysisMusic(AnalysisMusic analysisMusic) {
		getAnalysisMusicList().remove(analysisMusic);
		analysisMusic.setChangeInDynamics(null);

		return analysisMusic;
	}

	public List<ChangeInDynamicsTranslation> getChangeInDynamicsTranslations() {
		return this.changeInDynamicsTranslations;
	}

	public void setChangeInDynamicsTranslations(List<ChangeInDynamicsTranslation> changeInDynamicsTranslations) {
		this.changeInDynamicsTranslations = changeInDynamicsTranslations;
	}

	public ChangeInDynamicsTranslation addChangeInDynamicsTranslation(ChangeInDynamicsTranslation changeInDynamicsTranslation) {
		getChangeInDynamicsTranslations().add(changeInDynamicsTranslation);
		changeInDynamicsTranslation.setChangeInDynamics(this);

		return changeInDynamicsTranslation;
	}

	public ChangeInDynamicsTranslation removeChangeInDynamicsTranslation(ChangeInDynamicsTranslation changeInDynamicsTranslation) {
		getChangeInDynamicsTranslations().remove(changeInDynamicsTranslation);
		changeInDynamicsTranslation.setChangeInDynamics(null);

		return changeInDynamicsTranslation;
	}

}