package de.bitgilde.TIMAAT.rest;

import java.awt.Graphics2D;
import java.awt.RenderingHints;
import java.awt.image.BufferedImage;
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
import java.util.Collection;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

import javax.imageio.ImageIO;
import javax.imageio.ImageReader;
import javax.imageio.stream.FileImageInputStream;
import javax.imageio.stream.ImageInputStream;
import javax.persistence.EntityManager;
import javax.persistence.EntityTransaction;
import javax.persistence.Query;
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
import javax.ws.rs.core.UriInfo;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.glassfish.jersey.media.multipart.FormDataContentDisposition;
import org.glassfish.jersey.media.multipart.FormDataParam;
import org.json.JSONObject;
import org.jvnet.hk2.annotations.Service;

import de.bitgilde.TIMAAT.PropertyConstants;
import de.bitgilde.TIMAAT.TIMAATApp;
import de.bitgilde.TIMAAT.model.DatatableInfo;
import de.bitgilde.TIMAAT.model.fileInformation.*;
import de.bitgilde.TIMAAT.model.FIPOP.Actor;
import de.bitgilde.TIMAAT.model.FIPOP.ActorHasRole;
import de.bitgilde.TIMAAT.model.FIPOP.Category;
import de.bitgilde.TIMAAT.model.FIPOP.Language;
import de.bitgilde.TIMAAT.model.FIPOP.MediaType;
import de.bitgilde.TIMAAT.model.FIPOP.Medium;
import de.bitgilde.TIMAAT.model.FIPOP.MediumAudio;
import de.bitgilde.TIMAAT.model.FIPOP.MediumDocument;
import de.bitgilde.TIMAAT.model.FIPOP.MediumHasActorWithRole;
import de.bitgilde.TIMAAT.model.FIPOP.MediumHasLanguage;
import de.bitgilde.TIMAAT.model.FIPOP.MediumImage;
import de.bitgilde.TIMAAT.model.FIPOP.MediumLanguageType;
import de.bitgilde.TIMAAT.model.FIPOP.MediumSoftware;
import de.bitgilde.TIMAAT.model.FIPOP.MediumText;
import de.bitgilde.TIMAAT.model.FIPOP.MediumVideo;
import de.bitgilde.TIMAAT.model.FIPOP.MediumVideogame;
import de.bitgilde.TIMAAT.model.FIPOP.Role;
import de.bitgilde.TIMAAT.model.FIPOP.Source;
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
public class MediumServiceEndpoint {

	@Context
	private UriInfo uriInfo;
	@Context
	ContainerRequestContext containerRequestContext;
	@Context
	ServletContext servletContext;
	
	@GET
	@Produces(javax.ws.rs.core.MediaType.APPLICATION_JSON)
	@Secured
	@Path("list")
	public Response getMediaList(	@QueryParam("draw") Integer draw,
																@QueryParam("start") Integer start,
																@QueryParam("length") Integer length,
																@QueryParam("orderby") String orderby,
																@QueryParam("dir") String direction,
																@QueryParam("search") String search ) {
		// System.out.println("MediumServiceEndpoint: getMediaList: draw: "+draw+" start: "+start+" length: "+length+" orderby: "+orderby+" dir: "+direction+" search: "+search);
		if ( draw == null ) draw = 0;

		// sanitize user input
		if ( direction != null && direction.equalsIgnoreCase("desc") ) direction = "DESC"; else direction = "ASC";
		String column = "m.id";
		if ( orderby != null) {
			if (orderby.equalsIgnoreCase("title")) column = "m.title1.name";
		}

		EntityManager entityManager = TIMAATApp.emf.createEntityManager();

		// calculate total # of records
		Query countQuery = entityManager.createQuery("SELECT COUNT(m) FROM Medium m");
		long recordsTotal = (long) countQuery.getSingleResult();
		long recordsFiltered = recordsTotal;

		// search
		Query query;
		String sql;
		List<Medium> mediumList = new ArrayList<>();
		if (search != null && search.length() > 0 ) {
			// find all matching titles
			sql = "SELECT t FROM Title t WHERE lower(t.name) LIKE lower(concat('%', :search, '%'))";
			query = entityManager.createQuery(sql)
													 .setParameter("search", search);
			// find all media belonging to those titles
			if ( start != null && start > 0 ) query.setFirstResult(start);
			if ( length != null && length > 0 ) query.setMaxResults(length);
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
			sql = "SELECT m FROM Medium m ORDER BY "+column+" "+direction;
			query = entityManager.createQuery(sql);
			if ( start != null && start > 0 ) query.setFirstResult(start);
			if ( length != null && length > 0 ) query.setMaxResults(length);
			mediumList = castList(Medium.class, query.getResultList());
		}


		// for (Medium m : mediumList) {
		// 	MediumVideo video = m.getMediumVideo();
		// 	if ( video != null ) {
		// 		video.setStatus(videoStatus(m.getId()));
		// 		video.setViewToken(issueFileToken(m.getId()));
		// 		m.setMediumVideo(video);
		// 		video.getStatus();
		// 		video.getViewToken();
		// 	}
		// 	// strip analysis lists for faster response --> get lists via AnalysislistEndpoint
		// 	m.getMediumAnalysisLists().clear();			
		// }

		for (Medium medium : mediumList) {
			String type = medium.getMediaType().getMediaTypeTranslations().get(0).getType();
			switch (type) {
				case "video":
					// strip analysis lists for faster response --> get lists via AnalysislistEndpoint
					medium.getMediumAnalysisLists().clear();
				break;
			}
		}

		return Response.ok().entity(new DatatableInfo(draw, recordsTotal, recordsFiltered, mediumList)).build();
	}

	@GET
	@Produces(javax.ws.rs.core.MediaType.APPLICATION_JSON)
	@Secured
	@Path("selectList")
	public Response getMediumSelectList(@QueryParam("start") Integer start,
																			@QueryParam("length") Integer length,
																			@QueryParam("orderby") String orderby,
																			@QueryParam("search") String search)	{
		// System.out.println("MediumServiceEndpoint: getMediumSelectList: start: "+start+" length: "+length+" orderby: "+orderby+" search: "+search);

		String column = "m.id";
		if ( orderby != null ) {
			if (orderby.equalsIgnoreCase("name")) column = "m.title1.name"; // TODO change displayTitle access in DB-Schema 
		}

		class SelectElement{ 
			public int id; 
			public String text;
			public SelectElement(int id, String text) {
				this.id = id; this.text = text;
			};
		}
		
		// TODO search all titles, not displayTitle only
		// define default query strings
		String mediumQuery = "SELECT m FROM Medium m ORDER BY m.title1.name";
		String mediumSearchQuery = "SELECT m FROM Medium m WHERE lower(m.title1.name) LIKE lower(concat('%', :name,'%')) ORDER BY m.title1.name";

		// search
		Query query;
		if ( search != null && search.length() > 0 ) {
			// perform search
			query = TIMAATApp.emf.createEntityManager().createQuery(
				mediumSearchQuery);
			query.setParameter("name", search);
			// query.setParameter("mediumName", search); // birthName
		} else {
			query = TIMAATApp.emf.createEntityManager().createQuery(
				mediumQuery);
		}
		// if ( start != null && start > 0 ) query.setFirstResult(start);
		// if ( length != null && length > 0 ) query.setMaxResults(length);

		List<Medium> mediumList = castList(Medium.class, query.getResultList());
		List<SelectElement> mediumSelectList = new ArrayList<>();
		for (Medium medium : mediumList) {
			mediumSelectList.add(new SelectElement(medium.getId(), medium.getDisplayTitle().getName()));
		}

		return Response.ok().entity(mediumSelectList).build();

	}

	@GET
	@Produces(javax.ws.rs.core.MediaType.APPLICATION_JSON)
	@Secured
	@Path("image/selectList")
	public Response getImageSelectList(
			@QueryParam("start") Integer start,
			@QueryParam("length") Integer length,
			@QueryParam("orderby") String orderby,
			@QueryParam("search") String search)
	{
		// System.out.println("MediumServiceEndpoint: getImageSelectList: start: "+start+" length: "+length+" orderby: "+orderby+" search: "+search);

		String column = "m.id";
		if ( orderby != null ) {
			if (orderby.equalsIgnoreCase("name")) column = "m.title1.name"; // TODO change displayTitle access in DB-Schema 
		}

		class SelectElement{
			public int id; 
			public String text;
			public String token;
			public SelectElement(int id, String text, String token) {
				this.id = id;
				this.text = text;
				this.token = token;
			};
		}
		
		// TODO search all titles, not displayTitle only
		// define default query strings
		String mediumQuery = "SELECT m FROM Medium m ORDER BY m.title1.name";
		String mediumSearchQuery = "SELECT m FROM Medium m WHERE lower(m.title1.name) LIKE lower(concat('%', :name,'%')) ORDER BY m.title1.name";

		// search
		Query query;
		if ( search != null && search.length() > 0 ) {
			// perform search
			query = TIMAATApp.emf.createEntityManager().createQuery(
				mediumSearchQuery);
			query.setParameter("name", search);
			// query.setParameter("mediumName", search); // birthName
		} else {
			query = TIMAATApp.emf.createEntityManager().createQuery(
				mediumQuery);
		}
		// if ( start != null && start > 0 ) query.setFirstResult(start);
		// if ( length != null && length > 0 ) query.setMaxResults(length);

		List<Medium> mediumList = castList(Medium.class, query.getResultList());
		List<SelectElement> mediumSelectList = new ArrayList<>();
		for (Medium medium : mediumList) {
			if (medium.getMediumImage() != null) {
				// System.out.println("id + viewToken: " + medium.getId() + " - " + medium.getViewToken());
				// if (medium.getViewToken() == null) {
				// 	medium.setViewToken(issueFileToken(medium.getId()));
				// }
				mediumSelectList.add(new SelectElement(medium.getId(), medium.getDisplayTitle().getName(), medium.getViewToken()));
			}
		}

		return Response.ok().entity(mediumSelectList).build();
	}

	@GET
	@Produces(javax.ws.rs.core.MediaType.APPLICATION_JSON)
	@Secured
	@Path("video/selectList")
	public Response getVideoSelectList(
			@QueryParam("start") Integer start,
			@QueryParam("length") Integer length,
			@QueryParam("orderby") String orderby,
			@QueryParam("search") String search)
	{
		// System.out.println("MediumServiceEndpoint: getVideoSelectList: start: "+start+" length: "+length+" orderby: "+orderby+" search: "+search);

		String column = "m.id";
		if ( orderby != null ) {
			if (orderby.equalsIgnoreCase("name")) column = "m.title1.name"; // TODO change displayTitle access in DB-Schema 
		}

		class SelectElement{ 
			public int id; 
			public String text;
			public SelectElement(int id, String text) {
				this.id = id; this.text = text;
			};
		}
		
		// TODO search all titles, not displayTitle only
		// define default query strings
		String mediumQuery = "SELECT m FROM Medium m ORDER BY m.title1.name";
		String mediumSearchQuery = "SELECT m FROM Medium m WHERE lower(m.title1.name) LIKE lower(concat('%', :name,'%')) ORDER BY m.title1.name";

		// search
		Query query;
		if ( search != null && search.length() > 0 ) {
			// perform search
			query = TIMAATApp.emf.createEntityManager().createQuery(
				mediumSearchQuery);
			query.setParameter("name", search);
			// query.setParameter("mediumName", search); // birthName
		} else {
			query = TIMAATApp.emf.createEntityManager().createQuery(
				mediumQuery);
		}
		// if ( start != null && start > 0 ) query.setFirstResult(start);
		// if ( length != null && length > 0 ) query.setMaxResults(length);

		List<Medium> mediumList = castList(Medium.class, query.getResultList());
		List<SelectElement> mediumSelectList = new ArrayList<>();
		for (Medium medium : mediumList) {
			if (medium.getMediumVideo() != null) {
				mediumSelectList.add(new SelectElement(medium.getId(), medium.getDisplayTitle().getName()));
			}
		}

		return Response.ok().entity(mediumSelectList).build();
	}

	@GET
	@Produces(javax.ws.rs.core.MediaType.APPLICATION_JSON)
	@Secured
	@Path("total")
	public Response getMediaDatasetsTotal() {
		// System.out.println("MediumServiceEndpoint: getMediaDatasetsTotal");
		Query query = TIMAATApp.emf.createEntityManager()
																.createQuery("SELECT COUNT (m.id) FROM Medium m");
		long count = (long)query.getSingleResult();														
		// int total = ((Integer)TIMAATApp.emf.createEntityManager()
		// 												 .createQuery("SELECT m.id, COUNT(m) FROM Medium m")
		// 												 .getSingleResult()).intValue();
		return Response.ok().entity(count).build();
	}

	@GET
	@Produces(javax.ws.rs.core.MediaType.APPLICATION_JSON)
	@Secured
	@Path("mediatype/list")
	public Response getMediatypeList() {
		// System.out.println("MediumServiceEndpoint: getMediaTypeList");		
		@SuppressWarnings("unchecked")
		List<MediaType> mediaTypeList = TIMAATApp.emf.createEntityManager().createNamedQuery("MediaType.findAll").getResultList();
		return Response.ok().entity(mediaTypeList).build();
	}

	@GET
	@Produces(javax.ws.rs.core.MediaType.APPLICATION_JSON)
	@Secured
	@Path("audio/list")
	public Response getAudioList(	@QueryParam("draw") Integer draw,
																@QueryParam("start") Integer start,
																@QueryParam("length") Integer length,
																@QueryParam("orderby") String orderby,
																@QueryParam("dir") String direction,
																@QueryParam("search") String search) {
		// System.out.println("MediumServiceEndpoint: getAudioList: draw: "+draw+" start: "+start+" length: "+length+" orderby: "+orderby+" dir: "+direction+" search: "+search);
		if ( draw == null ) draw = 0;
		
		// sanitize user input
		if ( direction != null && direction.equalsIgnoreCase("desc") ) direction = "DESC"; else direction = "ASC";

		String column = "ma.mediumId";
		if ( orderby != null ) {
			if (orderby.equalsIgnoreCase("title")) column = "ma.medium.title1.name";
		}

		// calculate total # of records
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Query countQuery = entityManager.createQuery("SELECT COUNT(ma.medium) FROM MediumAudio ma");
		long recordsTotal = (long) countQuery.getSingleResult();
		long recordsFiltered = recordsTotal;
		
		// search
		Query query;
		String sql;
		List<Medium> mediumList = new ArrayList<>();
		if ( search != null && search.length() > 0 ) {
			// find all matching titles
			sql = "SELECT t FROM Title t WHERE lower(t.name) LIKE lower(concat('%', :search, '%'))";
			query = entityManager.createQuery(sql)
													 .setParameter("search", search);
			// find all media belonging to those titles
			if ( start != null && start > 0 ) query.setFirstResult(start);
			if ( length != null && length > 0 ) query.setMaxResults(length);
			List<Title> titleList = castList(Title.class, query.getResultList());
			for (Title title : titleList) {
				for (Medium medium : title.getMediums3()) {
					if (!(mediumList.contains(medium)) && (medium.getMediumAudio() != null)) { // TODO medium.getMediaType().. may be more efficient
						mediumList.add(medium);
					}
				}
			}
			recordsFiltered = mediumList.size();
		} else {
			sql = "SELECT ma.medium FROM MediumAudio ma ORDER BY "+column+" "+direction;
			query = entityManager.createQuery(sql);
			if ( start != null && start > 0 ) query.setFirstResult(start);
			if ( length != null && length > 0 ) query.setMaxResults(length);
			mediumList = castList(Medium.class, query.getResultList());
		}

		return Response.ok().entity(new DatatableInfo(draw, recordsTotal, recordsFiltered, mediumList)).build();
	}

