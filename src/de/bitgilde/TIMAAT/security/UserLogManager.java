package de.bitgilde.TIMAAT.security;

import java.sql.Timestamp;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.EntityTransaction;

import de.bitgilde.TIMAAT.TIMAATApp;
import de.bitgilde.TIMAAT.model.FIPOP.UserAccount;
import de.bitgilde.TIMAAT.model.FIPOP.UserLog;
import de.bitgilde.TIMAAT.model.FIPOP.UserLogEventType;

/**
*
* @author Jens-Martin Loebel <loebel@bitgilde.de>
*/
public class UserLogManager {

	public static enum LogEvents {
	    NONE(0),
	    LOGIN(1),
	    LOGOUT(2),
	    TIMEOUT(3),
	    USERCREATED(4),
	    USERSUSPENDED(5),
	    USERDELETED(6),
	    USERACTIVATED(7),
	    MEDIUMCREATED(8),
	    MEDIUMEDITED(9),
	    MEDIUMDELETED(10),
	    ANALYSISLISTCREATED(11),
	    ANALYSISLISTEDITED(12),
	    ANALYSISLISTDELETED(13),
	    ANNOTATIONCREATED(14),
	    ANNOTATIONEDITED(15),
	    ANNOTATIONDELETED(16),
	    TAGSETCREATED(17),
	    TAGSETEDITED(18),
	    TAGSETDELETED(19),
	    ANALYSISSEGMENTCREATED(20),
	    ANALYSISSEGMENTMODIFIED(21),
			ANALYSISSEGMENTDELETED(22),
			EVENTCREATED(23),
			EVENTEDITED(24),
			EVENTDELETED(25);
		

	    private final int value;
		
	    private LogEvents(int value) {
	        this.value = value;
	    }

	    public int getValue() {
	        return value;
	    }
	}
	
	// ------------------------------------------------------------------------------------------
	
	public static UserLogManager getLogger() {
		return new UserLogManager();
	}
	
	@SuppressWarnings("unchecked")
	public List<UserLog> getLogForUser(int id, int limit) {
		
		List<UserLog> log = null;
    	
    	
    	
    	limit = Math.abs(limit);
    	limit = Math.min(20, Math.max(1, limit)); // TODO refactor
    	
    	limit = 12; // TODO implement

    	log = (List<UserLog>) TIMAATApp.emf.createEntityManager()
				.createQuery("SELECT ul FROM UserLog ul WHERE ul.userAccount.id=:id ORDER BY ul.dateTime DESC")
				.setParameter("id", id)
				.setMaxResults(limit)
				.getResultList();
				
		return log;		
	}

	public void addLogEntry(int userID, LogEvents type) {
    	
    	EntityManager em = TIMAATApp.emf.createEntityManager();
    	try {
            EntityTransaction tx = em.getTransaction();
    		tx.begin();
    		UserLog log = new UserLog();
    		log.setDateTime(new Timestamp(System.currentTimeMillis()));
    		log.setUserAccount(em.find(UserAccount.class, userID));
    		log.setUserLogEventType(em.find(UserLogEventType.class, type.getValue()));    		
    		em.persist(log);
    		em.flush();
    		tx.commit();
    	} catch (Exception e) {
    		System.out.println("TIMAAT::ERROR:Logging to DB failed! - "+userID+" - "+type);
    		e.printStackTrace();
    		// TODO implement error handling of log
    	}
	}
	
}
