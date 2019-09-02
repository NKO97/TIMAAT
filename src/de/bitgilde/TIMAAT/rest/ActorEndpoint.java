package de.bitgilde.TIMAAT.rest;

import java.io.IOException;
import java.sql.Timestamp;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.EntityTransaction;
import javax.servlet.ServletContext;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.PATCH;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;
import javax.ws.rs.core.Response.Status;

import org.jvnet.hk2.annotations.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

import de.bitgilde.TIMAAT.TIMAATApp;
import de.bitgilde.TIMAAT.model.FIPOP.Tag;
import de.bitgilde.TIMAAT.model.FIPOP.Actor;
import de.bitgilde.TIMAAT.security.UserLogManager;

/**
*
* @author Jens-Martin Loebel <loebel@bitgilde.de>
* @author Mirko Scherf <mscherf@uni-mainz.de>
*/

@Service
@Path("/actor")
public class ActorEndpoint {
	@Context
	private UriInfo uriInfo;
	@Context
	ContainerRequestContext containerRequestContext;
	@Context
	ServletContext servletContext;	

	@GET
    @Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("{id}")
	public Response getActor(@PathParam("id") int id) {    	
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Actor e = entityManager.find(Actor.class, id);
		if ( e == null ) return Response.status(Status.NOT_FOUND).build();    	    	
	return Response.ok().entity(e).build();
	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("list")
	public Response getActorList() {			
			@SuppressWarnings("unchecked")
		List<Actor> actorList = TIMAATApp.emf.createEntityManager().createNamedQuery("Actor.findAll").getResultList();
			// for (Actor actor : actorList ) {
			// 	actor.setStatus(videoStatus(actor.getId()));
			// 	actor.setViewToken(issueFileToken(actor.getId()));
			// 	actor.setMediumAnalysisLists(null);
			// }			
		return Response.ok().entity(actorList).build();
	}

	@POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
	@Path("{id}")
	@Secured
	public Response createActor(@PathParam("id") int id, String jsonData) {
		ObjectMapper mapper = new ObjectMapper();
		Actor newActor = null;  
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();  	
   // EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		// Medium m = em.find(Medium.class, id);
		// if ( m == null ) return Response.status(Status.NOT_FOUND).build();		
		// parse JSON data
		try {
			newActor = mapper.readValue(jsonData, Actor.class);
		} catch (IOException e) {
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( newActor == null ) return Response.status(Status.BAD_REQUEST).build();
		// sanitize object data
		newActor.setId(0);
		// update log metadata
		// newActor.setCreatedAt(new Timestamp(System.currentTimeMillis()));
		// newActor.setLastEditedAt(new Timestamp(System.currentTimeMillis()));
		if ( containerRequestContext.getProperty("TIMAAT.userID") != null ) {
			newActor.getCreatedByUserAccount().setId((int) containerRequestContext.getProperty("TIMAAT.userID"));
			newActor.getLastEditedByUserAccount().setId((int) containerRequestContext.getProperty("TIMAAT.userID"));
		} else {
			// DEBUG do nothing - production system should abort with internal server error		
			return Response.serverError().build();	
		}
		// persist actor
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.persist(newActor);
		entityManager.flush();
		entityTransaction.commit();
		entityManager.refresh(newActor);		
		// add log entry
		UserLogManager.getLogger().addLogEntry(newActor.getCreatedByUserAccount().getId(), UserLogManager.LogEvents.ACTORCREATED);
		return Response.ok().entity(newActor).build();
	}

	@PATCH
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
	@Path("{id}")
	@Secured
	public Response updateActor(@PathParam("id") int id, String jsonData) {
		ObjectMapper mapper = new ObjectMapper();
		Actor updatedActor = null;    	
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Actor actor = entityManager.find(Actor.class, id);
		if ( actor == null ) return Response.status(Status.NOT_FOUND).build();		
		// parse JSON data
		try {
			updatedActor = mapper.readValue(jsonData, Actor.class);
		} catch (IOException e) {
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( updatedActor == null ) return Response.notModified().build();		    	
    	// update actor
    // if ( updatedActor.getName() != null ) actor.setName(updatedActor.getName());
    if ( updatedActor.getActorNames() != null ) actor.setActorNames(updatedActor.getActorNames()); // TODO get the actual name instead of a list of names
		// update log metadata
		actor.setLastEditedAt(new Timestamp(System.currentTimeMillis()));
		if ( containerRequestContext.getProperty("TIMAAT.userID") != null ) {
			actor.getLastEditedByUserAccount().setId((int) containerRequestContext.getProperty("TIMAAT.userID"));
		} else {
			// DEBUG do nothing - production system should abort with internal server error			
		}		
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.merge(actor);
		entityManager.persist(actor);
		entityTransaction.commit();
		entityManager.refresh(actor);
		// add log entry
		UserLogManager.getLogger().addLogEntry((int) containerRequestContext.getProperty("TIMAAT.userID"), 
																						UserLogManager.LogEvents.ACTOREDITED);
		return Response.ok().entity(actor).build();
	}

	@DELETE
		@Produces(MediaType.APPLICATION_JSON)
	@Path("{id}")
	@Secured
	public Response deleteActor(@PathParam("id") int id) {    	
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Actor actor = entityManager.find(Actor.class, id);
		if ( actor == null ) return Response.status(Status.NOT_FOUND).build();		
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.remove(actor);
		entityTransaction.commit();
		// add log entry
		UserLogManager.getLogger().addLogEntry((int) containerRequestContext.getProperty("TIMAAT.userID"), 
																						UserLogManager.LogEvents.ACTORDELETED);
		return Response.ok().build();
	}
	
	// @SuppressWarnings("unchecked")
	// @POST
  //   @Produces(MediaType.APPLICATION_JSON)
	// @Path("{id}/tag/{name}") // 	@Path("actor/{id}/tag/{name}")
	// @Secured
	// public Response addTag(@PathParam("id") int id, @PathParam("name") String tagName) {    	
  //   	EntityManager entityManager = TIMAATApp.emf.createEntityManager();
  //   	Actor actor = entityManager.find(Actor.class, id);
  //   	if ( actor == null ) return Response.status(Status.NOT_FOUND).build();
  //   	// check if tag exists    	
  //   	Tag tag = null;
  //   	List<Tag> tags = null;
  //   	try {
  //       	tags = (List<Tag>) entityManager.createQuery("SELECT t from Tag t WHERE t.name=:name")
  //       			.setParameter("name", tagName)
  //       			.getResultList();
  //   	} catch(Exception e) {};    	
  //   	// find tag case sensitive
  //   	for ( Tag listTag : tags )
  //   		if ( listTag.getName().compareTo(tagName) == 0 ) tag = listTag;    	
  //   	// create tag if it doesn't exist yet
  //   	if ( tag == null ) {
  //   		tag = new Tag();
  //   		tag.setName(tagName);
  //   		EntityTransaction entityTransaction = entityManager.getTransaction();
  //   		entityTransaction.begin();
  //   		entityManager.persist(tag);
  //   		entityTransaction.commit();
  //   		entityManager.refresh(tag);
  //   	}    	
    	// // check if actor already has tag
    	// if ( !actor.getTags().contains(tag) ) {
      //   	// attach tag to actor and vice versa    	
    	// 	EntityTransaction entityTransaction = entityManager.getTransaction();
    	// 	entityTransaction.begin();
    	// 	actor.getTags().add(tag);
    	// 	tag.getActors().add(actor);
    	// 	entityManager.merge(tag);
    	// 	entityManager.merge(actor);
    	// 	entityManager.persist(actor);
    	// 	entityManager.persist(tag);
    	// 	entityTransaction.commit();
    	// 	entityManager.refresh(actor);
    	// } 	
	// 	return Response.ok().entity(tag).build();
	// }
	
	// @DELETE
  //   @Produces(MediaType.APPLICATION_JSON)
	// @Path("{id}/tag/{name}")
	// @Secured
	// public Response removeTag(@PathParam("id") int id, @PathParam("name") String tagName) {    	
  //   	EntityManager entityManager = TIMAATApp.emf.createEntityManager();
  //   	Actor actor = entityManager.find(Actor.class, id);
  //   	if ( actor == null ) return Response.status(Status.NOT_FOUND).build();    	
  //   	// check if actor already has tag
  //   	Tag tag = null;
  //   	for ( Tag actorTag:actor.getTags() ) {
  //   		if ( actorTag.getName().compareTo(tagName) == 0 ) tag = actorTag;
  //   	}
  //   	if ( tag != null ) {
  //       	// attach tag to actor and vice versa    	
  //   		EntityTransaction entityTransaction = entityManager.getTransaction();
  //   		entityTransaction.begin();
  //   		actor.getTags().remove(tag);
  //   		tag.getActors().remove(actor);
  //   		entityManager.merge(tag);
  //   		entityManager.merge(actor);
  //   		entityManager.persist(actor);
  //   		entityManager.persist(tag);
  //   		entityTransaction.commit();
  //   		entityManager.refresh(actor);
  //   	} 	
	// 	return Response.ok().build();
	// }
	
	@SuppressWarnings("unchecked")
	@GET
    @Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("all")
	public Response getAllActors() {
		List<Actor> actors = null;    	
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		try {
			actors = (List<Actor>) entityManager.createQuery("SELECT e from Actor e")
						.getResultList();
		} catch(Exception e) {};	
		// if ( actors != null ) {
		// 	List<Tag> tags = null;
		// 		try {
		// 			tags = (List<Tag>) entityManager.createQuery("SELECT t from Tag t WHERE NOT EXISTS ( SELECT NULL FROM Actor e WHERE e.tags = t)")
		// 						.getResultList();
		// 		} catch(Exception e) {};
		// 	if ( tags != null ) {
		// 		Actor emptyActor = new Actor();
    //     emptyActor.setId(-1);
		// 		emptyActor.setActornames(null); // TODO proper unassigned name setting
		// 		// emptyActor.setTags(tags);
		// 		actors.add(0, emptyActor);
		// 	}
		// }    	
		return Response.ok().entity(actors).build();
	}
}