	@GET
	@Produces(javax.ws.rs.core.MediaType.APPLICATION_JSON)
	@Secured
	@Path("document/list")
	public Response getDocumentList(@QueryParam("draw") Integer draw,
																	@QueryParam("start") Integer start,
																	@QueryParam("length") Integer length,
																	@QueryParam("orderby") String orderby,
																	@QueryParam("dir") String direction,
																	@QueryParam("search") String search ) {
		// System.out.println("MediumServiceEndpoint: getDocumentList: draw: "+draw+" start: "+start+" length: "+length+" orderby: "+orderby+" dir: "+direction+" search: "+search);
		if ( draw == null ) draw = 0;

		// sanitize user input
		if ( direction != null && direction.equalsIgnoreCase("desc") ) direction = "DESC"; else direction = "ASC";

		String column = "md.mediumId";
		if ( orderby != null ) {
			if (orderby.equalsIgnoreCase("title")) column = "md.medium.title1.name";
		}

		// calculate total # of records
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Query countQuery = entityManager.createQuery("SELECT COUNT(md.medium) FROM MediumDocument md");
		long recordsTotal = (long) countQuery.getSingleResult();
		long recordsFiltered = recordsTotal;
		
		// search
		Query query;
		String sql;
		List<Medium> mediumList = new ArrayList<>();
		if ( search != null && search.length() > 0 ) {
			// find all matching titles
			sql = "SELECT t FROM Title t WHERE lower(t.name) LIKE lower(concat('%', :search, '%'))";
			query = entityManager.createQuery(sql)
													 .setParameter("search", search);
			// find all media belonging to those titles
			if ( start != null && start > 0 ) query.setFirstResult(start);
			if ( length != null && length > 0 ) query.setMaxResults(length);
			List<Title> titleList = castList(Title.class, query.getResultList());
			for (Title title : titleList) {
				for (Medium medium : title.getMediums3()) {
					if (!(mediumList.contains(medium)) && (medium.getMediumDocument() != null)) { // TODO medium.getMediaType().. may be more efficient
						mediumList.add(medium);
					}
				}
			}
			recordsFiltered = mediumList.size();
		} else {
			sql = "SELECT md.medium FROM MediumDocument md ORDER BY "+column+" "+direction;
			query = entityManager.createQuery(sql);
			if ( start != null && start > 0 ) query.setFirstResult(start);
			if ( length != null && length > 0 ) query.setMaxResults(length);
			mediumList = castList(Medium.class, query.getResultList());
		}

		return Response.ok().entity(new DatatableInfo(draw, recordsTotal, recordsFiltered, mediumList)).build();
	}

	@GET
	@Produces(javax.ws.rs.core.MediaType.APPLICATION_JSON)
	@Secured
	@Path("image/list")
	public Response getImageList(	@QueryParam("draw") Integer draw,
																@QueryParam("start") Integer start,
																@QueryParam("length") Integer length,
																@QueryParam("orderby") String orderby,
																@QueryParam("dir") String direction,
																@QueryParam("search") String search) {
		// System.out.println("MediumServiceEndpoint: getImageList: draw: "+draw+" start: "+start+" length: "+length+" orderby: "+orderby+" dir: "+direction+" search: "+search);
		if ( draw == null ) draw = 0;

		// sanitize user input
		if ( direction != null && direction.equalsIgnoreCase("desc") ) direction = "DESC"; else direction = "ASC";

		String column = "mi.mediumId";
		if ( orderby != null ) {
			if (orderby.equalsIgnoreCase("title")) column = "mi.medium.title1.name";
		}

		// calculate total # of records
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Query countQuery = entityManager.createQuery("SELECT COUNT(mi.medium) FROM MediumImage mi");
		long recordsTotal = (long) countQuery.getSingleResult();
		long recordsFiltered = recordsTotal;
		
		// search
		Query query;
		String sql;
		List<Medium> mediumList = new ArrayList<>();
		if ( search != null && search.length() > 0 ) {
			// find all matching titles
			sql = "SELECT t FROM Title t WHERE lower(t.name) LIKE lower(concat('%', :search, '%'))";
			query = entityManager.createQuery(sql)
													 .setParameter("search", search);
			// find all media belonging to those titles
			if ( start != null && start > 0 ) query.setFirstResult(start);
			if ( length != null && length > 0 ) query.setMaxResults(length);
			List<Title> titleList = castList(Title.class, query.getResultList());
			for (Title title : titleList) {
				for (Medium medium : title.getMediums3()) {
					if (!(mediumList.contains(medium)) && (medium.getMediumImage() != null)) { // TODO medium.getMediaType().. may be more efficient
						mediumList.add(medium);
					}
				}
			}
			recordsFiltered = mediumList.size();
		} else {
			sql = "SELECT mi.medium FROM MediumImage mi ORDER BY "+column+" "+direction;
			query = entityManager.createQuery(sql);
			if ( start != null && start > 0 ) query.setFirstResult(start);
			if ( length != null && length > 0 ) query.setMaxResults(length);
			mediumList = castList(Medium.class, query.getResultList());
		}

		return Response.ok().entity(new DatatableInfo(draw, recordsTotal, recordsFiltered, mediumList)).build();
	}

	@GET
	@Produces(javax.ws.rs.core.MediaType.APPLICATION_JSON)
	@Secured
	@Path("software/list")
	public Response getSoftwareList(@QueryParam("draw") Integer draw,
																	@QueryParam("start") Integer start,
																	@QueryParam("length") Integer length,
																	@QueryParam("orderby") String orderby,
																	@QueryParam("dir") String direction,
																	@QueryParam("search") String search) {
		// System.out.println("MediumServiceEndpoint: getSoftwareList: draw: "+draw+" start: "+start+" length: "+length+" orderby: "+orderby+" dir: "+direction+" search: "+search);
		if ( draw == null ) draw = 0;

		// sanitize user input
		if ( direction != null && direction.equalsIgnoreCase("desc") ) direction = "DESC"; else direction = "ASC";

		String column = "ms.mediumId";
		if ( orderby != null ) {
			if (orderby.equalsIgnoreCase("title")) column = "ms.medium.title1.name";
		}

		// calculate total # of records
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Query countQuery = entityManager.createQuery("SELECT COUNT(ms.medium) FROM MediumSoftware ms");
		long recordsTotal = (long) countQuery.getSingleResult();
		long recordsFiltered = recordsTotal;
		
		// search
		Query query;
		String sql;
		List<Medium> mediumList = new ArrayList<>();
		if ( search != null && search.length() > 0 ) {
			// find all matching titles
			sql = "SELECT t FROM Title t WHERE lower(t.name) LIKE lower(concat('%', :search, '%'))";
			query = entityManager.createQuery(sql)
													 .setParameter("search", search);
			// find all media belonging to those titles
			if ( start != null && start > 0 ) query.setFirstResult(start);
			if ( length != null && length > 0 ) query.setMaxResults(length);
			List<Title> titleList = castList(Title.class, query.getResultList());
			for (Title title : titleList) {
				for (Medium medium : title.getMediums3()) {
					if (!(mediumList.contains(medium)) && (medium.getMediumSoftware() != null)) { // TODO medium.getMediaType().. may be more efficient
						mediumList.add(medium);
					}
				}
			}
			recordsFiltered = mediumList.size();
		} else {
			sql = "SELECT ms.medium FROM MediumSoftware ms ORDER BY "+column+" "+direction;
			query = entityManager.createQuery(sql);
			if ( start != null && start > 0 ) query.setFirstResult(start);
			if ( length != null && length > 0 ) query.setMaxResults(length);
			mediumList = castList(Medium.class, query.getResultList());
		}	

		return Response.ok().entity(new DatatableInfo(draw, recordsTotal, recordsFiltered, mediumList)).build();
	}

	@GET
	@Produces(javax.ws.rs.core.MediaType.APPLICATION_JSON)
	@Secured
	@Path("text/list")
	public Response getTextList(@QueryParam("draw") Integer draw,
															@QueryParam("start") Integer start,
															@QueryParam("length") Integer length,
															@QueryParam("orderby") String orderby,
															@QueryParam("dir") String direction,
															@QueryParam("search") String search) {
		// System.out.println("MediumServiceEndpoint: getTextList: draw: "+draw+" start: "+start+" length: "+length+" orderby: "+orderby+" dir: "+direction+" search: "+search);
		if ( draw == null ) draw = 0;

		// sanitize user input
		if ( direction != null && direction.equalsIgnoreCase("desc") ) direction = "DESC"; else direction = "ASC";

		String column = "mt.mediumId";
		if ( orderby != null ) {
			if (orderby.equalsIgnoreCase("title")) column = "mt.medium.title1.name";
		}

		// calculate total # of records
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Query countQuery = entityManager.createQuery("SELECT COUNT(mt.medium) FROM MediumText mt");
		long recordsTotal = (long) countQuery.getSingleResult();
		long recordsFiltered = recordsTotal;
		
		// search
		Query query;
		String sql;
		List<Medium> mediumList = new ArrayList<>();
		if ( search != null && search.length() > 0 ) {
			// find all matching titles
			sql = "SELECT t FROM Title t WHERE lower(t.name) LIKE lower(concat('%', :search, '%'))";
			query = entityManager.createQuery(sql)
													 .setParameter("search", search);
			// find all media belonging to those titles
			if ( start != null && start > 0 ) query.setFirstResult(start);
			if ( length != null && length > 0 ) query.setMaxResults(length);
			List<Title> titleList = castList(Title.class, query.getResultList());
			for (Title title : titleList) {
				for (Medium medium : title.getMediums3()) {
					if (!(mediumList.contains(medium)) && (medium.getMediumText() != null)) { // TODO medium.getMediaType().. may be more efficient
						mediumList.add(medium);
					}
				}
			}
			recordsFiltered = mediumList.size();
		} else {
			sql = "SELECT mt.medium FROM MediumText mt ORDER BY "+column+" "+direction;
			query = entityManager.createQuery(sql);
			if ( start != null && start > 0 ) query.setFirstResult(start);
			if ( length != null && length > 0 ) query.setMaxResults(length);
			mediumList = castList(Medium.class, query.getResultList());
		}

		return Response.ok().entity(new DatatableInfo(draw, recordsTotal, recordsFiltered, mediumList)).build();
	}

	@GET
	@Produces(javax.ws.rs.core.MediaType.APPLICATION_JSON)
	@Secured
	@Path("video/list")
	public Response getVideoList(	@QueryParam("draw") Integer draw,
																@QueryParam("start") Integer start,
																@QueryParam("length") Integer length,
																@QueryParam("orderby") String orderby,
																@QueryParam("dir") String direction,
																@QueryParam("search") String search	) {

		// System.out.println("MediumServiceEndpoint: getVideoList: draw: "+draw+" start: "+start+" length: "+length+" orderby: "+orderby+" dir: "+direction+" search: "+search);
		if ( draw == null ) draw = 0;

		// sanitize user input
		if ( direction != null && direction.equalsIgnoreCase("desc") ) direction = "DESC"; else direction = "ASC";

		String column = "mv.mediumId";
		if ( orderby != null ) {
			if (orderby.equalsIgnoreCase("title")) column = "mv.medium.title1.name";
			if (orderby.equalsIgnoreCase("duration")) column = "mv.length";
			if (orderby.equalsIgnoreCase("releaseDate")) column = "mv.medium.releaseDate";
			// TODO producer, seems way to complex to put in DB query // should be ordered in front end instead
			// - dependencies  --> actor --> actornames --> actorname.isdisplayname
			// + --> role == 5 --> producer
		}

		// calculate total # of records
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Query countQuery = entityManager.createQuery("SELECT COUNT(mv.medium) FROM MediumVideo mv");
		long recordsTotal = (long) countQuery.getSingleResult();
		long recordsFiltered = recordsTotal;
		
		// search
		Query query;
		String sql;
		List<Medium> mediumList = new ArrayList<>();
		if ( search != null && search.length() > 0 ) {
			// find all matching titles
			sql = "SELECT t FROM Title t WHERE lower(t.name) LIKE lower(concat('%', :search, '%'))";
			query = entityManager.createQuery(sql)
													 .setParameter("search", search);
			if ( start != null && start > 0 ) query.setFirstResult(start);
			if ( length != null && length > 0 ) query.setMaxResults(length);
			// find all media belonging to those titles
			List<Title> titleList = castList(Title.class, query.getResultList());
			for (Title title : titleList) {
				for (Medium medium : title.getMediums3()) {
					if (!(mediumList.contains(medium)) && (medium.getMediumVideo() != null)) { // TODO medium.getMediaType().. may be more efficient
						mediumList.add(medium);
					}
				}
			}
			recordsFiltered = mediumList.size();
		} else {
			sql = "SELECT mv.medium FROM MediumVideo mv ORDER BY "+column+" "+direction;
			query = entityManager.createQuery(sql);
			if ( start != null && start > 0 ) query.setFirstResult(start);
			if ( length != null && length > 0 ) query.setMaxResults(length);
			mediumList = castList(Medium.class, query.getResultList());
		}

				
		for (Medium medium : mediumList ) {
			// if ( medium.getMediumVideo() != null ) {
				// medium.setFileStatus(mediumFileStatus(medium.getId(), "video"));
				// medium.setViewToken(issueFileToken(medium.getId()));

				// medium.getMediumVideo().setStatus(videoStatus(medium.getId()));
				// medium.getMediumVideo().setViewToken(issueFileToken(medium.getId()));
				// strip analysis lists for faster response --> get lists via AnalysislistEndpoint
				medium.getMediumAnalysisLists().clear();
			// }
		}

		return Response.ok().entity(new DatatableInfo(draw, recordsTotal, recordsFiltered, mediumList)).build();
	}

	@GET
	@Produces(javax.ws.rs.core.MediaType.APPLICATION_JSON)
	@Secured
	@Path("videogame/list")
	public Response getVideogameList(	@QueryParam("draw") Integer draw,
																		@QueryParam("start") Integer start,
																		@QueryParam("length") Integer length,
																		@QueryParam("orderby") String orderby,
																		@QueryParam("dir") String direction,
																		@QueryParam("search") String search )	{
		// System.out.println("MediumServiceEndpoint: getVideoList: draw: "+draw+" start: "+start+" length: "+length+" orderby: "+orderby+" dir: "+direction+" search: "+search);

		if (draw == null) draw = 0;

		// sanitize user input
		if ( direction != null && direction.equalsIgnoreCase("desc") ) direction = "DESC"; else direction = "ASC";

		String column = "mv.mediumId";
		if ( orderby != null ) {
			if (orderby.equalsIgnoreCase("title")) column = "mv.medium.title1.name";
		}

		// calculate total # of records
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Query countQuery = TIMAATApp.emf.createEntityManager().createQuery("SELECT COUNT(mv.medium) FROM MediumVideogame mv");
		long recordsTotal = (long) countQuery.getSingleResult();
		long recordsFiltered = recordsTotal;
		
		// search
		Query query;
		String sql;
		List<Medium> mediumList = new ArrayList<>();
		if ( search != null && search.length() > 0 ) {
			// find all matching titles
			sql = "SELECT t FROM Title t WHERE lower(t.name) LIKE lower(concat('%', :search, '%'))";
			query = entityManager.createQuery(sql)
													 .setParameter("search", search);
			// find all media belonging to those titles
			if ( start != null && start > 0 ) query.setFirstResult(start);
			if ( length != null && length > 0 ) query.setMaxResults(length);
			List<Title> titleList = castList(Title.class, query.getResultList());
			for (Title title : titleList) {
				for (Medium medium : title.getMediums3()) {
					if (!(mediumList.contains(medium)) && (medium.getMediumVideogame() != null)) { // TODO medium.getMediaType().. may be more efficient
						mediumList.add(medium);
					}
				}
			}
			recordsFiltered = mediumList.size();
		} else {
			sql = "SELECT mv.medium FROM MediumVideogame mv ORDER BY "+column+" "+direction;
			query = entityManager.createQuery(sql);
			if ( start != null && start > 0 ) query.setFirstResult(start);
			if ( length != null && length > 0 ) query.setMaxResults(length);
			mediumList = castList(Medium.class, query.getResultList());
		}

		return Response.ok().entity(new DatatableInfo(draw, recordsTotal, recordsFiltered, mediumList)).build();
	}
	
