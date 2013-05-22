﻿/*global define, require*/
/*jslint browser:true*/

/** @namespace wsdot */
define(["require", "dojo/Evented", "dojo/_base/declare", "dojo/on", "esri/map", "esri/graphic",
	"esri/toolbars/draw", "dojo/_base/connect", "dojo/domReady!"
], /** @exports wsdot/extentSelector */ function (require, Evented, declare, on, Map, Graphic, Draw, connect) {
	"use strict";

	
	/** @class */
	return declare([Evented], /** @lends wsdot.extentSelector */ {
		

		/** 
		@instance
		@type {esri.Map}
		*/
		map: null,
		/** 
		@type {esri.layers.GraphicsLayer}
		@instance
		*/
		graphicsLayer: null,
		/** Gets the currently selected extent in the map.
		@instance
		@returns {esri.geometry.Extent} The first (and only) extent graphic shown on the map. The spatial reference will match that of the map. Will return null if no graphics are currently in the map.
		*/
		getSelectedExtent: function() {
			var self = this, extent = null;
			if (self.graphicsLayer) {
				if (self.graphicsLayer.graphics.length) {
					extent = self.graphicsLayer.graphics[0].geometry;
				}
			}
			return extent;
		},
		/** 
		* Adds an extent graphic to the map, replacing any existing graphics.
		* @param {esri.geometry.Extent} extent
		* @instance
		*/
		setExtent: function (extent) {
			if (this.graphicsLayer) {
				this.graphicsLayer.clear();
				this.graphicsLayer.add(new Graphic(extent));
			}
			return this;
		},
		/**
		* @param {Element|String} mapDiv The element where the extentSelector will be created, or its id.
		* @param {Object} options
		* @param {esri.geometry.Extent} options.initExtent The initial extent the map will be zoomed to.
		* @constructs
		*/
		constructor: function (mapDiv, options) {
			var self = this;

			/** Creates the draw toolbar controls for the map.
			@param {DOMElement} mapRoot The element into which the toolbar div will be placed.
			@private
			*/
			function createToolbarControls(mapRoot) {
				var docFrag, draw, toolbar, drawButton, clearButton, closeButton;
				// Create the draw toolbar.
				draw = new Draw(self.map);
				// Setup the draw-complete event.
				// The Draw toolbar does not yet support dojo/on.  Must use legacy dojo/_base/connect instead.
				connect.connect(draw, "onDrawComplete", function (event) {
					if (event.geometry) {
						self.graphicsLayer.clear();
						self.graphicsLayer.add(new Graphic(event.geometry));
					}
					draw.deactivate();
					drawButton.textContent = "Draw";
					self.emit("extent-change", event);
				});

				// Create the toolbar div and its buttons...
				docFrag = document.createDocumentFragment();
				toolbar = document.createElement("div");
				toolbar.classList.add("map-toolbar");
				docFrag.appendChild(toolbar);

				drawButton = document.createElement("button");
				drawButton.type = "button";
				drawButton.textContent = "Draw";
				drawButton.id = "drawButton";
				toolbar.appendChild(drawButton);

				clearButton = document.createElement("button");
				clearButton.type = "button";
				clearButton.textContent = "Clear";
				clearButton.id = "clearButton";
				toolbar.appendChild(clearButton);

				// Add the toolbar to the document.
				mapRoot.appendChild(toolbar);

				// Setup the button click events.
				drawButton.onclick = function () {
					if (this.textContent === "Draw") {
						draw.activate(Draw.EXTENT, null);
						this.textContent = "Cancel";
					} else {
						draw.deactivate();
						this.textContent = "Draw";
					}
				};

				clearButton.onclick = function () {
					self.graphicsLayer.clear();
					self.emit("extent-change", null);
				};

				// Add the close button.
				closeButton = document.createElement("button");
				closeButton.id = "closeButton";
				closeButton.type = "button";
				closeButton.textContent = "Close";
				mapRoot.appendChild(closeButton);

				closeButton.onclick = function () {
					window.close();
				};
			}

			if (typeof (mapDiv) === "string") {
				mapDiv = document.getElementById("mapDiv");
			}

			if (!mapDiv instanceof Element) {
				throw new TypeError("mapDiv must be either an Element or the id of an Element.");
			}

			self.map = new Map(mapDiv, {
				basemap: "streets",
				center: [-120.80566406246835, 47.41322033015946],
				zoom: 7,
				showAttribution: true
			});




			on(self.map, "load", function () {
				require(["esri/layers/GraphicsLayer", "esri/renderers/SimpleRenderer", "esri/symbols/SimpleFillSymbol",
					"esri/symbols/SimpleLineSymbol", "dojo/_base/Color"
				], function (GraphicsLayer, SimpleRenderer, SimpleFillSymbol, SimpleLineSymbol, Color) {
					var renderer, symbol;

					createToolbarControls(self.map.root);

					symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
						new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT,
						new Color([255, 0, 0]), 2), new Color([255, 255, 0, 0.25])
					  );

					self.graphicsLayer = new GraphicsLayer({ id: "graphics" });
					renderer = new SimpleRenderer(symbol);
					self.graphicsLayer.setRenderer(renderer);
					self.map.addLayer(self.graphicsLayer);
					if (options.initExtent) {
						self.setExtent(options.initExtent);
						self.map.setExtent(options.initExtent, true);
					}
				});
			});
		}
	});
	
});