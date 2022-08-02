package de.bitgilde.TIMAAT.rest.endpoint;

import java.io.IOException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import com.fasterxml.jackson.databind.ObjectMapper;

import org.jvnet.hk2.annotations.Service;

import de.bitgilde.TIMAAT.TIMAATApp;
import de.bitgilde.TIMAAT.model.FIPOP.City;
import de.bitgilde.TIMAAT.model.FIPOP.Country;
import de.bitgilde.TIMAAT.model.FIPOP.County;
import de.bitgilde.TIMAAT.model.FIPOP.Language;
import de.bitgilde.TIMAAT.model.FIPOP.Location;
import de.bitgilde.TIMAAT.model.FIPOP.LocationTranslation;
import de.bitgilde.TIMAAT.model.FIPOP.LocationType;
import de.bitgilde.TIMAAT.model.FIPOP.Province;
import de.bitgilde.TIMAAT.model.FIPOP.Street;
import de.bitgilde.TIMAAT.model.FIPOP.UserAccount;
import de.bitgilde.TIMAAT.rest.Secured;
import de.bitgilde.TIMAAT.security.UserLogManager;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityTransaction;
import jakarta.servlet.ServletContext;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.PATCH;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.Response.Status;
import jakarta.ws.rs.core.UriInfo;

/**
*
* @author Jens-Martin Loebel <loebel@bitgilde.de>
* @author Mirko Scherf <mscherf@uni-mainz.de>
*/

