'use strict';

// MouseEvent polyfill for IE and Edge(?)
(function (window) {
	try {
		new MouseEvent('test');
		return false; // No need to polyfill
	} catch (e) {
		// Need to polyfill - fall through
	}

	// Polyfills DOM4 MouseEvent
	var MouseEvent = function (eventType, params) {
		params = params || { bubbles: false, cancelable: false };
		var mouseEvent = document.createEvent('MouseEvent');
		mouseEvent.initMouseEvent(eventType, params.bubbles, params.cancelable, window, 0, params.screenX || 0, params.screenY || 0, params.clientX || 0, params.clientY || 0, false, false, false, false, 0, null);

		return mouseEvent;
	}

	MouseEvent.prototype = Event.prototype;
	window.MouseEvent = MouseEvent;
})(window);

function loadFile(resourceURL, token, filename, callback) {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', resourceURL);
	xhr.responseType = 'arraybuffer';

	xhr.withCredentials = true;
	xhr.setRequestHeader('Authorization', 'BEARER ' + token);

	xhr.onload = function(event) {
		if (xhr.status == 200) {
			var data = new Uint8Array(this.response);
			var contentType = xhr.getResponseHeader('Content-Type');

			var blob = new Blob([data], { type: contentType });

			var url = (window.URL || window.webkitURL).createObjectURL(blob);
			callback(filename, url, blob, xhr, data);
		}
	};

	xhr.send();
}

function loadFileDownloadCallback(filename, blobURL, blob, xhr, data) {
	if (window.navigator.msSaveOrOpenBlob) {
		window.navigator.msSaveOrOpenBlob(blob, filename);
	} else {
		var a = document.createElement('a');
		a.href = blobURL;
		a.download = filename;

		//a.click(); // click does not work in Firefox if link is not in DOM
		a.dispatchEvent(new MouseEvent('click')); // MouseEvent requires polyfill
	}

	(window.URL || window.webkitURL).revokeObjectURL(blobURL);
}
