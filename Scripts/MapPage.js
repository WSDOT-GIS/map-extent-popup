/*global require*/
/*jslint browser:true*/
require(["dojo/on", "wsdot/extentSelector", "esri/geometry/Extent"], function (on, ExtentSelector, Extent) {
	"use strict";
	var extentSelector, extent;

	/** Retrieves the extent from the hash.  The extent should be provided as four numbers separated by commas.
	* @returns {esri.geometry.Extent}
	*/
	function getInitialExtent() {
		var extent, re = /#(\-?\d+(?:\.\d+)?),(\-?\d+(?:\.\d+)?),(\-?\d+(?:\.\d+)?),(\-?\d+(?:\.\d+)?)/i, match = location.hash.match(re);
		if (match) {
			extent = new Extent({
				xmin: Number(match[1]),
				ymin: Number(match[2]),
				xmax: Number(match[3]),
				ymax: Number(match[4]),
				spatialReference: {
					wkid: 3857
				}
			});
		}
		return extent;
	}

	extent = getInitialExtent();

	extentSelector = new ExtentSelector("mapDiv", {
		initExtent: extent
	});
	window.extentSelector = extentSelector;
	on(extentSelector, "extent-change", function () {
		console.log(this, arguments);
	});
});