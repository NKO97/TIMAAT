package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the actornamepart database table.
 * 
 */
@Entity
@NamedQuery(name="Actornamepart.findAll", query="SELECT a FROM Actornamepart a")
public class Actornamepart implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private int id;

	private String name;

	//bi-directional many-to-one association to Actorname
	@ManyToOne
	@JoinColumn(name="ActorNameID")
	private Actorname actorname;

	//bi-directional many-to-one association to Actornameparttype
	@ManyToOne
	@JoinColumn(name="ActorNamePartTypeID")
	private Actornameparttype actornameparttype;

	public Actornamepart() {
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

	public Actorname getActorname() {
		return this.actorname;
	}

	public void setActorname(Actorname actorname) {
		this.actorname = actorname;
	}

	public Actornameparttype getActornameparttype() {
		return this.actornameparttype;
	}

	public void setActornameparttype(Actornameparttype actornameparttype) {
		this.actornameparttype = actornameparttype;
	}

}