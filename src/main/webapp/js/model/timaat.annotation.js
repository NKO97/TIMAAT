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
 * @author Jens-Martin Loebel <loebel@bitgilde.de>
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
'use strict';
(function (factory, window) {
    /*globals define, module, require*/

    // define an AMD module that relies on 'TIMAAT'
    if (typeof define === 'function' && define.amd) {
        define(['TIMAAT'], factory);


    // define a Common JS module that relies on 'TIMAAT'
    } else if (typeof exports === 'object') {
        module.exports = factory(require('TIMAAT'));
    }

    // attach your plugin to the global 'TIMAAT' variable
    if(typeof window !== 'undefined' && window.TIMAAT){
        factory(window.TIMAAT);
    }

}(function (TIMAAT) {

	TIMAAT.Annotation = class Annotation {
		constructor(model) {
			// setup model
			this._destroyed = false;
			this.active = false;
			this.selected = false;
			this._animTime = -1;
			this.model = model;
			this.svg = Object();
			this.svg.items = Array();
			this.svg.keyframes = Array();
			this.svg.strokeWidth = this.model.selectorSvgs[0].strokeWidth ? 2 : 0;
			this.svg.colorHex = this.model.selectorSvgs[0].colorHex;
			this.svg.opacity = this.model.selectorSvgs[0].opacity/100; //* DB value is stored as Byte 0..100 range is converted to 0..1 range
			this.svg.model = JSON.parse(this.model.selectorSvgs[0].svgData);
			this._upgradeModel();

			this._startTime = this.model.startTime;
			this._endTime = this.model.endTime;
			this._layerVisual = this.model.layerVisual;
			this._layerAudio = this.model.layerAudio;

			// create keyframes
			for (let keyframe of this.svg.model.keyframes) this.svg.keyframes.push(new TIMAAT.Keyframe(keyframe, this));

			this.svg.layer = L.layerGroup(null, {data:'annotationLayer', "annotation":this});

			// create and style list view element
			this.listView = $(`
				<li class="list-group-item analysis__list--li p-0">
					<div class="annotationStatusMarker annotation__status-marker">&nbsp;</div>
					<i class="analysis-list-element__icon js-analysis-list-element__icon--visual-layer fas fa-image" aria-hidden="true"></i>
					<i class="analysis-list-element__icon js-analysis-list-element__icon--audio-layer fas fa-headphones" aria-hidden="true"></i>
					<i class="analysis-list-element__icon--comment js-analysis-list-element__icon--comment fas fa-fw fa-comment" aria-hidden="true"></i>
					<span class="annotationListTime"></span>
					<span class="text-nowrap annotationListCategories pr-1 float-right text-muted"><i class=""></i></span>
					<div class="d-flex justify-content-between">
						<div class="analysis-list-element__title js-analysis-list-element__title text-muted"></div>
						<div class="text-muted timaat__user-log pr-1"><i class="fas fa-user"></i></div>
					</div>
				</li>`
			);
			if (TIMAAT.VideoPlayer.duration == 0) this.listView.find('.annotationListTime').addClass('text-muted');

			// convert SVG data
			for (let svgItem of this.svg.model.keyframes[0].shapes) {
				let item = this._parseSVG(svgItem);
				this.addSVGItem(item);
				item.dragging.disable();
			};

			this.updateUI();

			let anno = this; // save annotation for events

			$('#analysisList').append(this.listView);
			this.listView.find('.annotationListCategories').on('click', this, function(ev) {
				ev.preventDefault();
				ev.stopPropagation();
				TIMAAT.VideoPlayer.pause();
				if ( TIMAAT.VideoPlayer.curAnnotation != ev.data ) TIMAAT.VideoPlayer.selectAnnotation(ev.data);
				TIMAAT.VideoPlayer.inspector.open('inspectorCategoriesAndTags');
			});

			// attach user log info
			this.listView.find('.timaat__user-log').popover({
				placement: 'right',
				title: '<i class="fas fa-user"></i> editing log',
				trigger: 'click',
				html: true,
				content: '<div class="userLogDetails">Loading ...</div>',
				container: 'body',
				boundary: 'viewport',
			});
			this.listView.find('.timaat__user-log').on('show.bs.popover', function () {
				TIMAAT.UI.hidePopups();
			});
			this.listView.find('.timaat__user-log').on('inserted.bs.popover', function () {
				// console.log("TCL: Annotation -> constructor -> Display editing log");
				$('.userLogDetails').html(
					`<b><i class="fas fa-plus-square"></i> Created by <span class="userId" data-user-id="`+anno.model.createdByUserAccountId+'">[ID '+anno.model.createdByUserAccountId+']</span></b><br>\
						'+TIMAAT.Util.formatDate(anno.model.createdAt)+'<br>\
					<b><i class="fas fa-edit"></i> Edited by <span class="userId" data-user-id="'+anno.model.lastEditedByUserAccountId+'">[ID '+anno.model.lastEditedByUserAccountId+']</span></b><br>\
						'+TIMAAT.Util.formatDate(anno.model.lastEditedAt)+'<br>'
				);
				$('.userLogDetails').find('.userId').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "me")});
			});
			this.listView.find('.timaat__user-log').on('click', function(ev) {
				ev.preventDefault();
				ev.stopPropagation();
			});

			this.listView.find('.annotationListCategories').on('dblclick', function(ev) {ev.stopPropagation();});

			// attach event handlers
			$(this.listView).on('click', this, function(ev) {
				TIMAAT.VideoPlayer.jumpVisible(ev.data.startTime, ev.data.endTime);
				if ( TIMAAT.VideoPlayer.curAnnotation != ev.data ) TIMAAT.VideoPlayer.selectAnnotation(ev.data);
				else if (TIMAAT.VideoPlayer.curAnnotation) TIMAAT.VideoPlayer.selectAnnotation(TIMAAT.VideoPlayer.curAnnotation);
				else TIMAAT.VideoPlayer.selectAnnotation(TIMAAT.VideoPlayer.curAnnotation);

				if ( TIMAAT.VideoPlayer.curAnnotation && TIMAAT.VideoPlayer.curAnnotation.isAnimation() && $('#timelineVisualLayer').is(':checked') ){
					$('#timelineKeyframePane').show();
				} // else $('#timelineKeyframePane').hide();
				if (TIMAAT.VideoPlayer.curAnnotation && TIMAAT.VideoPlayer.curAnnotation.model.selectorSvgs[0].svgData != '{"keyframes":[{"time":0,"shapes":[]}]}') {
					TIMAAT.VideoPlayer.inspector.ui.addAnimButton.prop('disabled', false);
			 }
				TIMAAT.VideoPlayer.updateListUI();
				TIMAAT.VideoPlayer.pause();
			});

			$(this.listView).on('dblclick', this, function(ev) {
				TIMAAT.VideoPlayer.jumpVisible(ev.data.startTime, ev.data.endTime);
				TIMAAT.VideoPlayer.selectAnnotation(ev.data);
				TIMAAT.VideoPlayer.selectedElementType = 'annotation';
				TIMAAT.VideoPlayer.pause();
				TIMAAT.VideoPlayer.inspector.open('inspectorMetadata');
				TIMAAT.VideoPlayer.updateListUI();
			});

			// create marker with UI
            if(this.model.layerVisual){
                this.videoMarker = new TIMAAT.Marker(this, "#timelineMarkerPane")
            }
            if(this.model.layerAudio){
                this.audioMarker = new TIMAAT.Marker(this, ".timeline__audio_annotation")
            }

            this.updateMarker()
			this.changed = false;

			if ( TIMAAT.VideoPlayer.duration == 0 ) this.updateStatus(0);
		}

		_upgradeModel() {
			if ( Array.isArray(this.svg.model) ) {
				// upgrade old DB model
				let newModel = {
						keyframes: [{
							time: 0,
							shapes: this.svg.model,
						}],
				}
				for ( let shape of newModel.keyframes[0].shapes ) shape.id = TIMAAT.Util.createUUIDv4();
				this.svg.model = newModel;
				this.model.selectorSvgs[0].svgData = JSON.stringify(this.svg.model);
			}
		};

		isAnimation() {
			return this.svg.keyframes.length > 1;
		}

		get currentKeyframe() {
			let curKeyframe = this.svg.keyframes[0];
			if ( !this.isAnimation() ) return curKeyframe;
			for (let keyframe of this.svg.keyframes) if ( this._animTime >= keyframe.time ) curKeyframe = keyframe;
			return curKeyframe;
		}

		get nextKeyframe() {
			if ( !this.isAnimation() ) return this.svg.keyframes[0];
			let index = this.svg.keyframes.indexOf(this.currentKeyframe);
			if ( index < 0 ) return this.svg.keyframes[0];
			index += 1;
			if ( index >= this.svg.keyframes.length ) index = this.svg.keyframes.length-1;
			return this.svg.keyframes[index];
		}

		isOnKeyframe() {
			let onKeyframe = false;
			if ( !this.isAnimation() ) onKeyframe = true;
			else for (let keyframe of this.svg.keyframes) if ( this._animTime == keyframe.time ) onKeyframe = true;
			return onKeyframe;
		}

		getKeyframeIndex(keyframe) {
			if ( !keyframe || !this.isAnimation() ) return 0;
			let index = this.svg.keyframes.indexOf(keyframe);
			if ( index < 0 ) index = 0;
			return index;
		}

		addKeyframeAt(timeInSeconds) {
			if ( this._destroyed ) return;
			this.updateStatus(timeInSeconds);
			let time = timeInSeconds * 1000;
			let relTime = time - this.startTime;
			relTime = Math.floor(relTime);
			relTime = (relTime < 0) ? 0 : relTime;
			if ( relTime  == 0 ) return;
			let exists = false;
			for (let keyframe of this.svg.keyframes) if ( keyframe.time == relTime ) exists = true;
			if ( exists ) return;
			let cur = this.currentKeyframe;
			let next = this.nextKeyframe;
			let first = this.svg.keyframes[0];
			let model = JSON.parse(JSON.stringify(cur.model));
			if ( cur != next ) {
				let percent = (relTime-cur.time) / (next.time-cur.time);
				let shapes = new Array();
				for (let item of model.shapes) {
					shapes.push(
						TIMAAT.Util.getInterpolatedShape(
							cur.getShape(item.id),
							next.getShape(item.id),
							percent
						)
					);
				}
				model = first._syncToModel(shapes);
			}

			model.time = relTime;
			let keyframe = new TIMAAT.Keyframe(model, this);
			this.svg.keyframes.push(keyframe);
			// sort keyframe array by time index
			this.svg.keyframes.sort(function ( a, b ) {
				if ( a.time < b.time ) return -1;
				if ( a.time > b.time ) return 1;
				return 0;
			});
			this.changed = true;
			for (let frame of this.svg.keyframes) frame.updateUI();
			this.updateEditableUI();
			this.updateUI();
			// send event
			$(document).trigger('keyFrameAdded.annotation.TIMAAT', this);
		}

		removeCurrentKeyframe() {
			if ( this._destroyed ) return;
			if ( this.svg.keyframes.length <= 2 || this.currentKeyframe.time == 0 ) return;
			let cur = this.currentKeyframe;
			this.removeKeyframe(cur);
		}

		removeKeyframe(keyframe) {
			if ( this._destroyed || !keyframe ) return;
			if ( this.svg.keyframes.length < 2 || keyframe.time == 0 ) return;
			if ( this.svg.keyframes.indexOf(keyframe) < 1 ) return;
			keyframe.remove();
			let index = this.svg.keyframes.indexOf(keyframe);
			if ( index < 0 ) return;
			this.svg.keyframes.splice(index, 1);
			this.changed = true;
			for (let frame of this.svg.keyframes) frame.updateUI();
			this._updateShapeUI();
			this.updateEditableUI();
			this.updateUI();
			// send event
			$(document).trigger('keyFrameRemoved.annotation.TIMAAT', this);
		}

		removeAnimationKeyframes() {
			if ( this._destroyed ) return;
			let first = this.svg.keyframes[0];
			for (let keyframe of this.svg.keyframes) if ( keyframe != first ) keyframe.remove();
			this.svg.keyframes = [first];
			this.changed = true;
			for (let item of this.svg.items) this._updateSVGItem(item, first.getShape(item.options.id));
			this.updateEditableUI();
			this.updateUI();
			// send event
			$(document).trigger('keyFrameRemoved.annotation.TIMAAT', this);
		}

		get opacity() {
			return this.svg.opacity;
		}

		set opacity(opacity) {
			this.svg.opacity = Math.min(1.0, Math.max(0.0, opacity));
			this.setChanged();
			TIMAAT.VideoPlayer.updateUI();
			this.updateUI();
		};

		get layerVisual() {
			return this._layerVisual;
		}

		set layerVisual(layerVisual) {
			this._layerVisual = layerVisual;
			this.setChanged();

            if(layerVisual && !this.videoMarker){
                this.videoMarker = new TIMAAT.Marker(this, "#timelineMarkerPane")
            }

            if(!layerVisual  && this.videoMarker){
                this.videoMarker.remove()
                this.videoMarker = null
            }
            this.updateMarker()

			TIMAAT.VideoPlayer.updateUI();
			this.updateUI();
		};

		get layerAudio() {
			return this._layerAudio;
		}

		set layerAudio(layerAudio) {
			this._layerAudio = layerAudio;
			this.setChanged();

            if(layerAudio && !this.audioMarker){
                this.audioMarker = new TIMAAT.Marker(this, ".timeline__audio_annotation")
            }

            if(!layerAudio  && this.audioMarker){
                this.audioMarker.remove()
                this.audioMarker = null
            }

            this.updateMarker()
			TIMAAT.VideoPlayer.updateUI();
			this.updateUI();
		};

		get stroke() {
			return this.svg.strokeWidth;
		}

		set stroke(stroke) {
			if ( stroke < 0 ) stroke = 0;
			if ( this.svg.strokeWidth != stroke ) {
				this.svg.strokeWidth = stroke;
				this.setChanged();
				TIMAAT.VideoPlayer.updateUI();
				this.updateUI();
			}
		};

		get startTime() {
			return this._startTime;
		}

		set startTime(startTime) {
			this._startTime = Math.max(0, (Math.min(startTime, TIMAAT.VideoPlayer.duration)));
			this._endTime = Math.max(startTime, this._endTime);
			if ( this._startTime != this.model.startTime ) {
				this.setChanged();
				TIMAAT.VideoPlayer.updateUI();
                this.updateMarker()
			}
			this.svg.keyframes[0].updateTimeUI();
		};

		get endTime() {
			return this._endTime;
		}

		set endTime(endTime) {
			this._endTime = Math.min(endTime, TIMAAT.VideoPlayer.duration);
			this._endTime = Math.max(this._startTime, this._endTime);
			if ( this._endTime != this.model.endTime ) {
				this.setChanged();
				TIMAAT.VideoPlayer.updateUI();

                this.updateMarker()
			}
		};

		get length() {
			return this._endTime - this._startTime;
		}

		hasPolygons() {
			return this.svg.items.length > 0;
		}

        updateMarker(){
            this.audioMarker?.updateView()
            this.videoMarker?.updateView()

            this.markerConnection?.remove()
            if(this.audioMarker && this.videoMarker){
                this.markerConnection = new TIMAAT.MarkerConnection(this.videoMarker, this.audioMarker, "#annotation_connection_layer");
            }else{
                this.markerConnection = null
            }
        }


		updateUI() {
			// console.log("TCL: Annotation -> updateUI -> updateUI()");
			this.listView.attr('data-start-time', this.model.startTime);
			this.listView.attr('data-end-time', this.model.endTime);
			this.listView.attr('id', 'annotation-'+this.model.id);
			this.listView.attr('data-type', 'annotation');
			this.listView.find('.analysis-list-element__icon').css('color', '#'+this.svg.colorHex);
			var timeString = " "+TIMAAT.Util.formatTime(this.model.startTime, true);
			if ( this.model.startTime != this.model.endTime ) timeString += ' - '+TIMAAT.Util.formatTime(this.model.endTime, true);
			if ( TIMAAT.VideoPlayer.duration == 0 ) timeString = ''; // empty time string for non time-based media (images)
			this.listView.find('.annotationListTime').html(timeString);
			this.listView.find('.js-analysis-list-element__title').html(this.model.annotationTranslations[0].title);
			// categories
			this.listView.find('.annotationListCategories i').attr('title', this.model.categories.length+" Categories");
			if (this.model.categories.length == 0) this.listView.find('.annotationListCategories i').attr('class','fas fa-archive text-light noCategories');
			else if (this.model.categories.length == 1) this.listView.find('.annotationListCategories i').attr('class','fas fa-archive').attr('title', "one category");
			else this.listView.find('.annotationListCategories i').attr('class','fas fa-archive');
			// type
			this._updateAnnotationType();

			// comment
			if ( this.model.annotationTranslations[0].comment && this.model.annotationTranslations[0].comment.length > 0 )
				this.listView.find('.js-analysis-list-element__icon--comment').show();
			else
				this.listView.find('.js-analysis-list-element__icon--comment').hide();

			// update svg
			for (let item of this.svg.items) {
				item.setStyle({color:'#'+this.svg.colorHex, weight: this.svg.strokeWidth, fillOpacity: this.svg.opacity});
			};

			// update marker
            this.updateMarker()
		}

		_updateAnnotationType() {
			let layerVisualIcon = this.listView.find('.js-analysis-list-element__icon--visual-layer');
			let layerAudioIcon = this.listView.find('.js-analysis-list-element__icon--audio-layer');
			if ( this.layerVisual) {
				if ( this.isAnimation() ) {
					layerVisualIcon.removeClass('fa-image').removeClass('fa-draw-polygon').addClass('fa-running');
				} else if ( this.svg.items.length > 0 ) {
					layerVisualIcon.removeClass('fa-image').removeClass('fa-running').addClass('fa-draw-polygon');
				} else {
					layerVisualIcon.removeClass('fa-running').removeClass('fa-draw-polygon').addClass('fa-image');
				}
				layerVisualIcon.show();
			} else {
				layerVisualIcon.hide();
				layerVisualIcon.removeClass('fa-image').removeClass('fa-draw-polygon').removeClass('fa-running');
			}
			( this.layerAudio ) ? layerAudioIcon.show() : layerAudioIcon.hide();
		};

		remove() {
			// remove annotation from UI
			this.listView.remove();
			this.audioMarker?.remove();
            this.videoMarker?.remove();
			this.svg.layer.remove();
			this.selected = false;
			this._destroyed = true;
		}

		addSVGItem (item) {
			if ( !item || this.svg.items.includes(item) ) return;
			// generate UUID for shape and propagate through keyframes
			if ( !item.options.id ) {
				item.options.id = TIMAAT.Util.createUUIDv4();
				let shape = { id: item.options.id };
				if ( item instanceof L.Rectangle ) shape.type = 'rectangle';
				else if ( item instanceof L.Polygon ) shape.type = 'polygon';
				else if ( item instanceof L.Polyline ) shape.type = 'line';
				else if ( item instanceof L.Circle ) shape.type = 'circle';
				shape = this.syncShape(item, shape);
				// propagate changes to keyframes
				// TODO check if stringify needed to decouple references
				for (let keyframe of this.svg.keyframes) keyframe.addShape(Object.assign({}, shape));
			}
			// add to list of shapes
			this.svg.items.push(item);
			this.svg.layer.addLayer(item);

			// in case it was not set before, adding geometric data requires visual layer to be set
			this.model.layerVisual = true;
			$('#inspectorVisualLayerCheckbox').prop('checked', true);

			this.changed = true;

			// update UI
			this._updateAnnotationType();
			this.updateMarker()

			// attach item event handlers
			let anno = this;
			item.on('click', function(ev) {
				TIMAAT.VideoPlayer.selectAnnotation(anno);
				// delete annotation geometry if user presses alt
				if ( ev.originalEvent.altKey && TIMAAT.VideoPlayer.curAnnotation && TIMAAT.VideoPlayer.curAnnotation.isOnKeyframe()  ) {
					// prevent deletion if its the last geometric object and animation is active
          if (TIMAAT.VideoPlayer.curAnnotation.svg.items.length == 1 && TIMAAT.VideoPlayer.curAnnotation.svg.keyframes.length > 1) {
						$('#annotationAnimationNeedsGeometricDataModal').modal('show');
					} else {
						anno.removeSVGItem(ev.target);
						TIMAAT.VideoPlayer.updateUI();
					}
				}
			});

			item.on('dragstart', function(ev) {anno.setChanged();TIMAAT.VideoPlayer.updateUI();});
			// console.log("TCL: Annotation -> addSVGItem -> TIMAAT.VideoPlayer.updateUI()");
			item.on('dragend', function(ev) {anno.setChanged();TIMAAT.VideoPlayer.updateUI();});
			// console.log("TCL: Annotation -> addSVGItem -> TIMAAT.VideoPlayer.updateUI()");
		}

		removeSVGItem (item) {
			// console.log("TCL: Annotation -> removeSVGItem -> item", item);
			if ( !item || !this.svg.items.includes(item) ) return;
			this.svg.layer.removeLayer(item);
			var index = this.svg.items.indexOf(item);
			if (index > -1) this.svg.items.splice(index, 1);
			// propagate changes to keyframes
			for (let keyframe of this.svg.keyframes) keyframe.removeShape(item.options.id);

			this.changed = true;

			// update UI
			if ( this.svg.items.length == 0 ) {
				this._updateAnnotationType();
				this.updateMarker()
			}
		}

		setChanged() {
			this.changed = true;
		}

		hasChanges() {
			return this.changed;
		}

		getModel() {
			return this.model;
		}

		discardChanges() {
			if ( !this.changed ) return;
			this.svg.layer.clearLayers();
			this.svg.items = Array();
			this.layerVisual = this.model.layerVisual;
			this.layerAudio = this.model.layerAudio;
			this._startTime = this.model.startTime;
			this._endTime = this.model.endTime;
			this.svg.colorHex = this.model.selectorSvgs[0].colorHex;
			this.svg.opacity = this.model.selectorSvgs[0].opacity/100;
			this.svg.strokeWidth = this.model.selectorSvgs[0].strokeWidth ? 2 : 0;

			this.svg.model = JSON.parse(this.model.selectorSvgs[0].svgData);
			this._upgradeModel();
			for (let svgItem of this.svg.model.keyframes[0].shapes) {
				let item = this._parseSVG(svgItem);
				this.addSVGItem(item);
			}

			for (let keyframe of this.svg.keyframes) keyframe.remove();
			this.svg.keyframes = new Array();
			for (let keyframe of this.svg.model.keyframes) this.svg.keyframes.push(new TIMAAT.Keyframe(keyframe, this));

			// update UI
			this.changed = false;
			this.updateUI();
			this._updateShapeUI();
			this.updateEditableUI();
			// update keyframe UI
			if ( this.isAnimation() ) for (let keyframe of this.svg.keyframes) keyframe.updateUI();

		}

		saveChanges() {
			// console.log("TCL: Annotation -> saveChanges -> saveChanges()");
			this._syncToModel();
			this.changed = false;
		}

		updateStatus(timeInSeconds) {
			let time = timeInSeconds * 1000;
			let animTime = time - this._startTime;
			animTime = Math.floor(animTime);
			var active = false;
			if ( TIMAAT.VideoPlayer.duration == 0 || (time >= this.startTime && time <= this.endTime) ) active = true;
			this.setActive(active);
			if ( animTime == this._animTime ) return;
			this._animTime = animTime;
			this._updateShapeUI();
			this.updateEditableUI();
			// update keyframe UI
			if ( this.isAnimation() ) for (let keyframe of this.svg.keyframes) keyframe.updateUI();
		}

		isActive() {
			return this.active;
		}

		setActive(active) {
			if ( this.active == active ) return;
			this.active = active;
			if ( active ) {
				this.listView.find('.annotationStatusMarker').addClass('bg-success');
				TIMAAT.VideoPlayer.viewer.annoLayer.addLayer(this.svg.layer);
				// scroll list
				this._scrollIntoView(this.listView);
			} else {
				this.listView.find('.annotationStatusMarker').removeClass('bg-success');
				TIMAAT.VideoPlayer.viewer.annoLayer.removeLayer(this.svg.layer);
				this.svg.layer.options.removed = true;
			}
		}

		updateEditableUI() {
			let added = false;
			for (let item of this.svg.items) {
				item.dragging.disable();
				item.disableEdit();
				if ( this.isSelected() && this.isActive() && this.isOnKeyframe() ) {
					if ( this.svg.layer.options.removed ) {
						item.dragging._draggable = null;
						item.dragging.addHooks();
						added = true;
					}
					item.dragging.enable();
					item.enableEdit();
					if ( this.isAnimation() ) {
						item.editor.options.skipMiddleMarkers = true;
						item.editor.reset();
					}
				}
			};
			if ( added ) this.svg.layer.options.removed = false;
		}

		setSelected(selected) {
			if ( this._destroyed ) return;
			if ( this.selected == selected ) return;
			this.selected = selected;
			if ( selected ) {
				this.listView.addClass('annotation__list--selected');
				for (let item of this.svg.items) {
					item.bringToFront();
/*
					item.dragging.enable();
					item.enableEdit();
					if ( this.isAnimation() ) {
						item.editor.options.skipMiddleMarkers = true;
						item.editor.reset();
					}
*/
				};
			}
			else {
				this.discardChanges();
				this.listView.removeClass('annotation__list--selected');
				TIMAAT.VideoPlayer.curAnnotation = null;
/*
				this.svg.items.forEach(function(item) {
					item.dragging.disable();
					item.disableEdit();
				});
*/
			}
			// update marker
			this.updateMarker()
			// update keyframe UI
			if ( this.isAnimation() ) for (let keyframe of this.svg.keyframes) keyframe.updateUI();
			// update editing UI
			this.updateEditableUI();
		}

		isSelected() {
			return this.selected;
		}

		syncShape(svgItem, shape = null, force = this.isOnKeyframe()) {
			if ( !svgItem || !svgItem.options || !svgItem.options.id || !force) return;
			let id = svgItem.options.id;
			if ( !shape ) shape = this.currentKeyframe.getShape(id);
			if ( !shape ) return;
			switch (shape.type) {
				case 'rectangle':
					shape.bounds = [ [svgItem.getBounds().getSouthWest().lat, svgItem.getBounds().getSouthWest().lng], [svgItem.getBounds().getNorthEast().lat, svgItem.getBounds().getNorthEast().lng] ];
					break;

				case "polygon":
					shape.points = this._copyLatLngs(svgItem.getLatLngs()[0]);
					break;
				case "line":
					shape.points = this._copyLatLngs(svgItem.getLatLngs());
					break;

				case "circle":
					shape.point = [svgItem.getLatLng().lat, svgItem.getLatLng().lng];
					shape.radius = svgItem.getRadius();
					break;
			}
			return shape;
		}

		_copyLatLngs(latLngs) {
			let points = new Array();
			for (let latLng of latLngs) points.push([latLng.lat, latLng.lng]);
			return points;
		}

		_updateShapeUI() {
			if ( this._destroyed || !this.isAnimation() || !this.isActive() ) return;
			let fromKeyframe = this.currentKeyframe;
			let toKeyframe = this.nextKeyframe;
			let interpolate = ( fromKeyframe != toKeyframe );
			let percent = (this._animTime-fromKeyframe.time) / (toKeyframe.time-fromKeyframe.time);
			for (let item of this.svg.items) {
				if ( interpolate ) {
					this._updateSVGItem(item, TIMAAT.Util.getInterpolatedShape(
							fromKeyframe.getShape(item.options.id),
							toKeyframe.getShape(item.options.id),
							percent
					));
				} else this._updateSVGItem(item, fromKeyframe.getShape(item.options.id));
			}
		}

		_updateSVGItem(item, shape) {
			if ( !item || !shape ) return;
			if ( item.options.id != shape.id ) return;
			switch (shape.type) {
				case 'rectangle':
					item.setBounds(shape.bounds);
					return;
				case "polygon":
					item.setLatLngs([shape.points]);
					return;
				case "line":
					item.setLatLngs(shape.points);
					return;
				case "circle":
					item.setLatLng(shape.point);
					item.setRadius(shape.radius);
					return;
			}
		}

		_scrollIntoView(listItem) {
			var listTop = $('.analysisList').scrollTop();
			var listHeight = $('.analysisList').height();
			var elementTop = listItem.position().top;
			// TODO scroll from bottom if out of view
			if ( elementTop < 0 )
				$('.analysisList').animate({scrollTop:(listTop+elementTop)}, 100);
			if ( elementTop > listHeight )
				$('.analysisList').animate({scrollTop:(listTop+elementTop)-listHeight+48}, 100);

		}

		_parseSVG(svgItem) {
			// console.log("TCL: Annotation -> _parseSVG -> svgItem", svgItem);
			let width = 1;
			let height = 1;
			if (TIMAAT.VideoPlayer.mediaType == 'video') {
				width = TIMAAT.VideoPlayer.model.medium.mediumVideo.width;
				height = TIMAAT.VideoPlayer.model.medium.mediumVideo.height;
			} else if (TIMAAT.VideoPlayer.mediaType == 'image') {
				width = TIMAAT.VideoPlayer.model.medium.mediumImage.width;
				height = TIMAAT.VideoPlayer.model.medium.mediumImage.height;
			} else if (TIMAAT.VideoPlayer.mediaType == 'audio') {
				width = 800;
				height = 600;
			}
			let factor = TIMAAT.VideoPlayer.mediumBounds.getNorth() / height;
			let id = svgItem.id;
			if ( !id ) {
				id = TIMAAT.Util.createUUIDv4();
				console.warn("WARNING: Annotation -> _parseSVG -> svgItem: Required attribute ID missing from model", svgItem);
			}
			switch (svgItem.type) {
				case "rectangle":
					// [[ height, x], [ y, width]]
					var bounds = [[ Math.round(TIMAAT.VideoPlayer.mediumBounds.getNorth()-(factor*svgItem.y*height)), Math.round(svgItem.x*factor*width)], [ Math.round(TIMAAT.VideoPlayer.mediumBounds.getNorth()-((svgItem.y+svgItem.height)*factor*height)), Math.round((svgItem.x+svgItem.width)*factor*width)]];
					return L.rectangle(bounds, {transform: true, id: id, draggable: true, color: '#'+this.svg.colorHex, weight: this.svg.strokeWidth}); // TODO fillOpacity?
				case "polygon":
					var points = new Array();
					$(svgItem.points).each(function(index,point) {
						var lat = TIMAAT.VideoPlayer.mediumBounds.getNorth()-(point[1]*factor*height);
						var lng = point[0]*factor*width;
						points.push([lat,lng]);
					});
					return L.polygon(points, {transform: true, id: id, draggable: true, color: '#'+this.svg.colorHex, weight: this.svg.strokeWidth}); // TODO fillOpacity?
				case "line":
					var points = new Array();
					$(svgItem.points).each(function(index,point) {
						var lat = TIMAAT.VideoPlayer.mediumBounds.getNorth()-(point[1]*factor*height);
						var lng = point[0]*factor*width;
						points.push([lat,lng]);
					});
					return L.polyline(points, {id: id, draggable: true, color: '#'+this.svg.colorHex, weight: this.svg.strokeWidth}); // TODO , opacity: this.svg.opacity ? (not working)
				case "circle":
					var lat = TIMAAT.VideoPlayer.mediumBounds.getNorth()-(svgItem.y*factor*height);
					var lng = svgItem.x*factor*width;
					var radius = svgItem.radius * factor;
					return L.circle([lat,lng], radius, {id: id, draggable: true, color: '#'+this.svg.colorHex, weight: this.svg.strokeWidth}); // TODO fillOpacity?
			}
		}

		_syncToModel() {
			// console.log("TCL: Annotation -> _syncToModel -> _syncToModel()");
			let jsonData = { keyframes: [] };
			// this.model.startTime = this._startTime;
			// this.model.endTime = this._endTime;
			// this.model.layerVisual = this._layerVisual;
			// this.model.layerAudio = this._layerAudio;
			this._startTime = this.model.startTime;
			this._endTime = this.model.endTime;
			this.layerVisual = this.model.layerVisual;
			this.layerAudio = this.model.layerAudio;

			let width = 0;
			let height = 0;
			let factor = 1;
			switch(TIMAAT.VideoPlayer.mediaType) {
				case 'video':
					width =  TIMAAT.VideoPlayer.model.medium.mediumVideo.width;
					height = TIMAAT.VideoPlayer.model.medium.mediumVideo.height;
					factor = TIMAAT.VideoPlayer.mediumBounds.getNorth() / height;
				break;
				case 'image':
					width = TIMAAT.VideoPlayer.model.medium.mediumImage.width;
					height = TIMAAT.VideoPlayer.model.medium.mediumImage.height;
					factor = TIMAAT.VideoPlayer.mediumBounds.getNorth() / height;
				break;
			}
			this.model.selectorSvgs[0].colorHex = this.svg.colorHex;
			this.model.selectorSvgs[0].opacity = this.svg.opacity * 100; // 0..1 is stored as 0..100 in DB (Byte)
			this.model.selectorSvgs[0].strokeWidth = this.svg.strokeWidth > 0 ? 1 : 0;

			this.svg.keyframes[0].time = 0;
			for (let keyframe of this.svg.keyframes) {
				keyframe.saveChanges();
				jsonData.keyframes.push(keyframe.model);

			}
			this.model.selectorSvgs[0].svgData = JSON.stringify(jsonData);
		}

	}
}, window));
