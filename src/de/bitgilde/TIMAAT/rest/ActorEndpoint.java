package de.bitgilde.TIMAAT.rest;

import java.io.IOException;
import java.sql.Timestamp;
import java.util.ArrayList;
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
import de.bitgilde.TIMAAT.model.FIPOP.UserAccount;
import de.bitgilde.TIMAAT.model.FIPOP.Actor;
import de.bitgilde.TIMAAT.model.FIPOP.ActorCollective;
import de.bitgilde.TIMAAT.model.FIPOP.ActorName;
import de.bitgilde.TIMAAT.model.FIPOP.ActorPerson;
import de.bitgilde.TIMAAT.model.FIPOP.ActorType;
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
	@Path("list")
	public Response getActorList() {			
		@SuppressWarnings("unchecked")
		List<Actor> actorList = TIMAATApp.emf.createEntityManager().createNamedQuery("Actor.findAll").getResultList();
	
		return Response.ok().entity(actorList).build();
	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("actortype/list")
	public Response getActortypeList() {
		// System.out.println("ActorServiceEndpoint: getActorTypeList");		
		@SuppressWarnings("unchecked")
		List<ActorType> actorTypeList = TIMAATApp.emf.createEntityManager().createNamedQuery("ActorType.findAll").getResultList();
		return Response.ok().entity(actorTypeList).build();
	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("person/list")
	public Response getPersonList() {
		// System.out.println("ActorServiceEndpoint: getPersonList");	
		@SuppressWarnings("unchecked")
		List<ActorPerson> actorPersonList = TIMAATApp.emf.createEntityManager().createNamedQuery("ActorPerson.findAll").getResultList();
		List<Actor> actorList = new ArrayList<Actor>();
		for ( ActorPerson m : actorPersonList ) actorList.add(m.getActor());
		return Response.ok().entity(actorList).build();
	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("collective/list")
	public Response getCollectiveList() {
		// System.out.println("ActorServiceEndpoint: getCollectiveList");	
		@SuppressWarnings("unchecked")
		List<ActorCollective> actorCollectiveList = TIMAATApp.emf.createEntityManager().createNamedQuery("ActorCollective.findAll").getResultList();
		List<Actor> actorList = new ArrayList<Actor>();
		for ( ActorCollective actorCollective : actorCollectiveList ) actorList.add(actorCollective.getActor());
		return Response.ok().entity(actorList).build();
	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("{id}/names/list")
	public Response getNamesList(@PathParam("id") int id) {
		// // System.out.println("ActorServiceEndpoint: getNamesList");

		EntityManager entityManager = TIMAATApp.emf.createEntityManager();

		// find actor
		Actor actor = entityManager.find(Actor.class, id);
		if ( actor == null ) return Response.status(Status.NOT_FOUND).build();
		
		entityManager.refresh(actor);
		
		return Response.ok(actor.getActorNames()).build();
	}

	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("{id}")
	@Secured
	public Response createActor(@PathParam("id") int id, String jsonData) {
		System.out.println("ActorServiceEndpoint: createActor: " + jsonData);
		ObjectMapper mapper = new ObjectMapper();
		Actor newActor = null;  
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();  	

		// parse JSON data
		try {
			newActor = mapper.readValue(jsonData, Actor.class);
		} catch (IOException e) {
			System.out.println("ActorServiceEndpoint: createActor - IOException");
			e.printStackTrace();
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( newActor == null ) {
			System.out.println("ActorServiceEndpoint: createActor - newActor == 0");
			return Response.status(Status.BAD_REQUEST).build();
		}
		// sanitize object data
		newActor.setId(0);
		ActorName displayName = entityManager.find(ActorName.class, newActor.getDisplayName().getId());
		newActor.setDisplayName(displayName);

		// update log metadata
		Timestamp creationDate = new Timestamp(System.currentTimeMillis());
		newActor.setCreatedAt(creationDate);
		newActor.setLastEditedAt(creationDate);
		if ( containerRequestContext.getProperty("TIMAAT.userID") != null ) {
			// System.out.println("containerRequestContext.getProperty('TIMAAT.userID') " + containerRequestContext.getProperty("TIMAAT.userID"));
			newActor.setCreatedByUserAccount(entityManager.find(UserAccount.class, containerRequestContext.getProperty("TIMAAT.userID")));
			newActor.setLastEditedByUserAccount((entityManager.find(UserAccount.class, containerRequestContext.getProperty("TIMAAT.userID"))));
		} else {
			// DEBUG do nothing - production system should abort with internal server error
			return Response.serverError().build();
		}

		System.out.println("ActorServiceEndpoint: createActor - persist actor");
		// persist actor
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.persist(displayName);
		entityManager.persist(newActor);
		entityManager.flush();
		newActor.setDisplayName(displayName);
		entityTransaction.commit();
		entityManager.refresh(displayName);
		entityManager.refresh(newActor);

		// add log entry
		UserLogManager.getLogger().addLogEntry(newActor.getCreatedByUserAccount().getId(), UserLogManager.LogEvents.ACTORCREATED);
		System.out.println("ActorServiceEndpoint: createActor - done");
		return Response.ok().entity(newActor).build();
	}

	@PATCH
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("{id}")
	@Secured
	public Response updateActor(@PathParam("id") int id, String jsonData) {
		System.out.println("ActorServiceEndpoint: UPDATE ACTOR - jsonData"+ jsonData);
		ObjectMapper mapper = new ObjectMapper();
		Actor updatedActor = null;    	
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Actor actor = entityManager.find(Actor.class, id);

		if ( actor == null ) return Response.status(Status.NOT_FOUND).build();		
		// parse JSON data
		try {
			updatedActor = mapper.readValue(jsonData, Actor.class);
		} catch (IOException e) {
			System.out.println("ActorServiceEndpoint: UPDATE ACTOR - IOException");
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( updatedActor == null ) return Response.notModified().build();

    // update actor
    // if ( updatedActor.getName() != null ) actor.setName(updatedActor.getName());
		if ( updatedActor.getDisplayName() != null ) actor.setDisplayName(updatedActor.getDisplayName());
		actor.setBirthName(updatedActor.getBirthName()); // birthName can be set to null

		// update log metadata
		actor.setLastEditedAt(new Timestamp(System.currentTimeMillis()));
		if ( containerRequestContext.getProperty("TIMAAT.userID") != null ) {
			actor.setLastEditedByUserAccount((entityManager.find(UserAccount.class, containerRequestContext.getProperty("TIMAAT.userID"))));
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
		UserLogManager.getLogger()
									.addLogEntry((int) containerRequestContext
									.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.ACTOREDITED);
		System.out.println("ActorServiceEndpoint: UPDATE ACTOR - update complete");	
		return Response.ok().entity(actor).build();
	}

	@DELETE
	@Produces(MediaType.APPLICATION_JSON)
	@Path("{id}")
	@Secured
	public Response deleteActor(@PathParam("id") int id) {   
		System.out.println("ActorServiceEndpoint: deleteActor"); 	
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Actor actor = entityManager.find(Actor.class, id);

		if ( actor == null ) return Response.status(Status.NOT_FOUND).build();	

		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.remove(actor.getDisplayName());
		entityManager.remove(actor);
		entityTransaction.commit();

		// add log entry
		UserLogManager.getLogger()
									.addLogEntry((int) containerRequestContext
									.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.ACTORDELETED);
		System.out.println("ActorServiceEndpoint: deleteActor - delete complete");
		return Response.ok().build();
	}

	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("person/{id}")
	@Secured
	public Response createPerson(@PathParam("id") int id, String jsonData) {

		System.out.println("ActorServiceEndpoint: createPerson jsonData: "+jsonData);
		ObjectMapper mapper = new ObjectMapper();
		ActorPerson newPerson = null;
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();

		// parse JSON data
		try {
			newPerson = mapper.readValue(jsonData, ActorPerson.class);
		} catch (IOException e) {
			System.out.println("ActorServiceEndpoint: createPerson: IOException e !");
			e.printStackTrace();
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( newPerson == null ) {
			System.out.println("ActorServiceEndpoint: createPerson: newPerson == null !");
			return Response.status(Status.BAD_REQUEST).build();
		}
		// sanitize object data

		// update log metadata
		// Not necessary, a person will always be created in conjunction with a actor

		// persist person
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.persist(newPerson);
		entityManager.flush();
		entityTransaction.commit();
		entityManager.refresh(newPerson);
		entityManager.refresh(newPerson.getActor());

		// add log entry
		UserLogManager.getLogger()
									.addLogEntry(newPerson.getActor()
									.getCreatedByUserAccount().getId(), UserLogManager.LogEvents.PERSONCREATED);
		System.out.println("ActorServiceEndpoint: person created with id "+newPerson.getActorId());
		return Response.ok().entity(newPerson).build();
	}

	@PATCH
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("person/{id}")
	@Secured
	public Response updatePerson(@PathParam("id") int id, String jsonData) {

		System.out.println("ActorServiceEndpoint: UPDATE PERSON - jsonData: " + jsonData);
		ObjectMapper mapper = new ObjectMapper();
		ActorPerson updatedPerson = null;    	
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		ActorPerson person = entityManager.find(ActorPerson.class, id);
		
		if ( person == null ) return Response.status(Status.NOT_FOUND).build();		
		// parse JSON data
		try {
			updatedPerson = mapper.readValue(jsonData, ActorPerson.class);
		} catch (IOException e) {
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( updatedPerson == null ) return Response.notModified().build();    	
		
		// update person
		// System.out.println("ActorServiceEndpoint: UPDATE PERSON - person.id:"+person.getActorId());
		// if ( updatedPerson.getLength() > 0) person.setLength(updatedPerson.getLength());
		// if ( updatedPerson.getPersonCodecInformation() != null ) person.setPersonCodecInformation(updatedPerson.getPersonCodecInformation());
		
		// update log metadata
		person.getActor().setLastEditedAt(new Timestamp(System.currentTimeMillis()));
		if ( containerRequestContext.getProperty("TIMAAT.userID") != null ) {
			person.getActor().setLastEditedByUserAccount((entityManager.find(UserAccount.class, containerRequestContext.getProperty("TIMAAT.userID"))));
		} else {
			// DEBUG do nothing - production system should abort with internal server error			
		}		
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.merge(person);
		entityManager.persist(person);
		entityTransaction.commit();
		entityManager.refresh(person);

		// add log entry
		UserLogManager.getLogger()
									.addLogEntry((int) containerRequestContext
									.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.PERSONEDITED);
		System.out.println("ActorServiceEndpoint: UPDATE PERSON - update complete");	
		return Response.ok().entity(person).build();
	}

	@DELETE
	@Produces(MediaType.APPLICATION_JSON)
	@Path("person/{id}")
	@Secured
	public Response deletePerson(@PathParam("id") int id) {  
		System.out.println("ActorServiceEndpoint: deletePerson with id: "+ id);
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();

		Actor actor = entityManager.find(Actor.class, id);
		if ( actor == null ) return Response.status(Status.NOT_FOUND).build();
		ActorPerson person = entityManager.find(ActorPerson.class, id);
		if ( person == null ) return Response.status(Status.NOT_FOUND).build();

		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.remove(person);
		entityManager.remove(person.getActor().getDisplayName());
		entityManager.remove(person.getActor()); // remove person, then corresponding actor
		entityTransaction.commit();

		// add log entry
		UserLogManager.getLogger()
									.addLogEntry((int) containerRequestContext
									.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.PERSONDELETED);
		System.out.println("ActorServiceEndpoint: deletePerson - person deleted");  
		return Response.ok().build();
	}


	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("collective/{id}")
	@Secured
	public Response createCollective(@PathParam("id") int id, String jsonData) {

		System.out.println("ActorServiceEndpoint: createCollective jsonData: "+jsonData);
		ObjectMapper mapper = new ObjectMapper();
		ActorCollective newCollective = null;
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();

		// parse JSON data
		try {
			newCollective = mapper.readValue(jsonData, ActorCollective.class);
		} catch (IOException e) {
			System.out.println("ActorServiceEndpoint: createCollective: IOException e !");
			e.printStackTrace();
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( newCollective == null ) {
			System.out.println("ActorServiceEndpoint: createCollective: newCollective == null !");
			return Response.status(Status.BAD_REQUEST).build();
		}
		// sanitize object data

		// update log metadata
		// Not necessary, a collective will always be created in conjunction with a actor

		// persist collective
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.persist(newCollective);
		entityManager.flush();
		entityTransaction.commit();
		entityManager.refresh(newCollective);
		entityManager.refresh(newCollective.getActor());

		// add log entry
		UserLogManager.getLogger()
									.addLogEntry(newCollective.getActor().getCreatedByUserAccount().getId(), UserLogManager.LogEvents.COLLECTIVECREATED);
		System.out.println("ActorServiceEndpoint: collective created with id "+newCollective.getActorId());
		return Response.ok().entity(newCollective).build();
	}
	
	@PATCH
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("collective/{id}")
	@Secured
	public Response updateCollective(@PathParam("id") int id, String jsonData) {

		System.out.println("ActorServiceEndpoint: UPDATE COLLECTIVE - jsonData: " + jsonData);
		ObjectMapper mapper = new ObjectMapper();
		ActorCollective updatedCollective = null;    	
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		ActorCollective collective = entityManager.find(ActorCollective.class, id);
		
		if ( collective == null ) return Response.status(Status.NOT_FOUND).build();		
		// parse JSON data
		try {
			updatedCollective = mapper.readValue(jsonData, ActorCollective.class);
		} catch (IOException e) {
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( updatedCollective == null ) return Response.notModified().build();    	
		
		// update collective
		// System.out.println("ActorServiceEndpoint: UPDATE COLLECTIVE - collective.id:"+collective.getActorId());
		// if ( updatedCollective.getLength() > 0) collective.setLength(updatedCollective.getLength());
		// if ( updatedCollective.getCollectiveCodecInformation() != null ) collective.setCollectiveCodecInformation(updatedCollective.getCollectiveCodecInformation());
		
		// update log metadata
		collective.getActor().setLastEditedAt(new Timestamp(System.currentTimeMillis()));
		if ( containerRequestContext.getProperty("TIMAAT.userID") != null ) {
			collective.getActor().setLastEditedByUserAccount((entityManager.find(UserAccount.class, containerRequestContext.getProperty("TIMAAT.userID"))));
		} else {
			// DEBUG do nothing - production system should abort with internal server error			
		}		
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.merge(collective);
		entityManager.persist(collective);
		entityTransaction.commit();
		entityManager.refresh(collective);

		// add log entry
		UserLogManager.getLogger()
									.addLogEntry((int) containerRequestContext
									.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.COLLECTIVEEDITED);
		System.out.println("ActorServiceEndpoint: UPDATE COLLECTIVE - update complete");	
		return Response.ok().entity(collective).build();
	}

	@DELETE
	@Produces(MediaType.APPLICATION_JSON)
	@Path("collective/{id}")
	@Secured
	public Response deleteCollective(@PathParam("id") int id) {  
		System.out.println("ActorServiceEndpoint: deleteCollective with id: "+ id);
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();

		Actor actor = entityManager.find(Actor.class, id);
		if ( actor == null ) return Response.status(Status.NOT_FOUND).build();
		ActorCollective collective = entityManager.find(ActorCollective.class, id);
		if ( collective == null ) return Response.status(Status.NOT_FOUND).build();

		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.remove(collective);
		entityManager.remove(collective.getActor().getDisplayName());
		entityManager.remove(collective.getActor()); // remove collective, then corresponding actor
		entityTransaction.commit();

		// add log entry
		UserLogManager.getLogger()
									.addLogEntry((int) containerRequestContext
									.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.COLLECTIVEDELETED);
		System.out.println("ActorServiceEndpoint: deleteCollective - collective deleted");  
		return Response.ok().build();
	}

	@POST
  @Produces(MediaType.APPLICATION_JSON)
  @Consumes(MediaType.APPLICATION_JSON)
	@Path("name/{id}")
	@Secured
	public Response createName(@PathParam("actor_id") int actorId, @PathParam("id") int id, String jsonData) {

		System.out.println("ActorServiceEndpoint: createName: jsonData: "+jsonData);
		ObjectMapper mapper = new ObjectMapper();
		ActorName newName = null;
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		
		// parse JSON data
		try {
			newName = mapper.readValue(jsonData, ActorName.class);
		} catch (IOException e) {
			System.out.println("ActorServiceEndpoint: createName: IOException e !");
			e.printStackTrace();
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( newName == null ) {
			System.out.println("ActorServiceEndpoint: createName: newName == null !");
			return Response.status(Status.BAD_REQUEST).build();
		}
		// System.out.println("ActorServiceEndpoint: createName: language id: "+newName.getLanguage().getId());
		// sanitize object data
		newName.setId(0);
		// Language language = entityManager.find(Language.class, newName.getLanguage().getId());
		// newName.setLanguage(language);

		// update log metadata
		// Not necessary, a name will always be created in conjunction with a actor
		System.out.println("ActorServiceEndpoint: createName: persist name");

		// persist name
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		// entityManager.persist(language);
		entityManager.persist(newName);
		entityManager.flush();
		// newName.setLanguage(language);
		entityTransaction.commit();
		entityManager.refresh(newName);
		// entityManager.refresh(language);

		// System.out.println("ActorServiceEndpoint: createName: add log entry");	
		// add log entry
		UserLogManager.getLogger()
									// .addLogEntry(newName.getActor().getCreatedByUserAccount().getId(), UserLogManager.LogEvents.ACTORNAMECREATED);
									.addLogEntry((int) containerRequestContext
									.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.ACTORNAMECREATED);
		
		System.out.println("ActorServiceEndpoint: create name: name created with id "+newName.getId());
		// System.out.println("ActorServiceEndpoint: create name: name created with language id "+newName.getLanguage().getId());

		return Response.ok().entity(newName).build();
	}

	@POST
  @Produces(MediaType.APPLICATION_JSON)
  @Consumes(MediaType.APPLICATION_JSON)
	@Path("{actorid}/name/{id}")
	@Secured
	public Response addName(@PathParam("actorid") int actorId, @PathParam("id") int id, String jsonData) {

		System.out.println("ActorServiceEndpoint: addName: jsonData: "+jsonData);
		ObjectMapper mapper = new ObjectMapper();
		ActorName newName = null;
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		
		// parse JSON data
		try {
			newName = mapper.readValue(jsonData, ActorName.class);
		} catch (IOException e) {
			System.out.println("ActorServiceEndpoint: addName: IOException e !");
			e.printStackTrace();
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( newName == null ) {
			System.out.println("ActorServiceEndpoint: addName: newName == null !");
			return Response.status(Status.BAD_REQUEST).build();
		}
		// System.out.println("ActorServiceEndpoint: addName: name: "+newName.getName());
		// sanitize object data
		newName.setId(0);
		// Language language = entityManager.find(Language.class, newName.getLanguage().getId());
		// newName.setLanguage(language);
		// Actor actor = entityManager.find(Actor.class, actorId);

		// update log metadata
		// Not necessary, a name will always be created in conjunction with a actor
		System.out.println("ActorServiceEndpoint: addName: persist name");

		// persist name
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		// entityManager.persist(language);
		entityManager.persist(newName);
		entityManager.flush();
		// newName.setLanguage(language);
		entityTransaction.commit();
		entityManager.refresh(newName);
		// entityManager.refresh(language);

		// create actor_has_name-table entries
		// entityTransaction.begin();
		// actor.getActorNames().add(newName);
		// newName.getActors3().add(actor);
		// entityManager.merge(newName);
		// entityManager.merge(actor);
		// entityManager.persist(newName);
		// entityManager.persist(actor);
		// entityTransaction.commit();
		// entityManager.refresh(actor);
		// entityManager.refresh(newName);

		System.out.println("ActorServiceEndpoint: addName: add log entry");	
		// add log entry
		UserLogManager.getLogger()
									// .addLogEntry(newName.getActor().getCreatedByUserAccount().getId(), UserLogManager.LogEvents.ACTORNAMECREATED);
									.addLogEntry((int) containerRequestContext
									.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.ACTORNAMECREATED);

		System.out.println("ActorServiceEndpoint: addName: name added with id "+newName.getId());
		// System.out.println("ActorServiceEndpoint: addName: name added with language id "+newName.getLanguage().getId());

		return Response.ok().entity(newName).build();
	}

	@PATCH
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("name/{id}")
	@Secured
	public Response updateName(@PathParam("id") int id, String jsonData) {
		System.out.println("ActorServiceEndpoint: UPDATE NAME - jsonData: " + jsonData);
		ObjectMapper mapper = new ObjectMapper();
		ActorName updatedName = null;    	
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		ActorName name = entityManager.find(ActorName.class, id);
		if ( name == null ) return Response.status(Status.NOT_FOUND).build();
		// System.out.println("ActorServiceEndpoint: UPDATE NAME - old name :"+name.getName());		
		// parse JSON data
		try {
			updatedName = mapper.readValue(jsonData, ActorName.class);
		} catch (IOException e) {
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( updatedName == null ) return Response.notModified().build();
		// update name
		// System.out.println("ActorServiceEndpoint: UPDATE NAME - language id:"+updatedName.getLanguage().getId());	
		if ( updatedName.getName() != null ) name.setName(updatedName.getName());
		// if ( updatedName.getLanguage() != null ) name.setLanguage(updatedName.getLanguage());

		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.merge(name);
		entityManager.persist(name);
		entityTransaction.commit();
		entityManager.refresh(name);

		// System.out.println("ActorServiceEndpoint: UPDATE NAME - only logging remains");	
		// add log entry
		UserLogManager.getLogger()
									.addLogEntry((int) containerRequestContext
									.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.ACTORNAMEEDITED);
		System.out.println("ActorServiceEndpoint: UPDATE NAME - update complete");	
		return Response.ok().entity(name).build();
	}

	@DELETE
	@Produces(MediaType.APPLICATION_JSON)
	@Path("name/{id}")
	@Secured
	public Response deleteName(@PathParam("id") int id) {    
		System.out.println("ActorServiceEndpoint: deleteName");	
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();

		ActorName name = entityManager.find(ActorName.class, id);
		if ( name == null ) return Response.status(Status.NOT_FOUND).build();

		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.remove(name);
		entityTransaction.commit();
		// add log entry
		UserLogManager.getLogger()
									.addLogEntry((int) containerRequestContext
									.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.ACTORNAMEDELETED);
		System.out.println("ActorServiceEndpoint: deleteName - delete complete");	
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

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("{id}")
	public Response getActorInfo(@PathParam("id") int id) {    	
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Actor e = entityManager.find(Actor.class, id);
		if ( e == null ) return Response.status(Status.NOT_FOUND).build();    	    	
	return Response.ok().entity(e).build();
	}
	
}
