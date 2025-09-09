package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrimaryKeyJoinColumn;
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
 * The persistent class for the medium_text database table.
 *
 * @author Jens-Martin Loebel <loebel@bitgilde.de>
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Entity
@Table(name="medium_text")
@NamedQuery(name="MediumText.findAll", query="SELECT m FROM MediumText m")
public class MediumText implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name="medium_id")
	private int mediumId;

	private String content;

	//bi-directional one-to-one association to Medium
	@OneToOne
	@PrimaryKeyJoinColumn(name="medium_id")
	@JsonIgnore // MediumText is accessed through Medium --> avoid reference cycle
	private Medium medium;

	//bi-directional many-to-one association to ReligiousReference
	// @OneToMany(mappedBy="mediumText")
	// private Set<ReligiousReference> religiousReferences;

	public MediumText() {
	}

	public int getMediumId() {
		return this.mediumId;
	}

	public void setMediumId(int mediumId) {
		this.mediumId = mediumId;
	}

	public String getContent() {
		return this.content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public Medium getMedium() {
		return this.medium;
	}

	public void setMedium(Medium medium) {
		this.medium = medium;
	}

	// public Set<ReligiousReference> getReligiousReferences() {
	// 	return this.religiousReferences;
	// }

	// public void setReligiousReferences(Set<ReligiousReference> religiousReferences) {
	// 	this.religiousReferences = religiousReferences;
	// }

	// public ReligiousReference addReligiousReference(ReligiousReference religiousReference) {
	// 	getReligiousReferences().add(religiousReference);
	// 	religiousReference.setMediumText(this);

	// 	return religiousReference;
	// }

	// public ReligiousReference removeReligiousReference(ReligiousReference religiousReference) {
	// 	getReligiousReferences().remove(religiousReference);
	// 	religiousReference.setMediumText(null);

	// 	return religiousReference;
	// }

}