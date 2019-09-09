package de.bitgilde.TIMAAT.rest;

import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.security.Key;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

import javax.persistence.EntityManager;
import javax.persistence.EntityTransaction;
import javax.servlet.ServletContext;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.HEAD;
import javax.ws.rs.PATCH;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;
import javax.ws.rs.core.Response.Status;

import com.fasterxml.jackson.databind.ObjectMapper;

import javax.ws.rs.core.UriInfo;

import org.glassfish.jersey.media.multipart.FormDataContentDisposition;
import org.glassfish.jersey.media.multipart.FormDataParam;
import org.json.JSONObject;
import org.jvnet.hk2.annotations.Service;

import de.bitgilde.TIMAAT.PropertyConstants;
import de.bitgilde.TIMAAT.TIMAATApp;
import de.bitgilde.TIMAAT.model.VideoInformation;
import de.bitgilde.TIMAAT.model.FIPOP.Category;
import de.bitgilde.TIMAAT.model.FIPOP.Language;
import de.bitgilde.TIMAAT.model.FIPOP.MediaType;
import de.bitgilde.TIMAAT.model.FIPOP.Medium;
import de.bitgilde.TIMAAT.model.FIPOP.MediumVideo;
import de.bitgilde.TIMAAT.model.FIPOP.Tag;
import de.bitgilde.TIMAAT.model.FIPOP.Title;
import de.bitgilde.TIMAAT.model.FIPOP.UserAccount;
import de.bitgilde.TIMAAT.security.TIMAATKeyGenerator;
import de.bitgilde.TIMAAT.security.UserLogManager;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

/**
*
* @author Jens-Martin Loebel <loebel@bitgilde.de>
* @author Mirko Scherf <mscherf@uni-mainz.de>
*/

@Service
@Path("/medium")
public class MediumServiceEndpoint{

	@Context
	private UriInfo uriInfo;
	@Context
	ContainerRequestContext containerRequestContext;
	@Context
	ServletContext servletContext;
	
	@GET
    @Produces(javax.ws.rs.core.MediaType.APPLICATION_JSON)
	@Secured
	@Path("{id}")
	public Response getMediaInfo(@PathParam("id") int id) {
    	
    	Medium m = TIMAATApp.emf.createEntityManager().find(Medium.class, id);   
    	if ( m == null ) return Response.status(Status.NOT_FOUND).build();
    	
		m.setStatus(videoStatus(id));
    	m.setViewToken(issueFileToken(m.getId()));
    	
		return Response.ok().entity(m).build();
	}

	@GET
    @Produces(javax.ws.rs.core.MediaType.APPLICATION_JSON)
	@Secured
	@Path("list")
	public Response getMediaList() {
		System.out.println("MediumEndpoint: getMediaList");	
    	
    	@SuppressWarnings("unchecked")
		List<Medium> mlist = TIMAATApp.emf.createEntityManager().createNamedQuery("Medium.findAll").getResultList();
    	
    	for (Medium m : mlist ) {
    		m.setStatus(videoStatus(m.getId()));
        	m.setViewToken(issueFileToken(m.getId()));
        	m.setMediumAnalysisLists(null);
    	}
    	
		return Response.ok().entity(mlist).build();
	}

	@GET
	@Produces(javax.ws.rs.core.MediaType.APPLICATION_JSON)
	@Secured
	@Path("mediatype/list")
	public Response getMediatypeList() {
		System.out.println("MediumEndpoint: getMediaTypeList");		
		@SuppressWarnings("unchecked")
		List<MediaType> mediaTypeList = TIMAATApp.emf.createEntityManager().createNamedQuery("MediaType.findAll").getResultList();
		return Response.ok().entity(mediaTypeList).build();
	}
	
	@GET
    @Produces(javax.ws.rs.core.MediaType.APPLICATION_JSON)
	@Secured
	@Path("video/list")
	public Response getVideoList() {
		System.out.println("MediumEndpoint: getVideoList");	
    @SuppressWarnings("unchecked")
		List<MediumVideo> mediumVideoList = TIMAATApp.emf.createEntityManager().createNamedQuery("MediumVideo.findAll").getResultList();
		System.out.println("MediumEndpoint: getVideoList -> #items: " + mediumVideoList.size());
		return Response.ok().entity(mediumVideoList).build();
	}
	
	@HEAD
	@Path("{id}/download")
    @Produces("video/mp4")
    public Response getMediaFileInfo(
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
    	if ( videoStatus(id).compareTo("ready") != 0 ) return Response.status(Status.NOT_FOUND).build();

        File file = new File( TIMAATApp.timaatProps.getProp(PropertyConstants.STORAGE_LOCATION)+id+"/"+id+"-video.mp4" );
        
        return Response.ok()
        		.status( Response.Status.PARTIAL_CONTENT )
        		.header( HttpHeaders.CONTENT_LENGTH, file.length() )
        		.header( "Accept-Ranges", "bytes" )
        		.build();
    }

