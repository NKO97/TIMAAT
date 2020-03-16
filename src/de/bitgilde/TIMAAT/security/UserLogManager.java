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
	    CATEGORYSETCREATED(17),
	    CATEGORYSETEDITED(18),
	    CATEGORYSETDELETED(19),
	    ANALYSISSEGMENTCREATED(20),
	    ANALYSISSEGMENTEDITED(21),
			ANALYSISSEGMENTDELETED(22),
			EVENTCREATED(23),
			EVENTEDITED(24),
			EVENTDELETED(25),
			ACTORCREATED(26),
			ACTOREDITED(27),
			ACTORDELETED(28),
			LOCATIONCREATED(29),
			LOCATIONEDITED(30),
			LOCATIONDELETED(31),
			COUNTRYCREATED(32),
			COUNTRYEDITED(33),
			COUNTRYDELETED(34),
			VIDEOCREATED(35),
			VIDEOEDITED(36),
			VIDEODELETED(37),
			TITLECREATED(38),
			TITLEEDITED(39),
			TITLEDELETED(40),
			VIDEOGAMECREATED(41),
			VIDEOGAMEEDITED(42),
			VIDEOGAMEDELETED(43),
			AUDIOCREATED(44),
			AUDIOEDITED(45),
			AUDIODELETED(46),
			DOCUMENTCREATED(47),
			DOCUMENTEDITED(48),
			DOCUMENTDELETED(49),
			IMAGECREATED(50),
			IMAGEEDITED(51),
			IMAGEDELETED(52),
			SOFTWARECREATED(53),
			SOFTWAREEDITED(54),
			SOFTWAREDELETED(55),
			TEXTCREATED(56),
			TEXTEDITED(57),
			TEXTDELETED(58),
			PROVINCECREATED(59),
			PROVINCEEDITED(60),
			PROVINCEDELETED(61),
			COUNTYCREATED(62),
			COUNTYEDITED(63),
			COUNTYDELETED(64),
			CITYCREATED(65),
			CITYEDITED(66),
			CITYDELETED(67),
			STREETCREATED(68),
			STREETEDITED(69),
			STREETDELETED(70),
			SOURCECREATED(71),
			SOURCEEDITED(72),
			SOURCEDELETED(73),
			MEDIACOLLECTIONCREATED(74),
			MEDIACOLLECTIONEDITED(75),
			MEDIACOLLECTIONDELETED(76),
			CATEGORYCREATED(77),
			CATEGORYEDITED(78),
			CATEGORYDELETED(79),
			COLLECTIVECREATED(80),
			COLLECTIVEEDITED(81),
			COLLECTIVEDELETED(82),
			ACTORNAMECREATED(83),
			ACTORNAMEEDITED(84),
			ACTORNAMEDELETED(85),
			ADDRESSCREATED(86),
			ADDRESSEDITED(87),
			ADDRESSDELETED(88),
			EMAILCREATED(89),
			EMAILEDITED(90),
			EMAILDELETED(91),
			PHONENUMBERCREATED(92),
			PHONENUMBEREDITED(93),
			PHONENUMBERDELETED(94),
			PERSONCREATED(95),
			PERSONEDITED(96),
			PERSONDELETED(97),
			CITIZENSHIPCREATED(98),
			CITIZENSHIPEDITED(99),
			CITIZENSHIPDELETED(100),
			MEMBERSHIPCREATED(101),
			MEMBERSHIPEDITED(102),
			MEMBERSHIPDELETED(103);
		

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
