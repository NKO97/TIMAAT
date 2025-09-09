package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import java.util.Set;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.NamedQuery;

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
 * The persistent class for the platform database table.
 *
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Entity
@NamedQuery(name="Platform.findAll", query="SELECT p FROM Platform p")
public class Platform implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private int id;

	private String type;

	//bi-directional many-to-many association to MediumSoftware
	@ManyToMany(fetch=FetchType.EAGER)
	@JoinTable(
		name="medium_software_has_platform"
		, joinColumns={
			@JoinColumn(name="platform_id")
			}
		, inverseJoinColumns={
			@JoinColumn(name="medium_software_medium_id")
			}
		)
	private Set<MediumSoftware> mediumSoftwares;

	public Platform() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getType() {
		return this.type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public Set<MediumSoftware> getMediumSoftwares() {
		return this.mediumSoftwares;
	}

	public void setMediumSoftwares(Set<MediumSoftware> mediumSoftwares) {
		this.mediumSoftwares = mediumSoftwares;
	}

}