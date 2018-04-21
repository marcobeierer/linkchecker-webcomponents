riot.tag2('linkchecker', '<form if="{showButton}" style="margin-bottom: 20px;"> <button class="btn btn-default" onclick="{submit}" if="{!disabled}">Check your website</button> <button class="btn btn-danger" onclick="{stopCheck}" if="{disabled}">Stop website check</button> </form> <message plugin="{plugin}" text="Link Checker is initializing, please wait a moment." type="info"></message> <div if="{crawlDelayInSeconds >= 1}" class="alert alert-danger"> The crawl-delay set in your robots.txt file is equal or higher than one second, namely {crawlDelayInSeconds} seconds. The crawl-delay defines the time waited between two requests of the Link Checker. This means that it might take very long for the check to finish. It is recommended that you lower the crawl-delay for the Link Checker in your robots.txt. You can use the user agent MB-LinkChecker if you like to define a custom crawl-delay for the Link Checker. </div> <message plugin="{plugin}" name="db" text="" type="warning" dismissible="true"></message> <ul class="nav nav-tabs" role="tablist"> <li role="presentation" class="active"><a href="#progressAndStats{id}" aria-controls="progressAndStats{id}" role="tab" data-toggle="tab">Progress and Stats</a></li> <li role="presentation"><a href="#result{id}" aria-controls="result{id}" role="tab" data-toggle="tab">Result</a></li> <li role="presentation"><a href="#statusCodes{id}" aria-controls="statusCodes{id}" role="tab" data-toggle="tab">Status Codes</a></li> <li if="{enableScheduler}" role="presentation"><a href="#scheduler{id}" aria-controls="scheduler{id}" role="tab" data-toggle="tab">Scheduler</a></li> <li role="presentation"><a href="#glossary{id}" aria-controls="glossary{id}" role="tab" data-toggle="tab">Glossary</a></li> <li if="{!hasToken()}" role="presentation"><a href="#professional{id}" aria-controls="professional{id}" role="tab" data-toggle="tab">Professional Version</a></li> </ul> <div class="tab-content"> <div role="tabpanel" class="tab-pane active" id="progressAndStats{id}"> <h3>Progress and Stats</h3> <div class="row"> <div class="col-lg-6"> <div class="panel panel-default"> <div class="panel-heading">Stats</div> <table class="table table-bordered"> <tr> <td>Number of crawled HTML pages on your site</td> <td class="text-right" style="width: 200px;">{urlsCrawledCount}</td> </tr> <tr> <td>Number of checked internal and external resources</td> <td class="text-right">{checkedLinksCount}</td> </tr> <tr if="{data.Stats}"> <td>Started at</td> <td class="text-right">{datetime(data.Stats.StartedAt)}</td> </tr> <tr if="{data.Stats}"> <td>Finished at</td> <td class="text-right">{datetime(data.Stats.FinishedAt)}</td> </tr> </table> </div> </div> <div if="{data.Stats}" class="col-lg-6"> <div class="panel panel-default"> <div class="panel-heading">Detailed Stats</div> <table class="table table-bordered"> <tr> <td>Number of valid links</td> <td class="text-right" style="width: 200px;">{data.Stats.ValidLinksCount}</td> </tr> <tr> <td>Number of dead links</td> <td class="text-right">{data.Stats.DeadLinksCount}</td> </tr> <tr> <td>Number of redirected links</td> <td class="text-right">{data.Stats.RedirectedLinksCount}</td> </tr> <tr> <td>Number of valid embedded YouTube videos</td> <td class="text-right">{data.Stats.ValidEmbeddedYouTubeVideosCount}</td> </tr> <tr> <td>Number of dead embedded YouTube videos</td> <td class="text-right">{data.Stats.DeadEmbeddedYouTubeVideosCount}</td> </tr> </table> </div> </div> <div if="{data.Stats}" class="col-lg-6"> <div class="panel panel-default"> <div class="panel-heading">Setting Stats</div> <table class="table table-bordered"> <tr> <td>Crawl delay</td> <td class="text-right" style="width: 200px;">{data.Stats.CrawlDelayInSeconds} seconds</td> </tr> <tr> <td>Concurrent fetchers</td> <td class="text-right">{data.Stats.MaxFetchers}</td> </tr> <tr> <td>URL limit</td> <td class="text-right">{data.Stats.URLLimit} URLs</td> </tr> <tr> <td>Limit reached</td> <td class="text-right">{bool2text(data.Stats.LimitReached)}</td> </tr> </table> </div> </div> </div> </div> <div role="tabpanel" class="tab-pane" id="result{id}"> <h3>Result</h3> <result plugin="{plugin}"></result> </div> <div role="tabpanel" class="tab-pane" id="statusCodes{id}"> <h3>Status Codes</h3> <h4>Common Status Codes</h4> <div class="panel panel-default table-responsive"> <table class="table table-striped table-responsive"> <thead> <tr> <th style="width: 10em;">Status Code</th> <th style="width: 20em;">Status Text</th> <th>Description</th> </tr> </thead> <tbody> <tr> <td>502</td> <td>Bad Gateway</td> <td>The server returned an invalid response when the Link Checker tried to access the URL.</td> </tr> <tr> <td>504</td> <td>Gateway Timeout</td> <td>The Link Checker was not able to access the URL because it timed out.</td> </tr> </tbody> </table> </div> <h4>Custom Status Codes</h4> <div class="panel panel-default table-responsive"> <table class="table table-striped table-responsive"> <thead> <tr> <th style="width: 10em;">Status Code</th> <th style="width: 20em;">Status Text</th> <th>Description</th> </tr> </thead> </tbody> <tr> <td>601</td> <td>Blocked by robots</td> <td>The Link Checker was not able to access the URL because the access was blocked by the robots exclusion protocol.</td> </tr> <tr> <td>602</td> <td>HTML parse error</td> <td>The HTML code of this page could not be parsed because of an error in the code or because the page was larger than 50 MB.</td> </tr> <tr> <td>603</td> <td>Unknown authority error</td> <td>This status code means that the certificate was signed by an unknown certificate authority. If accessing the page works in your web browser, probably the provided certificate chain is broken. Most, but not all, browsers can handle such situation and download the missing certificates on the fly. If the error was detected on you website, you should fix the origin of the issue and provid the whole chain to all clients.</td> </tr> </tbody> </table> </div> <p><em>Please note that it is possible in rare situations that a website returns these status codes and if this is the case, they probably have another meaning.</em></p> </div> <div role="tabpanel" class="tab-pane" id="glossary{id}"> <h3>Glossary</h3> <h4>Unhandled Resources (mainly blocked by robots.txt)</h4> <p>Websites can prohibit access for web crawlers like the one used by the Link Checker with the robots exclusion protocol (robots.txt file). The Link Checker does respect the robots exclusion protocol for the website it crawls, but not for external links because it does just access individual URLs of the external sites.</p> <p>However, some websites take some effort to restrict the access for crawlers and the Link Checker does respect that and does not try to bypass the restrictions. You can find all URLs the Link Checker was not able to access in the table below, so that you could check them manually. If you have done this, you can mark them as working. Each marker is saved for one month in your browsers cache and the date of the last marking is shown in the table below.</p> <p>If the blocked links were found on your website, you can add rules for the Link Checker to your robots.txt file and restart the Link Checker. Please see the <a href="https://www.marcobeierer.com/tools/link-checker-faq" target="_blank">FAQs</a> for further information.</p> <h4>Working Redirects</h4> <p>Non-temporary redirects, even if working correctly, have disadvantages like for example increased loading times and should therefore be fixed. Showing working redirects can be enabled/disabled in the settings of the result tab.</p> <h4>Mark URLs as Fixed</h4> <p>To keep an better overview, you can mark URLs as fixed in the result view. The marked URLs are can be hidden in the result. Please note that the fixed markers are just temporary and are reset on the next link check.</p> <h4>Images</h4> <p>Broken images are just checked in the <a href="https://www.marcobeierer.com/tools/link-checker-professional" target="_blank">professional version of the Link Checker</a>.</p> <h4>Videos</h4> <p>Broken embedded YouTube videos are just checked in the <a href="https://www.marcobeierer.com/tools/link-checker-professional" target="_blank">professional version of the Link Checker</a>.</p> </div> <div if="{enableScheduler}" role="tabpanel" class="tab-pane" id="scheduler{id}"> <h3>Scheduler</h3> <linkchecker-scheduler website-url="{websiteURL}" token="{token}" email="{email}" dev="{dev}"></linkchecker-scheduler> </div> <div if="{!hasToken()}" role="tabpanel" class="tab-pane" id="professional{id}"> <h3>Professional Version</h3> <p>The professional version of the Link Checker allows to check a website with up to 50\'000 URLs and comes with some additional features. It\'s for example possible to:</p> <ul> <li>check embedded images,</li> <li>check YouTube videos or</li> <li>trigger a check once a day automatically and get a summary by mail.</li> </ul> <p>You can <a href="https://www.marcobeierer.com/tools/link-checker-professional" target="_blank">read more about the professional version and purchase a token</a> on my website.</p> </div> </div>', '', '', function(opts) {
		var self = this;

		self.plugin = riot.observable();

		self.message = '';
		self.originSystem = opts.originSystem || 'riot';
		self.data = {};
		self.dev = opts.dev;
		self.enableScheduler = opts.enableScheduler || false;
		self.forceStop = false;
		self.crawlDelayInSeconds = 0;

		self.id = opts.id || 0;
		self.email = opts.email || '';

		self.db = localforage.createInstance({
			driver      : localforage.INDEXEDDB,
			name        : 'LinkChecker',
			size 		: 4980736,
			version     : 1.0,
			storeName   : 'resultdata'
		});

		self.on('mount', function() {
			lscache.setBucket('linkchecker-checked-');
			lscache.flushExpired();

			if (self.websiteURL != undefined && self.websiteURL != '') {
				var tokenHeader = '';
				if (self.token != '') {
					tokenHeader = 'BEARER ' + self.token;
				}

				var url64 = self.websiteURL64();
				var url = getURL(url64 + '/running');

				jQuery.ajax({
					method: 'GET',
					url: url,
					headers: {
						'Authorization': tokenHeader,
					}
				}).done(function(data, textStatus, xhr) {
					if (data.Running) {
						self.start();
					}
					else {
						self.setMessage('Loading the result of the last check from cache, please wait a moment.', 'warning');

						self.db.getItem('data', function(err, data) {
							if (err != null) {
								console.error(err);
								console.error(err.message);
								self.setMessage('The Link Checker was not started yet.', 'info');
								self.setMessage('Loading the result of the last check failed:<br />' + err.name, 'warning', 'db');
								return;
							}

							if (data == null) {
								self.setMessage('No result available in the cache, the Link Checker was not started yet.', 'info');
								return;
							}

							self.data = data;
							self.render(self.data);
							self.update();
						});
					}
				});

			} else {

				setTimeout(function() {
					self.setMessage('The Link Checker was not started yet.', 'info');
				}, 500);
			}
		});

		function getURL(url64) {
			var url = 'https://api.marcobeierer.com/linkchecker/v1/' + url64 + '?origin_system=' + self.originSystem + '&max_fetchers=' + self.maxFetchers;
			if (self.dev == '1') {
				url = 'sample_data/current.json?_=' + Date.now();
			} else if (self.dev == '2') {
				url = 'http://marco-desktop:9999/linkchecker/v1/' + url64 + '?origin_system=' + self.originSystem + '&max_fetchers=' + self.maxFetchers;
			}
			return url;
		}

		self.bool2text = function(val) {
			if (val) {
				return 'Yes';
			}
			return 'No';
		}

		self.datetime = function(val) {
			return new Date(val).toLocaleString();
		}

		self.hasToken = function() {
			return self.token || (self.data.Stats != undefined && self.data.Stats.TokenUsed);
		}

		function resetObject(obj) {
			Object.keys(obj).forEach(
				function(key) {
					delete obj[key];
				}
			);
		}

		opts.linkchecker.on('start', function(websiteURL, token, maxFetchers) {
			self.websiteURL = websiteURL;
			self.setToken(token);
			self.maxFetchers = maxFetchers || self.maxFetchers;

			self.start();
		});

		opts.linkchecker.on('stop', function() {
			self.forceStop = true;
		});

		opts.linkchecker.on('started', function() {
			self.disabled = true;
		});

		opts.linkchecker.on('stopped', function() {
			self.disabled = false;
			self.update();
		});

		self.setMessage = function(text, type, name) {
			self.plugin.trigger('set-message', text, type, name);
		}

		this.setToken = function(token) {
			self.token = token.replace(/\s/g, '');
		}.bind(this)

		self.websiteURL = opts.websiteUrl || '';
		self.token = '';
		if (opts.token) {
			self.setToken(opts.token);
		}
		self.maxFetchers = opts.maxFetchers || 10;

		if (self.websiteURL != '') {
			self.showButton = true;
		}

		self.urlsCrawledCount = 0;
		self.checkedLinksCount = 0;

		var resultsMessage = 'Link check not started yet.';
		self.resultsMessage = resultsMessage;

		self.urlsWithBrokenLinks = {};
		self.urlsWithLinksBlockedByRobots = {};
		self.urlsWithDeadImages = {};
		self.urlsWithDeadYouTubeVideos = {};
		self.urlsWithUnhandledEmbeddedResources = {};

		self.retries = 0;

		this.submit = function(e) {
			e.preventDefault();
			self.start();
		}.bind(this)

		self.websiteURL64 = function() {
			var url64 = window.btoa(encodeURIComponent(self.websiteURL).replace(/%([0-9A-F]{2})/g, function(match, p1) {
				return String.fromCharCode('0x' + p1);
			}));
			url64.replace(/\+/g, '-').replace(/\//g, '_');

			return url64;
		}

		this.start = function() {
			opts.linkchecker.trigger('started');
			self.plugin.trigger('started')

			self.db.removeItem('data', function(err) {
				if (err != null) {
					console.error(err);
					console.error(err.message);
					self.setMessage('Could not remove old result from cache:<br />' + err.name, 'warning', 'db');
				}
			});
			self.data = {};

			self.urlsCrawledCount = 0;
			self.checkedLinksCount = 0;

			resetObject(self.urlsWithBrokenLinks);
			resetObject(self.urlsWithLinksBlockedByRobots);
			resetObject(self.urlsWithDeadImages);
			resetObject(self.urlsWithDeadYouTubeVideos);
			resetObject(self.urlsWithUnhandledEmbeddedResources);

			lscache.setBucket('linkchecker-fixed-');
			lscache.flush();

			self.setMessage('Your website is being checked. Please wait a moment. You can watch the progress in the stats below.', 'warning');
			self.resultsMessage = 'Please wait until the check has finished.';

			var url64 = self.websiteURL64();

			self.doRequest = function() {
				var tokenHeader = '';
				if (self.token != '') {
					tokenHeader = 'BEARER ' + self.token;
				}

				var url = getURL(url64);

				jQuery.ajax({
					method: 'GET',
					url: url,
					headers: {
						'Authorization': tokenHeader,
					}
				}).done(function(data) {
					self.retries = 0;

					self.data = data;
					self.render(self.data);

					if (data.Finished) {
						opts.linkchecker.trigger('stopped');

						self.db.setItem('data', data, function(err) {
							if (err != null) {
								if (err.name == 'QuotaExceededError') {
									self.setMessage('Could not save the result in cache because the quota has been exceeded. The reason for this is probably low disk space. You can still use the Link Checker, but the result is not saved and gets discarded once you close the Link Checker.', 'warning', 'db');
								} else {
									console.error(err);
									console.error(err.message);
									self.setMessage('Could not save the result in cache (error was ' + err.name + '). You can still use the Link Checker, but the result is not saved and gets discarded once you close the Link Checker.', 'warning', 'db');
								}
							}
						});
					} else {
						if (self.forceStop) {
							self.stop(url, tokenHeader);
						} else {
							setTimeout(self.doRequest, 1000);
						}
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
					else if (statusCode == 0 && self.retries < 3) {
						self.retries++;

						if (self.forceStop) {
							self.stop(url, tokenHeader);
						} else {
							setTimeout(self.doRequest, 1000);
						}

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

		self.stopCheck = function(e) {
			e.preventDefault();
			self.forceStop = true;
		}

		self.stop = function(url, tokenHeader) {
			self.setMessage("Going to stop the current check.", 'warning');
			self.update();

			jQuery.ajax({
				method: 'DELETE',
				url: url,
				headers: {
					'Authorization': tokenHeader,
				}
			}).done(function(data) {
				self.setMessage("The current check was stopped successfully.", 'info');
			}).fail(function(xhr) {
				self.setMessage("Could not stop the check because the connection to the server failed.", 'danger');
			}).always(function() {
				self.forceStop = false;
				opts.linkchecker.trigger('stopped');
				self.update();
			});
		}

		self.render = function(data) {
			self.urlsCrawledCount = data.URLsCrawledCount;
			self.checkedLinksCount = data.CheckedLinksCount;
			self.crawlDelayInSeconds = data.CrawlDelayInSeconds;

			if (data.Finished) {
				self.resultsMessage = 'No broken resources found or no data available for the enabled filters.';
				self.plugin.trigger('result-data-ready', data);
			}
		}
});