	@GET
	@Produces(javax.ws.rs.core.MediaType.APPLICATION_JSON)
	@Secured
	@Path("hasActor/{actor_id}/withRoles/selectList")
	public Response getRoleSelectList(@PathParam("actor_id") int actorId,
																		@QueryParam("search") String search,
																		@QueryParam("page") Integer page,
																		@QueryParam("per_page") Integer per_page,
																		@QueryParam("language") String languageCode) {
		// returns list of id and name combinations of all roles of this actor
		// System.out.println("MediumServiceEndpoint: getRoleSelectList for actor id: "+ actorId);
		// System.out.println("MediumServiceEndpoint: getRoleSelectList - search string: "+ search);

		if ( languageCode == null) languageCode = "default"; // as long as multilanguage is not implemented yet, use the 'default' language entry
		
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Actor actor = entityManager.find(Actor.class, actorId);
		if ( actor == null ) return Response.status(Status.NOT_FOUND).build();

		class SelectElement{ 
			public int id; 
			public String text;
			public SelectElement(int id, String text) {
				this.id = id; this.text = text;
			};
		}

		List<Role> roleList = actor.getRoles();
		List<SelectElement> roleSelectList = new ArrayList<>();
		for (Role role: roleList) {
			if (search != null && search.length() > 0) {
				if (role.getRoleTranslations().get(0).getName().toLowerCase().contains(search.toLowerCase())) {
					roleSelectList.add(new SelectElement(role.getId(),
																							 role.getRoleTranslations().get(0).getName()));
				}
			} else {
				roleSelectList.add(new SelectElement(role.getId(),
																						 role.getRoleTranslations().get(0).getName()));
			}
		}
		return Response.ok().entity(roleSelectList).build();
	}

	@GET
	@Produces(javax.ws.rs.core.MediaType.APPLICATION_JSON)
	@Secured
	@Path("{mediumId}/hasActorList")
	public Response getActorList(@PathParam("mediumId") Integer mediumId)
	{
		// System.out.println("MediumServiceEndpoint: getActorList");
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Medium medium = entityManager.find(Medium.class, mediumId);
		List<ActorHasRole> actorHasRoleList = medium.getActorHasRoles();
		List<Actor> actorList = new ArrayList<>();
		for (ActorHasRole actorHasRole : actorHasRoleList) {
			if (!actorList.contains(entityManager.find(Actor.class, actorHasRole.getId().getActorId()))) {
				actorList.add(entityManager.find(Actor.class, actorHasRole.getId().getActorId()));
			}
		}
		return Response.ok().entity(actorList).build();
	}

	@GET
	@Produces(javax.ws.rs.core.MediaType.APPLICATION_JSON)
	@Secured
	@Path("{mediumId}/hasActor/{actorId}/withRoleList")
	public Response getActorHasRoleList(@PathParam("mediumId") Integer mediumId,
																			@PathParam("actorId") Integer actorId)
	{
		// System.out.println("MediumServiceEndpoint: getActorHasRoleList");
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();

		Medium medium = entityManager.find(Medium.class, mediumId);
		List<ActorHasRole> actorHasRoleList = medium.getActorHasRoles();
		List<Role> roleList = new ArrayList<>();
		for (ActorHasRole actorHasRole : actorHasRoleList) {
			if (actorHasRole.getId().getActorId() == actorId) {
				System.out.println("MediumServiceEndpoint: getActorHasRoleList - role found");
				roleList.add(entityManager.find(Role.class, actorHasRole.getId().getRoleId()));
			}
		}

		return Response.ok().entity(roleList).build();
	}
	
	@GET
	@Produces(javax.ws.rs.core.MediaType.APPLICATION_JSON)
	@Secured
	@Path("{id}/titles/list")
	public Response getTitlesList(@PathParam("id") int id) {
		// // System.out.println("MediumServiceEndpoint: getTitlesList");
		// Medium medium = TIMAATApp.emf.createEntityManager().find(Medium.class, id);   
    // 	if ( medium == null ) return Response.status(Status.NOT_FOUND).build();
		// // List<Title> titleList = TIMAATApp.emf.createEntityManager().createNamedQuery("titleList.findAll").getResultList();
		// // return Response.ok().entity(titleList).build();

		EntityManager entityManager = TIMAATApp.emf.createEntityManager();

		// find medium
		Medium medium = entityManager.find(Medium.class, id);
		if ( medium == null ) return Response.status(Status.NOT_FOUND).build();
		
		entityManager.refresh(medium);
		
		return Response.ok(medium.getTitles()).build();
	}

