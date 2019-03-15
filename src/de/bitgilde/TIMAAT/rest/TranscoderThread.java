package de.bitgilde.TIMAAT.rest;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;

/**
 *
 * @author Jens-Martin Loebel <loebel@bitgilde.de>
 */
public class TranscoderThread extends Thread {

	private int id;
	private String filename;

	public TranscoderThread(int id, String filename) {
		this.id = id;
		this.filename = filename;
	}

	public void run(){
		Process p;

		File videoDir = new File("/opt/TIMAAT/files/"+id); // TODO load storage dir from config
		if ( !videoDir.exists() ) videoDir.mkdirs();
		
		String[] commandLine = { "/usr/local/bin/ffmpeg", // TODO get from config
		"-i", filename, "-c:v", "libx264",
		"-crf", "23", // transcoded quality setting
		"-c:a", "aac", "-movflags", "faststart", "-movflags", "rtphint", "-y",
		"/opt/TIMAAT/files/"+id+"/"+id+"-video-transcoding.mp4" };
		ProcessBuilder pb = new ProcessBuilder(commandLine);
//		pb.inheritIO();


		try {
			p = pb.start();
			BufferedReader is = new BufferedReader(new InputStreamReader(p.getErrorStream()));

			try {
				while ( p.isAlive() ) {
					sleep(500);
					String line = is.readLine();
					if ( line != null && line.startsWith("frame") ) System.out.println(id+": Transcoding "+line);
				}
				
			} catch (InterruptedException e) {
				System.err.println(e);  // "can't happen"
			}

			File transcodedVideo = new File("/opt/TIMAAT/files/"+id+"/"+id+"-video-transcoding.mp4");
			
			if ( !transcodedVideo.exists() || !transcodedVideo.canRead() ) {
				// TODO handle transcoding error
			} else if ( transcodedVideo.length() == 0 ) {
				transcodedVideo.delete();
			} else transcodedVideo.renameTo(new File("/opt/TIMAAT/files/"+id+"/"+id+"-video.mp4"));
			

		} catch (IOException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
	}
}
