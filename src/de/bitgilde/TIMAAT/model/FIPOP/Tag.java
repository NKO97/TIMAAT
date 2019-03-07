package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.List;


/**
 * The persistent class for the Tag database table.
 * 
 */
@Entity
@NamedQuery(name="Tag.findAll", query="SELECT t FROM Tag t")
public class Tag implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	private String name;

	//bi-directional many-to-many association to Annotation
	@ManyToMany
	@JoinTable(
		name="Annotation_has_Tag"
		, joinColumns={
			@JoinColumn(name="TagID")
			}
		, inverseJoinColumns={
			@JoinColumn(name="AnnotationID")
			}
		)
	@JsonIgnore
	private List<Annotation> annotations;

	//bi-directional many-to-many association to Medium
	@ManyToMany
	@JoinTable(
		name="Medium_has_Tag"
		, joinColumns={
			@JoinColumn(name="TagID")
			}
		, inverseJoinColumns={
			@JoinColumn(name="MediumID")
			}
		)
	@JsonIgnore
	private List<Medium> mediums;

	//bi-directional many-to-many association to TagSet
	@ManyToMany(mappedBy="tags")
	private List<TagSet> tagSets;

	public Tag() {
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

	public List<Medium> getMediums() {
		return this.mediums;
	}

	public void setMediums(List<Medium> mediums) {
		this.mediums = mediums;
	}

	public List<TagSet> getTagSets() {
		return this.tagSets;
	}

	public void setTagSets(List<TagSet> tagSets) {
		this.tagSets = tagSets;
	}

}