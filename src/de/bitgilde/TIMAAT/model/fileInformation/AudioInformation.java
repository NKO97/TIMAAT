package de.bitgilde.TIMAAT.model.fileInformation;

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
