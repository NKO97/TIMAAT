package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;
import java.sql.Timestamp;
import java.util.Set;


/**
 * The persistent class for the category_set database table.
 * 
 */
@Entity
@Table(name="category_set")
@NamedQuery(name="CategorySet.findAll", query="SELECT c FROM CategorySet c")
public class CategorySet implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	@Column(name="created_at")
	private Timestamp createdAt;

	@Column(name="last_edited_at")
	private Timestamp lastEditedAt;

	private String name;

	/*
	//bi-directional many-to-one association to AnalysisSpeech
	@OneToMany(mappedBy="categorySet")
	private Set<AnalysisSpeech> analysisSpeeches;

	//bi-directional many-to-one association to AnalysisVoice
	@OneToMany(mappedBy="categorySet")
	private Set<AnalysisVoice> analysisVoices;
	 */
	
	//bi-directional many-to-one association to UserAccount
	@ManyToOne
	@JoinColumn(name="last_edited_by_user_account_id")
	private UserAccount userAccount1;

	//bi-directional many-to-one association to UserAccount
	@ManyToOne
	@JoinColumn(name="created_by_user_account_id")
	private UserAccount userAccount2;

	//bi-directional many-to-one association to CategorySetHasCategory
	@OneToMany(mappedBy="categorySet")
	private Set<CategorySetHasCategory> categorySetHasCategories;

	//bi-directional many-to-one association to UserAccountHasCategorySet
	@OneToMany(mappedBy="categorySet")
	private Set<UserAccountHasCategorySet> userAccountHasCategorySets;

	public CategorySet() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public Timestamp getCreatedAt() {
		return this.createdAt;
	}

	public void setCreatedAt(Timestamp createdAt) {
		this.createdAt = createdAt;
	}

	public Timestamp getLastEditedAt() {
		return this.lastEditedAt;
	}

	public void setLastEditedAt(Timestamp lastEditedAt) {
		this.lastEditedAt = lastEditedAt;
	}

	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}
	
	/*

	public Set<AnalysisSpeech> getAnalysisSpeeches() {
		return this.analysisSpeeches;
	}

	public void setAnalysisSpeeches(Set<AnalysisSpeech> analysisSpeeches) {
		this.analysisSpeeches = analysisSpeeches;
	}

	public AnalysisSpeech addAnalysisSpeech(AnalysisSpeech analysisSpeech) {
		getAnalysisSpeeches().add(analysisSpeech);
		analysisSpeech.setCategorySet(this);

		return analysisSpeech;
	}

	public AnalysisSpeech removeAnalysisSpeech(AnalysisSpeech analysisSpeech) {
		getAnalysisSpeeches().remove(analysisSpeech);
		analysisSpeech.setCategorySet(null);

		return analysisSpeech;
	}

	public Set<AnalysisVoice> getAnalysisVoices() {
		return this.analysisVoices;
	}

	public void setAnalysisVoices(Set<AnalysisVoice> analysisVoices) {
		this.analysisVoices = analysisVoices;
	}

	public AnalysisVoice addAnalysisVoice(AnalysisVoice analysisVoice) {
		getAnalysisVoices().add(analysisVoice);
		analysisVoice.setCategorySet(this);

		return analysisVoice;
	}

	public AnalysisVoice removeAnalysisVoice(AnalysisVoice analysisVoice) {
		getAnalysisVoices().remove(analysisVoice);
		analysisVoice.setCategorySet(null);

		return analysisVoice;
	}

	 */

	public UserAccount getUserAccount1() {
		return this.userAccount1;
	}

	public void setUserAccount1(UserAccount userAccount1) {
		this.userAccount1 = userAccount1;
	}

	public UserAccount getUserAccount2() {
		return this.userAccount2;
	}

	public void setUserAccount2(UserAccount userAccount2) {
		this.userAccount2 = userAccount2;
	}

	public Set<CategorySetHasCategory> getCategorySetHasCategories() {
		return this.categorySetHasCategories;
	}

	public void setCategorySetHasCategories(Set<CategorySetHasCategory> categorySetHasCategories) {
		this.categorySetHasCategories = categorySetHasCategories;
	}

	public CategorySetHasCategory addCategorySetHasCategory(CategorySetHasCategory categorySetHasCategory) {
		getCategorySetHasCategories().add(categorySetHasCategory);
		categorySetHasCategory.setCategorySet(this);

		return categorySetHasCategory;
	}

	public CategorySetHasCategory removeCategorySetHasCategory(CategorySetHasCategory categorySetHasCategory) {
		getCategorySetHasCategories().remove(categorySetHasCategory);
		categorySetHasCategory.setCategorySet(null);

		return categorySetHasCategory;
	}

	public Set<UserAccountHasCategorySet> getUserAccountHasCategorySets() {
		return this.userAccountHasCategorySets;
	}

	public void setUserAccountHasCategorySets(Set<UserAccountHasCategorySet> userAccountHasCategorySets) {
		this.userAccountHasCategorySets = userAccountHasCategorySets;
	}

	public UserAccountHasCategorySet addUserAccountHasCategorySet(UserAccountHasCategorySet userAccountHasCategorySet) {
		getUserAccountHasCategorySets().add(userAccountHasCategorySet);
		userAccountHasCategorySet.setCategorySet(this);

		return userAccountHasCategorySet;
	}

	public UserAccountHasCategorySet removeUserAccountHasCategorySet(UserAccountHasCategorySet userAccountHasCategorySet) {
		getUserAccountHasCategorySets().remove(userAccountHasCategorySet);
		userAccountHasCategorySet.setCategorySet(null);

		return userAccountHasCategorySet;
	}

}