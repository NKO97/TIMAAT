package de.bitgilde.TIMAAT.rest;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.EntityTransaction;
import javax.persistence.Query;
import javax.servlet.ServletContext;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.PATCH;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.core.UriInfo;

import org.jvnet.hk2.annotations.Service;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;

import de.bitgilde.TIMAAT.TIMAATApp;
import de.bitgilde.TIMAAT.model.DatatableInfo;
import de.bitgilde.TIMAAT.model.FIPOP.MediaCollection;
import de.bitgilde.TIMAAT.model.FIPOP.MediaCollectionAlbum;
import de.bitgilde.TIMAAT.model.FIPOP.MediaCollectionAnalysisList;
import de.bitgilde.TIMAAT.model.FIPOP.MediaCollectionHasMedium;
import de.bitgilde.TIMAAT.model.FIPOP.MediaCollectionSeries;
import de.bitgilde.TIMAAT.model.FIPOP.MediaCollectionType;
import de.bitgilde.TIMAAT.model.FIPOP.Medium;
import de.bitgilde.TIMAAT.model.FIPOP.Tag;
import de.bitgilde.TIMAAT.model.FIPOP.Title;
import de.bitgilde.TIMAAT.security.UserLogManager;

/**
*
* @author Jens-Martin Loebel <loebel@bitgilde.de>
*/

