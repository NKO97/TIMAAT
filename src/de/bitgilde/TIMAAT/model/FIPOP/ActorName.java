package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.util.Date;
import java.util.List;


/**
 * The persistent class for the actor_name database table.
 * 
 */
@Entity
@Table(name="actor_name")
@NamedQuery(name="Actorname.findAll", query="SELECT a FROM ActorName a")
public class ActorName implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	@Column(name="text_direction")
	private String textDirection;

	@Temporal(TemporalType.DATE)
	@Column(name="used_since")
	private Date usedSince;

	@Temporal(TemporalType.DATE)
	@Column(name="used_until")
	private Date usedUntil;

	//bi-directional many-to-one association to Actor
	@ManyToOne
	@JsonBackReference(value = "Actor-ActorName")
	private Actor actor;

	//bi-directional many-to-one association to ActorNamePart
	@OneToMany(mappedBy="actorName")
	@JsonManagedReference(value = "ActorName-ActorNamePart")
	private List<ActorNamePart> actorNameParts;

	public ActorName() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getTextDirection() {
		return this.textDirection;
	}

	public void setTextDirection(String textDirection) {
		this.textDirection = textDirection;
	}

	public Date getUsedSince() {
		return this.usedSince;
	}

	public void setUsedSince(Date usedSince) {
		this.usedSince = usedSince;
	}

	public Date getUsedUntil() {
		return this.usedUntil;
	}

	public void setUsedUntil(Date usedUntil) {
		this.usedUntil = usedUntil;
	}

	public Actor getActor() {
		return this.actor;
	}

	public void setActor(Actor actor) {
		this.actor = actor;
	}

	public List<ActorNamePart> getActorNameParts() {
		return this.actorNameParts;
	}

	public void setActorNameParts(List<ActorNamePart> actorNameParts) {
		this.actorNameParts = actorNameParts;
	}

	public ActorNamePart addActorNamePart(ActorNamePart actorNamePart) {
		getActorNameParts().add(actorNamePart);
		actorNamePart.setActorName(this);

		return actorNamePart;
	}

	public ActorNamePart removeActorNamePart(ActorNamePart actorNamePart) {
		getActorNameParts().remove(actorNamePart);
		actorNamePart.setActorName(null);

		return actorNamePart;
	}

	
	public String getName() {
		return this.actorNameParts.toString(); // TODO verify whether this works
	}

	public void setName(String name) {
		this.actorNameParts.get(0).setName(name); // TODO verify whether this works
	}

}