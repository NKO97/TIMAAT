package de.bitgilde.TIMAAT.rest.endpoint;

import java.io.IOException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityTransaction;
import jakarta.persistence.NoResultException;
import jakarta.persistence.Query;
import jakarta.servlet.ServletContext;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.PATCH;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.Response.Status;
import jakarta.ws.rs.core.UriInfo;

import org.jvnet.hk2.annotations.Service;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;

import de.bitgilde.TIMAAT.DisplayElementNameAndPermission;
import de.bitgilde.TIMAAT.SelectElement;
import de.bitgilde.TIMAAT.TIMAATApp;
import de.bitgilde.TIMAAT.model.DataTableInfo;
import de.bitgilde.TIMAAT.model.FIPOP.MediaCollection;
import de.bitgilde.TIMAAT.model.FIPOP.MediaCollectionAlbum;
import de.bitgilde.TIMAAT.model.FIPOP.MediaCollectionAnalysisList;
import de.bitgilde.TIMAAT.model.FIPOP.MediaCollectionHasMedium;
import de.bitgilde.TIMAAT.model.FIPOP.MediaCollectionSeries;
import de.bitgilde.TIMAAT.model.FIPOP.MediaCollectionType;
import de.bitgilde.TIMAAT.model.FIPOP.MediaCollectionTypeTranslation;
import de.bitgilde.TIMAAT.model.FIPOP.Medium;
import de.bitgilde.TIMAAT.model.FIPOP.PermissionType;
import de.bitgilde.TIMAAT.model.FIPOP.Tag;
import de.bitgilde.TIMAAT.model.FIPOP.UserAccount;
import de.bitgilde.TIMAAT.model.FIPOP.UserAccountHasMediaCollection;
import de.bitgilde.TIMAAT.rest.Secured;
import de.bitgilde.TIMAAT.rest.filter.AuthenticationFilter;
import de.bitgilde.TIMAAT.security.UserLogManager;

/**
*
* @author Jens-Martin Loebel <loebel@bitgilde.de>
*/

