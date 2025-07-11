package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import java.util.Objects;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Transient;

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
 * The persistent class for the province database table.
 *
 * @author Jens-Martin Loebel <loebel@bitgilde.de>
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Entity
@NamedQuery(name="Publication.findAll", query="SELECT p FROM Publication p")
public class Publication implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	@ManyToOne
	@JoinColumn(name="owner_user_account_id")
	@JsonIgnore
	private UserAccount owner;

	@Transient
	private Integer ownerId;

	@Column(nullable = false, length = 512)
	private String slug;

	@Column(nullable = false, length = 4096)
	private String title;

	@OneToOne
	@JsonIgnore
	@JoinColumn(name="medium_analysis_list_id", nullable = true)
	private MediumAnalysisList mediumAnalysisList;

	@Transient
	@JsonProperty("mediumAnalysisListId")
	private Integer mediumAnalysisListId;

	@OneToOne
	@JoinColumn(name="media_collection_analysis_list_id", nullable = true)
	private MediaCollectionAnalysisList mediaCollectionAnalysisList;

	@Transient
	@JsonProperty("mediaCollectionAnalysisListId")
	private Integer mediaCollectionAnalysisListId;

	@Column(name = "access", nullable = false, length = 64)
	private String access;

	@Column(name = "credentials", nullable = false, length = 2048)
	private String credentials;

	@Column(name = "settings", nullable = true, length = 65535)
	private String settings;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public UserAccount getOwner() {
		return owner;
	}

	public void setOwner(UserAccount owner) {
		this.owner = owner;
	}

	public Integer getOwnerId() {
		if ( this.owner != null ) return this.owner.getId();
		return this.ownerId;
	}

	public void setOwnerId(Integer ownerId) {
		this.ownerId = ownerId;
	}

	public String getSlug() {
		return slug;
	}

	public void setSlug(String slug) {
		this.slug = slug;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public MediumAnalysisList getMediumAnalysisList() {
		return mediumAnalysisList;
	}

	public int getMediumAnalysisListId() {
		if (Objects.isNull(this.mediumAnalysisList)) return 0;
		return this.mediumAnalysisList.getId();
	}

	public void setMediumAnalysisList(MediumAnalysisList mediumAnalysisList) {
		this.mediumAnalysisList = mediumAnalysisList;
	}

	public MediaCollectionAnalysisList getMediaCollectionAnalysisList() {
		return mediaCollectionAnalysisList;
	}

	public int getMediaCollectionAnalysisListId() {
		if (Objects.isNull(this.mediaCollectionAnalysisList)) return 0;
		return this.mediaCollectionAnalysisList.getId();
	}

	public void setMediaCollectionAnalysisList(MediaCollectionAnalysisList mediaCollectionAnalysisList) {
		this.mediaCollectionAnalysisList = mediaCollectionAnalysisList;
	}

	public String getAccess() {
		return access;
	}

	public void setAccess(String access) {
		this.access = access;
	}

	public String getCredentials() {
		return credentials;
	}

	public void setCredentials(String credentials) {
		this.credentials = credentials;
	}

	public String getSettings() {
		return settings;
	}

	public void setSettings(String settings) {
		this.settings = settings;
	}


}
