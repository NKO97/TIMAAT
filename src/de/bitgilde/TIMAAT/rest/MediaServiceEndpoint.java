package de.bitgilde.TIMAAT.rest;

import java.io.File;
import java.security.Key;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.NoResultException;
import javax.persistence.NonUniqueResultException;
import javax.persistence.Persistence;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.core.UriInfo;

import org.jvnet.hk2.annotations.Service;

import de.bitgilde.TIMAAT.model.FIPOP.Medium;
import de.bitgilde.TIMAAT.model.FIPOP.MediumAnalysisList;
import de.bitgilde.TIMAAT.security.TIMAATKeyGenerator;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

/**
*
* @author Jens-Martin Loebel <loebel@bitgilde.de>
*/

@Service
@Path("/media")
public class MediaServiceEndpoint {

	@Context
	private UriInfo uriInfo;

	
	@GET
    @Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("{id}")
	public Response getMediaInfo(@PathParam("id") int id) {
    	EntityManagerFactory emf = Persistence.createEntityManagerFactory("FIPOP-JPA");
    	Medium m = emf.createEntityManager().find(Medium.class, id);   
    	if ( m == null ) return Response.status(Status.NOT_FOUND).build();
    	
    	m.setViewToken(issueFileToken(m.getId()));
    	
		return Response.ok().entity(m).build();
	}

	@GET
    @Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("list")
	public Response getMediaList() {
    	EntityManagerFactory emf = Persistence.createEntityManagerFactory("FIPOP-JPA");
    	@SuppressWarnings("unchecked")
		List<Medium> mlist = emf.createEntityManager().createNamedQuery("Medium.findAll").getResultList();
    	
    	for (Medium m : mlist ) {
        	m.setViewToken(issueFileToken(m.getId()));
    	}
    	
		return Response.ok().entity(mlist).build();
	}

	@GET
	@Path("{id}/download")
	public Response getMediaFile(
			@Context HttpHeaders headers,
			@PathParam("id") int id,
			@QueryParam("token") String fileToken) {
		
		// verify token
		if ( fileToken == null ) return Response.status(401).build();
		int tokenMediumID = 0;
		try {
			tokenMediumID = validateFileToken(fileToken);
		} catch (Exception e) {
			return Response.status(401).build();
		}		
		if ( tokenMediumID != id ) return Response.status(401).build();
		
    	EntityManagerFactory emf = Persistence.createEntityManagerFactory("FIPOP-JPA");
    	Medium m = emf.createEntityManager().find(Medium.class, id);
    	if ( m == null ) return Response.status(Status.NOT_FOUND).build();
		
		
		return downloadFile(m.getFilePath(), headers);
	}
	
	/**
	 * Gets list of annotations for medium (video)
	 * @param id
	 * @return
	 */
	@GET
    @Produces(MediaType.APPLICATION_JSON)
	@Path("{id}/list")
	@Secured
	public Response getAnnotationList(@PathParam("id") int id) {
    	EntityManagerFactory emf = Persistence.createEntityManagerFactory("FIPOP-JPA");
    	EntityManager em = emf.createEntityManager();

    	// find medium
    	Medium m = em.find(Medium.class, id);
    	if ( m == null ) return Response.status(Status.NOT_FOUND).build();
    	
    	// find first medium analysis list
    	MediumAnalysisList mal = null;
    	try {
    		mal = (MediumAnalysisList) em
    				.createQuery("SELECT mal FROM MediumAnalysisList mal WHERE mal.medium=:medium")
    				.setParameter("medium", m)
        			.getSingleResult();
    	} catch (NoResultException | NonUniqueResultException e) {
    		return Response.status(Status.NOT_FOUND).build();
    	}
    	if ( mal == null ) return Response.status(Status.NOT_FOUND).build();

    	em.refresh(mal);
    	
    	return Response.ok(mal).build();
    	
	}
	
	
	

	private Response downloadFile(String fileName, HttpHeaders headers) {     
		Response response = null;

		// Retrieve the file 
		File file = new File(fileName);

		if (file.exists()) {
			ResponseBuilder builder = Response.ok();
			builder.header("Accept-Ranges", "bytes");
			if ( headers.getRequestHeaders().containsKey("Range") ) {
				String rangeHeader = headers.getHeaderString("Range");
				String[] acceptRanges = rangeHeader.split("=");
				if ( acceptRanges.length < 2 ) return Response.status(Status.BAD_REQUEST).build();
			}

			int from,to=0;
			if (!headers.getRequestHeaders().containsKey("Range")) {
				builder.header("Content-Length", file.length());
				builder.header("Content-Type", "video/"+file.getName().substring(file.getName().lastIndexOf('.')+1));
				from = 0;
				to = (int)file.length();
			} else {
				String rangeHeader = headers.getHeaderString("Range");
				builder.status(Status.PARTIAL_CONTENT);
				builder.header("Content-Type", "video/"+file.getName().substring(file.getName().lastIndexOf('.')+1));

				String[] acceptRanges = rangeHeader.split("=");
				String[] bounds = acceptRanges[1].split("-");
				from = Integer.parseInt(bounds[0]);
				to = (int) file.length()-1;
				if ( bounds.length > 1 ) to = Integer.parseInt(bounds[1]);
				from = Math.max(0, from);
				from = (int) Math.min(file.length(), from);
				to = Math.max(0, to);
				to = (int) Math.min(file.length(), to);
				to = Math.max(from+1, to);
				builder.header("Content-Length", to-from+1);
				builder.header("Content-Range", "bytes "+from+"-"+to+"/"+file.length());

//				builder.header("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1
//				builder.header("Pragma", "no-cache"); // HTTP 1.0
//				builder.header("Expires", "0"); // Proxies
//				builder.header("Content-Disposition", "attachment; filename=" + file.getName());
			} 

			RangedStreamingOutput stream = new RangedStreamingOutput(from, to, file);
			builder.entity(stream);
			response = builder.build();
		} else {
			response = Response.status(404).
					entity("INTERNAL ERROR::FILE NOT FOUND").
					type("text/plain").
					build();
		}

		return response;
	}
	
    private String issueFileToken(int mediumID) {
    	Key key = new TIMAATKeyGenerator().generateKey();
        String token = Jwts.builder()
        		.claim("file", mediumID)
                .setIssuer(uriInfo.getAbsolutePath().toString())
                .setIssuedAt(new Date())
                .setExpiration(AuthenticationEndpoint.toDate(LocalDateTime.now().plusHours(8L)))
                .signWith(key, SignatureAlgorithm.HS512)
                .compact();
		return token;
    }
	
    private int validateFileToken(String token) throws Exception {
        // Check if the token was issued by the server and if it's not expired
        // Throw an Exception if the token is invalid

    	Key key = new TIMAATKeyGenerator().generateKey();
    	int mediumID = Jwts.parser().setSigningKey(key).parseClaimsJws(token).getBody().get("file", Integer.class);
		
		return mediumID;
    }
	
}
