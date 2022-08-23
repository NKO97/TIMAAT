package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQuery;

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
 * The persistent class for the voice database table.
 *
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Entity
@NamedQuery(name="Voice.findAll", query="SELECT v FROM Voice v")
public class Voice implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	//bi-directional many-to-many association to LineupMember
	@ManyToMany
	@JsonIgnore
	@JoinTable(
		name="lineup_member_has_voice"
		, joinColumns={
			@JoinColumn(name="voice_id")
			}
		, inverseJoinColumns={
			@JoinColumn(name="lineup_member_id")
			}
		)
	private List<LineupMember> lineupMembers;

	//bi-directional many-to-one association to VoiceType
	@ManyToOne
	@JoinColumn(name="voice_type_id")
	private VoiceType voiceType;

	public Voice() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public List<LineupMember> getLineupMembers() {
		return this.lineupMembers;
	}

	public void setLineupMembers(List<LineupMember> lineupMembers) {
		this.lineupMembers = lineupMembers;
	}

	public VoiceType getVoiceType() {
		return this.voiceType;
	}

	public void setVoiceType(VoiceType voiceType) {
		this.voiceType = voiceType;
	}

}