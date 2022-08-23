package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQuery;
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
 * The persistent class for the user_account_has_medium_analysis_list database table.
 *
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Entity
@Table(name="user_account_has_medium_analysis_list")
@NamedQuery(name="UserAccountHasMediumAnalysisList.findAll", query="SELECT u FROM UserAccountHasMediumAnalysisList u")
public class UserAccountHasMediumAnalysisList implements Serializable {
	private static final long serialVersionUID = 1L;

	@EmbeddedId
	private UserAccountHasMediumAnalysisListPK id;

	//bi-directional many-to-one association to PermissionType
	@ManyToOne
	@JoinColumn(name="permission_type_id")
	private PermissionType permissionType;

	//bi-directional many-to-one association to MediumAnalysisList
	@ManyToOne
	@JsonBackReference(value = "MediumAnalysisList-UserAccountHasMediumAnalysisList")
	@JoinColumn(name="medium_analysis_list_id")
	private MediumAnalysisList mediumAnalysisList;

	//bi-directional many-to-one association to UserAccount
	@ManyToOne
	@JsonBackReference(value = "UserAccount-UserAccountHasMediumAnalysisList")
	@JoinColumn(name="user_account_id")
	private UserAccount userAccount;

	public UserAccountHasMediumAnalysisList() {
	}

	public UserAccountHasMediumAnalysisList(UserAccount userAccount, MediumAnalysisList mediumAnalysisList) {
		this.userAccount = userAccount;
		this.mediumAnalysisList = mediumAnalysisList;
		this.id = new UserAccountHasMediumAnalysisListPK(userAccount.getId(), mediumAnalysisList.getId());
	}

	public UserAccountHasMediumAnalysisListPK getId() {
		return this.id;
	}

	public void setId(UserAccountHasMediumAnalysisListPK id) {
		this.id = id;
	}

	public PermissionType getPermissionType() {
		return this.permissionType;
	}

	public void setPermissionType(PermissionType permissionType) {
		this.permissionType = permissionType;
	}

	public MediumAnalysisList getMediumAnalysisList() {
		return this.mediumAnalysisList;
	}

	public void setMediumAnalysisList(MediumAnalysisList mediumAnalysisList) {
		this.mediumAnalysisList = mediumAnalysisList;
	}

	public UserAccount getUserAccount() {
		return this.userAccount;
	}

	public void setUserAccount(UserAccount userAccount) {
		this.userAccount = userAccount;
	}

}