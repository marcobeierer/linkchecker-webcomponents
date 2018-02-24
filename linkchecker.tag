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
	<p>The table below shows all broken links. Please note that the fixed markers are just temporary and are reset with the next link check.</p>
	<datatable
		table-class="table-striped responsive-table"
		columns="{ urlsWithBrokenLinksColumns }"
		data="{ urlsWithBrokenLinks }"
		actions="{ brokenLinksActions }"
		message="{ resultsMessage }">
	</datatable>

	<h3>Links blocked by robots.txt</h3>
	<p>Websites can prohibit access for web crawlers like the one used by the Link Checker with the robots exclusion protocol. You find all links the Link Checker was not allowed to access in the table below. If the blocked links were found on your on website, you can add rules for the Link Checker to your robots.txt file and restart the Link Checker. Please see the <a href="https://www.marcobeierer.com/tools/link-checker-faq">FAQs</a> for further information.</p>
	<p>External links that are blocked by a robots.txt file cannot be checked by the Link Checker and need to be verified manually. If you have done this, you could mark them as working. Each marker is saved for one month in your browsers cache and the date of the last marking is shown in the table below.</p>
	<datatable
		table-class="table-striped responsive-table"
		columns="{ urlsWithLinksBlockedByRobotsColumns }"
		data="{ urlsWithLinksBlockedByRobots }"
		actions="{ blockedLinksActions }"
		message="{ resultsMessage }">
	</datatable>

	<h3 if="{ token }">Broken Images</h3>
	<p>The table below shows all broken images. Please note that the fixed markers are just temporary and are reset for the next link check.</p>
	<datatable if="{ token }"
		table-class="table-striped responsive-table"
		columns="{ urlsWithDeadImagesColumns}"
		data="{ urlsWithDeadImages }"
		actions="{ brokenImagesActions }"
		message="{ resultsMessage }">
	</datatable>

	<h3>Custom Status Codes</h3>
	<p>The Link Checker uses the following custom status codes:</p>
	<ul>
		<li>598 - Blocked by robots: The Link Checker was not able to access the page because the access was blocked by the robots exclusion protocol.</li>
		<li>599 - HTML parse error: The HTML code of this page could not be parsed because of an error in the code or because the page was larger than 50 MB.</li>
	</ul>
	<p><em>Please note that it is also possible that a website returns these status codes and if this is the case, they probably have another meaning.</em></p>

	<h3>Common Status Codes</h3>
	<ul>
		<li>502 - Bad Gateway: The server returned an invalid response when the Link Checker tried to access the URL.</li>
		<li>504 - Gateway Timeout: The Link Checker was not able to access the URL because it timed out.</li>
	</ul>

	<script>
		var self = this;

		self.message = '';

		self.on('mount', function() {
			lscache.setBucket('linkchecker');
			lscache.flushExpired();
		});

		self.urlsWithBrokenLinksColumns = [
			{
				label: 'URL where the broken links were found',
				width: '35%',
				callback: function(info, url) {
					return url;
				},
				linkCallback: function(info, url) {
					return url;
				},
			},
			{
				label: 'Broken Links',
				type: 'subtable',
				colspan: '3',
				callback: subtableCallback,
			},
			{
				label: 'StatusCode',
				width: '9em',
				showBody: false,
			},
			{
				label: 'Actions',
				width: '11em',
				showBody: false,
			}
		];

		self.urlsWithLinksBlockedByRobotsColumns = [
			{
				label: 'URL where the links were found',
				width: '35%',
				callback: function(info, url) {
					return url;
				},
				linkCallback: function(info, url) {
					return url;
				},
			},
			{
				label: 'Blocked Links',
				type: 'subtable',
				colspan: '4',
				callback: subtableBlockedLinksCallback,
			},
			{
				label: 'StatusCode',
				width: '9em',
				showBody: false,
			},
			{
				label: 'Marked As Working On',
				width: '14em',
				showBody: false,
			},
			{
				label: 'Actions',
				width: '11em',
				showBody: false,
			}
		];

		self.urlsWithDeadImagesColumns = [
			{
				label: 'URL where the broken images were found',
				width: '35%',
				callback: function(info, url) {
					return url;
				},
				linkCallback: function(info, url) {
					return url;
				},
			},
			{
				label: 'Broken Images',
				type: 'subtable',
				colspan: '3',
				callback: subtableCallback,
			},
			{
				label: 'StatusCode',
				width: '9em',
				showBody: false,
			},
			{
				label: 'Actions',
				width: '11em',
				showBody: false,
			}
		];

		function subtableBlockedLinksCallback(info, url) {
			return [
				{
					label: 'URL',
					linkCallback: function(elem) {
						return elem.URL;
					},
				},
				{
					label: 'StatusCode',
					width: '9em',
				},
				{
					label: 'Marked As Working On',
					width: '14em',
					callback: function(elem) {
						var markedOn = lscache.get(elem.FoundOnURL + '|' + elem.URL);
						if (markedOn == undefined) {
							return 'never';
						}

						return new Date(markedOn).toLocaleDateString();
					},
				},
				{
					label: 'Actions',
					width: '10em', // one em less than table header because of margin-right between inner and outer table
				}
			]
		}

		function subtableCallback(info, url) {
			return [
				{
					label: 'URL',
					linkCallback: function(elem) {
						return elem.URL;
					},
				},
				{
					label: 'StatusCode',
					width: '9em',
				},
				{
					label: 'Actions',
					width: '10em', // one em less than table header because of margin-right between inner and outer table
				}
			]
		}

		self.blockedLinksActions = [
			{
				labelCallback: function(elem) {
					if (wasAlreadyMarkedToday(elem)) {
						return 'Already marked';
					}
					return 'Mark as Working';
				},
				btnType: 'primary',
				action: 'callback',
				callback: function(elem) {
					lscache.set(elem.FoundOnURL + '|' + elem.URL, Date.now(), 60 * 60 * 24 * 31); // one month
				},
				isDisabledCallback: wasAlreadyMarkedToday 
			}
		];

		function wasAlreadyMarkedToday(elem) {
			var markedOn = lscache.get(elem.FoundOnURL + '|' + elem.URL);
			if (markedOn == undefined) {
				return false;
			}
			return new Date(Date.now()).toLocaleDateString() == new Date(markedOn).toLocaleDateString();
		}

		self.brokenImagesActions = [
			{
				label: 'Mark as Fixed',
				btnType: 'primary',
				action: 'callback',
				callback: function(elem) {
					markLinkInList(elem, self.urlsWithBrokenImages);
				}
			}
		];

		self.brokenLinksActions = [
			{
				label: 'Mark as Fixed',
				btnType: 'primary',
				action: 'callback',
				callback: function(elem) {
					markLinkInList(elem, self.urlsWithBrokenLinks);
				}
			}
		];

		function markLinkInList(elem, list) {
			var arr = list[elem.FoundOnURL];

			arr = arr.filter(function(e) {
				return e.URL != elem.URL;
			});

			if (arr.length == 0) {
				delete list[elem.FoundOnURL];
			} else {
				list[elem.FoundOnURL] = arr;
			}

			self.update();
		}

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

		self.setMessage('The Link Checker was not started yet.', 'info');
		self.resultsMessage = resultsMessage;

		self.urlsWithBrokenLinks = {};
		self.urlsWithLinksBlockedByRobots = {};
		self.urlsWithDeadImages = {};

		submit(e) {
			e.preventDefault();
			self.start();
		}

		start() {
			opts.linkchecker.trigger('started');

			self.urlsCrawledCount = 0;
			self.checkedLinksCount = 0;

			self.urlsWithBrokenLinks = {};
			self.urlsWithLinksBlockedByRobots = {};
			self.urlsWithDeadImages = {};

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

				var url = 'https://api.marcobeierer.com/linkchecker/v1/' + url64 + '?origin_system=riot&max_fetchers=' + self.maxFetchers;
				if (opts.dev == '1') {
					var url = 'example.json';
				}

				jQuery.ajax({
					method: 'GET',
					url: url,
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

						self.resultsMessage = 'Nothing found, everything seems fine here.';

						if (!jQuery.isEmptyObject(data.DeadLinks)) { // necessary for placeholder
							for (var url in data.DeadLinks) {
								var linksArray = data.DeadLinks[url];

								self.urlsWithBrokenLinks[url] = [];
								self.urlsWithLinksBlockedByRobots[url] = [];

								linksArray.forEach(function(obj) {
									obj.FoundOnURL = url;
									if (obj.StatusCode === 598) {
										self.urlsWithLinksBlockedByRobots[url].push(obj);
									} else {
										self.urlsWithBrokenLinks[url].push(obj);
									}
								});

								if (self.urlsWithBrokenLinks[url].length == 0) {
									delete self.urlsWithBrokenLinks[url];
								}

								if (self.urlsWithLinksBlockedByRobots[url].length == 0) {
									delete self.urlsWithLinksBlockedByRobots[url];
								}
							}
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
