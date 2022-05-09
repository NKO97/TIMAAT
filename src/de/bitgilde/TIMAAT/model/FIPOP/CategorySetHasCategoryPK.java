package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

/**
 * The primary key class for the category_set_has_category database table.
 *
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