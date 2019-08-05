package de.bitgilde.TIMAAT.rest;

import java.io.IOException;
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
import de.bitgilde.TIMAAT.model.FIPOP.Tag;
import de.bitgilde.TIMAAT.model.FIPOP.Event;
import de.bitgilde.TIMAAT.security.UserLogManager;

/**
*
* @author Jens-Martin Loebel <loebel@bitgilde.de>
* @author Mirko Scherf <mscherf@uni-mainz.de>
*/

@Service
@Path("/tag")
public class EventEndpoint {
	@Context
	private UriInfo uriInfo;
	@Context
	ContainerRequestContext crc;
	@Context
	ServletContext ctx;

	
	@SuppressWarnings("unchecked")
	@GET
    @Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("event/all")
	public Response getAllEvents() {
		List<Event> events = null;
		
    	
    	EntityManager em = TIMAATApp.emf.createEntityManager();
    	try {
    		events = (List<Event>) em.createQuery("SELECT e from Event e")
        			.getResultList();
    	} catch(Exception e) {};
		
    	if ( events != null ) {
    		List<Tag> tags = null;
        	try {
        		tags = (List<Tag>) em.createQuery("SELECT t from Tag t WHERE NOT EXISTS ( SELECT NULL FROM Event e WHERE e.tags = t)")
            			.getResultList();
        	} catch(Exception e) {};
    		if ( tags != null ) {
    			Event emptyEvent = new Event();
    			emptyEvent.setId(-1);
    			emptyEvent.setName("-unassigned-");
    			emptyEvent.setTags(tags);
    			events.add(0, emptyEvent);
    		}
    	}    	
		return Response.ok().entity(events).build();
	}
	
	@SuppressWarnings("unchecked")
	@POST
    @Produces(MediaType.APPLICATION_JSON)
	@Path("event/{id}/tag/{name}")
	@Secured
	public Response addTag(@PathParam("id") int id, @PathParam("name") String tagName) {
		
    	
    	EntityManager em = TIMAATApp.emf.createEntityManager();
    	Event event = em.find(Event.class, id);
    	if ( event == null ) return Response.status(Status.NOT_FOUND).build();

    	// check if tag exists    	
    	Tag tag = null;
    	List<Tag> tags = null;
    	try {
        	tags = (List<Tag>) em.createQuery("SELECT t from Tag t WHERE t.name=:name")
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
    		EntityTransaction tx = em.getTransaction();
    		tx.begin();
    		em.persist(tag);
    		tx.commit();
    		em.refresh(tag);
    	}
    	
    	// check if event already has tag
    	if ( !event.getTags().contains(tag) ) {
        	// attach tag to event and vice versa    	
    		EntityTransaction tx = em.getTransaction();
    		tx.begin();
    		event.getTags().add(tag);
    		tag.getEvents().add(event);
    		em.merge(tag);
    		em.merge(event);
    		em.persist(event);
    		em.persist(tag);
    		tx.commit();
    		em.refresh(event);
    	}
 	
		return Response.ok().entity(tag).build();
	}
	
	@DELETE
    @Produces(MediaType.APPLICATION_JSON)
	@Path("event/{id}/tag/{name}")
	@Secured
	public Response removeTag(@PathParam("id") int id, @PathParam("name") String tagName) {
		
    	
    	EntityManager em = TIMAATApp.emf.createEntityManager();
    	Event event = em.find(Event.class, id);
    	if ( event == null ) return Response.status(Status.NOT_FOUND).build();
    	
    	// check if event already has tag
    	Tag tag = null;
    	for ( Tag eventTag:event.getTags() ) {
    		if ( eventTag.getName().compareTo(tagName) == 0 ) tag = eventTag;
    	}
    	if ( tag != null ) {
        	// attach tag to event and vice versa    	
    		EntityTransaction tx = em.getTransaction();
    		tx.begin();
    		event.getTags().remove(tag);
    		tag.getEvents().remove(event);
    		em.merge(tag);
    		em.merge(event);
    		em.persist(event);
    		em.persist(tag);
    		tx.commit();
    		em.refresh(event);
    	}
 	
		return Response.ok().build();
	}

	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Secured
	@Path("event")
	public Response createEvent(String jsonData) {
		ObjectMapper mapper = new ObjectMapper();
		Event newEvent = null;    	
    EntityManager em = TIMAATApp.emf.createEntityManager();		
    // parse JSON data
		try {
			newEvent = mapper.readValue(jsonData, Event.class);
		} catch (IOException e) {
			e.printStackTrace();
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( newEvent == null ) return Response.status(Status.BAD_REQUEST).build();
		// sanitize object data
		newEvent.setId(0);
		newEvent.setTags(new ArrayList<Tag>());
		
		// persist event and polygons
		EntityTransaction tx = em.getTransaction();
		tx.begin();
		em.persist(newEvent);
		em.flush();
		tx.commit();
		em.refresh(newEvent);
		
		// add log entry
		UserLogManager.getLogger().addLogEntry((int) crc.getProperty("TIMAAT.userID"), 
																						UserLogManager.LogEvents.EVENTCREATED);
		
		return Response.ok().entity(newEvent).build();
	}
	
	
	@PATCH
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
	@Path("event/{id}")
	@Secured
	public Response updateEvent(@PathParam("id") int id, String jsonData) {
		ObjectMapper mapper = new ObjectMapper();
		Event updateEvent = null;

    	
    	EntityManager em = TIMAATApp.emf.createEntityManager();
    	Event event = em.find(Event.class, id);
    	if ( event == null ) return Response.status(Status.NOT_FOUND).build();
		
    	// parse JSON data
		try {
			updateEvent = mapper.readValue(jsonData, Event.class);
		} catch (IOException e) {
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( updateEvent == null ) return Response.notModified().build();
		    	
    	// update analysislist
		if ( updateEvent.getName() != null ) event.setName(updateEvent.getName());

		// TODO update log metadata in general log
		
		EntityTransaction tx = em.getTransaction();
		tx.begin();
		em.merge(event);
		em.persist(event);
		tx.commit();
		em.refresh(event);

		// add log entry
		UserLogManager.getLogger().addLogEntry((int) crc.getProperty("TIMAAT.userID"), 
																						UserLogManager.LogEvents.EVENTEDITED);

		return Response.ok().entity(event).build();
	}
	
	
	@DELETE
    @Produces(MediaType.APPLICATION_JSON)
	@Path("event/{id}")
	@Secured
	public Response deleteEvent(@PathParam("id") int id) {    	
		EntityManager em = TIMAATApp.emf.createEntityManager();
		Event event = em.find(Event.class, id);
		if ( event == null ) return Response.status(Status.NOT_FOUND).build();		
		EntityTransaction tx = em.getTransaction();
		tx.begin();
		em.remove(event);
		tx.commit();
		// add log entry
		UserLogManager.getLogger().addLogEntry((int) crc.getProperty("TIMAAT.userID"), 
																						UserLogManager.LogEvents.EVENTDELETED);
		return Response.ok().build();
	}
}
