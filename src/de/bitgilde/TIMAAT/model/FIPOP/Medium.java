package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

import java.util.Date;


/**
 * The persistent class for the Medium database table.
 * 
 */
@Entity
@NamedQuery(name="Medium.findAll", query="SELECT m FROM Medium m")
@JsonInclude(value=Include.NON_NULL, content=Include.NON_NULL)
@SecondaryTable(name="MediumVideo", pkJoinColumns=@PrimaryKeyJoinColumn(name="MediumID"))
public class Medium implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;
	
	@Embedded
    @AttributeOverrides({
        @AttributeOverride(name="audioCodecInformationID", column=@Column(table="MediumVideo")),
        @AttributeOverride(name="brand", column=@Column(table="MediumVideo")),
        @AttributeOverride(name="dataRate", column=@Column(table="MediumVideo")),
        @AttributeOverride(name="episodeInformationID", column=@Column(table="MediumVideo")),
        @AttributeOverride(name="frameRate", column=@Column(table="MediumVideo")),
        @AttributeOverride(name="height", column=@Column(table="MediumVideo")),
        @AttributeOverride(name="isEpisode", column=@Column(table="MediumVideo")),
        @AttributeOverride(name="length", column=@Column(table="MediumVideo")),
        @AttributeOverride(name="totalBitrate", column=@Column(table="MediumVideo")),
        @AttributeOverride(name="videoCodec", column=@Column(table="MediumVideo")),
        @AttributeOverride(name="width", column=@Column(table="MediumVideo")),
    })
    private MediumVideo mediumVideo;
	

	public MediumVideo getMediumVideo() {
		return mediumVideo;
	}

	public void setMediumVideo(MediumVideo mediumVideo) {
		this.mediumVideo = mediumVideo;
	}

	private String copyright;

	@JsonIgnore
	private String filePath;

	@ManyToOne
	@JoinColumn(name="MediaTypeID")
	private MediaType mediaType;

	private int primarySource_SourceID;

	@OneToOne
	@JoinColumn(name="primaryTitle_TitleID")
	private Title primaryTitle;

	private int propagandaTypeID;

	private int referenceID;

	@Temporal(TemporalType.DATE)
	private Date releaseDate;

	private String remark;
	
	@Transient
	private String viewToken;


	public Medium() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getCopyright() {
		return this.copyright;
	}

	public void setCopyright(String copyright) {
		this.copyright = copyright;
	}

	public String getFilePath() {
		return this.filePath;
	}

	public void setFilePath(String filePath) {
		this.filePath = filePath;
	}

	public MediaType getMediaType() {
		return this.mediaType;
	}

	public void setMediaType(MediaType mediaType) {
		this.mediaType = mediaType;
	}

	public int getPrimarySource_SourceID() {
		return this.primarySource_SourceID;
	}

	public void setPrimarySource_SourceID(int primarySource_SourceID) {
		this.primarySource_SourceID = primarySource_SourceID;
	}

	public Title getPrimaryTitle() {
		return this.primaryTitle;
	}

	public void setPrimaryTitle(Title primaryTitle) {
		this.primaryTitle = primaryTitle;
	}

	public int getPropagandaTypeID() {
		return this.propagandaTypeID;
	}

	public void setPropagandaTypeID(int propagandaTypeID) {
		this.propagandaTypeID = propagandaTypeID;
	}

	public int getReferenceID() {
		return this.referenceID;
	}

	public void setReferenceID(int referenceID) {
		this.referenceID = referenceID;
	}

	public Date getReleaseDate() {
		return this.releaseDate;
	}

	public void setReleaseDate(Date releaseDate) {
		this.releaseDate = releaseDate;
	}

	public String getRemark() {
		return this.remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}
	
	public String getViewToken() {
		return viewToken;
	}

	public void setViewToken(String viewToken) {
		this.viewToken = viewToken;
	}


}