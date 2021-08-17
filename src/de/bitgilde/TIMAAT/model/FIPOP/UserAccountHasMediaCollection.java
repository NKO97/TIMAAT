package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import jakarta.persistence.*;


/**
 * The persistent class for the user_account_has_media_collection database table.
 * 
 */
@Entity
@Table(name="user_account_has_media_collection")
@NamedQuery(name="UserAccountHasMediaCollection.findAll", query="SELECT u FROM UserAccountHasMediaCollection u")
public class UserAccountHasMediaCollection implements Serializable {
	private static final long serialVersionUID = 1L;

	@EmbeddedId
	private UserAccountHasMediaCollectionPK id;

	//bi-directional many-to-one association to MediaCollection
	@ManyToOne
	@JoinColumn(name="media_collection_id")
	private MediaCollection mediaCollection;

	//bi-directional many-to-one association to PermissionType
	@ManyToOne
	@JoinColumn(name="permission_type_id")
	private PermissionType permissionType;

	//bi-directional many-to-one association to UserAccount
	@ManyToOne
	@JoinColumn(name="user_account_id")
	private UserAccount userAccount;

	public UserAccountHasMediaCollection() {
	}

	public UserAccountHasMediaCollection(UserAccount userAccount, MediaCollection mediaCollection) {
		this.userAccount = userAccount;
		this.mediaCollection = mediaCollection;
		this.id = new UserAccountHasMediaCollectionPK(userAccount.getId(), mediaCollection.getId());
	}

	public UserAccountHasMediaCollectionPK getId() {
		return this.id;
	}

	public void setId(UserAccountHasMediaCollectionPK id) {
		this.id = id;
	}

	public MediaCollection getMediaCollection() {
		return this.mediaCollection;
	}

	public void setMediaCollection(MediaCollection mediaCollection) {
		this.mediaCollection = mediaCollection;
	}

	public PermissionType getPermissionType() {
		return this.permissionType;
	}

	public void setPermissionType(PermissionType permissionType) {
		this.permissionType = permissionType;
	}

	public UserAccount getUserAccount() {
		return this.userAccount;
	}

	public void setUserAccount(UserAccount userAccount) {
		this.userAccount = userAccount;
	}

}