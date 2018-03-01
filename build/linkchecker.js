riot.tag2('linkchecker', '<form if="{showButton}" onsubmit="{submit}" style="margin-bottom: 20px;"> <button class="btn btn-default" type="submit" disabled="{disabled}">Check your website</button> </form> <div class="alert alert-{messageType}"> <raw content="{message}"></raw> </div> <div class="panel panel-default" style="width: 550px; max-width: 100%;"> <div class="panel-heading">Stats</div> <table class="table table-bordered"> <tr> <td>Number of crawled HTML pages on your site</td> <td class="text-right" style="width: 150px;">{urlsCrawledCount}</td> </tr> <tr> <td>Number of checked internal and external resources</td> <td class="text-right">{checkedLinksCount}</td> </tr> </table> </div> <h3>Broken Links</h3> <p>The table below shows all broken links. Please note that the fixed markers are just temporary and are reset with the next link check.</p> <datatable ref="brokenLinks" table-class="table-striped responsive-table" columns="{urlsWithBrokenLinksColumns}" data="{urlsWithBrokenLinks}" actions="{brokenLinksActions}" message="{resultsMessage}"> </datatable> <h3>Broken Images</h3> <p if="{!token}">Broken images are just checked in the <a href="https://www.marcobeierer.com/tools/link-checker-professional" target="_blank">professional version of the Link Checker</a>.</p> <p if="{token}">The table below shows all broken images. Please note that the fixed markers are just temporary and are reset for the next link check.</p> <datatable if="{token}" table-class="table-striped table-responsive" columns="{urlsWithDeadImagesColumns}" data="{urlsWithDeadImages}" actions="{brokenImagesActions}" message="{resultsMessage}"> </datatable> <h3>Common Status Codes</h3> <div class="panel panel-default table-responsive"> <table class="table table-striped table-responsive"> <thead> <tr> <th style="width: 10em;">Status Code</th> <th style="width: 20em;">Status Text</th> <th>Description</th> </tr> </thead> <tbody> <tr> <td>502</td> <td>Bad Gateway</td> <td>The server returned an invalid response when the Link Checker tried to access the URL.</td> </tr> <tr> <td>504</td> <td>Gateway Timeout</td> <td>The Link Checker was not able to access the URL because it timed out.</td> </tr> </tbody> </table> </div> <h3>Unhandled Resources (mainly blocked by robots.txt)</h3> <p>Websites can prohibit access for web crawlers like the one used by the Link Checker with the robots exclusion protocol (robots.txt file). The Link Checker does respect the robots exclusion protocol for the website it crawls, but not for external links because it does just access individual URLs of the external sites.</p> <p>However, some websites take some effort to restrict the access for crawlers and the Link Checker does respect that and does not try to bypass the restrictions. You can find all URLs the Link Checker was not able to access in the table below, so that you could check them manually. If you have done this, you could mark them as working. Each marker is saved for one month in your browsers cache and the date of the last marking is shown in the table below.</p> <p>If the blocked links were found your on website, you can add rules for the Link Checker to your robots.txt file and restart the Link Checker. Please see the <a href="https://www.marcobeierer.com/tools/link-checker-faq" target="_blank">FAQs</a> for further information.</p> <h4>Unhandled Links</h4> <datatable ref="linksBlockedByRobots" table-class="table-striped table-responsive" columns="{urlsWithLinksBlockedByRobotsColumns}" data="{urlsWithLinksBlockedByRobots}" actions="{blockedLinksActions}" message="{resultsMessage}"> </datatable> <virtual if="{token}"> <h4>Unhandled Images</h4> <datatable ref="unhandledEmbeddedResources" table-class="table-striped table-responsive" columns="{urlsWithLinksBlockedByRobotsColumns}" data="{urlsWithUnhandledEmbeddedResources}" actions="{blockedLinksActions}" message="{resultsMessage}"> </datatable> </virtual> <h4>Custom Status Codes</h4> <div class="panel panel-default table-responsive"> <table class="table table-striped table-responsive"> <thead> <tr> <th style="width: 10em;">Status Code</th> <th style="width: 20em;">Status Text</th> <th>Description</th> </tr> </thead> </tbody> <tr> <td>601</td> <td>Blocked by robots</td> <td>The Link Checker was not able to access the URL because the access was blocked by the robots exclusion protocol.</td> </tr> <tr> <td>602</td> <td>HTML parse error</td> <td>The HTML code of this page could not be parsed because of an error in the code or because the page was larger than 50 MB.</td> </tr> </tbody> </table> </div> <p><em>Please note that it is possible in rare situations that a website returns these status codes and if this is the case, they probably have another meaning.</em></p>', '', '', function(opts) {
		var self = this;

		self.message = '';
		self.originSystem = opts.originSystem || 'riot';

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
				message: 'No broken links left.',
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
				label: 'URL where the resources were found',
				width: '35%',
				callback: function(info, url) {
					return url;
				},
				linkCallback: function(info, url) {
					return url;
				},
			},
			{
				label: 'Blocked Resources',
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
				width: '15em',
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
				message: 'No broken images left.',
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
					width: '15em',
					callback: function(elem) {
						var markedOn = lscache.get(elem.URL);
						if (markedOn == undefined) {
							return 'never';
						}

						return new Date(markedOn).toLocaleDateString();
					},
				},
				{
					label: 'Actions',
					width: '10em',
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
					width: '10em',
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
					lscache.set(elem.URL, Date.now(), 60 * 24 * 30);
					self.refs.linksBlockedByRobots.update();
				},
				isDisabledCallback: wasAlreadyMarkedToday
			}
		];

		function wasAlreadyMarkedToday(elem) {
			var markedOn = lscache.get(elem.URL);
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
					markLinkInList(elem, self.urlsWithDeadImages);
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

		function resetObject(obj) {
			Object.keys(obj).forEach(
				function(key) {
					delete obj[key];
				}
			);
		}

		function markLinkInList(elem, list) {
			delete list[elem.FoundOnURL][elem.URL];

			if (Object.keys(list[elem.FoundOnURL]).length == 0) {

			}
		}

		opts.linkchecker.on('start', function(websiteURL, token, maxFetchers) {
			self.websiteURL = websiteURL;
			self.token = token;
			self.maxFetchers = maxFetchers || self.maxFetchers;

			self.start();
		});

		opts.linkchecker.on('started', function() {
			self.disabled = true;
		});

		opts.linkchecker.on('stopped', function() {
			self.disabled = false;
			self.update();
		});

		this.setMessage = function(text, type) {
			self.message = text;
			self.messageType = type;
			self.update();
		}.bind(this)

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
		self.urlsWithUnhandledEmbeddedResources = {};

		self.retries = 0;

		this.submit = function(e) {
			e.preventDefault();
			self.start();
		}.bind(this)

		this.start = function() {
			opts.linkchecker.trigger('started');

			self.urlsCrawledCount = 0;
			self.checkedLinksCount = 0;

			resetObject(self.urlsWithBrokenLinks);
			resetObject(self.urlsWithLinksBlockedByRobots);
			resetObject(self.urlsWithDeadImages);
			resetObject(self.urlsWithUnhandledEmbeddedResources);

			self.setMessage('Your website is being checked. Please wait a moment. You can watch the progress in the stats below.', 'warning');
			self.resultsMessage = 'Please wait until the check has finished.';

			var url64 = window.btoa(encodeURIComponent(self.websiteURL).replace(/%([0-9A-F]{2})/g, function(match, p1) {
				return String.fromCharCode('0x' + p1);
			}));
			url64.replace(/\+/g, '-').replace(/\//g, '_');

			self.doRequest = function() {
				var tokenHeader = '';
				if (self.token != '') {
					tokenHeader = 'BEARER ' + self.token;
				}

				var url = 'https://api.marcobeierer.com/linkchecker/v1/' + url64 + '?origin_system=' + self.originSystem + '&max_fetchers=' + self.maxFetchers;
				if (opts.dev == '1') {
					url = 'sample_data/current.json?_=' + Date.now();
				} else if (opts.dev == '2') {
					url = 'http://localhost:9999/linkchecker/v1/' + url64 + '?origin_system=' + self.originSystem + '&max_fetchers=' + self.maxFetchers;
				}

				jQuery.ajax({
					method: 'GET',
					url: url,
					headers: {
						'Authorization': tokenHeader,
					}
				}).done(function(data) {
					self.retries = 0;

					self.urlsCrawledCount = data.URLsCrawledCount;
					self.checkedLinksCount = data.CheckedLinksCount;

					if (data.Finished) {
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

						self.resultsMessage = 'Nothing is broken, everything seems to be fine.';

						if (!jQuery.isEmptyObject(data.DeadLinks)) {

							for (var url in data.DeadLinks) {
								self.urlsWithBrokenLinks[url] = {};

								data.DeadLinks[url].forEach(function(obj) {
									obj.FoundOnURL = url;
									self.urlsWithBrokenLinks[url][obj.URL] = obj;
								});

								if (Object.keys(self.urlsWithBrokenLinks[url]).length == 0) {
									delete self.urlsWithBrokenLinks[url];
								}
							}
						}

						if (!jQuery.isEmptyObject(data.UnhandledLinkedResources)) {
							for (var url in data.UnhandledLinkedResources) {
								self.urlsWithLinksBlockedByRobots[url] = {};

								data.UnhandledLinkedResources[url].forEach(function(obj) {
									obj.FoundOnURL = url;
									self.urlsWithLinksBlockedByRobots[url][obj.URL] = obj;
								});

								if (Object.keys(self.urlsWithLinksBlockedByRobots[url]).length == 0) {
									delete self.urlsWithLinksBlockedByRobots[url];
								}
							}
						}

						if (!jQuery.isEmptyObject(data.DeadEmbeddedImages)) {

							for (var url in data.DeadEmbeddedImages) {
								self.urlsWithDeadImages[url] = {};

								data.DeadEmbeddedImages[url].forEach(function(obj) {
									obj.FoundOnURL = url;
									self.urlsWithDeadImages[url][obj.URL] = obj;
								});

								if (Object.keys(self.urlsWithDeadImages[url]).length == 0) {
									delete self.urlsWithDeadImages[url];
								}
							}
						}

						if (!jQuery.isEmptyObject(data.UnhandledEmbeddedResources)) {
							for (var url in data.UnhandledEmbeddedResources) {
								self.urlsWithUnhandledEmbeddedResources[url] = {};

								data.UnhandledEmbeddedResources[url].forEach(function(obj) {
									obj.FoundOnURL = url;
									self.urlsWithUnhandledEmbeddedResources[url][obj.URL] = obj;
								});

								if (Object.keys(self.urlsWithUnhandledEmbeddedResources[url]).length == 0) {
									delete self.urlsWithUnhandledEmbeddedResources[url];
								}
							}
						}
					} else {
						setTimeout(self.doRequest, 1000);
					}
				}).fail(function(xhr) {
					opts.linkchecker.trigger('stopped');

					var statusCode = xhr.status;

					if (statusCode == 401) {
						self.setMessage("The validation of your token failed. The token is invalid or has expired. Please try it again or contact me if the token should be valid.", 'danger');
					}
					else if (statusCode == 500) {
						if (xhr.responseText == '') {
							self.setMessage("The check of your website failed. Please try it again.", 'danger');
						} else {
							self.setMessage("The check of your website failed with the error:<br/><strong>" + JSON.parse(xhr.responseText) + "</strong>.", 'danger');
						}
					}
					else if (statusCode == 503) {
						self.setMessage("The backend server is temporarily unavailable. Please try it again later.", 'danger');
					}
					else if (statusCode == 504 && xhr.getResponseHeader('X-CURL-Error') == 1) {
						var message = JSON.parse(xhr.responseText);
						if (message == '') {
							self.setMessage("A cURL error occurred. Please contact the developer of the extensions.", 'danger');
						} else {
							self.setMessage("A cURL error occurred with the error message:<br/><strong>" + message + "</strong>.", 'danger');
						}
					}
					else if (statusCode == 0 && self.retries < 3) {
						self.retries++;
						setTimeout(self.doRequest, 1000);
						return;
					}
					else {
						self.setMessage("The check of your website failed. Please try it again or contact the developer of the extensions.", 'danger');
					}

					self.resultsMessage = resultsMessage;
				}).always(function() {
					self.update();
				});
			};
			self.doRequest();
		}.bind(this)
});
