package de.bitgilde.TIMAAT.rest;

import java.io.File;
import java.io.IOException;
import java.io.OutputStream;
import java.io.RandomAccessFile;

import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.StreamingOutput;

/*
 Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
 */

/**
 * @author Jens-Martin Loebel <loebel@bitgilde.de>
 * @author Mirko Scherf <mscherf@uni-mainz.de>
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
			byte[] bytes = new byte[10240]; // new byte[to-from+1];
			int count = to-from+1;

			while ( count > 0 ) {
				int toWrite = Math.min(count, 10240);
				toWrite = rangedFile.read(bytes, 0, toWrite);
				output.write(bytes);

				if ( toWrite < 0 ) break;
				count -= toWrite;
				output.flush();
			}
			output.close();
			rangedFile.close();
		} catch (org.apache.catalina.connector.ClientAbortException e) {
//			System.out.println("Client aborted media stream: "+file.getName());
			if ( rangedFile != null ) rangedFile.close();

		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}