	@POST
	@Produces(javax.ws.rs.core.MediaType.APPLICATION_JSON)
	@Consumes(javax.ws.rs.core.MediaType.APPLICATION_JSON)
	@Path("{id}")
	@Secured
	public Response createMedium(@PathParam("id") int id, String jsonData) {
		System.out.println("MediumServiceEndpoint: createMedium: " + jsonData);
		ObjectMapper mapper = new ObjectMapper();
		Medium newMedium = null;  
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();

		// parse JSON data
		try {
			newMedium = mapper.readValue(jsonData, Medium.class);
		} catch (IOException e) {
			System.out.println("MediumServiceEndpoint: createMedium - IOException");
			e.printStackTrace();
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( newMedium == null ) {
			System.out.println("MediumServiceEndpoint: createMedium - newMedium == null");
			return Response.status(Status.BAD_REQUEST).build();
		}
		// sanitize object data
		newMedium.setId(0);
		Title displayTitle = entityManager.find(Title.class, newMedium.getDisplayTitle().getId());
		newMedium.setDisplayTitle(displayTitle);
		Source source = new Source();

		// update log metadata
		Timestamp creationDate = new Timestamp(System.currentTimeMillis());
		newMedium.setCreatedAt(creationDate);
		newMedium.setLastEditedAt(creationDate);
		if ( containerRequestContext.getProperty("TIMAAT.userID") != null ) {
			// System.out.println("containerRequestContext.getProperty('TIMAAT.userID') " + containerRequestContext.getProperty("TIMAAT.userID"));
			newMedium.setCreatedByUserAccount(entityManager.find(UserAccount.class, containerRequestContext.getProperty("TIMAAT.userID")));
			newMedium.setLastEditedByUserAccount((entityManager.find(UserAccount.class, containerRequestContext.getProperty("TIMAAT.userID"))));
		} else {
			// DEBUG do nothing - production system should abort with internal server error
			return Response.serverError().build();
		}

		System.out.println("MediumServiceEndpoint: createMedium - persist medium");
		// persist Medium
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.persist(displayTitle);
		entityManager.persist(newMedium);
		entityManager.flush();
		newMedium.setDisplayTitle(displayTitle);
		entityTransaction.commit();
		entityManager.refresh(newMedium);
		entityManager.refresh(displayTitle);

		// create medium_has_title-table entry
		entityTransaction.begin();
		newMedium.getTitles().add(displayTitle);
		displayTitle.getMediums3().add(newMedium);
		entityManager.merge(displayTitle);
		entityManager.merge(newMedium);
		entityManager.persist(displayTitle);
		entityManager.persist(newMedium);
		entityTransaction.commit();
		entityManager.refresh(newMedium);
		entityManager.refresh(displayTitle);

		// create source entry of medium
		entityTransaction.begin();
		newMedium.getSources().add(source);
		source.setMedium(newMedium);
		entityManager.persist(source);
		entityManager.persist(newMedium);
		entityTransaction.commit();
		entityManager.refresh(newMedium);
		entityManager.refresh(source);

		// add log entry
		UserLogManager.getLogger()
									.addLogEntry((int) containerRequestContext
									.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.MEDIUMCREATED);
		System.out.println("MediumServiceEndpoint: createMedium - done");
		return Response.ok().entity(newMedium).build();
	}

	@GET
	@Produces(javax.ws.rs.core.MediaType.APPLICATION_JSON)
	@Secured
	@Path("{id}")
	public Response getMedium(@PathParam("id") int id) {    	
		Medium medium = TIMAATApp.emf.createEntityManager().find(Medium.class, id);
		if ( medium == null ) return Response.status(Status.NOT_FOUND).build();    	    	
		return Response.ok().entity(medium).build();
	}

	@GET
	@Produces(javax.ws.rs.core.MediaType.TEXT_PLAIN)
	@Secured
	@Path("{id}/viewToken")
	public Response getViewToken(@PathParam("id") int id) {    	
		Medium medium = TIMAATApp.emf.createEntityManager().find(Medium.class, id);
		if ( medium == null ) return Response.status(Status.NOT_FOUND).build();
		String viewToken = medium.getViewToken();
		// System.out.println("ViewToken: " + viewToken);
		return Response.ok().entity(viewToken).build();
	}

	@PATCH
	@Produces(javax.ws.rs.core.MediaType.APPLICATION_JSON)
	@Consumes(javax.ws.rs.core.MediaType.APPLICATION_JSON)
	@Path("{id}")
	@Secured
	public Response updateMedium(@PathParam("id") int id, String jsonData) {
		System.out.println("MediumServiceEndpoint: UPDATE MEDIUM - jsonData"+ jsonData);
		ObjectMapper mapper = new ObjectMapper();
		Medium updatedMedium = null;    	
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Medium medium = entityManager.find(Medium.class, id);

		if ( medium == null ) return Response.status(Status.NOT_FOUND).build();		
		// parse JSON data
		try {
			updatedMedium = mapper.readValue(jsonData, Medium.class);
		} catch (IOException e) {
			System.out.println("MediumServiceEndpoint: UPDATE MEDIUM - IOException");
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( updatedMedium == null ) return Response.notModified().build();	

		// update medium
		// if ( updatedMedium.getMediaType() != null ) medium.setMediaType(updatedMedium.getMediaType()); // Don't change media type. MediumSubType won't match anymore
		if ( updatedMedium.getReleaseDate() != null ) medium.setReleaseDate(updatedMedium.getReleaseDate());
		if ( updatedMedium.getRemark() != null ) medium.setRemark(updatedMedium.getRemark());
		if ( updatedMedium.getCopyright() != null ) medium.setCopyright(updatedMedium.getCopyright());
		if ( updatedMedium.getDisplayTitle() != null ) medium.setDisplayTitle(updatedMedium.getDisplayTitle());
		medium.setOriginalTitle(updatedMedium.getOriginalTitle()); // originalTitle can be set to null

		// update log metadata
		medium.setLastEditedAt(new Timestamp(System.currentTimeMillis()));
		if ( containerRequestContext.getProperty("TIMAAT.userID") != null ) {
			medium.setLastEditedByUserAccount((entityManager.find(UserAccount.class, containerRequestContext.getProperty("TIMAAT.userID"))));
		} else {
			// DEBUG do nothing - production system should abort with internal server error			
		}		

		// persist medium
		EntityTransaction entityTransaction = entityManager.getTransaction();
		System.out.println(medium.getCreatedAt());
		System.out.println(medium.getLastEditedAt());
		entityTransaction.begin();
		entityManager.merge(medium);
		entityManager.persist(medium);
		entityTransaction.commit();
		entityManager.refresh(medium);
		System.out.println("after");
		System.out.println(medium.getCreatedAt());
		System.out.println(medium.getLastEditedAt());
		
		// if ( medium.getMediumVideo() != null ) {
			// medium.getFileStatus(medium.getMediaType().getMediaTypeTranslations().get(0).getType());
			// TODO necessary?
			medium.getFileStatus();
			medium.getViewToken();
		// }

		// add log entry
		UserLogManager.getLogger()
									.addLogEntry((int) containerRequestContext
									.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.MEDIUMEDITED);
		System.out.println("MediumServiceEndpoint: UPDATE MEDIUM - update complete");
		return Response.ok().entity(medium).build();
	}

	@DELETE
	@Produces(javax.ws.rs.core.MediaType.APPLICATION_JSON)
	@Path("{id}")
	@Secured
	public Response deleteMedium(@PathParam("id") int id) {
		System.out.println("MediumServiceEndpoint: deleteMedium");
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Medium medium = entityManager.find(Medium.class, id);

		if ( medium == null ) return Response.status(Status.NOT_FOUND).build();

		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		// for (Title title:medium.getTitles()) {
		// 	medium.getTitles().remove(title);
		// }
		entityManager.remove(medium.getDisplayTitle());
		entityManager.remove(medium);
		entityTransaction.commit();

		// add log entry
		UserLogManager.getLogger()
									.addLogEntry((int) containerRequestContext
									.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.MEDIUMDELETED);
		System.out.println("MediumServiceEndpoint: deleteMedium - delete complete");	
		return Response.ok().build();
	}

	@POST
	@Produces(javax.ws.rs.core.MediaType.APPLICATION_JSON)
	@Consumes(javax.ws.rs.core.MediaType.APPLICATION_JSON)
	@Path("audio/{id}")
	@Secured
	public Response createAudio(@PathParam("id") int id, String jsonData) {

		System.out.println("MediumServiceEndpoint: createAudio jsonData: "+jsonData);
		ObjectMapper mapper = new ObjectMapper();
		MediumAudio newAudio = null;
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();

		// parse JSON data
		try {
			newAudio = mapper.readValue(jsonData, MediumAudio.class);
		} catch (IOException e) {
			System.out.println("MediumServiceEndpoint: createAudio: IOException e !");
			e.printStackTrace();
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( newAudio == null ) {
			System.out.println("MediumServiceEndpoint: createAudio: newAudio == null !");
			return Response.status(Status.BAD_REQUEST).build();
		}
		// sanitize object data

		// update log metadata
		// Not necessary, a audio will always be created in conjunction with a medium

		// persist audio
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.persist(newAudio);
		entityManager.flush();
		entityTransaction.commit();
		entityManager.refresh(newAudio);
		entityManager.refresh(newAudio.getMedium());

		// add log entry
		UserLogManager.getLogger().addLogEntry(newAudio.getMedium().getCreatedByUserAccount().getId(), UserLogManager.LogEvents.AUDIOCREATED);
		System.out.println("MediumServiceEndpoint: audio created with id "+newAudio.getMediumId());
		return Response.ok().entity(newAudio).build();
	}

	@PATCH
	@Produces(javax.ws.rs.core.MediaType.APPLICATION_JSON)
	@Consumes(javax.ws.rs.core.MediaType.APPLICATION_JSON)
	@Path("audio/{id}")
	@Secured
	public Response updateAudio(@PathParam("id") int id, String jsonData) {

		System.out.println("MediumServiceEndpoint: UPDATE AUDIO - jsonData: " + jsonData);
		ObjectMapper mapper = new ObjectMapper();
		MediumAudio updatedAudio = null;    	
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		MediumAudio audio = entityManager.find(MediumAudio.class, id);
		
		if ( audio == null ) return Response.status(Status.NOT_FOUND).build();		
		// parse JSON data
		try {
			updatedAudio = mapper.readValue(jsonData, MediumAudio.class);
		} catch (IOException e) {
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( updatedAudio == null ) return Response.notModified().build();    	
		
		// update audio
		// System.out.println("MediumServiceEndpoint: UPDATE AUDIO - audio.id:"+audio.getMediumId());
		if ( updatedAudio.getLength() > 0) audio.setLength(updatedAudio.getLength());
		if ( updatedAudio.getAudioCodecInformation() != null ) audio.setAudioCodecInformation(updatedAudio.getAudioCodecInformation());
		
		// update log metadata
		audio.getMedium().setLastEditedAt(new Timestamp(System.currentTimeMillis()));
		if ( containerRequestContext.getProperty("TIMAAT.userID") != null ) {
			audio.getMedium().setLastEditedByUserAccount((entityManager.find(UserAccount.class, containerRequestContext.getProperty("TIMAAT.userID"))));
		} else {
			// DEBUG do nothing - production system should abort with internal server error			
		}		
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.merge(audio);
		entityManager.persist(audio);
		entityTransaction.commit();
		entityManager.refresh(audio);

		// add log entry
		UserLogManager.getLogger().addLogEntry((int) containerRequestContext.getProperty("TIMAAT.userID"), 
																						UserLogManager.LogEvents.AUDIOEDITED);
		System.out.println("MediumServiceEndpoint: UPDATE AUDIO - update complete");	
		return Response.ok().entity(audio).build();
	}

	@DELETE
	@Produces(javax.ws.rs.core.MediaType.APPLICATION_JSON)
	@Path("audio/{id}")
	@Secured
	public Response deleteAudio(@PathParam("id") int id) {  
		System.out.println("MediumServiceEndpoint: deleteAudio with id: "+ id);
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Medium medium = entityManager.find(Medium.class, id);
		if ( medium == null ) return Response.status(Status.NOT_FOUND).build();
		MediumAudio audio = entityManager.find(MediumAudio.class, id);
		if ( audio == null ) return Response.status(Status.NOT_FOUND).build();		
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.remove(audio);
		entityManager.remove(audio.getMedium().getDisplayTitle());
		entityManager.remove(audio.getMedium()); // remove audio, then corresponding medium
		entityTransaction.commit();
		// add log entry
		UserLogManager.getLogger()
									.addLogEntry((int) containerRequestContext.getProperty("TIMAAT.userID"), 
																UserLogManager.LogEvents.AUDIODELETED);
		System.out.println("MediumServiceEndpoint: deleteAudio - audio deleted");  
		return Response.ok().build();
	}

	@POST
	@Produces(javax.ws.rs.core.MediaType.APPLICATION_JSON)
	@Consumes(javax.ws.rs.core.MediaType.APPLICATION_JSON)
	@Path("document/{id}")
	@Secured
	public Response createDocument(@PathParam("id") int id, String jsonData) {
		System.out.println("MediumServiceEndpoint: createDocument jsonData: "+jsonData);
		ObjectMapper mapper = new ObjectMapper();
		MediumDocument newDocument = null;
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		// parse JSON data
		try {
			newDocument = mapper.readValue(jsonData, MediumDocument.class);
		} catch (IOException e) {
			System.out.println("MediumServiceEndpoint: createDocument: IOException e !");
			e.printStackTrace();
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( newDocument == null ) {
			System.out.println("MediumServiceEndpoint: createDocument: newDocument == null !");
			return Response.status(Status.BAD_REQUEST).build();
		}
		// sanitize object data
		// update log metadata
		// Not necessary, a document will always be created in conjunction with a medium
		// persist document
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.persist(newDocument);
		entityManager.flush();
		entityTransaction.commit();
		entityManager.refresh(newDocument);
		entityManager.refresh(newDocument.getMedium());

		// add log entry
		UserLogManager.getLogger().addLogEntry(newDocument.getMedium().getCreatedByUserAccount().getId(), UserLogManager.LogEvents.DOCUMENTCREATED);
		System.out.println("MediumServiceEndpoint: document created with id "+newDocument.getMediumId());
		return Response.ok().entity(newDocument).build();
	}

	@PATCH
	@Produces(javax.ws.rs.core.MediaType.APPLICATION_JSON)
	@Consumes(javax.ws.rs.core.MediaType.APPLICATION_JSON)
	@Path("document/{id}")
	@Secured
	public Response updateDocument(@PathParam("id") int id, String jsonData) {
		System.out.println("MediumServiceEndpoint: UPDATE DOCUMENT - jsonData: " + jsonData);
		ObjectMapper mapper = new ObjectMapper();
		MediumDocument updatedDocument = null;    	
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		MediumDocument document = entityManager.find(MediumDocument.class, id);
		if ( document == null ) return Response.status(Status.NOT_FOUND).build();		
		// parse JSON data
		try {
			updatedDocument = mapper.readValue(jsonData, MediumDocument.class);
		} catch (IOException e) {
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( updatedDocument == null ) return Response.notModified().build();    	
		// update document
		// System.out.println("MediumServiceEndpoint: UPDATE DOCUMENT - document.id:"+document.getMediumId());	
		// no data to update at the moment
		// update log metadata
		document.getMedium().setLastEditedAt(new Timestamp(System.currentTimeMillis()));
		if ( containerRequestContext.getProperty("TIMAAT.userID") != null ) {
			document.getMedium().setLastEditedByUserAccount((entityManager.find(UserAccount.class, containerRequestContext.getProperty("TIMAAT.userID"))));
		} else {
			// DEBUG do nothing - production system should abort with internal server error			
		}		
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.merge(document);
		entityManager.persist(document);
		entityTransaction.commit();
		entityManager.refresh(document);

		// add log entry
		UserLogManager.getLogger().addLogEntry((int) containerRequestContext.getProperty("TIMAAT.userID"), 
																						UserLogManager.LogEvents.DOCUMENTEDITED);
		System.out.println("MediumServiceEndpoint: UPDATE DOCUMENT - update complete");	
		return Response.ok().entity(document).build();
	}

	@DELETE
	@Produces(javax.ws.rs.core.MediaType.APPLICATION_JSON)
	@Path("document/{id}")
	@Secured
	public Response deleteDocument(@PathParam("id") int id) {  
		System.out.println("DocumentEndpoint: deleteDocument with id: "+ id);
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Medium medium = entityManager.find(Medium.class, id);
		if ( medium == null ) return Response.status(Status.NOT_FOUND).build();
		MediumDocument document = entityManager.find(MediumDocument.class, id);
		if ( document == null ) return Response.status(Status.NOT_FOUND).build();		
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.remove(document);
		entityManager.remove(document.getMedium().getDisplayTitle());
		entityManager.remove(document.getMedium()); // remove document, then corresponding medium
		entityTransaction.commit();
		// add log entry
		UserLogManager.getLogger().addLogEntry((int) containerRequestContext.getProperty("TIMAAT.userID"), 
																						UserLogManager.LogEvents.DOCUMENTDELETED);
		System.out.println("DocumentEndpoint: deleteDocument - document deleted");  
		return Response.ok().build();
	}

	@POST
	@Produces(javax.ws.rs.core.MediaType.APPLICATION_JSON)
	@Consumes(javax.ws.rs.core.MediaType.APPLICATION_JSON)
	@Path("image/{id}")
	@Secured
	public Response createImage(@PathParam("id") int id, String jsonData) {
		System.out.println("MediumServiceEndpoint: createImage jsonData: "+jsonData);
		ObjectMapper mapper = new ObjectMapper();
		MediumImage newImage = null;
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		// parse JSON data
		try {
			newImage = mapper.readValue(jsonData, MediumImage.class);
		} catch (IOException e) {
			System.out.println("MediumServiceEndpoint: createImage: IOException e !");
			e.printStackTrace();
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( newImage == null ) {
			System.out.println("MediumServiceEndpoint: createImage: newImage == null !");
			return Response.status(Status.BAD_REQUEST).build();
		}
		// sanitize object data
		// update log metadata
		// Not necessary, an image will always be created in conjunction with a medium
		// persist image
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.persist(newImage);
		entityManager.flush();
		entityTransaction.commit();
		entityManager.refresh(newImage);
		entityManager.refresh(newImage.getMedium());

		// add log entry
		UserLogManager.getLogger().addLogEntry(newImage.getMedium().getCreatedByUserAccount().getId(), UserLogManager.LogEvents.IMAGECREATED);
		System.out.println("MediumServiceEndpoint: image created with id "+newImage.getMediumId());
		return Response.ok().entity(newImage).build();
	}

	@PATCH
	@Produces(javax.ws.rs.core.MediaType.APPLICATION_JSON)
	@Consumes(javax.ws.rs.core.MediaType.APPLICATION_JSON)
	@Path("image/{id}")
	@Secured
	public Response updateImage(@PathParam("id") int id, String jsonData) {
		System.out.println("MediumServiceEndpoint: UPDATE IMAGE - jsonData: " + jsonData);
		ObjectMapper mapper = new ObjectMapper();
		MediumImage updatedImage = null;    	
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		MediumImage image = entityManager.find(MediumImage.class, id);
		if ( image == null ) return Response.status(Status.NOT_FOUND).build();		
		// parse JSON data
		try {
			updatedImage = mapper.readValue(jsonData, MediumImage.class);
		} catch (IOException e) {
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( updatedImage == null ) return Response.notModified().build();

		// update image
		// System.out.println("MediumServiceEndpoint: UPDATE IMAGE - image.id:"+image.getMediumId());
		if ( updatedImage.getWidth() > 0 ) image.setWidth(updatedImage.getWidth());
		if ( updatedImage.getHeight() > 0 ) image.setHeight(updatedImage.getHeight());
		if ( updatedImage.getBitDepth() != null ) image.setBitDepth(updatedImage.getBitDepth());
		// update log metadata
		image.getMedium().setLastEditedAt(new Timestamp(System.currentTimeMillis()));
		if ( containerRequestContext.getProperty("TIMAAT.userID") != null ) {
			image.getMedium().setLastEditedByUserAccount((entityManager.find(UserAccount.class, containerRequestContext.getProperty("TIMAAT.userID"))));
		} else {
			// DEBUG do nothing - production system should abort with internal server error			
		}		
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.merge(image);
		entityManager.persist(image);
		entityTransaction.commit();
		entityManager.refresh(image);

		// add log entry
		UserLogManager.getLogger().addLogEntry((int) containerRequestContext.getProperty("TIMAAT.userID"), 
																						UserLogManager.LogEvents.IMAGEEDITED);
		System.out.println("MediumServiceEndpoint: UPDATE IMAGE - update complete");	
		return Response.ok().entity(image).build();
	}

	@DELETE
	@Produces(javax.ws.rs.core.MediaType.APPLICATION_JSON)
	@Path("image/{id}")
	@Secured
	public Response deleteImage(@PathParam("id") int id) {  
		System.out.println("ImageEndpoint: deleteImage with id: "+ id);
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Medium medium = entityManager.find(Medium.class, id);
		if ( medium == null ) return Response.status(Status.NOT_FOUND).build();
		MediumImage image = entityManager.find(MediumImage.class, id);
		if ( image == null ) return Response.status(Status.NOT_FOUND).build();		
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.remove(image);
		entityManager.remove(image.getMedium().getDisplayTitle());
		entityManager.remove(image.getMedium()); // remove image, then corresponding medium
		entityTransaction.commit();
		// add log entry
		UserLogManager.getLogger().addLogEntry((int) containerRequestContext.getProperty("TIMAAT.userID"), 
																						UserLogManager.LogEvents.IMAGEDELETED);
		System.out.println("ImageEndpoint: deleteImage - image deleted");  
		return Response.ok().build();
	}

	@POST
	@Produces(javax.ws.rs.core.MediaType.APPLICATION_JSON)
	@Consumes(javax.ws.rs.core.MediaType.APPLICATION_JSON)
	@Path("software/{id}")
	@Secured
	public Response createSoftware(@PathParam("id") int id, String jsonData) {
		System.out.println("MediumServiceEndpoint: createSoftware jsonData: "+jsonData);
		ObjectMapper mapper = new ObjectMapper();
		MediumSoftware newSoftware = null;
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		// parse JSON data
		try {
			newSoftware = mapper.readValue(jsonData, MediumSoftware.class);
		} catch (IOException e) {
			System.out.println("MediumServiceEndpoint: createSoftware: IOException e !");
			e.printStackTrace();
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( newSoftware == null ) {
			System.out.println("MediumServiceEndpoint: createSoftware: newSoftware == null !");
			return Response.status(Status.BAD_REQUEST).build();
		}
		// sanitize object data
		// update log metadata
		// Not necessary, a software will always be created in conjunction with a medium
		// persist software
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.persist(newSoftware);
		entityManager.flush();
		entityTransaction.commit();
		entityManager.refresh(newSoftware);
		entityManager.refresh(newSoftware.getMedium());

		// add log entry
		UserLogManager.getLogger().addLogEntry(newSoftware.getMedium().getCreatedByUserAccount().getId(), UserLogManager.LogEvents.SOFTWARECREATED);
		System.out.println("MediumServiceEndpoint: software created with id "+newSoftware.getMediumId());
		return Response.ok().entity(newSoftware).build();
	}

	@PATCH
	@Produces(javax.ws.rs.core.MediaType.APPLICATION_JSON)
	@Consumes(javax.ws.rs.core.MediaType.APPLICATION_JSON)
	@Path("software/{id}")
	@Secured
	public Response updateSoftware(@PathParam("id") int id, String jsonData) {
		System.out.println("MediumServiceEndpoint: UPDATE SOFTWARE - jsonData: " + jsonData);
		ObjectMapper mapper = new ObjectMapper();
		MediumSoftware updatedSoftware = null;    	
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		MediumSoftware software = entityManager.find(MediumSoftware.class, id);
		if ( software == null ) return Response.status(Status.NOT_FOUND).build();		
		// parse JSON data
		try {
			updatedSoftware = mapper.readValue(jsonData, MediumSoftware.class);
		} catch (IOException e) {
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( updatedSoftware == null ) return Response.notModified().build();  

		// update software
		// System.out.println("MediumServiceEndpoint: UPDATE SOFTWARE - software.id:"+software.getMediumId());	
		if ( updatedSoftware.getVersion() != null ) software.setVersion(updatedSoftware.getVersion());

		// update log metadata
		software.getMedium().setLastEditedAt(new Timestamp(System.currentTimeMillis()));
		if ( containerRequestContext.getProperty("TIMAAT.userID") != null ) {
			software.getMedium().setLastEditedByUserAccount((entityManager.find(UserAccount.class, containerRequestContext.getProperty("TIMAAT.userID"))));
		} else {
			// DEBUG do nothing - production system should abort with internal server error			
		}		
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.merge(software);
		entityManager.persist(software);
		entityTransaction.commit();
		entityManager.refresh(software);

		// add log entry
		UserLogManager.getLogger().addLogEntry((int) containerRequestContext.getProperty("TIMAAT.userID"), 
																						UserLogManager.LogEvents.SOFTWAREEDITED);
		System.out.println("MediumServiceEndpoint: UPDATE SOFTWARE - update complete");	
		return Response.ok().entity(software).build();
	}

	@DELETE
	@Produces(javax.ws.rs.core.MediaType.APPLICATION_JSON)
	@Path("software/{id}")
	@Secured
	public Response deleteSoftware(@PathParam("id") int id) {  
		System.out.println("SoftwareEndpoint: deleteSoftware with id: "+ id);
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Medium medium = entityManager.find(Medium.class, id);
		if ( medium == null ) return Response.status(Status.NOT_FOUND).build();
		MediumSoftware software = entityManager.find(MediumSoftware.class, id);
		if ( software == null ) return Response.status(Status.NOT_FOUND).build();		
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.remove(software);
		entityManager.remove(software.getMedium().getDisplayTitle());
		entityManager.remove(software.getMedium()); // remove software, then corresponding medium
		entityTransaction.commit();
		// add log entry
		UserLogManager.getLogger().addLogEntry((int) containerRequestContext.getProperty("TIMAAT.userID"), 
																						UserLogManager.LogEvents.SOFTWAREDELETED);
		System.out.println("SoftwareEndpoint: deleteSoftware - software deleted");  
		return Response.ok().build();
	}

	@POST
	@Produces(javax.ws.rs.core.MediaType.APPLICATION_JSON)
	@Consumes(javax.ws.rs.core.MediaType.APPLICATION_JSON)
	@Path("text/{id}")
	@Secured
	public Response createText(@PathParam("id") int id, String jsonData) {
		System.out.println("MediumServiceEndpoint: createText jsonData: "+jsonData);
		ObjectMapper mapper = new ObjectMapper();
		MediumText newText = null;
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		// parse JSON data
		try {
			newText = mapper.readValue(jsonData, MediumText.class);
		} catch (IOException e) {
			System.out.println("MediumServiceEndpoint: createText: IOException e !");
			e.printStackTrace();
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( newText == null ) {
			System.out.println("MediumServiceEndpoint: createText: newText == null !");
			return Response.status(Status.BAD_REQUEST).build();
		}
		// sanitize object data
		// update log metadata
		// Not necessary, a text will always be created in conjunction with a medium

		// persist text
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.persist(newText);
		entityManager.flush();
		entityTransaction.commit();
		entityManager.refresh(newText);
		entityManager.refresh(newText.getMedium());

		// add log entry
		UserLogManager.getLogger().addLogEntry(newText.getMedium().getCreatedByUserAccount().getId(), UserLogManager.LogEvents.TEXTCREATED);
		System.out.println("MediumServiceEndpoint: text created with id "+newText.getMediumId());
		return Response.ok().entity(newText).build();
	}

	@PATCH
	@Produces(javax.ws.rs.core.MediaType.APPLICATION_JSON)
	@Consumes(javax.ws.rs.core.MediaType.APPLICATION_JSON)
	@Path("text/{id}")
	@Secured
	public Response updateText(@PathParam("id") int id, String jsonData) {
		System.out.println("MediumServiceEndpoint: UPDATE TEXT - jsonData: " + jsonData);
		ObjectMapper mapper = new ObjectMapper();
		MediumText updatedText = null;    	
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		MediumText text = entityManager.find(MediumText.class, id);
		if ( text == null ) return Response.status(Status.NOT_FOUND).build();		
		// parse JSON data
		try {
			updatedText = mapper.readValue(jsonData, MediumText.class);
		} catch (IOException e) {
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( updatedText == null ) return Response.notModified().build();    	

		// update text
		// System.out.println("MediumServiceEndpoint: UPDATE TEXT - text.id:"+text.getMediumId());	
		if ( updatedText.getContent() != null ) text.setContent(updatedText.getContent());

		// update log metadata
		text.getMedium().setLastEditedAt(new Timestamp(System.currentTimeMillis()));
		if ( containerRequestContext.getProperty("TIMAAT.userID") != null ) {
			text.getMedium().setLastEditedByUserAccount((entityManager.find(UserAccount.class, containerRequestContext.getProperty("TIMAAT.userID"))));
		} else {
			// DEBUG do nothing - production system should abort with internal server error			
		}		
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.merge(text);
		entityManager.persist(text);
		entityTransaction.commit();
		entityManager.refresh(text);

		// add log entry
		UserLogManager.getLogger().addLogEntry((int) containerRequestContext.getProperty("TIMAAT.userID"), 
																						UserLogManager.LogEvents.TEXTEDITED);
		System.out.println("MediumServiceEndpoint: UPDATE TEXT - update complete");	
		return Response.ok().entity(text).build();
	}

	@DELETE
	@Produces(javax.ws.rs.core.MediaType.APPLICATION_JSON)
	@Path("text/{id}")
	@Secured
	public Response deleteText(@PathParam("id") int id) {  
		System.out.println("TextEndpoint: deleteText with id: "+ id);
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Medium medium = entityManager.find(Medium.class, id);
		if ( medium == null ) return Response.status(Status.NOT_FOUND).build();
		MediumText text = entityManager.find(MediumText.class, id);
		if ( text == null ) return Response.status(Status.NOT_FOUND).build();		
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.remove(text);
		entityManager.remove(text.getMedium().getDisplayTitle());
		entityManager.remove(text.getMedium()); // remove text, then corresponding medium
		entityTransaction.commit();
		// add log entry
		UserLogManager.getLogger().addLogEntry((int) containerRequestContext.getProperty("TIMAAT.userID"), 
																						UserLogManager.LogEvents.TEXTDELETED);
		System.out.println("TextEndpoint: deleteText - text deleted");  
		return Response.ok().build();
	}

	@POST
  @Produces(javax.ws.rs.core.MediaType.APPLICATION_JSON)
  @Consumes(javax.ws.rs.core.MediaType.APPLICATION_JSON)
	@Path("video/{id}")
	@Secured
	public Response createVideo(@PathParam("id") int id, String jsonData) {

		System.out.println("MediumServiceEndpoint: createVideo jsonData: "+jsonData);
		ObjectMapper mapper = new ObjectMapper();
		MediumVideo newVideo = null;
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();

		// parse JSON data
		try {
			newVideo = mapper.readValue(jsonData, MediumVideo.class);
		} catch (IOException e) {
			System.out.println("MediumServiceEndpoint: createVideo: IOException e !");
			e.printStackTrace();
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( newVideo == null ) {
			System.out.println("MediumServiceEndpoint: createVideo: newVideo == null !");
			return Response.status(Status.BAD_REQUEST).build();
		}

		// sanitize object data

		// update log metadata
		// Not necessary, a video will always be created in conjunction with a medium

		// persist video
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.persist(newVideo);
		entityManager.flush();
		entityTransaction.commit();
		entityManager.refresh(newVideo);
		entityManager.refresh(newVideo.getMedium());

		// add log entry
		UserLogManager.getLogger()
									.addLogEntry(newVideo.getMedium().getCreatedByUserAccount().getId(), UserLogManager.LogEvents.VIDEOCREATED);
		System.out.println("MediumServiceEndpoint: video created with id "+newVideo.getMediumId());

		return Response.ok().entity(newVideo).build();

	}

	@PATCH
  @Produces(javax.ws.rs.core.MediaType.APPLICATION_JSON)
  @Consumes(javax.ws.rs.core.MediaType.APPLICATION_JSON)
	@Path("video/{id}")
	@Secured
	public Response updateVideo(@PathParam("id") int id, String jsonData) {

		System.out.println("MediumServiceEndpoint: UPDATE VIDEO - jsonData: " + jsonData);
		ObjectMapper mapper = new ObjectMapper();
		MediumVideo updatedVideo = null;
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		MediumVideo video = entityManager.find(MediumVideo.class, id);

		if ( video == null ) return Response.status(Status.NOT_FOUND).build();
		// parse JSON data
		try {
			updatedVideo = mapper.readValue(jsonData, MediumVideo.class);
		} catch (IOException e) {
			System.out.println("MediumServiceEndpoint: UPDATE VIDEO - IOException: " + e.getMessage());
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( updatedVideo == null ) return Response.notModified().build();

		// update video
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
			video.getMedium().setLastEditedByUserAccount((entityManager.find(UserAccount.class, containerRequestContext.getProperty("TIMAAT.userID"))));
		} else {
			// DEBUG do nothing - production system should abort with internal server error
		}

		// persist video
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.merge(video);
		entityManager.persist(video);
		entityTransaction.commit();
		entityManager.refresh(video);

		// add log entry
		UserLogManager.getLogger().addLogEntry((int) containerRequestContext.getProperty("TIMAAT.userID"), 
																						UserLogManager.LogEvents.VIDEOEDITED);
		System.out.println("MediumServiceEndpoint: UPDATE VIDEO - update complete");
		
		// TODO necessary?
		// video.getMedium().getFileStatus("video");
		// video.getMedium().getViewToken();

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

		// persist video
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.remove(video);
		entityManager.remove(video.getMedium().getDisplayTitle());
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
	@Path("videogame/{id}")
	@Secured
	public Response createVideogame(@PathParam("id") int id, String jsonData) {
		System.out.println("MediumServiceEndpoint: createVideogame jsonData: "+jsonData);
		ObjectMapper mapper = new ObjectMapper();
		MediumVideogame newVideogame = null;
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		// parse JSON data
		try {
			newVideogame = mapper.readValue(jsonData, MediumVideogame.class);
		} catch (IOException e) {
			System.out.println("MediumServiceEndpoint: createVideogame: IOException e !");
			e.printStackTrace();
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( newVideogame == null ) {
			System.out.println("MediumServiceEndpoint: createVideogame: newVideogame == null !");
			return Response.status(Status.BAD_REQUEST).build();
		}
		// sanitize object data
		// update log metadata
		// Not necessary, a videogame will always be created in conjunction with a medium
		// persist videogame
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.persist(newVideogame);
		entityManager.flush();
		entityTransaction.commit();
		entityManager.refresh(newVideogame);
		entityManager.refresh(newVideogame.getMedium());

		// add log entry
		UserLogManager.getLogger().addLogEntry(newVideogame.getMedium().getCreatedByUserAccount().getId(), UserLogManager.LogEvents.VIDEOGAMECREATED);
		System.out.println("MediumServiceEndpoint: videogame created with id "+newVideogame.getMediumId());
		return Response.ok().entity(newVideogame).build();
	}

	@PATCH
  @Produces(javax.ws.rs.core.MediaType.APPLICATION_JSON)
  @Consumes(javax.ws.rs.core.MediaType.APPLICATION_JSON)
	@Path("videogame/{id}")
	@Secured
	public Response updateVideogame(@PathParam("id") int id, String jsonData) {
		System.out.println("MediumServiceEndpoint: UPDATE VIDEOGAME - jsonData: " + jsonData);
		ObjectMapper mapper = new ObjectMapper();
		MediumVideogame updatedVideogame = null;    	
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		MediumVideogame videogame = entityManager.find(MediumVideogame.class, id);
		if ( videogame == null ) return Response.status(Status.NOT_FOUND).build();		
		// parse JSON data
		try {
			updatedVideogame = mapper.readValue(jsonData, MediumVideogame.class);
		} catch (IOException e) {
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( updatedVideogame == null ) return Response.notModified().build();

		// update videogame
		// System.out.println("MediumServiceEndpoint: UPDATE VIDEOGAME - videogame.id:"+videogame.getMediumId());	
		if ( updatedVideogame.getIsEpisode() != null ) videogame.setIsEpisode(updatedVideogame.getIsEpisode()); 

		// update log metadata
		videogame.getMedium().setLastEditedAt(new Timestamp(System.currentTimeMillis()));
		if ( containerRequestContext.getProperty("TIMAAT.userID") != null ) {
			videogame.getMedium().setLastEditedByUserAccount((entityManager.find(UserAccount.class, containerRequestContext.getProperty("TIMAAT.userID"))));
		} else {
			// DEBUG do nothing - production system should abort with internal server error			
		}		
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.merge(videogame);
		entityManager.persist(videogame);
		entityTransaction.commit();
		entityManager.refresh(videogame);

		// add log entry
		UserLogManager.getLogger().addLogEntry((int) containerRequestContext.getProperty("TIMAAT.userID"), 
																						UserLogManager.LogEvents.VIDEOGAMEEDITED);
		System.out.println("MediumServiceEndpoint: UPDATE VIDEOGAME - update complete");	
		return Response.ok().entity(videogame).build();
	}

	@DELETE
	@Produces(javax.ws.rs.core.MediaType.APPLICATION_JSON)
	@Path("videogame/{id}")
	@Secured
	public Response deleteVideogame(@PathParam("id") int id) {  
		System.out.println("VideogameEndpoint: deleteVideogame with id: "+ id);
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Medium medium = entityManager.find(Medium.class, id);
		if ( medium == null ) return Response.status(Status.NOT_FOUND).build();
		MediumVideogame videogame = entityManager.find(MediumVideogame.class, id);
		if ( videogame == null ) return Response.status(Status.NOT_FOUND).build();		
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.remove(videogame);
		entityManager.remove(videogame.getMedium().getDisplayTitle());
		entityManager.remove(videogame.getMedium()); // remove videogame, then corresponding medium
		entityTransaction.commit();
		// add log entry
		UserLogManager.getLogger().addLogEntry((int) containerRequestContext.getProperty("TIMAAT.userID"), 
																						UserLogManager.LogEvents.VIDEOGAMEDELETED);
		System.out.println("VideogameEndpoint: deleteVideogame - videogame deleted");  
		return Response.ok().build();
	}

	@POST
  @Produces(javax.ws.rs.core.MediaType.APPLICATION_JSON)
  @Consumes(javax.ws.rs.core.MediaType.APPLICATION_JSON)
	@Path("title/{id}")
	@Secured
	public Response createTitle(@PathParam("id") int id, String jsonData) {

		System.out.println("MediumServiceEndpoint: createTitle: jsonData: "+jsonData);
		ObjectMapper mapper = new ObjectMapper();
		Title newTitle = null;
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		
		// parse JSON data
		try {
			newTitle = mapper.readValue(jsonData, Title.class);
		} catch (IOException e) {
			System.out.println("MediumServiceEndpoint: createTitle: IOException e !");
			e.printStackTrace();
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( newTitle == null ) {
			System.out.println("MediumServiceEndpoint: createTitle: newTitle == null !");
			return Response.status(Status.BAD_REQUEST).build();
		}
		// System.out.println("MediumServiceEndpoint: createTitle: language id: "+newTitle.getLanguage().getId());
		// sanitize object data
		newTitle.setId(0);
		Language language = entityManager.find(Language.class, newTitle.getLanguage().getId());
		newTitle.setLanguage(language);

		// update log metadata
		// Not necessary, a title will always be created in conjunction with a medium
		System.out.println("MediumServiceEndpoint: createTitle: persist title");

		// persist title
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.persist(language);
		entityManager.persist(newTitle);
		entityManager.flush();
		newTitle.setLanguage(language);
		entityTransaction.commit();
		entityManager.refresh(newTitle);
		entityManager.refresh(language);

		// System.out.println("MediumServiceEndpoint: createTitle: add log entry");	
		// add log entry
		UserLogManager.getLogger()
									.addLogEntry((int) containerRequestContext
									.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.TITLECREATED);
		
		System.out.println("MediumServiceEndpoint: create title: title created with id "+newTitle.getId());
		System.out.println("MediumServiceEndpoint: create title: title created with language id "+newTitle.getLanguage().getId());

		return Response.ok().entity(newTitle).build();
	}

	@POST
  @Produces(javax.ws.rs.core.MediaType.APPLICATION_JSON)
  @Consumes(javax.ws.rs.core.MediaType.APPLICATION_JSON)
	@Path("{mediumId}/title/{id}")
	@Secured
	public Response addTitle(@PathParam("mediumId") int mediumId, @PathParam("id") int id, String jsonData) {

		System.out.println("MediumServiceEndpoint: addTitle: jsonData: "+jsonData);
		ObjectMapper mapper = new ObjectMapper();
		Title newTitle = null;
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		
		// parse JSON data
		try {
			newTitle = mapper.readValue(jsonData, Title.class);
		} catch (IOException e) {
			System.out.println("MediumServiceEndpoint: addTitle: IOException e !");
			e.printStackTrace();
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( newTitle == null ) {
			System.out.println("MediumServiceEndpoint: addTitle: newTitle == null !");
			return Response.status(Status.BAD_REQUEST).build();
		}
		// System.out.println("MediumServiceEndpoint: addTitle: title: "+newTitle.getName());
		// sanitize object data
		newTitle.setId(0);
		Language language = entityManager.find(Language.class, newTitle.getLanguage().getId());
		newTitle.setLanguage(language);
		Medium medium = entityManager.find(Medium.class, mediumId);

		// update log metadata
		// Not necessary, a title will always be created in conjunction with a medium
		System.out.println("MediumServiceEndpoint: addTitle: persist title");

		// persist title
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.persist(language);
		entityManager.persist(newTitle);
		entityManager.flush();
		newTitle.setLanguage(language);
		entityTransaction.commit();
		entityManager.refresh(newTitle);
		entityManager.refresh(language);

		// create medium_has_title-table entries
		entityTransaction.begin();
		medium.getTitles().add(newTitle);
		newTitle.getMediums3().add(medium);
		entityManager.merge(newTitle);
		entityManager.merge(medium);
		entityManager.persist(newTitle);
		entityManager.persist(medium);
		entityTransaction.commit();
		entityManager.refresh(medium);
		entityManager.refresh(newTitle);

		System.out.println("MediumServiceEndpoint: addTitle: add log entry");	
		// add log entry
		UserLogManager.getLogger()
									.addLogEntry((int) containerRequestContext
									.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.TITLECREATED);
		
		System.out.println("MediumServiceEndpoint: addTitle: title added with id "+newTitle.getId());
		System.out.println("MediumServiceEndpoint: addTitle: title added with language id "+newTitle.getLanguage().getId());

		return Response.ok().entity(newTitle).build();
	}

	@PATCH
	@Produces(javax.ws.rs.core.MediaType.APPLICATION_JSON)
	@Consumes(javax.ws.rs.core.MediaType.APPLICATION_JSON)
	@Path("title/{id}")
	@Secured
	public Response updateTitle(@PathParam("id") int id, String jsonData) {
		System.out.println("MediumServiceEndpoint: UPDATE TITLE - jsonData: " + jsonData);
		ObjectMapper mapper = new ObjectMapper();
		Title updatedTitle = null;    	
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Title title = entityManager.find(Title.class, id);
		if ( title == null ) return Response.status(Status.NOT_FOUND).build();
		// System.out.println("MediumServiceEndpoint: UPDATE TITLE - old title :"+title.getName());		
		// parse JSON data
		try {
			updatedTitle = mapper.readValue(jsonData, Title.class);
		} catch (IOException e) {
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( updatedTitle == null ) return Response.notModified().build();
		// update title
		// System.out.println("MediumServiceEndpoint: UPDATE TITLE - language id:"+updatedTitle.getLanguage().getId());	
		if ( updatedTitle.getName() != null ) title.setName(updatedTitle.getName());
		if ( updatedTitle.getLanguage() != null ) title.setLanguage(updatedTitle.getLanguage());

		// update log metadata
		// log metadata will be updated with the corresponding medium
		// title.getMedium().setLastEditedAt(new Timestamp(System.currentTimeMillis()));
		// if ( containerRequestContext.getProperty("TIMAAT.userID") != null ) {
		// 	title.getMedium().setLastEditedByUserAccount((entityManager.find(UserAccount.class, containerRequestContext.getProperty("TIMAAT.userID"))));
		// } else {
		// 	// DEBUG do nothing - production system should abort with internal server error			
		// }
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.merge(title);
		entityManager.persist(title);
		entityTransaction.commit();
		entityManager.refresh(title);

		// System.out.println("MediumServiceEndpoint: UPDATE TITLE - only logging remains");	
		// add log entry
		UserLogManager.getLogger()
									.addLogEntry((int) containerRequestContext
									.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.TITLEEDITED);
		System.out.println("MediumServiceEndpoint: UPDATE TITLE - update complete");	
		return Response.ok().entity(title).build();
	}

	@DELETE
	@Produces(javax.ws.rs.core.MediaType.APPLICATION_JSON)
	@Path("title/{id}")
	@Secured
	public Response deleteTitle(@PathParam("id") int id) {    
		System.out.println("MediumServiceEndpoint: deleteTitle");	
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Title title = entityManager.find(Title.class, id);
		if ( title == null ) return Response.status(Status.NOT_FOUND).build();
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.remove(title);
		entityTransaction.commit();
		// add log entry
		UserLogManager.getLogger()
									.addLogEntry((int) containerRequestContext
									.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.TITLEDELETED);
		System.out.println("MediumServiceEndpoint: deleteTitle - delete complete");	
		return Response.ok().build();
	}

	@POST
  @Produces(javax.ws.rs.core.MediaType.APPLICATION_JSON)
  // @Consumes(javax.ws.rs.core.MediaType.APPLICATION_JSON)
	@Path("{mediumId}/languageTrack/{languageTypeId}/{languageId}")
	@Secured
	public Response addMediumHasLanguageItem(@PathParam("mediumId") int mediumId, 
																					 @PathParam("languageTypeId") int mediumLanguageTypeId, 
																					 @PathParam("languageId") int languageId) {
		System.out.println("MediumServiceEndpoint: addLanguageTrack: "+mediumId+" "+mediumLanguageTypeId+ " "+languageId);
		// System.out.println("MediumServiceEndpoint: addLanguageTrack: jsonData: "+jsonData);

		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		System.out.println("MediumServiceEndpoint: addLanguageTrack: find language");
		Language language = entityManager.find(Language.class, languageId);
		if (language == null) return Response.status(Status.NOT_FOUND).build();
		System.out.println("MediumServiceEndpoint: addLanguageTrack: find medium");
		Medium medium = entityManager.find(Medium.class, mediumId);
		if (medium == null) return Response.status(Status.NOT_FOUND).build();
		System.out.println("MediumServiceEndpoint: addLanguageTrack: find language type");
		MediumLanguageType mediumLanguageType = entityManager.find(MediumLanguageType.class, mediumLanguageTypeId);
		if (mediumLanguageType == null) return Response.status(Status.NOT_FOUND).build();
		System.out.println("MediumServiceEndpoint: addLanguageTrack: initialization complete");

		MediumHasLanguage mhl = null;
		try {
			mhl = (MediumHasLanguage) entityManager.createQuery(
				"SELECT mhl FROM MediumHasLanguage mhl WHERE mhl.language=:language AND mhl.medium=:medium AND mhl.mediumLanguageType=:mediumLanguageType")
					.setParameter("language", language)
					.setParameter("medium", medium)
					.setParameter("mediumLanguageType", mediumLanguageType)
					.getSingleResult();
		} catch (Exception e) {
			// doesn't matter
		}
		System.out.println("MediumServiceEndpoint: addLanguageTrack: db query passed");
		if ( mhl == null ) {
			mhl = new MediumHasLanguage();
			mhl.setLanguage(language);
			mhl.setMedium(medium);
			mhl.setMediumLanguageType(mediumLanguageType);
				try {
					EntityTransaction entityTransaction = entityManager.getTransaction();
					entityTransaction.begin();
					entityManager.persist(mhl);
					entityTransaction.commit();
					entityManager.refresh(medium);
					entityManager.refresh(mhl);
				} catch (Exception e) {
					e.printStackTrace();
					return Response.notModified().build();
				}
			}
		System.out.println("MediumServiceEndpoint: addLanguageTrack: entity transaction complete");
					
		// System.out.println("MediumServiceEndpoint: addLanguageTrack: add log entry");
		// add log entry
		// UserLogManager.getLogger().addLogEntry((int) containerRequestContext.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.MEDIUMEDITED);

		return Response.ok().entity(mhl).build();
	}

	@PATCH
	@Produces(javax.ws.rs.core.MediaType.APPLICATION_JSON)
	@Consumes(javax.ws.rs.core.MediaType.APPLICATION_JSON)
	@Path("{mediumId}/languageTrack/{languageTypeId}/{languageId}")
	@Secured
	public Response updateMediumHasLanguageItem(@PathParam("mediumId") int mediumId, 
																							@PathParam("languageTypeId") int mediumLanguageTypeId, 
																							@PathParam("languageId") int languageId, 
																							String jsonData) throws IOException {
		
		System.out.println("MediumServiceEndpoint: updateLanguageTrack: jsonData: "+jsonData);
		ObjectMapper mapper = new ObjectMapper();
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Language language = entityManager.find(Language.class, languageId);
		if (language == null) return Response.status(Status.NOT_FOUND).build();
		Medium medium = entityManager.find(Medium.class, mediumId);
		if (medium == null) return Response.status(Status.NOT_FOUND).build();
		MediumLanguageType mediumLanguageType = entityManager.find(MediumLanguageType.class, mediumLanguageTypeId);
		if (mediumLanguageType == null) return Response.status(Status.NOT_FOUND).build();
		System.out.println("MediumServiceEndpoint: updateLanguageTrack: initialization complete");
		
		JsonNode jsonNode = mapper.readTree(jsonData);
		int jsonNodeMedium = jsonNode.get("mediumId").asInt();
		int jsonNodeLanguage = jsonNode.get("languageId").asInt();
		int jsonNodeMediumLanguageType = jsonNode.get("mediumLanguageTypeId").asInt();
		Medium tempMedium = entityManager.find(Medium.class, jsonNodeMedium);
		Language tempLanguage = entityManager.find(Language.class, jsonNodeLanguage);
		MediumLanguageType tempLanguageType = entityManager.find(MediumLanguageType.class, jsonNodeMediumLanguageType);
		MediumHasLanguage mediumHasLanguage = new MediumHasLanguage();
		mediumHasLanguage.setMedium(tempMedium);
		mediumHasLanguage.setLanguage(tempLanguage);
		mediumHasLanguage.setMediumLanguageType(tempLanguageType);

		// TODO This is a temporary fix until language track form is reworked
		// don't update if mediumHasLanguage does already exist
		MediumHasLanguage mhlInDB = null;
		try {
			mhlInDB = (MediumHasLanguage) entityManager.createQuery(
				"SELECT mhlInDB FROM MediumHasLanguage mhlInDB WHERE mhlInDB.language=:language AND mhlInDB.medium=:medium AND mhlInDB.mediumLanguageType=:mediumLanguageType")
					.setParameter("language", tempLanguage)
					.setParameter("medium", tempMedium)
					.setParameter("mediumLanguageType", tempLanguageType)
					.getSingleResult();
		} catch (Exception e) {
			// doesn't matter
		}
		if (mhlInDB != null) {
			// entry already exists, don't add it
			return Response.notModified().build();
		}
		// END of TODO

		try {
			EntityTransaction entityTransaction = entityManager.getTransaction();
			entityTransaction.begin();
			entityManager.createQuery(
				"UPDATE MediumHasLanguage mhl SET mhl.language=:language, mhl.mediumLanguageType=:mediumLanguageType WHERE mhl.medium=:medium AND mhl.language=:oldLanguage AND mhl.mediumLanguageType=:oldMediumLanguageType")
					.setParameter("language", mediumHasLanguage.getLanguage())
					.setParameter("medium", mediumHasLanguage.getMedium())
					.setParameter("mediumLanguageType", mediumHasLanguage.getMediumLanguageType())
					.setParameter("oldLanguage", language)
					.setParameter("oldMediumLanguageType", mediumLanguageType)
					.executeUpdate();
			// entityManager.persist(mhl);
			entityTransaction.commit();
			entityManager.refresh(medium);

		} catch (Exception e) {
			e.printStackTrace();
			return Response.notModified().build();
		}
		System.out.println("MediumServiceEndpoint: updateLanguageTrack: entity transaction complete");

		// System.out.println("MediumServiceEndpoint: updateLanguageTrack: add log entry");
		// add log entry
		// UserLogManager.getLogger().addLogEntry((int) containerRequestContext.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.MEDIUMEDITED);

		return Response.ok().entity(mediumHasLanguage).build();
	}

	@DELETE
	@Produces(javax.ws.rs.core.MediaType.APPLICATION_JSON)
	@Path("{mediumId}/languageTrack/{languageTypeId}/{languageId}")
	@Secured
	public Response deleteMediumHasLanguageItem(@PathParam("mediumId") int mediumId,
																							@PathParam("languageTypeId") int mediumLanguageTypeId,
																							@PathParam("languageId") int languageId) {    
		System.out.println("MediumServiceEndpoint: deleteMediumHasLanguageItem");	

		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Language language = entityManager.find(Language.class, languageId);
		if ( language == null ) return Response.status(Status.NOT_FOUND).build();
		Medium medium = entityManager.find(Medium.class, mediumId);
		if ( medium == null ) return Response.status(Status.NOT_FOUND).build();
		MediumLanguageType mediumLanguageType = entityManager.find(MediumLanguageType.class, mediumLanguageTypeId);
		if ( mediumLanguageType == null ) return Response.status(Status.NOT_FOUND).build();

		try {
			EntityTransaction entityTransaction = entityManager.getTransaction();
			entityTransaction.begin();
			entityManager.createQuery("DELETE FROM MediumHasLanguage mhl WHERE mhl.language=:language AND mhl.medium=:medium AND mhl.mediumLanguageType=:mediumLanguageType")
				.setParameter("language", language)
				.setParameter("medium", medium)
				.setParameter("mediumLanguageType", mediumLanguageType)
				.executeUpdate();
			entityTransaction.commit();
			entityManager.refresh(medium);
		} catch (Exception e) {
			e.printStackTrace();
			return Response.notModified().build();
		}
		// add log entry
		// UserLogManager.getLogger().addLogEntry((int) crc.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.MEDIUMHASLANGUAGEDELETED);
		System.out.println("MediumServiceEndpoint: deleteMediumHasLanguageItem - delete complete");	
		return Response.ok().build();
	}

	@POST
  @Produces(javax.ws.rs.core.MediaType.APPLICATION_JSON)
	@Path("{mediumId}/hasActor/{actorId}/withRole/{roleId}")
	@Secured
	public Response addMediumHasActorWithRoles(@PathParam("mediumId") int mediumId, 
																						 @PathParam("actorId") int actorId,
																						 @PathParam("roleId") int roleId) {
		System.out.println("MediumServiceEndpoint: addMediumHasActorWithRoles");

		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		System.out.println("MediumServiceEndpoint: addMediumHasActorWithRoles - entityManager created");
		Medium medium = entityManager.find(Medium.class, mediumId);
		if (medium == null) return Response.status(Status.NOT_FOUND).build();
		System.out.println("MediumServiceEndpoint: addMediumHasActorWithRoles - medium found");
		Actor actor = entityManager.find(Actor.class, actorId);
		if (actor == null) return Response.status(Status.NOT_FOUND).build();
		System.out.println("MediumServiceEndpoint: addMediumHasActorWithRoles - actor found");
		Role role = entityManager.find(Role.class, roleId);
		if (role == null) return Response.status(Status.NOT_FOUND).build();
		System.out.println("MediumServiceEndpoint: addMediumHasActorWithRoles - role found");

		System.out.println("MediumServiceEndpoint: addMediumHasActorWithRoles - check if medium-actor-role combination already exists");
		MediumHasActorWithRole mhawr = null;
		try {
			mhawr = (MediumHasActorWithRole) entityManager.createQuery(
				"SELECT mhawr FROM MediumHasActorWithRole mhawr WHERE mhawr.medium=:medium AND mhawr.actor=:actor AND mhawr.role=:role")
					.setParameter("medium", medium)
					// .setParameter("actor", actor)
					// .setParameter("role", role)
					.getSingleResult();
		} catch (Exception e) {
			// doesn't matter
		}
		if ( mhawr == null ) {
			System.out.println("MediumServiceEndpoint: addMediumHasActorWithRoles - create new entry");
			mhawr = new MediumHasActorWithRole();
			mhawr.setMedium(medium);
			mhawr.setActor(actor);
			mhawr.setRole(role);
				try {
					EntityTransaction entityTransaction = entityManager.getTransaction();
					entityTransaction.begin();
					entityManager.persist(mhawr);
					entityTransaction.commit();
					entityManager.refresh(medium);
					entityManager.refresh(actor);
					entityManager.refresh(role);
					entityManager.refresh(mhawr);
				} catch (Exception e) {
					e.printStackTrace();
					return Response.notModified().build();
				}
			}
		System.out.println("MediumServiceEndpoint: addMediumHasActorWithRoles: entity transaction complete");
					
		// System.out.println("MediumServiceEndpoint: addActorToMediumHasActorWithRoles: add log entry");
		// add log entry
		// UserLogManager.getLogger().addLogEntry((int) containerRequestContext.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.MEDIUMEDITED);

		return Response.ok().entity(mhawr).build();
	}

	@DELETE
	@Produces(javax.ws.rs.core.MediaType.APPLICATION_JSON)
	@Path("{mediumId}/hasActor/{actorId}")
	@Secured
	public Response deleteActorFromMediumHasActorWithRoles(@PathParam("mediumId") int mediumId, 
																												 @PathParam("actorId") int actorId) {    
		System.out.println("MediumServiceEndpoint: deleteMediumHasActorWithRolesItem");
		// deletes all entries of medium-actor matches

		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Medium medium = entityManager.find(Medium.class, mediumId);
		if ( medium == null ) return Response.status(Status.NOT_FOUND).build();
		Actor actor = entityManager.find(Actor.class, actorId);
		if ( actor == null ) return Response.status(Status.NOT_FOUND).build();

		try {
			EntityTransaction entityTransaction = entityManager.getTransaction();
			entityTransaction.begin();
			entityManager.createQuery("DELETE FROM MediumHasActorWithRole mhawr WHERE mhawr.medium=:medium AND mhawr.actor=:actor")
				.setParameter("medium", medium)
				.setParameter("actor", actor)
				.executeUpdate();
			entityTransaction.commit();
			entityManager.refresh(medium);
			// entityManager.refresh(actor);
		} catch (Exception e) {
			e.printStackTrace();
			return Response.notModified().build();
		}

		System.out.println("MediumServiceEndpoint: deleteMediumHasActorWithRolesItem - delete complete");	
		return Response.ok().build();
	}

	@DELETE
	@Produces(javax.ws.rs.core.MediaType.APPLICATION_JSON)
	@Path("{mediumId}/hasActor/{actorId}/withRole/{roleId}")
	@Secured
	public Response deleteRoleFromMediumHasActorWithRoles(@PathParam("mediumId") int mediumId, 
																												@PathParam("actorId") int actorId,
																												@PathParam("roleId") int roleId) {    
		System.out.println("MediumServiceEndpoint: deleteMediumHasActorWithRolesItem");
		// deletes all entries of medium-actor matches

		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Medium medium = entityManager.find(Medium.class, mediumId);
		if ( medium == null ) return Response.status(Status.NOT_FOUND).build();
		Actor actor = entityManager.find(Actor.class, actorId);
		if ( actor == null ) return Response.status(Status.NOT_FOUND).build();
		Role role = entityManager.find(Role.class, roleId);
		if ( role == null ) return Response.status(Status.NOT_FOUND).build();

		try {
			EntityTransaction entityTransaction = entityManager.getTransaction();
			entityTransaction.begin();
			entityManager.createQuery("DELETE FROM MediumHasActorWithRole mhawr WHERE mhawr.medium=:medium AND mhawr.actor=:actor AND mhawr.role=:role")
				.setParameter("medium", medium)
				.setParameter("actor", actor)
				.setParameter("role", role)
				.executeUpdate();
			entityTransaction.commit();
			entityManager.refresh(medium);
			// entityManager.refresh(actor);
			// entityManager.refresh(role);
		} catch (Exception e) {
			e.printStackTrace();
			return Response.notModified().build();
		}

		System.out.println("MediumServiceEndpoint: deleteMediumHasActorWithRolesItem - delete complete");	
		return Response.ok().build();
	}

	// Currently not in use
	@POST
  @Produces(javax.ws.rs.core.MediaType.APPLICATION_JSON)
  @Consumes(javax.ws.rs.core.MediaType.APPLICATION_JSON)
	@Path("source/{id}")
	@Secured
	public Response createSource(@PathParam("id") int id, String jsonData) {

		System.out.println("MediumServiceEndpoint: createSource: jsonData: "+jsonData);
		ObjectMapper mapper = new ObjectMapper();
		Source newSource = null;
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		
		// parse JSON data
		try {
			newSource = mapper.readValue(jsonData, Source.class);
		} catch (IOException e) {
			System.out.println("MediumServiceEndpoint: createSource: IOException e !");
			e.printStackTrace();
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( newSource == null ) {
			System.out.println("MediumServiceEndpoint: createSource: newSource == null !");
			return Response.status(Status.BAD_REQUEST).build();
		}
		// sanitize object data
		newSource.setId(0);
		Medium medium = entityManager.find(Medium.class, newSource.getMedium().getId());
		newSource.setMedium(medium);

		// update log metadata
		// Not necessary, a source will always be created in conjunction with a medium

		// persist source
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.persist(newSource);
		medium.getSources().add(newSource);
		// medium.addSource(newSource);
		entityManager.persist(medium);
		entityManager.flush();
		newSource.setMedium(medium);
		entityTransaction.commit();
		entityManager.refresh(newSource);
		entityManager.refresh(medium);

		// add log entry
		// UserLogManager.getLogger().addLogEntry(newSource.getMediums1().get(0).getCreatedByUserAccount().getId(), UserLogManager.LogEvents.SOURCECREATED);
		System.out.println("MediumServiceEndpoint: source created with id "+newSource.getId());

		return Response.ok().entity(newSource).build();
	}

	@PATCH
	@Produces(javax.ws.rs.core.MediaType.APPLICATION_JSON)
	@Consumes(javax.ws.rs.core.MediaType.APPLICATION_JSON)
	@Path("source/{id}")
	@Secured
	public Response updateSource(@PathParam("id") int id, String jsonData) {
		System.out.println("MediumServiceEndpoint: UPDATE SOURCE - jsonData: " + jsonData);
		ObjectMapper mapper = new ObjectMapper();
		Source updatedSource = null;    	
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Source source = entityManager.find(Source.class, id);
		if ( source == null ) return Response.status(Status.NOT_FOUND).build();		
		// parse JSON data
		try {
			updatedSource = mapper.readValue(jsonData, Source.class);
		} catch (IOException e) {
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( updatedSource == null ) return Response.notModified().build(); 

		// update source
		// System.out.println("MediumServiceEndpoint: UPDATE SOURCE - source.id:"+source.getId());
		// System.out.println("MediumServiceEndpoint: UPDATE SOURCE - language id:"+updatedSource.getLanguage().getId());
		if ( updatedSource.getIsPrimarySource() != null ) source.setIsPrimarySource(updatedSource.getIsPrimarySource());
		source.setUrl(updatedSource.getUrl());
		source.setLastAccessed(updatedSource.getLastAccessed());
		if ( updatedSource.getIsStillAvailable() != null ) source.setIsStillAvailable(updatedSource.getIsStillAvailable());

		// update log metadata
		// log metadata will be updated with the corresponding medium
		// source.getMedium().setLastEditedAt(new Timestamp(System.currentTimeMillis()));
		// if ( containerRequestContext.getProperty("TIMAAT.userID") != null ) {
		// 	source.getMedium().setLastEditedByUserAccount((entityManager.find(UserAccount.class, containerRequestContext.getProperty("TIMAAT.userID"))));
		// } else {
		// 	// DEBUG do nothing - production system should abort with internal server error			
		// }	
		
		// persist source
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.merge(source);
		entityManager.persist(source);
		entityTransaction.commit();
		entityManager.refresh(source);

		// System.out.println("MediumServiceEndpoint: UPDATE SOURCE - only logging remains");	
		// add log entry
		UserLogManager.getLogger().addLogEntry((int) containerRequestContext.getProperty("TIMAAT.userID"), 
																						UserLogManager.LogEvents.SOURCEEDITED);
		System.out.println("MediumServiceEndpoint: UPDATE SOURCE - update complete");	
		return Response.ok().entity(source).build();
	}

	@DELETE
	@Produces(javax.ws.rs.core.MediaType.APPLICATION_JSON)
	@Path("source/{id}")
	@Secured
	public Response deleteSource(@PathParam("id") int id) {    
	System.out.println("MediumServiceEndpoint: deleteSource");	
	EntityManager entityManager = TIMAATApp.emf.createEntityManager();
	Source source = entityManager.find(Source.class, id);
	if ( source == null ) return Response.status(Status.NOT_FOUND).build();
	EntityTransaction entityTransaction = entityManager.getTransaction();
	entityTransaction.begin();
	entityManager.remove(source);
	entityTransaction.commit();
	// add log entry
	UserLogManager.getLogger().addLogEntry((int) containerRequestContext.getProperty("TIMAAT.userID"), 
																					UserLogManager.LogEvents.SOURCEDELETED);
	System.out.println("MediumServiceEndpoint: deleteSource - delete complete");	
	return Response.ok().build();
	}

	@POST
	@Path("image/{id}/upload")
	@Consumes(javax.ws.rs.core.MediaType.MULTIPART_FORM_DATA)  
	@Produces(javax.ws.rs.core.MediaType.APPLICATION_JSON)
	@Secured
	public Response uploadImage(@PathParam("id") int id,
															@FormDataParam("file") InputStream uploadedInputStream,
															@FormDataParam("file") FormDataContentDisposition fileDetail) {

		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		MediumImage mediumImage = entityManager.find(MediumImage.class, id);
		if (mediumImage == null) return Response.status(Status.NOT_FOUND).build();

		if ( mediumImage.getMedium().getFileStatus().compareTo("noFile") != 0 )
			return Response.status(Status.FORBIDDEN).entity("ERROR::Image file already exists").build();
		
		try {
			// TODO assume png upload only
			String tempName = ThreadLocalRandom.current().nextInt(1, 65535) + System.currentTimeMillis()
					+ "-upload.png";
			File uploadTempFile = new File(
				TIMAATApp.timaatProps.getProp(PropertyConstants.STORAGE_LOCATION)
					+ "medium/image/" + tempName);

			BufferedOutputStream stream = new BufferedOutputStream(new FileOutputStream(uploadTempFile));
			byte[] bytes = new byte[1024];
			int sizeRead;
			while ((sizeRead = uploadedInputStream.read(bytes, 0, 1024)) > 0) {
				stream.write(bytes, 0, sizeRead);
			}
			stream.flush();
			stream.close();
			System.out.println("You successfully uploaded !");

			// get image metadata 
			ImageInformation info = getImageFileInfo( new File(
				TIMAATApp.timaatProps.getProp(PropertyConstants.STORAGE_LOCATION)
					+ "medium/image/" + tempName)
			);
			mediumImage.setWidth(info.getWidth());
			mediumImage.setHeight(info.getHeight());
			// mediumImage.setBitDepth(info.getBitdepth());
			// mediumImage.getMedium().setFileExtension(info.getFileExtension());
			// rename file with medium
			String fileExtension = "png"; // TODO check for input file extension type
			int mediumId = mediumImage.getMediumId();
			File tempFile = new File(TIMAATApp.timaatProps.getProp(PropertyConstants.STORAGE_LOCATION)
				+ "medium/image/" + tempName);
			tempFile.renameTo(new File(TIMAATApp.timaatProps.getProp(PropertyConstants.STORAGE_LOCATION)
				+ "medium/image/" + mediumId + "-image-original." + fileExtension));
			mediumImage.getMedium().setFilePath(TIMAATApp.timaatProps.getProp(PropertyConstants.STORAGE_LOCATION) 
				+ "medium/image/" + mediumId + "-image-original." + fileExtension);

			EntityTransaction entityTransaction = entityManager.getTransaction();
			entityTransaction.begin();
			entityManager.merge(mediumImage);
			entityManager.merge(mediumImage.getMedium());
			entityManager.persist(mediumImage);
			entityManager.persist(mediumImage.getMedium());
			entityManager.flush();
			entityTransaction.commit();
			entityManager.refresh(mediumImage);

			File imageDirectory =	new File(TIMAATApp.timaatProps.getProp(PropertyConstants.STORAGE_LOCATION)
				+ "medium/image/" + mediumId);
			imageDirectory.mkdir();

			double width = mediumImage.getWidth();
			double height = mediumImage.getHeight();
			double aspectRatio = (double) width / height;
			double sixteenToNine = 16.0 / 9.0;
			double scaleFactor = 1.0;
			int targetWidth = 0;
			int targetHeight = 0;
			// create thumbnail
			if ( aspectRatio >= sixteenToNine && width > 160) {
				targetWidth = 160;
				scaleFactor = 160 / width;
				targetHeight = (int)Math.floor(height * scaleFactor);
			} else if (aspectRatio < sixteenToNine && height > 90) {
				scaleFactor = 90 / height;
				targetWidth = (int)Math.floor(width * scaleFactor);
				targetHeight = 90;
			}
			if (targetHeight > 0 && targetWidth > 0) {
				BufferedImage bufferedImage = ImageIO.read(new File (TIMAATApp.timaatProps.getProp(PropertyConstants.STORAGE_LOCATION) 
					+ "medium/image/" + mediumId + "-image-original." + fileExtension));
				BufferedImage resizedImage = resizeImage(bufferedImage, targetWidth, targetHeight);
				ImageIO.write(resizedImage, "png", new File(TIMAATApp.timaatProps.getProp(PropertyConstants.STORAGE_LOCATION)
					+ "medium/image/" + mediumId + "/" + mediumId + "-image-thumb.png"));
			} else { // original image is smaller than thumbnail dimensions
				BufferedImage bufferedImage = ImageIO.read(new File (TIMAATApp.timaatProps.getProp(PropertyConstants.STORAGE_LOCATION) 
					+ "medium/image/" + mediumId + "-image-original." + fileExtension));
				ImageIO.write(bufferedImage, "png", new File(TIMAATApp.timaatProps.getProp(PropertyConstants.STORAGE_LOCATION)
					+ "medium/image/" + mediumId + "/" + mediumId + "-image-thumb.png"));
			}
			targetHeight = 0;
			targetWidth = 0;
			// create scaled image for default view
			if ( aspectRatio >= sixteenToNine && width > 854) {
				targetWidth = 854;
				scaleFactor = 854 / width;
				targetHeight = (int)Math.floor(height * scaleFactor);
			} else if (aspectRatio < sixteenToNine && height > 480) {
				scaleFactor = 480 / height;
				targetWidth = (int)Math.floor(width * scaleFactor);
				targetHeight = 480;
			}
			if (targetHeight > 0 && targetWidth > 0) {
				BufferedImage bufferedImage = ImageIO.read(new File (TIMAATApp.timaatProps.getProp(PropertyConstants.STORAGE_LOCATION) 
					+ "medium/image/" + mediumId + "-image-original." + fileExtension));
				BufferedImage resizedImage = resizeImage(bufferedImage, targetWidth, targetHeight);
				ImageIO.write(resizedImage, "png", new File(TIMAATApp.timaatProps.getProp(PropertyConstants.STORAGE_LOCATION)
					+ "medium/image/" + mediumId + "/" + mediumId + "-image-scaled.png"));
			} else { // original image is smaller than 480p dimensions
				BufferedImage bufferedImage = ImageIO.read(new File (TIMAATApp.timaatProps.getProp(PropertyConstants.STORAGE_LOCATION) 
					+ "medium/image/" + mediumId + "-image-original." + fileExtension));
				ImageIO.write(bufferedImage, "png", new File(TIMAATApp.timaatProps.getProp(PropertyConstants.STORAGE_LOCATION)
					+ "medium/image/" + mediumId + "/" + mediumId + "-image-scaled.png"));
			}

			mediumImage.getMedium().setViewToken(issueFileToken(mediumImage.getMediumId()));
			System.out.println("ViewToken: "+ mediumImage.getMedium().getViewToken());
			// add log entry
			UserLogManager.getLogger().addLogEntry((int) containerRequestContext.getProperty("TIMAAT.userID"), 
																						 UserLogManager.LogEvents.MEDIUMCREATED);

		} catch (IOException e) {
			e.printStackTrace();
		}

		return Response.ok().entity(mediumImage).build();
	}
		
	@POST
	@Path("video/{id}/upload")
	@Consumes(javax.ws.rs.core.MediaType.MULTIPART_FORM_DATA)  
	@Produces(javax.ws.rs.core.MediaType.APPLICATION_JSON)
	@Secured
	public Response uploadVideo(@PathParam("id") int id,
															@FormDataParam("file") InputStream uploadedInputStream,
															@FormDataParam("file") FormDataContentDisposition fileDetail) {

		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		MediumVideo mediumVideo = entityManager.find(MediumVideo.class, id);
		if (mediumVideo == null) return Response.status(Status.NOT_FOUND).build();

		if ( mediumVideo.getMedium().getFileStatus().compareTo("noFile") != 0 )
			return Response.status(Status.FORBIDDEN).entity("ERROR::Video file already exists").build();
		
		try {
			// TODO assume MP4 upload only
			String tempName = ThreadLocalRandom.current().nextInt(1, 65535) + System.currentTimeMillis()
				+ "-upload.mp4";
			File uploadTempFile = new File(
				TIMAATApp.timaatProps.getProp(PropertyConstants.STORAGE_LOCATION)
					+ "medium/video/" + tempName);

			BufferedOutputStream stream = new BufferedOutputStream(new FileOutputStream(uploadTempFile));
			byte[] bytes = new byte[1024];
			int sizeRead;
			while ((sizeRead = uploadedInputStream.read(bytes, 0, 1024)) > 0) {
				stream.write(bytes, 0, sizeRead);
			}
			stream.flush();
			stream.close();
			System.out.println("You successfully uploaded !");
			/*
			 * int read = 0; byte[] bytes = new byte[1024];
			 * 
			 * while ((read = uploadedInputStream.read(bytes)) != -1) { out.write(bytes, 0,
			 * read); out.flush(); } out.close();
			 */
			// persist mediumvideo changes
			// TODO load from config
			// MediaType mt = entityManager.find(MediaType.class, 6);
			// Language lang = entityManager.find(Language.class, 1);

			/*
			Title title = new Title();
			title.setLanguage(lang);
			title.setName(fileDetail.getFileName().substring(0, fileDetail.getFileName().length() - 4));
			*/
			
			// mediumVideo.getMedium().setFilePath(TIMAATApp.timaatProps.getProp(PropertyConstants.STORAGE_LOCATION) + "medium/video/" + tempName);
			// mediumVideo.getMedium().setMediaType(mt);

			// get data from ffmpeg
			VideoInformation info = getVideoFileInfo(
				TIMAATApp.timaatProps.getProp(PropertyConstants.STORAGE_LOCATION)
					+ "medium/video/" + tempName
			);
			mediumVideo.setWidth(info.getWidth());
			mediumVideo.setHeight(info.getHeight());
			mediumVideo.setFrameRate(info.getFramerate());
			mediumVideo.setVideoCodec("");
			mediumVideo.setLength(info.getDuration());

			/*
			EntityTransaction entityTransaction = entityManager.getTransaction();
			entityTransaction.begin();
			entityManager.persist(mediumVideo);
			entityManager.persist(mediumVideo.getMedium());
			entityManager.flush();
			entityTransaction.commit();
			entityManager.refresh(mediumVideo);
			*/
			
			// rename file with medium
			int mediumId = mediumVideo.getMediumId();
			File tempFile = new File(TIMAATApp.timaatProps.getProp(PropertyConstants.STORAGE_LOCATION) 
				+ "medium/video/" + tempName);
			tempFile.renameTo(new File(TIMAATApp.timaatProps.getProp(PropertyConstants.STORAGE_LOCATION)
				+ "medium/video/" + mediumId + "-video-original.mp4")); // TODO assume mp4 upload only
			mediumVideo.getMedium().setFilePath(TIMAATApp.timaatProps.getProp(PropertyConstants.STORAGE_LOCATION) 
				+ "medium/video/" + mediumId	+ "-video-original.mp4");

			EntityTransaction entityTransaction = entityManager.getTransaction();
			entityTransaction.begin();
			entityManager.merge(mediumVideo);
			entityManager.merge(mediumVideo.getMedium());
			entityManager.persist(mediumVideo);
			entityManager.persist(mediumVideo.getMedium());
			entityManager.flush();
			entityTransaction.commit();
			entityManager.refresh(mediumVideo);

			createVideoThumbnails(mediumId, TIMAATApp.timaatProps.getProp(PropertyConstants.STORAGE_LOCATION)
				+ "medium/video/" + mediumId + "-video-original.mp4");

			// start transcoding video
			// TODO refactor
			// transcoding now done by external cron job
//			newMedium.setStatus("transcoding");
//			newMedium.setViewToken(issueFileToken(newMedium.getId()));
/*			TranscoderThread videoTranscoder = new TranscoderThread(mediumVideo.getMediumId(),
					TIMAATApp.timaatProps.getProp(PropertyConstants.STORAGE_LOCATION) + "medium/video/" + mediumVideo.getMediumId()
							+ "-video-original.mp4");
			videoTranscoder.start();
*/
			// add log entry
			UserLogManager.getLogger().addLogEntry((int) containerRequestContext.getProperty("TIMAAT.userID"),
					UserLogManager.LogEvents.MEDIUMCREATED);

		} catch (IOException e) {
			e.printStackTrace();
		}

		return Response.ok().entity(mediumVideo).build();
	}

	@HEAD
	@Path("video/{id}/download")
	@Produces("video/mp4")
	public Response getVideoFileInfo(@PathParam("id") int id,
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
			if ( mediumFileStatus(id, "video").compareTo("ready") != 0 ) return Response.status(Status.NOT_FOUND).build();
			File file = new File( 
				TIMAATApp.timaatProps.getProp(PropertyConstants.STORAGE_LOCATION)
					+ "medium/video/" + id + "/" + id + "-video.mp4");
			
			return Response.ok()
				.status( Response.Status.PARTIAL_CONTENT )
				.header( HttpHeaders.CONTENT_LENGTH, file.length() )
				.header( "Accept-Ranges", "bytes" )
				.build();
	}

	@GET
	@Path("video/{id}/download")
  @Produces("video/mp4")
	public Response getVideoFile(@Context HttpHeaders headers,
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

		if ( mediumFileStatus(id, "video").compareTo("noFile") == 0 ) return Response.status(Status.NOT_FOUND).build();

		if ( mediumFileStatus(id, "video").compareTo("waiting") == 0 || mediumFileStatus(id, "video").compareTo("transcoding") == 0 )
			return downloadFile(TIMAATApp.timaatProps.getProp(PropertyConstants.STORAGE_LOCATION)
				+ "medium/video/" + id + "-video-original.mp4", headers);

		return downloadFile(TIMAATApp.timaatProps.getProp(PropertyConstants.STORAGE_LOCATION)
			+ "medium/video/" + id + "/" + id + "-video.mp4", headers);
	}

	@GET
	@Path("{type}/{id}/status")
	@Produces(javax.ws.rs.core.MediaType.TEXT_PLAIN)
	@Secured
	public Response updateFileStatus(@PathParam("type") String type,
																	 @PathParam("id") int id) {
		File mediumDir = new File(TIMAATApp.timaatProps.getProp(PropertyConstants.STORAGE_LOCATION)
			+ "medium/" + type + "/" + id);
		// if ( !videoDir.exists() ) return Response.status(Status.NOT_FOUND).build(); // save DB lookup
    	
		return Response.ok().entity(mediumFileStatus(id, type)).build();
	}

	@GET
	@Path("video/{id}/audio/combined")
	@Produces("image/png")
	public Response getVideoAudioWaveform(
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

			// load audio waveform image from storage
			File thumbnail = new File(TIMAATApp.timaatProps.getProp(PropertyConstants.STORAGE_LOCATION)
				+ "medium/video/" + id + "/" + id + "-audio-all.png");
			if ( !thumbnail.exists() ) {
				// try to create waveform
				createAudioWaveform(id, TIMAATApp.timaatProps.getProp(PropertyConstants.STORAGE_LOCATION)
					+ "medium/video/" + id + "-video-original.mp4");
				thumbnail = new File(TIMAATApp.timaatProps.getProp(PropertyConstants.STORAGE_LOCATION)
					+ "medium/video/" + id + "/" + id + "-audio-all.png");
			}
			if ( !thumbnail.exists() || !thumbnail.canRead() ) thumbnail = new File(servletContext.getRealPath("img/audio-placeholder.png"));
		    	
			return Response.ok().entity(thumbnail).build();
	}
	
	@GET
	@Path("image/{id}/preview")
	@Produces("image/png")
	public Response getImagePreview(@PathParam("id") int id,
																	@QueryParam("token") String fileToken){
		// verify token
		if (fileToken == null) {
			return Response.status(401).build();
		}
		int tokenMediumId = 0;
		try {
			tokenMediumId = validateFileToken(fileToken);
		} catch (Exception e) {
			return Response.status(401).build();
		}
		if (tokenMediumId != id) {
			return Response.status(401).build();
		}

		File image = new File(TIMAATApp.timaatProps.getProp(PropertyConstants.STORAGE_LOCATION)
			+ "medium/image/" + id + "/" + id + "-image-scaled.png");
		if ( !image.exists() || !image.canRead() ) image = new File(servletContext.getRealPath("img/image-placeholder.png"));

		return Response.ok().entity(image).build();
	}

	@GET
	@Path("image/{id}/thumbnail")
	@Produces("image/png")
	public Response getImageThumbnail(@PathParam("id") int id,
																	@QueryParam("token") String fileToken){
		// verify token
		if (fileToken == null) {
			return Response.status(401).build();
		}
		int tokenMediumId = 0;
		try {
			tokenMediumId = validateFileToken(fileToken);
		} catch (Exception e) {
			return Response.status(401).build();
		}
		if (tokenMediumId != id) {
			return Response.status(401).build();
		}

		File image = new File(TIMAATApp.timaatProps.getProp(PropertyConstants.STORAGE_LOCATION)
			+ "medium/image/" + id + "/" + id + "-image-thumb.png");
		if ( !image.exists() || !image.canRead() ) image = new File(servletContext.getRealPath("img/image-placeholder.png"));

		return Response.ok().entity(image).build();
	}

	@GET
	@Path("video/{id}/thumbnail")
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
/*
			File videoDir = new File(TIMAATApp.timaatProps.getProp(PropertyConstants.STORAGE_LOCATION)+ "medium/video/" +id);
			if ( !videoDir.exists() ) return Response.status(Status.NOT_FOUND).build(); // save DB lookup
 */
			File thumbnail = new File(TIMAATApp.timaatProps.getProp(PropertyConstants.STORAGE_LOCATION)
				+ "medium/video/" + id + "/" + id + "-thumb.png");
			if ( !thumbnail.exists() || !thumbnail.canRead() ) thumbnail = new File(servletContext.getRealPath("img/preview-placeholder.png"));
		    	
			return Response.ok().entity(thumbnail).build();
		} else {
			// load timecode thumbnail from storage
/*
			File frameDir = new File(TIMAATApp.timaatProps.getProp(PropertyConstants.STORAGE_LOCATION)+ "medium/video/" +id+"/frames");
			if ( !frameDir.exists() ) return Response.status(Status.NOT_FOUND).build(); // save DB lookup
*/
   	
			File thumbnail = new File(TIMAATApp.timaatProps.getProp(PropertyConstants.STORAGE_LOCATION)
				+ "medium/video/" + id + "/frames/" + id + "-frame-" + String.format("%05d", seks) + ".jpg");
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
	
	public static String mediumFileStatus(int id, String type) {
		File mediumDir = new File(TIMAATApp.timaatProps.getProp(PropertyConstants.STORAGE_LOCATION)	+ "medium/" + type + "/" + id);
		// System.out.println("mediumDir: " + mediumDir);
		String fileStatus = "noFile";
		if ( !mediumDir.exists() ) {
			return fileStatus;
		}

		String fileExtension = ""; // TODO determine correct file type
		if (type.equalsIgnoreCase("video")) fileExtension = "mp4";
		if (type.equalsIgnoreCase("image")) fileExtension = "png";

		switch (type) {
			case "image":
			if ( new File(mediumDir + "-" + type + "-original." + fileExtension ).exists() ) fileStatus = "uploaded";
			if ( new File(mediumDir + "/" + id + "-" + type + "-thumb." + fileExtension ).exists() ) fileStatus = "thumbCreated";
			if ( new File(mediumDir + "/" + id + "-" + type + "-scaled." + fileExtension ).exists() ) fileStatus = "ready";
		break;
			case "video":
				if ( new File(mediumDir + "-" + type + "-original." + fileExtension ).exists() ) fileStatus = "waiting";
				if ( new File(mediumDir + "/" + id + "-" + type + "." + fileExtension ).exists() ) fileStatus = "ready";
				if ( new File(mediumDir + "/" + id + "-transcoding.pid" ).exists() ) fileStatus = "transcoding";
			break;
		}

		// TODO implement status "unavailable"
		// System.out.println("mediumFileStatus end - id: "+ id + ", type: "+ type + ", fileStatus: " + fileStatus);

		return fileStatus;
	}

	private ImageInformation getImageFileInfo(File imgFile) throws IOException {
		int pos = imgFile.getName().lastIndexOf(".");
		if (pos == -1)
			throw new IOException("No extension for file: " + imgFile.getAbsolutePath());
		String suffix = imgFile.getName().substring(pos + 1);
		ImageInformation imageInfo = new ImageInformation(0, 0, "0", "");
		Iterator<ImageReader> iter = ImageIO.getImageReadersBySuffix(suffix);
		while(iter.hasNext()) {
			ImageReader reader = iter.next();
			try {
				ImageInputStream stream = new FileImageInputStream(imgFile);
				reader.setInput(stream);
				int width = reader.getWidth(reader.getMinIndex());
				int height = reader.getHeight(reader.getMinIndex());
				// IIOMetadata metadata = reader.getImageMetadata(0);
				// if (metadata.isStandardMetadataFormatSupported()) { // true for all bundled formats
				// IIOMetadataNode bitDepth = (IIOMetadataNode) metadata.getAsTree("javax_imageio_1.0")
				// 	.getElementsByTagName('Data').item(0)
				// 	.get_elements_by_tag_name('BitsPerSample').item(0)
				// 	.getAttribute('value');
				imageInfo.setWidth(width);
				imageInfo.setHeight(height);
				stream.flush();
				stream.close();
				// imageInfo.setBitDepth(bitDepth);
				return imageInfo;
			} catch (IOException e) {
				System.out.println("Error reading: " + imgFile.getAbsolutePath() + e);
			} finally {
				reader.dispose();
			}
		}	
		throw new IOException("Not a known image file: " + imgFile.getAbsolutePath());
		// Runtime r = Runtime.getRuntime();
		// Process p;     // Process tracks one external native process
		// BufferedReader is;  // reader for output of process
		// String line;
		
		// String[] commandLine = { TIMAATApp.timaatProps.getProp(PropertyConstants.FFMPEG_LOCATION)+"ffprobe"+TIMAATApp.systemExt,
		// "-v", "error", "-select_streams", "v:0",
		// "-show_entries", "stream=width,height,r_frame_rate,codec_name",
		// "-show_entries", "format=duration",
		// "-of", "json", filename };
		// ImageInformation imageInfo = new ImageInformation("0", "0", "0", "");

		// try {
		// 	p = r.exec(commandLine);
		// 	is = new BufferedReader(new InputStreamReader(p.getInputStream()));

		// 	try {
		// 		p.waitFor();  // wait for process to complete
		// 	} catch (InterruptedException e) {
		// 		System.err.println(e);  // "can't happen"
		// 	}

		// 	String jsonString = "";
		// 	while ((line = is.readLine()) != null) if ( line != null ) jsonString += line;

		// 	JSONObject json = new JSONObject(jsonString);
		// 	System.out.println("jsonString "+ jsonString);
		// 	imageInfo.setWidth(json.getJSONArray("streams").getJSONObject(0).getString("width"));
		// 	imageInfo.setHeight(json.getJSONArray("streams").getJSONObject(0).getString("height"));
		// 	imageInfo.setbitDepth(json.getJSONArray("streams").getJSONObject(0).getString("bitDepth"));
		// 	imageInfo.setFileExtension(json.getJSONArray("streams").getJSONObject(0).getString("fileExtension"));


		// } catch (IOException e1) {
		// 	// TODO Auto-generated catch block
		// 	e1.printStackTrace();
		// }

		// return imageInfo;
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
	    VideoInformation videoInfo = new VideoInformation(0, 0, 25, 0, "");

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
	    	videoInfo.setWidth(json.getJSONArray("streams").getJSONObject(0).getInt("width"));
	    	videoInfo.setHeight(json.getJSONArray("streams").getJSONObject(0).getInt("height"));
	    	videoInfo.setFramerate(framerate);
	    	videoInfo.setDuration(Float.parseFloat(json.getJSONObject("format").getString("duration")));
	    	videoInfo.setCodec(json.getJSONArray("streams").getJSONObject(0).getString("codec_name"));


	    } catch (IOException e1) {
	    	// TODO Auto-generated catch block
	    	e1.printStackTrace();
	    }

	    return videoInfo;
	}
	
	private BufferedImage resizeImage(BufferedImage originalImage, int targetWidth, int targetHeight) throws IOException
	{
		BufferedImage resizedImage = new BufferedImage(targetWidth, targetHeight, BufferedImage.TYPE_INT_RGB);
		Graphics2D graphics2D = resizedImage.createGraphics();
		graphics2D.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
		graphics2D.drawImage(originalImage, 0, 0, targetWidth, targetHeight, null);
		graphics2D.dispose();
		return resizedImage;
	}
	
	private void createVideoThumbnails(int id, String filename) {
		File videoDir = new File(TIMAATApp.timaatProps.getProp(PropertyConstants.STORAGE_LOCATION)
			+ "medium/video/" + id);
		if ( !videoDir.exists() ) videoDir.mkdirs();

		Runtime r = Runtime.getRuntime();
	    Process p;     // Process tracks one external native process
	    
	    String[] commandLine = { TIMAATApp.timaatProps.getProp(PropertyConstants.FFMPEG_LOCATION)+"ffmpeg"+TIMAATApp.systemExt,
	    "-i", filename,
	    "-ss", "00:00:01.000", // timecode of thumbnail
	    "-vframes", "1", "-y", 
			TIMAATApp.timaatProps.getProp(PropertyConstants.STORAGE_LOCATION)
				+ "medium/video/" + id + "/" + id + "-thumb.png" };

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

	private void createAudioWaveform(int id, String filename) {
		File videoDir = new File(TIMAATApp.timaatProps.getProp(PropertyConstants.STORAGE_LOCATION)
			+ "medium/video/" + id);
		if ( !videoDir.exists() ) videoDir.mkdirs();

		Runtime r = Runtime.getRuntime();
	    Process p;     // Process tracks one external native process
	    
	    String[] commandLine = { TIMAATApp.timaatProps.getProp(PropertyConstants.FFMPEG_LOCATION)+"ffmpeg"+TIMAATApp.systemExt,
	    "-i", filename,
	    "-filter_complex", "aformat=channel_layouts=mono,showwavespic=s=5000x300:colors=395C8D", // waveform settings
	    "-frames:v", "1", "-y", 
			TIMAATApp.timaatProps.getProp(PropertyConstants.STORAGE_LOCATION)
				+ "medium/video/" + id + "/" + id + "-audio-all.png" };

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

	public static String issueFileToken(int mediumID) {
		// System.out.println("issueFileToken for id "+ mediumID);
		Key key = TIMAATKeyGenerator.generateKey();
		String token = Jwts.builder().claim("file", mediumID).setIssuer(
			TIMAATApp.timaatProps.getProp(PropertyConstants.SERVER_NAME))
			.setIssuedAt(new Date())
			.setExpiration(AuthenticationEndpoint.toDate(LocalDateTime.now().plusHours(8L)))
			.signWith(key, SignatureAlgorithm.HS512).compact();
		return token;
	}

	public static int validateFileToken(String token) throws Exception {
			// Check if the token was issued by the server and if it's not expired
			// Throw an Exception if the token is invalid

		Key key = TIMAATKeyGenerator.generateKey();
		int mediumID = Jwts.parser().setSigningKey(key).parseClaimsJws(token).getBody().get("file", Integer.class);
	
	return mediumID;
	}

	public static <T> List<T> castList(Class<? extends T> clazz, Collection<?> c) {
		List<T> r = new ArrayList<T>(c.size());
		for(Object o: c)
			r.add(clazz.cast(o));
		return r;
    }
	
}