	@GET
	@Path("{id}/download")
    @Produces("video/mp4")
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
		
    	
    	Medium m = TIMAATApp.emf.createEntityManager().find(Medium.class, id);
    	if ( m == null ) return Response.status(Status.NOT_FOUND).build();

    	if ( videoStatus(id).compareTo("ready") != 0 ) return Response.status(Status.NOT_FOUND).build();
    	
		
		return downloadFile(TIMAATApp.timaatProps.getProp(PropertyConstants.STORAGE_LOCATION)+id+"/"+id+"-video.mp4", headers);
	}
	
	@POST
		@Produces(javax.ws.rs.core.MediaType.APPLICATION_JSON)
		@Consumes(javax.ws.rs.core.MediaType.APPLICATION_JSON)
	@Path("{id}")
	@Secured
	public Response createMedium(@PathParam("id") int id, String jsonData) {
		System.out.println("MediumEndpoint: createMedium: " + jsonData);
		ObjectMapper mapper = new ObjectMapper();
		Medium newMedium = null;  
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		// parse JSON data
		try {
			newMedium = mapper.readValue(jsonData, Medium.class);
		} catch (IOException e) {
			System.out.println("MediumEndpoint: createMedium - IOException");
			e.printStackTrace();
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( newMedium == null ) {
			System.out.println("MediumEndpoint: createMedium - newMedium == 0");
			return Response.status(Status.BAD_REQUEST).build();
		}
		// sanitize object data
		newMedium.setId(0);
		Title title = entityManager.find(Title.class, newMedium.getTitle().getId());
		newMedium.setTitle(title);
		// update log metadata
		Timestamp creationDate = new Timestamp(System.currentTimeMillis());
		newMedium.setCreatedAt(creationDate);
		newMedium.setLastEditedAt(creationDate);
		System.out.println("MediumEndpoint: createMedium - set created by and last edited by");
		if ( containerRequestContext.getProperty("TIMAAT.userID") != null ) {
			newMedium.setCreatedByUserAccount(entityManager.find(UserAccount.class, containerRequestContext.getProperty("TIMAAT.userID")));
			newMedium.setLastEditedByUserAccount((entityManager.find(UserAccount.class, containerRequestContext.getProperty("TIMAAT.userID"))));
		} else {
			// DEBUG do nothing - production system should abort with internal server error
			return Response.serverError().build();
		}
		System.out.println("MediumEndpoint: createMedium - persist Medium: ");
		// persist Medium
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.persist(title);
		entityManager.persist(newMedium);
		entityManager.persist(title);
		entityManager.flush();
		newMedium.setTitle(title);
		entityTransaction.commit();
		entityManager.refresh(newMedium);
		entityManager.refresh(title);

		// create medium_has_title-table entry
		entityTransaction.begin();
		newMedium.getTitles().add(title);
		title.getMediums2().add(newMedium);
		entityManager.merge(title);
		entityManager.merge(newMedium);
		entityManager.persist(title);
		entityManager.persist(newMedium);
		entityTransaction.commit();
		entityManager.refresh(newMedium);
		entityManager.refresh(title);
		// add log entry
		System.out.println("MediumEndpoint: createMedium - create log event MEDIUMCREATED");
		UserLogManager.getLogger().addLogEntry(newMedium.getCreatedByUserAccount().getId(), UserLogManager.LogEvents.MEDIUMCREATED);
		System.out.println("MediumEndpoint: createMedium - done");
		return Response.ok().entity(newMedium).build();
	}

	@PATCH
		@Produces(javax.ws.rs.core.MediaType.APPLICATION_JSON)
		@Consumes(javax.ws.rs.core.MediaType.APPLICATION_JSON)
	@Path("{id}")
	@Secured
	public Response updateMedium(@PathParam("id") int id, String jsonData) {
		System.out.println("MediumEndpoint: UPDATE MEDIUM - jsonData"+ jsonData);
		ObjectMapper mapper = new ObjectMapper();
		Medium updatedMedium = null;    	
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Medium medium = entityManager.find(Medium.class, id);
		if ( medium == null ) return Response.status(Status.NOT_FOUND).build();		
		// parse JSON data
		try {
			updatedMedium = mapper.readValue(jsonData, Medium.class);
		} catch (IOException e) {
			System.out.println("MediumEndpoint: UPDATE MEDIUM - IOException");
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( updatedMedium == null ) return Response.notModified().build();		    	
		// update medium
		// System.out.println("MediumEndpoint: UPDATE MEDIUM - medium.id:"+medium.getId());	
		// if ( updatedMedium.getTitle() != null ) medium.setTitle(updatedMedium.getTitle());
		if ( updatedMedium.getRemark() != null ) medium.setRemark(updatedMedium.getRemark());
		if ( updatedMedium.getCopyright() != null ) medium.setCopyright(updatedMedium.getCopyright());
		// update log metadata
		medium.setLastEditedAt(new Timestamp(System.currentTimeMillis()));
		if ( containerRequestContext.getProperty("TIMAAT.userID") != null ) {
			medium.getLastEditedByUserAccount().setId((int) containerRequestContext.getProperty("TIMAAT.userID"));
		} else {
			// DEBUG do nothing - production system should abort with internal server error			
		}		
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.merge(medium);
		entityManager.persist(medium);
		entityTransaction.commit();
		entityManager.refresh(medium);
		// add log entry
		UserLogManager.getLogger().addLogEntry((int) containerRequestContext.getProperty("TIMAAT.userID"), 
																						UserLogManager.LogEvents.MEDIUMEDITED);
		System.out.println("MediumEndpoint: UPDATE MEDIUM - update complete");
		return Response.ok().entity(medium).build();
	}

	@DELETE
		@Produces(javax.ws.rs.core.MediaType.APPLICATION_JSON)
	@Path("{id}")
	@Secured
	public Response deleteMedium(@PathParam("id") int id) {    
		System.out.println("MediumEndpoint: deleteMedium");	
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Medium medium = entityManager.find(Medium.class, id);
		if ( medium == null ) return Response.status(Status.NOT_FOUND).build();
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.remove(medium.getTitle());
		entityManager.remove(medium);
		entityTransaction.commit();
		// add log entry
		UserLogManager.getLogger().addLogEntry((int) containerRequestContext.getProperty("TIMAAT.userID"), 
																						UserLogManager.LogEvents.MEDIUMDELETED);
		System.out.println("MediumEndpoint: deleteMedium - delete complete");	
		return Response.ok().build();
	}

	@POST
    @Produces(javax.ws.rs.core.MediaType.APPLICATION_JSON)
    @Consumes(javax.ws.rs.core.MediaType.APPLICATION_JSON)
	@Path("video/{id}")
	@Secured
	public Response createVideo(@PathParam("id") int id, String jsonData) {
		System.out.println("MediumEndpoint: createVideo jsonData: "+jsonData);
		ObjectMapper mapper = new ObjectMapper();
		MediumVideo newVideo = null;
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		// Medium medium = entityManager.find(Medium.class, mediumid);
		// parse JSON data
		try {
			newVideo = mapper.readValue(jsonData, MediumVideo.class);
		} catch (IOException e) {
			System.out.println("MediumEndpoint: createVideo: IOException e !");
			e.printStackTrace();
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( newVideo == null ) {
			System.out.println("MediumEndpoint: createVideo: newVideo == null !");
			return Response.status(Status.BAD_REQUEST).build();
		}
		// sanitize object data
		// if (newVideo.getIsEpisode() == null) newVideo.setIsEpisode(false);
		// update log metadata
		// Not necessary, a video will always be created in conjunction with a medium
		System.out.println("MediumEndpoint: createVideo: persist video");
		// persist video
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.persist(newVideo);
		entityManager.flush();
		entityTransaction.commit();
		entityManager.refresh(newVideo);
		System.out.println("MediumEndpoint: createVideo: add log entry");	
		// add log entry
		UserLogManager.getLogger().addLogEntry(newVideo.getMedium().getCreatedByUserAccount().getId(), UserLogManager.LogEvents.VIDEOCREATED);
		System.out.println("MediumEndpoint: video created with id "+newVideo.getId());
		return Response.ok().entity(newVideo).build();
	}

	@PATCH
    @Produces(javax.ws.rs.core.MediaType.APPLICATION_JSON)
    @Consumes(javax.ws.rs.core.MediaType.APPLICATION_JSON)
	@Path("video/{id}")
	@Secured
	public Response updateVideo(@PathParam("id") int id, String jsonData) {
		System.out.println("MediumEndpoint: UPDATE VIDEO - jsonData: " + jsonData);
		ObjectMapper mapper = new ObjectMapper();
		MediumVideo updatedVideo = null;    	
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		MediumVideo video = entityManager.find(MediumVideo.class, id);
		if ( video == null ) return Response.status(Status.NOT_FOUND).build();		
		// parse JSON data
		try {
			updatedVideo = mapper.readValue(jsonData, MediumVideo.class);
		} catch (IOException e) {
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( updatedVideo == null ) return Response.notModified().build();    	
		// update video
		// System.out.println("MediumEndpoint: UPDATE VIDEO - video.id:"+video.getId());	
		if ( updatedVideo.getBrand() != null ) video.setBrand(updatedVideo.getBrand());
		if ( updatedVideo.getLength() > 0 ) video.setLength(updatedVideo.getLength());
		if ( updatedVideo.getVideoCodec() != null ) video.setVideoCodec(updatedVideo.getVideoCodec());
		if ( updatedVideo.getWidth() > 0 ) video.setWidth(updatedVideo.getWidth());
		if ( updatedVideo.getHeight() > 0 ) video.setHeight(updatedVideo.getHeight());
		if ( updatedVideo.getFrameRate() > 0 ) video.setFrameRate(updatedVideo.getFrameRate()); 
		if ( updatedVideo.getDataRate() > 0 ) video.setDataRate(updatedVideo.getDataRate());
		if ( updatedVideo.getTotalBitrate() > 0 ) video.setTotalBitrate(updatedVideo.getTotalBitrate());
		if ( updatedVideo.getIsEpisode() != null ) video.setIsEpisode(updatedVideo.getIsEpisode()); 	
		// update log metadata
		video.getMedium().setLastEditedAt(new Timestamp(System.currentTimeMillis()));
		if ( containerRequestContext.getProperty("TIMAAT.userID") != null ) {
			video.getMedium().getLastEditedByUserAccount().setId((int) containerRequestContext.getProperty("TIMAAT.userID"));
		} else {
			// DEBUG do nothing - production system should abort with internal server error			
		}		
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.merge(video);
		entityManager.persist(video);
		entityTransaction.commit();
		entityManager.refresh(video);

		// System.out.println("MediumEndpoint: UPDATE VIDEO - only logging remains");	
		// add log entry
		UserLogManager.getLogger().addLogEntry((int) containerRequestContext.getProperty("TIMAAT.userID"), 
																						UserLogManager.LogEvents.VIDEOEDITED);
		System.out.println("MediumEndpoint: UPDATE VIDEO - update complete");	
		return Response.ok().entity(video).build();
	}

	@DELETE
	@Produces(javax.ws.rs.core.MediaType.APPLICATION_JSON)
	@Path("video/{id}")
	@Secured
	public Response deleteVideo(@PathParam("id") int id) {  
		System.out.println("VideoEndpoint: deleteVideo with id: "+ id);
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Medium medium = entityManager.find(Medium.class, id);
		if ( medium == null ) return Response.status(Status.NOT_FOUND).build();
		MediumVideo video = entityManager.find(MediumVideo.class, id);
		if ( video == null ) return Response.status(Status.NOT_FOUND).build();		
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.remove(video);
		entityManager.remove(video.getMedium().getTitle());
		entityManager.remove(video.getMedium()); // remove video, then corresponding medium
		entityTransaction.commit();
		// add log entry
		UserLogManager.getLogger().addLogEntry((int) containerRequestContext.getProperty("TIMAAT.userID"), 
																						UserLogManager.LogEvents.VIDEODELETED);
		System.out.println("VideoEndpoint: deleteVideo - video deleted");  
		return Response.ok().build();
	}

	@POST
    @Produces(javax.ws.rs.core.MediaType.APPLICATION_JSON)
    @Consumes(javax.ws.rs.core.MediaType.APPLICATION_JSON)
	@Path("title/{id}")
	@Secured
	public Response createTitle(@PathParam("id") int id, String jsonData) {
		System.out.println("MediumEndpoint: createTitle jsonData: "+jsonData);
		ObjectMapper mapper = new ObjectMapper();
		Title newTitle = null;
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		// Medium medium = entityManager.find(Medium.class, mediumid);
		// parse JSON data
		try {
			newTitle = mapper.readValue(jsonData, Title.class);
		} catch (IOException e) {
			System.out.println("MediumEndpoint: createTitle: IOException e !");
			e.printStackTrace();
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( newTitle == null ) {
			System.out.println("MediumEndpoint: createTitle: newTitle == null !");
			return Response.status(Status.BAD_REQUEST).build();
		}
		// sanitize object data
		Language language = entityManager.find(Language.class, 1); // TODO get proper language id
		newTitle.setLanguage(language);
		// update log metadata
		// Not necessary, a title will always be created in conjunction with a medium
		System.out.println("MediumEndpoint: createTitle: persist title");
		// persist title
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.persist(newTitle);
		entityManager.flush();
		newTitle.setLanguage(language);
		entityTransaction.commit();
		entityManager.refresh(newTitle);
		entityManager.refresh(language);
		System.out.println("MediumEndpoint: createTitle: add log entry");	
		// add log entry
		// UserLogManager.getLogger().addLogEntry(newTitle.getMediums1().get(0).getCreatedByUserAccount().getId(), UserLogManager.LogEvents.TITLECREATED);
		System.out.println("MediumEndpoint: title created with id "+newTitle.getId());
		return Response.ok().entity(newTitle).build();
	}

	@PATCH
	@Produces(javax.ws.rs.core.MediaType.APPLICATION_JSON)
	@Consumes(javax.ws.rs.core.MediaType.APPLICATION_JSON)
	@Path("title/{id}")
	@Secured
	public Response updateTitle(@PathParam("id") int id, String jsonData) {
		System.out.println("MediumEndpoint: UPDATE TITLE - jsonData: " + jsonData);
		ObjectMapper mapper = new ObjectMapper();
		Title updatedTitle = null;    	
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Title title = entityManager.find(Title.class, id);
		if ( title == null ) return Response.status(Status.NOT_FOUND).build();		
		// parse JSON data
		try {
			updatedTitle = mapper.readValue(jsonData, Title.class);
		} catch (IOException e) {
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( updatedTitle == null ) return Response.notModified().build();    	
		// update title
		// System.out.println("MediumEndpoint: UPDATE TITLE - title.id:"+title.getId());	
		if ( updatedTitle.getName() != null ) title.setName(updatedTitle.getName());

		// update log metadata
		// log metadata will be updated with the corresponding medium
		// title.getMedium().setLastEditedAt(new Timestamp(System.currentTimeMillis()));
		// if ( containerRequestContext.getProperty("TIMAAT.userID") != null ) {
		// 	title.getMedium().getLastEditedByUserAccount().setId((int) containerRequestContext.getProperty("TIMAAT.userID"));
		// } else {
		// 	// DEBUG do nothing - production system should abort with internal server error			
		// }		
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.merge(title);
		entityManager.persist(title);
		entityTransaction.commit();
		entityManager.refresh(title);

		// System.out.println("MediumEndpoint: UPDATE TITLE - only logging remains");	
		// add log entry
		UserLogManager.getLogger().addLogEntry((int) containerRequestContext.getProperty("TIMAAT.userID"), 
																						UserLogManager.LogEvents.TITLEEDITED);
		System.out.println("MediumEndpoint: UPDATE TITLE - update complete");	
		return Response.ok().entity(title).build();
	}

	@DELETE
	@Produces(javax.ws.rs.core.MediaType.APPLICATION_JSON)
	@Path("title/{id}")
	@Secured
	public Response deleteTitle(@PathParam("id") int id) {    
	System.out.println("MediumEndpoint: deleteTitle");	
	EntityManager entityManager = TIMAATApp.emf.createEntityManager();
	Title title = entityManager.find(Title.class, id);
	if ( title == null ) return Response.status(Status.NOT_FOUND).build();
	EntityTransaction entityTransaction = entityManager.getTransaction();
	entityTransaction.begin();
	entityManager.remove(title);
	entityTransaction.commit();
	// add log entry
	UserLogManager.getLogger().addLogEntry((int) containerRequestContext.getProperty("TIMAAT.userID"), 
																					UserLogManager.LogEvents.TITLEDELETED);
	System.out.println("MediumEndpoint: deleteTitle - delete complete");	
	return Response.ok().build();
	}

	@POST
	@Path("upload")
    @Consumes(javax.ws.rs.core.MediaType.MULTIPART_FORM_DATA)  
    @Produces(javax.ws.rs.core.MediaType.APPLICATION_JSON)
	@Secured
	public Response createMedium( @FormDataParam("file") InputStream uploadedInputStream,  
            @FormDataParam("file") FormDataContentDisposition fileDetail) {
		
		Medium newMedium = null;
		 try {
			 // TODO assume MP4 only upload
			 String tempName = ThreadLocalRandom.current().nextInt(1, 65535)+System.currentTimeMillis()+"-upload.mp4";
			 File uploadTempFile = new File(TIMAATApp.timaatProps.getProp(PropertyConstants.STORAGE_LOCATION)+tempName);

			 BufferedOutputStream stream = new BufferedOutputStream(new FileOutputStream( uploadTempFile ));
			 byte [] bytes = new byte[1024];
			 int sizeRead;
			 while ((sizeRead = uploadedInputStream.read(bytes,0, 1024)) > 0) {
				 stream.write(bytes, 0, sizeRead);
			 }
			 stream.flush();
			 stream.close();
			 System.out.println( "You successfully uploaded !" );             
			/*             
			int read = 0;  
			byte[] bytes = new byte[1024];  
			
			while ((read = uploadedInputStream.read(bytes)) != -1) {  
					out.write(bytes, 0, read);  
					out.flush();  
			}  
			out.close();
			*/			
			// persist medium			
			EntityManager entityManager = TIMAATApp.emf.createEntityManager();
			// TODO load from config
			MediaType mt = entityManager.find(MediaType.class, 6);
			Language lang = entityManager.find(Language.class, 1);
			
			Title title = new Title();
			title.setLanguage(lang);
			title.setName(fileDetail.getFileName().substring(0, fileDetail.getFileName().length()-4));
			
			newMedium = new Medium();
			newMedium.setFilePath(TIMAATApp.timaatProps.getProp(PropertyConstants.STORAGE_LOCATION)+tempName);
			newMedium.setMediaType(mt);
			newMedium.setReference(null);
			newMedium.setSource(null);
			newMedium.setPropagandaType(null);

			// TODO MediumVideo needs to be created separatedly from Medium
			MediumVideo videoInfo = new MediumVideo();
			// TODO generate AudioCodec Data
			videoInfo.getAudioCodecInformation().setId(1);

			// get data from ffmpeg
			VideoInformation info = getVideoFileInfo(TIMAATApp.timaatProps.getProp(PropertyConstants.STORAGE_LOCATION)+tempName);
			videoInfo.setWidth(info.getWidth());
			videoInfo.setHeight(info.getHeight());
			videoInfo.setFrameRate(info.getFramerate());
			videoInfo.setVideoCodec("");
			videoInfo.setLength(info.getDuration());
																	
			EntityTransaction entityTransaction = entityManager.getTransaction();
			entityTransaction.begin();
			entityManager.persist(title);
			// newMedium.setTitle(title);
			newMedium.setMediumVideo(videoInfo);
			entityManager.persist(newMedium);
			entityManager.flush();
			entityTransaction.commit();
			entityManager.refresh(newMedium);

			// rename file with medium
			File tempFile = new File(TIMAATApp.timaatProps.getProp(PropertyConstants.STORAGE_LOCATION)+tempName);
			tempFile.renameTo(new File(TIMAATApp.timaatProps.getProp(PropertyConstants.STORAGE_LOCATION)+newMedium.getId()+"-video-original.mp4")); // TODO assume only mp4 upload
			newMedium.setFilePath(TIMAATApp.timaatProps.getProp(PropertyConstants.STORAGE_LOCATION)+newMedium.getId()+"-video-original.mp4");
			entityTransaction = entityManager.getTransaction();
			entityTransaction.begin();
			entityManager.persist(newMedium);
			entityManager.flush();
			entityTransaction.commit();
			entityManager.refresh(newMedium);
			
			createThumbnails(newMedium.getId(), TIMAATApp.timaatProps.getProp(PropertyConstants.STORAGE_LOCATION)+newMedium.getId()+"-video-original.mp4");
			
			// start transcoding video
			newMedium.setStatus("transcoding");
			newMedium.setViewToken(issueFileToken(newMedium.getId()));
			TranscoderThread videoTranscoder = new TranscoderThread(newMedium.getId(), TIMAATApp.timaatProps.getProp(PropertyConstants.STORAGE_LOCATION)+newMedium.getId()+"-video-original.mp4");
			videoTranscoder.start();
						
			// add log entry
		UserLogManager.getLogger().addLogEntry((int) containerRequestContext.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.MEDIUMCREATED);

		} catch (IOException e) {e.printStackTrace();}  

		return Response.ok().entity(newMedium).build();
	}

	@GET
	@Path("{id}/status")
	@Produces(javax.ws.rs.core.MediaType.TEXT_PLAIN)
	@Secured
	public Response getVideoStatus(@PathParam("id") int id) {
		File videoDir = new File(TIMAATApp.timaatProps.getProp(PropertyConstants.STORAGE_LOCATION)+id);
		if ( !videoDir.exists() ) return Response.status(Status.NOT_FOUND).build(); // save DB lookup
    	
		return Response.ok().entity(videoStatus(id)).build();
	}

	@GET
	@Path("{id}/thumbnail")
	@Produces("image/jpg")
	public Response getVideoThumbnail(
			@PathParam("id") int id,
			@QueryParam("token") String fileToken,
			@QueryParam("time") String time) {

		// verify token
		if ( fileToken == null ) return Response.status(401).build();
		int tokenMediumID = 0;
		try {
			tokenMediumID = validateFileToken(fileToken);
		} catch (Exception e) {
			return Response.status(401).build();
		}		
		if ( tokenMediumID != id ) return Response.status(401).build();

		int seks = -1;
		if ( time != null ) try {
			seks = Integer.parseInt(time);
		} catch (NumberFormatException e) { seks = -1; };		
		if ( seks >= 0 ) seks++;
		
		if ( seks < 0 ) {
			// load thumbnail from storage
			File videoDir = new File(TIMAATApp.timaatProps.getProp(PropertyConstants.STORAGE_LOCATION)+id);
			if ( !videoDir.exists() ) return Response.status(Status.NOT_FOUND).build(); // save DB lookup
    	
			File thumbnail = new File(TIMAATApp.timaatProps.getProp(PropertyConstants.STORAGE_LOCATION)+id+"/"+id+"-thumb.png");
			if ( !thumbnail.exists() || !thumbnail.canRead() ) thumbnail = new File(servletContext.getRealPath("img/video-placeholder.png"));
		    	
			return Response.ok().entity(thumbnail).build();
		} else {
			// load timecode thumbnail from storage
			File frameDir = new File(TIMAATApp.timaatProps.getProp(PropertyConstants.STORAGE_LOCATION)+id+"/frames");
			if ( !frameDir.exists() ) return Response.status(Status.NOT_FOUND).build(); // save DB lookup
    	
			File thumbnail = new File(TIMAATApp.timaatProps.getProp(PropertyConstants.STORAGE_LOCATION)+id+"/frames/"+id+"-frame-"+String.format("%05d", seks)+".jpg");
			if ( !thumbnail.exists() || !thumbnail.canRead() ) thumbnail = new File(servletContext.getRealPath("img/preview-placeholder.png"));

			return Response.ok().entity(thumbnail).build();
		}
	}

	/**
	 * Gets list of annotations for medium (video)
	 * @param id
	 * @return
	 */
	@GET
    @Produces(javax.ws.rs.core.MediaType.APPLICATION_JSON)
	@Path("{id}/analysislists")
	@Secured
	public Response getAnnotationLists(@PathParam("id") int id) {
    	
    	EntityManager entityManager = TIMAATApp.emf.createEntityManager();

    	// find medium
    	Medium m = entityManager.find(Medium.class, id);
    	if ( m == null ) return Response.status(Status.NOT_FOUND).build();
    	
    	entityManager.refresh(m);
    	
    	return Response.ok(m.getMediumAnalysisLists()).build();    	
	}
	
	@SuppressWarnings("unchecked")
	@POST
    @Produces(javax.ws.rs.core.MediaType.APPLICATION_JSON)
	@Path("{id}/tag/{name}")
	@Secured
	public Response addTag(@PathParam("id") int id, @PathParam("name") String tagName) {
		
    	
    	EntityManager entityManager = TIMAATApp.emf.createEntityManager();
    	Medium medium = entityManager.find(Medium.class, id);
    	if ( medium == null ) return Response.status(Status.NOT_FOUND).build();

    	// check if tag exists    	
    	Tag tag = null;
    	List<Tag> tags = null;
    	try {
        	tags = (List<Tag>) entityManager.createQuery("SELECT t from Tag t WHERE t.name=:name")
        			.setParameter("name", tagName)
        			.getResultList();
    	} catch(Exception e) {};
    	
    	// find tag case sensitive
    	for ( Tag listTag : tags )
    		if ( listTag.getName().compareTo(tagName) == 0 ) tag = listTag;
    	
    	// create tag if it doesn't exist yet
    	if ( tag == null ) {
    		tag = new Tag();
    		tag.setName(tagName);
    		EntityTransaction entityTransaction = entityManager.getTransaction();
    		entityTransaction.begin();
    		entityManager.persist(tag);
    		entityTransaction.commit();
    		entityManager.refresh(tag);
    	}
    	
    	// check if Annotation already has tag
    	if ( !medium.getTags().contains(tag) ) {
        	// attach tag to annotation and vice versa    	
    		EntityTransaction entityTransaction = entityManager.getTransaction();
    		entityTransaction.begin();
    		medium.getTags().add(tag);
    		tag.getMediums().add(medium);
    		entityManager.merge(tag);
    		entityManager.merge(medium);
    		entityManager.persist(medium);
    		entityManager.persist(tag);
    		entityTransaction.commit();
    		entityManager.refresh(medium);
    	}
 	
		return Response.ok().entity(tag).build();
	}
	
	@DELETE
    @Produces(javax.ws.rs.core.MediaType.APPLICATION_JSON)
	@Path("{id}/tag/{name}")
	@Secured
	public Response removeTag(@PathParam("id") int id, @PathParam("name") String tagName) {
		
    	
    	EntityManager entityManager = TIMAATApp.emf.createEntityManager();
    	Medium medium = entityManager.find(Medium.class, id);
    	if ( medium == null ) return Response.status(Status.NOT_FOUND).build();
    	
    	// check if Annotation already has tag
    	Tag tag = null;
    	for ( Tag mediumtag:medium.getTags() ) {
    		if ( mediumtag.getName().compareTo(tagName) == 0 ) tag = mediumtag;
    	}
    	if ( tag != null ) {
        	// attach tag to annotation and vice versa    	
    		EntityTransaction entityTransaction = entityManager.getTransaction();
    		entityTransaction.begin();
    		medium.getTags().remove(tag);
    		tag.getMediums().remove(medium);
    		entityManager.merge(tag);
    		entityManager.merge(medium);
    		entityManager.persist(medium);
    		entityManager.persist(tag);
    		entityTransaction.commit();
    		entityManager.refresh(medium);
    	}
 	
		return Response.ok().build();
	}

	@SuppressWarnings("unchecked")
	@POST
    @Produces(javax.ws.rs.core.MediaType.APPLICATION_JSON)
	@Path("{id}/category/{name}")
	@Secured
	public Response addCategory(@PathParam("id") int id, @PathParam("name") String categoryName) {    	
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Medium medium = entityManager.find(Medium.class, id);
		if ( medium == null ) return Response.status(Status.NOT_FOUND).build();

		// check if category exists    	
		Category category = null;
		List<Category> categories = null;
		try {
			categories = (List<Category>) entityManager.createQuery("SELECT t from Category t WHERE t.name=:name")
				.setParameter("name", categoryName)
				.getResultList();
		} catch(Exception e) {};
		
		// find category case sensitive
		for ( Category listCategory : categories )
			if ( listCategory.getName().compareTo(categoryName) == 0 ) category = listCategory;
		
		// create category if it doesn't exist yet
		if ( category == null ) {
			category = new Category();
			category.setName(categoryName);
			EntityTransaction entityTransaction = entityManager.getTransaction();
			entityTransaction.begin();
			entityManager.persist(category);
			entityTransaction.commit();
			entityManager.refresh(category);
		}
		
		// check if Annotation already has category
		if ( !medium.getCategories().contains(category) ) {
				// attach category to annotation and vice versa    	
			EntityTransaction entityTransaction = entityManager.getTransaction();
			entityTransaction.begin();
			medium.getCategories().add(category);
			category.getMediums().add(medium);
			entityManager.merge(category);
			entityManager.merge(medium);
			entityManager.persist(medium);
			entityManager.persist(category);
			entityTransaction.commit();
			entityManager.refresh(medium);
		}
 	
		return Response.ok().entity(category).build();
	}
	
	@DELETE
    @Produces(javax.ws.rs.core.MediaType.APPLICATION_JSON)
	@Path("{id}/category/{name}")
	@Secured
	public Response removeCategory(@PathParam("id") int id, @PathParam("name") String categoryName) {
		
    	
    	EntityManager entityManager = TIMAATApp.emf.createEntityManager();
    	Medium medium = entityManager.find(Medium.class, id);
    	if ( medium == null ) return Response.status(Status.NOT_FOUND).build();
    	
    	// check if Annotation already has category
    	Category category = null;
    	for ( Category mediumcategory:medium.getCategories() ) {
    		if ( mediumcategory.getName().compareTo(categoryName) == 0 ) category = mediumcategory;
    	}
    	if ( category != null ) {
        	// attach category to annotation and vice versa    	
    		EntityTransaction entityTransaction = entityManager.getTransaction();
    		entityTransaction.begin();
    		medium.getCategories().remove(category);
    		category.getMediums().remove(medium);
    		entityManager.merge(category);
    		entityManager.merge(medium);
    		entityManager.persist(medium);
    		entityManager.persist(category);
    		entityTransaction.commit();
    		entityManager.refresh(medium);
    	}
 	
		return Response.ok().build();
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
	
	private String videoStatus(int id) {
		File videoDir = new File(TIMAATApp.timaatProps.getProp(PropertyConstants.STORAGE_LOCATION)+id);
		String status = "unavailable";
		if ( !videoDir.exists() ) return status;
    	
		if ( new File(TIMAATApp.timaatProps.getProp(PropertyConstants.STORAGE_LOCATION)+id+"/"+id+"-video.mp4").exists() ) status="ready";
		else if ( new File(TIMAATApp.timaatProps.getProp(PropertyConstants.STORAGE_LOCATION)+id+"/"+id+"-video-transcoding.mp4").exists() ) status="transcoding";
		
		return status;
	}
	
	private VideoInformation getVideoFileInfo(String filename) {
	    Runtime r = Runtime.getRuntime();
	    Process p;     // Process tracks one external native process
	    BufferedReader is;  // reader for output of process
	    String line;
	    
	    String[] commandLine = { TIMAATApp.timaatProps.getProp(PropertyConstants.FFMPEG_LOCATION)+"ffprobe"+TIMAATApp.systemExt,
	    "-v", "error", "-select_streams", "v:0",
	    "-show_entries", "stream=width,height,r_frame_rate,codec_name",
	    "-show_entries", "format=duration",
	    "-of", "json", filename };
	    VideoInformation videoInfo = null;

	    try {
	    	p = r.exec(commandLine);
	    	is = new BufferedReader(new InputStreamReader(p.getInputStream()));

	    	try {
	    		p.waitFor();  // wait for process to complete
	    	} catch (InterruptedException e) {
	    		System.err.println(e);  // "can't happen"
	    	}

	    	String jsonString = "";
	    	while ((line = is.readLine()) != null) if ( line != null ) jsonString += line;

	    	JSONObject json = new JSONObject(jsonString);
	    	int framerate = 30; // TODO
	    	videoInfo = new VideoInformation(
	    			json.getJSONArray("streams").getJSONObject(0).getInt("width"),
	    			json.getJSONArray("streams").getJSONObject(0).getInt("height"),
	    			framerate,
	    			Float.parseFloat(json.getJSONObject("format").getString("duration")),
	    			json.getJSONArray("streams").getJSONObject(0).getString("codec_name")
	    	);


	    } catch (IOException e1) {
	    	// TODO Auto-generated catch block
	    	e1.printStackTrace();
	    }

	    return videoInfo;
	}
	
	private void createThumbnails(int id, String filename) {
		File videoDir = new File(TIMAATApp.timaatProps.getProp(PropertyConstants.STORAGE_LOCATION)+id);
		if ( !videoDir.exists() ) videoDir.mkdirs();

		Runtime r = Runtime.getRuntime();
	    Process p;     // Process tracks one external native process
	    
	    String[] commandLine = { TIMAATApp.timaatProps.getProp(PropertyConstants.FFMPEG_LOCATION)+"ffmpeg"+TIMAATApp.systemExt,
	    "-i", filename,
	    "-ss", "00:00:01.000", // timecode of thumbnail
	    "-vframes", "1", "-y", 
	    TIMAATApp.timaatProps.getProp(PropertyConstants.STORAGE_LOCATION)+id+"/"+id+"-thumb.png" };

	    try {
			p = r.exec(commandLine);
		    try {
			      p.waitFor();  // wait for process to complete
			    } catch (InterruptedException e) {
			      System.err.println(e);  // "Can'tHappen"
			    }		    
		    } catch (IOException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
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
