package de.bitgilde.TIMAAT.model;

public class VideoInformation {
	
	private int width;
	private int height;
	private int framerate;
	private float duration;
	private String codec;

	public VideoInformation(int width, int height, int framerate, float duration, String codec) {
		this.width = width;
		this.height = height;
		this.framerate = framerate;
		this.duration = duration;
		this.codec = codec;
	}
	
	public int getWidth() {
		return width;
	}
	public void setWidth(int width) {
		this.width = width;
	}
	public int getHeight() {
		return height;
	}
	public void setHeight(int height) {
		this.height = height;
	}
	public int getFramerate() {
		return framerate;
	}
	public void setFramerate(int framerate) {
		this.framerate = framerate;
	}
	public float getDuration() {
		return duration;
	}
	public void setDuration(float duration) {
		this.duration = duration;
	}
	public String getCodec() {
		return codec;
	}
	public void setCodec(String codec) {
		this.codec = codec;
	}
}
