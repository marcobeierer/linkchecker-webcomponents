'use strict';

riot.tag2('datatable', '<div class="panel panel-default table-responsive" riot-style="margin-bottom: {opts.marginBottom}"> <table class="table {opts.tableClass}"> <thead if="{showTableHeader}"> <tr> <th each="{column, index in columns}" riot-style="width: {column.width}"> {tr(column.label)} </th> </tr> </thead> <tbody> <tr if="{!data || (Array.isArray(data) && data.length == 0) || Object.keys(data).length == 0}"> <td colspan="{columns.length}">{message}</td> </tr> <tr class="{rowClassCallback(elem)}" each="{elem, index in data}"> <td each="{column, index2 in columns}" colspan="{column.colspan}" if="{column.showBody == undefined}" riot-style="width: {column.width}"> <virtual if="{column.linkCallback == undefined}"> <span if="{column.callback != undefined && column.type == \'subtable\'}"> <datatable message="{column.message}" columns="{column.callback(elem, index)}" data="{elem}" actions="{actions}" no-table-footer no-table-header margin-bottom="0"></datatable> </span> <span if="{column.callback != undefined && column.type != \'subtable\'}"> {column.callback(elem, index)} </span> <span if="{column.callback == undefined && elem[column.value] != undefined}"> {elem[column.value]} </span> <span if="{column.callback == undefined && elem[column.label] != undefined}"> {elem[column.label]} </span> </virtual> <a if="{column.linkCallback != undefined}" href="{column.linkCallback(elem, index)}" target="_blank"> <span if="{column.callback != undefined && column.type != \'subtable\'}"> {column.callback(elem, index)} </span> <span if="{column.callback == undefined && elem[column.label] != undefined}"> {elem[column.label]} </span> </a> <virtual each="{action in actions}" if="{column.label == \'Actions\'}"> <a if="{action.action == \'callback\'}" disabled="{action.isDisabledCallback !== undefined && action.isDisabledCallback(elem)}" onclick="{action.callback.bind(this, elem)}" class="btn btn-sm btn-{action.btnType}"> {(action.labelCallback !== undefined && action.labelCallback(elem)) || tr(action.label)}</a> <a href="{action.url}/?id={encodeURIComponent(elem[\'ID\'])}" if="{action.action == \'link\'}" class="btn-flat">{tr(action.label)}</a> <a data-toggle="modal" data-target="{action.target}" onclick="{modalOpened}" if="{action.action == \'modal-link\'}" class="btn">{tr(action.label)}</a> </virtual> </td> </tr> </tbody> <tfoot if="{showTableFooter}"> <tr> <th each="{column, index in columns}"> {tr(column.label)} </th> </tr> </tfoot> </table> </div>', '', '', function(opts) {
		var self = this;

		self.columns = opts.columns || [];
		self.columnNames = opts.columnNames;
		self.events = opts.events || riot.observable();

		self.disableLinking = opts.disableLinking === 'true';
		self.rowClassCallback = opts.rowClassCallback || function() {};

		self.showTableHeader = opts.noTableHeader === undefined;
		self.showTableFooter = opts.noTableFooter === undefined;

		self.data = opts.data;

		self.tr = opts.trFunc || function(str) {
			return str;
		};

		self.modalOpened = function(e) {
			self.events.trigger('modal-opened', e, this.elem, self);
		}

		self.linkBaseURL = opts.linkBaseurl || '';
		self.actions = opts.actions;

		if (opts.url == undefined) {
			self.url = '';
		} else {
			self.url = replacePlaceholdersWithQueryVariables(opts.url);
		}

		self.message = 'No data loaded or available yet.';

		self.on('mount', function() {
			self.events.on('create', onCreate);

			if (opts.actions !== undefined) {
				self.actions = opts.actions;
			}
		});

		self.on('unmount', function() {
			self.events.off('create', onCreate);
		});

		self.on('update', function() {
			if (opts.message !== undefined) {
				self.message = opts.message;
			}

			if (opts.actions !== undefined) {
				self.actions = opts.actions;
			}
		});

		var onCreate = function(elem) {
			self.data.unshift(elem);
			self.update();
		};
});
riot.tag2('linkchecker-form', '<form onsubmit="{submit}" style="margin-bottom: 20px;"> <div class="form-group"> <label>Website URL</label> <input ref="websiteURL" type="url" class="form-control" placeholder="The URL of the website to check, for example \'https://www.marcobeierer.com\'." disabled="{disabled}" required> </div> <div class="form-group"> <label>Token</label> <textarea ref="token" class="form-control" style="min-height: 100px" placeholder="A token is only necessary to check a website with more than 500 internal or external links or if you like to use the paid extra features." disabled="{disabled}"></textarea> </div> <button class="btn btn-default" type="submit" disabled="{disabled}">Check your website</button> </form>', '', '', function(opts) {
		var self = this;

		self.disabled = false;

		self.on('mount', function() {
			if (opts.websiteUrl != undefined) {
				this.refs.websiteURL.value = opts.websiteUrl;
			}
		});

		this.submit = function(e) {
			e.preventDefault();
			opts.linkchecker.trigger('start', this.refs.websiteURL.value, this.refs.token.value);
		}.bind(this)

		opts.linkchecker.on('started', function() {
			self.disabled = true;
		});

		opts.linkchecker.on('stopped', function() {
			self.disabled = false;
			self.update();
		});
});
riot.tag2('linkchecker-scheduler', '<div class="alert alert-{messageType}"> <raw content="{message}"></raw> </div> <div class="panel panel-primary" if="{!registered}"> <div class="panel-heading">Register your website</div> <div class="panel-body"> <p>If you register your site to the scheduler, a link check is automatically triggered once a day and you receive an email notification with a summary report after the check has finished. If a dead link was found, you could use the default Link Checker interface to fetch the detailed results.</p> <form onsubmit="{register}"> <input type="hidden" name="Service" value="Link Checker"> <input type="hidden" name="IntervalInNs" value="86400000000000"> <div style="display: none;" class="form-group"> <label>Website URL</label> <input class="form-control" name="URL" type="text" riot-value="{websiteURL}" readonly="readonly" required> </div> <div class="form-group"> <label>Email address for notifications</label> <input class="form-control" name="Email" riot-value="{email}" required type="{\'email\'}"> </div> <button class="btn btn-default" type="submit">Register</button> </form> </div> </div> <div class="panel panel-primary" if="{registered}"> <div class="panel-heading">Deregister your website</div> <div class="panel-body"> <p>Your site is registered to the scheduler and you should receive status emails regularly. Use the button below if you like to disable the automated checks.</p> <form onsubmit="{deregister}"> <input type="hidden" name="Service" value="Link Checker"> <div style="display: none;" class="form-group"> <label>Website URL</label> <input class="form-control" name="URL" type="text" riot-value="{websiteURL}" readonly="readonly" required> </div> <button class="btn btn-default" type="submit">Deregister</button> </form> </div> </div>', '', '', function(opts) {
		var self = this;

		self.registered = false;
		self.websiteURL = opts.websiteUrl || '';
		self.token = opts.token || '';
		self.email = opts.email || '';

		self.apiURL = 'https://api.marcobeierer.com/scheduler/v1/';
		if (opts.dev === '1') {
			self.apiURL = 'http://marco-desktop:9999/scheduler/v1/';
		}

		this.setMessage = function(text, type) {
			self.message = text;
			self.messageType = type;
			self.update();
		}.bind(this)

		self.setMessage('Loading status.', 'info');

		this.tokenHeader = function() {
			if (self.token != '') {
				return 'BEARER ' + self.token;
			}
			return '';
		}.bind(this)

		this.status = function() {
			jQuery.ajax({
				method: 'GET',
				url: self.apiURL + '?Service=Link Checker&URL=' + self.websiteURL,
				headers: {
					'Authorization': self.tokenHeader(),
				}
			}).done(function(data, textStatus, xhr) {
				if (xhr.status == 204) {
					self.setMessage('Your website isn\'t registered for the scheduler currently. Please use the form below to register your site.', 'info');
					self.registered = false;
				} else {
					self.setMessage('Your website is registered to the scheduler currently. You can use the form below to deregister your site.', 'info');
					self.registered = true;
				}
			}).fail(function(xhr, textStatus, error) {
				if (xhr.status == 401) {
					self.setMessage('The validation of your token failed. The token is invalid or has expired. Please try it again or contact me if the token should be valid.', 'danger');
				} else if (xhr.status == 504 || xhr.status == 503) {
					self.setMessage('The backend server is temporarily unavailable. Please try it again later.', 'danger');
				} else {
					self.setMessage('Something went wrong. Please try it again later.', 'danger');
				}
			}).always(function() {
				self.update();
			});
		}.bind(this)
		self.status();

		this.register = function(e) {
			e.preventDefault();

			var obj = jQuery(e.target).serializeObject();
			obj.IntervalInNs = parseInt(obj.IntervalInNs);
			var data = JSON.stringify(obj);

			jQuery.ajax({
				method: 'POST',
				url: self.apiURL,
				data: data,
				dataType: 'text',
				headers: {
					'Authorization': self.tokenHeader(),
				}
			}).done(function(data, textStatus, xhr) {
				self.setMessage('You have successfully registered your website to the scheduler.', 'success');
				self.registered = true;
			}).fail(function(xhr, textStatus, error) {
				console.log(xhr.status);
				if (xhr.status == 401) {
					self.setMessage('The validation of your token failed. The token is invalid or has expired. Please try it again or contact me if the token should be valid.', 'danger');
				} else if (xhr.status == 504 || xhr.status == 503) {
					self.setMessage('The backend server is temporarily unavailable. Please try it again later.', 'danger');
				} else {
					self.setMessage('Something went wrong. Please try it again later.', 'danger');
				}
			}).always(function() {
				self.update();
			});
		}.bind(this)

		this.deregister = function(e) {
			e.preventDefault();
			var data = jQuery(e.target).serializeJSON();

			jQuery.ajax({
				method: 'DELETE',
				url: self.apiURL,
				data: data,
				dataType: 'text',
				headers: {
					'Authorization': self.tokenHeader(),
				}
			}).done(function(data, textStatus, xhr) {
				self.setMessage('You have successfully deregistered your website from the scheduler.', 'success');
				self.registered = false;
			}).fail(function(xhr, textStatus, error) {
				self.setMessage('Something went wrong. Please try it again later.', 'danger');
			}).always(function() {
				self.update();
			});
		}.bind(this)
});
riot.tag2('linkchecker', '<form if="{showButton}" onsubmit="{submit}" style="margin-bottom: 20px;"> <button class="btn btn-default" type="submit" disabled="{disabled}">Check your website</button> </form> <div class="alert alert-{messageType}"> <raw content="{message}"></raw> </div> <div class="panel panel-default" style="width: 550px; max-width: 100%;"> <div class="panel-heading">Stats</div> <table class="table table-bordered"> <tr> <td>Number of crawled HTML pages on your site</td> <td class="text-right" style="width: 150px;">{urlsCrawledCount}</td> </tr> <tr> <td>Number of checked internal and external resources</td> <td class="text-right">{checkedLinksCount}</td> </tr> </table> </div> <h3>Broken Links</h3> <p>The table below shows all broken links. Please note that the fixed markers are just temporary and are reset with the next link check.</p> <datatable table-class="table-striped responsive-table" columns="{urlsWithBrokenLinksColumns}" data="{urlsWithBrokenLinks}" actions="{brokenLinksActions}" message="{resultsMessage}"> </datatable> <h3>Links blocked by robots.txt</h3> <p>Websites can prohibit access for web crawlers like the one used by the Link Checker with the robots exclusion protocol. You find all links the Link Checker was not allowed to access in the table below. If the blocked links were found on your on website, you can add rules for the Link Checker to your robots.txt file and restart the Link Checker. Please see the <a href="https://www.marcobeierer.com/tools/link-checker-faq">FAQs</a> for further information.</p> <p>External links that are blocked by a robots.txt file cannot be checked by the Link Checker and need to be verified manually. If you have done this, you could mark them as working. Each marker is saved for one month in your browsers cache and the date of the last marking is shown in the table below.</p> <datatable table-class="table-striped responsive-table" columns="{urlsWithLinksBlockedByRobotsColumns}" data="{urlsWithLinksBlockedByRobots}" actions="{blockedLinksActions}" message="{resultsMessage}"> </datatable> <h3 if="{token}">Broken Images</h3> <p>The table below shows all broken images. Please note that the fixed markers are just temporary and are reset for the next link check.</p> <datatable if="{token}" table-class="table-striped responsive-table" columns="{urlsWithDeadImagesColumns}" data="{urlsWithDeadImages}" actions="{brokenImagesActions}" message="{resultsMessage}"> </datatable> <h3>Custom Status Codes</h3> <p>The Link Checker uses the following custom status codes:</p> <ul> <li>598 - Blocked by robots: The Link Checker was not able to access the page because the access was blocked by the robots exclusion protocol.</li> <li>599 - HTML parse error: The HTML code of this page could not be parsed because of an error in the code or because the page was larger than 50 MB.</li> </ul> <p><em>Please note that it is also possible that a website returns these status codes and if this is the case, they probably have another meaning.</em></p> <h3>Common Status Codes</h3> <ul> <li>502 - Bad Gateway: The server returned an invalid response when the Link Checker tried to access the URL.</li> <li>504 - Gateway Timeout: The Link Checker was not able to access the URL because it timed out.</li> </ul>', '', '', function(opts) {
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
					lscache.set(elem.FoundOnURL + '|' + elem.URL, Date.now(), 60 * 24 * 30);
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

						self.resultsMessage = 'Nothing found, everything seems fine here.';

						if (!jQuery.isEmptyObject(data.DeadLinks)) {

							for (var url in data.DeadLinks) {
								self.urlsWithBrokenLinks[url] = {};
								self.urlsWithLinksBlockedByRobots[url] = {};

								data.DeadLinks[url].forEach(function(obj) {
									obj.FoundOnURL = url;

									if (obj.StatusCode === 598) {
										self.urlsWithLinksBlockedByRobots[url][obj.URL] = obj;
									} else {
										self.urlsWithBrokenLinks[url][obj.URL] = obj;
									}
								});

								if (Object.keys(self.urlsWithBrokenLinks[url]).length == 0) {
									delete self.urlsWithBrokenLinks[url];
								}

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
					} else {
						setTimeout(self.doRequest, 1000);
					}
				}).fail(function(xhr) {
					opts.linkchecker.trigger('stopped');

					var statusCode = xhr.status;

					if (statusCode == 401) {
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
		}.bind(this)
});
riot.tag2('raw', '<span></span>', '', '', function(opts) {
		var self = this;

		self.root.innerHTML = opts.content;

		self.on('update', function() {
			self.root.innerHTML = opts.content
		});
});
riot.tag2('resulttable', '<div class="panel panel-default table-responsive"> <table class="table table-striped"> <thead> <tr> <th style="width: 35%;">{thCol1}</th> <th>{thCol2}</th> <th style="width: 10em;">{thCol3}</th> </tr> </thead> <tbody> <tr if="{!data || Object.keys(data).length === 0}"> <td>{resultsMessage}</td> <td></td> <td></td> </tr> <tr each="{deadResources, foundOnURL in data}"> <td><a href="{foundOnURL}" target="_blank">{foundOnURL}</a></td> <td colspan="2"> <div class="panel panel-default" style="margin-bottom: 0;"> <table class="table"> <tr each="{deadResource in deadResources}"> <td><a href="{deadResource.URL}" target="_blank">{deadResource.URL}</a></td> <td style="width: 9em;">{deadResource.StatusCode}</td> </tr> </table> </div> </td> </tr> </tbody> <tfoot> <tr> <th>{thCol1}</th> <th>{thCol2}</th> <th>{thCol3}</th> </tr> </tfoot> </table> </div>', '', '', function(opts) {
		var self = this;

		self.thCol1 = opts.thCol1;
		self.thCol2 = opts.thCol2;
		self.thCol3 = opts.thCol3;

		self.resultsMessage = opts.resultsMessage;
		self.data = opts.data;

		self.on('update', function() {
			self.resultsMessage = opts.resultsMessage;
			self.data = opts.data;
		});

});
