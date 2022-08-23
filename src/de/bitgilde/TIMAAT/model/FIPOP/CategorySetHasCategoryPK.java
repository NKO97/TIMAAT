package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

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
 * The primary key class for the category_set_has_category database table.
 *
 * @author Jens-Martin Loebel <loebel@bitgilde.de>
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Embeddable
public class CategorySetHasCategoryPK implements Serializable {
	//default serial version id, required for serializable classes.
	private static final long serialVersionUID = 1L;

	@Column(name="category_set_id", insertable=false, updatable=false)
	private int categorySetId;

	@Column(name="category_id", insertable=false, updatable=false)
	private int categoryId;

	public CategorySetHasCategoryPK() {
	}

	public CategorySetHasCategoryPK(int categorySetId, int categoryId) {
		this.categorySetId = categorySetId;
		this.categoryId = categoryId;
	}

	public int getCategorySetId() {
		return this.categorySetId;
	}

	public void setCategorySetId(int categorySetId) {
		this.categorySetId = categorySetId;
	}

	public int getCategoryId() {
		return this.categoryId;
	}

	public void setCategoryId(int categoryId) {
		this.categoryId = categoryId;
	}

	public boolean equals(Object other) {
		if (this == other) {
			return true;
		}
		if (!(other instanceof CategorySetHasCategoryPK)) {
			return false;
		}
		CategorySetHasCategoryPK castOther = (CategorySetHasCategoryPK)other;
		return
			(this.categorySetId == castOther.categorySetId)
			&& (this.categoryId == castOther.categoryId);
	}

	public int hashCode() {
		final int prime = 31;
		int hash = 17;
		hash = hash * prime + this.categorySetId;
		hash = hash * prime + this.categoryId;

		return hash;
	}
}