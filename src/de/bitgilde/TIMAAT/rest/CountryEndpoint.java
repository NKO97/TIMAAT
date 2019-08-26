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
import de.bitgilde.TIMAAT.model.FIPOP.Location;
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
		return Response.ok().entity(countryList).build();
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
		return Response.ok().entity(countries).build();
	}

	@POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
	@Path("{id}")
	@Secured
	public Response createCountry(@PathParam("location") int locationid, @PathParam("id") int id, String jsonData) {
		ObjectMapper mapper = new ObjectMapper();
		Country newCountry = null;
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Location location = entityManager.find(Location.class, locationid);
		// System.out.println("CountryEndpoint: createCountry jsonData: "+jsonData);
		// parse JSON data
		try {
			newCountry = mapper.readValue(jsonData, Country.class);
		} catch (IOException e) {
			// System.out.println("CountryEndpoint: createCountry: IOException e !");
			e.printStackTrace();
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( newCountry == null ) {
			// System.out.println("CountryEndpoint: createCountry: newCountry == null !");
			return Response.status(Status.BAD_REQUEST).build();
		}
		// sanitize object data
		newCountry.setId(0);
		newCountry.setLocation(location);
		// update log metadata
		newCountry.setCreatedAt(new Timestamp(System.currentTimeMillis()));
		newCountry.setLastEditedAt(new Timestamp(System.currentTimeMillis()));
		if ( containerRequestContext.getProperty("TIMAAT.userID") != null ) {
			newCountry.setCreatedByUserAccountID((int) containerRequestContext.getProperty("TIMAAT.userID"));
			newCountry.setLastEditedByUserAccountID((int) containerRequestContext.getProperty("TIMAAT.userID"));
		} else {
			// DEBUG do nothing - production system should abort with internal server error		
			return Response.serverError().build();	
		}
		// persist country
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.persist(newCountry);
		entityManager.flush();
		entityTransaction.commit();
		entityManager.refresh(newCountry);		
		// add log entry
		UserLogManager.getLogger().addLogEntry(newCountry.getCreatedByUserAccountID(), UserLogManager.LogEvents.COUNTRYCREATED);
		System.out.println("CountryEndpoint: country created with id "+newCountry.getId());
		return Response.ok().entity(newCountry).build();
	}

	@PATCH
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
	@Path("{id}")
	@Secured
	public Response updateCountry(@PathParam("id") int id, String jsonData) {
		// System.out.println("CountryEndpoint: updateCountry");
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
		// System.out.println("CountryEndpoint updateCountry - country.id:"+country.getId());
		if ( updatedCountry.getInternationalDialingPrefix() != null ) country.setInternationalDialingPrefix(updatedCountry.getInternationalDialingPrefix());
		if ( updatedCountry.getTrunkPrefix() != null ) country.setTrunkPrefix(updatedCountry.getTrunkPrefix());
		if ( updatedCountry.getCountryCallingCode() != null ) country.setCountryCallingCode(updatedCountry.getCountryCallingCode());
		if ( updatedCountry.getTimeZone() != null ) country.setTimeZone(updatedCountry.getTimeZone());
		if ( updatedCountry.getDst() != null ) country.setDst(updatedCountry.getDst());
		// update log metadata
		country.setLastEditedAt(new Timestamp(System.currentTimeMillis()));
		if ( containerRequestContext.getProperty("TIMAAT.userID") != null ) {
			country.setLastEditedByUserAccountID((int) containerRequestContext.getProperty("TIMAAT.userID"));
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
		System.out.println("CountryEndpoint: deleteCountry with id: "+ id);
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Country country = entityManager.find(Country.class, id);
		if ( country == null ) return Response.status(Status.NOT_FOUND).build();		
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.remove(country);
		entityManager.remove(country.getLocation()); // remove country, then corresponding location
		entityTransaction.commit();
		// add log entry
		UserLogManager.getLogger().addLogEntry((int) containerRequestContext.getProperty("TIMAAT.userID"), 
																						UserLogManager.LogEvents.COUNTRYDELETED);
		System.out.println("CountryEndpoint: deleteCountry - country deleted");  
		return Response.ok().build();
	}
	
/** 
 * CountryEndpoint should not need create/update/deleteCountryTranslation methods
 * as long as there is no translated country data that is not part of the location
 * translation data
 */

}
