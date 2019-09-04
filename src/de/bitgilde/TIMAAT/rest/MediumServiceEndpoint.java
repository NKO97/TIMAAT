package de.bitgilde.TIMAAT.rest;

import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.security.Key;
import java.time.LocalDateTime;
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
import javax.ws.rs.POST;
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

import org.glassfish.jersey.media.multipart.FormDataContentDisposition;
import org.glassfish.jersey.media.multipart.FormDataParam;
import org.json.JSONObject;
import org.jvnet.hk2.annotations.Service;

import de.bitgilde.TIMAAT.PropertyConstants;
import de.bitgilde.TIMAAT.TIMAATApp;
import de.bitgilde.TIMAAT.model.VideoInformation;
import de.bitgilde.TIMAAT.model.FIPOP.Category;
import de.bitgilde.TIMAAT.model.FIPOP.Language;
import de.bitgilde.TIMAAT.model.FIPOP.Medium;
import de.bitgilde.TIMAAT.model.FIPOP.MediumVideo;
import de.bitgilde.TIMAAT.model.FIPOP.Tag;
import de.bitgilde.TIMAAT.model.FIPOP.Title;
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
	ContainerRequestContext crc;
	@Context
	ServletContext ctx;

	
	@GET
    @Produces(MediaType.APPLICATION_JSON)
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
    @Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("list")
	public Response getMediaList() {
    	
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
	@Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("mediatype/list")
	public Response getMediatypeList() {
		System.out.println("MediumEndpoint getMediaTypeList");		
		@SuppressWarnings("unchecked")
		List<MediaType> mediaTypeList = TIMAATApp.emf.createEntityManager().createNamedQuery("MediaType.findAll").getResultList();
		return Response.ok().entity(mediaTypeList).build();
	}
	
	@GET
    @Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("video/list")
	public Response getVideoList() {    	
    @SuppressWarnings("unchecked")
		List<MediumVideo> mediumVideoList = TIMAATApp.emf.createEntityManager().createNamedQuery("MediumVideo.findAll").getResultList();   	
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
	@Path("upload")
    @Consumes(MediaType.MULTIPART_FORM_DATA)  
    @Produces(MediaType.APPLICATION_JSON)
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
			de.bitgilde.TIMAAT.model.FIPOP.MediaType mt = entityManager.find(de.bitgilde.TIMAAT.model.FIPOP.MediaType.class, 6);
			Language lang = entityManager.find(Language.class, 1);
			
			Title title = new Title();
			title.setLanguage(lang);
			title.setTitle(fileDetail.getFileName().substring(0, fileDetail.getFileName().length()-4));
			
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
			newMedium.setTitle(title);
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
		UserLogManager.getLogger().addLogEntry((int) crc.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.MEDIUMCREATED);

		} catch (IOException e) {e.printStackTrace();}  

		return Response.ok().entity(newMedium).build();
	}

	@GET
	@Path("{id}/status")
	@Produces(MediaType.TEXT_PLAIN)
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
			if ( !thumbnail.exists() || !thumbnail.canRead() ) thumbnail = new File(ctx.getRealPath("img/video-placeholder.png"));
		    	
			return Response.ok().entity(thumbnail).build();
		} else {
			// load timecode thumbnail from storage
			File frameDir = new File(TIMAATApp.timaatProps.getProp(PropertyConstants.STORAGE_LOCATION)+id+"/frames");
			if ( !frameDir.exists() ) return Response.status(Status.NOT_FOUND).build(); // save DB lookup
    	
			File thumbnail = new File(TIMAATApp.timaatProps.getProp(PropertyConstants.STORAGE_LOCATION)+id+"/frames/"+id+"-frame-"+String.format("%05d", seks)+".jpg");
			if ( !thumbnail.exists() || !thumbnail.canRead() ) thumbnail = new File(ctx.getRealPath("img/preview-placeholder.png"));

			return Response.ok().entity(thumbnail).build();
		}
	}

	/**
	 * Gets list of annotations for medium (video)
	 * @param id
	 * @return
	 */
	@GET
    @Produces(MediaType.APPLICATION_JSON)
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
    @Produces(MediaType.APPLICATION_JSON)
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
    @Produces(MediaType.APPLICATION_JSON)
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
    @Produces(MediaType.APPLICATION_JSON)
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
    @Produces(MediaType.APPLICATION_JSON)
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
