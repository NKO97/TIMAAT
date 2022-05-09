package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.Table;


/**
 * The persistent class for the user_account_has_category_set database table.
 *
 */
@Entity
@Table(name="user_account_has_category_set")
@NamedQuery(name="UserAccountHasCategorySet.findAll", query="SELECT u FROM UserAccountHasCategorySet u")
public class UserAccountHasCategorySet implements Serializable {
	private static final long serialVersionUID = 1L;

	@EmbeddedId
	private UserAccountHasCategorySetPK id;

	//bi-directional many-to-one association to PermissionType
	@ManyToOne
	@JoinColumn(name="permission_type_id")
	private PermissionType permissionType;

	//bi-directional many-to-one association to CategorySet
	@ManyToOne
	@JoinColumn(name="category_set_id")
	@JsonBackReference(value = "CategorySet-UserAccountHasCategorySet")
	private CategorySet categorySet;

	//bi-directional many-to-one association to UserAccount
	@ManyToOne
	@JoinColumn(name="user_account_id")
	@JsonBackReference(value = "UserAccount-UserAccountHasCategorySet")
	private UserAccount userAccount;

	public UserAccountHasCategorySet() {
	}

	public UserAccountHasCategorySet(UserAccount userAccount, CategorySet categorySet) {
		this.userAccount = userAccount;
		this.categorySet = categorySet;
		this.id = new UserAccountHasCategorySetPK(userAccount.getId(), categorySet.getId());
	}

	public UserAccountHasCategorySetPK getId() {
		return this.id;
	}

	public void setId(UserAccountHasCategorySetPK id) {
		this.id = id;
	}

	public PermissionType getPermissionType() {
		return this.permissionType;
	}

	public void setPermissionType(PermissionType permissionType) {
		this.permissionType = permissionType;
	}

	public CategorySet getCategorySet() {
		return this.categorySet;
	}

	public void setCategorySet(CategorySet categorySet) {
		this.categorySet = categorySet;
	}

	public UserAccount getUserAccount() {
		return this.userAccount;
	}

	public void setUserAccount(UserAccount userAccount) {
		this.userAccount = userAccount;
	}

}