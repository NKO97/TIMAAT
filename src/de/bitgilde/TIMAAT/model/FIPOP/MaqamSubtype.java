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
 * The persistent class for the maqam_subtype database table.
 *
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Entity
@Table(name="maqam_subtype")
@NamedQuery(name="MaqamSubtype.findAll", query="SELECT m FROM MaqamSubtype m")
public class MaqamSubtype implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	//bi-directional many-to-one association to Maqam
	@OneToMany(mappedBy="maqamSubtype")
	@JsonIgnore
	private List<Maqam> maqams;

	//bi-directional many-to-one association to MaqamSubtypeTranslation
	@OneToMany(mappedBy="maqamSubtype")
	private List<MaqamSubtypeTranslation> maqamSubtypeTranslations;

	public MaqamSubtype() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public List<Maqam> getMaqams() {
		return this.maqams;
	}

	public void setMaqams(List<Maqam> maqams) {
		this.maqams = maqams;
	}

	public Maqam addMaqam(Maqam maqam) {
		getMaqams().add(maqam);
		maqam.setMaqamSubtype(this);

		return maqam;
	}

	public Maqam removeMaqam(Maqam maqam) {
		getMaqams().remove(maqam);
		maqam.setMaqamSubtype(null);

		return maqam;
	}

	public List<MaqamSubtypeTranslation> getMaqamSubtypeTranslations() {
		return this.maqamSubtypeTranslations;
	}

	public void setMaqamSubtypeTranslations(List<MaqamSubtypeTranslation> maqamSubtypeTranslations) {
		this.maqamSubtypeTranslations = maqamSubtypeTranslations;
	}

	public MaqamSubtypeTranslation addMaqamSubtypeTranslation(MaqamSubtypeTranslation maqamSubtypeTranslation) {
		getMaqamSubtypeTranslations().add(maqamSubtypeTranslation);
		maqamSubtypeTranslation.setMaqamSubtype(this);

		return maqamSubtypeTranslation;
	}

	public MaqamSubtypeTranslation removeMaqamSubtypeTranslation(MaqamSubtypeTranslation maqamSubtypeTranslation) {
		getMaqamSubtypeTranslations().remove(maqamSubtypeTranslation);
		maqamSubtypeTranslation.setMaqamSubtype(null);

		return maqamSubtypeTranslation;
	}

}