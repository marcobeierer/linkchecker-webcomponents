'use strict';

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
		a.click();
	}

	(window.URL || window.webkitURL).revokeObjectURL(blobURL);
}
