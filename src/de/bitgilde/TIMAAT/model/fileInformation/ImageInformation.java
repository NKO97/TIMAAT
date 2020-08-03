package de.bitgilde.TIMAAT.model.fileInformation;

public class ImageInformation {
	
	private int width;
	private int height;
	private String bitDepth;
	private String fileExtension;

	public ImageInformation(int width, int height, String bitDepth, String fileExtension) {
		this.width = width;
		this.height = height;
		this.bitDepth = bitDepth;
		this.fileExtension = fileExtension;
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
	public String getBitDepth() {
		return bitDepth;
	}
	public void setBitDepth(String bitDepth) {
		this.bitDepth = bitDepth;
	}
	public String getFileExtension() {
		return fileExtension;
	}
	public void setFileExtension(String fileExtension) {
		this.fileExtension = fileExtension;
	}
}
