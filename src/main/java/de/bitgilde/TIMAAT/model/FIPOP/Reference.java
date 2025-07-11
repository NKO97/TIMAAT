package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToMany;

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
 * The persistent class for the reference database table.
 *
 * @author Jens-Martin Loebel <loebel@bitgilde.de>
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Entity
@NamedQuery(name="Reference.findAll", query="SELECT r FROM Reference r")
public class Reference implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	@Column(name="abstract")
	private String abstract_;

	private String addendum;

	private String afterword;

	private String annotation;

	private String annotator;

	private String author;

	private String authortype;

	private String bookauthor;

	private String bookpagination;

	private String booksubtitle;

	private String booktitle;

	private String booktitleaddon;

	private String chapter;

	private String commentator;

	private String date;

	private String doi;

	private String edition;

	private String editor;

	private String editora;

	private String editoratype;

	private String editorb;

	private String editorbtype;

	private String editorc;

	private String editorctype;

	private String editortype;

	private String eid;

	private String entrysubtype;

	private String eprint;

	private String eprintclass;

	private String eprinttype;

	private String eventdate;

	private String eventtitle;

	private String eventtitleaddon;

	private String file;

	private String foreword;

	private String holder;

	private String howpublished;

	private String indextitle;

	private String institution;

	private String introduction;

	private String isan;

	private String isbn;

	private String ismn;

	private String isrn;

	private String issn;

	private String issue;

	private String issuesubtitle;

	private String issuetitle;

	private String iswc;

	private String journalsubtitle;

	private String journaltitle;

	private String label;

	private String language;

	private String library;

	private String location;

	private String mainsubstitle;

	private String maintitle;

	private String maintitleaddon;

	private String month;

	private String nameaddon;

	private String note;

	private String number;

	private String organization;

	private String origdate;

	private String origlanguage;

	private String origlocation;

	private String origpublisher;

	private String origtitle;

	private String pages;

	private String pagetotal;

	private String pagination;

	private String part;

	private String publisher;

	private String pubstate;

	private String reprinttitle;

	private String series;

	private String shortauthor;

	private String shorteditor;

	private String shorthand;

	private String shorthandintro;

	private String shortjournal;

	private String shortseries;

	private String shorttitle;

	private String subtitle;

	private String title;

	private String titleaddon;

	private String translator;

	private String type;

	private String url;

	private String urldate;

	private String venue;

	private String version;

	private String volume;

	private String volumes;

	private String year;

	//bi-directional many-to-many association to Bibliography
	@ManyToMany
	@JoinTable(
		name="bibliography_has_reference"
		, joinColumns={
			@JoinColumn(name="reference_id")
			}
		, inverseJoinColumns={
			@JoinColumn(name="bibliography_id")
			}
		)
	private List<Bibliography> bibliographies;

	//bi-directional many-to-one association to Medium
	@OneToMany(mappedBy="reference")
	@JsonManagedReference(value = "Reference-Medium")
	private List<Medium> mediums;

	//bi-directional many-to-one association to ReferenceEntryType
	@ManyToOne
	@JoinColumn(name="reference_entry_type_id")
	@JsonBackReference(value = "ReferenceEntryType-Reference")
	private ReferenceEntryType referenceEntryType;

	//bi-directional many-to-one association to ReferenceDataFieldRequirement
	@OneToMany(mappedBy="reference")
	@JsonManagedReference(value = "Reference-ReferenceDataFieldRequirement")
	private List<ReferenceDataFieldRequirement> referenceDataFieldRequirements;

	public Reference() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getAbstract_() {
		return this.abstract_;
	}

	public void setAbstract_(String abstract_) {
		this.abstract_ = abstract_;
	}

	public String getAddendum() {
		return this.addendum;
	}

	public void setAddendum(String addendum) {
		this.addendum = addendum;
	}

	public String getAfterword() {
		return this.afterword;
	}

	public void setAfterword(String afterword) {
		this.afterword = afterword;
	}

	public String getAnnotation() {
		return this.annotation;
	}

	public void setAnnotation(String annotation) {
		this.annotation = annotation;
	}

	public String getAnnotator() {
		return this.annotator;
	}

	public void setAnnotator(String annotator) {
		this.annotator = annotator;
	}

	public String getAuthor() {
		return this.author;
	}

	public void setAuthor(String author) {
		this.author = author;
	}

	public String getAuthortype() {
		return this.authortype;
	}

	public void setAuthortype(String authortype) {
		this.authortype = authortype;
	}

	public String getBookauthor() {
		return this.bookauthor;
	}

	public void setBookauthor(String bookauthor) {
		this.bookauthor = bookauthor;
	}

	public String getBookpagination() {
		return this.bookpagination;
	}

	public void setBookpagination(String bookpagination) {
		this.bookpagination = bookpagination;
	}

	public String getBooksubtitle() {
		return this.booksubtitle;
	}

	public void setBooksubtitle(String booksubtitle) {
		this.booksubtitle = booksubtitle;
	}

	public String getBooktitle() {
		return this.booktitle;
	}

	public void setBooktitle(String booktitle) {
		this.booktitle = booktitle;
	}

	public String getBooktitleaddon() {
		return this.booktitleaddon;
	}

	public void setBooktitleaddon(String booktitleaddon) {
		this.booktitleaddon = booktitleaddon;
	}

	public String getChapter() {
		return this.chapter;
	}

	public void setChapter(String chapter) {
		this.chapter = chapter;
	}

	public String getCommentator() {
		return this.commentator;
	}

	public void setCommentator(String commentator) {
		this.commentator = commentator;
	}

	public String getDate() {
		return this.date;
	}

	public void setDate(String date) {
		this.date = date;
	}

	public String getDoi() {
		return this.doi;
	}

	public void setDoi(String doi) {
		this.doi = doi;
	}

	public String getEdition() {
		return this.edition;
	}

	public void setEdition(String edition) {
		this.edition = edition;
	}

	public String getEditor() {
		return this.editor;
	}

	public void setEditor(String editor) {
		this.editor = editor;
	}

	public String getEditora() {
		return this.editora;
	}

	public void setEditora(String editora) {
		this.editora = editora;
	}

	public String getEditoratype() {
		return this.editoratype;
	}

	public void setEditoratype(String editoratype) {
		this.editoratype = editoratype;
	}

	public String getEditorb() {
		return this.editorb;
	}

	public void setEditorb(String editorb) {
		this.editorb = editorb;
	}

	public String getEditorbtype() {
		return this.editorbtype;
	}

	public void setEditorbtype(String editorbtype) {
		this.editorbtype = editorbtype;
	}

	public String getEditorc() {
		return this.editorc;
	}

	public void setEditorc(String editorc) {
		this.editorc = editorc;
	}

	public String getEditorctype() {
		return this.editorctype;
	}

	public void setEditorctype(String editorctype) {
		this.editorctype = editorctype;
	}

	public String getEditortype() {
		return this.editortype;
	}

	public void setEditortype(String editortype) {
		this.editortype = editortype;
	}

	public String getEid() {
		return this.eid;
	}

	public void setEid(String eid) {
		this.eid = eid;
	}

	public String getEntrysubtype() {
		return this.entrysubtype;
	}

	public void setEntrysubtype(String entrysubtype) {
		this.entrysubtype = entrysubtype;
	}

	public String getEprint() {
		return this.eprint;
	}

	public void setEprint(String eprint) {
		this.eprint = eprint;
	}

	public String getEprintclass() {
		return this.eprintclass;
	}

	public void setEprintclass(String eprintclass) {
		this.eprintclass = eprintclass;
	}

	public String getEprinttype() {
		return this.eprinttype;
	}

	public void setEprinttype(String eprinttype) {
		this.eprinttype = eprinttype;
	}

	public String getEventdate() {
		return this.eventdate;
	}

	public void setEventdate(String eventdate) {
		this.eventdate = eventdate;
	}

	public String getEventtitle() {
		return this.eventtitle;
	}

	public void setEventtitle(String eventtitle) {
		this.eventtitle = eventtitle;
	}

	public String getEventtitleaddon() {
		return this.eventtitleaddon;
	}

	public void setEventtitleaddon(String eventtitleaddon) {
		this.eventtitleaddon = eventtitleaddon;
	}

	public String getFile() {
		return this.file;
	}

	public void setFile(String file) {
		this.file = file;
	}

	public String getForeword() {
		return this.foreword;
	}

	public void setForeword(String foreword) {
		this.foreword = foreword;
	}

	public String getHolder() {
		return this.holder;
	}

	public void setHolder(String holder) {
		this.holder = holder;
	}

	public String getHowpublished() {
		return this.howpublished;
	}

	public void setHowpublished(String howpublished) {
		this.howpublished = howpublished;
	}

	public String getIndextitle() {
		return this.indextitle;
	}

	public void setIndextitle(String indextitle) {
		this.indextitle = indextitle;
	}

	public String getInstitution() {
		return this.institution;
	}

	public void setInstitution(String institution) {
		this.institution = institution;
	}

	public String getIntroduction() {
		return this.introduction;
	}

	public void setIntroduction(String introduction) {
		this.introduction = introduction;
	}

	public String getIsan() {
		return this.isan;
	}

	public void setIsan(String isan) {
		this.isan = isan;
	}

	public String getIsbn() {
		return this.isbn;
	}

	public void setIsbn(String isbn) {
		this.isbn = isbn;
	}

	public String getIsmn() {
		return this.ismn;
	}

	public void setIsmn(String ismn) {
		this.ismn = ismn;
	}

	public String getIsrn() {
		return this.isrn;
	}

	public void setIsrn(String isrn) {
		this.isrn = isrn;
	}

	public String getIssn() {
		return this.issn;
	}

	public void setIssn(String issn) {
		this.issn = issn;
	}

	public String getIssue() {
		return this.issue;
	}

	public void setIssue(String issue) {
		this.issue = issue;
	}

	public String getIssuesubtitle() {
		return this.issuesubtitle;
	}

	public void setIssuesubtitle(String issuesubtitle) {
		this.issuesubtitle = issuesubtitle;
	}

	public String getIssuetitle() {
		return this.issuetitle;
	}

	public void setIssuetitle(String issuetitle) {
		this.issuetitle = issuetitle;
	}

	public String getIswc() {
		return this.iswc;
	}

	public void setIswc(String iswc) {
		this.iswc = iswc;
	}

	public String getJournalsubtitle() {
		return this.journalsubtitle;
	}

	public void setJournalsubtitle(String journalsubtitle) {
		this.journalsubtitle = journalsubtitle;
	}

	public String getJournaltitle() {
		return this.journaltitle;
	}

	public void setJournaltitle(String journaltitle) {
		this.journaltitle = journaltitle;
	}

	public String getLabel() {
		return this.label;
	}

	public void setLabel(String label) {
		this.label = label;
	}

	public String getLanguage() {
		return this.language;
	}

	public void setLanguage(String language) {
		this.language = language;
	}

	public String getLibrary() {
		return this.library;
	}

	public void setLibrary(String library) {
		this.library = library;
	}

	public String getLocation() {
		return this.location;
	}

	public void setLocation(String location) {
		this.location = location;
	}

	public String getMainsubstitle() {
		return this.mainsubstitle;
	}

	public void setMainsubstitle(String mainsubstitle) {
		this.mainsubstitle = mainsubstitle;
	}

	public String getMaintitle() {
		return this.maintitle;
	}

	public void setMaintitle(String maintitle) {
		this.maintitle = maintitle;
	}

	public String getMaintitleaddon() {
		return this.maintitleaddon;
	}

	public void setMaintitleaddon(String maintitleaddon) {
		this.maintitleaddon = maintitleaddon;
	}

	public String getMonth() {
		return this.month;
	}

	public void setMonth(String month) {
		this.month = month;
	}

	public String getNameaddon() {
		return this.nameaddon;
	}

	public void setNameaddon(String nameaddon) {
		this.nameaddon = nameaddon;
	}

	public String getNote() {
		return this.note;
	}

	public void setNote(String note) {
		this.note = note;
	}

	public String getNumber() {
		return this.number;
	}

	public void setNumber(String number) {
		this.number = number;
	}

	public String getOrganization() {
		return this.organization;
	}

	public void setOrganization(String organization) {
		this.organization = organization;
	}

	public String getOrigdate() {
		return this.origdate;
	}

	public void setOrigdate(String origdate) {
		this.origdate = origdate;
	}

	public String getOriglanguage() {
		return this.origlanguage;
	}

	public void setOriglanguage(String origlanguage) {
		this.origlanguage = origlanguage;
	}

	public String getOriglocation() {
		return this.origlocation;
	}

	public void setOriglocation(String origlocation) {
		this.origlocation = origlocation;
	}

	public String getOrigpublisher() {
		return this.origpublisher;
	}

	public void setOrigpublisher(String origpublisher) {
		this.origpublisher = origpublisher;
	}

	public String getOrigtitle() {
		return this.origtitle;
	}

	public void setOrigtitle(String origtitle) {
		this.origtitle = origtitle;
	}

	public String getPages() {
		return this.pages;
	}

	public void setPages(String pages) {
		this.pages = pages;
	}

	public String getPagetotal() {
		return this.pagetotal;
	}

	public void setPagetotal(String pagetotal) {
		this.pagetotal = pagetotal;
	}

	public String getPagination() {
		return this.pagination;
	}

	public void setPagination(String pagination) {
		this.pagination = pagination;
	}

	public String getPart() {
		return this.part;
	}

	public void setPart(String part) {
		this.part = part;
	}

	public String getPublisher() {
		return this.publisher;
	}

	public void setPublisher(String publisher) {
		this.publisher = publisher;
	}

	public String getPubstate() {
		return this.pubstate;
	}

	public void setPubstate(String pubstate) {
		this.pubstate = pubstate;
	}

	public String getReprinttitle() {
		return this.reprinttitle;
	}

	public void setReprinttitle(String reprinttitle) {
		this.reprinttitle = reprinttitle;
	}

	public String getSeries() {
		return this.series;
	}

	public void setSeries(String series) {
		this.series = series;
	}

	public String getShortauthor() {
		return this.shortauthor;
	}

	public void setShortauthor(String shortauthor) {
		this.shortauthor = shortauthor;
	}

	public String getShorteditor() {
		return this.shorteditor;
	}

	public void setShorteditor(String shorteditor) {
		this.shorteditor = shorteditor;
	}

	public String getShorthand() {
		return this.shorthand;
	}

	public void setShorthand(String shorthand) {
		this.shorthand = shorthand;
	}

	public String getShorthandintro() {
		return this.shorthandintro;
	}

	public void setShorthandintro(String shorthandintro) {
		this.shorthandintro = shorthandintro;
	}

	public String getShortjournal() {
		return this.shortjournal;
	}

	public void setShortjournal(String shortjournal) {
		this.shortjournal = shortjournal;
	}

	public String getShortseries() {
		return this.shortseries;
	}

	public void setShortseries(String shortseries) {
		this.shortseries = shortseries;
	}

	public String getShorttitle() {
		return this.shorttitle;
	}

	public void setShorttitle(String shorttitle) {
		this.shorttitle = shorttitle;
	}

	public String getSubtitle() {
		return this.subtitle;
	}

	public void setSubtitle(String subtitle) {
		this.subtitle = subtitle;
	}

	public String getTitle() {
		return this.title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getTitleaddon() {
		return this.titleaddon;
	}

	public void setTitleaddon(String titleaddon) {
		this.titleaddon = titleaddon;
	}

	public String getTranslator() {
		return this.translator;
	}

	public void setTranslator(String translator) {
		this.translator = translator;
	}

	public String getType() {
		return this.type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getUrl() {
		return this.url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public String getUrldate() {
		return this.urldate;
	}

	public void setUrldate(String urldate) {
		this.urldate = urldate;
	}

	public String getVenue() {
		return this.venue;
	}

	public void setVenue(String venue) {
		this.venue = venue;
	}

	public String getVersion() {
		return this.version;
	}

	public void setVersion(String version) {
		this.version = version;
	}

	public String getVolume() {
		return this.volume;
	}

	public void setVolume(String volume) {
		this.volume = volume;
	}

	public String getVolumes() {
		return this.volumes;
	}

	public void setVolumes(String volumes) {
		this.volumes = volumes;
	}

	public String getYear() {
		return this.year;
	}

	public void setYear(String year) {
		this.year = year;
	}

	public List<Bibliography> getBibliographies() {
		return this.bibliographies;
	}

	public void setBibliographies(List<Bibliography> bibliographies) {
		this.bibliographies = bibliographies;
	}

	public List<Medium> getMediums() {
		return this.mediums;
	}

	public void setMediums(List<Medium> mediums) {
		this.mediums = mediums;
	}

	public Medium addMedium(Medium medium) {
		getMediums().add(medium);
		medium.setReference(this);

		return medium;
	}

	public Medium removeMedium(Medium medium) {
		getMediums().remove(medium);
		medium.setReference(null);

		return medium;
	}

	public ReferenceEntryType getReferenceEntryType() {
		return this.referenceEntryType;
	}

	public void setReferenceEntryType(ReferenceEntryType referenceEntryType) {
		this.referenceEntryType = referenceEntryType;
	}

	public List<ReferenceDataFieldRequirement> getReferenceDataFieldRequirements() {
		return this.referenceDataFieldRequirements;
	}

	public void setReferenceDataFieldRequirements(List<ReferenceDataFieldRequirement> referenceDataFieldRequirements) {
		this.referenceDataFieldRequirements = referenceDataFieldRequirements;
	}

	public ReferenceDataFieldRequirement addReferenceDataFieldRequirement(ReferenceDataFieldRequirement referenceDataFieldRequirement) {
		getReferenceDataFieldRequirements().add(referenceDataFieldRequirement);
		referenceDataFieldRequirement.setReference(this);

		return referenceDataFieldRequirement;
	}

	public ReferenceDataFieldRequirement removeReferenceDataFieldRequirement(ReferenceDataFieldRequirement referenceDataFieldRequirement) {
		getReferenceDataFieldRequirements().remove(referenceDataFieldRequirement);
		referenceDataFieldRequirement.setReference(null);

		return referenceDataFieldRequirement;
	}

}