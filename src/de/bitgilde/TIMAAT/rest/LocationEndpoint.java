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
import de.bitgilde.TIMAAT.model.FIPOP.Language;
import de.bitgilde.TIMAAT.model.FIPOP.Location;
import de.bitgilde.TIMAAT.model.FIPOP.Locationtranslation;
import de.bitgilde.TIMAAT.model.FIPOP.Locationtype;
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
		Location location = entityManager.find(Location.class, id);
		if ( location == null ) return Response.status(Status.NOT_FOUND).build();    	    	
	return Response.ok().entity(location).build();
	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("list")
	public Response getLocationList() {
		System.out.println("LocationEndpoint getLocationList");		
		@SuppressWarnings("unchecked")
		List<Location> locationList = TIMAATApp.emf.createEntityManager().createNamedQuery("Location.findAll").getResultList();
		return Response.ok().entity(locationList).build();
	}
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("country/list")
	public Response getCountryList() {
		System.out.println("LocationEndpoint getCountryList");		
		@SuppressWarnings("unchecked")
		List<Country> countryList = TIMAATApp.emf.createEntityManager().createNamedQuery("Country.findAll").getResultList();
		return Response.ok().entity(countryList).build();
	}

	@SuppressWarnings("unchecked")
	@GET
    @Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("all")
	public Response getAllLocations() {
		System.out.println("LocationEndpoint: getAllLocations");
		List<Location> locations = null;    	
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		try {
			locations = (List<Location>) entityManager.createQuery("SELECT l from Location l")
						.getResultList();
		} catch(Exception e) {};	  	
		return Response.ok().entity(locations).build();
	}
	
	@POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
	@Path("{id}")
	@Secured
	public Response createLocation(@PathParam("id") int id, String jsonData) {
		System.out.println("LocationEndpoint: createLocation: " + jsonData);
		ObjectMapper mapper = new ObjectMapper();
		Location newLocation = null;  
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
  	// EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		// parse JSON data
		try {
			newLocation = mapper.readValue(jsonData, Location.class);
		} catch (IOException e) {
			System.out.println("LocationEndpoint: createLocation - IOException");
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( newLocation == null ) {
			System.out.println("LocationEndpoint: createLocation - newLocation == 0");
			return Response.status(Status.BAD_REQUEST).build();
		}
		// System.out.println("LocationEndpoint: determine location tpye: " + newLocation.getLocationtype().getId());
		// Locationtype loctype = entityManager.find(Locationtype.class, newLocation.getLocationtype().getId());
		// if (loctype == null) return Response.status(Status.NOT_FOUND).build();
		// sanitize object data
		newLocation.setId(0);
		// newLocation.setLocationtype(loctype);
		// Locationtype locationtype = entityManager.find(Locationtype.class, id);
		// newLocation.setLocationtype(locationtype);
		// update log metadata
		Timestamp creationDate = new Timestamp(System.currentTimeMillis());
		newLocation.setCreatedAt(creationDate);
		newLocation.setLastEditedAt(creationDate);
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
		// entityManager.persist(loctype);
		entityManager.flush();
		entityTransaction.commit();
		entityManager.refresh(newLocation);
		// entityManager.refresh(loctype);
		// add log entry
		UserLogManager.getLogger().addLogEntry(newLocation.getCreatedByUserAccountID(), UserLogManager.LogEvents.LOCATIONCREATED);
		System.out.println("LocationEndpoint: createLocation - done");
		return Response.ok().entity(newLocation).build();
	}

	@PATCH
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
	@Path("{id}")
	@Secured
	public Response updateLocation(@PathParam("id") int id, String jsonData) {
		System.out.println("LocationEndpoint: updateLocation");
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
		// remove all associated translations
		for (Locationtranslation locationTranslation : location.getLocationtranslations()) entityManager.remove(locationTranslation);
		while (location.getLocationtranslations().size() > 0) {
			// System.out.println("LocationEndpoint: try to delete location translation with id: "+ location.getLocationtranslations().get(0).getId());
			location.removeLocationtranslation(location.getLocationtranslations().get(0));
		}
		entityManager.remove(location);
		entityTransaction.commit();
		// add log entry
		UserLogManager.getLogger().addLogEntry((int) containerRequestContext.getProperty("TIMAAT.userID"), 
																						UserLogManager.LogEvents.LOCATIONDELETED);
		return Response.ok().build();
	}

	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Secured
	@Path("{location}/translation/{id}")
	public Response createLocationTranslation(@PathParam("location") int locationid, @PathParam("id") int id, String jsonData) {
		System.out.println("LocationEndpoint: createLocationTranslation");
		ObjectMapper mapper = new ObjectMapper();
		Locationtranslation newTranslation = null;
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Location location = entityManager.find(Location.class, locationid);
		System.out.println("LocationEndpoint: createLocationTranslation jsonData: "+jsonData);
		if ( location == null ) return Response.status(Status.NOT_FOUND).build();
		// parse JSON data
		try {
			newTranslation = mapper.readValue(jsonData, Locationtranslation.class);
		} catch (IOException e) {
			e.printStackTrace();
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( newTranslation == null ) return Response.status(Status.BAD_REQUEST).build();
		// System.out.println("LocationEndpoint: createLocationTranslation - translation exists");
		// sanitize object data
		// System.out.println("newTranslation.setId(0);");
		newTranslation.setId(0);
		// System.out.println("newTranslation.setLocation(location);" + location);
		newTranslation.setLocation(location); // TODO check if valid
		Language language = entityManager.find(Language.class, 1); // TODO get proper language id
		// System.out.println("newTranslation.setLanguage(language);" + language);
		newTranslation.setLanguage(language);
		// System.out.println("location.addLocationtranslation(newTranslation); " + newTranslation);
		location.addLocationtranslation(newTranslation);
		// System.out.println("so far so good? start persistence");
		// persist locationTranslation and location
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.persist(newTranslation);
		entityManager.flush();
		newTranslation.setLocation(location);
		entityManager.persist(location);
		entityTransaction.commit();
		entityManager.refresh(newTranslation);
		entityManager.refresh(location);
		// System.out.println("persistence completed!");
		// add log entry
		UserLogManager.getLogger().addLogEntry((int) containerRequestContext.getProperty("TIMAAT.userID"), 
																						UserLogManager.LogEvents.LOCATIONCREATED); // TODO own log location required?
		System.out.println("LocationEndpoint: location translation created with id "+newTranslation.getId());
		return Response.ok().entity(newTranslation).build();
	}

	@PATCH
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Secured
	@Path("{location}/translation/{id}")
	public Response updateLocationTranslation(@PathParam("location") int locationid, @PathParam("id") int id, String jsonData) {
		System.out.println("LocationEndpoint: updateLocationTranslation");
		ObjectMapper mapper = new ObjectMapper();
		Locationtranslation updatedTranslation = null;    	
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Locationtranslation locationTranslation = entityManager.find(Locationtranslation.class, id);
		if ( locationTranslation == null ) return Response.status(Status.NOT_FOUND).build();
		// parse JSON data
		try {
			updatedTranslation = mapper.readValue(jsonData, Locationtranslation.class);
		} catch (IOException e) {
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( updatedTranslation == null ) return Response.notModified().build();				
		// update location translation
		if ( updatedTranslation.getName() != null ) locationTranslation.setName(updatedTranslation.getName());
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.merge(locationTranslation);
		entityManager.persist(locationTranslation);
		entityTransaction.commit();
		entityManager.refresh(locationTranslation);
		// add log entry
		UserLogManager.getLogger().addLogEntry((int) containerRequestContext.getProperty("TIMAAT.userID"), 
																						UserLogManager.LogEvents.LOCATIONEDITED);
		System.out.println("LocationEndpoint: updateLocationTranslation - updated");
		return Response.ok().entity(locationTranslation).build();
	}

	// not needed yet (should be necessary once several translations for an location exist and individual ones need to be removed)
	@DELETE
	@Produces(MediaType.APPLICATION_JSON)
	@Path("{location}/translation/{id}")
	@Secured
	public Response deleteLocationTranslation(@PathParam("location") int locationid, @PathParam("id") int id) {		
		System.out.println("LocationEndpoint: deleteLocationTranslation");
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Locationtranslation locationTranslation = entityManager.find(Locationtranslation.class, id);
		if ( locationTranslation == null ) return Response.status(Status.NOT_FOUND).build();	
		Location location = locationTranslation.getLocation();
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.remove(locationTranslation);
		entityTransaction.commit();
		entityManager.refresh(location);	
		// add log entry
		UserLogManager.getLogger().addLogEntry((int) containerRequestContext.getProperty("TIMAAT.userID"), 
																						UserLogManager.LogEvents.LOCATIONDELETED);
		return Response.ok().build();
	}

	@POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
	@Path("country/{id}")
	@Secured
	public Response createCountry(@PathParam("id") int id, String jsonData) {
		System.out.println("LocationEndpoint: createCountry jsonData: "+jsonData);
		ObjectMapper mapper = new ObjectMapper();
		Country newCountry = null;
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		// Location location = entityManager.find(Location.class, locationid);
		// parse JSON data
		try {
			newCountry = mapper.readValue(jsonData, Country.class);
		} catch (IOException e) {
			System.out.println("LocationEndpoint: createCountry: IOException e !");
			e.printStackTrace();
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( newCountry == null ) {
			System.out.println("LocationEndpoint: createCountry: newCountry == null !");
			return Response.status(Status.BAD_REQUEST).build();
		}
		// sanitize object data
		// System.out.println("LocationEndpoint: createCountry: set locationID" + locationid);
		// newCountry.setLocationID(locationid);
		// newCountry.setLocation(location);
		// update log metadata
		// Not necessary, a country will always be created in conjunction with a location
		// System.out.println("LocationEndpoint: createCountry: add creation info");
		// Timestamp creationDate = new Timestamp(System.currentTimeMillis());
		// newCountry.setCreatedAt(creationDate);
		// newCountry.setLastEditedAt(creationDate);
		// if ( containerRequestContext.getProperty("TIMAAT.userID") != null ) {
		// 	newCountry.setCreatedByUserAccountID((int) containerRequestContext.getProperty("TIMAAT.userID"));
		// 	newCountry.setLastEditedByUserAccountID((int) containerRequestContext.getProperty("TIMAAT.userID"));
		// } else {
		// 	// DEBUG do nothing - production system should abort with internal server error		
		// 	return Response.serverError().build();	
		// }
		System.out.println("LocationEndpoint: createCountry: persist country");
		// persist country
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.persist(newCountry);
		entityManager.flush();
		entityTransaction.commit();
		entityManager.refresh(newCountry);
		System.out.println("LocationEndpoint: createCountry: add log entry");	
		// add log entry
		UserLogManager.getLogger().addLogEntry(newCountry.getCreatedByUserAccountID(), UserLogManager.LogEvents.COUNTRYCREATED);
		System.out.println("LocationEndpoint: country created with id "+newCountry.getId());
		return Response.ok().entity(newCountry).build();
	}

	@PATCH
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
	@Path("country/{id}")
	@Secured
	public Response updateCountry(@PathParam("location") int locationid, @PathParam("id") int id, String jsonData) {
		System.out.println("LocationEndpoint: updateCountry - jsonData: " + jsonData);
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
		System.out.println("LocationEndpoint updateCountry - country.id:"+country.getId());		
		if ( updatedCountry.getInternationalDialingPrefix() != null ) country.setInternationalDialingPrefix(updatedCountry.getInternationalDialingPrefix());
		if ( updatedCountry.getTrunkPrefix() != null ) country.setTrunkPrefix(updatedCountry.getTrunkPrefix());
		if ( updatedCountry.getCountryCallingCode() != null ) country.setCountryCallingCode(updatedCountry.getCountryCallingCode());
		if ( updatedCountry.getTimeZone() != null ) country.setTimeZone(updatedCountry.getTimeZone());
		if ( updatedCountry.getDst() != null ) country.setDst(updatedCountry.getDst());
		// update log metadata
		country.getLocation().setLastEditedAt(new Timestamp(System.currentTimeMillis()));
		if ( containerRequestContext.getProperty("TIMAAT.userID") != null ) {
			country.getLocation().setLastEditedByUserAccountID((int) containerRequestContext.getProperty("TIMAAT.userID"));
		} else {
			// DEBUG do nothing - production system should abort with internal server error			
		}		
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.merge(country);
		entityManager.persist(country);
		entityTransaction.commit();
		entityManager.refresh(country);

		System.out.println("LocationEndpoint updateCountry - only logging remains");	
		// add log entry
		UserLogManager.getLogger().addLogEntry((int) containerRequestContext.getProperty("TIMAAT.userID"), 
																						UserLogManager.LogEvents.COUNTRYEDITED);
		System.out.println("LocationEndpoint updateCountry - all clear!");	
		return Response.ok().entity(country).build();
	}
}
