package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import jakarta.persistence.*;

import com.fasterxml.jackson.annotation.JsonBackReference;


/**
 * The persistent class for the user_account_has_medium_analysis_list database table.
 * 
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