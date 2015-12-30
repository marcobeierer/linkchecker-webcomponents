<linkchecker>
	<div class="alert alert-info">
		<span name="message"></span>
	</div>
	<form name="linkCheckerForm" onsubmit="{ submit }">
		<button class="btn btn-default" type="submit" disabled="{ disabled }">Check your website</button>
	</form>


	<div class="panel panel-default" style="width: 500px; max-width: 100%;">
		<div class="panel-heading">Stats</div>
		<table class="table table-bordered">
			<tr>
				<td >Number of crawled HTML pages on your site</td>
				<td class="text-right" style="width: 150px;">{ urlsCrawledCount }</td>
			</tr>
			<tr>
				<td>Number of checked internal and external resources</td>
				<td class="text-right">{ checkedLinksCount }</td>
			</tr>
		</table>
	</div>

	<h3>Broken Links</h3>
	<resulttable
		th-col1="URL where the broken links were found" 
		th-col2="Broken Links" 
		th-col3="Status Code" 
		results-message="{ resultsMessage }"
		data="{ links }">
	</resulttable>

	<h3>Broken Images</h3>
	<resulttable 
		th-col1="URL where the broken images were found" 
		th-col2="Broken Images" 
		th-col3="Status Code" 
		results-message="{ resultsMessage }"
		data="{ urlsWithDeadImages }">
	</resulttable>

	<script>
		var self = this;

		setMessage(str) {
			self.message.innerHTML = str;
		}

		var resultsMessage = 'Link check not started yet.';

		self.disabled = false;

		self.urlsCrawledCount = 0;
		self.checkedLinksCount = 0;

		self.setMessage('The link checker was not started yet.');
		self.resultsMessage = resultsMessage;

		self.links = null;
		self.urlsWithDeadImages = null;

		submit(e) {
			e.preventDefault();

			self.disabled = true;

			self.urlsCrawledCount = 0;
			self.checkedLinksCount = 0;

			self.links = null;
			self.urlsWithDeadImages = null;

			self.setMessage('Your website is being checked. Please wait a moment.');
			self.resultsMessage = 'Please wait until the check has finished.';

			var url64 = window.btoa(encodeURIComponent('http://www.aboutcms.de').replace(/%([0-9A-F]{2})/g, function(match, p1) {
				return String.fromCharCode('0x' + p1);
			}));
			url64.replace(/\+/g, '-').replace(/\//g, '_'); // convert to base64 url encoding

			self.doRequest = function() {
				$.ajax({
					method: 'GET',
					url: 'https://api.marcobeierer.com/linkchecker/v1/' + url64 + '?origin_system=riot'
					/*headers: { TODO
						'Authorization': 'BEARER ' + ajaxObject.token,
					}*/
				}).done(function(data, statusCode, xhr) {
					self.urlsCrawledCount = data.URLsCrawledCount;
					self.checkedLinksCount = data.CheckedLinksCount;

					if (data.Finished) { // successfull
						self.disabled = false;

						if (data.LimitReached) {
							self.setMessage("The link limit was reached. The Link Checker has not checked your complete website. You could buy a token for the <a href=\"https://www.marcobeierer.com/wordpress-plugins/link-checker-professional\">Link Checker Professional</a> to check up to 50'000 links.");
						} else {
							var message = "Your website has been checked successfully. Please see the result below.";

							if (xhr.getResponseHeader('X-Used-Token') != 1) {
								message += " If you additionally like to check your site for <strong>broken images</strong>, then check out the <a href=\"https://www.marcobeierer.com/wordpress-plugins/link-checker-professional\">Link Checker Professional</a>.";
							}

							self.setMessage(message);
						}

						self.resultsMessage = 'No broken links found.';

						if (!jQuery.isEmptyObject(data.DeadLinks)) { // necessary for placeholder
							self.links = data.DeadLinks;
						}

						if (!jQuery.isEmptyObject(data.DeadEmbeddedImages)) { // necessary for placeholder
							self.urlsWithDeadImages = data.DeadEmbeddedImages;
						}
					} else {
						setTimeout(self.doRequest, 1000);
					}
				}).fail(function(xhr, statusCode, error) {
					self.disabled = false;

					if (statusCode == 401) { // unauthorized
						self.setMessage("The validation of your token failed. The token is invalid or has expired. Please try it again or contact me if the token should be valid.");
					} else if (statusCode == 500) {
						if (xhr.responseText == '') {
							self.setMessage("The check of your website failed. Please try it again.");
						} else {
							self.setMessage("The check of your website failed with the error:<br/><strong>" + JSON.parse(xhr.responseText) + "</strong>.");
						}
					} else if (statusCode == 503) {
						self.setMessage("The backend server is temporarily unavailable. Please try it again later.");
					} else if (statusCode == 504 && xhr.getResponseHeader('X-CURL-Error') == 1) {
						var message = JSON.parse(xhr.responseText);
						if (message == '') {
							self.setMessage("A cURL error occurred. Please contact the developer of the extensions.");
						} else {
							self.setMessage("A cURL error occurred with the error message:<br/><strong>" + message + "</strong>.");
						}
					} else {
						self.setMessage("The check of your website failed. Please try it again or contact the developer of the extensions.");
					}

					self.resultsMessage = resultsMessage;
				}).always(function() {
					self.update();
				});
			};
			self.doRequest();
		}
	</script>
</linkchecker>
