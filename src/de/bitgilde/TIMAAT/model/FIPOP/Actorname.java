package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;
import java.util.Date;
import java.util.List;


/**
 * The persistent class for the actorname database table.
 * 
 */
@Entity
@NamedQuery(name="Actorname.findAll", query="SELECT a FROM Actorname a")
public class Actorname implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private int id;

	private String textDirection;

	@Temporal(TemporalType.DATE)
	private Date usedSince;

	@Temporal(TemporalType.DATE)
	private Date usedUntil;

	//bi-directional many-to-one association to Actor
	@ManyToOne
	@JoinColumn(name="ActorID")
	private Actor actor;

	//bi-directional many-to-one association to Actornamepart
	@OneToMany(mappedBy="actorname")
	private List<Actornamepart> actornameparts;

	public Actorname() {
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

	public List<Actornamepart> getActornameparts() {
		return this.actornameparts;
	}

	public void setActornameparts(List<Actornamepart> actornameparts) {
		this.actornameparts = actornameparts;
	}

	public Actornamepart addActornamepart(Actornamepart actornamepart) {
		getActornameparts().add(actornamepart);
		actornamepart.setActorname(this);

		return actornamepart;
	}

	public Actornamepart removeActornamepart(Actornamepart actornamepart) {
		getActornameparts().remove(actornamepart);
		actornamepart.setActorname(null);

		return actornamepart;
	}

}