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
import de.bitgilde.TIMAAT.model.FIPOP.Language;
import de.bitgilde.TIMAAT.model.FIPOP.Location;
import de.bitgilde.TIMAAT.model.FIPOP.LocationTranslation;
import de.bitgilde.TIMAAT.model.FIPOP.LocationType;
import de.bitgilde.TIMAAT.security.UserLogManager;

/**
*
* @author Jens-Martin Loebel <loebel@bitgilde.de>
* @author Mirko Scherf <mscherf@uni-mainz.de>
*/

@Service
@Path("/locationtype")
public class LocationTypeEndpoint {
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
	public Response getLocationtypeList() {
		System.out.println("LocationTypeEndpoint getLocationTypeList");		
		@SuppressWarnings("unchecked")
		List<LocationType> locationTypeList = TIMAATApp.emf.createEntityManager().createNamedQuery("LocationType.findAll").getResultList();
		return Response.ok().entity(locationTypeList).build();
	}
	
	@SuppressWarnings("unchecked")
	@GET
    @Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("all")
	public Response getAllLocationTypess() {
		System.out.println("LocationTypeEndpoint: getAllLocations");
		List<LocationType> locationTypes = null;    	
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		try {
			locationTypes = (List<LocationType>) entityManager.createQuery("SELECT l from LocationType l")
						.getResultList();
		} catch(Exception e) {};	  	
		return Response.ok().entity(locationTypes).build();
	}
  
}