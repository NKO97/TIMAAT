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
import de.bitgilde.TIMAAT.model.FIPOP.Country;
import de.bitgilde.TIMAAT.security.UserLogManager;

/**
*
* @author Jens-Martin Loebel <loebel@bitgilde.de>
* @author Mirko Scherf <mscherf@uni-mainz.de>
*/

@Service
@Path("/country")
public class CountryEndpoint {
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
	public Response getCountry(@PathParam("id") int id) {    	
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Country country = entityManager.find(Country.class, id);
		if ( country == null ) return Response.status(Status.NOT_FOUND).build();    	    	
	return Response.ok().entity(country).build();
	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("list")
	public Response getCountryList() {			
			@SuppressWarnings("unchecked")
		List<Country> countryList = TIMAATApp.emf.createEntityManager().createNamedQuery("Country.findAll").getResultList();
			// for (Country country : countryList ) {
			// 	country.setStatus(videoStatus(country.getId()));
			// 	country.setViewToken(issueFileToken(country.getId()));
			// 	country.setMediumAnalysisLists(null);
			// }			
		return Response.ok().entity(countryList).build();
	}

	@POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
	@Path("{id}")
	@Secured
	public Response createCountry(@PathParam("id") int id, String jsonData) { // TODO create location
		ObjectMapper mapper = new ObjectMapper();
		Country newCountry = null;  
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();  		
		// parse JSON data
		try {
			newCountry = mapper.readValue(jsonData, Country.class);
		} catch (IOException e) {
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( newCountry == null ) return Response.status(Status.BAD_REQUEST).build();
		// sanitize object data
		newCountry.setId(0);
		// update log metadata
		// newCountry.setCreatedAt(new Timestamp(System.currentTimeMillis()));
		// newCountry.setLastEditedAt(new Timestamp(System.currentTimeMillis()));
		// if ( containerRequestContext.getProperty("TIMAAT.userID") != null ) {
		// 	newCountry.setCreatedByUserAccount((int) containerRequestContext.getProperty("TIMAAT.userID"));
		// 	newCountry.setLastEditedByUserAccount((int) containerRequestContext.getProperty("TIMAAT.userID"));
		// } else {
		// 	// DEBUG do nothing - production system should abort with internal server error		
		// 	return Response.serverError().build();	
		// }
		// persist country
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.persist(newCountry);
		entityManager.flush();
		entityTransaction.commit();
		entityManager.refresh(newCountry);		
		// add log entry
		UserLogManager.getLogger().addLogEntry(newCountry.getLocation().getCreatedByUserAccount().getId(), UserLogManager.LogEvents.COUNTRYCREATED);
		return Response.ok().entity(newCountry).build();
	}

	@PATCH
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
	@Path("{id}")
	@Secured
	public Response updateCountry(@PathParam("id") int id, String jsonData) {
		ObjectMapper mapper = new ObjectMapper();
		Country updatedCountry = null;    	
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Country country = entityManager.find(Country.class, id);
		if ( country == null ) return Response.status(Status.NOT_FOUND).build();		
		// parse JSON data
		try {
			updatedCountry = mapper.readValue(jsonData, Country.class);
		} catch (IOException e) {
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( updatedCountry == null ) return Response.notModified().build();		    	
    // update country
		if ( updatedCountry.getName() != null ) country.setName(updatedCountry.getName());
		// update log metadata
		country.getLocation().setLastEditedAt(new Timestamp(System.currentTimeMillis()));
		if ( containerRequestContext.getProperty("TIMAAT.userID") != null ) {
			country.getLocation().getLastEditedByUserAccount().setId((int) containerRequestContext.getProperty("TIMAAT.userID"));
		} else {
			// DEBUG do nothing - production system should abort with internal server error			
		}		
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.merge(country);
		entityManager.persist(country);
		entityTransaction.commit();
		entityManager.refresh(country);
		// add log entry
		UserLogManager.getLogger().addLogEntry((int) containerRequestContext.getProperty("TIMAAT.userID"), 
																						UserLogManager.LogEvents.COUNTRYEDITED);
		return Response.ok().entity(country).build();
	}

	@DELETE
		@Produces(MediaType.APPLICATION_JSON)
	@Path("{id}")
	@Secured
	public Response deleteCountry(@PathParam("id") int id) {    	
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Country country = entityManager.find(Country.class, id);
		if ( country == null ) return Response.status(Status.NOT_FOUND).build();		
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.remove(country);
		entityTransaction.commit();
		// add log entry
		UserLogManager.getLogger().addLogEntry((int) containerRequestContext.getProperty("TIMAAT.userID"), 
																						UserLogManager.LogEvents.COUNTRYDELETED);
		return Response.ok().build();
	}
	
	@SuppressWarnings("unchecked")
	@GET
    @Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("all")
	public Response getAllCountries() {
		List<Country> countries = null;    	
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		try {
			countries = (List<Country>) entityManager.createQuery("SELECT c from Country c")
						.getResultList();
		} catch(Exception e) {};	
		// if ( countries != null ) {
		// 	List<Tag> tags = null;
		// 		try {
		// 			tags = (List<Tag>) entityManager.createQuery("SELECT t from Tag t WHERE NOT EXISTS ( SELECT NULL FROM Country c WHERE c.tags = t)")
		// 						.getResultList();
		// 		} catch(Exception e) {};
		// 	if ( tags != null ) {
		// 		Country emptyCountry = new Country();
		// 		emptyCountry.setId(-1);
		// 		emptyCountry.setName("-unassigned-");
		// 		// emptyCountry.setTags(tags);
		// 		countries.add(0, emptyCountry);
		// 	}
		// }    	
		return Response.ok().entity(countries).build();
	}
}
