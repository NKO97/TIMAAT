package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the rolegrouptranslation database table.
 * 
 */
@Entity
@NamedQuery(name="Rolegrouptranslation.findAll", query="SELECT r FROM Rolegrouptranslation r")
public class Rolegrouptranslation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private int id;

	private String name;

	//bi-directional many-to-one association to Language
	@ManyToOne
	@JoinColumn(name="LanguageID")
	private Language language;

	//bi-directional many-to-one association to Rolegroup
	@ManyToOne
	@JoinColumn(name="RoleGroupID")
	private Rolegroup rolegroup;

	public Rolegrouptranslation() {
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

	public Language getLanguage() {
		return this.language;
	}

	public void setLanguage(Language language) {
		this.language = language;
	}

	public Rolegroup getRolegroup() {
		return this.rolegroup;
	}

	public void setRolegroup(Rolegroup rolegroup) {
		this.rolegroup = rolegroup;
	}

}