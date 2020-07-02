package de.bitgilde.TIMAAT.model.fileInformation;

public class ImageInformation {
	
	private String width;
	private String height;
	private String bitDepth;
	private String fileExtension;

	public ImageInformation(String width, String height, String bitDepth, String fileExtension) {
		this.width = width;
		this.height = height;
		this.bitDepth = bitDepth;
		this.fileExtension = fileExtension;
	}
	
	public String getWidth() {
		return width;
	}
	public void setWidth(String width) {
		this.width = width;
	}
	public String getHeight() {
		return height;
	}
	public void setHeight(String height) {
		this.height = height;
	}
	public String getBitdepth() {
		return bitDepth;
	}
	public void setbitDepth(String bitDepth) {
		this.bitDepth = bitDepth;
	}
	public String getFileExtension() {
		return fileExtension;
	}
	public void setFileExtension(String fileExtension) {
		this.fileExtension = fileExtension;
	}
}
