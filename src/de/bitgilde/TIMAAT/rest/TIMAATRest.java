package de.bitgilde.TIMAAT.rest;

import de.bitgilde.TIMAAT.TIMAATApp;
import de.bitgilde.TIMAAT.model.FIPOP.UserAccount;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;

/**
 * @author Jens-Martin Loebel <loebel@bitgilde.de>
 * @author Mirko Scherf <mscherf@uni-mainz.de>
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
