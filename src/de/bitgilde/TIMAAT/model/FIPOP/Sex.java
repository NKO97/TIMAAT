package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToMany;

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
 * The persistent class for the sex database table.
 *
 * @author Jens-Martin Loebel <loebel@bitgilde.de>
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Entity
@NamedQuery(name="Sex.findAll", query="SELECT s FROM Sex s")
public class Sex implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private int id;

	//bi-directional many-to-one association to ActorPerson
	@OneToMany(mappedBy="sex")
	@JsonIgnore
	private List<ActorPerson> actorPersons;

	//bi-directional many-to-one association to SexTranslation
	@OneToMany(mappedBy="sex")
	private List<SexTranslation> sexTranslations;

	public Sex() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public List<ActorPerson> getActorPersons() {
		return this.actorPersons;
	}

	public void setActorPersons(List<ActorPerson> actorPersons) {
		this.actorPersons = actorPersons;
	}

	public ActorPerson addActorPerson(ActorPerson actorPerson) {
		getActorPersons().add(actorPerson);
		actorPerson.setSex(this);

		return actorPerson;
	}

	public ActorPerson removeActorPerson(ActorPerson actorPerson) {
		getActorPersons().remove(actorPerson);
		actorPerson.setSex(null);

		return actorPerson;
	}

	public List<SexTranslation> getSexTranslations() {
		return this.sexTranslations;
	}

	public void setSexTranslations(List<SexTranslation> sexTranslations) {
		this.sexTranslations = sexTranslations;
	}

	public SexTranslation addSexTranslation(SexTranslation sexTranslation) {
		getSexTranslations().add(sexTranslation);
		sexTranslation.setSex(this);

		return sexTranslation;
	}

	public SexTranslation removeSexTranslation(SexTranslation sexTranslation) {
		getSexTranslations().remove(sexTranslation);
		sexTranslation.setSex(null);

		return sexTranslation;
	}

}