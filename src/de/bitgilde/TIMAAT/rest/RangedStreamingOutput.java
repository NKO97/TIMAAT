package de.bitgilde.TIMAAT.rest;

import java.io.File;
import java.io.IOException;
import java.io.OutputStream;
import java.io.RandomAccessFile;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.StreamingOutput;

/**
*
* @author Jens-Martin Loebel <loebel@bitgilde.de>
*/
public class RangedStreamingOutput implements StreamingOutput {

	private File file;
	private int from, to;

	public RangedStreamingOutput(int from, int to, File file) {
		this.from = from;
		this.to = to;
		this.file = file;
	}

	@Override
	public void write(OutputStream output) throws IOException, WebApplicationException {
		// check for ranged output of file
		RandomAccessFile rangedFile = null;
		try {
			rangedFile = new RandomAccessFile(file, "r");
			rangedFile.seek(from);
			byte[] bytes = new byte[1048576]; // new byte[to-from+1];	    				  
			int count = to-from+1;

			while ( count > 0 ) {
				int toWrite = Math.min(count, 1048576);
				toWrite = rangedFile.read(bytes, 0, toWrite);
				output.write(bytes);

				if ( toWrite < 0 ) break;
				count -= toWrite;
				output.flush();
			}
			output.close();
			rangedFile.close();
		} catch (org.apache.catalina.connector.ClientAbortException e) {
			System.out.println("Client aborted media stream: "+file.getName());
			if ( rangedFile != null ) rangedFile.close();

		} catch (IOException e) {
			e.printStackTrace();
		}	          
	}
}
