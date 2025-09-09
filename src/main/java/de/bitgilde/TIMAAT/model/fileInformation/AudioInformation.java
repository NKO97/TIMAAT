package de.bitgilde.TIMAAT.model.fileInformation;

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
 * Audio information automatically determined by ffmpeg when uploading a new audio file
 *
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
public class AudioInformation {

	private long duration;
	private String codec;

	public AudioInformation(long duration, String codec) {
		this.duration = duration;
		this.codec = codec;
	}

	public long getDuration() {
		return duration;
	}

	public void setDuration(long duration) {
		this.duration = duration;
	}

	public String getCodec() {
		return codec;
	}

	public void setCodec(String codec) {
		this.codec = codec;
	}

}
