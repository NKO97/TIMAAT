package de.bitgilde.TIMAAT.rest.endpoint;

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
import de.bitgilde.TIMAAT.model.FIPOP.UserAccount;
import de.bitgilde.TIMAAT.rest.Secured;
import de.bitgilde.TIMAAT.model.FIPOP.Event;
import de.bitgilde.TIMAAT.model.FIPOP.EventTranslation;
import de.bitgilde.TIMAAT.model.FIPOP.Language;
import de.bitgilde.TIMAAT.security.UserLogManager;

/**
*
* @author Jens-Martin Loebel <loebel@bitgilde.de>
* @author Mirko Scherf <mscherf@uni-mainz.de>
*/

@Service
@Path("/event")
public class EndpointEvent {
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
	public Response getEvent(@PathParam("id") int id) {    	
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Event event = entityManager.find(Event.class, id);
		if ( event == null ) return Response.status(Status.NOT_FOUND).build();    	    	
	return Response.ok().entity(event).build();
	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("list")
	public Response getEventList() {
		// System.out.println("EndpointEvent getEventList");
		@SuppressWarnings("unchecked")
		List<Event> eventList = TIMAATApp.emf.createEntityManager().createNamedQuery("Event.findAll").getResultList();
		return Response.ok().entity(eventList).build();
	}

	@SuppressWarnings("unchecked")
	@GET
    @Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("all")
	public Response getAllEvents() {
		// System.out.println("EndpointEvent: getAllEvents");
		List<Event> events = null;    	
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		try {
			events = (List<Event>) entityManager.createQuery("SELECT e from Event e")
				.getResultList();
		} catch(Exception e) {};	
		if ( events != null ) {
			List<Tag> tags = null;
				try {
					tags = (List<Tag>) entityManager.createQuery("SELECT t from Tag t WHERE NOT EXISTS ( SELECT NULL FROM Event e WHERE e.tags = t)")
								.getResultList();
				} catch(Exception e) {};
			if ( tags != null ) {
				Event emptyEvent = new Event();
				emptyEvent.setId(-1);
				// emptyEvent.setName("-unassigned-");
				emptyEvent.setTags(tags);
				events.add(0, emptyEvent);
			}
		}    	
		return Response.ok().entity(events).build();
	}

	@POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
	@Path("{id}")
	@Secured
	public Response createEvent(@PathParam("id") int id, String jsonData) {
		ObjectMapper mapper = new ObjectMapper();
		Event newEvent = null;  
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		// System.out.println("EndpointEvent: createEvent jsonData: "+jsonData);
		// parse JSON data
		try {
			newEvent = mapper.readValue(jsonData, Event.class);
		} catch (IOException e) {
			// System.out.println("EndpointEvent: createEvent: IOException e !");
			e.printStackTrace();
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( newEvent == null ) {
			// System.out.println("EndpointEvent: createEvent: newEvent == null !");
			return Response.status(Status.BAD_REQUEST).build();
		}
		// sanitize object data
		newEvent.setId(0);
		// update log metadata
		Timestamp creationDate = new Timestamp(System.currentTimeMillis());
		newEvent.setCreatedAt(creationDate);
		newEvent.setLastEditedAt(creationDate);
		if ( containerRequestContext.getProperty("TIMAAT.userID") != null ) {
			newEvent.setCreatedByUserAccount((entityManager.find(UserAccount.class, containerRequestContext.getProperty("TIMAAT.userID"))));
			newEvent.setLastEditedByUserAccount((entityManager.find(UserAccount.class, containerRequestContext.getProperty("TIMAAT.userID"))));
		} else {
			// DEBUG do nothing - production system should abort with internal server error		
			return Response.serverError().build();	
		}
		// persist event
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.persist(newEvent);
		entityManager.flush();
		entityTransaction.commit();
		entityManager.refresh(newEvent);		
		// add log entry
		UserLogManager.getLogger().addLogEntry(newEvent.getCreatedByUserAccount().getId(), UserLogManager.LogEvents.EVENTCREATED);
		System.out.println("EndpointEvent: event created with id "+newEvent.getId());
		return Response.ok().entity(newEvent).build();
	}

	@PATCH
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
	@Path("{id}")
	@Secured
	public Response updateEvent(@PathParam("id") int id, String jsonData) {
		// System.out.println("EndpointEvent: updateEvent");
		ObjectMapper mapper = new ObjectMapper();
		Event updatedEvent = null;    	
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Event event = entityManager.find(Event.class, id);
		if ( event == null ) return Response.status(Status.NOT_FOUND).build();		
		// parse JSON data
		try {
			updatedEvent = mapper.readValue(jsonData, Event.class);
		} catch (IOException e) {
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( updatedEvent == null ) return Response.notModified().build();		    	
		// update event
		// System.out.println("EndpointEvent updateEvent - event.id:"+event.getId());
		if ( updatedEvent.getBeginsAtDate() != null ) event.setBeginsAtDate(updatedEvent.getBeginsAtDate());
		if ( updatedEvent.getEndsAtDate() != null ) event.setEndsAtDate(updatedEvent.getEndsAtDate());
		// update log metadata
		event.setLastEditedAt(new Timestamp(System.currentTimeMillis()));
		if ( containerRequestContext.getProperty("TIMAAT.userID") != null ) {
			event.setLastEditedByUserAccount((entityManager.find(UserAccount.class, containerRequestContext.getProperty("TIMAAT.userID"))));
		} else {
			// DEBUG do nothing - production system should abort with internal server error			
		}		
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.merge(event);
		entityManager.persist(event);
		entityTransaction.commit();
		entityManager.refresh(event);
		// add log entry
		UserLogManager.getLogger().addLogEntry((int) containerRequestContext.getProperty("TIMAAT.userID"), 
																						UserLogManager.LogEvents.EVENTEDITED);
		return Response.ok().entity(event).build();
	}

	@DELETE
		@Produces(MediaType.APPLICATION_JSON)
	@Path("{id}")
	@Secured
	public Response deleteEvent(@PathParam("id") int id) {  
		System.out.println("EndpointEvent: deleteEvent with id: "+ id);
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Event event = entityManager.find(Event.class, id);
		if ( event == null ) return Response.status(Status.NOT_FOUND).build();		
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		// remove all associated translations
		for (EventTranslation eventTranslation : event.getEventTranslations()) entityManager.remove(eventTranslation);
		while (event.getEventTranslations().size() > 0) {
			// System.out.println("EndpointEvent: try to delete event translation with id: "+ event.getEventTranslations().get(0).getId());
			event.removeEventTranslation(event.getEventTranslations().get(0));
		}
		// System.out.println("EndpointEvent: all event translations deleted");
		entityManager.remove(event);
		entityTransaction.commit();
		// add log entry
		UserLogManager.getLogger().addLogEntry((int) containerRequestContext.getProperty("TIMAAT.userID"), 
																						UserLogManager.LogEvents.EVENTDELETED);
		System.out.println("EndpointEvent: deleteEvent - event deleted");  
		return Response.ok().build();
	}
	
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Secured
	@Path("{event}/translation/{id}")
	public Response createEventTranslation(@PathParam("event") int eventid, @PathParam("id") int id, String jsonData) {
		System.out.println("EndpointEvent: createEventTranslation");
		ObjectMapper mapper = new ObjectMapper();
		EventTranslation newTranslation = null;
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Event event = entityManager.find(Event.class, eventid);
		System.out.println("EndpointEvent: createEventTranslation jsonData: "+jsonData);
		if ( event == null ) return Response.status(Status.NOT_FOUND).build();
		// parse JSON data
		try {
			newTranslation = mapper.readValue(jsonData, EventTranslation.class);
		} catch (IOException e) {
			e.printStackTrace();
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( newTranslation == null ) return Response.status(Status.BAD_REQUEST).build();
		// System.out.println("EndpointEvent: createEventTranslation - translation exists");
		// sanitize object data
		// System.out.println("newTranslation.setId(0);");
		newTranslation.setId(0);
		// System.out.println("newTranslation.setEvent(event);" + event);
		newTranslation.setEvent(event); // TODO check if valid
		Language language = entityManager.find(Language.class, newTranslation.getLanguage().getId());
		// System.out.println("newTranslation.setLanguage(language);" + language);
		newTranslation.setLanguage(language);
		// System.out.println("event.addEventTranslation(newTranslation); " + newTranslation);
		event.addEventTranslation(newTranslation);
		// System.out.println("so far so good? start persistence");
		// persist eventTranslation and event
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.persist(newTranslation);
		entityManager.flush();
		newTranslation.setEvent(event);
		entityManager.persist(event);
		entityTransaction.commit();
		entityManager.refresh(newTranslation);
		entityManager.refresh(event);
		// System.out.println("persistence completed!");

		// add log entry (always in conjunction with event creation)
		// UserLogManager.getLogger().addLogEntry((int) containerRequestContext.getProperty("TIMAAT.userID"), 
		// 																				UserLogManager.LogEvents.EVENTCREATED);
		System.out.println("EndpointEvent: event translation created with id "+newTranslation.getId());
		return Response.ok().entity(newTranslation).build();
	}

	@PATCH
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Secured
	@Path("{event}/translation/{id}")
	public Response updateEventTranslation(@PathParam("event") int eventid, @PathParam("id") int id, String jsonData) {
		// System.out.println("EndpointEvent: updateEventTranslation");
		ObjectMapper mapper = new ObjectMapper();
		EventTranslation updatedTranslation = null;    	
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		EventTranslation eventTranslation = entityManager.find(EventTranslation.class, id);
		if ( eventTranslation == null ) return Response.status(Status.NOT_FOUND).build();
		// parse JSON data
		try {
			updatedTranslation = mapper.readValue(jsonData, EventTranslation.class);
		} catch (IOException e) {
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( updatedTranslation == null ) return Response.notModified().build();				
		// update event translation
		if ( updatedTranslation.getName() != null ) eventTranslation.setName(updatedTranslation.getName());
		if ( updatedTranslation.getDescription() != null ) eventTranslation.setDescription(updatedTranslation.getDescription());
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.merge(eventTranslation);
		entityManager.persist(eventTranslation);
		entityTransaction.commit();
		entityManager.refresh(eventTranslation);
		// add log entry
		UserLogManager.getLogger().addLogEntry((int) containerRequestContext.getProperty("TIMAAT.userID"), 
																						UserLogManager.LogEvents.EVENTEDITED);
		// System.out.println("EndpointEvent: updateEventTranslation - updated");
		return Response.ok().entity(eventTranslation).build();
	}

	// not needed yet (should be necessary once several translations for an event exist and individual ones need to be removed)
	@DELETE
	@Produces(MediaType.APPLICATION_JSON)
	@Path("{event}/translation/{id}")
	@Secured
	public Response deleteEventTranslation(@PathParam("event") int eventid, @PathParam("id") int id) {		
		System.out.println("EndpointEvent: deleteEventTranslation");
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		EventTranslation eventTranslation = entityManager.find(EventTranslation.class, id);
		if ( eventTranslation == null ) return Response.status(Status.NOT_FOUND).build();	
		Event event = eventTranslation.getEvent();
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.remove(eventTranslation);
		entityTransaction.commit();
		entityManager.refresh(event);	
		// add log entry
		UserLogManager.getLogger().addLogEntry((int) containerRequestContext.getProperty("TIMAAT.userID"), 
																						UserLogManager.LogEvents.EVENTDELETED);
		return Response.ok().build();
	}
	
	@SuppressWarnings("unchecked")
	@POST
    @Produces(MediaType.APPLICATION_JSON)
	@Path("{id}/tag/{name}")
	@Secured
	public Response addTag(@PathParam("id") int id, @PathParam("name") String tagName) {    	
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Event event = entityManager.find(Event.class, id);
		if ( event == null ) return Response.status(Status.NOT_FOUND).build();
		// check if tag exists    	
		Tag tag = null;
		List<Tag> tags = null;
		try {
			tags = (List<Tag>) entityManager.createQuery("SELECT t from Tag t WHERE t.name=:name")
				.setParameter("name", tagName)
				.getResultList();
		} catch(Exception e) {};    	
		// find tag case sensitive
		for ( Tag listTag : tags )
			if ( listTag.getName().compareTo(tagName) == 0 ) tag = listTag;    	
		// create tag if it doesn't exist yet
		if ( tag == null ) {
			tag = new Tag();
			tag.setName(tagName);
			EntityTransaction entityTransaction = entityManager.getTransaction();
			entityTransaction.begin();
			entityManager.persist(tag);
			entityTransaction.commit();
			entityManager.refresh(tag);
		}
		// check if event already has tag
		if ( !event.getTags().contains(tag) ) {
				// attach tag to event and vice versa    	
			EntityTransaction entityTransaction = entityManager.getTransaction();
			entityTransaction.begin();
			event.getTags().add(tag);
			tag.getEvents().add(event);
			entityManager.merge(tag);
			entityManager.merge(event);
			entityManager.persist(event);
			entityManager.persist(tag);
			entityTransaction.commit();
			entityManager.refresh(event);
		}
		return Response.ok().entity(tag).build();
	}
	
	@DELETE
    @Produces(MediaType.APPLICATION_JSON)
	@Path("{id}/tag/{name}")
	@Secured
	public Response removeTag(@PathParam("id") int id, @PathParam("name") String tagName) {    	
    	EntityManager entityManager = TIMAATApp.emf.createEntityManager();
    	Event event = entityManager.find(Event.class, id);
    	if ( event == null ) return Response.status(Status.NOT_FOUND).build();    	
    	// check if event already has tag
    	Tag tag = null;
    	for ( Tag eventTag:event.getTags() ) {
    		if ( eventTag.getName().compareTo(tagName) == 0 ) tag = eventTag;
    	}
    	if ( tag != null ) {
        	// attach tag to event and vice versa    	
    		EntityTransaction entityTransaction = entityManager.getTransaction();
    		entityTransaction.begin();
    		event.getTags().remove(tag);
    		tag.getEvents().remove(event);
    		entityManager.merge(tag);
    		entityManager.merge(event);
    		entityManager.persist(event);
    		entityManager.persist(tag);
    		entityTransaction.commit();
    		entityManager.refresh(event);
    	} 	
		return Response.ok().build();
	}
	
}
