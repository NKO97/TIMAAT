package de.bitgilde.TIMAAT.model.publication;

import java.io.Serializable;

/**
*
* @author Jens-Martin Loebel <loebel@bitgilde.de>
*/
public class PublicationSettings implements Serializable {

	private static final long serialVersionUID = 1L;
	
	int defList = 0;
	boolean stopImage = false;
	boolean stopPolygon = false;
	boolean stopAudio = false;
	
	
	public int getDefList() {
		return defList;
	}
	
	public PublicationSettings setDefList(int defList) {
		this.defList = defList;
		return this;
	}
	
	public boolean isStopImage() {
		return stopImage;
	}
	
	public PublicationSettings setStopImage(boolean stopImage) {
		this.stopImage = stopImage;
		return this;
	}
	
	public boolean isStopPolygon() {
		return stopPolygon;
	}
	
	public PublicationSettings setStopPolygon(boolean stopPolygon) {
		this.stopPolygon = stopPolygon;
		return this;
	}
	
	public boolean isStopAudio() {
		return stopAudio;
	}
	
	public PublicationSettings setStopAudio(boolean stopAudio) {
		this.stopAudio = stopAudio;
		return this;
	}
	
	
	
	
}
