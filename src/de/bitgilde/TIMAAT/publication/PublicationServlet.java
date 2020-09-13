package de.bitgilde.TIMAAT.publication;

import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;
import java.nio.file.Files;
import java.nio.file.Paths;

import javax.persistence.EntityManager;
import javax.servlet.ServletContext;
import javax.ws.rs.GET;
import javax.ws.rs.HEAD;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.core.UriInfo;

import org.jvnet.hk2.annotations.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import de.bitgilde.TIMAAT.PropertyConstants;
import de.bitgilde.TIMAAT.TIMAATApp;
import de.bitgilde.TIMAAT.model.FIPOP.MediaCollection;
import de.bitgilde.TIMAAT.model.FIPOP.MediaCollectionHasMedium;
import de.bitgilde.TIMAAT.model.FIPOP.Medium;
import de.bitgilde.TIMAAT.model.FIPOP.Publication;
import de.bitgilde.TIMAAT.model.publication.PublicationSettings;
import de.bitgilde.TIMAAT.rest.RangedStreamingOutput;

/**
*
* @author Jens-Martin Loebel <loebel@bitgilde.de>
*/

@Service
@Path("/")
public class PublicationServlet {
	@Context
	private UriInfo uriInfo;
	@Context
	ContainerRequestContext containerRequestContext;
	@Context
	ServletContext servletContext;	
	
	
	
	@GET
	@Produces(MediaType.TEXT_PLAIN)
	@Path("/")
	public Response serviceInfo() {
		return Response.ok().entity("TIMAAT Publication Service").build();
	}
	

	@GET
	@Produces(MediaType.TEXT_HTML)
	@SecurePublication
	@Path("/{slug}/")
	public Response getPublicationTemplate(@Context UriInfo ui, @PathParam("slug") String slug) {
		// redirect path to publication dir
		if ( !ui.getPath().endsWith("/") ) return Response.status(Status.MOVED_PERMANENTLY).header("Location", ui.getPath()+"/").build();

		EntityManager em = TIMAATApp.emf.createEntityManager();
		// find publication
		Publication pub;
		try {
		pub = em.createQuery("SELECT p FROM Publication p WHERE p.slug=:slug", Publication.class)
		.setParameter("slug", slug).getSingleResult();
		} catch (Exception e) {
			return Response.status(Status.NOT_FOUND).build();
		}
		if ( pub == null ) return Response.status(Status.NOT_FOUND).build();

		// TODO serve collection template
		if ( pub.getCollection() != null ) return Response.status(Status.NOT_IMPLEMENTED).build();
		
		// serve single video template
		// TODO include collection info, if applicable
		String content = "";
		try {
			content = new String(Files.readAllBytes(Paths.get(TIMAATApp.class.getClassLoader().getResource("resources/publication.online.single.template").toURI())));
		} catch (IOException | URISyntaxException e1) {return Response.serverError().build();}
		
		ObjectMapper mapper = new ObjectMapper();
		PublicationSettings settings = new PublicationSettings();
		settings.setDefList(0).setStopImage(false).setStopPolygon(false).setStopAudio(false);

		String serMedium = "";
		try {
			serMedium = mapper.writeValueAsString(pub.getStartMedium());
			content = content.replaceFirst("\\{\\{TIMAAT-SETTINGS\\}\\}", mapper.writeValueAsString(settings));
			
			String[] temp = content.split("\\{\\{TIMAAT-DATA\\}\\}", 2);
			content = temp[0]+serMedium+temp[1];
			
		} catch (JsonProcessingException e) {return Response.serverError().build();}
		
		return Response.ok().entity(content).build();
	}
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/{slug}/status")
	public Response getStatus(@PathParam("slug") String slug) {
		EntityManager em = TIMAATApp.emf.createEntityManager();
		// find publication
		Publication pub;
		try {
		pub = em.createQuery("SELECT p FROM Publication p WHERE p.slug=:slug", Publication.class)
		.setParameter("slug", slug).getSingleResult();
		} catch (Exception e) {
			return Response.status(Status.NOT_FOUND).build();
		}
		if ( pub == null ) return Response.status(Status.NOT_FOUND).build();

		return Response.ok().entity("{id:"+pub.getId()+", access:\""+pub.getAccess()+"\"}").build();
	}
	

	@HEAD
	@Path("/{slug}/item-{id}")
	@SecurePublication
	public Response getVideoFileInfo(
			@PathParam("slug") String slug,
			@QueryParam("id") int itemID) {
		
		EntityManager em = TIMAATApp.emf.createEntityManager();
		// find publication
		Publication pub;
		try {
		pub = em.createQuery("SELECT p FROM Publication p WHERE p.slug=:slug", Publication.class)
		.setParameter("slug", slug).getSingleResult();
		} catch (Exception e) {
			return Response.status(Status.NOT_FOUND).build();
		}
		if ( pub == null ) return Response.status(Status.NOT_FOUND).build();

		ResponseBuilder rb = Response.ok();
		rb.header("Content-Type", "video/mp4");

		// find medium
		Medium medium = null;
		if ( pub.getStartMedium() != null && pub.getStartMedium().getId() == itemID ) medium = pub.getStartMedium();
		else if ( pub.getCollection() != null ) 
			for ( MediaCollectionHasMedium colMed : pub.getCollection().getMediaCollectionHasMediums() )
				if ( colMed.getMedium().getId() == itemID ) medium = colMed.getMedium();
		if ( medium == null ) return Response.status(Status.NOT_FOUND).build();
		
		File file = new File( 
				TIMAATApp.timaatProps.getProp(PropertyConstants.STORAGE_LOCATION)
					+ "medium/video/" + itemID + "/" + itemID + "-video.mp4");
		
		return rb
				.status( Response.Status.PARTIAL_CONTENT )
				.header( HttpHeaders.CONTENT_LENGTH, file.length() )
				.header( "Accept-Ranges", "bytes" )
				.build();
	}

	@GET
	@Path("/{slug}/item-{id}")
	@SecurePublication
	public Response getPublicationItem(@Context HttpHeaders headers, @PathParam("slug") String slug, @PathParam("id") int itemID) {
		EntityManager em = TIMAATApp.emf.createEntityManager();
		// find publication
		Publication pub;
		try {
		pub = em.createQuery("SELECT p FROM Publication p WHERE p.slug=:slug", Publication.class)
		.setParameter("slug", slug).getSingleResult();
		} catch (Exception e) {
			return Response.status(Status.NOT_FOUND).build();
		}
		if ( pub == null ) return Response.status(Status.NOT_FOUND).build();
		
		// find medium
		Medium medium = null;
		if ( pub.getStartMedium() != null && pub.getStartMedium().getId() == itemID ) medium = pub.getStartMedium();
		else if ( pub.getCollection() != null ) 
			for ( MediaCollectionHasMedium colMed : pub.getCollection().getMediaCollectionHasMediums() )
				if ( colMed.getMedium().getId() == itemID ) medium = colMed.getMedium();
		if ( medium == null ) return Response.status(Status.NOT_FOUND).build();

		return downloadFile(TIMAATApp.timaatProps.getProp(PropertyConstants.STORAGE_LOCATION)
				+ "medium/video/" + itemID + "/" + itemID + "-video.mp4", headers, "video/mp4");
	}
	
	private Response downloadFile(String fileName, HttpHeaders headers, String mimeType) {     
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

/*
				builder.header("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1
				builder.header("Pragma", "no-cache"); // HTTP 1.0
				builder.header("Expires", "0"); // Proxies
 */
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


	
	
}
