package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonBackReference;

import java.util.Set;


/**
 * The persistent class for the category_set_has_category database table.
 * 
 */
@Entity
@Table(name="category_set_has_category")
@NamedQuery(name="CategorySetHasCategory.findAll", query="SELECT c FROM CategorySetHasCategory c")
public class CategorySetHasCategory implements Serializable {
	private static final long serialVersionUID = 1L;

	@EmbeddedId
	private CategorySetHasCategoryPK id;

	//bi-directional many-to-one association to Category
	@ManyToOne
	@JsonBackReference(value = "Category-CategorySetHsCategory")
	@JoinColumn(name="category_id")
	private Category category;

	//bi-directional many-to-one association to CategorySet
	@ManyToOne
	// @JsonIgnore
	@JsonBackReference(value = "CategorySet-CategorySetHasCategory")
	@JoinColumn(name="category_set_id")
	private CategorySet categorySet;

	//bi-directional many-to-one association to CategorySetHasCategory
	@ManyToOne
	@JoinColumns({
		@JoinColumn(name="parent_category_set_has_category_category_id", referencedColumnName="category_id"),
		@JoinColumn(name="parent_category_set_has_category_category_set_id", referencedColumnName="category_set_id")
		})
	private CategorySetHasCategory categorySetHasCategory;

	//bi-directional many-to-one association to CategorySetHasCategory
	@OneToMany(mappedBy="categorySetHasCategory")
	private Set<CategorySetHasCategory> categorySetHasCategories;

	public CategorySetHasCategory() {
	}

	public CategorySetHasCategory(CategorySet categorySet, Category category) {
		this.categorySet = categorySet;
		this.category = category;
		this.id = new CategorySetHasCategoryPK(categorySet.getId(), category.getId());
	}

	public CategorySetHasCategoryPK getId() {
		return this.id;
	}

	public void setId(CategorySetHasCategoryPK id) {
		this.id = id;
	}

	public Category getCategory() {
		return this.category;
	}

	public void setCategory(Category category) {
		this.category = category;
	}

	public CategorySet getCategorySet() {
		return this.categorySet;
	}

	public void setCategorySet(CategorySet categorySet) {
		this.categorySet = categorySet;
	}

	public CategorySetHasCategory getCategorySetHasCategory() {
		return this.categorySetHasCategory;
	}

	public void setCategorySetHasCategory(CategorySetHasCategory categorySetHasCategory) {
		this.categorySetHasCategory = categorySetHasCategory;
	}

	public Set<CategorySetHasCategory> getCategorySetHasCategories() {
		return this.categorySetHasCategories;
	}

	public void setCategorySetHasCategories(Set<CategorySetHasCategory> categorySetHasCategories) {
		this.categorySetHasCategories = categorySetHasCategories;
	}

	public CategorySetHasCategory addCategorySetHasCategory(CategorySetHasCategory categorySetHasCategory) {
		getCategorySetHasCategories().add(categorySetHasCategory);
		categorySetHasCategory.setCategorySetHasCategory(this);

		return categorySetHasCategory;
	}

	public CategorySetHasCategory removeCategorySetHasCategory(CategorySetHasCategory categorySetHasCategory) {
		getCategorySetHasCategories().remove(categorySetHasCategory);
		categorySetHasCategory.setCategorySetHasCategory(null);

		return categorySetHasCategory;
	}

}