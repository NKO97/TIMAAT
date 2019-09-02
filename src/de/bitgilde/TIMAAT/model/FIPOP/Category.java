package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;
import java.util.List;
import java.util.Set;


/**
 * The persistent class for the category database table.
 * 
 */
@Entity
@NamedQuery(name="Category.findAll", query="SELECT c FROM Category c")
public class Category implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	private String name;

	//bi-directional many-to-many association to Annotation
	@ManyToMany
	@JoinTable(
		name="annotation_has_category"
		, joinColumns={
			@JoinColumn(name="category_id")
			}
		, inverseJoinColumns={
			@JoinColumn(name="annotation_id")
			}
		)
	private List<Annotation> annotations;

	//bi-directional many-to-one association to CategorySetHasCategory
	@OneToMany(mappedBy="category")
	private Set<CategorySetHasCategory> categorySetHasCategories;

	//bi-directional many-to-many association to Medium
	@ManyToMany(mappedBy="categories")
	private List<Medium> mediums;

	public Category() {
	}

	// public Category(String name) {
	// 	this.name = name;
	// }

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

	// get all CategorySets this category is a member of
	public List<CategorySet> getCategorySets() { // TODO
		// Find all CategorySetHasCategory where Category appears
		// list all CategorySets found that way
		return null;
	}

}