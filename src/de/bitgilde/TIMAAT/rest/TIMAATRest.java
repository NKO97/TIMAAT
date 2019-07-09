package de.bitgilde.TIMAAT.rest;

import javax.persistence.EntityManager;

import javax.persistence.PersistenceContext;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.SecurityContext;

import de.bitgilde.TIMAAT.TIMAATApp;
import de.bitgilde.TIMAAT.model.FIPOP.UserAccount;

/**
*
* @author Jens-Martin Loebel <loebel@bitgilde.de>
*/
@Path("/")
public class TIMAATRest {
	
	@PersistenceContext(unitName = "FIPOP-JPA")
    private EntityManager em;

	@Context
    private SecurityContext securityContext;
	
    @Context 
    private ContainerRequestContext msgContext;

	@GET
	@Path("/verify")
	@Produces(MediaType.APPLICATION_JSON)
	@Secured
    public Response verifyRESTService() {
		
		
		
		UserAccount ua = TIMAATApp.emf.createEntityManager().find(UserAccount.class, msgContext.getProperty("TIMAAT.userID"));

		// return HTTP response 200 in case of success
		return Response.status(200).entity(ua).build();
	}
}
