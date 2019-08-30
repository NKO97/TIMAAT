package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;


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

	@Column(name="permission_type")
	private String permissionType;

	//bi-directional many-to-one association to CategorySet
	@ManyToOne
	@JoinColumn(name="category_set_id")
	private CategorySet categorySet;

	//bi-directional many-to-one association to UserAccount
	@ManyToOne
	@JoinColumn(name="user_account_id")
	private UserAccount userAccount;

	public UserAccountHasCategorySet() {
	}

	public UserAccountHasCategorySetPK getId() {
		return this.id;
	}

	public void setId(UserAccountHasCategorySetPK id) {
		this.id = id;
	}

	public String getPermissionType() {
		return this.permissionType;
	}

	public void setPermissionType(String permissionType) {
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