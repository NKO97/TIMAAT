package de.bitgilde.TIMAAT.rest;

import java.io.IOException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Collection;
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
import de.bitgilde.TIMAAT.model.FIPOP.ActorPersonTranslation;
import de.bitgilde.TIMAAT.model.FIPOP.ActorType;
import de.bitgilde.TIMAAT.model.FIPOP.Address;
import de.bitgilde.TIMAAT.model.FIPOP.EmailAddress;
import de.bitgilde.TIMAAT.model.FIPOP.Language;
import de.bitgilde.TIMAAT.model.FIPOP.PhoneNumber;
import de.bitgilde.TIMAAT.model.FIPOP.Sex;
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
		System.out.println("ActorServiceEndpoint: getActorList");			
		List<Actor> actorList = castList(Actor.class, TIMAATApp.emf.createEntityManager().createNamedQuery("Actor.findAll").getResultList());
		
		//? Working or necessary?
		// for (Actor actor : actorList) {
		// 		List<ActorName> actorNamesList = actor.getActorNames();
		// 	 for (ActorName actorName : actorNamesList) {
		// 			if (actorName.getIsDisplayName()) {
		// 				actor.setDisplayName(actorName);
		// 				break;
		// 			}
		// 	 }
		// }
		return Response.ok().entity(actorList).build();
	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("actortype/list")
	public Response getActortypeList() {
		// System.out.println("ActorServiceEndpoint: getActorTypeList");		
		List<ActorType> actorTypeList = castList(ActorType.class, TIMAATApp.emf.createEntityManager().createNamedQuery("ActorType.findAll").getResultList());
		return Response.ok().entity(actorTypeList).build();
	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("person/list")
	public Response getPersonList() {
		System.out.println("ActorServiceEndpoint: getPersonList");	
		List<ActorPerson> actorPersonList = castList(ActorPerson.class, TIMAATApp.emf.createEntityManager().createNamedQuery("ActorPerson.findAll").getResultList());
		List<Actor> actorList = new ArrayList<Actor>();
		for ( ActorPerson m : actorPersonList ) {
			actorList.add(m.getActor());
		}
		return Response.ok().entity(actorList).build();
	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("collective/list")
	public Response getCollectiveList() {
		System.out.println("ActorServiceEndpoint: getCollectiveList");	
		List<ActorCollective> actorCollectiveList = castList(ActorCollective.class, TIMAATApp.emf.createEntityManager().createNamedQuery("ActorCollective.findAll").getResultList());
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
			System.out.println("ActorServiceEndpoint: createActor - newActor == null");
			return Response.status(Status.BAD_REQUEST).build();
		}
		// sanitize object data
		newActor.setId(0);

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

		// persist actor
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.persist(newActor);
		entityManager.flush();
		entityTransaction.commit();
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
		if (updatedActor.getIsFictional() != null ) actor.setIsFictional(updatedActor.getIsFictional());
		if (updatedActor.getBirthName() != null ) actor.setBirthName(updatedActor.getBirthName());

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
		// entityManager.remove(actor.getDisplayName());
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

		System.out.println("ActorServiceEndpoint: createPerson sanitize object data");
		// sanitize object data
		// TODO link to locations
		// Location placeOfBirth = entityManager.find(Location.class, newPerson.getPlaceOfBirth().getId());
		// Location placeOfDeath = entityManager.find(Location.class, newPerson.getPlaceOfDeath().getId());
		Sex sex = entityManager.find(Sex.class, newPerson.getSex().getId());
		newPerson.setSex(sex);

		// update log metadata
		// Not necessary, a person will always be created in conjunction with an actor

		System.out.println("ActorServiceEndpoint: createPerson persist person");
		// persist person
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		// entityManager.persist(placeOfBirth);
		// entityManager.persist(placeOfDeath);
		// entityManager.persist(sex);
		entityManager.persist(newPerson);
		entityManager.flush();
		entityTransaction.commit();
		entityManager.refresh(newPerson);
		// entityManager.refresh(sex);
		// entityManager.refresh(placeOfBirth);
		// entityManager.refresh(placeOfDeath);
		entityManager.refresh(newPerson.getActor());

		System.out.println("ActorServiceEndpoint: createPerson add log entry");
		// add log entry
		UserLogManager.getLogger()
									.addLogEntry((int) containerRequestContext.getProperty("TIMAAT.userID"), 
																UserLogManager.LogEvents.PERSONCREATED);
		System.out.println("ActorServiceEndpoint: person created with id "+newPerson.getActorId());
		return Response.ok().entity(newPerson).build();
	}

	@PATCH
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("person/{id}")
	@Secured
	public Response updatePerson(@PathParam("id") int id, String jsonData) {

		System.out.println("ActorServiceEndpoint: updatePerson jsonData: " + jsonData);
		ObjectMapper mapper = new ObjectMapper();
		ActorPerson updatedPerson = null;    	
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		ActorPerson person = entityManager.find(ActorPerson.class, id);
		
		if ( person == null ) return Response.status(Status.NOT_FOUND).build();		
		// parse JSON data
		try {
			updatedPerson = mapper.readValue(jsonData, ActorPerson.class);
		} catch (IOException e) {
			System.out.println("ActorServiceEndpoint: updatePerson - IOException");
			e.printStackTrace();
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( updatedPerson == null ) {
			System.out.println("ActorServiceEndpoint: updatePerson - updatedPerson == null");
			return Response.notModified().build();   
		} 	
		
		// update person
		System.out.println("ActorServiceEndpoint: updatePerson update data");
		person.setTitle(updatedPerson.getTitle());
		person.setDateOfBirth(updatedPerson.getDateOfBirth());
		// TODO update place of birth
		person.setDayOfDeath(updatedPerson.getDayOfDeath());
		// TODO update place of death
		if ( updatedPerson.getSex() != null) person.setSex(updatedPerson.getSex());
		// TODO update person is member of collective
		// TODO update person translations -> special features

		System.out.println("ActorServiceEndpoint: updatePerson update log entry");
		// update log metadata
		person.getActor().setLastEditedAt(new Timestamp(System.currentTimeMillis()));
		if ( containerRequestContext.getProperty("TIMAAT.userID") != null ) {
			person.getActor().setLastEditedByUserAccount((entityManager.find(UserAccount.class, containerRequestContext.getProperty("TIMAAT.userID"))));
		} else {
			// DEBUG do nothing - production system should abort with internal server error			
		}

		System.out.println("ActorServiceEndpoint: updatePerson persist person");
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.merge(person);
		entityManager.persist(person);
		entityTransaction.commit();
		entityManager.refresh(person);

		// add log entry
		UserLogManager.getLogger()
									.addLogEntry((int) containerRequestContext.getProperty("TIMAAT.userID"), 
																UserLogManager.LogEvents.PERSONEDITED);
		System.out.println("ActorServiceEndpoint: updatePerson - update complete");	
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
		// entityManager.remove(person.getActor().getDisplayName());
		entityManager.remove(person.getActor()); // remove person, then corresponding actor
		entityTransaction.commit();

		// add log entry
		UserLogManager.getLogger()
									.addLogEntry((int) containerRequestContext.getProperty("TIMAAT.userID"), 
																UserLogManager.LogEvents.PERSONDELETED);
		System.out.println("ActorServiceEndpoint: deletePerson - person deleted");  
		return Response.ok().build();
	}

	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Secured
	@Path("{person_id}/translation/{id}")
	public Response createPersonTranslation(@PathParam("person_id") int personId, @PathParam("id") int id, String jsonData) {
		
		System.out.println("PersonEndpoint: createPersonTranslation jsonData: "+jsonData);
		ObjectMapper mapper = new ObjectMapper();
		ActorPersonTranslation newTranslation = null;
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		ActorPerson person = entityManager.find(ActorPerson.class, personId);

		if ( person == null ) return Response.status(Status.NOT_FOUND).build();
		// parse JSON data
		try {
			newTranslation = mapper.readValue(jsonData, ActorPersonTranslation.class);
		} catch (IOException e) {
			e.printStackTrace();
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( newTranslation == null ) return Response.status(Status.BAD_REQUEST).build();

		// sanitize object data
		newTranslation.setId(0);
		newTranslation.setActorPerson(person);
		Language language = entityManager.find(Language.class, newTranslation.getLanguage().getId());
		newTranslation.setLanguage(language);
		person.addActorPersonTranslation(newTranslation);

		// persist personTranslation and person
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.persist(newTranslation);
		entityManager.flush();
		newTranslation.setActorPerson(person);
		entityManager.persist(person);
		entityTransaction.commit();
		entityManager.refresh(newTranslation);
		entityManager.refresh(person);
		
		// add log entry
		UserLogManager.getLogger().addLogEntry((int) containerRequestContext.getProperty("TIMAAT.userID"), 
																						UserLogManager.LogEvents.PERSONCREATED); // TODO own log person required?
		System.out.println("PersonEndpoint: person translation created with id "+newTranslation.getId());

		return Response.ok().entity(newTranslation).build();

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
		// entityManager.remove(collective.getActor().getDisplayName());
		entityManager.remove(collective.getActor()); // remove collective, then corresponding actor
		entityTransaction.commit();

		// add log entry
		UserLogManager.getLogger()
									.addLogEntry((int) containerRequestContext
									.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.COLLECTIVEDELETED);
		System.out.println("ActorServiceEndpoint: deleteCollective - collective deleted");  
		return Response.ok().build();
	}

	// Currently not in use
	@POST
  @Produces(MediaType.APPLICATION_JSON)
  @Consumes(MediaType.APPLICATION_JSON)
	@Path("name/{id}")
	@Secured
	public Response createName(@PathParam("actor_id") int actorId, @PathParam("id") int id, String jsonData) { // TODO actorId not be existant here, yet

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
		// System.out.println("ActorServiceEndpoint: createName: language id: "+newName.getActor().getId());
		// sanitize object data
		newName.setId(0);
		Actor actor = entityManager.find(Actor.class, newName.getActor().getId());
		newName.setActor(actor);

		// update log metadata
		// Not necessary, a name will always be created in conjunction with a actor
		System.out.println("ActorServiceEndpoint: createName: persist name");

		// persist name
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.persist(newName);
		actor.getActorNames().add(newName);
		entityManager.persist(actor);
		entityManager.flush();
		newName.setActor(actor);
		entityTransaction.commit();
		entityManager.refresh(newName);
		entityManager.refresh(actor);

		System.out.println("ActorServiceEndpoint: createName: add log entry");	
		// add log entry
		UserLogManager.getLogger()
									// .addLogEntry(newName.getActor().getCreatedByUserAccount().getId(), UserLogManager.LogEvents.ACTORNAMECREATED);
									.addLogEntry((int) containerRequestContext.getProperty("TIMAAT.userID"), 
																UserLogManager.LogEvents.ACTORNAMECREATED);
		
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
		Actor actor = entityManager.find(Actor.class, actorId);
		newName.setActor(actor);

		// update log metadata
		// Not necessary, a name will always be created in conjunction with a actor
		System.out.println("ActorServiceEndpoint: addName: persist name");

		// persist name
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.persist(actor);
		entityManager.persist(newName);
		entityManager.flush();
		newName.setActor(actor);
		entityTransaction.commit();
		entityManager.refresh(newName);
		entityManager.refresh(actor);

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
									.addLogEntry((int) containerRequestContext.getProperty("TIMAAT.userID"), 
																UserLogManager.LogEvents.ACTORNAMECREATED);

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
		if ( updatedName.getIsDisplayName() != null) name.setIsDisplayName(updatedName.getIsDisplayName());
		name.setUsedFrom(updatedName.getUsedFrom());
		name.setUsedUntil(updatedName.getUsedUntil());

		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.merge(name);
		entityManager.persist(name);
		entityTransaction.commit();
		entityManager.refresh(name);

		// System.out.println("ActorServiceEndpoint: UPDATE NAME - only logging remains");	
		// add log entry
		UserLogManager.getLogger()
									.addLogEntry((int) containerRequestContext.getProperty("TIMAAT.userID"), 
																UserLogManager.LogEvents.ACTORNAMEEDITED);
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

	@POST
  @Produces(MediaType.APPLICATION_JSON)
  @Consumes(MediaType.APPLICATION_JSON)
	@Path("address/{id}")
	@Secured
	public Response createAddress(@PathParam("actor_id") int actorId, @PathParam("id") int id, String jsonData) {

		System.out.println("ActorServiceEndpoint: createAddress: jsonData: "+jsonData);
		ObjectMapper mapper = new ObjectMapper();
		Address newAddress = null;
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		
		// parse JSON data
		try {
			newAddress = mapper.readValue(jsonData, Address.class);
		} catch (IOException e) {
			System.out.println("ActorServiceEndpoint: createAddress: IOException e !");
			e.printStackTrace();
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( newAddress == null ) {
			System.out.println("ActorServiceEndpoint: createAddress: newAddress == null !");
			return Response.status(Status.BAD_REQUEST).build();
		}
		// System.out.println("ActorServiceEndpoint: createAddress: language id: "+newAddress.getLanguage().getId());
		// sanitize object data
		newAddress.setId(0);

		// update log metadata
		// Not necessary, a address will always be created in conjunction with a actor
		System.out.println("ActorServiceEndpoint: createAddress: persist address");

		// persist address
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.persist(newAddress);
		entityManager.flush();
		entityTransaction.commit();
		entityManager.refresh(newAddress);

		// System.out.println("ActorServiceEndpoint: createAddress: add log entry");	
		// add log entry
		UserLogManager.getLogger()
									// .addLogEntry(newAddress.getActor().getCreatedByUserAccount().getId(), UserLogManager.LogEvents.ADDRESSCREATED);
									.addLogEntry((int) containerRequestContext
									.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.ADDRESSCREATED);
		
		System.out.println("ActorServiceEndpoint: create address: address created with id "+newAddress.getId());
		// System.out.println("ActorServiceEndpoint: create address: address created with language id "+newAddress.getLanguage().getId());

		return Response.ok().entity(newAddress).build();
	}

	@POST
  @Produces(MediaType.APPLICATION_JSON)
  @Consumes(MediaType.APPLICATION_JSON)
	@Path("{actorid}/address/{id}")
	@Secured
	public Response addAddress(@PathParam("actorid") int actorId, @PathParam("id") int id, String jsonData) {

		System.out.println("ActorServiceEndpoint: addAddress: jsonData: "+jsonData);
		ObjectMapper mapper = new ObjectMapper();
		Address newAddress = null;
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		
		// parse JSON data
		try {
			newAddress = mapper.readValue(jsonData, Address.class);
		} catch (IOException e) {
			System.out.println("ActorServiceEndpoint: addAddress: IOException e !");
			e.printStackTrace();
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( newAddress == null ) {
			System.out.println("ActorServiceEndpoint: addAddress: newAddress == null !");
			return Response.status(Status.BAD_REQUEST).build();
		}
		// System.out.println("ActorServiceEndpoint: addAddress: address: "+newAddress.getAddress());
		// sanitize object data
		newAddress.setId(0);
		// Language language = entityManager.find(Language.class, newAddress.getLanguage().getId());
		// newAddress.setLanguage(language);
		// Actor actor = entityManager.find(Actor.class, actorId);

		// update log metadata
		// Not necessary, a address will always be created in conjunction with a actor
		System.out.println("ActorServiceEndpoint: addAddress: persist address");

		// persist address
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		// entityManager.persist(language);
		entityManager.persist(newAddress);
		entityManager.flush();
		// newAddress.setLanguage(language);
		entityTransaction.commit();
		entityManager.refresh(newAddress);
		// entityManager.refresh(language);

		// create actor_has_address-table entries
		// entityTransaction.begin();
		// actor.getAddresss().add(newAddress);
		// newAddress.getActors3().add(actor);
		// entityManager.merge(newAddress);
		// entityManager.merge(actor);
		// entityManager.persist(newAddress);
		// entityManager.persist(actor);
		// entityTransaction.commit();
		// entityManager.refresh(actor);
		// entityManager.refresh(newAddress);

		System.out.println("ActorServiceEndpoint: addAddress: add log entry");	
		// add log entry
		UserLogManager.getLogger()
									// .addLogEntry(newAddress.getActor().getCreatedByUserAccount().getId(), UserLogManager.LogEvents.ADDRESSCREATED);
									.addLogEntry((int) containerRequestContext
									.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.ADDRESSCREATED);

		System.out.println("ActorServiceEndpoint: addAddress: address added with id "+newAddress.getId());
		// System.out.println("ActorServiceEndpoint: addAddress: address added with language id "+newAddress.getLanguage().getId());

		return Response.ok().entity(newAddress).build();
	}

	@PATCH
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("address/{id}")
	@Secured
	public Response updateAddress(@PathParam("id") int id, String jsonData) {
		System.out.println("ActorServiceEndpoint: UPDATE ADDRESS - jsonData: " + jsonData);
		ObjectMapper mapper = new ObjectMapper();
		Address updatedAddress = null;    	
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Address address = entityManager.find(Address.class, id);
		if ( address == null ) return Response.status(Status.NOT_FOUND).build();
		// System.out.println("ActorServiceEndpoint: UPDATE ADDRESS - old address :"+address.getAddress());		
		// parse JSON data
		try {
			updatedAddress = mapper.readValue(jsonData, Address.class);
		} catch (IOException e) {
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( updatedAddress == null ) return Response.notModified().build();
		// update address
		if ( updatedAddress.getPostOfficeBox() != null ) address.setPostOfficeBox(updatedAddress.getPostOfficeBox());
		if ( updatedAddress.getPostalCode() != null ) address.setPostalCode(updatedAddress.getPostalCode());
		if ( updatedAddress.getStreetAddressAddition() != null ) address.setStreetAddressAddition(updatedAddress.getStreetAddressAddition());
		if ( updatedAddress.getStreetAddressNumber() != null ) address.setStreetAddressNumber(updatedAddress.getStreetAddressNumber());
		if ( updatedAddress.getStreet() != null ) address.setStreet(updatedAddress.getStreet());

		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.merge(address);
		entityManager.persist(address);
		entityTransaction.commit();
		entityManager.refresh(address);

		// System.out.println("ActorServiceEndpoint: UPDATE ADDRESS - only logging remains");	
		// add log entry
		UserLogManager.getLogger()
									.addLogEntry((int) containerRequestContext
									.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.ADDRESSEDITED);
		System.out.println("ActorServiceEndpoint: UPDATE ADDRESS - update complete");	
		return Response.ok().entity(address).build();
	}

	@DELETE
	@Produces(MediaType.APPLICATION_JSON)
	@Path("address/{id}")
	@Secured
	public Response deleteAddress(@PathParam("id") int id) {    
		System.out.println("ActorServiceEndpoint: deleteAddress");	
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();

		Address address = entityManager.find(Address.class, id);
		if ( address == null ) return Response.status(Status.NOT_FOUND).build();

		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.remove(address);
		entityTransaction.commit();
		// add log entry
		UserLogManager.getLogger()
									.addLogEntry((int) containerRequestContext
									.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.ADDRESSDELETED);
		System.out.println("ActorServiceEndpoint: deleteAddress - delete complete");	
		return Response.ok().build();
	}

	@POST
  @Produces(MediaType.APPLICATION_JSON)
  @Consumes(MediaType.APPLICATION_JSON)
	@Path("emailaddress/{id}")
	@Secured
	public Response createEmailAddress(@PathParam("actor_id") int actorId, @PathParam("id") int id, String jsonData) {

		System.out.println("ActorServiceEndpoint: createEmailAddress: jsonData: "+jsonData);
		ObjectMapper mapper = new ObjectMapper();
		EmailAddress newEmailAddress = null;
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		
		// parse JSON data
		try {
			newEmailAddress = mapper.readValue(jsonData, EmailAddress.class);
		} catch (IOException e) {
			System.out.println("ActorServiceEndpoint: createEmailAddress: IOException e !");
			e.printStackTrace();
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( newEmailAddress == null ) {
			System.out.println("ActorServiceEndpoint: createEmailAddress: newEmailAddress == null !");
			return Response.status(Status.BAD_REQUEST).build();
		}
		// System.out.println("ActorServiceEndpoint: createEmailAddress: language id: "+newEmailAddress.getLanguage().getId());
		// sanitize object data
		newEmailAddress.setId(0);

		// update log metadata
		// Not necessary, a emailaddress will always be created in conjunction with a actor
		System.out.println("ActorServiceEndpoint: createEmailAddress: persist emailaddress");

		// persist emailaddress
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.persist(newEmailAddress);
		entityManager.flush();
		entityTransaction.commit();
		entityManager.refresh(newEmailAddress);

		// System.out.println("ActorServiceEndpoint: createEmailAddress: add log entry");	
		// add log entry
		UserLogManager.getLogger()
									// .addLogEntry(newEmailAddress.getActor().getCreatedByUserAccount().getId(), UserLogManager.LogEvents.EMAILCREATED);
									.addLogEntry((int) containerRequestContext
									.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.EMAILCREATED);
		
		System.out.println("ActorServiceEndpoint: create emailaddress: emailaddress created with id "+newEmailAddress.getId());
		// System.out.println("ActorServiceEndpoint: create emailaddress: emailaddress created with language id "+newEmailAddress.getLanguage().getId());

		return Response.ok().entity(newEmailAddress).build();
	}

	@POST
  @Produces(MediaType.APPLICATION_JSON)
  @Consumes(MediaType.APPLICATION_JSON)
	@Path("{actorid}/emailaddress/{id}")
	@Secured
	public Response addEmailAddress(@PathParam("actorid") int actorId, @PathParam("id") int id, String jsonData) {

		System.out.println("ActorServiceEndpoint: addEmailAddress: jsonData: "+jsonData);
		ObjectMapper mapper = new ObjectMapper();
		EmailAddress newEmailAddress = null;
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		
		// parse JSON data
		try {
			newEmailAddress = mapper.readValue(jsonData, EmailAddress.class);
		} catch (IOException e) {
			System.out.println("ActorServiceEndpoint: addEmailAddress: IOException e !");
			e.printStackTrace();
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( newEmailAddress == null ) {
			System.out.println("ActorServiceEndpoint: addEmailAddress: newEmailAddress == null !");
			return Response.status(Status.BAD_REQUEST).build();
		}
		// System.out.println("ActorServiceEndpoint: addEmailAddress: emailaddress: "+newEmailAddress.getEmailAddress());
		// sanitize object data
		newEmailAddress.setId(0);
		// Language language = entityManager.find(Language.class, newEmailAddress.getLanguage().getId());
		// newEmailAddress.setLanguage(language);
		// Actor actor = entityManager.find(Actor.class, actorId);

		// update log metadata
		// Not necessary, a emailaddress will always be created in conjunction with a actor
		System.out.println("ActorServiceEndpoint: addEmailAddress: persist emailaddress");

		// persist emailaddress
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		// entityManager.persist(language);
		entityManager.persist(newEmailAddress);
		entityManager.flush();
		// newEmailAddress.setLanguage(language);
		entityTransaction.commit();
		entityManager.refresh(newEmailAddress);
		// entityManager.refresh(language);

		// create actor_has_emailaddress-table entries
		// entityTransaction.begin();
		// actor.getEmailAddresss().add(newEmailAddress);
		// newEmailAddress.getActors3().add(actor);
		// entityManager.merge(newEmailAddress);
		// entityManager.merge(actor);
		// entityManager.persist(newEmailAddress);
		// entityManager.persist(actor);
		// entityTransaction.commit();
		// entityManager.refresh(actor);
		// entityManager.refresh(newEmailAddress);

		System.out.println("ActorServiceEndpoint: addEmailAddress: add log entry");	
		// add log entry
		UserLogManager.getLogger()
									// .addLogEntry(newEmailAddress.getActor().getCreatedByUserAccount().getId(), UserLogManager.LogEvents.EMAILCREATED);
									.addLogEntry((int) containerRequestContext
									.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.EMAILCREATED);

		System.out.println("ActorServiceEndpoint: addEmailAddress: emailaddress added with id "+newEmailAddress.getId());
		// System.out.println("ActorServiceEndpoint: addEmailAddress: emailaddress added with language id "+newEmailAddress.getLanguage().getId());

		return Response.ok().entity(newEmailAddress).build();
	}

	@PATCH
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("emailaddress/{id}")
	@Secured
	public Response updateEmailAddress(@PathParam("id") int id, String jsonData) {
		System.out.println("ActorServiceEndpoint: UPDATE EMAILADDRESS - jsonData: " + jsonData);
		ObjectMapper mapper = new ObjectMapper();
		EmailAddress updatedEmailAddress = null;    	
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		EmailAddress emailAddress = entityManager.find(EmailAddress.class, id);
		if ( emailAddress == null ) return Response.status(Status.NOT_FOUND).build();
		// System.out.println("ActorServiceEndpoint: UPDATE EMAILADDRESS - old emailaddress :"+emailaddress.getEmailAddress());		
		// parse JSON data
		try {
			updatedEmailAddress = mapper.readValue(jsonData, EmailAddress.class);
		} catch (IOException e) {
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( updatedEmailAddress == null ) return Response.notModified().build();
		// update emailaddress
		if ( updatedEmailAddress.getEmail() != null ) emailAddress.setEmail(updatedEmailAddress.getEmail());

		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.merge(emailAddress);
		entityManager.persist(emailAddress);
		entityTransaction.commit();
		entityManager.refresh(emailAddress);

		// System.out.println("ActorServiceEndpoint: UPDATE EMAILADDRESS - only logging remains");	
		// add log entry
		UserLogManager.getLogger()
									.addLogEntry((int) containerRequestContext
									.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.EMAILEDITED);
		System.out.println("ActorServiceEndpoint: UPDATE EMAILADDRESS - update complete");	
		return Response.ok().entity(emailAddress).build();
	}

	@DELETE
	@Produces(MediaType.APPLICATION_JSON)
	@Path("emailaddress/{id}")
	@Secured
	public Response deleteEmailAddress(@PathParam("id") int id) {    
		System.out.println("ActorServiceEndpoint: deleteEmailAddress");	
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();

		EmailAddress emailAddress = entityManager.find(EmailAddress.class, id);
		if ( emailAddress == null ) return Response.status(Status.NOT_FOUND).build();

		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.remove(emailAddress);
		entityTransaction.commit();
		// add log entry
		UserLogManager.getLogger()
									.addLogEntry((int) containerRequestContext
									.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.EMAILDELETED);
		System.out.println("ActorServiceEndpoint: deleteEmailAddress - delete complete");	
		return Response.ok().build();
	}

	@POST
  @Produces(MediaType.APPLICATION_JSON)
  @Consumes(MediaType.APPLICATION_JSON)
	@Path("phonenumber/{id}")
	@Secured
	public Response createPhoneNumber(@PathParam("actor_id") int actorId, @PathParam("id") int id, String jsonData) {

		System.out.println("ActorServiceEndpoint: createPhoneNumber: jsonData: "+jsonData);
		ObjectMapper mapper = new ObjectMapper();
		PhoneNumber newPhoneNumber = null;
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		
		// parse JSON data
		try {
			newPhoneNumber = mapper.readValue(jsonData, PhoneNumber.class);
		} catch (IOException e) {
			System.out.println("ActorServiceEndpoint: createPhoneNumber: IOException e !");
			e.printStackTrace();
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( newPhoneNumber == null ) {
			System.out.println("ActorServiceEndpoint: createPhoneNumber: newPhoneNumber == null !");
			return Response.status(Status.BAD_REQUEST).build();
		}
		// System.out.println("ActorServiceEndpoint: createPhoneNumber: language id: "+newPhoneNumber.getLanguage().getId());
		// sanitize object data
		newPhoneNumber.setId(0);

		// update log metadata
		// Not necessary, a phonenumber will always be created in conjunction with a actor
		System.out.println("ActorServiceEndpoint: createPhoneNumber: persist phonenumber");

		// persist phonenumber
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.persist(newPhoneNumber);
		entityManager.flush();
		entityTransaction.commit();
		entityManager.refresh(newPhoneNumber);

		// System.out.println("ActorServiceEndpoint: createPhoneNumber: add log entry");	
		// add log entry
		UserLogManager.getLogger()
									// .addLogEntry(newPhoneNumber.getActor().getCreatedByUserAccount().getId(), UserLogManager.LogEvents.EMAILCREATED);
									.addLogEntry((int) containerRequestContext
									.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.EMAILCREATED);
		
		System.out.println("ActorServiceEndpoint: create phonenumber: phonenumber created with id "+newPhoneNumber.getId());
		// System.out.println("ActorServiceEndpoint: create phonenumber: phonenumber created with language id "+newPhoneNumber.getLanguage().getId());

		return Response.ok().entity(newPhoneNumber).build();
	}

	@POST
  @Produces(MediaType.APPLICATION_JSON)
  @Consumes(MediaType.APPLICATION_JSON)
	@Path("{actorid}/phonenumber/{id}")
	@Secured
	public Response addPhoneNumber(@PathParam("actorid") int actorId, @PathParam("id") int id, String jsonData) {

		System.out.println("ActorServiceEndpoint: addPhoneNumber: jsonData: "+jsonData);
		ObjectMapper mapper = new ObjectMapper();
		PhoneNumber newPhoneNumber = null;
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		
		// parse JSON data
		try {
			newPhoneNumber = mapper.readValue(jsonData, PhoneNumber.class);
		} catch (IOException e) {
			System.out.println("ActorServiceEndpoint: addPhoneNumber: IOException e !");
			e.printStackTrace();
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( newPhoneNumber == null ) {
			System.out.println("ActorServiceEndpoint: addPhoneNumber: newPhoneNumber == null !");
			return Response.status(Status.BAD_REQUEST).build();
		}
		// System.out.println("ActorServiceEndpoint: addPhoneNumber: phonenumber: "+newPhoneNumber.getPhoneNumber());
		// sanitize object data
		newPhoneNumber.setId(0);
		// Language language = entityManager.find(Language.class, newPhoneNumber.getLanguage().getId());
		// newPhoneNumber.setLanguage(language);
		// Actor actor = entityManager.find(Actor.class, actorId);

		// update log metadata
		// Not necessary, a phonenumber will always be created in conjunction with a actor
		System.out.println("ActorServiceEndpoint: addPhoneNumber: persist phonenumber");

		// persist phonenumber
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		// entityManager.persist(language);
		entityManager.persist(newPhoneNumber);
		entityManager.flush();
		// newPhoneNumber.setLanguage(language);
		entityTransaction.commit();
		entityManager.refresh(newPhoneNumber);
		// entityManager.refresh(language);

		// create actor_has_phonenumber-table entries
		// entityTransaction.begin();
		// actor.getPhoneNumbers().add(newPhoneNumber);
		// newPhoneNumber.getActors3().add(actor);
		// entityManager.merge(newPhoneNumber);
		// entityManager.merge(actor);
		// entityManager.persist(newPhoneNumber);
		// entityManager.persist(actor);
		// entityTransaction.commit();
		// entityManager.refresh(actor);
		// entityManager.refresh(newPhoneNumber);

		System.out.println("ActorServiceEndpoint: addPhoneNumber: add log entry");	
		// add log entry
		UserLogManager.getLogger()
									// .addLogEntry(newPhoneNumber.getActor().getCreatedByUserAccount().getId(), UserLogManager.LogEvents.EMAILCREATED);
									.addLogEntry((int) containerRequestContext
									.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.EMAILCREATED);

		System.out.println("ActorServiceEndpoint: addPhoneNumber: phonenumber added with id "+newPhoneNumber.getId());
		// System.out.println("ActorServiceEndpoint: addPhoneNumber: phonenumber added with language id "+newPhoneNumber.getLanguage().getId());

		return Response.ok().entity(newPhoneNumber).build();
	}

	@PATCH
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("phonenumber/{id}")
	@Secured
	public Response updatePhoneNumber(@PathParam("id") int id, String jsonData) {
		System.out.println("ActorServiceEndpoint: UPDATE PHONENUMBER - jsonData: " + jsonData);
		ObjectMapper mapper = new ObjectMapper();
		PhoneNumber updatedPhoneNumber = null;    	
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		PhoneNumber phoneNumber = entityManager.find(PhoneNumber.class, id);
		if ( phoneNumber == null ) return Response.status(Status.NOT_FOUND).build();
		// System.out.println("ActorServiceEndpoint: UPDATE PHONENUMBER - old phonenumber :"+phonenumber.getPhoneNumber());		
		// parse JSON data
		try {
			updatedPhoneNumber = mapper.readValue(jsonData, PhoneNumber.class);
		} catch (IOException e) {
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( updatedPhoneNumber == null ) return Response.notModified().build();
		// update phonenumber
		if ( updatedPhoneNumber.getAreaCode() > 0 ) phoneNumber.setAreaCode(updatedPhoneNumber.getAreaCode());
		if ( updatedPhoneNumber.getPhoneNumber() > 0 ) phoneNumber.setPhoneNumber(updatedPhoneNumber.getPhoneNumber());

		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.merge(phoneNumber);
		entityManager.persist(phoneNumber);
		entityTransaction.commit();
		entityManager.refresh(phoneNumber);

		// System.out.println("ActorServiceEndpoint: UPDATE PHONENUMBER - only logging remains");	
		// add log entry
		UserLogManager.getLogger()
									.addLogEntry((int) containerRequestContext
									.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.EMAILEDITED);
		System.out.println("ActorServiceEndpoint: UPDATE PHONENUMBER - update complete");	
		return Response.ok().entity(phoneNumber).build();
	}

	@DELETE
	@Produces(MediaType.APPLICATION_JSON)
	@Path("phonenumber/{id}")
	@Secured
	public Response deletePhoneNumber(@PathParam("id") int id) {    
		System.out.println("ActorServiceEndpoint: deletePhoneNumber");	
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();

		PhoneNumber PhoneNumber = entityManager.find(PhoneNumber.class, id);
		if ( PhoneNumber == null ) return Response.status(Status.NOT_FOUND).build();

		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.remove(PhoneNumber);
		entityTransaction.commit();
		// add log entry
		UserLogManager.getLogger()
									.addLogEntry((int) containerRequestContext
									.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.EMAILDELETED);
		System.out.println("ActorServiceEndpoint: deletePhoneNumber - delete complete");	
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

	public static <T> List<T> castList(Class<? extends T> clazz, Collection<?> c) {
    List<T> r = new ArrayList<T>(c.size());
    for(Object o: c)
      r.add(clazz.cast(o));
    return r;
}
	
}
