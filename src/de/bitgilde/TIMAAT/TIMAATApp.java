/*
 * Copyright 2019 bitGilde IT Solutions UG (haftungsbeschränkt)
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package de.bitgilde.TIMAAT;

import java.util.HashMap;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import javax.ws.rs.core.Application;

import org.glassfish.jersey.media.multipart.MultiPartFeature;

/**
* TIMAAT Main Application
* 
* @author Jens-Martin Loebel <loebel@bitgilde.de>
*/

@javax.ws.rs.ApplicationPath("timaatapp")
public class TIMAATApp extends Application {

    // load TIMAAT application properties
    public final static PropertyManagement timaatProps = new PropertyManagement();
    
    public static EntityManagerFactory emf;
	public static String systemExt;


    /**
     * TIMAAT Application
     * 
     * @throws java.lang.InstantiationException
     */
    public TIMAATApp() throws InstantiationException {
        super();
        Logger.getGlobal().log(Level.INFO, "[TIMAAT Application Init]");
        initEntityManager();
        
    	if ( System.getProperty("os.name").startsWith("Windows") ) systemExt=".exe";
    	else systemExt = "";
    }
    
    /**
     * Initializes TIMAAT DB persistence layer, database
     *
     * @throws InstantiationException
     */
    private void initEntityManager() throws InstantiationException {
    	Logger.getGlobal().log(Level.INFO, "[TIMAAT::Persistence Unit Init]");
        HashMap<String, String> dbProps = new HashMap<String, String>();
        dbProps.put("javax.persistence.jdbc.url", timaatProps.getProp(PropertyConstants.DATABASE_URL));
        dbProps.put("javax.persistence.jdbc.driver", timaatProps.getProp(PropertyConstants.DATABASE_DRIVER));
        dbProps.put("javax.persistence.jdbc.user", timaatProps.getProp(PropertyConstants.DATABASE_USER));
        dbProps.put("javax.persistence.jdbc.password", timaatProps.getProp(PropertyConstants.DATABASE_PASSWORD));
                
        try {
            // obtain entity manager factory with provided connection settings
            emf = Persistence.createEntityManagerFactory("FIPOP-JPA", dbProps);
            emf.createEntityManager();
        } catch (Exception e) {
            Logger.getLogger(PropertyManagement.class.getName()).log(Level.SEVERE, "TIMAAT::DB Init Error", e);
            throw new InstantiationException("TIMAAT::DB Error:Could not connect to DB. See server log for details.");
        }
    }
    
    @Override
    public Set<Class<?>> getClasses() {
        Set<Class<?>> resources = new java.util.HashSet<>();
        addRestResourceClasses(resources);
        return resources;
    }

    private void addRestResourceClasses(Set<Class<?>> resources) {
        resources.add(de.bitgilde.TIMAAT.rest.filter.AuthenticationFilter.class);
        resources.add(de.bitgilde.TIMAAT.rest.filter.CORSFilter.class);
        resources.add(de.bitgilde.TIMAAT.rest.filter.RangeResponseFilter.class);
        resources.add(MultiPartFeature.class);
        resources.add(de.bitgilde.TIMAAT.rest.AnalysislistEndpoint.class);
        resources.add(de.bitgilde.TIMAAT.rest.AnnotationEndpoint.class);
        resources.add(de.bitgilde.TIMAAT.rest.AuthenticationEndpoint.class);
        resources.add(de.bitgilde.TIMAAT.rest.MediumServiceEndpoint.class);
        resources.add(de.bitgilde.TIMAAT.rest.CategorySetEndpoint.class);
        resources.add(de.bitgilde.TIMAAT.rest.EventEndpoint.class);
        resources.add(de.bitgilde.TIMAAT.rest.LocationEndpoint.class);
        resources.add(de.bitgilde.TIMAAT.rest.TIMAATRest.class);
        resources.add(de.bitgilde.TIMAAT.rest.UserAccountEndpoint.class);
        resources.add(de.bitgilde.TIMAAT.rest.UserLogEndpoint.class);
    }

}
