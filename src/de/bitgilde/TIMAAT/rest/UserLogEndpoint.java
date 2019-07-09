package de.bitgilde.TIMAAT.rest;

import javax.persistence.NoResultException;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.jvnet.hk2.annotations.Service;

import de.bitgilde.TIMAAT.TIMAATApp;
import de.bitgilde.TIMAAT.model.FIPOP.UserAccount;
import de.bitgilde.TIMAAT.security.UserLogManager;

/**
*
* @author Jens-Martin Loebel <loebel@bitgilde.de>
*/

@Service
@Path("/log")
public class UserLogEndpoint {

	@Context ContainerRequestContext crc;
	

	@GET
    @Produces(MediaType.APPLICATION_JSON)
	@Path("user/{id}")
	@Secured
	public Response getUserLog(@PathParam("id") int id) {
    	

		UserAccount user = null;
		try {
			user = (UserAccount) TIMAATApp.emf.createEntityManager()
				.createQuery("SELECT ua FROM UserAccount ua WHERE ua.id=:id")
				.setParameter("id", id)
				.getSingleResult();
		} catch (NoResultException e) {
			return Response.status(Status.NOT_FOUND).entity("User not found!").build();
		}
		if ( user == null ) return Response.status(Status.NOT_FOUND).entity("User not found!").build();
		
		return Response.ok().entity(UserLogManager.getLogger().getLogForUser(user.getId(), 20)).build();
	}

}
