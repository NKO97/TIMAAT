package de.bitgilde.TIMAAT.rest.endpoint;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityTransaction;
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
import jakarta.ws.rs.core.UriInfo;
import jakarta.ws.rs.core.Response.Status;

import org.jvnet.hk2.annotations.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

import de.bitgilde.TIMAAT.SelectElement;
import de.bitgilde.TIMAAT.TIMAATApp;
import de.bitgilde.TIMAAT.model.DataTableInfo;
import de.bitgilde.TIMAAT.model.FIPOP.Language;
import de.bitgilde.TIMAAT.rest.Secured;
import de.bitgilde.TIMAAT.security.UserLogManager;


@Service
@Path("/language")
public class EndpointLanguage {
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
	public Response getLanguageList(@QueryParam("draw") Integer draw,
                                  @QueryParam("start") Integer start,
                                  @QueryParam("length") Integer length,
                                  @QueryParam("orderby") String orderby,
                                  @QueryParam("dir") String direction,
                                  @QueryParam("search") String search,
                                  @QueryParam("language") String languageCode)
	{
		// System.out.println("EndpointLanguage: getLanguageList: draw: "+draw+" start: "+start+" length: "+length+" orderby: "+orderby+" dir: "+direction+" search: "+search);
		if ( draw == null ) draw = 0;
		
		if ( languageCode == null) languageCode = "default"; // as long as multi-language is not implemented yet, use the 'default' language entry
		// String languageQuery = "SELECT l.name FROM Language l"; //  WHERE l.id = (SELECT l.id FROM Language l WHERE l.code = '"+languageCode+"')";
		// String languageQuery = "SELECT rt.name FROM Language rt WHERE rt.Language.id = r.id AND rt.language.id = (SELECT l.id FROM Language l WHERE l.code = '"+languageCode+"')";
		// String languageQuery2 = "SELECT rt.name WHERE rt.Language.id = r.id AND rt.language.id = (SELECT l.id from Language l WHERE l.code = '"+languageCode+"')";
		
		// sanitize user input
		if ( direction != null && direction.equalsIgnoreCase("desc") ) direction = "DESC"; else direction = "ASC";
		String column = "l.id";
		if ( orderby != null) {
			if (orderby.equalsIgnoreCase("name")) column = "l.name";
		}

		// calculate total # of records
		Query countQuery = TIMAATApp.emf.createEntityManager().createQuery("SELECT COUNT(l) FROM Language l");
		long recordsTotal = (long) countQuery.getSingleResult();
		long recordsFiltered = recordsTotal;

		// search
		Query query;
		if (search != null && search.length() > 0 ) {
			// calculate search result # of records
			countQuery = TIMAATApp.emf.createEntityManager().createQuery(
				"SELECT COUNT(l) FROM Language l WHERE lower(l.name) LIKE lower(concat('%', :name,'%'))");
			countQuery.setParameter("name", search);
			recordsFiltered = (long) countQuery.getSingleResult();
			// perform search
			query = TIMAATApp.emf.createEntityManager().createQuery(
				"SELECT l FROM Language l WHERE lower(l.name) LIKE lower(concat('%', :name,'%')) ORDER BY "+column+" "+direction);
			query.setParameter("name", search);
		} else {
			query = TIMAATApp.emf.createEntityManager().createQuery(
				// "SELECT r FROM Language r ORDER BY "+column+" "+direction);
				"SELECT l FROM Language l ORDER BY "+column+" "+direction);
		}	
		if ( start != null && start > 0 ) query.setFirstResult(start);
		if ( length != null && length > 0 ) query.setMaxResults(length);

		List<Language> languageList = castList(Language.class, query.getResultList());
		
		return Response.ok().entity(new DataTableInfo(draw, recordsTotal, recordsFiltered, languageList)).build();
  }

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("selectList")
	public Response getLanguageSelectList(@QueryParam("search") String search,
                                        @QueryParam("page") Integer page,
                                        @QueryParam("per_page") Integer per_page,
                                        @QueryParam("language") String languageCode) {
		// returns list of id and name combinations of all Languages
		// System.out.println("EndpointLanguage: getLanguageSelectList");
		// System.out.println("EndpointLanguage: getLanguageSelectList - search string: "+ search);

		if ( languageCode == null) languageCode = "default"; // as long as multi-language is not implemented yet, use the 'default' language entry

		// search
		Query query;
		if (search != null && search.length() > 0) {
			System.out.println("EndpointLanguage: getLanguageSelectList - with search string");
			query = TIMAATApp.emf.createEntityManager().createQuery(
				// "SELECT rt FROM Language rt WHERE rt.language.id = (SELECT l.id FROM Language l WHERE l.code = '"+languageCode+"') AND lower(rt.name) LIKE lower(concat('%', :name,'%')) ORDER BY rt.name ASC");
				"SELECT l FROM Language l WHERE lower(l.name) LIKE lower(concat('%', :name,'%')) ORDER BY l.name ASC");
				query.setParameter("name", search);
		} else {
			System.out.println("EndpointLanguage: getLanguageSelectList - no search string");
			query = TIMAATApp.emf.createEntityManager().createQuery(
				// "SELECT rt FROM Language rt WHERE rt.language.id = (SELECT l.id FROM Language l WHERE l.code = '"+languageCode+"') ORDER BY rt.name ASC");
				"SELECT l FROM Language l ORDER BY l.name ASC");
		}
		List<SelectElement> languageSelectList = new ArrayList<>();
		List<Language> languageList = castList(Language.class, query.getResultList());
		for (Language language : languageList) {
			languageSelectList.add(new SelectElement(language.getId(),
																					 		 language.getName()));
			// System.out.println("language select list entry - id: "+ language.getId() + " type: " + language.getName());
		}
		return Response.ok().entity(languageSelectList).build();
	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Secured
	@Path("{id}")
	public Response getLanguage(@PathParam("id") Integer id) {
		System.out.println("EndpointLanguage: getLanguage with id "+ id);
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Language language = entityManager.find(Language.class, id);

		return Response.ok().entity(language).build();
  }

	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("{id}")
	@Secured
	public Response createLanguage(@PathParam("id") int id,
																 String jsonData) {
		System.out.println("EndpointLanguage: createLanguage: " + jsonData);

		ObjectMapper mapper = new ObjectMapper();
		Language newLanguage = null;
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();

		// parse JSON data
		try {
			newLanguage = mapper.readValue(jsonData, Language.class);
		} catch (IOException e) {
			System.out.println("EndpointLanguage: createLanguage: IOException");
			e.printStackTrace();
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( newLanguage == null ) {
			System.out.println("EndpointLanguage: createLanguage: newLanguage == null");
			return Response.status(Status.BAD_REQUEST).build();
		}

		newLanguage.setId(0);

		System.out.println("EndpointLanguage: createLanguage - persist Language");
		// persist Language
		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.persist(newLanguage);
		entityManager.flush();
		entityTransaction.commit();
		entityManager.refresh(newLanguage);

		// add log entry
		UserLogManager.getLogger()
									.addLogEntry((int) containerRequestContext
									.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.LANGUAGECREATED);
		System.out.println("EndpointLanguage: createLanguage - done");
		return Response.ok().entity(newLanguage).build();
	}

  @PATCH
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("{id}")
	@Secured
	public Response updateLanguage(@PathParam("id") int id,
																				String jsonData) {																					
		System.out.println("EndpointLanguage: update translation - jsonData: " + jsonData);

		ObjectMapper mapper = new ObjectMapper();
		Language updatedLanguage = null;    	
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Language Language = entityManager.find(Language.class, id);

		if ( Language == null ) {
			return Response.status(Status.NOT_FOUND).build();
		}
		// System.out.println("EndpointLanguage: update translation - old translation :"+translation.getName());
		// parse JSON data
		try {
			updatedLanguage = mapper.readValue(jsonData, Language.class);
		} catch (IOException e) {
			System.out.println("EndpointLanguage: update translation: IOException e!");
			e.printStackTrace();
			return Response.status(Status.BAD_REQUEST).build();
		}
		if ( updatedLanguage == null ) {
			return Response.notModified().build();
		}

		// update translation
		System.out.println("EndpointLanguage: update translation - language id: " + updatedLanguage.getId());	
		if ( updatedLanguage.getName() != null ) Language.setName(updatedLanguage.getName());
		if ( updatedLanguage.getCode() != null ) Language.setCode(updatedLanguage.getCode());

		System.out.println("EndpointLanguage: update translation - start transaction");	
		EntityTransaction entityTransaction = entityManager.getTransaction();
		// update Language translation
		entityTransaction.begin();
		entityManager.merge(Language);
		entityManager.persist(Language);
		entityTransaction.commit();
		entityManager.refresh(Language);

		System.out.println("EndpointLanguage: update translation - only logging remains");	
		// add log entry
		UserLogManager.getLogger()
									.addLogEntry((int) containerRequestContext
									.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.LANGUAGEEDITED);
		System.out.println("EndpointLanguage: update translation - update complete");	
		return Response.ok().entity(Language).build();
	}

	@DELETE
	@Produces(MediaType.APPLICATION_JSON)
	@Path("{id}")
	@Secured
	public Response deleteLanguage(@PathParam("id") int id) {
		System.out.println("EndpointLanguage: deleteLanguage");
		EntityManager entityManager = TIMAATApp.emf.createEntityManager();
		Language Language = entityManager.find(Language.class, id);

		if ( Language == null ) return Response.status(Status.NOT_FOUND).build();

		EntityTransaction entityTransaction = entityManager.getTransaction();
		entityTransaction.begin();
		entityManager.remove(Language);
		entityTransaction.commit();
		
		// add log entry
		UserLogManager.getLogger()
									.addLogEntry((int) containerRequestContext
									.getProperty("TIMAAT.userID"), UserLogManager.LogEvents.LANGUAGEDELETED);
		System.out.println("EndpointLanguage: deleteLanguage - delete complete");	
		return Response.ok().build();
	}

	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("isDuplicateName/{id}")
	@Secured
	public Response languageCheckForDuplicateName(@PathParam ("id") int id,
																							  String name) {
		System.out.println("EndpointLanguage: languageDuplicateNameCheck - name: "+name);

		Query query = TIMAATApp.emf.createEntityManager().createQuery("SELECT COUNT(l) FROM Language l WHERE l.name = "+name+" AND l.id != "+ id);
		long count = (long) query.getSingleResult();
		boolean duplicate = false;
		if (count != 0) duplicate = true;
		System.out.println("EndpointLanguage: languageDuplicateNameCheck - done");
		return Response.ok().entity(duplicate).build();
	}

	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("isDuplicateCode/{id}")
	@Secured
	public Response languageCheckForDuplicateCode(@PathParam ("id") int id,
																								String code) {
		System.out.println("EndpointLanguage: languageDuplicateNameCheck - code: "+code);

		Query query = TIMAATApp.emf.createEntityManager().createQuery("SELECT COUNT(l) FROM Language l WHERE l.code = "+code+" AND l.id != "+ id);
		long count = (long) query.getSingleResult();
		boolean duplicate = false;
		if (count != 0) duplicate = true;
		System.out.println("EndpointLanguage: languageDuplicateCodeCheck - done");
		return Response.ok().entity(duplicate).build();
	}

  public static <T> List<T> castList(Class<? extends T> clazz, Collection<?> c) {
    List<T> r = new ArrayList<T>(c.size());
    for(Object o: c)
      r.add(clazz.cast(o));
    return r;
	}
}