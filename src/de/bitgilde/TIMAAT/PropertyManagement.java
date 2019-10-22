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

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Properties;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * This class is responsible for reading TIMAAT settings out of the system/user-specific properties file.
 * 
 * @author Jens-Martin Loebel <loebel@bitgilde.de>
 */
public class PropertyManagement {
    private static final Boolean DEBUG = true; // TODO: all debug output should be written to logger as info.
    public String propertyPath = "";
    private final String strTIMAATDir = ".timaat";
    private final Path pathTIMAATDir;
    private final Path pathDefaultTIMAATProperties;
    private final Path pathModifiedTIMAATProperties;
    private final String strTIMAATResource = "resources/timaat-default.properties";
    private final String strDefaultTIMAATProperties = "timaat.properties.example";
    private final String strModifiedTIMAATProperties = "timaat.properties";
    private final Properties props;

    public PropertyManagement() {
    	pathTIMAATDir = Paths.get(System.getProperty("user.home"), strTIMAATDir);
        pathDefaultTIMAATProperties = Paths.get(System.getProperty("user.home"), strTIMAATDir, strDefaultTIMAATProperties);
        pathModifiedTIMAATProperties = Paths.get(System.getProperty("user.home"), strTIMAATDir, strModifiedTIMAATProperties);
        props = new Properties();
        
        Boolean useDefault = true;
        
        // if TIMAAT dir does not exist, then create it.
        if( Files.notExists(pathTIMAATDir) ) {
            createTIMAATDir();
            createDefaultTIMAATProperties();
            propertyPath = pathDefaultTIMAATProperties.toString();
        } else {
            // check if properties have been defined
            if( Files.exists(pathModifiedTIMAATProperties) ){
                // load these values
                if(DEBUG) System.out.println("[TIMAAT::modified properties:"+pathModifiedTIMAATProperties+"]");
                useDefault = false;
                propertyPath = pathModifiedTIMAATProperties.toString();
            } else {
                // Paranoia check
                if( Files.notExists(pathDefaultTIMAATProperties) ) {
                    createDefaultTIMAATProperties();
                }
                // load default values (useDefault should still be true)
                if(DEBUG) System.out.println("[TIMAAT::default properties]");
            }
        }
        
        FileInputStream in = null;
        
        try {
            if( useDefault )
                in = new FileInputStream(pathDefaultTIMAATProperties.toString());   
            else
                in = new FileInputStream(pathModifiedTIMAATProperties.toString());   

            props.load(in);
            in.close();
            
        } catch (FileNotFoundException ex) {
            Logger.getLogger(PropertyManagement.class.getName()).log(Level.SEVERE, null, ex);
        } catch (IOException ex) {
            Logger.getLogger(PropertyManagement.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
    
    private void createTIMAATDir() {
        if (DEBUG) System.out.println("Creating " + strTIMAATDir);

        try {
            Files.createDirectory(pathTIMAATDir);
        } catch (IOException ex) {
            Logger.getLogger(PropertyManagement.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
    
    private void createDefaultTIMAATProperties() {
        InputStream is = PropertyManagement.class.getClassLoader().getResourceAsStream(strTIMAATResource);

        System.out.println(is);
        
        if (DEBUG) System.out.println("Creating " + strDefaultTIMAATProperties);

        try {
            Files.copy(is, pathDefaultTIMAATProperties);
        } catch (IOException ex) {
            Logger.getLogger(PropertyManagement.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    public String printProps() {
        String strReturn = "";
        for( PropertyConstants property : PropertyConstants.values() ){
            strReturn += property.key() + " = " + props.getProperty(property.key()) + "\n";
        }
        
        return strReturn;
    }
    
    public String getProp(PropertyConstants property) {
        return props.getProperty(property.key());
    }
}
