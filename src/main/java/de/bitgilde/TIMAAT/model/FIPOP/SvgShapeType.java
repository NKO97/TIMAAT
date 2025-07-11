package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

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
 * The persistent class for the svg_shape_type database table.
 *
 * @author Jens-Martin Loebel <loebel@bitgilde.de>
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Entity
@Table(name="svg_shape_type")
@NamedQuery(name="SvgShapeType.findAll", query="SELECT s FROM SvgShapeType s")
public class SvgShapeType implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private int id;

	//bi-directional many-to-one association to SelectorSvg
	@OneToMany(mappedBy="svgShapeType")
	@JsonManagedReference(value = "SvgShapeType-SelectorSvg")
	private Set<SelectorSvg> selectorSvgs;

	//bi-directional many-to-one association to SvgShapeTypeTranslation
	@OneToMany(mappedBy="svgShapeType")
	private Set<SvgShapeTypeTranslation> svgShapeTypeTranslations;

	public SvgShapeType() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public Set<SelectorSvg> getSelectorSvgs() {
		return this.selectorSvgs;
	}

	public void setSelectorSvgs(Set<SelectorSvg> selectorSvgs) {
		this.selectorSvgs = selectorSvgs;
	}

	public SelectorSvg addSelectorSvg(SelectorSvg selectorSvg) {
		getSelectorSvgs().add(selectorSvg);
		selectorSvg.setSvgShapeType(this);

		return selectorSvg;
	}

	public SelectorSvg removeSelectorSvg(SelectorSvg selectorSvg) {
		getSelectorSvgs().remove(selectorSvg);
		selectorSvg.setSvgShapeType(null);

		return selectorSvg;
	}

	public Set<SvgShapeTypeTranslation> getSvgShapeTypeTranslations() {
		return this.svgShapeTypeTranslations;
	}

	public void setSvgShapeTypeTranslations(Set<SvgShapeTypeTranslation> svgShapeTypeTranslations) {
		this.svgShapeTypeTranslations = svgShapeTypeTranslations;
	}

	public SvgShapeTypeTranslation addSvgShapeTypeTranslation(SvgShapeTypeTranslation svgShapeTypeTranslation) {
		getSvgShapeTypeTranslations().add(svgShapeTypeTranslation);
		svgShapeTypeTranslation.setSvgShapeType(this);

		return svgShapeTypeTranslation;
	}

	public SvgShapeTypeTranslation removeSvgShapeTypeTranslation(SvgShapeTypeTranslation svgShapeTypeTranslation) {
		getSvgShapeTypeTranslations().remove(svgShapeTypeTranslation);
		svgShapeTypeTranslation.setSvgShapeType(null);

		return svgShapeTypeTranslation;
	}

}