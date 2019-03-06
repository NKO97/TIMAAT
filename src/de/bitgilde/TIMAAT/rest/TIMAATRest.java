package de.bitgilde.TIMAAT.rest;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import javax.persistence.PersistenceContext;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.SecurityContext;

import de.bitgilde.TIMAAT.model.FIPOP.UserAccount;

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
		
		EntityManagerFactory emf = Persistence.createEntityManagerFactory("FIPOP-JPA");
		
		UserAccount ua = emf.createEntityManager().find(UserAccount.class, msgContext.getProperty("TIMAAT.userID"));

		// return HTTP response 200 in case of success
		return Response.status(200).entity(ua).build();
	}
}
