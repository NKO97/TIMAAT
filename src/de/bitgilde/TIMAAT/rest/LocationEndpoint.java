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
import de.bitgilde.TIMAAT.model.FIPOP.UserAccount;
import de.bitgilde.TIMAAT.model.FIPOP.Location;
import de.bitgilde.TIMAAT.security.UserLogManager;

/**
*
* @author Jens-Martin Loebel <loebel@bitgilde.de>
* @author Mirko Scherf <mscherf@uni-mainz.de>
*/

@Service
@Path("/location")
public class LocationEndpoint {
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
	public Response getLocation(@PathParam("id") int id) {    	
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Location e = entityManager.find(Location.class, id);
		if ( e == null ) return Response.status(Status.NOT_FOUND).build();    	    	
	return Response.ok().entity(e).build();
	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("list")
	public Response getLocationList() {			
			@SuppressWarnings("unchecked")
		List<Location> locationList = TIMAATApp.emf.createEntityManager().createNamedQuery("Location.findAll").getResultList();
			// for (Location location : locationList ) {
			// 	location.setStatus(videoStatus(location.getId()));
			// 	location.setViewToken(issueFileToken(location.getId()));
			// 	location.setMediumAnalysisLists(null);
			// }			
		return Response.ok().entity(locationList).build();
	}

	///////////////////////////
	// @Produces(MediaType.APPLICATION_JSON)
	// @Consumes(MediaType.APPLICATION_JSON)
	// @Secured
	// @Path("{id}")
	// public Response createLocation(@PathParam("id") int id, String jsonData) {
	// 	ObjectMapper mapper = new ObjectMapper();
	// 	Location newLocation = null;    	
  //   EntityManager em = TIMAATApp.emf.createEntityManager();		
  //   // parse JSON data
	// 	try {
	// 		newLocation = mapper.readValue(jsonData, Location.class);
	// 	} catch (IOException e) {
	// 		e.printStackTrace();
	// 		return Response.status(Status.BAD_REQUEST).build();
	// 	}
	// 	if ( newLocation == null ) return Response.status(Status.BAD_REQUEST).build();
	// 	// sanitize object data
	// 	newLocation.setId(0);
	// 	// newLocation.setTags(new ArrayList<Tag>());
		
	// 	// persist location and polygons
	// 	EntityTransaction tx = em.getTransaction();
	// 	tx.begin();
	// 	em.persist(newLocation);
	// 	em.flush();
	// 	tx.commit();
	// 	em.refresh(newLocation);
		
	// 	// add log entry
	// 	UserLogManager.getLogger().addLogEntry((int) containerRequestContext.getProperty("TIMAAT.userID"), 
	// 																					UserLogManager.LogLocations.LOCATIONCREATED);
		
	// 	return Response.ok().entity(newLocation).build();
	// }
	///////////////////////////

	@POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
	@Path("{id}")
	@Secured
	public Response createLocation(@PathParam("id") int id, String jsonData) {
		ObjectMapper mapper = new ObjectMapper();
		Location newLocation = null;  
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();  	
   // EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		// Medium m = em.find(Medium.class, id);
		// if ( m == null ) return Response.status(Status.NOT_FOUND).build();		
		// parse JSON data
		try {
			newLocation = mapper.readValue(jsonData, Location.class);
		} catch (IOException e) {
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( newLocation == null ) return Response.status(Status.BAD_REQUEST).build();
		// sanitize object data
		newLocation.setId(0);
		// update log metadata
		newLocation.setCreatedAt(new Timestamp(System.currentTimeMillis()));
		newLocation.setLastEditedAt(new Timestamp(System.currentTimeMillis()));
		if ( containerRequestContext.getProperty("TIMAAT.userID") != null ) {
			newLocation.setCreatedByUserAccountID((int) containerRequestContext.getProperty("TIMAAT.userID"));
			newLocation.setLastEditedByUserAccountID((int) containerRequestContext.getProperty("TIMAAT.userID"));
		} else {
			// DEBUG do nothing - production system should abort with internal server error		
			return Response.serverError().build();	
		}
		// persist location
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.persist(newLocation);
		entityManager.flush();
		entityTransaction.commit();
		entityManager.refresh(newLocation);		
		// add log entry
		UserLogManager.getLogger().addLogEntry(newLocation.getCreatedByUserAccountID(), UserLogManager.LogEvents.LOCATIONCREATED);
		return Response.ok().entity(newLocation).build();
	}

	@PATCH
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
	@Path("{id}")
	@Secured
	public Response updateLocation(@PathParam("id") int id, String jsonData) {
		ObjectMapper mapper = new ObjectMapper();
		Location updatedLocation = null;    	
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Location location = entityManager.find(Location.class, id);
		if ( location == null ) return Response.status(Status.NOT_FOUND).build();		
		// parse JSON data
		try {
			updatedLocation = mapper.readValue(jsonData, Location.class);
		} catch (IOException e) {
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( updatedLocation == null ) return Response.notModified().build();		    	
    	// update location
		if ( updatedLocation.getName() != null ) location.setName(updatedLocation.getName());
		// update log metadata
		location.setLastEditedAt(new Timestamp(System.currentTimeMillis()));
		if ( containerRequestContext.getProperty("TIMAAT.userID") != null ) {
			location.setLastEditedByUserAccountID((int) containerRequestContext.getProperty("TIMAAT.userID"));
		} else {
			// DEBUG do nothing - production system should abort with internal server error			
		}		
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.merge(location);
		entityManager.persist(location);
		entityTransaction.commit();
		entityManager.refresh(location);
		// add log entry
		UserLogManager.getLogger().addLogEntry((int) containerRequestContext.getProperty("TIMAAT.userID"), 
																						UserLogManager.LogEvents.LOCATIONEDITED);
		return Response.ok().entity(location).build();
	}

	@DELETE
		@Produces(MediaType.APPLICATION_JSON)
	@Path("{id}")
	@Secured
	public Response deleteLocation(@PathParam("id") int id) {    	
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Location location = entityManager.find(Location.class, id);
		if ( location == null ) return Response.status(Status.NOT_FOUND).build();		
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.remove(location);
		entityTransaction.commit();
		// add log entry
		UserLogManager.getLogger().addLogEntry((int) containerRequestContext.getProperty("TIMAAT.userID"), 
																						UserLogManager.LogEvents.LOCATIONDELETED);
		return Response.ok().build();
	}
	
	// @SuppressWarnings("unchecked")
	// @POST
  //   @Produces(MediaType.APPLICATION_JSON)
	// @Path("{id}/tag/{name}") // 	@Path("location/{id}/tag/{name}")
	// @Secured
	// public Response addTag(@PathParam("id") int id, @PathParam("name") String tagName) {    	
  //   	EntityManager entityManager = TIMAATApp.emf.createEntityManager();
  //   	Location location = entityManager.find(Location.class, id);
  //   	if ( location == null ) return Response.status(Status.NOT_FOUND).build();
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
  //   	// check if location already has tag
  //   	if ( !location.getTags().contains(tag) ) {
  //       	// attach tag to location and vice versa    	
  //   		EntityTransaction entityTransaction = entityManager.getTransaction();
  //   		entityTransaction.begin();
  //   		location.getTags().add(tag);
  //   		tag.getLocations().add(location);
  //   		entityManager.merge(tag);
  //   		entityManager.merge(location);
  //   		entityManager.persist(location);
  //   		entityManager.persist(tag);
  //   		entityTransaction.commit();
  //   		entityManager.refresh(location);
  //   	} 	
	// 	return Response.ok().entity(tag).build();
	// }
	
	// @DELETE
  //   @Produces(MediaType.APPLICATION_JSON)
	// @Path("{id}/tag/{name}")
	// @Secured
	// public Response removeTag(@PathParam("id") int id, @PathParam("name") String tagName) {    	
  //   	EntityManager entityManager = TIMAATApp.emf.createEntityManager();
  //   	Location location = entityManager.find(Location.class, id);
  //   	if ( location == null ) return Response.status(Status.NOT_FOUND).build();    	
  //   	// check if location already has tag
  //   	Tag tag = null;
  //   	for ( Tag locationTag:location.getTags() ) {
  //   		if ( locationTag.getName().compareTo(tagName) == 0 ) tag = locationTag;
  //   	}
  //   	if ( tag != null ) {
  //       	// attach tag to location and vice versa    	
  //   		EntityTransaction entityTransaction = entityManager.getTransaction();
  //   		entityTransaction.begin();
  //   		location.getTags().remove(tag);
  //   		tag.getLocations().remove(location);
  //   		entityManager.merge(tag);
  //   		entityManager.merge(location);
  //   		entityManager.persist(location);
  //   		entityManager.persist(tag);
  //   		entityTransaction.commit();
  //   		entityManager.refresh(location);
  //   	} 	
	// 	return Response.ok().build();
	// }
	
	@SuppressWarnings("unchecked")
	@GET
    @Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("all")
	public Response getAllLocations() {
		List<Location> locations = null;    	
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		try {
			locations = (List<Location>) entityManager.createQuery("SELECT e from Location e")
						.getResultList();
		} catch(Exception e) {};	
		if ( locations != null ) {
			List<Tag> tags = null;
				try {
					tags = (List<Tag>) entityManager.createQuery("SELECT t from Tag t WHERE NOT EXISTS ( SELECT NULL FROM Location e WHERE e.tags = t)")
								.getResultList();
				} catch(Exception e) {};
			if ( tags != null ) {
				Location emptyLocation = new Location();
				emptyLocation.setId(-1);
				emptyLocation.setName("-unassigned-");
				// emptyLocation.setTags(tags);
				locations.add(0, emptyLocation);
			}
		}    	
		return Response.ok().entity(locations).build();
	}
}
