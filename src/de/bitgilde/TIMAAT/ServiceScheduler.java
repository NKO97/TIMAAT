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
import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

public class ServiceScheduler implements ServletContextListener {
	
    private static Thread t = null;
    private ServletContext context;
    private int mins = 1;
    
    public void contextInitialized(ServletContextEvent servletContextEvent) {
    	if ( System.getProperty("os.name").startsWith("Windows") ) TIMAATApp.systemExt=".exe";
    	else TIMAATApp.systemExt = "";

    	if ( t != null ) {
    		try {
    			t.interrupt();
    			t = null;
    		} catch (Exception e) { e.printStackTrace(); }
    	}

    	context = servletContextEvent.getServletContext();
		
		t =  new Thread() {
            public void run() {                
                try {
                    while (true) {
                    	String cronScript = context.getRealPath("/scripts/timaat-cron.sh");
                    	String encoderScript = context.getRealPath("/scripts/timaat-encoder.sh");
                		File script = new File(cronScript);
                		script.setExecutable(true);
                    	new File(encoderScript).setExecutable(true);
                		Process p;
                		String[] commandLine = {cronScript, TIMAATApp.timaatProps.propertyPath};
                		ProcessBuilder pb = new ProcessBuilder(commandLine);
                		int time = 0;
                		
                		try {
                			p = pb.start();
                			BufferedReader is = new BufferedReader(new InputStreamReader(p.getErrorStream()));

                			try {
                				while ( p.isAlive() ) {
                					String line = is.readLine();
                					if ( line != null ) System.out.println("TIMAAT::SCRIPT:"+line);
                					sleep(500);
                					time += 500;
                				}
                						
                			} catch (InterruptedException e) {
                				System.err.println(e);  // "can't happen"
                			}
                		} catch (IOException e1) {
                			e1.printStackTrace();
                		}
                		
                		int sleep = 60000 * mins; // TODO move to config
                		
                		System.out.println("TIMAAT::Scheduler:cron execution time "+time+"ms");
                		
                		if ( sleep > time ) Thread.sleep(sleep - time); 
                    }
                } catch (InterruptedException e) {}
            }            
        };
        t.setName("TIMAATCron");
        t.start();
        Logger.getGlobal().log(Level.INFO, "TIMAAT::SERVICE CRON STARTED");

        context.setAttribute("TEST", "TEST_VALUE");
	}
	
	public void contextDestroyed(ServletContextEvent contextEvent) {
        // context is destroyed interrupts the thread
        t.interrupt();
        t.stop();
        t = null;
    }

}