@Service
@Path("/mediumCollection")
public class EndpointMediumCollection {
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
																			@QueryParam("search") String search,
																			@QueryParam("authToken") String authToken) {
		// System.out.println("EndpointMediumCollection: getAllMediaCollections: draw: "+draw+" start: "+start+" length: "+length+" orderby: "+orderby+" dir: "+direction+" search: "+search);
		// verify auth token
		int userId = 0;
		if (AuthenticationFilter.isTokenValid(authToken)) {
			userId = AuthenticationFilter.getTokenClaimUserId(authToken);
		} else {
			return Response.status(Status.UNAUTHORIZED).build();
		}

		if ( draw == null ) draw = 0;

		// sanitize user input
		if ( direction != null && direction.equalsIgnoreCase("desc") ) direction = "DESC"; else direction = "ASC";
		String column = "mc.id";
		if ( orderby != null) {
			if (orderby.equalsIgnoreCase("title")) column = "mc.title";
		}

		EntityManager entityManager = TIMAATApp.emf.createEntityManager();

		// calculate total # of records that are accessible to the user
		Query countQuery;

		if (userId == 1) { // admin
			countQuery = entityManager.createQuery("SELECT COUNT(mc) FROM MediaCollection mc");
		} else {
			countQuery = entityManager.createQuery("SELECT COUNT(DISTINCT mc) FROM MediaCollection mc, UserAccountHasMediaCollection uahmc WHERE mc.id = uahmc.mediaCollection.id AND uahmc.userAccount.id = :userId OR mc.globalPermission > 0")
																.setParameter("userId", userId);
		}
		long recordsTotal = (long) countQuery.getSingleResult();
		long recordsFiltered = recordsTotal;

		// search
		Query query;
		String sql;
		List<MediaCollection> mediumCollectionList = new ArrayList<>();
		if (search != null && search.length() > 0 ) {
			// find all matching titles
			if (userId == 1) { // admin
				sql = "SELECT mc FROM MediaCollection mc WHERE lower(mc.title) LIKE lower(concat('%', :search, '%')) ORDER BY mc.title "+direction;
				query = entityManager.createQuery(sql)
				.setParameter("search", search);
			} else {
				sql = "SELECT DISTINCT mc FROM MediaCollection mc, UserAccountHasMediaCollection uahmc WHERE lower(mc.title) LIKE lower(concat('%', :search, '%')) AND (mc.id = uahmc.mediaCollection.id AND uahmc.userAccount.id = :userId OR mc.globalPermission > 0) ORDER BY mc.title "+direction;
				query = entityManager.createQuery(sql)
				.setParameter("search", search)
				.setParameter("userId", userId);
			}
			// find all mediaCollections
			if ( start != null && start > 0 ) query.setFirstResult(start);
			if ( length != null && length > 0 ) query.setMaxResults(length);
			mediumCollectionList = castList(MediaCollection.class, query.getResultList());
			recordsFiltered = mediumCollectionList.size();
		} else {
			if (userId == 1) { // admin
				sql = "SELECT mc FROM MediaCollection mc ORDER BY "+column+" "+direction;
				query = entityManager.createQuery(sql);
			} else {
				sql = "SELECT DISTINCT mc FROM MediaCollection mc, UserAccountHasMediaCollection uahmc WHERE mc.id = uahmc.mediaCollection.id AND uahmc.userAccount.id = :userId OR mc.globalPermission > 0 ORDER BY "+column+" "+direction;
				query = entityManager.createQuery(sql)
														 .setParameter("userId", userId);
			}
			if ( start != null && start > 0 ) query.setFirstResult(start);
			if ( length != null && length > 0 ) query.setMaxResults(length);
			mediumCollectionList = castList(MediaCollection.class, query.getResultList());
		}
		return Response.ok().entity(new DataTableInfo(draw, recordsTotal, recordsFiltered, mediumCollectionList)).build();
	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("{id}/mediaList")
	public Response getMediaCollectionItems(@PathParam("id") Integer id,
																					@QueryParam("draw") Integer draw,
																					@QueryParam("start") Integer start,
																					@QueryParam("length") Integer length,
																					@QueryParam("orderby") String orderby,
																					@QueryParam("dir") String direction,
																					@QueryParam("search") String search ) {
		System.out.println("TCL: EndpointMediumCollection: getMediaCollectionItems: id: "+id+" draw: "+draw+" start: "+start+" length: "+length+" orderby: "+orderby+" dir: "+direction+" search: "+search);
		if ( draw == null ) draw = 0;

		// sanitize user input
		if ( direction != null && direction.equalsIgnoreCase("desc") ) direction = "DESC"; else direction = "ASC";
		String column = "m.displayTitle.name";
		if ( orderby != null) {
			if (orderby.equalsIgnoreCase("title")) column = "m.displayTitle.name";
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
			// find all matching media
			sql = "SELECT m FROM Title t, Medium m WHERE m IN ("+mediumCollectionListQuery+") AND t IN (m.titles) AND lower(t.name) LIKE lower(concat('%', :search, '%')) ORDER BY m.displayTitle.name "+direction;
			query = entityManager.createQuery(sql)
													 .setParameter("search", search);
			mediumList = castList(Medium.class, query.getResultList());
			// find all media
			if ( start != null && start > 0 ) query.setFirstResult(start);
			if ( length != null && length > 0 ) query.setMaxResults(length);
			if ( length == -1 ) { // display all results
				length = mediumList.size();
				query.setMaxResults(length);
			}
			// List<Title> titleList = castList(Title.class, query.getResultList());
			// System.out.println("#searchResults: "+ titleList.size());
			// for (Title title : titleList) {
			// 	for (Medium medium : title.getMediums3()) {
			// 		if (!(mediumList.contains(medium))) {
			// 			mediumList.add(medium);
			// 		}
			// 	}
			// }
			recordsFiltered = mediumList.size();
			List<Medium> filteredMediumList = new ArrayList<>();
			int i = start;
			int end;
			if ((recordsFiltered - start) < length) {
				end = (int)recordsFiltered;
			}
			else {
				end = start + length;
			}
			for(; i < end; i++) {
				filteredMediumList.add(mediumList.get(i));
			}
			return Response.ok().entity(new DataTableInfo(draw, recordsTotal, recordsFiltered, filteredMediumList)).build();
		} else {
			sql = mediumCollectionListQuery+" ORDER BY "+column+" "+direction;
			query = entityManager.createQuery(sql);
			if ( start != null && start > 0 ) query.setFirstResult(start);
			if ( length != null && length > 0 ) query.setMaxResults(length);
			mediumList = castList(Medium.class, query.getResultList());
		}
		return Response.ok().entity(new DataTableInfo(draw, recordsTotal, recordsFiltered, mediumList)).build();
	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("{id}/hasMediaList")
	public Response getMediaCollectionHasMediaList(@PathParam("id") Integer id,
																								 @QueryParam("draw") Integer draw,
																								 @QueryParam("start") Integer start,
																								 @QueryParam("length") Integer length,
																								 @QueryParam("orderby") String orderby,
																								 @QueryParam("dir") String direction,
																								 @QueryParam("search") String search ) {
		// System.out.println("TCL: EndpointMediumCollection: getMediaCollectionHasMediaList: id: "+id+" draw: "+draw+" start: "+start+" length: "+length+" orderby: "+orderby+" dir: "+direction+" search: "+search);
		if ( draw == null ) draw = 0;

		// sanitize user input
		if ( direction != null && direction.equalsIgnoreCase("desc") ) direction = "DESC"; else direction = "ASC";
		String column = "mchm.sortOrder";
		if ( orderby != null) {
			if (orderby.equalsIgnoreCase("title")) column = "mchm.medium.displayTitle.name";
		}

		// calculate total # of records
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Query countQuery = entityManager.createQuery("SELECT COUNT(m) FROM Medium m, MediaCollectionHasMedium mchm WHERE mchm.mediaCollection.id = "+id+" AND m.id = mchm.medium.id");
		long recordsTotal = (long) countQuery.getSingleResult();
		long recordsFiltered = recordsTotal;

		String mediumCollectionListQuery = "SELECT m FROM Medium m, MediaCollectionHasMedium mchm WHERE mchm.mediaCollection.id = "+id+" AND m.id = mchm.medium.id";
		String mediaCollectionListQuery = "SELECT mchm FROM MediaCollectionHasMedium mchm Where mchm.mediaCollection.id = "+id+"";
		// search
		Query query;
		String sql;
		List<Medium> mediumList = new ArrayList<>();
		if (id == 0) { // init dataTable is required but calls function with id 0
			// System.out.println("No collection -> no entries");
			return Response.ok().entity(new DataTableInfo(draw, recordsTotal, recordsFiltered, new ArrayList<>())).build();
		}
		MediaCollection mediaCollection = entityManager.find(MediaCollection.class, id);
		if (mediaCollection == null) return Response.status(Status.BAD_REQUEST).build();
		List<MediaCollectionHasMedium> mediaCollectionHasMediumList = mediaCollection.getMediaCollectionHasMediums();
		List<Medium> collectionMedia = new ArrayList<>();
		for (MediaCollectionHasMedium mediaCollectionHasMedium : mediaCollectionHasMediumList) {
			collectionMedia.add(mediaCollectionHasMedium.getMedium());
		}
		if (search != null && search.length() > 0 ) {
			// find all matching media
			sql = "SELECT m FROM Title t, Medium m WHERE m IN ("+mediumCollectionListQuery+") AND t IN (m.titles) AND lower(t.name) LIKE lower(concat('%', :search, '%')) ORDER BY mchm.sortOrder "+direction;
			query = entityManager.createQuery(sql)
													 .setParameter("search", search);
			mediumList = castList(Medium.class, query.getResultList());
			// find all media
			if ( start != null && start > 0 ) query.setFirstResult(start);
			if ( length != null && length > 0 ) query.setMaxResults(length);
			if ( length == -1 ) { // display all results
				length = mediumList.size();
				query.setMaxResults(length);
			}
			recordsFiltered = mediumList.size();
			List<Medium> filteredMediumList = new ArrayList<>();
			// List<MediaCollectionHasMedium> filteredMediaCollectionHasMediumList = new ArrayList<>();
			int i = start;
			int end;
			if ((recordsFiltered - start) < length) {
				end = (int)recordsFiltered;
			}
			else {
				end = start + length;
			}
			for(; i < end; i++) {
				filteredMediumList.add(mediumList.get(i));
			}
			// System.out.println("Collection has #entries: "+ filteredMediumList.size());
			return Response.ok().entity(new DataTableInfo(draw, recordsTotal, recordsFiltered, filteredMediumList)).build();
		} else {
			sql = mediaCollectionListQuery+" ORDER BY "+column+" "+direction;
			query = entityManager.createQuery(sql);
			if ( start != null && start > 0 ) query.setFirstResult(start);
			if ( length != null && length > 0 ) query.setMaxResults(length);
			// mediumList = castList(Medium.class, query.getResultList());
			mediaCollectionHasMediumList = castList(MediaCollectionHasMedium.class, query.getResultList());
		}
		// System.out.println("Collection has #entries: "+ mediaCollectionHasMediumList.size());
		return Response.ok().entity(new DataTableInfo(draw, recordsTotal, recordsFiltered, mediaCollectionHasMediumList)).build();
	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("{id}/notInMediaList")
	public Response getMediaCollectionItemsNotInList(@PathParam("id") Integer id,
																									 @QueryParam("draw") Integer draw,
																									 @QueryParam("start") Integer start,
																									 @QueryParam("length") Integer length,
																									 @QueryParam("orderby") String orderby,
																									 @QueryParam("dir") String direction,
																									 @QueryParam("search") String search ) {
		System.out.println("TCL: EndpointMediumCollection: getMediaCollectionItemsNotInList: id: "+id+" draw: "+draw+" start: "+start+" length: "+length+" orderby: "+orderby+" dir: "+direction+" search: "+search);
		if ( draw == null ) draw = 0;

		// sanitize user input
		if ( direction != null && direction.equalsIgnoreCase("desc") ) direction = "DESC"; else direction = "ASC";
		String column = "m.displayTitle.name";
		if ( orderby != null) {
			if (orderby.equalsIgnoreCase("title")) column = "m.displayTitle.name";
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
			// find all matching media
			sql = "SELECT m FROM Title t, Medium m WHERE m IN ("+mediumNotInListQuery+") AND t IN (m.titles) AND lower(t.name) LIKE lower(concat('%', :search, '%')) ORDER BY m.displayTitle.name "+direction;
			query = entityManager.createQuery(sql)
													 .setParameter("search", search);
			mediumList = castList(Medium.class, query.getResultList());
			// find all media
			if ( start != null && start > 0 ) query.setFirstResult(start);
			if ( length != null && length > 0 ) query.setMaxResults(length);
			// List<Title> titleList = castList(Title.class, query.getResultList());
			// // several found titles may belong to the same medium
			// for (Title title : titleList) {
			// 	for (Medium medium : title.getMediums3()) {
			// 		if (!(mediumList.contains(medium))) {
			// 			mediumList.add(medium);
			// 		}
			// 	}
			// }
			recordsFiltered = mediumList.size();
			List<Medium> filteredMediumList = new ArrayList<>();
			int i = start;
			int end;
			if ((recordsFiltered - start) < length) {
				end = (int)recordsFiltered;
			}
			else {
				end = start + length;
			}
			for(; i < end; i++) {
				filteredMediumList.add(mediumList.get(i));
			}
			return Response.ok().entity(new DataTableInfo(draw, recordsTotal, recordsFiltered, filteredMediumList)).build();
		} else {
			sql = mediumNotInListQuery+" ORDER BY "+column+" "+direction;
			query = entityManager.createQuery(sql);
			if ( start != null && start > 0 ) query.setFirstResult(start);
			if ( length != null && length > 0 ) query.setMaxResults(length);
			mediumList = castList(Medium.class, query.getResultList());
		}
		return Response.ok().entity(new DataTableInfo(draw, recordsTotal, recordsFiltered, mediumList)).build();
	}

	@GET
	@Path("listCard")
	@Produces(MediaType.APPLICATION_JSON)
	@Secured
	public Response getAllCollections(@QueryParam("noContents") String noContents,
																		@QueryParam("authToken") String authToken) {
		// verify auth token
		int userId = 0;
		if (AuthenticationFilter.isTokenValid(authToken)) {
			userId = AuthenticationFilter.getTokenClaimUserId(authToken);
		} else {
			return Response.status(Status.UNAUTHORIZED).build();
		}

		EntityManager entityManager = TIMAATApp.emf.createEntityManager();

		// TODO get all mediaCollections no matter the type, display type in frontend instead
		// String sql = "SELECT mc from MediaCollection mc WHERE mc.mediaCollectionType=:type ORDER BY mc.title ASC";
		String sql;
		Query query;
		if (userId == 1) { // admin
			sql = "SELECT mc from MediaCollection mc ORDER BY mc.title ASC";
			query = entityManager.createQuery(sql);
		} else {
			sql = "SELECT DISTINCT mc FROM MediaCollection mc, UserAccountHasMediaCollection uahmc WHERE mc.id = uahmc.mediaCollection.id AND uahmc.userAccount.id = :userId OR mc.globalPermission > 0 ORDER BY mc.title ASC";
			query = entityManager.createQuery(sql)
													 .setParameter("userId", userId);
		}
		// query = entityManager.createQuery(sql);
										// .setParameter("type", entityManager.find(MediaCollectionType.class, 2)); // TODO refactor type
		List<MediaCollection> mediaCollectionList = castList(MediaCollection.class, query.getResultList());

		// strip analysisLists
		for ( MediaCollection mediaCollection : mediaCollectionList ) {
			if ( noContents != null ) mediaCollection.getMediaCollectionHasMediums().clear();
			for ( MediaCollectionHasMedium mchm : mediaCollection.getMediaCollectionHasMediums() ) {
				mchm.getMedium().getMediumAnalysisLists().clear();
				mchm.getMedium().getFileStatus();
				mchm.getMedium().getViewToken();
			}
		}

		return Response.ok().entity(mediaCollectionList).build();
	}

	@GET
	@Produces(jakarta.ws.rs.core.MediaType.APPLICATION_JSON)
	@Secured
	@Path("{id}")
	public Response getMediumCollection(@PathParam("id") int id) {
		MediaCollection mediumCollection = TIMAATApp.emf.createEntityManager().find(MediaCollection.class, id);
		if ( mediumCollection == null ) return Response.status(Status.NOT_FOUND).build();
		return Response.ok().entity(mediumCollection).build();
	}

	// @GET
	// @Path("{id}")
	// @Produces(MediaType.APPLICATION_JSON)
	// @Secured
	// public Response getCollection(
	// 		@PathParam("id") int id,
	// 		@QueryParam("noContents") String noContents
	// 		) {
	// 	EntityManager em = TIMAATApp.emf.createEntityManager();

	// 	MediaCollection col = em.find(MediaCollection.class, id);

	// 	if ( col == null ) return Response.status(Status.NOT_FOUND).build();

	// 	if ( noContents != null ) col.getMediaCollectionHasMediums().clear();
	// 	// strip analysisLists
	// 	for ( MediaCollectionHasMedium m : col.getMediaCollectionHasMediums() ) {
	// 		m.getMedium().getMediumAnalysisLists().clear();
	// 		m.getMedium().getFileStatus();
	// 		m.getMedium().getViewToken();

	// 	}

	// 	return Response.ok().entity(col).build();
	// }

	@GET
	@Path("{id}/media")
	@Produces(MediaType.APPLICATION_JSON)
	@Secured
	public Response getCollectionMedia(@PathParam("id") int id,
																		 @QueryParam("draw") Integer draw,
																		 @QueryParam("start") Integer start,
																		 @QueryParam("length") Integer length,
																		 @QueryParam("mediumSubtype") String mediumSubtype,
																		 @QueryParam("orderby") String orderby,
																		 @QueryParam("dir") String direction,
																		 @QueryParam("search") String search)
  {
		EntityManager em = TIMAATApp.emf.createEntityManager();

		if ( draw == null ) draw = 0;

		MediaCollection col = em.find(MediaCollection.class, id);
		if ( col == null ) return Response.status(Status.NOT_FOUND).build();

		// sanitize user input
		if ( direction != null && direction.equalsIgnoreCase("desc" ) ) direction = "DESC"; else direction = "ASC";

		String column = "mchm.medium.id";
		if ( orderby != null ) {
			if (orderby.equalsIgnoreCase("title")) column = "mchm.medium.displayTitle.name";
			if (orderby.equalsIgnoreCase("duration")) column = "mchm.medium.mediumVideo.length";
			if (orderby.equalsIgnoreCase("releaseDate")) column = "mchm.medium.releaseDate";
			// TODO producer, seems way to complex to put in DB query
			// - dependencies  --> actor --> actorNames --> actorName.isdisplayname
			// + --> role == 5 --> producer
		}

		String subtype = "";
		if ( mediumSubtype != null && mediumSubtype.compareTo("video") == 0 ) subtype = "AND mchm.medium.mediumVideo != NULL";

		// calculate total # of records
		Query countQuery = TIMAATApp.emf.createEntityManager().createQuery("SELECT COUNT(mchm.medium) FROM MediaCollectionHasMedium mchm WHERE mchm.mediaCollection.id=:id "+subtype);
		countQuery.setParameter("id", id);
		long recordsTotal = (long) countQuery.getSingleResult();
		long recordsFiltered = recordsTotal;

		// search
		Query query;
		if ( search != null && search.length() > 0 ) {
			// calculate search result # of records
			countQuery = TIMAATApp.emf.createEntityManager().createQuery(
					"SELECT COUNT(mchm.medium) FROM MediaCollectionHasMedium mchm WHERE lower(mchm.medium.displayTitle.name) LIKE lower(concat('%', :displayTitle,'%')) AND mchm.mediaCollection.id=:id "+subtype);
			countQuery.setParameter("id", id);
			countQuery.setParameter("displayTitle", search);
			recordsFiltered = (long) countQuery.getSingleResult();
			// perform search
			query = TIMAATApp.emf.createEntityManager().createQuery(
					"SELECT mchm.medium FROM MediaCollectionHasMedium mchm WHERE lower(mchm.medium.displayTitle.name) LIKE lower(concat('%', :displayTitle,'%')) AND mchm.mediaCollection.id=:id "+subtype+" ORDER BY "+column+" "+direction);
			query.setParameter("displayTitle", search);
//			query.setParameter("title2", search);
		} else {
			query = TIMAATApp.emf.createEntityManager().createQuery(
					"SELECT mchm.medium FROM MediaCollectionHasMedium mchm WHERE mchm.mediaCollection.id=:id "+subtype+" ORDER BY "+column+" "+direction);
		}
		query.setParameter("id", id);

		if ( start != null && start > 0 ) query.setFirstResult(start);
		if ( length != null && length > 0 ) query.setMaxResults(length);

		List<Medium> media = castList(Medium.class, query.getResultList());

		// strip analysisLists
		for ( Medium m : media ) {
			m.getMediumAnalysisLists().clear();
			m.getFileStatus();
			m.getViewToken();
		}

		return Response.ok().entity(new DataTableInfo(draw, recordsTotal, recordsFiltered, media)).build();
	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("{mediumCollectionId}/hasTagList")
	public Response getTagList(@PathParam("mediumCollectionId") Integer mediumCollectionId)
	{
		// System.out.println("EndpointMediumCollection: getTagList");
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		MediaCollection mediumCollection = entityManager.find(MediaCollection.class, mediumCollectionId);
		if ( mediumCollection == null ) return Response.status(Status.NOT_FOUND).build();
		entityManager.refresh(mediumCollection);
		return Response.ok().entity(mediumCollection.getTags()).build();
	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("type/selectList")
	public Response getTypeSelectList(@QueryParam("language") String languageCode) {
		// returns list of id and name combinations of all Languages
		System.out.println("EndpointMediumCollection: getTypeSelectList");

		if ( languageCode == null) languageCode = "default"; // as long as multi-language is not implemented yet, use the 'default' language entry

		// search
		Query query = TIMAATApp.emf.createEntityManager().createQuery(
			"SELECT mctt FROM MediaCollectionTypeTranslation mctt WHERE mctt.language.id = (SELECT l.id FROM Language l WHERE l.code ='"+languageCode+"') ORDER BY mctt.type ASC");
		List<SelectElement> typeSelectList = new ArrayList<>();
		List<MediaCollectionTypeTranslation> typeTranslationList = castList(MediaCollectionTypeTranslation.class, query.getResultList());
		for (MediaCollectionTypeTranslation typeTranslation : typeTranslationList) {
			typeSelectList.add(new SelectElement(typeTranslation.getId(),
																					typeTranslation.getType()));
			// System.out.println("type select list entry - id: "+ typeTranslation.getType().getId() + " type: " + typeTranslation.getType());
		}
		return Response.ok().entity(typeSelectList).build();
	}

	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Secured
	// @Path("/")
	public Response createMediaCollectionOld(String jsonData) {
		System.out.println("EndpointMediumCollection: createMediaCollection OLD : " + jsonData);
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

		// persist mediaCollection
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
		System.out.println("EndpointMediumCollection: createMediaCollection: " + jsonData);
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
		newCol.setMediaCollectionAnalysisLists(new ArrayList<MediaCollectionAnalysisList>());
		newCol.setMediaCollectionHasMediums(new ArrayList<MediaCollectionHasMedium>());
		newCol.setTags(null);
		Timestamp creationDate = new Timestamp(System.currentTimeMillis());
		newCol.setCreatedAt(creationDate);
		newCol.setLastEditedAt(creationDate);
		if ( containerRequestContext.getProperty("TIMAAT.userID") != null ) {
			newCol.setCreatedByUserAccount(entityManager.find(UserAccount.class, containerRequestContext.getProperty("TIMAAT.userID")));
			newCol.setLastEditedByUserAccount(entityManager.find(UserAccount.class, containerRequestContext.getProperty("TIMAAT.userID")));
		} else {
			// DEBUG do nothing - production system should abort with internal server error
			return Response.serverError().build();
		}

		// persist mediaCollection
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.persist(newCol);
		entityManager.flush();
		entityTransaction.commit();
		entityManager.refresh(newCol);

		// set initial permission for newly created analysis list
		UserAccount userAccount = entityManager.find(UserAccount.class, containerRequestContext.getProperty("TIMAAT.userID"));
		UserAccountHasMediaCollection uahmc = new UserAccountHasMediaCollection(userAccount, newCol);
		PermissionType permissionType = entityManager.find(PermissionType.class, 4); // List creator becomes list admin
		uahmc.setPermissionType(permissionType);
		entityTransaction.begin();
		userAccount.getUserAccountHasMediaCollections().add(uahmc);
		newCol.getUserAccountHasMediaCollections().add(uahmc);
		entityManager.merge(userAccount);
		entityManager.merge(newCol);
		entityManager.persist(userAccount);
		entityManager.persist(newCol);
		entityTransaction.commit();
		entityManager.refresh(userAccount);
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
	public Response updateMediaCollection(@PathParam("id") int id,
																				String jsonData,
																				@QueryParam("authToken") String authToken) {
		// System.out.println("EndpointMediumCollection: updateMediaCollection: " + jsonData);

		ObjectMapper mapper = new ObjectMapper();
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		MediaCollection updatedCollection = null;
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		MediaCollection collection = entityManager.find(MediaCollection.class, id);
		if ( collection == null ) return Response.status(Status.NOT_FOUND).build();

		// verify auth token
		int userId = 0;
		if (AuthenticationFilter.isTokenValid(authToken)) {
			userId = AuthenticationFilter.getTokenClaimUserId(authToken);
		} else {
			return Response.status(Status.UNAUTHORIZED).build();
		}
		// check for permission level
		if (EndpointUserAccount.getPermissionLevelForMediumCollection(userId, id) < 2 && userId != 1) {
			return Response.status(Status.FORBIDDEN).build();
		}

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
		collection.setGlobalPermission(updatedCollection.getGlobalPermission());
		List<Tag> oldTags = collection.getTags();
		collection.setTags(updatedCollection.getTags());
		if ( containerRequestContext.getProperty("TIMAAT.userID") != null ) {
			collection.setLastEditedByUserAccount((entityManager.find(UserAccount.class, containerRequestContext.getProperty("TIMAAT.userID"))));
		} else {
			// DEBUG do nothing - production system should abort with internal server error
			return Response.serverError().build();
		}
		collection.setLastEditedAt(new Timestamp(System.currentTimeMillis()));

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
	public Response deleteMediaCollection(@PathParam("id") int id,
																				@QueryParam("authToken") String authToken) {
		System.out.println("EndpointMediumCollection: deleteMediaCollection");

		// verify auth token
		int userId = 0;
		if (AuthenticationFilter.isTokenValid(authToken)) {
			userId = AuthenticationFilter.getTokenClaimUserId(authToken);
		} else {
			return Response.status(Status.UNAUTHORIZED).build();
		}
		// check for permission level
		if (EndpointUserAccount.getPermissionLevelForMediumCollection(userId, id) < 4 && userId != 1) {
			return Response.status(Status.FORBIDDEN).build();
		}

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
		System.out.println("EndpointMediumCollection: deleteMediumCollection - delete complete");
		return Response.ok().build();
	}

	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("Album/{id}")
	@Secured
	public Response createAlbum(@PathParam("id") int id, String jsonData) {
		System.out.println("EndpointMediumCollection: createAlbum jsonData: "+jsonData);

		ObjectMapper mapper = new ObjectMapper();
		MediaCollectionAlbum newAlbum = null;
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();

		// parse JSON data
		try {
			newAlbum = mapper.readValue(jsonData, MediaCollectionAlbum.class);
		} catch (IOException e) {
			System.out.println("EndpointMediumCollection: createAlbum: IOException e !");
			e.printStackTrace();
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( newAlbum == null ) {
			System.out.println("EndpointMediumCollection: createAlbum: newAlbum == null !");
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
		System.out.println("EndpointMediumCollection: album created with id "+newAlbum.getMediaCollectionId());
		return Response.ok().entity(newAlbum).build();
	}

	@PATCH
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("Album/{id}")
	@Secured
	public Response updateAlbum(@PathParam("id") int id, String jsonData) {
		System.out.println("EndpointMediumCollection: updateAlbum - jsonData: " + jsonData);

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
		// System.out.println("EndpointMediumCollection: updateAlbum - album.id:"+album.getMediaCollectionId());
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
		System.out.println("EndpointMediumCollection: updateAlbum - update complete");
		return Response.ok().entity(album).build();
	}

	@DELETE
	@Produces(MediaType.APPLICATION_JSON)
	@Path("Album/{id}")
	@Secured
	public Response deleteAlbum(@PathParam("id") int id) {
		System.out.println("EndpointMediumCollection: deleteAlbum with id: "+ id);
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
		System.out.println("EndpointMediumCollection: deleteAlbum - album deleted");
		return Response.ok().build();
	}

	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("Series/{id}")
	@Secured
	public Response createSeries(@PathParam("id") int id, String jsonData) {
		System.out.println("EndpointMediumCollection: createSeries jsonData: "+jsonData);

		ObjectMapper mapper = new ObjectMapper();
		MediaCollectionSeries newSeries = null;
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();

		// parse JSON data
		try {
			newSeries = mapper.readValue(jsonData, MediaCollectionSeries.class);
		} catch (IOException e) {
			System.out.println("EndpointMediumCollection: createSeries: IOException e !");
			e.printStackTrace();
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( newSeries == null ) {
			System.out.println("EndpointMediumCollection: createSeries: newSeries == null !");
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
		System.out.println("EndpointMediumCollection: series created with id "+newSeries.getMediaCollectionId());
		return Response.ok().entity(newSeries).build();
	}

	@PATCH
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("Series/{id}")
	@Secured
	public Response updateSeries(@PathParam("id") int id, String jsonData) {
		System.out.println("EndpointMediumCollection: updateSeries - jsonData: " + jsonData);

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
		// System.out.println("EndpointMediumCollection: updateSeries - series.id:"+series.getMediaCollectionId());
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
		System.out.println("EndpointMediumCollection: updateSeries - update complete");
		return Response.ok().entity(series).build();
	}

	@DELETE
	@Produces(MediaType.APPLICATION_JSON)
	@Path("Series/{id}")
	@Secured
	public Response deleteSeries(@PathParam("id") int id) {
		System.out.println("EndpointMediumCollection: deleteSeries with id: "+ id);
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
		System.out.println("EndpointMediumCollection: deleteSeries - series deleted");
		return Response.ok().build();
	}

	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Path("{id}/medium/{mediumId}")
	@Secured
	public Response addMediaCollectionItem(@PathParam("id") int id,
																				 @PathParam("mediumId") int mediumId,
																				 @QueryParam("authToken") String authToken) {
		System.out.println("TCL: EndpointMediumCollection -> addMediaCollectionItem");
    EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		MediaCollection mediaCollection = entityManager.find(MediaCollection.class, id);
		if ( mediaCollection == null ) return Response.status(Status.NOT_FOUND).build();
		Medium medium = entityManager.find(Medium.class, mediumId);
		if ( medium == null ) return Response.status(Status.NOT_FOUND).build();

		// verify auth token
		int userId = 0;
		if (AuthenticationFilter.isTokenValid(authToken)) {
			userId = AuthenticationFilter.getTokenClaimUserId(authToken);
		} else {
			return Response.status(Status.UNAUTHORIZED).build();
		}
		// check for permission level
		if (EndpointUserAccount.getPermissionLevelForMediumCollection(userId, mediaCollection.getId()) < 2 && userId != 1) {
			return Response.status(Status.FORBIDDEN).build();
		}

		MediaCollectionHasMedium mchm = null;
		try {
			mchm = (MediaCollectionHasMedium) entityManager.createQuery(
				"SELECT mchm FROM MediaCollectionHasMedium mchm WHERE mchm.mediaCollection=:collection AND mchm.medium=:medium")
					.setParameter("collection", mediaCollection)
					.setParameter("medium", medium)
					.getSingleResult();
		} catch (Exception e) {
			// doesn't matter
		}

		if ( mchm == null ) {
			mchm = new MediaCollectionHasMedium();
			mchm.setMediaCollection(mediaCollection);
			mchm.setMedium(medium);
			mchm.setSortOrder(mchm.getMediaCollection().getMediaCollectionHasMediums().size());
				try {
					EntityTransaction entityTransaction = entityManager.getTransaction();
					entityTransaction.begin();
					entityManager.persist(mchm);
					entityTransaction.commit();
					entityManager.refresh(mediaCollection);
					entityManager.refresh(mchm);
				} catch (Exception e) {
					e.printStackTrace();
					return Response.notModified().build();
				}
		}

		// add log entry
		UserLogManager.getLogger().addLogEntry((int) containerRequestContext.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.MEDIACOLLECTIONEDITED);

		return Response.ok().entity(mchm).build();
	}

	@PATCH
	@Produces(MediaType.APPLICATION_JSON)
	@Path("{id}/medium/{mediumId}/order/{sortOrder}")
	@Secured
	public Response updateMediaCollectionItem(@PathParam("id") int id,
																						@PathParam("mediumId") int mediumId,
																						@PathParam("sortOrder") int sortOrder,
																						@QueryParam("authToken") String authToken){
																						// String jsonData) {
		// System.out.println("TCL: EndpointMediumCollection -> updateMediaCollectionItem ");

		// verify auth token
		int userId = 0;
		if (AuthenticationFilter.isTokenValid(authToken)) {
			userId = AuthenticationFilter.getTokenClaimUserId(authToken);
		} else {
			return Response.status(Status.UNAUTHORIZED).build();
		}
		// check for permission level
		if (EndpointUserAccount.getPermissionLevelForMediumCollection(userId, id) < 2 && userId != 1) {
			return Response.status(Status.FORBIDDEN).build();
		}

		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		MediaCollection mediaCollection = entityManager.find(MediaCollection.class, id);
		if ( mediaCollection == null ) return Response.status(Status.NOT_FOUND).build();
		Medium medium = entityManager.find(Medium.class, mediumId);
		if ( medium == null ) return Response.status(Status.NOT_FOUND).build();
		MediaCollectionHasMedium mchmKey = new MediaCollectionHasMedium(mediaCollection, medium);
		MediaCollectionHasMedium mediaCollectionHasMediumToUpdate = entityManager.find(MediaCollectionHasMedium.class, mchmKey.getId());
		if (mediaCollectionHasMediumToUpdate == null) return Response.status(Status.NOT_FOUND).build();
    mediaCollectionHasMediumToUpdate.setSortOrder(sortOrder);

		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.merge(mediaCollectionHasMediumToUpdate);
		entityManager.persist(mediaCollectionHasMediumToUpdate);
		entityTransaction.commit();
		entityManager.refresh(mediaCollectionHasMediumToUpdate);

		// add log entry
		UserLogManager.getLogger().addLogEntry((int) containerRequestContext.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.MEDIACOLLECTIONEDITED);

		return Response.ok().entity(mediaCollectionHasMediumToUpdate).build();
	}

	@DELETE
	@Produces(MediaType.APPLICATION_JSON)
	@Path("{id}/medium/{mediumId}")
	@Secured
	public Response deleteMediaCollectionItem(@PathParam("id") int id,
																						@PathParam("mediumId") int mediumId,
																						@QueryParam("authToken") String authToken) {
		// System.out.println("TCL: EndpointMediumCollection -> deleteMediaCollectionItem");
		// verify auth token
		int userId = 0;
		if (AuthenticationFilter.isTokenValid(authToken)) {
			userId = AuthenticationFilter.getTokenClaimUserId(authToken);
		} else {
			return Response.status(Status.UNAUTHORIZED).build();
		}
		// check for permission level
		if (EndpointUserAccount.getPermissionLevelForMediumCollection(userId, id) < 2 && userId != 1) {
			return Response.status(Status.FORBIDDEN).build();
		}

		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		MediaCollection mediaCollection = entityManager.find(MediaCollection.class, id);
		if ( mediaCollection == null ) return Response.status(Status.NOT_FOUND).build();
		Medium medium = entityManager.find(Medium.class, mediumId);
		if ( medium == null ) return Response.status(Status.NOT_FOUND).build();

		MediaCollectionHasMedium mchmKey = new MediaCollectionHasMedium(mediaCollection, medium);
		MediaCollectionHasMedium mediaCollectionHasMediumToDelete = entityManager.find(MediaCollectionHasMedium.class, mchmKey.getId());
		if (mediaCollectionHasMediumToDelete == null) return Response.status(Status.NOT_FOUND).build();

		EntityTransaction entityTransaction = entityManager.getTransaction();
		try {
		entityTransaction.begin();
		mediaCollection.getMediaCollectionHasMediums().remove(mediaCollectionHasMediumToDelete);
		medium.getMediaCollectionHasMediums().remove(mediaCollectionHasMediumToDelete);
		entityManager.remove(mediaCollectionHasMediumToDelete);
		entityManager.merge(mediaCollection);
		entityManager.merge(medium);
		entityManager.persist(mediaCollection);
		entityManager.persist(medium);
		entityTransaction.commit();
		entityManager.refresh(mediaCollection);
		entityManager.refresh(medium);
		} catch (Error e) {
		}

		try { // update sortOrder
			List<MediaCollectionHasMedium> mediaCollectionHasMedia = mediaCollection.getMediaCollectionHasMediums();
			mediaCollectionHasMedia.sort(Comparator.comparing(MediaCollectionHasMedium::getSortOrder));
			int i = 0;
			for (MediaCollectionHasMedium mediaCollectionHasMedium : mediaCollectionHasMedia) {
				mediaCollectionHasMedium.setSortOrder(i);
				i++;
			}
			entityTransaction.begin();
			entityManager.merge(mediaCollection);
			entityManager.persist(mediaCollection);
			entityTransaction.commit();
			entityManager.refresh(mediaCollection);
		} catch (Error e) {
		}

		// add log entry
		UserLogManager.getLogger()
									.addLogEntry((int) containerRequestContext.getProperty("TIMAAT.userID"),
															 UserLogManager.LogEvents.MEDIACOLLECTIONDELETED);

		return Response.ok().build();
	}

	@GET
  @Produces(MediaType.APPLICATION_JSON)
	@Path("{id}/displayNames")
	@Secured
	public Response getDisplayNamesAndPermissions(@PathParam("id") Integer mediaCollectionId,
																							  @QueryParam("authToken") String authToken) {
		// System.out.println("EndpointMediumCollection: getDisplayNames - ID: "+ mediaCollectionId);

		// verify auth token
		int userId = 0;
		if (AuthenticationFilter.isTokenValid(authToken)) {
			userId = AuthenticationFilter.getTokenClaimUserId(authToken);
		} else {
			return Response.status(Status.UNAUTHORIZED).build();
		}
		// check for permission level
		if (EndpointUserAccount.getPermissionLevelForMediumCollection(userId, mediaCollectionId) < 3 && userId != 1) { // only mods and admins may see permission list
			return Response.status(Status.FORBIDDEN).build();
		}

    EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		MediaCollection mediaCollection = entityManager.find(MediaCollection.class, mediaCollectionId);
		List<UserAccountHasMediaCollection> userAccountHasMediaCollectionList = mediaCollection.getUserAccountHasMediaCollections();
		List<DisplayElementNameAndPermission> displayElementNameAndPermission = new ArrayList<>();
		for (UserAccountHasMediaCollection userAccountHasMediaCollection : userAccountHasMediaCollectionList) {
			displayElementNameAndPermission.add(new DisplayElementNameAndPermission(userAccountHasMediaCollection.getUserAccount().getId(), userAccountHasMediaCollection.getUserAccount().getDisplayName(), userAccountHasMediaCollection.getPermissionType().getId()));
		}
		Collections.sort(displayElementNameAndPermission, (Comparator<DisplayElementNameAndPermission>) (DisplayElementNameAndPermission d1, DisplayElementNameAndPermission d2) -> d1.getDisplayName().toLowerCase().compareTo(d2.getDisplayName().toLowerCase()) );
		return Response.ok().entity(displayElementNameAndPermission).build();
	}

	@POST
  @Produces(MediaType.APPLICATION_JSON)
	@Path("{mediumCollectionId}/userAccount/{userAccountId}/withPermission/{permissionId}")
	@Secured
	public Response addUserAccountHasMediumCollectionWithPermission(@PathParam("mediumCollectionId") int mediumCollectionId,
																																	@PathParam("userAccountId") int userAccountId,
																																	@PathParam("permissionId") int permissionTypeId,
																																	@QueryParam("authToken") String authToken) {
		// System.out.println("EndpointMediumCollection: addUserAccountHasMediumCollectionWithPermission");

		// verify auth token
		int userId = 0;
		if (AuthenticationFilter.isTokenValid(authToken)) {
			userId = AuthenticationFilter.getTokenClaimUserId(authToken);
		} else {
			return Response.status(Status.UNAUTHORIZED).build();
		}
		// check for permission level
		// only users with administrate permission level may add users with moderate or administrate permission
		int permissionLevel = EndpointUserAccount.getPermissionLevelForMediumCollection(userId, mediumCollectionId);
		// IF user is not sys admin AND (
		// user is without high enough permission level to set others to moderate or administrate
		// OR user is without high enough permission level to set any permission levels)
		if ((userId != 1) && (
				(permissionLevel != 4 && (permissionTypeId == 3 || permissionTypeId == 4)) ||
				(permissionLevel != 3 && permissionLevel != 4))) {
			return Response.status(Status.FORBIDDEN).build();
		} // else user has permission for requested change

		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		MediaCollection mediumCollection = entityManager.find(MediaCollection.class, mediumCollectionId);
		if (mediumCollection == null) return Response.status(Status.NOT_FOUND).build();
		UserAccount userAccount = entityManager.find(UserAccount.class, userAccountId);
		if (userAccount == null) return Response.status(Status.NOT_FOUND).build();
		PermissionType permissionType = entityManager.find(PermissionType.class, permissionTypeId);
		if (permissionType == null) return Response.status(Status.NOT_FOUND).build();

		UserAccountHasMediaCollection uahmc = null;
		try {
			Query countQuery = entityManager.createQuery("SELECT COUNT(uahmc) FROM UserAccountHasMediaCollection uahmc WHERE uahmc.mediaCollection=:mediumCollection AND uahmc.userAccount=:userAccount")
																			.setParameter("mediumCollection", mediumCollection)
																			.setParameter("userAccount", userAccount);
																			// .setParameter("permissionType", permissionType);
			long recordsTotal = (long) countQuery.getSingleResult();
			if (recordsTotal >= 1) {
				return Response.status(Status.FORBIDDEN).build();	// an entry already exists, do not create a new one
			// uahmc = (UserAccountHasMediaCollection) entityManager.createQuery(
			// 	"SELECT uahmc FROM UserAccountHasMediaCollection uahmc WHERE uahmc.mediumCollection=:mediaCollection AND uahmc.userAccount=:userAccount")
			// 		.setParameter("mediumCollection", mediumCollection)
			// 		.setParameter("userAccount", userAccount)
			// 		// .setParameter("permissionType", permissionType)
			// 		.getSingleResult();
			}
		} catch (Exception e) {
			e.printStackTrace();
			// doesn't matter
		}
		if ( uahmc == null ) {
			// System.out.println("EndpointMediumCollection: UserAccountHasMediumCollection - create new entry");
			uahmc = new UserAccountHasMediaCollection();
			uahmc.setMediaCollection(mediumCollection);
			uahmc.setUserAccount(userAccount);
			uahmc.setPermissionType(permissionType);
			try {
				EntityTransaction entityTransaction = entityManager.getTransaction();
				entityTransaction.begin();
				entityManager.persist(uahmc);
				entityTransaction.commit();
				entityManager.refresh(mediumCollection);
				entityManager.refresh(userAccount);
				entityManager.refresh(permissionType);
				entityManager.refresh(uahmc);
			} catch (Exception e) {
				e.printStackTrace();
				return Response.notModified().build();
			}
		}
		// System.out.println("EndpointMediumCollection: addMediumCollectionHasUserAccountWithPermissionTypes: entity transaction complete");

		// add log entry
		UserLogManager.getLogger().addLogEntry((int) containerRequestContext.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.ANALYSISLISTEDITED);

		return Response.ok().entity(uahmc).build();
	}

	@PATCH
  @Produces(MediaType.APPLICATION_JSON)
	@Path("{mediumCollectionId}/userAccount/{userAccountId}/withPermission/{permissionId}")
	@Secured
	public Response updateUserAccountHasMediumCollectionWithPermission(@PathParam("mediumCollectionId") int mediumCollectionId,
																																		 @PathParam("userAccountId") int userAccountId,
																																		 @PathParam("permissionId") int permissionTypeId,
																																		 @QueryParam("authToken") String authToken) {
		System.out.println("EndpointMediumCollection: updateUserAccountHasMediumCollectionWithPermission");

		// verify auth token
		int userId = 0;
		if (AuthenticationFilter.isTokenValid(authToken)) {
			userId = AuthenticationFilter.getTokenClaimUserId(authToken);
		} else {
			return Response.status(Status.UNAUTHORIZED).build();
		}
		// check for permission level
		// only users with administrate permission level may add users with moderate or administrate permission
		int permissionLevel = EndpointUserAccount.getPermissionLevelForMediumCollection(userId, mediumCollectionId);
		// IF user is not sys admin AND (
		// user is without high enough permission level to set others to moderate or administrate
		// OR user is without high enough permission level to set any permission levels)
		if ((userId != 1) && (
				(permissionLevel != 4 && (permissionTypeId == 3 || permissionTypeId == 4)) ||
				(permissionLevel != 3 && permissionLevel != 4))) {
			return Response.status(Status.FORBIDDEN).build();
		} // else user has permission for requested change

		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		MediaCollection mediumCollection = entityManager.find(MediaCollection.class, mediumCollectionId);
		if (mediumCollection == null) return Response.status(Status.NOT_FOUND).build();
		UserAccount userAccount = entityManager.find(UserAccount.class, userAccountId);
		if (userAccount == null) return Response.status(Status.NOT_FOUND).build();
		PermissionType permissionType = entityManager.find(PermissionType.class, permissionTypeId);
		if (permissionType == null) return Response.status(Status.NOT_FOUND).build();
		UserAccountHasMediaCollection uahmcKey = new UserAccountHasMediaCollection(userAccount, mediumCollection);
		UserAccountHasMediaCollection uahmc = entityManager.find(UserAccountHasMediaCollection.class, uahmcKey.getId());

    uahmc.setPermissionType(permissionType);

		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.merge(uahmc);
		entityManager.persist(uahmc);
		entityTransaction.commit();
		entityManager.refresh(uahmc);

		System.out.println("EndpointMediumCollection: updateMediumCollectionHasUserAccountWithPermissionTypes: entity transaction complete");

		// add log entry
		UserLogManager.getLogger()
									.addLogEntry((int) containerRequestContext.getProperty("TIMAAT.userID"),
															 UserLogManager.LogEvents.ANALYSISLISTEDITED);

		return Response.ok().entity(uahmc).build();
	}

	@DELETE
	@Produces(MediaType.APPLICATION_JSON)
	@Path("{mediumCollectionId}/userAccount/{userAccountId}")
	@Secured
	public Response deleteUserAccountHasMediumCollectionWithPermission(@PathParam("mediumCollectionId") int mediumCollectionId,
																																		 @PathParam("userAccountId") int userAccountId,
																																		 @QueryParam("authToken") String authToken) {
		// verify auth token
		int userId = 0;
		if (AuthenticationFilter.isTokenValid(authToken)) {
			userId = AuthenticationFilter.getTokenClaimUserId(authToken);
		} else {
			return Response.status(Status.UNAUTHORIZED).build();
		}

		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		UserAccountHasMediaCollection userToBeRemoved = null;
		try {
			userToBeRemoved = (UserAccountHasMediaCollection) entityManager.createQuery("SELECT uahmc FROM UserAccountHasMediaCollection uahmc WHERE uahmc.mediaCollection.id=:mediumCollectionId AND uahmc.userAccount.id=:userAccountId")
					.setParameter("mediumCollectionId", mediumCollectionId)
					.setParameter("userAccountId", userAccountId)
					.getSingleResult();
		} catch (NoResultException nre) {
			nre.printStackTrace();
			return Response.status(Status.NOT_FOUND).build();
		}
		// check for permission level
		// only users with administrate permission level may add users with moderate or administrate permission
		int permissionLevel = EndpointUserAccount.getPermissionLevelForMediumCollection(userId, mediumCollectionId);
		// IF user is not sys admin AND (
		// user is without high enough permission level to set others to moderate or administrate
		// OR user is without high enough permission level to set any permission levels)
		if ((userId != 1) &&
				((permissionLevel != 4 && (userToBeRemoved.getPermissionType().getId() == 3 || userToBeRemoved.getPermissionType().getId() == 4)) ||
				(permissionLevel != 3 && permissionLevel != 4))) {
			return Response.status(Status.FORBIDDEN).build();
		} // else user has permission for requested change

		MediaCollection mediumCollection = entityManager.find(MediaCollection.class, mediumCollectionId);
		if ( mediumCollection == null ) return Response.status(Status.NOT_FOUND).build();
		UserAccount userAccount = entityManager.find(UserAccount.class, userAccountId);
		if ( userAccount == null ) return Response.status(Status.NOT_FOUND).build();
		UserAccountHasMediaCollection uahmcKey = new UserAccountHasMediaCollection(userAccount, mediumCollection);
		UserAccountHasMediaCollection uahmc = entityManager.find(UserAccountHasMediaCollection.class, uahmcKey.getId());

		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
    entityManager.remove(uahmc);
		entityTransaction.commit();
		entityManager.refresh(mediumCollection);
		entityManager.refresh(userAccount);

		// add log entry
		UserLogManager.getLogger()
									.addLogEntry((int) containerRequestContext.getProperty("TIMAAT.userID"),
															 UserLogManager.LogEvents.ANALYSISLISTEDITED);

		return Response.ok().build();
	}

	@POST
  @Produces(MediaType.APPLICATION_JSON)
	@Path("{mediumCollectionId}/tag/{tagId}")
	@Secured
	public Response addExistingTag(@PathParam("mediumCollectionId") int mediumCollectionId,
																 @PathParam("tagId") int tagId,
																 @QueryParam("authToken") String authToken) {

		// verify auth token
		int userId = 0;
		if (AuthenticationFilter.isTokenValid(authToken)) {
			userId = AuthenticationFilter.getTokenClaimUserId(authToken);
		} else {
			return Response.status(Status.UNAUTHORIZED).build();
		}
		// check for permission level
		if (EndpointUserAccount.getPermissionLevelForMediumCollection(userId, mediumCollectionId) < 2 && userId != 1) {
			return Response.status(Status.FORBIDDEN).build();
		}

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
														@PathParam("tagId") int tagId,
														@QueryParam("authToken") String authToken) {

		// verify auth token
		int userId = 0;
		if (AuthenticationFilter.isTokenValid(authToken)) {
			userId = AuthenticationFilter.getTokenClaimUserId(authToken);
		} else {
			return Response.status(Status.UNAUTHORIZED).build();
		}
		// check for permission level
		if (EndpointUserAccount.getPermissionLevelForMediumCollection(userId, mediumCollectionId) < 2 && userId != 1) {
			return Response.status(Status.FORBIDDEN).build();
		}

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
