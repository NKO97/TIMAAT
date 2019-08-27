package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

/**
 * The primary key class for the user_account_has_category_set database table.
 * 
 */
@Embeddable
public class UserAccountHasCategorySetPK implements Serializable {
	//default serial version id, required for serializable classes.
	private static final long serialVersionUID = 1L;

	@Column(name="user_account_id", insertable=false, updatable=false)
	private int userAccountId;

	@Column(name="category_set_id", insertable=false, updatable=false)
	private int categorySetId;

	public UserAccountHasCategorySetPK() {
	}
	public int getUserAccountId() {
		return this.userAccountId;
	}
	public void setUserAccountId(int userAccountId) {
		this.userAccountId = userAccountId;
	}
	public int getCategorySetId() {
		return this.categorySetId;
	}
	public void setCategorySetId(int categorySetId) {
		this.categorySetId = categorySetId;
	}

	public boolean equals(Object other) {
		if (this == other) {
			return true;
		}
		if (!(other instanceof UserAccountHasCategorySetPK)) {
			return false;
		}
		UserAccountHasCategorySetPK castOther = (UserAccountHasCategorySetPK)other;
		return 
			(this.userAccountId == castOther.userAccountId)
			&& (this.categorySetId == castOther.categorySetId);
	}

	public int hashCode() {
		final int prime = 31;
		int hash = 17;
		hash = hash * prime + this.userAccountId;
		hash = hash * prime + this.categorySetId;
		
		return hash;
	}
}