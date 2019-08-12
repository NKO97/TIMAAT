package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;
import java.util.List;


/**
 * The persistent class for the actortype database table.
 * 
 */
@Entity
@NamedQuery(name="Actortype.findAll", query="SELECT a FROM Actortype a")
public class Actortype implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private int id;

	//bi-directional many-to-many association to Actor
	@ManyToMany
	@JoinTable(
		name="actor_has_actortype"
		, joinColumns={
			@JoinColumn(name="ActorTypeID")
			}
		, inverseJoinColumns={
			@JoinColumn(name="ActorID")
			}
		)
	private List<Actor> actors;

	//bi-directional many-to-one association to Actortypetranslation
	@OneToMany(mappedBy="actortype")
	private List<Actortypetranslation> actortypetranslations;

	public Actortype() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public List<Actor> getActors() {
		return this.actors;
	}

	public void setActors(List<Actor> actors) {
		this.actors = actors;
	}

	public List<Actortypetranslation> getActortypetranslations() {
		return this.actortypetranslations;
	}

	public void setActortypetranslations(List<Actortypetranslation> actortypetranslations) {
		this.actortypetranslations = actortypetranslations;
	}

	public Actortypetranslation addActortypetranslation(Actortypetranslation actortypetranslation) {
		getActortypetranslations().add(actortypetranslation);
		actortypetranslation.setActortype(this);

		return actortypetranslation;
	}

	public Actortypetranslation removeActortypetranslation(Actortypetranslation actortypetranslation) {
		getActortypetranslations().remove(actortypetranslation);
		actortypetranslation.setActortype(null);

		return actortypetranslation;
	}

}