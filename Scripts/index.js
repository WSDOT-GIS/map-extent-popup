/*jslint browser:true*/
(function () {
	"use strict";
	var mapButton;

	function getExtent() {
		var extent = [
			Number(document.getElementById("xmin").value),
			Number(document.getElementById("ymin").value),
			Number(document.getElementById("xmax").value),
			Number(document.getElementById("ymax").value),
		];

		if (!(extent[0] && extent[1] && extent[2] && extent[3])) {
			extent = null;
		}

		return extent;
	}

	mapButton = document.getElementById("showMapButton");
	mapButton.onclick = function () {
		var mapWindow, url = "MapPage.html", extent = getExtent();

		if (extent) {
			url += "#" + extent.join(",");
		}

		mapWindow = window.open(url, "map", "titlebar=no,menubar=no,toolbar=no,location=no,dependent=yes,modal=yes,close=no,dialog=yes");
		mapWindow.onbeforeunload = function () {
			var extent;
			if (this.extentSelector) {
				if (this.extentSelector.getSelectedExtent) {
					extent = this.extentSelector.getSelectedExtent();

				}
			}
			if (extent) {
				document.getElementById("xmin").value = extent.xmin;
				document.getElementById("ymin").value = extent.ymin;
				document.getElementById("xmax").value = extent.xmax;
				document.getElementById("ymax").value = extent.ymax;
			} else {
				document.getElementById("xmin").value = null;
				document.getElementById("ymin").value = null;
				document.getElementById("xmax").value = null;
				document.getElementById("ymax").value = null;
			}
		};
	};
}());