@Service
@Path("/location")
public class EndpointLocation {
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
	public Response getLocationList() {
		List<Location> locationList = castList(Location.class, TIMAATApp.emf.createEntityManager().createNamedQuery("Location.findAll").getResultList());
		return Response.ok().entity(locationList).build();
	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("locationType/list")
	public Response getLocationTypeList() {
		List<LocationType> locationTypeList = castList(LocationType.class, TIMAATApp.emf.createEntityManager().createNamedQuery("LocationType.findAll").getResultList());
		return Response.ok().entity(locationTypeList).build();
	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("country/list")
	public Response getCountryList() {
		List<Country> countryList = castList(Country.class, TIMAATApp.emf.createEntityManager().createNamedQuery("Country.findAll").getResultList());
		return Response.ok().entity(countryList).build();
	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("province/list")
	public Response getProvinceList() {
		List<Province> provinceList = castList(Province.class, TIMAATApp.emf.createEntityManager().createNamedQuery("Province.findAll").getResultList());
		return Response.ok().entity(provinceList).build();
	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("county/list")
	public Response getCountyList() {
		List<County> countyList = castList(County.class, TIMAATApp.emf.createEntityManager().createNamedQuery("County.findAll").getResultList());
		return Response.ok().entity(countyList).build();
	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("city/list")
	public Response getCityList() {
		List<City> cityList = castList(City.class, TIMAATApp.emf.createEntityManager().createNamedQuery("City.findAll").getResultList());
		return Response.ok().entity(cityList).build();
	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("street/list")
	public Response getStreetList() {
		List<Street> streetList = castList(Street.class, TIMAATApp.emf.createEntityManager().createNamedQuery("Street.findAll").getResultList());
		return Response.ok().entity(streetList).build();
	}

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
	@Path("country/{id}")
	public Response getCountry(@PathParam("id") int id) {

		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Country country = entityManager.find(Country.class, id);
		if ( country == null ) return Response.status(Status.NOT_FOUND).build();

		return Response.ok().entity(country).build();

	}

	@GET
  @Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("all")
	public Response getAllLocations() {
		// System.out.println("EndpointLocation: getAllLocations");
		List<Location> locations = null;
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		try {
			locations = castList(Location.class, entityManager.createQuery("SELECT l from Location l")
						.getResultList());
		} catch(Exception e) {};
		return Response.ok().entity(locations).build();
	}

	@GET
  @Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("locationType/all")
	public Response getAllLocationTypes() {
		// System.out.println("EndpointLocation: getAllLocations");
		List<LocationType> locationTypes = null;
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		try {
			locationTypes = castList(LocationType.class, entityManager.createQuery("SELECT lt from LocationType lt")
						.getResultList());
		} catch(Exception e) {};
		return Response.ok().entity(locationTypes).build();
	}

	@GET
  @Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("country/all")
	public Response getAllCountries() {
		List<Country> countries = null;
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		try {
			countries = castList(Country.class, entityManager.createQuery("SELECT c from Country c")
				.getResultList());
		} catch(Exception e) {};
		return Response.ok().entity(countries).build();
	}

	@POST
  @Produces(MediaType.APPLICATION_JSON)
  @Consumes(MediaType.APPLICATION_JSON)
	@Path("{id}")
	@Secured
	public Response createLocation(@PathParam("id") int id, String jsonData) {

		// System.out.println("EndpointLocation: createLocation: " + jsonData);
		ObjectMapper mapper = new ObjectMapper();
		Location newLocation = null;
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();

		// parse JSON data
		try {
			newLocation = mapper.readValue(jsonData, Location.class);
		} catch (IOException e) {
			System.out.println("EndpointLocation: createLocation - IOException");
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( newLocation == null ) {
			System.out.println("EndpointLocation: createLocation - newLocation == 0");
			return Response.status(Status.BAD_REQUEST).build();
		}
		// sanitize object data
		newLocation.setId(0);

		// update log metadata
		Timestamp creationDate = new Timestamp(System.currentTimeMillis());
		newLocation.setCreatedAt(creationDate);
		newLocation.setLastEditedAt(creationDate);
		if ( containerRequestContext.getProperty("TIMAAT.userID") != null ) {
			newLocation.setCreatedByUserAccount(entityManager.find(UserAccount.class, containerRequestContext.getProperty("TIMAAT.userID")));
			newLocation.setLastEditedByUserAccount((entityManager.find(UserAccount.class, containerRequestContext.getProperty("TIMAAT.userID"))));
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
		UserLogManager.getLogger().addLogEntry(newLocation.getCreatedByUserAccount().getId(), UserLogManager.LogEvents.LOCATIONCREATED);

		return Response.ok().entity(newLocation).build();

	}

	@PATCH
  @Produces(MediaType.APPLICATION_JSON)
  @Consumes(MediaType.APPLICATION_JSON)
	@Path("{id}")
	@Secured
	public Response updateLocation(@PathParam("id") int id, String jsonData) {

		// System.out.println("EndpointLocation: UPDATE LOCATION - jsonData"+ jsonData);
		ObjectMapper mapper = new ObjectMapper();
		Location updatedLocation = null;
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Location location = entityManager.find(Location.class, id);

		if ( location == null ) return Response.status(Status.NOT_FOUND).build();
		// parse JSON data
		try {
			updatedLocation = mapper.readValue(jsonData, Location.class);
		} catch (IOException e) {
			System.out.println("EndpointLocation: UPDATE LOCATION - IOException");
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( updatedLocation == null ) return Response.notModified().build();
		// update location

		// update log metadata
		location.setLastEditedAt(new Timestamp(System.currentTimeMillis()));
		if ( containerRequestContext.getProperty("TIMAAT.userID") != null ) {
			location.setLastEditedByUserAccount((entityManager.find(UserAccount.class, containerRequestContext.getProperty("TIMAAT.userID"))));
		} else {
			// DEBUG do nothing - production system should abort with internal server error
		}

		// persist location
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
		// System.out.println("EndpointLocation: deleteLocation");
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Location location = entityManager.find(Location.class, id);
		if ( location == null ) return Response.status(Status.NOT_FOUND).build();

		// persist location
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
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
	@Path("{locationId}/translation/{id}")
	public Response createLocationTranslation(@PathParam("locationId") int locationId, @PathParam("id") int id, String jsonData) {

		// System.out.println("EndpointLocation: createLocationTranslation jsonData: "+jsonData);
		ObjectMapper mapper = new ObjectMapper();
		LocationTranslation newTranslation = null;
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Location location = entityManager.find(Location.class, locationId);

		if ( location == null ) return Response.status(Status.NOT_FOUND).build();
		// parse JSON data
		try {
			newTranslation = mapper.readValue(jsonData, LocationTranslation.class);
		} catch (IOException e) {
			e.printStackTrace();
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( newTranslation == null ) return Response.status(Status.BAD_REQUEST).build();

		// sanitize object data
		newTranslation.setId(0);
		newTranslation.setLocation(location);
		Language language = entityManager.find(Language.class, newTranslation.getLanguage().getId());
		newTranslation.setLanguage(language);
		location.addLocationTranslation(newTranslation);

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

		// add log entry (always in conjunction with location creation)
		// UserLogManager.getLogger().addLogEntry((int) containerRequestContext.getProperty("TIMAAT.userID"),
		// 																				UserLogManager.LogEvents.LOCATIONCREATED);

		return Response.ok().entity(newTranslation).build();

	}

	@PATCH
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Secured
	@Path("{locationId}/translation/{id}")
	public Response updateLocationTranslation(@PathParam("locationId") int locationId, @PathParam("id") int id, String jsonData) {

		// System.out.println("EndpointLocation: updateLocationTranslation - jsonData"+ jsonData);
		ObjectMapper mapper = new ObjectMapper();
		LocationTranslation updatedTranslation = null;
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		LocationTranslation locationTranslation = entityManager.find(LocationTranslation.class, id);

		if ( locationTranslation == null ) return Response.status(Status.NOT_FOUND).build();
		// parse JSON data
		try {
			updatedTranslation = mapper.readValue(jsonData, LocationTranslation.class);
		} catch (IOException e) {
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( updatedTranslation == null ) return Response.notModified().build();

		// update location translation
		if ( updatedTranslation.getName() != null ) locationTranslation.setName(updatedTranslation.getName());

		// persist location translation
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.merge(locationTranslation);
		entityManager.persist(locationTranslation);
		entityTransaction.commit();
		entityManager.refresh(locationTranslation);

		// add log entry
		UserLogManager.getLogger().addLogEntry((int) containerRequestContext.getProperty("TIMAAT.userID"),
																						UserLogManager.LogEvents.LOCATIONEDITED);

		return Response.ok().entity(locationTranslation).build();

	}

	// not needed yet (should be necessary once several translations for an location exist and individual ones need to be removed)
	@DELETE
	@Produces(MediaType.APPLICATION_JSON)
	@Path("{locationId}/translation/{id}")
	@Secured
	public Response deleteLocationTranslation(@PathParam("locationId") int locationId, @PathParam("id") int id) {

		// System.out.println("EndpointLocation: deleteLocationTranslation");
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		LocationTranslation locationTranslation = entityManager.find(LocationTranslation.class, id);

		if ( locationTranslation == null ) return Response.status(Status.NOT_FOUND).build();

		// sanitize location translation
		Location location = locationTranslation.getLocation();

		// persist location translation
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

		// System.out.println("EndpointLocation: createCountry jsonData: "+jsonData);
		ObjectMapper mapper = new ObjectMapper();
		Country newCountry = null;
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();

		// parse JSON data
		try {
			newCountry = mapper.readValue(jsonData, Country.class);
		} catch (IOException e) {
			System.out.println("EndpointLocation: createCountry: IOException e !");
			e.printStackTrace();
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( newCountry == null ) {
			System.out.println("EndpointLocation: createCountry: newCountry == null !");
			return Response.status(Status.BAD_REQUEST).build();
		}
		// sanitize object data

		// update log metadata
		// Not necessary, a country will always be created in conjunction with a location

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
	@Path("country/{id}")
	@Secured
	public Response updateCountry(@PathParam("id") int id, String jsonData) {

		// System.out.println("EndpointLocation: UPDATE COUNTRY - jsonData: " + jsonData);
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
		if ( updatedCountry.getInternationalDialingPrefix() != null ) country.setInternationalDialingPrefix(updatedCountry.getInternationalDialingPrefix());
		if ( updatedCountry.getTrunkPrefix() != null ) country.setTrunkPrefix(updatedCountry.getTrunkPrefix());
		if ( updatedCountry.getCountryCallingCode() != null ) country.setCountryCallingCode(updatedCountry.getCountryCallingCode());
		if ( updatedCountry.getTimeZone() != null ) country.setTimeZone(updatedCountry.getTimeZone());
		if ( updatedCountry.getDaylightSavingTime() != null ) country.setDaylightSavingTime(updatedCountry.getDaylightSavingTime());

		// update log metadata
		country.getLocation().setLastEditedAt(new Timestamp(System.currentTimeMillis()));
		if ( containerRequestContext.getProperty("TIMAAT.userID") != null ) {
			country.getLocation().setLastEditedByUserAccount((entityManager.find(UserAccount.class, containerRequestContext.getProperty("TIMAAT.userID"))));
		} else {
			// DEBUG do nothing - production system should abort with internal server error
		}

		// persist country
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
	@Path("country/{id}")
	@Secured
	public Response deleteCountry(@PathParam("id") int id) {

		// System.out.println("EndpointLocation: deleteCountry with id: "+ id);
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Location location = entityManager.find(Location.class, id);

		if ( location == null ) return Response.status(Status.NOT_FOUND).build();
		Country country = entityManager.find(Country.class, id);
		if ( country == null ) return Response.status(Status.NOT_FOUND).build();

		// persist country
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.remove(country);
		entityManager.remove(country.getLocation()); // remove country, then corresponding location
		entityTransaction.commit();

		// add log entry
		UserLogManager.getLogger().addLogEntry((int) containerRequestContext.getProperty("TIMAAT.userID"),
																						UserLogManager.LogEvents.COUNTRYDELETED);

		return Response.ok().build();

	}

	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("province/{id}")
	@Secured
	public Response createProvince(@PathParam("id") int id, String jsonData) {

		// System.out.println("EndpointLocation: createProvince jsonData: "+jsonData);
		ObjectMapper mapper = new ObjectMapper();
		Province newProvince = null;
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();

		// parse JSON data
		try {
			newProvince = mapper.readValue(jsonData, Province.class);
		} catch (IOException e) {
			System.out.println("EndpointLocation: createProvince: IOException e !");
			e.printStackTrace();
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( newProvince == null ) {
			System.out.println("EndpointLocation: createProvince: newProvince == null !");
			return Response.status(Status.BAD_REQUEST).build();
		}
		// sanitize object data

		// update log metadata
		// Not necessary, a province will always be created in conjunction with a location

		// persist province
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.persist(newProvince);
		entityManager.flush();
		entityTransaction.commit();
		entityManager.refresh(newProvince);

		// add log entry
		UserLogManager.getLogger().addLogEntry(newProvince.getLocation().getCreatedByUserAccount().getId(), UserLogManager.LogEvents.PROVINCECREATED);

		return Response.ok().entity(newProvince).build();

	}

	@PATCH
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("province/{id}")
	@Secured
	public Response updateProvince(@PathParam("id") int id, String jsonData) {

		// System.out.println("EndpointLocation: UPDATE PROVINCE - jsonData: " + jsonData);
		ObjectMapper mapper = new ObjectMapper();
		Province updatedProvince = null;
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Province province = entityManager.find(Province.class, id);

		if ( province == null ) return Response.status(Status.NOT_FOUND).build();

		// parse JSON data
		try {
			updatedProvince = mapper.readValue(jsonData, Province.class);
		} catch (IOException e) {
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( updatedProvince == null ) return Response.notModified().build();

		// update province

		// update log metadata
		province.getLocation().setLastEditedAt(new Timestamp(System.currentTimeMillis()));
		if ( containerRequestContext.getProperty("TIMAAT.userID") != null ) {
			province.getLocation().setLastEditedByUserAccount((entityManager.find(UserAccount.class, containerRequestContext.getProperty("TIMAAT.userID"))));
		} else {
			// DEBUG do nothing - production system should abort with internal server error
		}

		// persist province
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.merge(province);
		entityManager.persist(province);
		entityTransaction.commit();
		entityManager.refresh(province);

		// add log entry
		UserLogManager.getLogger().addLogEntry((int) containerRequestContext.getProperty("TIMAAT.userID"),
																						UserLogManager.LogEvents.PROVINCEEDITED);

		return Response.ok().entity(province).build();

	}

	@DELETE
	@Produces(MediaType.APPLICATION_JSON)
	@Path("province/{id}")
	@Secured
	public Response deleteProvince(@PathParam("id") int id) {

		// System.out.println("EndpointLocation: deleteProvince with id: "+ id);
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Location location = entityManager.find(Location.class, id);

		if ( location == null ) return Response.status(Status.NOT_FOUND).build();
		Province province = entityManager.find(Province.class, id);
		if ( province == null ) return Response.status(Status.NOT_FOUND).build();

		// persist province
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.remove(province);
		entityManager.remove(province.getLocation()); // remove province, then corresponding location
		entityTransaction.commit();

		// add log entry
		UserLogManager.getLogger().addLogEntry((int) containerRequestContext.getProperty("TIMAAT.userID"),
																						UserLogManager.LogEvents.PROVINCEDELETED);

		return Response.ok().build();

	}

	@POST
  @Produces(MediaType.APPLICATION_JSON)
  @Consumes(MediaType.APPLICATION_JSON)
	@Path("county/{id}")
	@Secured
	public Response createCounty(@PathParam("id") int id, String jsonData) {

		// System.out.println("EndpointLocation: createCounty jsonData: "+jsonData);
		ObjectMapper mapper = new ObjectMapper();
		County newCounty = null;
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();

		// parse JSON data
		try {
			newCounty = mapper.readValue(jsonData, County.class);
		} catch (IOException e) {
			System.out.println("EndpointLocation: createCounty: IOException e !");
			e.printStackTrace();
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( newCounty == null ) {
			System.out.println("EndpointLocation: createCounty: newCounty == null !");
			return Response.status(Status.BAD_REQUEST).build();
		}
		// sanitize object data

		// update log metadata
		// Not necessary, a county will always be created in conjunction with a location

		// persist county
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.persist(newCounty);
		entityManager.flush();
		entityTransaction.commit();
		entityManager.refresh(newCounty);

		// add log entry
		UserLogManager.getLogger().addLogEntry(newCounty.getLocation().getCreatedByUserAccount().getId(), UserLogManager.LogEvents.COUNTYCREATED);

		return Response.ok().entity(newCounty).build();

	}

	@PATCH
  @Produces(MediaType.APPLICATION_JSON)
  @Consumes(MediaType.APPLICATION_JSON)
	@Path("county/{id}")
	@Secured
	public Response updateCounty(@PathParam("id") int id, String jsonData) {

		// System.out.println("EndpointLocation: UPDATE COUNTY - jsonData: " + jsonData);
		ObjectMapper mapper = new ObjectMapper();
		County updatedCounty = null;
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		County county = entityManager.find(County.class, id);

		if ( county == null ) return Response.status(Status.NOT_FOUND).build();

		// parse JSON data
		try {
			updatedCounty = mapper.readValue(jsonData, County.class);
		} catch (IOException e) {
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( updatedCounty == null ) return Response.notModified().build();

		// update county

		// update log metadata
		county.getLocation().setLastEditedAt(new Timestamp(System.currentTimeMillis()));
		if ( containerRequestContext.getProperty("TIMAAT.userID") != null ) {
			county.getLocation().setLastEditedByUserAccount((entityManager.find(UserAccount.class, containerRequestContext.getProperty("TIMAAT.userID"))));
		} else {
			// DEBUG do nothing - production system should abort with internal server error
		}

		// persist county
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.merge(county);
		entityManager.persist(county);
		entityTransaction.commit();
		entityManager.refresh(county);

		// add log entry
		UserLogManager.getLogger().addLogEntry((int) containerRequestContext.getProperty("TIMAAT.userID"),
																						UserLogManager.LogEvents.COUNTYEDITED);

		return Response.ok().entity(county).build();

	}

	@DELETE
	@Produces(MediaType.APPLICATION_JSON)
	@Path("county/{id}")
	@Secured
	public Response deleteCounty(@PathParam("id") int id) {

		// System.out.println("EndpointLocation: deleteCounty with id: "+ id);
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Location location = entityManager.find(Location.class, id);

		if ( location == null ) return Response.status(Status.NOT_FOUND).build();
		County county = entityManager.find(County.class, id);
		if ( county == null ) return Response.status(Status.NOT_FOUND).build();

		// persist county
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.remove(county);
		entityManager.remove(county.getLocation()); // remove county, then corresponding location
		entityTransaction.commit();

		// add log entry
		UserLogManager.getLogger().addLogEntry((int) containerRequestContext.getProperty("TIMAAT.userID"),
																						UserLogManager.LogEvents.COUNTYDELETED);

		return Response.ok().build();

	}

	@POST
  @Produces(MediaType.APPLICATION_JSON)
  @Consumes(MediaType.APPLICATION_JSON)
	@Path("city/{id}")
	@Secured
	public Response createCity(@PathParam("id") int id, String jsonData) {

		// System.out.println("EndpointLocation: createCity jsonData: "+jsonData);
		ObjectMapper mapper = new ObjectMapper();
		City newCity = null;
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();

		// parse JSON data
		try {
			newCity = mapper.readValue(jsonData, City.class);
		} catch (IOException e) {
			System.out.println("EndpointLocation: createCity: IOException e !");
			e.printStackTrace();
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( newCity == null ) {
			System.out.println("EndpointLocation: createCity: newCity == null !");
			return Response.status(Status.BAD_REQUEST).build();
		}
		// sanitize object data

		// update log metadata
		// Not necessary, a city will always be created in conjunction with a location

		// persist city
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.persist(newCity);
		entityManager.flush();
		entityTransaction.commit();
		entityManager.refresh(newCity);

		// add log entry
		UserLogManager.getLogger().addLogEntry(newCity.getLocation().getCreatedByUserAccount().getId(), UserLogManager.LogEvents.CITYCREATED);

		return Response.ok().entity(newCity).build();

	}

	@PATCH
  @Produces(MediaType.APPLICATION_JSON)
  @Consumes(MediaType.APPLICATION_JSON)
	@Path("city/{id}")
	@Secured
	public Response updateCity(@PathParam("id") int id, String jsonData) {

		// System.out.println("EndpointLocation: UPDATE CITY - jsonData: " + jsonData);
		ObjectMapper mapper = new ObjectMapper();
		City updatedCity = null;
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		City city = entityManager.find(City.class, id);

		if ( city == null ) return Response.status(Status.NOT_FOUND).build();

		// parse JSON data
		try {
			updatedCity = mapper.readValue(jsonData, City.class);
		} catch (IOException e) {
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( updatedCity == null ) return Response.notModified().build();

		// update city

		// update log metadata
		city.getLocation().setLastEditedAt(new Timestamp(System.currentTimeMillis()));
		if ( containerRequestContext.getProperty("TIMAAT.userID") != null ) {
			city.getLocation().setLastEditedByUserAccount((entityManager.find(UserAccount.class, containerRequestContext.getProperty("TIMAAT.userID"))));
		} else {
			// DEBUG do nothing - production system should abort with internal server error
		}

		// persist city
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.merge(city);
		entityManager.persist(city);
		entityTransaction.commit();
		entityManager.refresh(city);

		// add log entry
		UserLogManager.getLogger().addLogEntry((int) containerRequestContext.getProperty("TIMAAT.userID"),
																						UserLogManager.LogEvents.CITYEDITED);

		return Response.ok().entity(city).build();

	}

	@DELETE
	@Produces(MediaType.APPLICATION_JSON)
	@Path("city/{id}")
	@Secured
	public Response deleteCity(@PathParam("id") int id) {

		// System.out.println("EndpointLocation: deleteCity with id: "+ id);
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Location location = entityManager.find(Location.class, id);

		if ( location == null ) return Response.status(Status.NOT_FOUND).build();
		City city = entityManager.find(City.class, id);
		if ( city == null ) return Response.status(Status.NOT_FOUND).build();

		// persist city
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.remove(city);
		entityManager.remove(city.getLocation()); // remove city, then corresponding location
		entityTransaction.commit();

		// add log entry
		UserLogManager.getLogger().addLogEntry((int) containerRequestContext.getProperty("TIMAAT.userID"),
																						UserLogManager.LogEvents.CITYDELETED);

		return Response.ok().build();

	}

	@POST
  @Produces(MediaType.APPLICATION_JSON)
  @Consumes(MediaType.APPLICATION_JSON)
	@Path("street/{id}")
	@Secured
	public Response createStreet(@PathParam("id") int id, String jsonData) {

		// System.out.println("EndpointLocation: createStreet jsonData: "+jsonData);
		ObjectMapper mapper = new ObjectMapper();
		Street newStreet = null;
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();

		// parse JSON data
		try {
			newStreet = mapper.readValue(jsonData, Street.class);
		} catch (IOException e) {
			System.out.println("EndpointLocation: createStreet: IOException e !");
			e.printStackTrace();
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( newStreet == null ) {
			System.out.println("EndpointLocation: createStreet: newStreet == null !");
			return Response.status(Status.BAD_REQUEST).build();
		}
		// sanitize object data

		// update log metadata
		// Not necessary, a street will always be created in conjunction with a location

		// persist street
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.persist(newStreet);
		entityManager.flush();
		entityTransaction.commit();
		entityManager.refresh(newStreet);

		// add log entry
		UserLogManager.getLogger().addLogEntry(newStreet.getLocation().getCreatedByUserAccount().getId(), UserLogManager.LogEvents.STREETCREATED);

		return Response.ok().entity(newStreet).build();

	}

	@PATCH
  @Produces(MediaType.APPLICATION_JSON)
  @Consumes(MediaType.APPLICATION_JSON)
	@Path("street/{id}")
	@Secured
	public Response updateStreet(@PathParam("id") int id, String jsonData) {

		// System.out.println("EndpointLocation: UPDATE STREET - jsonData: " + jsonData);
		ObjectMapper mapper = new ObjectMapper();
		Street updatedStreet = null;
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Street street = entityManager.find(Street.class, id);

		if ( street == null ) return Response.status(Status.NOT_FOUND).build();

		// parse JSON data
		try {
			updatedStreet = mapper.readValue(jsonData, Street.class);
		} catch (IOException e) {
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( updatedStreet == null ) return Response.notModified().build();

		// update street

		// update log metadata
		street.getLocation().setLastEditedAt(new Timestamp(System.currentTimeMillis()));
		if ( containerRequestContext.getProperty("TIMAAT.userID") != null ) {
			street.getLocation().setLastEditedByUserAccount((entityManager.find(UserAccount.class, containerRequestContext.getProperty("TIMAAT.userID"))));
		} else {
			// DEBUG do nothing - production system should abort with internal server error
		}

		// persist street
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.merge(street);
		entityManager.persist(street);
		entityTransaction.commit();
		entityManager.refresh(street);

		// add log entry
		UserLogManager.getLogger().addLogEntry((int) containerRequestContext.getProperty("TIMAAT.userID"),
																						UserLogManager.LogEvents.STREETEDITED);

		return Response.ok().entity(street).build();

	}

	@DELETE
	@Produces(MediaType.APPLICATION_JSON)
	@Path("street/{id}")
	@Secured
	public Response deleteStreet(@PathParam("id") int id) {

		// System.out.println("EndpointLocation: deleteStreet with id: "+ id);
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Location location = entityManager.find(Location.class, id);

		if ( location == null ) return Response.status(Status.NOT_FOUND).build();
		Street street = entityManager.find(Street.class, id);
		if ( street == null ) return Response.status(Status.NOT_FOUND).build();

		// persist street
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.remove(street);
		entityManager.remove(street.getLocation()); // remove street, then corresponding location
		entityTransaction.commit();

		// add log entry
		UserLogManager.getLogger().addLogEntry((int) containerRequestContext.getProperty("TIMAAT.userID"),
																						UserLogManager.LogEvents.STREETDELETED);

		return Response.ok().build();

	}

	public static <T> List<T> castList(Class<? extends T> clazz, Collection<?> c) {
    List<T> r = new ArrayList<T>(c.size());
    for(Object o: c)
      r.add(clazz.cast(o));
    return r;
	}
}
