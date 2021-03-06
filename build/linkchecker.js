riot.tag2('linkchecker', '<form if="{showButton}" style="margin-bottom: 20px;"> <button class="btn btn-default" onclick="{submit}" if="{!disabled}">Check your website</button> <button class="btn btn-danger" onclick="{stopCheck}" if="{disabled}">Stop website check</button> <span class="pull-right" style="display: inline-block;" data-original-title="{exportableTitle()}" data-toggle="tooltip" data-placement="left"> <button class="btn btn-default btn-sm {disabled: !exportable()}" onclick="{downloadCSVFile}">Export as CSV file</button> </span> </form> <message plugin="{plugin}" text="Link Checker is initializing, please wait a moment." type="warning"></message> <div if="{crawlDelayInSeconds >= 1}" class="alert alert-danger"> The crawl-delay set in your robots.txt file is equal or higher than one second, namely {crawlDelayInSeconds} seconds. The crawl-delay defines the time waited between two requests of the Link Checker. This means that it might take very long for the check to finish. It is recommended that you lower the crawl-delay for the Link Checker in your robots.txt. You can use the user agent MB-LinkChecker if you like to define a custom crawl-delay for the Link Checker. </div> <div if="{hasFormLogin()}" class="alert alert-info" style="padding-top: 5px; padding-bottom: 5px; margin-top: -10px;"> Form login is setup and used for the next check. </div> <message plugin="{plugin}" name="db" text="" type="warning" dismissible="true" style="padding-top: 5px; padding-bottom: 5px; margin-top: -10px;"></message> <ul class="nav nav-tabs" id="tabnav" role="tablist"> <li role="presentation" class="active"><a href="#progress{id}" aria-controls="progress{id}" role="tab" data-toggle="tab">Progress</a></li> <li role="presentation"><a href="#stats{id}" aria-controls="stats{id}" role="tab" data-toggle="tab">Stats</a></li> <li role="presentation"><a href="#result{id}" aria-controls="result{id}" role="tab" data-toggle="tab">Result</a></li> <li role="presentation"><a href="#statusCodes{id}" aria-controls="statusCodes{id}" role="tab" data-toggle="tab">Status Codes</a></li> <li if="{enableScheduler}" role="presentation"><a href="#scheduler{id}" aria-controls="scheduler{id}" role="tab" data-toggle="tab">Scheduler</a></li> <li role="presentation"><a href="#glossary{id}" aria-controls="glossary{id}" role="tab" data-toggle="tab">Glossary</a></li> <li if="{!hasToken()}" role="presentation"><a href="#professional{id}" aria-controls="professional{id}" role="tab" data-toggle="tab">Professional Version</a></li> <li if="{!hideFeedbackTab}" role="presentation"><a href="#feedback{id}" aria-controls="feedback{id}" role="tab" data-toggle="tab">Your Feedback</a></li> </ul> <div class="tab-content"> <div role="tabpanel" class="tab-pane active" id="progress{id}"> <h3>Progress Current Check</h3> <p>Below you see the progress of the current check while the check is running. When the check has finished, you can inspect the stats of the last check in the <em>Stats</em> tab.</p> <div class="row"> <div class="col-lg-6"> <div class="panel panel-default"> <div class="panel-heading">Stats</div> <table class="table table-bordered"> <tr> <td>Number of crawled HTML pages on your site</td> <td class="text-right" style="width: 200px;">{urlsCrawledCount}</td> </tr> <tr> <td>Number of checked internal and external resources</td> <td class="text-right">{checkedLinksCount}</td> </tr> </table> </div> </div> </div> </div> <div role="tabpanel" class="tab-pane" id="stats{id}"> <h3>Stats Last Check</h3> <p if="{!data.Stats}">Nothing to see here because no check has finished yet. You can inspect the stats of the last check as soon as the check has finished or was loaded from the cache.</p> <p if="{data.Stats}">Please see the stats of the last finished check below. If a check is currently running, the stats are for the last check and not the one currently running.</p> <div if="{data.Stats}" class="row"> <div class="col-lg-6"> <div class="panel panel-default"> <div class="panel-heading">Stats</div> <table class="table table-bordered"> <tr> <td>Number of crawled HTML pages on your site</td> <td class="text-right" style="width: 200px;">{data.Stats.HTMLPagesCount}</td> </tr> <tr> <td>Number of checked internal and external resources</td> <td class="text-right">{data.Stats.CrawledResourcesCount}</td> </tr> <tr> <td>Started at</td> <td class="text-right">{datetime(data.Stats.StartedAt)}</td> </tr> <tr> <td>Finished at</td> <td class="text-right">{datetime(data.Stats.FinishedAt)}</td> </tr> </table> </div> </div> <div class="col-lg-6"> <div class="panel panel-default"> <div class="panel-heading">Detailed Stats</div> <table class="table table-bordered"> <tr> <td>Number of valid links</td> <td class="text-right" style="width: 200px;">{data.Stats.ValidLinksCount}</td> </tr> <tr> <td>Number of dead links</td> <td class="text-right">{data.Stats.DeadLinksCount}</td> </tr> <tr> <td>Number of redirected links</td> <td class="text-right">{data.Stats.RedirectedLinksCount}</td> </tr> <tr> <td>Number of valid embedded YouTube videos</td> <td class="text-right">{data.Stats.ValidEmbeddedYouTubeVideosCount}</td> </tr> <tr> <td>Number of dead embedded YouTube videos</td> <td class="text-right">{data.Stats.DeadEmbeddedYouTubeVideosCount}</td> </tr> </table> </div> </div> <div class="col-lg-6"> <div class="panel panel-default"> <div class="panel-heading">Setting Stats</div> <table class="table table-bordered"> <tr> <td>Crawl delay</td> <td class="text-right" style="width: 200px;">{data.Stats.CrawlDelayInSeconds} seconds</td> </tr> <tr> <td>Concurrent fetchers</td> <td class="text-right">{data.Stats.MaxFetchers}</td> </tr> <tr> <td>URL limit</td> <td class="text-right">{data.Stats.URLLimit} URLs</td> </tr> <tr> <td>Limit reached</td> <td class="text-right">{bool2text(data.Stats.LimitReached)}</td> </tr> <tr> <td>Token used</td> <td class="text-right">{bool2text(data.Stats.TokenUsed)}</td> </tr> <tr> <td>Form login used</td> <td class="text-right">{bool2text(data.Stats.FormLoginUsed)}</td> </tr> </table> </div> </div> </div> </div> <div role="tabpanel" class="tab-pane" id="result{id}"> <h3>Result</h3> <p>Please note that the result belongs to the last check that has finished. If a check is currently running, the stats are for the last check and not the one currently running. <span if="{data.Stats}">The result below belongs to the check that was started on {datetimeAt(data.Stats.StartedAt)} and has finished on {datetimeAt(data.Stats.FinishedAt)}.</span></p> <result plugin="{plugin}" edit-urls-endpoint="{editURLsEndpoint}"></result> </div> <div role="tabpanel" class="tab-pane" id="statusCodes{id}"> <h3>Status Codes</h3> <p>The Link Checker result includes all URLs that respond with a <strong>status code greater or equal 300</strong>. Redirected URLs respond with a status code between 300 and 399 and if the redirects are working fine, they are only shown if you enable the <em>Working Redirects</em> flag in the result tab. URLs with a status code greater or equal 400 are always shown if the main flag for the URL category (<em>Links</em>, <em>Images</em> or <em>Videos</em>) is enabled. One exception are unhandled links (explained in the <a href="#" onclick="{switchTab.bind(this, \'glossary\')}">Glossary</a>) which are only shown if the <em>Unhandled</em> flag is enabled.</p> <p>If you hover over a status code in the result tab, you see a short description for the status code in a tooltip. Please consult <a href="https://en.wikipedia.org/wiki/List_of_HTTP_status_codes" target="_blank">Wikipedia</a> for detailed explanations.</p> <p>Below you find a short list of status codes which have a special meaning in the Link Checker context or are custom to the Link Checker.</p> <h4>Status Codes with Special Meaning</h4> <div class="panel panel-default table-responsive"> <table class="table table-striped table-responsive"> <thead> <tr> <th style="width: 10em;">Status Code</th> <th style="width: 20em;">Status Text</th> <th>Description</th> </tr> </thead> <tbody> <tr> <td>502</td> <td>Bad Gateway</td> <td>The server returned an invalid response when the Link Checker tried to access the URL.</td> </tr> <tr> <td>504</td> <td>Gateway Timeout</td> <td>The Link Checker was not able to access the URL because it timed out.</td> </tr> </tbody> </table> </div> <h4>Custom Status Codes</h4> <div class="panel panel-default table-responsive"> <table class="table table-striped table-responsive"> <thead> <tr> <th style="width: 10em;">Status Code</th> <th style="width: 20em;">Status Text</th> <th>Description</th> </tr> </thead> </tbody> <tr> <td>601</td> <td>Blocked by robots</td> <td>The Link Checker was not able to access the URL because the access was blocked by the robots exclusion protocol.</td> </tr> <tr> <td>602</td> <td>HTML parse error</td> <td>The HTML code of this page could not be parsed because of an error in the code or because the page was larger than 50 MB.</td> </tr> <tr> <td>603</td> <td>Unknown authority error</td> <td>This status code means that the certificate was signed by an unknown certificate authority. If accessing the page works in your web browser, probably the provided certificate chain is broken. Most, but not all, browsers can handle such situation and download the missing certificates on the fly. If the error was detected on you website, you should fix the origin of the issue and provid the whole chain to all clients.</td> </tr> </tbody> </table> </div> <p><em>Please note that it is possible in rare situations that a website returns these status codes and if this is the case, they probably have another meaning.</em></p> </div> <div role="tabpanel" class="tab-pane" id="glossary{id}"> <h3>Glossary</h3> <h4>Unhandled Resources (mainly blocked by robots.txt)</h4> <p>Websites can prohibit access for web crawlers like the one used by the Link Checker with the robots exclusion protocol (robots.txt file). The Link Checker does respect the robots exclusion protocol for the website it crawls and also for external links.</p> <p>If the blocked links were found on your website, you can add rules for the Link Checker to your robots.txt file and restart the Link Checker. Please see the <a href="https://www.marcobeierer.com/tools/link-checker-faq" target="_blank">FAQs</a> for further information.</p> <h5>Mark URLs as Working</h5> <p>If the blocked links were found on external websites, the Link Checker cannot check the links for you and you have to check each blocked link manually. When you have checked a link and it is working, you can use the <em>Mark as Working</em> button in the result table to mark the link. The marker is saved in your browser storage for one month and the date of the last marking is shown in the result table afterwards.</p> <p>The storage period is limited to one month because the manually checked links can also break and it is recommended to recheck them at least once a month. If you like to recheck them before one month has expired, you can enable the filter to show URLs marked as working in the results and click on <em>Checked</em> button to update the date of the last check.</p> <p>Saving the markers in the browser storage means that nothing is saved when you are using the private browsing mode of your browser. Also if you empty the cache of your browser, the markers may geht deleted.</p> <h5>Mark all with same status code and domain as working</h5> <p>If you have multiple links to the same website that blocks the Link Checker, for example LinkedIn, then you can use the <em>Mark all with same status code and domain as working</em> button to mark all links to the target website as working. This function works the same as when you just mark one link as working (see description above).</p> <p>It is not recommended to use this function as you cannot be sure that the marked links are really working, but the feature was added because it was requested by many users.</p> <h4>Working Redirects</h4> <p>Non-temporary redirects, even if working correctly, have disadvantages like for example increased loading times and should therefore be fixed. Showing working redirects can be enabled/disabled in the settings of the result tab.</p> <h4>Mark URLs as Fixed</h4> <p>To keep an better overview, you can mark URLs as fixed in the result view. The marked URLs are can be hidden in the result. Please note that the fixed markers are just temporary and are reset on the next link check.</p> <h4>Images</h4> <p>Broken images are just checked in the <a href="https://www.marcobeierer.com/tools/link-checker-professional" target="_blank">professional version of the Link Checker</a>.</p> <h4>Videos</h4> <p>Broken embedded YouTube videos are just checked in the <a href="https://www.marcobeierer.com/tools/link-checker-professional" target="_blank">professional version of the Link Checker</a>.</p> </div> <div if="{enableScheduler}" role="tabpanel" class="tab-pane" id="scheduler{id}"> <h3>Scheduler</h3> <linkchecker-scheduler website-url="{websiteURL}" token="{token}" email="{email}" dev="{dev}" login-page-url="{loginPageURL}" login-form-selector="{loginFormSelector}" login-data="{loginData}"> </linkchecker-scheduler> </div> <div if="{!hasToken()}" role="tabpanel" class="tab-pane" id="professional{id}"> <h3>Professional Version</h3> <p>The professional version of the Link Checker allows to check a website with up to 500\'000 URLs and comes with some additional features. It\'s for example possible to:</p> <ul> <li>check embedded images,</li> <li>check YouTube videos,</li> <li>check login protected pages like membership areas or</li> <li>trigger a check once a day automatically and get a summary by mail.</li> </ul> <p>You can <a href="https://www.marcobeierer.com/tools/link-checker-professional" target="_blank">read more about the professional version and purchase a token</a> on my website.</p> <h4>Pricing</h4> <pricing></pricing> <h4>Offers for Web Agencies</h4> <p>Web agencies, and of course all other interested parties, can rent a dedicated Link Checker and Sitemap Generator server. Servers in Germany and Finland are available from 395.00 € per month. Other server locations are available on request against an extra fee.</p> <p>When renting a server, you can offer the services to all your clients and also offer it publicly on your website to potential customers, but public reselling and thus directly competing against the Link Checker or Sitemap Generator is not allowed. If you like to resell tokens, please contact me and we may find a solution that works for both of us.</p> <p>Advantages of a dedicated server are:</p> <ul> <li>No need to manage tokens anymore, you can whitelist individual websites and manage scheduling for all websites from a central admin panel.</li> <li>Faster checks if the server is located near your hosting server.</li> <li>Better performance in general because server resources are not shared with other users.</li> </ul> <p>If interested, please write me an email to <a href="mailto:email@marcobeierer.com">email@marcobeierer.com</a> for an individual offer.</p> </div> <div if="{!hideFeedbackTab}" role="tabpanel" class="tab-pane" id="feedback{id}"> <h3>Your Feedback</h3> <feedback></feedback> </div> </div>', '', '', function(opts) {
		var self = this;

		self.plugin = riot.observable();

		self.message = '';
		self.originSystem = opts.originSystem || 'riot';
		self.data = {};
		self.dev = opts.dev;
		self.enableScheduler = opts.enableScheduler || false;
		self.forceStop = false;
		self.crawlDelayInSeconds = 0;
		self.resultAvailableOnServer = false;
		self.editURLsEndpoint = opts.editUrlsEndpoint;

		self.hideFeedbackTab = opts.hideFeedbackTab || false;

		self.loginPageURL = opts.loginPageUrl;
		self.loginFormSelector = opts.loginFormSelector;
		self.loginData = opts.loginData;

		self.id = opts.id || 0;
		self.email = opts.email || '';

		self.db = localforage.createInstance({
			driver      : localforage.INDEXEDDB,
			name        : 'LinkChecker',
			size 		: 4980736,
			version     : 1.0,
			storeName   : 'resultdata'
		});

		self.switchTab = function(tabName, e) {
			e.preventDefault();

			var tabID = '#tabnav a[href="#' + tabName + self.id + '"';
			jQuery(tabID).tab('show');
		};

		self.on('mount', function() {
			lscache.setBucket('linkchecker-checked-');
			lscache.flushExpired();

			if (self.websiteURL != undefined && self.websiteURL != '') {
				var tokenHeader = '';
				if (self.token != '') {
					tokenHeader = 'BEARER ' + self.token;
				}

				var url64 = self.websiteURL64();
				var url = getURL(url64 + '/running', true);

				jQuery.ajax({
					method: 'GET',
					url: url,
					headers: {
						'Authorization': tokenHeader,
					}
				}).done(function(data, textStatus, xhr) {
					if (data.Running) {
						self.start();
					} else {
						self.setMessage('The Link Checker was not started yet.', 'info');
					}

					self.resultAvailableOnServer = data.ResultAvailable;
					self.loadDataFromDB(data.ResultAvailable);
				})
				.fail(function(xhr) {
					self.setMessage('The Link Checker was not started yet.', 'info');

					self.loadDataFromDB(false);
				});
			} else {

				setTimeout(function() {
					self.setMessage('The Link Checker was not started yet.', 'info');
				}, 500);

				self.loadDataFromDB(false);
			}

			jQuery('[data-toggle="tooltip"]').tooltip()
		});

		self.exportable = function() {
			return self.token != '' && self.resultAvailableOnServer;
		}

		self.exportableTitle = function() {
			if (self.token == '') {
				return 'Export as CSV file is only available for customers of the professional version.';
			}

			if (!self.resultAvailableOnServer) {
				return 'No result available on the server. Please start a check if not already done and/or wait till the first check has finished.';
			}

			return 'Export the last result as CSV file for advanced processing.';
		}

		self.saveDataToDB = function(data) {
			self.db.setItem(self.dbKey(), pako.deflate(JSON.stringify(data), { to: 'string' }), function(err) {
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
		};

		self.loadDataFromDB = function(resultAvailableOnServer) {
			self.setMessage('Loading the result of the last check from cache, please wait a moment.', 'warning', 'db');

			self.db.removeItem('data', function(err) {
				if (err != null) {
					console.error(err);
					console.error(err.message);
				}
			});

			self.db.getItem(self.dbKey(), function(err, data) {
				if (err != null) {
					console.error(err);
					console.error(err.message);
					self.setMessage('Loading the result of the last check failed:<br />' + err.name, 'warning', 'db');
					return;
				}

				if (data == null) {
					self.setMessage('No result available in the cache.', 'info', 'db');

					if (resultAvailableOnServer) {
						self.loadDataFromServer();
					}

					return;
				}

				self.data = JSON.parse(pako.inflate(data, { to: 'string' }));
				self.resultDataReady(self.data, true, false);
				self.update();
			});
		}

		self.downloadCSVFile = function(e) {
			e.preventDefault();

			if (self.token == '') {
				return;
			}

			var url64 = self.websiteURL64();
			var url = getURL(url64 + '/csv', true);

			loadFile(url, self.token, 'result.csv', loadFileDownloadCallback);
		};

		self.loadDataFromServer = function() {
			if (self.token == '') {
				return;
			}
			var tokenHeader = 'BEARER ' + self.token;

			var url64 = self.websiteURL64();
			var url = getURL(url64 + '/json');

			jQuery.ajax({
				method: 'GET',
				url: url,
				headers: {
					'Authorization': tokenHeader,
				}
			})
			.done(function(data) {

				self.resultDataReady(data, false, true);

				self.resetData();
				self.data = data;

				self.saveDataToDB(data);
			})
			.fail(function(xhr) {
				console.log('fetching saved result failed');
			})
			.always(function() {
				self.update();
			});
		};

		self.dbKey = function() {
			if (self.websiteURL != '') {
				return self.websiteURL;
			}
			return 'data' + self.id;
		};

		function getURL(url64, runningRequest) {

			var disableCookies = '1';
			if (self.hasFormLogin()) {

				disableCookies = '0';
			}

			var url = 'https://api.marcobeierer.com/linkchecker/v1/' + url64 + '?origin_system=' + self.originSystem + '&max_fetchers=' + self.maxFetchers + '&disable_cookies=' + disableCookies;
			if (self.dev == '1' && runningRequest !== true) {
				url = 'sample_data/current.json?_=' + Date.now();
			} else if (self.dev == '2') {
				url = 'http://marco-desktop:9999/linkchecker/v1/' + url64 + '?origin_system=' + self.originSystem + '&max_fetchers=' + self.maxFetchers + '&disable_cookies=' + disableCookies;
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

		self.datetimeAt = function(val) {
			var datetime = self.datetime(val);
			return datetime.replace(',', ' at');
		};

		self.hasToken = function() {
			return self.token || (self.data.Stats != undefined && self.data.Stats.TokenUsed);
		}

		self.hasFormLogin = function() {
			return self.loginPageURL && self.loginPageURL != '' && self.loginFormSelector && self.loginFormSelector != '';
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

		self.resetData = function() {
			self.db.removeItem(self.dbKey(), function(err) {
				if (err != null) {
					console.error(err);
					console.error(err.message);
					self.setMessage('Could not remove old result from cache:<br />' + err.name, 'warning', 'db');
				}
			});
			self.data = {};

			lscache.setBucket('linkchecker-fixed-');
			lscache.flush();

			self.update();
		}

		this.start = function() {
			opts.linkchecker.trigger('started');
			self.plugin.trigger('started')

			self.urlsCrawledCount = 0;
			self.checkedLinksCount = 0;

			self.setMessage('Your website is being checked. Please wait a moment. You can watch the progress in the Progress tab below.', 'warning');
			self.resultsMessage = 'Please wait until the check has finished.';

			var url64 = self.websiteURL64();

			self.retries = 0;

			self.doRequest = function() {
				var tokenHeader = '';
				if (self.token != '') {
					tokenHeader = 'BEARER ' + self.token;
				}

				var url = getURL(url64);
				var credentials = '';

				if (self.hasFormLogin()) {
					credentials = JSON.stringify({
						'login_page_url': self.loginPageURL,
						'form_selector': self.loginFormSelector,
						'data': self.loginData,
					});
				}

				jQuery.ajax({
					method: 'GET',
					url: url,
					headers: {
						'Authorization': tokenHeader,
						'X-Credentials': credentials,
					}
				}).done(function(data) {
					self.retries = 0;

					self.urlsCrawledCount = data.URLsCrawledCount;
					self.checkedLinksCount = data.CheckedLinksCount;
					self.crawlDelayInSeconds = data.CrawlDelayInSeconds;

					if (data.Finished) {
						self.resultDataReady(data, false, false);
						opts.linkchecker.trigger('stopped');

						if (self.token != '') {
							self.resultAvailableOnServer = true;
						}

						self.resetData();
						self.data = data;

						self.saveDataToDB(data);
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
						self.setMessage("The check of your website failed. Please try it again or contact the developer of the extensions.<br />Status Code: " + statusCode + "<br />Response Text: " + xhr.responseText, 'danger');
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
				self.urlsCrawledCount = 0;
				self.checkedLinksCount = 0;
			}).fail(function(xhr) {
				self.setMessage("Could not stop the check because the connection to the server failed.", 'danger');
			}).always(function() {
				self.forceStop = false;
				opts.linkchecker.trigger('stopped');
				self.update();
			});
		}

		self.resultDataReady = function(data, loadedFromDB, loadedFromServerBackup) {
			if (data.Finished) {
				self.resultsMessage = 'No broken resources found or no data available for the enabled filters.';
				self.plugin.trigger('result-data-ready', data, loadedFromDB, loadedFromServerBackup);
			}
		}
});
