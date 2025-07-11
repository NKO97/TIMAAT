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
 * The primary key class for the user_account_has_medium_analysis_list database table.
 *
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Embeddable
public class UserAccountHasMediumAnalysisListPK implements Serializable {
	//default serial version id, required for serializable classes.
	private static final long serialVersionUID = 1L;

	@Column(name="user_account_id", insertable=false, updatable=false)
	private int userAccountId;

	@Column(name="medium_analysis_list_id", insertable=false, updatable=false)
	private int mediumAnalysisListId;

	public UserAccountHasMediumAnalysisListPK() {
	}
	public UserAccountHasMediumAnalysisListPK(int userAccountId, int mediumAnalysisListId) {
		this.userAccountId = userAccountId;
		this.mediumAnalysisListId = mediumAnalysisListId;
	}
	public int getUserAccountId() {
		return this.userAccountId;
	}
	public void setUserAccountId(int userAccountId) {
		this.userAccountId = userAccountId;
	}
	public int getMediumAnalysisListId() {
		return this.mediumAnalysisListId;
	}
	public void setMediumAnalysisListId(int mediumAnalysisListId) {
		this.mediumAnalysisListId = mediumAnalysisListId;
	}

	public boolean equals(Object other) {
		if (this == other) {
			return true;
		}
		if (!(other instanceof UserAccountHasMediumAnalysisListPK)) {
			return false;
		}
		UserAccountHasMediumAnalysisListPK castOther = (UserAccountHasMediumAnalysisListPK)other;
		return
			(this.userAccountId == castOther.userAccountId)
			&& (this.mediumAnalysisListId == castOther.mediumAnalysisListId);
	}

	public int hashCode() {
		final int prime = 31;
		int hash = 17;
		hash = hash * prime + this.userAccountId;
		hash = hash * prime + this.mediumAnalysisListId;

		return hash;
	}
}