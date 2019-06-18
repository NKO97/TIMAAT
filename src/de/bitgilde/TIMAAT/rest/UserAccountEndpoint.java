package de.bitgilde.TIMAAT.rest;

import javax.persistence.EntityManagerFactory;
import javax.persistence.NoResultException;
import javax.persistence.Persistence;
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

import de.bitgilde.TIMAAT.model.FIPOP.UserAccount;

/**
*
* @author Jens-Martin Loebel <loebel@bitgilde.de>
*/

@Service
@Path("/user")
public class UserAccountEndpoint {
	
	@Context ContainerRequestContext crc;
	

	@GET
    @Produces(MediaType.TEXT_PLAIN)
	@Path("{id}/name")
	@Secured
	public Response getUserName(@PathParam("id") int id) {
    	EntityManagerFactory emf = Persistence.createEntityManagerFactory("FIPOP-JPA");

		UserAccount user = null;
		try {
			user = (UserAccount) emf.createEntityManager()
				.createQuery("SELECT ua FROM UserAccount ua WHERE ua.id=:id")
				.setParameter("id", id)
				.getSingleResult();
		} catch (NoResultException e) {
			return Response.status(Status.NOT_FOUND).entity("User not found!").build();
		}
		if ( user == null ) return Response.status(Status.NOT_FOUND).entity("User not found!").build();
		
		return Response.ok().entity(user.getAccountName()).build();
	}
}
