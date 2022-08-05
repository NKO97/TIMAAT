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


/**
 * The persistent class for the permission_type database table.
 *
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Entity
@Table(name="permission_type")
@NamedQuery(name="PermissionType.findAll", query="SELECT p FROM PermissionType p")
public class PermissionType implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	private String type;

	//bi-directional many-to-one association to UserAccountHasCategorySet
	@OneToMany(mappedBy="permissionType")
	@JsonIgnore
	private List<UserAccountHasCategorySet> userAccountHasCategorySets;

	//bi-directional many-to-one association to UserAccountHasMediaCollection
	// @OneToMany(mappedBy="permissionType")
	// private List<UserAccountHasMediaCollection> userAccountHasMediaCollections;

	//bi-directional many-to-many association to UserAccount
	// @ManyToMany(mappedBy="permissionTypes")
	// private List<UserAccount> userAccounts;

	//bi-directional many-to-one association to UserAccountHasMediumAnalysisList
	@OneToMany(mappedBy="permissionType")
	@JsonIgnore
	private List<UserAccountHasMediumAnalysisList> userAccountHasMediumAnalysisLists;

	//bi-directional many-to-one association to UserAccountHasWorkAnalysisList
	// @OneToMany(mappedBy="permissionType")
	// private List<UserAccountHasWorkAnalysisList> userAccountHasWorkAnalysisLists;

	public PermissionType() {
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

	// public List<UserAccountHasCategorySet> getUserAccountHasCategorySets() {
	// 	return this.userAccountHasCategorySets;
	// }

	// public void setUserAccountHasCategorySets(List<UserAccountHasCategorySet> userAccountHasCategorySets) {
	// 	this.userAccountHasCategorySets = userAccountHasCategorySets;
	// }

	// public UserAccountHasCategorySet addUserAccountHasCategorySet(UserAccountHasCategorySet userAccountHasCategorySet) {
	// 	getUserAccountHasCategorySets().add(userAccountHasCategorySet);
	// 	userAccountHasCategorySet.setPermissionType(this);

	// 	return userAccountHasCategorySet;
	// }

	// public UserAccountHasCategorySet removeUserAccountHasCategorySet(UserAccountHasCategorySet userAccountHasCategorySet) {
	// 	getUserAccountHasCategorySets().remove(userAccountHasCategorySet);
	// 	userAccountHasCategorySet.setPermissionType(null);

	// 	return userAccountHasCategorySet;
	// }

	// public List<UserAccountHasMediaCollection> getUserAccountHasMediaCollections() {
	// 	return this.userAccountHasMediaCollections;
	// }

	// public void setUserAccountHasMediaCollections(List<UserAccountHasMediaCollection> userAccountHasMediaCollections) {
	// 	this.userAccountHasMediaCollections = userAccountHasMediaCollections;
	// }

	// public UserAccountHasMediaCollection addUserAccountHasMediaCollection(UserAccountHasMediaCollection userAccountHasMediaCollection) {
	// 	getUserAccountHasMediaCollections().add(userAccountHasMediaCollection);
	// 	userAccountHasMediaCollection.setPermissionType(this);

	// 	return userAccountHasMediaCollection;
	// }

	// public UserAccountHasMediaCollection removeUserAccountHasMediaCollection(UserAccountHasMediaCollection userAccountHasMediaCollection) {
	// 	getUserAccountHasMediaCollections().remove(userAccountHasMediaCollection);
	// 	userAccountHasMediaCollection.setPermissionType(null);

	// 	return userAccountHasMediaCollection;
	// }

	// public List<UserAccount> getUserAccounts() {
	// 	return this.userAccounts;
	// }

	// public void setUserAccounts(List<UserAccount> userAccounts) {
	// 	this.userAccounts = userAccounts;
	// }

	public List<UserAccountHasMediumAnalysisList> getUserAccountHasMediumAnalysisLists() {
		return this.userAccountHasMediumAnalysisLists;
	}

	public void setUserAccountHasMediumAnalysisLists(List<UserAccountHasMediumAnalysisList> userAccountHasMediumAnalysisLists) {
		this.userAccountHasMediumAnalysisLists = userAccountHasMediumAnalysisLists;
	}

	public UserAccountHasMediumAnalysisList addUserAccountHasMediumAnalysisList(UserAccountHasMediumAnalysisList userAccountHasMediumAnalysisList) {
		getUserAccountHasMediumAnalysisLists().add(userAccountHasMediumAnalysisList);
		userAccountHasMediumAnalysisList.setPermissionType(this);

		return userAccountHasMediumAnalysisList;
	}

	public UserAccountHasMediumAnalysisList removeUserAccountHasMediumAnalysisList(UserAccountHasMediumAnalysisList userAccountHasMediumAnalysisList) {
		getUserAccountHasMediumAnalysisLists().remove(userAccountHasMediumAnalysisList);
		userAccountHasMediumAnalysisList.setPermissionType(null);

		return userAccountHasMediumAnalysisList;
	}

	// public List<UserAccountHasWorkAnalysisList> getUserAccountHasWorkAnalysisLists() {
	// 	return this.userAccountHasWorkAnalysisLists;
	// }

	// public void setUserAccountHasWorkAnalysisLists(List<UserAccountHasWorkAnalysisList> userAccountHasWorkAnalysisLists) {
	// 	this.userAccountHasWorkAnalysisLists = userAccountHasWorkAnalysisLists;
	// }

	// public UserAccountHasWorkAnalysisList addUserAccountHasWorkAnalysisList(UserAccountHasWorkAnalysisList userAccountHasWorkAnalysisList) {
	// 	getUserAccountHasWorkAnalysisLists().add(userAccountHasWorkAnalysisList);
	// 	userAccountHasWorkAnalysisList.setPermissionType(this);

	// 	return userAccountHasWorkAnalysisList;
	// }

	// public UserAccountHasWorkAnalysisList removeUserAccountHasWorkAnalysisList(UserAccountHasWorkAnalysisList userAccountHasWorkAnalysisList) {
	// 	getUserAccountHasWorkAnalysisLists().remove(userAccountHasWorkAnalysisList);
	// 	userAccountHasWorkAnalysisList.setPermissionType(null);

	// 	return userAccountHasWorkAnalysisList;
	// }

}