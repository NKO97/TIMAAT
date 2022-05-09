package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;


/**
 * The persistent class for the category database table.
 *
 */
@Entity
@Table(name="category")
@NamedQuery(name="Category.findAll", query="SELECT c FROM Category c")
public class Category implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	private String name;

	//bi-directional many-to-many association to Annotation
	@ManyToMany(mappedBy = "categories")
	@JsonIgnore
	private List<Annotation> annotations;

	//bi-directional many-to-many association to AnalysisSegment
	@ManyToMany(mappedBy = "categories")
	@JsonIgnore
	private List<AnalysisSegment> analysisSegments;

	//bi-directional many-to-many association to AnalysisSequence
	@ManyToMany(mappedBy = "categories")
	@JsonIgnore
	private List<AnalysisSequence> analysisSequences;

	//bi-directional many-to-many association to AnalysisScene
	@ManyToMany(mappedBy = "categories")
	@JsonIgnore
	private List<AnalysisScene> analysisScenes;

	//bi-directional many-to-many association to AnalysisAction
	@ManyToMany(mappedBy = "categories")
	@JsonIgnore
	private List<AnalysisAction> analysisActions;

	//bi-directional many-to-many association to AnalysisTake
	@ManyToMany(mappedBy = "categories")
	@JsonIgnore
	private List<AnalysisTake> analysisTakes;

	//bi-directional many-to-one association to CategorySetHasCategory
	@OneToMany(mappedBy="category")
	@JsonManagedReference(value = "Category-CategorySetHasCategory")
	private Set<CategorySetHasCategory> categorySetHasCategories;

	//bi-directional many-to-many association to Medium
	@ManyToMany(mappedBy="categories")
	@JsonIgnore
	private List<Medium> mediums;

	//bi-directional many-to-many association to music
	@ManyToMany(mappedBy="categories")
	@JsonIgnore
	private List<Music> musicList;

	public Category() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public List<Annotation> getAnnotations() {
		return this.annotations;
	}

	public void setAnnotations(List<Annotation> annotations) {
		this.annotations = annotations;
	}

	public Set<CategorySetHasCategory> getCategorySetHasCategories() {
		return this.categorySetHasCategories;
	}

	public void setCategorySetHasCategories(Set<CategorySetHasCategory> categorySetHasCategories) {
		this.categorySetHasCategories = categorySetHasCategories;
	}

	public CategorySetHasCategory addCategorySetHasCategory(CategorySetHasCategory categorySetHasCategory) {
		getCategorySetHasCategories().add(categorySetHasCategory);
		categorySetHasCategory.setCategory(this);

		return categorySetHasCategory;
	}

	public CategorySetHasCategory removeCategorySetHasCategory(CategorySetHasCategory categorySetHasCategory) {
		getCategorySetHasCategories().remove(categorySetHasCategory);
		categorySetHasCategory.setCategory(null);

		return categorySetHasCategory;
	}

	public List<Medium> getMediums() {
		return this.mediums;
	}

	public void setMediums(List<Medium> mediums) {
		this.mediums = mediums;
	}

	public List<Music> getMusicList() {
		return this.musicList;
	}

	public void setMusicList(List<Music> musicList) {
		this.musicList = musicList;
	}

	public List<AnalysisSegment> getAnalysisSegments() {
		return this.analysisSegments;
	}

	public void setAnalysisSegments(List<AnalysisSegment> analysisSegments) {
		this.analysisSegments = analysisSegments;
	}

	public List<AnalysisSequence> getAnalysisSequences() {
		return this.analysisSequences;
	}

	public void setAnalysisSequences(List<AnalysisSequence> analysisSequences) {
		this.analysisSequences = analysisSequences;
	}

	public List<AnalysisTake> getAnalysisTakes() {
		return this.analysisTakes;
	}

	public void setAnalysisTakes(List<AnalysisTake> analysisTakes) {
		this.analysisTakes = analysisTakes;
	}

	public List<AnalysisScene> getAnalysisScenes() {
		return this.analysisScenes;
	}

	public void setAnalysisScenes(List<AnalysisScene> analysisScenes) {
		this.analysisScenes = analysisScenes;
	}

	public List<AnalysisAction> getAnalysisActions() {
		return this.analysisActions;
	}

	public void setAnalysisActions(List<AnalysisAction> analysisActions) {
		this.analysisActions = analysisActions;
	}


}