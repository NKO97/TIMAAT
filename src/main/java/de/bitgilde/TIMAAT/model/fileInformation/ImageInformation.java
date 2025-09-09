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
 * Image information automatically determined by ffmpeg when uploading a new image file
 *
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
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
