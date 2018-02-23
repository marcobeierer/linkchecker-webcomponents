<linkchecker>
	<form if="{ showButton }" onsubmit="{ submit }" style="margin-bottom: 20px;">
		<button class="btn btn-default" type="submit" disabled="{ disabled }">Check your website</button>
	</form>

	<div class="alert alert-{ messageType }">
		<raw content="{ message }" />
	</div>

	<div class="panel panel-default" style="width: 550px; max-width: 100%;">
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

	<h3 if="{ token }">Broken Images</h3>
	<resulttable if="{ token }"
		th-col1="URL where the broken images were found" 
		th-col2="Broken Images" 
		th-col3="Status Code" 
		results-message="{ resultsMessage }"
		data="{ urlsWithDeadImages }">
	</resulttable>

	<h3>Custom Status Codes</h3>
	<p>The Link Checker uses the following custom status codes:</p>
	<ul>
		<li>598 - Blocked by robots: The Link Checker was not able to access the page because the access was blocked by the robots exclusion protocol.</li>
		<li>599 - HTML parse error: The HTML code of this page could not be parsed because of an error in the code or because the page was larger than 50 MB.</li>
	</ul>
	<p><em>Please note that it is also possible that a website returns these status codes and if this is the case, they probably have another meaning.</em></p>

	<script>
		var self = this;

		self.message = '';

		opts.linkchecker.on('start', function(websiteURL, token, maxFetchers) {
			self.websiteURL = websiteURL;
			self.token = token;
			self.maxFetchers = maxFetchers || 10;
			
			self.start();
		});

		opts.linkchecker.on('started', function() {
			self.disabled = true;
		});

		opts.linkchecker.on('stopped', function() {
			self.disabled = false;
			self.update();
		});

		setMessage(text, type) {
			self.message = text;
			self.messageType = type;
			self.update();
		}

		var resultsMessage = 'Link check not started yet.';

		self.websiteURL = opts.websiteUrl || '';
		self.token = opts.token || '';
		self.maxFetchers = opts.maxFetchers || 10;

		if (self.websiteURL != '') {
			self.showButton = true;
		}

		self.urlsCrawledCount = 0;
		self.checkedLinksCount = 0;

		self.setMessage('The link checker was not started yet.', 'info');
		self.resultsMessage = resultsMessage;

		self.links = null;
		self.urlsWithDeadImages = null;

		submit(e) {
			e.preventDefault();
			self.start();
		}

		start() {
			opts.linkchecker.trigger('started');

			self.urlsCrawledCount = 0;
			self.checkedLinksCount = 0;

			self.links = null;
			self.urlsWithDeadImages = null;

			self.setMessage('Your website is being checked. Please wait a moment. You can watch the progress in the stats below.', 'warning');
			self.resultsMessage = 'Please wait until the check has finished.';

			var url64 = window.btoa(encodeURIComponent(self.websiteURL).replace(/%([0-9A-F]{2})/g, function(match, p1) {
				return String.fromCharCode('0x' + p1);
			}));
			url64.replace(/\+/g, '-').replace(/\//g, '_'); // convert to base64 url encoding

			self.doRequest = function() {
				var tokenHeader = '';
				if (self.token != '') {
					tokenHeader = 'BEARER ' + self.token;
				}

				jQuery.ajax({
					method: 'GET',
					url: 'https://api.marcobeierer.com/linkchecker/v1/' + url64 + '?origin_system=riot&max_fetchers=' + self.maxFetchers,
					headers: {
						'Authorization': tokenHeader,
					}
				}).done(function(data) {
					self.urlsCrawledCount = data.URLsCrawledCount;
					self.checkedLinksCount = data.CheckedLinksCount;

					if (data.Finished) { // successfull
						opts.linkchecker.trigger('stopped');

						if (data.LimitReached) {
							self.setMessage("The URL limit was reached. The Link Checker has not checked your complete website. You could buy a token for the <a href=\"https://www.marcobeierer.com/purchase\">Link Checker Professional</a> to check up to 50'000 URLs.", 'danger');
						} else {
							var message = "Your website has been checked successfully. Please see the result below.";

							if (self.token == '') {
								message += " If you additionally like to check your site for <strong>broken images</strong> or like to use the scheduler for an <strong>automatically triggered daily check</strong>, then have a look at the <a href=\"https://www.marcobeierer.com/purchase\">Link Checker Professional</a>.";
							}

							self.setMessage(message, 'success');
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
				}).fail(function(xhr) {
					opts.linkchecker.trigger('stopped');

					var statusCode = xhr.status;

					if (statusCode == 401) { // unauthorized
						self.setMessage("The validation of your token failed. The token is invalid or has expired. Please try it again or contact me if the token should be valid.", 'danger');
					} else if (statusCode == 500) {
						if (xhr.responseText == '') {
							self.setMessage("The check of your website failed. Please try it again.", 'danger');
						} else {
							self.setMessage("The check of your website failed with the error:<br/><strong>" + JSON.parse(xhr.responseText) + "</strong>.", 'danger');
						}
					} else if (statusCode == 503) {
						self.setMessage("The backend server is temporarily unavailable. Please try it again later.", 'danger');
					} else if (statusCode == 504 && xhr.getResponseHeader('X-CURL-Error') == 1) {
						var message = JSON.parse(xhr.responseText);
						if (message == '') {
							self.setMessage("A cURL error occurred. Please contact the developer of the extensions.", 'danger');
						} else {
							self.setMessage("A cURL error occurred with the error message:<br/><strong>" + message + "</strong>.", 'danger');
						}
					} else {
						self.setMessage("The check of your website failed. Please try it again or contact the developer of the extensions.", 'danger');
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