@Service
@Path("/mediaCollection")
public class MediaCollectionEndpoint {
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
	public Response getMediaCollections(@QueryParam("draw") Integer draw,
																			@QueryParam("start") Integer start,
																			@QueryParam("length") Integer length,
																			@QueryParam("orderby") String orderby,
																			@QueryParam("dir") String direction,
																			@QueryParam("search") String search ) {
		System.out.println("MediumCollectionServiceEndpoint: getAllMediaCollections: draw: "+draw+" start: "+start+" length: "+length+" orderby: "+orderby+" dir: "+direction+" search: "+search);
		if ( draw == null ) draw = 0;

		// sanitize user input
		if ( direction != null && direction.equalsIgnoreCase("desc") ) direction = "DESC"; else direction = "ASC";
		String column = "mc.id";
		if ( orderby != null) {
			if (orderby.equalsIgnoreCase("title")) column = "mc.title";
		}

		EntityManager entityManager = TIMAATApp.emf.createEntityManager();

		// calculate total # of records
		Query countQuery = entityManager.createQuery("SELECT COUNT(mc) FROM MediaCollection mc");
		long recordsTotal = (long) countQuery.getSingleResult();
		long recordsFiltered = recordsTotal;

		// search
		Query query;
		String sql;
		List<MediaCollection> mediumCollectionList = new ArrayList<>();
		if (search != null && search.length() > 0 ) {
			// find all matching titles
			sql = "SELECT mc FROM MediaCollection mc WHERE lower(mc.title) LIKE lower(concat('%', :search, '%'))";
			query = entityManager.createQuery(sql)
													 .setParameter("search", search);
			// find all mediaCollections
			if ( start != null && start > 0 ) query.setFirstResult(start);
			if ( length != null && length > 0 ) query.setMaxResults(length);
			mediumCollectionList = castList(MediaCollection.class, query.getResultList());
			recordsFiltered = mediumCollectionList.size();
		} else {
			sql = "SELECT mc FROM MediaCollection mc ORDER BY "+column+" "+direction;
			query = entityManager.createQuery(sql);
			if ( start != null && start > 0 ) query.setFirstResult(start);
			if ( length != null && length > 0 ) query.setMaxResults(length);
			mediumCollectionList = castList(MediaCollection.class, query.getResultList());
		}
		return Response.ok().entity(new DatatableInfo(draw, recordsTotal, recordsFiltered, mediumCollectionList)).build();
	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("{id}/list")
	public Response getMediaCollectionItems(@PathParam("id") Integer id,
																					@QueryParam("draw") Integer draw,
																					@QueryParam("start") Integer start,
																					@QueryParam("length") Integer length,
																					@QueryParam("orderby") String orderby,
																					@QueryParam("dir") String direction,
																					@QueryParam("search") String search ) {
		System.out.println("TCL: MediumCollectionServiceEndpoint: getMediaCollectionItems: id: "+id+" draw: "+draw+" start: "+start+" length: "+length+" orderby: "+orderby+" dir: "+direction+" search: "+search);
		if ( draw == null ) draw = 0;

		// sanitize user input
		if ( direction != null && direction.equalsIgnoreCase("desc") ) direction = "DESC"; else direction = "ASC";
		String column = "m.id";
		if ( orderby != null) {
			if (orderby.equalsIgnoreCase("title")) column = "m.title1.name";
		}

		// calculate total # of records
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Query countQuery = entityManager.createQuery("SELECT COUNT(m) FROM Medium m, MediaCollectionHasMedium mchm WHERE mchm.mediaCollection.id = "+id+" AND m.id = mchm.medium.id");
		long recordsTotal = (long) countQuery.getSingleResult();
		long recordsFiltered = recordsTotal;

		String mediumCollectionListQuery = "SELECT m FROM Medium m, MediaCollectionHasMedium mchm WHERE mchm.mediaCollection.id = "+id+" AND m.id = mchm.medium.id";
		// search
		Query query;
		String sql;
		List<Medium> mediumList = new ArrayList<>();
		if (search != null && search.length() > 0 ) {
			// find all matching titles
			
			sql = "SELECT t FROM Title t, Medium m WHERE m IN ("+mediumCollectionListQuery+") AND t IN (m.titles) AND lower(t.name) LIKE lower(concat('%', :search, '%'))";
			query = entityManager.createQuery(sql)
													 .setParameter("search", search);
			// find all media
			if ( start != null && start > 0 ) query.setFirstResult(start);
			if ( length != null && length > 0 ) query.setMaxResults(length);
			// mediumList = castList(Medium.class, query.getResultList());
			List<Title> titleList = castList(Title.class, query.getResultList());
			for (Title title : titleList) {
				for (Medium medium : title.getMediums3()) {
					if (!(mediumList.contains(medium))) {
						mediumList.add(medium);
					}
				}
			}
			recordsFiltered = mediumList.size();
		} else {
			sql = mediumCollectionListQuery+" ORDER BY "+column+" "+direction;
			query = entityManager.createQuery(sql);
			if ( start != null && start > 0 ) query.setFirstResult(start);
			if ( length != null && length > 0 ) query.setMaxResults(length);
			mediumList = castList(Medium.class, query.getResultList());
		}
		return Response.ok().entity(new DatatableInfo(draw, recordsTotal, recordsFiltered, mediumList)).build();
	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("{id}/notInList")
	public Response getMediaCollectionItemsNotInList(@PathParam("id") Integer id,
																									 @QueryParam("draw") Integer draw,
																									 @QueryParam("start") Integer start,
																									 @QueryParam("length") Integer length,
																									 @QueryParam("orderby") String orderby,
																									 @QueryParam("dir") String direction,
																									 @QueryParam("search") String search ) {
		System.out.println("TCL: MediumCollectionServiceEndpoint: getMediaCollectionItemsNotInList: id: "+id+" draw: "+draw+" start: "+start+" length: "+length+" orderby: "+orderby+" dir: "+direction+" search: "+search);
		if ( draw == null ) draw = 0;

		// sanitize user input
		if ( direction != null && direction.equalsIgnoreCase("desc") ) direction = "DESC"; else direction = "ASC";
		String column = "m.id";
		if ( orderby != null) {
			if (orderby.equalsIgnoreCase("title")) column = "m.title1.name";
		}

		// calculate total # of records
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Query countQueryMedia = entityManager.createQuery("SELECT COUNT(m) FROM Medium m");
		Query countQueryCollectionItems = entityManager.createQuery("SELECT COUNT(m) FROM Medium m, MediaCollectionHasMedium mchm WHERE mchm.mediaCollection.id = "+id+" AND m.id = mchm.medium.id");
		long recordsTotal = (long) countQueryMedia.getSingleResult() - (long) countQueryCollectionItems.getSingleResult();
		long recordsFiltered = recordsTotal;

		String mediumNotInListQuery = "SELECT m FROM Medium m WHERE m NOT IN (SELECT m FROM MediaCollectionHasMedium mchm WHERE mchm.mediaCollection.id = "+id+" AND m.id = mchm.medium.id)";
		// search
		Query query;
		String sql;
		List<Medium> mediumList = new ArrayList<>();
		if (search != null && search.length() > 0 ) {
			// find all matching titles
			
			sql = "SELECT t FROM Title t, Medium m WHERE m IN ("+mediumNotInListQuery+") AND t IN (m.titles) AND lower(t.name) LIKE lower(concat('%', :search, '%'))";
			query = entityManager.createQuery(sql)
													 .setParameter("search", search);
			// find all media
			if ( start != null && start > 0 ) query.setFirstResult(start);
			if ( length != null && length > 0 ) query.setMaxResults(length);
			// mediumList = castList(Medium.class, query.getResultList());
			List<Title> titleList = castList(Title.class, query.getResultList());
			for (Title title : titleList) {
				for (Medium medium : title.getMediums3()) {
					if (!(mediumList.contains(medium))) {
						mediumList.add(medium);
					}
				}
			}
			recordsFiltered = mediumList.size();
		} else {
			sql = mediumNotInListQuery+" ORDER BY "+column+" "+direction;
			query = entityManager.createQuery(sql);
			if ( start != null && start > 0 ) query.setFirstResult(start);
			if ( length != null && length > 0 ) query.setMaxResults(length);
			mediumList = castList(Medium.class, query.getResultList());
		}
		return Response.ok().entity(new DatatableInfo(draw, recordsTotal, recordsFiltered, mediumList)).build();
	}

	@GET
	@Path("listCard")
	@Produces(MediaType.APPLICATION_JSON)
	@Secured
	@SuppressWarnings("unchecked")
	public Response getAllCollections(@QueryParam("noContents") String noContents) {
		EntityManager em = TIMAATApp.emf.createEntityManager();
		
		// TODO get all mediacollections no matter the type, display type in frontend instead
		List<MediaCollection> cols = (List<MediaCollection>) em.createQuery("SELECT mc from MediaCollection mc WHERE mc.mediaCollectionType=:type ORDER BY mc.title ASC")
				.setParameter("type", em.find(MediaCollectionType.class, 2)) // TODO refactor type
				.getResultList();
		
		// strip analysislists
		for ( MediaCollection col : cols ) {
			if ( noContents != null ) col.getMediaCollectionHasMediums().clear();
			for ( MediaCollectionHasMedium m : col.getMediaCollectionHasMediums() ) {
				m.getMedium().getMediumAnalysisLists().clear();
				m.getMedium().getFileStatus();
				m.getMedium().getViewToken();
			}
		}
		
		return Response.ok().entity(cols).build();
	}

	@GET
	@Path("{id}")
	@Produces(MediaType.APPLICATION_JSON)
	@Secured
	public Response getCollection(
			@PathParam("id") int id,
			@QueryParam("noContents") String noContents
			) {
		EntityManager em = TIMAATApp.emf.createEntityManager();
		
		MediaCollection col = em.find(MediaCollection.class, id);
		
		if ( col == null ) return Response.status(Status.NOT_FOUND).build();
		
		if ( noContents != null ) col.getMediaCollectionHasMediums().clear();
		// strip analysislists
		for ( MediaCollectionHasMedium m : col.getMediaCollectionHasMediums() ) {
			m.getMedium().getMediumAnalysisLists().clear();
			m.getMedium().getFileStatus();
			m.getMedium().getViewToken();

		}
	
		return Response.ok().entity(col).build();
	}

	@GET
	@Path("{id}/media")
	@Produces(MediaType.APPLICATION_JSON)
	@Secured
	public Response getCollectionMedia(
			@PathParam("id") int id,
			@QueryParam("draw") Integer draw,
			@QueryParam("start") Integer start,
			@QueryParam("length") Integer length,
			@QueryParam("mediumsubtype") String mediumSubType,
			@QueryParam("orderby") String orderby,
			@QueryParam("dir") String direction,
			@QueryParam("search") String search
			) {
		EntityManager em = TIMAATApp.emf.createEntityManager();
		
		if ( draw == null ) draw = 0;
		
		MediaCollection col = em.find(MediaCollection.class, id);
		if ( col == null ) return Response.status(Status.NOT_FOUND).build();

		// sanitize user input
		if ( direction != null && direction.equalsIgnoreCase("desc" ) ) direction = "DESC"; else direction = "ASC";

		String column = "mchm.medium.id";
		if ( orderby != null ) {
			if (orderby.equalsIgnoreCase("title")) column = "mchm.medium.title1.name";
			if (orderby.equalsIgnoreCase("duration")) column = "mchm.medium.mediumVideo.length";
			if (orderby.equalsIgnoreCase("releaseDate")) column = "mchm.medium.releaseDate";
			// TODO producer, seems way to complex to put in DB query
			// - dependencies  --> actor --> actornames --> actorname.isdisplayname
			// + --> role == 5 --> producer 
		}

		String subType = "";
		if ( mediumSubType != null && mediumSubType.compareTo("video") == 0 ) subType = "AND mchm.medium.mediumVideo != NULL";

		// calculate total # of records
		Query countQuery = TIMAATApp.emf.createEntityManager().createQuery("SELECT COUNT(mchm.medium) FROM MediaCollectionHasMedium mchm WHERE mchm.mediaCollection.id=:id "+subType);
		countQuery.setParameter("id", id);
		long recordsTotal = (long) countQuery.getSingleResult();
		long recordsFiltered = recordsTotal;

		// search
		Query query;
		if ( search != null && search.length() > 0 ) {
			// calculate search result # of records
			countQuery = TIMAATApp.emf.createEntityManager().createQuery(
					"SELECT COUNT(mchm.medium) FROM MediaCollectionHasMedium mchm WHERE lower(mchm.medium.title1.name) LIKE lower(concat('%', :title1,'%')) AND mchm.mediaCollection.id=:id "+subType);
			countQuery.setParameter("id", id);
			countQuery.setParameter("title1", search);
			recordsFiltered = (long) countQuery.getSingleResult();
			// perform search
			query = TIMAATApp.emf.createEntityManager().createQuery(
					"SELECT mchm.medium FROM MediaCollectionHasMedium mchm WHERE lower(mchm.medium.title1.name) LIKE lower(concat('%', :title1,'%')) AND mchm.mediaCollection.id=:id "+subType+" ORDER BY "+column+" "+direction);
			query.setParameter("title1", search);
//			query.setParameter("title2", search);
		} else {
			query = TIMAATApp.emf.createEntityManager().createQuery(
					"SELECT mchm.medium FROM MediaCollectionHasMedium mchm WHERE mchm.mediaCollection.id=:id "+subType+" ORDER BY "+column+" "+direction);
		}
		query.setParameter("id", id);

		if ( start != null && start > 0 ) query.setFirstResult(start);
		if ( length != null && length > 0 ) query.setMaxResults(length);

		List<Medium> media = castList(Medium.class, query.getResultList());

		// strip analysislists
		for ( Medium m : media ) {
			m.getMediumAnalysisLists().clear();
			m.getFileStatus();
			m.getViewToken();
		}
	
		return Response.ok().entity(new DatatableInfo(draw, recordsTotal, recordsFiltered, media)).build();
	}
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("{mediumCollectionId}/hasTagList")
	public Response getTagList(@PathParam("mediumCollectionId") Integer mediumCollectionId)
	{
		// System.out.println("MediumCollectionServiceEndpoint: getTagList");
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		MediaCollection mediumCollection = entityManager.find(MediaCollection.class, mediumCollectionId);
		if ( mediumCollection == null ) return Response.status(Status.NOT_FOUND).build();
		entityManager.refresh(mediumCollection);
		return Response.ok().entity(mediumCollection.getTags()).build();
	}

	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Secured
	// @Path("/")
	public Response createMediaCollectionOld(String jsonData) {
		System.out.println("MediumCollectionServiceEndpoint: createMediaCollection OLD : " + jsonData);
		ObjectMapper mapper = new ObjectMapper();
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		MediaCollection newCol = null;    	
    	EntityManager em = TIMAATApp.emf.createEntityManager();
    	// parse JSON data
		try {
			newCol = mapper.readValue(jsonData, MediaCollection.class);
		} catch (IOException e) {
			e.printStackTrace();
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( newCol == null ) return Response.status(Status.BAD_REQUEST).build();
		// sanitize object data
		newCol.setId(0);
		newCol.setIsSystemic(false);
		newCol.setMediaCollectionAlbum(null);
		newCol.setMediaCollectionAnalysisLists(new ArrayList<MediaCollectionAnalysisList>());
		newCol.setMediaCollectionHasMediums(new ArrayList<MediaCollectionHasMedium>());
		newCol.setTags(null);
		newCol.setMediaCollectionSeries(null);
		newCol.setMediaCollectionType(em.find(MediaCollectionType.class, 2)); // TODO refactor
		// update log metadata
		// TODO log not in model

		// persist mediacollection
		EntityTransaction tx = em.getTransaction();
		tx.begin();
		em.persist(newCol);
		em.flush();
		tx.commit();
		em.refresh(newCol);
		
		// add log entry
		if ( containerRequestContext.getProperty("TIMAAT.userID") != null ) {
			UserLogManager.getLogger().addLogEntry((int)containerRequestContext.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.MEDIACOLLECTIONCREATED);

		} else {
			// DEBUG do nothing - production system should abort with internal server error		
			return Response.serverError().build();
		}
		
		return Response.ok().entity(newCol).build();
	}
	
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Secured
	@Path("/{id}")
	public Response createMediaCollection(String jsonData) {
		System.out.println("MediumCollectionServiceEndpoint: createMediaCollection: " + jsonData);
		ObjectMapper mapper = new ObjectMapper();
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		MediaCollection newCol = null;    	
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		// parse JSON data
		try {
			newCol = mapper.readValue(jsonData, MediaCollection.class);
		} catch (IOException e) {
			e.printStackTrace();
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( newCol == null ) return Response.status(Status.BAD_REQUEST).build();
		// sanitize object data
		newCol.setId(0);
		// newCol.setMediaCollectionAlbum(null);
		newCol.setMediaCollectionAnalysisLists(new ArrayList<MediaCollectionAnalysisList>());
		newCol.setMediaCollectionHasMediums(new ArrayList<MediaCollectionHasMedium>());
		newCol.setTags(null);
		// newCol.setMediaCollectionSeries(null);
		// newCol.setMediaCollectionType(entityManager.find(MediaCollectionType.class, 2)); // TODO refactor
		// update log metadata
		// TODO log not in model

		// persist mediacollection
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.persist(newCol);
		entityManager.flush();
		entityTransaction.commit();
		entityManager.refresh(newCol);
		
		// add log entry
		if ( containerRequestContext.getProperty("TIMAAT.userID") != null ) {
			UserLogManager.getLogger().addLogEntry((int)containerRequestContext.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.MEDIACOLLECTIONCREATED);

		} else {
			// DEBUG do nothing - production system should abort with internal server error		
			return Response.serverError().build();
		}
		
		return Response.ok().entity(newCol).build();
	}
	
	@PATCH
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
	@Path("{id}")
	@Secured
	public Response updateMediaCollection(@PathParam("id") int id, String jsonData) {
		System.out.println("MediumCollectionServiceEndpoint: updateMediaCollection: " + jsonData);

		ObjectMapper mapper = new ObjectMapper();
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		MediaCollection updatedCollection = null;
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		MediaCollection collection = entityManager.find(MediaCollection.class, id);

		if ( collection == null ) return Response.status(Status.NOT_FOUND).build();
    	// parse JSON data
		try {
			updatedCollection = mapper.readValue(jsonData, MediaCollection.class);
		} catch (IOException e) {
			System.out.println(e);
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( updatedCollection == null ) return Response.notModified().build();
		    	
		// update medium collection data
		if ( updatedCollection.getIsSystemic() != null) collection.setIsSystemic(updatedCollection.getIsSystemic());
		if ( updatedCollection.getTitle() != null ) collection.setTitle(updatedCollection.getTitle());
		if ( updatedCollection.getRemark() != null ) collection.setRemark(updatedCollection.getRemark());
		List<Tag> oldTags = collection.getTags();
		collection.setTags(updatedCollection.getTags());

		// TODO update log metadata in general log
		
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.merge(collection);
		entityManager.persist(collection);
		entityTransaction.commit();
		entityManager.refresh(collection);
		for (Tag tag : collection.getTags()) {
			entityManager.refresh(tag);
		}
		for (Tag tag : oldTags) {
			entityManager.refresh(tag);
		}

		// add log entry
		UserLogManager.getLogger()
									.addLogEntry((int) containerRequestContext.getProperty("TIMAAT.userID"),
															 UserLogManager.LogEvents.MEDIACOLLECTIONEDITED);

		return Response.ok().entity(collection).build();
	}
	
	@DELETE
    @Produces(MediaType.APPLICATION_JSON)
	@Path("{id}")
	@Secured
	public Response deleteMediaCollection(@PathParam("id") int id) {
		System.out.println("MediumCollectionServiceEndpoint: deleteMediaCollection");
    	
    	EntityManager entityManager = TIMAATApp.emf.createEntityManager();
    	MediaCollection col = entityManager.find(MediaCollection.class, id);
    	if ( col == null ) return Response.status(Status.NOT_FOUND).build();

		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.remove(col);
		entityTransaction.commit();

		// add log entry
		UserLogManager.getLogger()
									.addLogEntry((int) containerRequestContext.getProperty("TIMAAT.userID"), 
															 UserLogManager.LogEvents.MEDIACOLLECTIONDELETED);
		System.out.println("MediumCollectionServiceEndpoint: deleteMediumCollection - delete complete");	
		return Response.ok().build();
	}
	
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("Album/{id}")
	@Secured
	public Response createAlbum(@PathParam("id") int id, String jsonData) {
		System.out.println("MediumCollectionServiceEndpoint: createAlbum jsonData: "+jsonData);

		ObjectMapper mapper = new ObjectMapper();
		MediaCollectionAlbum newAlbum = null;
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();

		// parse JSON data
		try {
			newAlbum = mapper.readValue(jsonData, MediaCollectionAlbum.class);
		} catch (IOException e) {
			System.out.println("MediumCollectionServiceEndpoint: createAlbum: IOException e !");
			e.printStackTrace();
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( newAlbum == null ) {
			System.out.println("MediumCollectionServiceEndpoint: createAlbum: newAlbum == null !");
			return Response.status(Status.BAD_REQUEST).build();
		}
		// sanitize object data

		// update log metadata
		// Not necessary, a album will always be created in conjunction with a medium

		// persist album
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.persist(newAlbum);
		entityManager.flush();
		entityTransaction.commit();
		entityManager.refresh(newAlbum);
		entityManager.refresh(newAlbum.getMediaCollection());

		// add log entry
		// UserLogManager.getLogger().addLogEntry(newAlbum.getMediaCollection().getCreatedByUserAccount().getId(), UserLogManager.LogEvents.ALBUMCREATED);
		System.out.println("MediumCollectionServiceEndpoint: album created with id "+newAlbum.getMediaCollectionId());
		return Response.ok().entity(newAlbum).build();
	}

	@PATCH
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("Album/{id}")
	@Secured
	public Response updateAlbum(@PathParam("id") int id, String jsonData) {
		System.out.println("MediumCollectionServiceEndpoint: updateAlbum - jsonData: " + jsonData);

		ObjectMapper mapper = new ObjectMapper();
		MediaCollectionAlbum updatedAlbum = null;    	
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		MediaCollectionAlbum album = entityManager.find(MediaCollectionAlbum.class, id);
		
		if ( album == null ) return Response.status(Status.NOT_FOUND).build();		
		// parse JSON data
		try {
			updatedAlbum = mapper.readValue(jsonData, MediaCollectionAlbum.class);
		} catch (IOException e) {
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( updatedAlbum == null ) return Response.notModified().build();    	
		
		// update album
		// System.out.println("MediumCollectionServiceEndpoint: updateAlbum - album.id:"+album.getMediaCollectionId());
		if ( updatedAlbum.getTracks() > 0) album.setTracks(updatedAlbum.getTracks());
		
		// update log metadata
		// album.getMediaCollection().setLastEditedAt(new Timestamp(System.currentTimeMillis()));
		// if ( containerRequestContext.getProperty("TIMAAT.userID") != null ) {
		// 	album.getMediaCollection().setLastEditedByUserAccount((entityManager.find(UserAccount.class, containerRequestContext.getProperty("TIMAAT.userID"))));
		// } else {
		// 	// DEBUG do nothing - production system should abort with internal server error			
		// }		
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.merge(album);
		entityManager.persist(album);
		entityTransaction.commit();
		entityManager.refresh(album);

		// add log entry
		// UserLogManager.getLogger().addLogEntry((int) containerRequestContext.getProperty("TIMAAT.userID"), 
		// 																				UserLogManager.LogEvents.ALBUMEDITED);
		System.out.println("MediumCollectionServiceEndpoint: updateAlbum - update complete");	
		return Response.ok().entity(album).build();
	}

	@DELETE
	@Produces(MediaType.APPLICATION_JSON)
	@Path("Album/{id}")
	@Secured
	public Response deleteAlbum(@PathParam("id") int id) {  
		System.out.println("MediumCollectionServiceEndpoint: deleteAlbum with id: "+ id);
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		MediaCollection MediumCollection = entityManager.find(MediaCollection.class, id);
		if ( MediumCollection == null ) return Response.status(Status.NOT_FOUND).build();
		MediaCollectionAlbum album = entityManager.find(MediaCollectionAlbum.class, id);
		if ( album == null ) return Response.status(Status.NOT_FOUND).build();		
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.remove(album);
		entityManager.remove(album.getMediaCollection()); // remove album, then corresponding medium collection
		entityTransaction.commit();
		// add log entry
		// UserLogManager.getLogger()
		// 							.addLogEntry((int) containerRequestContext.getProperty("TIMAAT.userID"), 
		// 														UserLogManager.LogEvents.ALBUMDELETED);
		System.out.println("MediumCollectionServiceEndpoint: deleteAlbum - album deleted");  
		return Response.ok().build();
	}

	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("Series/{id}")
	@Secured
	public Response createSeries(@PathParam("id") int id, String jsonData) {
		System.out.println("MediumCollectionServiceEndpoint: createSeries jsonData: "+jsonData);

		ObjectMapper mapper = new ObjectMapper();
		MediaCollectionSeries newSeries = null;
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();

		// parse JSON data
		try {
			newSeries = mapper.readValue(jsonData, MediaCollectionSeries.class);
		} catch (IOException e) {
			System.out.println("MediumCollectionServiceEndpoint: createSeries: IOException e !");
			e.printStackTrace();
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( newSeries == null ) {
			System.out.println("MediumCollectionServiceEndpoint: createSeries: newSeries == null !");
			return Response.status(Status.BAD_REQUEST).build();
		}
		// sanitize object data

		// update log metadata
		// Not necessary, a series will always be created in conjunction with a medium

		// persist series
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.persist(newSeries);
		entityManager.flush();
		entityTransaction.commit();
		entityManager.refresh(newSeries);
		entityManager.refresh(newSeries.getMediaCollection());

		// add log entry
		// UserLogManager.getLogger().addLogEntry(newSeries.getMediaCollection().getCreatedByUserAccount().getId(), UserLogManager.LogEvents.SERIESCREATED);
		System.out.println("MediumCollectionServiceEndpoint: series created with id "+newSeries.getMediaCollectionId());
		return Response.ok().entity(newSeries).build();
	}

	@PATCH
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("Series/{id}")
	@Secured
	public Response updateSeries(@PathParam("id") int id, String jsonData) {
		System.out.println("MediumCollectionServiceEndpoint: updateSeries - jsonData: " + jsonData);

		ObjectMapper mapper = new ObjectMapper();
		MediaCollectionSeries updatedSeries = null;    	
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		MediaCollectionSeries series = entityManager.find(MediaCollectionSeries.class, id);
		
		if ( series == null ) return Response.status(Status.NOT_FOUND).build();		
		// parse JSON data
		try {
			updatedSeries = mapper.readValue(jsonData, MediaCollectionSeries.class);
		} catch (IOException e) {
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( updatedSeries == null ) return Response.notModified().build();    	
		
		// update series
		// System.out.println("MediumCollectionServiceEndpoint: updateSeries - series.id:"+series.getMediaCollectionId());
		if ( updatedSeries.getSeasons() > 0) series.setSeasons(updatedSeries.getSeasons());
		if ( updatedSeries.getStarted() != null) series.setStarted(updatedSeries.getStarted());
		if ( updatedSeries.getEnded() != null) series.setEnded(updatedSeries.getEnded());
		
		// update log metadata
		// series.getMediaCollection().setLastEditedAt(new Timestamp(System.currentTimeMillis()));
		// if ( containerRequestContext.getProperty("TIMAAT.userID") != null ) {
		// 	series.getMediaCollection().setLastEditedByUserAccount((entityManager.find(UserAccount.class, containerRequestContext.getProperty("TIMAAT.userID"))));
		// } else {
		// 	// DEBUG do nothing - production system should abort with internal server error			
		// }		
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.merge(series);
		entityManager.persist(series);
		entityTransaction.commit();
		entityManager.refresh(series);

		// add log entry
		// UserLogManager.getLogger().addLogEntry((int) containerRequestContext.getProperty("TIMAAT.userID"), 
		// 																				UserLogManager.LogEvents.SERIESEDITED);
		System.out.println("MediumCollectionServiceEndpoint: updateSeries - update complete");	
		return Response.ok().entity(series).build();
	}

	@DELETE
	@Produces(MediaType.APPLICATION_JSON)
	@Path("Series/{id}")
	@Secured
	public Response deleteSeries(@PathParam("id") int id) {  
		System.out.println("MediumCollectionServiceEndpoint: deleteSeries with id: "+ id);
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		MediaCollection MediumCollection = entityManager.find(MediaCollection.class, id);
		if ( MediumCollection == null ) return Response.status(Status.NOT_FOUND).build();
		MediaCollectionSeries series = entityManager.find(MediaCollectionSeries.class, id);
		if ( series == null ) return Response.status(Status.NOT_FOUND).build();		
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.remove(series);
		entityManager.remove(series.getMediaCollection()); // remove series, then corresponding medium collection
		entityTransaction.commit();
		// add log entry
		// UserLogManager.getLogger()
		// 							.addLogEntry((int) containerRequestContext.getProperty("TIMAAT.userID"), 
		// 														UserLogManager.LogEvents.SERIESDELETED);
		System.out.println("MediumCollectionServiceEndpoint: deleteSeries - series deleted");  
		return Response.ok().build();
	}

	@POST
    @Produces(MediaType.APPLICATION_JSON)
	@Path("{id}/medium/{mediumId}")
	@Secured
	public Response addMediaCollectionItem(@PathParam("id") int id, @PathParam("mediumId") int mediumId) {
		System.out.println("TCL: MediaCollectionEndpoint -> addMediaCollectionItem");
    	
    	EntityManager em = TIMAATApp.emf.createEntityManager();
    	MediaCollection col = em.find(MediaCollection.class, id);
    	if ( col == null ) return Response.status(Status.NOT_FOUND).build();
    	Medium m = em.find(Medium.class, mediumId);
    	if ( m == null ) return Response.status(Status.NOT_FOUND).build();
    	
    	MediaCollectionHasMedium mchm = null;
    	try {
				mchm = (MediaCollectionHasMedium) em.createQuery(
					"SELECT mchm FROM MediaCollectionHasMedium mchm WHERE mchm.mediaCollection=:collection AND mchm.medium=:medium")
						.setParameter("collection", col)
						.setParameter("medium", m)
						.getSingleResult();    		
    	} catch (Exception e) {
    		// doesn't matter
    	}
    	
    	if ( mchm == null ) {
    		mchm = new MediaCollectionHasMedium();
    		mchm.setMediaCollection(col);
    		mchm.setMedium(m);
        	try {
        		EntityTransaction tx = em.getTransaction();
        		tx.begin();
        		em.persist(mchm);
        		tx.commit();
            	em.refresh(col);
        	} catch (Exception e) {
        		e.printStackTrace();
        		return Response.notModified().build();
        	}
    	}
    	    	
		// add log entry
		UserLogManager.getLogger().addLogEntry((int) containerRequestContext.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.MEDIACOLLECTIONEDITED);

		return Response.ok().entity(true).build();
	}

	@DELETE
    @Produces(MediaType.APPLICATION_JSON)
	@Path("{id}/medium/{mediumId}")
	@Secured
	public Response deleteMediaCollectionItem(@PathParam("id") int id, @PathParam("mediumId") int mediumId) {
		System.out.println("TCL: MediaCollectionEndpoint -> deleteMediaCollectionItem");
		EntityManager em = TIMAATApp.emf.createEntityManager();
		MediaCollection col = em.find(MediaCollection.class, id);
		if ( col == null ) return Response.status(Status.NOT_FOUND).build();
		Medium m = em.find(Medium.class, mediumId);
		if ( m == null ) return Response.status(Status.NOT_FOUND).build();

		try {
			EntityTransaction tx = em.getTransaction();
			tx.begin();
				em.createQuery("DELETE FROM MediaCollectionHasMedium mchm WHERE mchm.mediaCollection=:collection AND mchm.medium=:medium")
				.setParameter("collection", col)
				.setParameter("medium", m)
				.executeUpdate();
			tx.commit();
				em.refresh(col);
		} catch (Exception e) {
			e.printStackTrace();
			return Response.notModified().build();
		}
    	
		// add log entry
		UserLogManager.getLogger().addLogEntry((int) containerRequestContext.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.MEDIACOLLECTIONDELETED);

		return Response.ok().entity(true).build();
	}

	@POST
  @Produces(MediaType.APPLICATION_JSON)
	@Path("{mediumCollectionId}/tag/{tagId}")
	@Secured
	public Response addExistingTag(@PathParam("mediumCollectionId") int mediumCollectionId,
																 @PathParam("tagId") int tagId) {
		
    	
    	EntityManager entityManager = TIMAATApp.emf.createEntityManager();
    	MediaCollection mediumCollection = entityManager.find(MediaCollection.class, mediumCollectionId);
			if ( mediumCollection == null ) return Response.status(Status.NOT_FOUND).build();
			Tag tag = entityManager.find(Tag.class, tagId);
			if ( tag == null ) return Response.status(Status.NOT_FOUND).build();
			
        // attach tag to annotation and vice versa    	
    		EntityTransaction entityTransaction = entityManager.getTransaction();
    		entityTransaction.begin();
    		mediumCollection.getTags().add(tag);
    		tag.getMediaCollections().add(mediumCollection);
    		entityManager.merge(tag);
    		entityManager.merge(mediumCollection);
    		entityManager.persist(mediumCollection);
    		entityManager.persist(tag);
    		entityTransaction.commit();
    		entityManager.refresh(mediumCollection);
 	
		return Response.ok().entity(tag).build();
	}

	@DELETE
  @Produces(MediaType.APPLICATION_JSON)
	@Path("{mediumCollectionId}/tag/{tagId}")
	@Secured
	public Response removeTag(@PathParam("mediumCollectionId") int mediumCollectionId,
														@PathParam("tagId") int tagId) {
		
    	EntityManager entityManager = TIMAATApp.emf.createEntityManager();
    	MediaCollection mediumCollection = entityManager.find(MediaCollection.class, mediumCollectionId);
			if ( mediumCollection == null ) return Response.status(Status.NOT_FOUND).build();
			Tag tag = entityManager.find(Tag.class, tagId);
    	if ( tag == null ) return Response.status(Status.NOT_FOUND).build();
    	
        	// attach tag to annotation and vice versa    	
    		EntityTransaction entityTransaction = entityManager.getTransaction();
    		entityTransaction.begin();
    		mediumCollection.getTags().remove(tag);
    		tag.getMediaCollections().remove(mediumCollection);
    		entityManager.merge(tag);
    		entityManager.merge(mediumCollection);
    		entityManager.persist(mediumCollection);
    		entityManager.persist(tag);
    		entityTransaction.commit();
    		entityManager.refresh(mediumCollection);
 	
		return Response.ok().build();
	}

	public static <T> List<T> castList(Class<? extends T> clazz, Collection<?> c) {
		List<T> r = new ArrayList<T>(c.size());
		for(Object o: c)
			r.add(clazz.cast(o));
		return r;
    }
	
}
