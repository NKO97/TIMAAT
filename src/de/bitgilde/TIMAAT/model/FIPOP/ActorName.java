package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.Date;
import java.util.List;


/**
 * The persistent class for the actor_name database table.
 * 
 */
@Entity
@Table(name="actor_name")
@NamedQuery(name="ActorName.findAll", query="SELECT an FROM ActorName an")
public class ActorName implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;
	
	@Column(name="name")
	private String name;

	@Column(name="used_from", columnDefinition = "DATE")
	private Date usedFrom;

	@Column(name="used_until", columnDefinition = "DATE")
	private Date usedUntil;

	//bi-directional many-to-one association to Actor
	@ManyToOne(cascade = CascadeType.PERSIST)
	@JsonBackReference(value = "Actor-ActorName")
	private Actor actor;

	//bi-directional many-to-one association to Actor
	@OneToMany(mappedBy="birthName")
	@JsonIgnore
	private List<Actor> actors1;
	
	//bi-directional many-to-one association to Actor
	@OneToMany(mappedBy="displayName")
	@JsonIgnore
	private List<Actor> actors2;

	public ActorName() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Date getUsedFrom() {
		return this.usedFrom;
	}

	public void setUsedFrom(Date usedFrom) {
		this.usedFrom = usedFrom;
	}

	public Date getUsedUntil() {
		return this.usedUntil;
	}

	public void setUsedUntil(Date usedUntil) {
		this.usedUntil = usedUntil;
	}

	public List<Actor> getActors1() {
		return this.actors1;
	}

	public void setActors1(List<Actor> actors) {
		this.actors1 = actors;
	}

	public Actor addActors1(Actor actors) {
		getActors1().add(actors);
		actors.setBirthName(this);

		return actors;
	}

	public Actor removeActors1(Actor actors) {
		getActors1().remove(actors);
		actors.setBirthName(null);

		return actors;
	}

	public List<Actor> getActors2() {
		return this.actors2;
	}

	public void setActors2(List<Actor> actors) {
		this.actors2 = actors;
	}

	public Actor addActors2(Actor actors) {
		getActors2().add(actors);
		actors.setDisplayName(this);

		return actors;
	}

	public Actor removeActors2(Actor actors) {
		getActors2().remove(actors);
		actors.setDisplayName(null);

		return actors;
	}

	public Actor getActor() {
		return this.actor;
	}

	public void setActor(Actor actor) {
		this.actor = actor;
	}

}