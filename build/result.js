'use strict'

riot.tag2('result', '<div class="btn-toolbar toolbar"> <div class="btn-group" role="group"> <button type="button" class="btn {btn-primary: showLinks} {btn-default: !showLinks}" onclick="{toggle.bind(this, \'links\')}">Links</button> <button type="button" class="btn {btn-primary: showImages} {btn-default: !showImages} {disabled: !parent.hasToken()}" onclick="{toggle.bind(this, \'images\')}">Images</button> <button type="button" class="btn {btn-primary: showVideos} {btn-default: !showVideos} {disabled: !parent.hasToken()}" onclick="{toggle.bind(this, \'videos\')}">Videos</button> </div> <div class="btn-group" role="group"> <button type="button" class="btn {btn-primary: showUnhandled} {btn-default: !showUnhandled}" onclick="{toggle.bind(this, \'unhandled\')}">Unhandled</button> <button type="button" class="btn {btn-primary: showWorkingRedirects} {btn-default: !showWorkingRedirects}" onclick="{toggle.bind(this, \'workingRedirects\')}">Working Redirects</button> </div> <div class="btn-group" role="group"> <button type="button" class="btn {btn-primary: showMarkedAsFixed} {btn-default: !showMarkedAsFixed}" onclick="{toggle.bind(this, \'markedAsFixed\')}">Marked as Fixed</button> <button type="button" class="btn {btn-primary: showMarkedAsWorking} {btn-default: !showMarkedAsWorking}" onclick="{toggle.bind(this, \'markedAsWorking\')}">Marked as Working</button> </div> <div class="btn-group" role="group"> <button type="button" class="btn btn-default">URLs per Page: {pageSize}</button> <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdownx" aria-haspopup="true" aria-expanded="false"> <span class="caret"></span> <span class="sr-only">Toggle Dropdown</span> </button> <ul class="dropdown-menu"> <li class="text-right" if="{pageSize != 1}"><a onclick="{setPageSize.bind(this, 1)}" href="#">1</a></li> <li class="text-right" if="{pageSize != 10}"><a onclick="{setPageSize.bind(this, 10)}" href="#">10</a></li> <li class="text-right" if="{pageSize != 100}"><a onclick="{setPageSize.bind(this, 100)}" href="#">100</a></li> </ul> </div> </div> <nav> <ul class="pager"> <li class="previous {disabled: !hasPreviousPage()}"><a href="#" onclick="{previousPage}"><span aria-hidden="true">&larr;</span> Previous</a></li> <li class="next {disabled: !hasNextPage()}"><a href="#" onclick="{nextPage}">Next <span aria-hidden="true">&rarr;</span></a></li> </ul> </nav> <div class="panel panel-default table-responsive"> <table class="table table-striped table-responsive"> <thead> <tr> <th style="width: 35%;">URL where the broken resources were found</th> <th style="width: ">Broken Resources</th> <th style="width: 9em;">Type</th> <th style="width: 9em;">Status</th> <th style="width: 14em;">Actions</th> </tr> </thead> <tbody> <tr if="{!haveItemsToShow()}"> <td colspan="5">{parent.resultsMessage}</td> </tr> <tr data-is="result-row" plugin="{plugin}" each="{item in paginate()}" url="{item.FoundOnURL}" resources="{item.Resources}" edit-url="{editURLs[item.FoundOnURL]}"> </tr> </tbody> <tfoot> <tr> <th style="width: 35%;">URL where the broken resources were found</th> <th style="width: ">Broken Resources</th> <th style="width: 9em;">Type</th> <th style="width: 9em;">Status</th> <th style="width: 14em;">Actions</th> </tr> </tfoot> </table> </div> <nav> <ul class="pager"> <li class="previous {disabled: !hasPreviousPage()}"><a href="#" onclick="{previousPage}"><span aria-hidden="true">&larr;</span> Previous</a></li> <li class="next {disabled: !hasNextPage()}"><a href="#" onclick="{nextPage}">Next <span aria-hidden="true">&rarr;</span></a></li> </ul> </nav>', '', '', function(opts) {


		var self = this;

		self.plugin = opts.plugin || console.error('no plugin set');
		self.editURLsEndpoint = opts.editUrlsEndpoint;

		self.result = [];
		self.editURLs = {};

		lscache.setBucket('linkchecker-settings-');

		self.currentPage = lscache.get('currentPage') || 0;
		self.pageSize = lscache.get('pageSize') || 10;

		self.showLinks = lscache.get('showLinks') || true;
		self.showImages = (lscache.get('showImages') || true) && self.parent.hasToken();
		self.showVideos = (lscache.get('showVideos') || true) && self.parent.hasToken();
		self.showUnhandled = lscache.get('showUnhandled') || true;
		self.showWorkingRedirects = lscache.get('showWorkingRedirects') || false;

		self.showMarkedAsFixed = lscache.get('showMarkedAsFixed') || false;
		self.showMarkedAsWorking = lscache.get('showMarkedAsWorking') || false;

		self.on('mount', function() {
		});

		self.toggle = function(type, e) {
			self.resetCurrentPage();

			lscache.setBucket('linkchecker-settings-');
			if (type == 'links') {
				self.showLinks = !self.showLinks;
				lscache.set('showLinks', self.showLinks);
			}
			else if (type == 'images') {
				self.showImages = !self.showImages;
				lscache.set('showImages', self.showImages);
			}
			else if (type == 'videos') {
				self.showVideos = !self.showVideos;
				lscache.set('showVideos', self.showVideos);
			}
			else if (type == 'unhandled') {
				self.showUnhandled = !self.showUnhandled;
				lscache.set('showUnhandled', self.showUnhandled);
			}
			else if (type == 'workingRedirects') {
				self.showWorkingRedirects = !self.showWorkingRedirects;
				lscache.set('showWorkingRedirects', self.showWorkingRedirects);
			}
			else if (type == 'markedAsFixed') {
				self.showMarkedAsFixed = !self.showMarkedAsFixed;
				lscache.set('showMarkedAsFixed', self.showMarkedAsFixed);
			}
			else if (type == 'markedAsWorking') {
				self.showMarkedAsWorking = !self.showMarkedAsWorking;
				lscache.set('showMarkedAsWorking', self.showMarkedAsWorking);
			}
			else {
				console.error('no rule for type ' + type);
			}
		}

		self.setPageSize = function(size, e) {
			e.preventDefault();

			self.resetCurrentPage();

			self.pageSize = size;

			lscache.setBucket('linkchecker-settings-');
			lscache.set('pageSize', self.pageSize);
		}

		self.loadEditURLs = function() {
			if (self.editURLsEndpoint == undefined) {
				return;
			}

			var urls = [];
			self.paginate().forEach(function(item) {
				if (self.editURLs[item.FoundOnURL] === undefined) {
					urls.push(item.FoundOnURL);
				}
			});

			if (urls.length == 0) {
				return;
			}

			var data = {
				urls: urls
			}

			jQuery.ajax({
				method: 'POST',
				url: self.editURLsEndpoint,
				dataType: 'json',
				data: data
			})
			.done(function(data, textStatus, xhr) {
				for (var foundOnURL in data) {
					self.editURLs[foundOnURL] = data[foundOnURL];
				}

				urls.forEach(function(foundOnURL) {
					if (self.editURLs[foundOnURL] === undefined) {
						self.editURLs[foundOnURL] = null;
					}
				});

				self.update();
			});
		};

		self.haveItemsToShow = function() {
			return self.paginate().length > 0;
		}

		self.paginate = function() {
			return self.rowsToShow().slice(self.start(), self.end());
		}

		self.rowsToShow = function() {
			var rowsToShow = [];

			self.result.forEach(function(row) {
				if (self.hasSomethingToShow(row.Resources)) {
					rowsToShow.push(row);
				}
			});

			return rowsToShow;
		};

		self.countPages = function() {
			var countRows = 0;

			self.result.forEach(function(row) {
				if (self.hasSomethingToShow(row.Resources)) {
					countRows++;
				}
			});

			return Math.ceil(countRows / self.pageSize);
		};

		self.nextPage = function(e) {
			e.preventDefault();
			if (self.hasNextPage()) {
				self.setCurrentPage(self.currentPage + 1);
			}
		}

		self.previousPage = function(e) {
			e.preventDefault();
			if (self.hasPreviousPage()) {
				self.setCurrentPage(self.currentPage - 1);
			}
		}

		self.hasNextPage = function() {
			return self.currentPage < (self.countPages() - 1);

		}

		self.hasPreviousPage = function() {
			return self.currentPage > 0;
		}

		self.hasSomethingToShow = function(resources) {
			return resources.some(function(resource) {
				return self.showResource(resource);
			});
		};

		self.resetCurrentPage = function() {
			self.setCurrentPage(0);
		};

		self.setCurrentPage = function(value) {
			self.currentPage = value;

			lscache.setBucket('linkchecker-settings-');
			lscache.set('currentPage', self.currentPage);

			self.loadEditURLs();
		}

		self.showResource = function(resource) {
			var type = resource.Type;

			if (resource.IsMarkedAsFixed && !self.showMarkedAsFixed) {
				return false;
			}

			if (resource.IsMarkedAsWorking && !self.showMarkedAsWorking) {
				return false;
			}

			if (!self.showWorkingRedirects && resource.IsRedirected && resource.StatusCode < 300) {
				return false;
			}

			if (!self.showUnhandled && resource.IsUnhandled) {
				return false
			}

			return (self.showLinks && type == 'Link') ||
				(self.showImages && type == 'Image') ||
				(self.showVideos && type == 'Video');

		};

		self.start = function() {
			return self.currentPage * self.pageSize;
		};

		self.end = function() {
			return (self.currentPage + 1) * self.pageSize;
		};

		self.plugin.on('result-data-ready', function(data, loadedFromDB, loadedFromServerBackup) {
			self.resetCurrentPage();
			self.result = [];

			self.onload(data, loadedFromDB, loadedFromServerBackup);
			self.update();

			self.loadEditURLs();
		});

		self.plugin.on('started', function() {
		});

		self.onload = function(data, loadedFromDB, loadedFromServerBackup) {
			if (loadedFromDB || loadedFromServerBackup) {
				var typex = 'cache';
				if (loadedFromServerBackup) {
					typex = 'server';
				}

				var message = "The result of your last check has been loaded from the " + typex + " successfully. Please see it below.";
				var type = 'success';

				if (data.LimitReached) {
					message += "<br />Please note that the check reached the URL limit and thus the Link Checker has not checked your whole website. You can buy a token for the <a href=\"https://www.marcobeierer.com/purchase\">Link Checker Professional</a> to check up to 500'000 URLs.";
					type = 'danger';
				}

				self.setMessage(message, type, 'db');

			} else {
				var message = "Your website has been checked successfully. Please see the result below.";
				var type = 'success';

				if (data.Stats != undefined && !data.Stats.TokenUsed) {
					message += "<br />If you additionally like to check your site for <strong>broken images</strong> or like to use the scheduler for an <strong>automatically triggered daily check</strong>, then have a look at the <a href=\"https://www.marcobeierer.com/purchase\">Link Checker Professional</a>.";
				}

				if (data.LimitReached) {
					message = "The URL limit was reached. The Link Checker has not checked your whole website. You can buy a token for the <a href=\"https://www.marcobeierer.com/purchase\">Link Checker Professional</a> to check up to 500'000 URLs.";
					type = 'danger';
				}

				self.setMessage(message, type);
				self.setMessage('', 'success', 'db');
			}

			self.resultsMessage = 'Nothing is broken, everything seems to be fine.';

			var start = new Date();

			var result = {};

			self.addToResult(result, data.DeadLinks, 'Link', false);
			self.addToResult(result, data.UnhandledLinkedResources, 'Link', true);
			self.addToResult(result, data.DeadEmbeddedImages, 'Image', false);
			self.addToResult(result, data.DeadEmbeddedYouTubeVideos, 'Video', false);
			self.addToResult(result, data.UnhandledEmbeddedResources, 'Unknown', true);

			var resultx = [];
			var keys = Object.keys(result);

			for (var i = 0; i < keys.length; i++) {
				var key = keys[i];

				var row = {
					FoundOnURL: key,
					Resources: result[key],
				}

				resultx.push(row);
			}

			self.result = resultx;

		}

		self.addToResult = function(result, data, type, unhandled) {
			if (!jQuery.isEmptyObject(data)) {
				for (var foundOnURL in data) {
					var resultResources = result[foundOnURL];
					var resourcesToAdd = data[foundOnURL];

					if (resultResources === undefined) {
						resultResources = [];
					}

					if (resourcesToAdd === undefined) {
						resourcesToAdd = [];
					}

					resourcesToAdd.forEach(function(resource) {
						resource.Type = type;
						resource.IsUnhandled = unhandled;

						var key = self.keyForResource(foundOnURL, resource.URL, resource.Type);
						var keyForAllPages = self.keyForResource('*', resource.URL, resource.Type);
						lscache.setBucket('linkchecker-fixed-');
						if (lscache.get(key) === true || lscache.get(keyForAllPages) === true) {
							resource.IsMarkedAsFixed = true;
						}

						lscache.setBucket('linkchecker-checked-');
						if (resource.IsUnhandled) {
							var datex = lscache.get(resource.URL);
							if (datex != null) {
								resource.IsMarkedAsWorking = datex;
							}
						}
					});

					result[foundOnURL] = resultResources.concat(resourcesToAdd);
				}
			}
		}

		self.keyForResource = function(foundOnURL, resourceURL, resourceType) {

			return foundOnURL + resourceURL + resourceType;
		}

		self.setMessage = function(text, type, name) {
			self.plugin.trigger('set-message', text, type, name);
		}

		self.setMarkedAsFixedOnAllPages = function(resourceURL, resourceType) {
			self.result.forEach(function(row) {
				row.Resources.forEach(function(resource) {
					if (resourceURL == resource.URL) {
						resource.IsMarkedAsFixed = true;
					}
				});
			});

			var key = self.keyForResource('*', resourceURL, resourceType);

			lscache.setBucket('linkchecker-fixed-');
			lscache.set(key, true);
		}

		self.setMarkedAsWorking = function(resourceURL, datex) {
			self.result.forEach(function(row) {
				row.Resources.forEach(function(resource) {
					if (resourceURL == resource.URL) {
						resource.IsMarkedAsWorking = datex;
					}
				});
			});

			lscache.setBucket('linkchecker-checked-');
			lscache.set(resourceURL, datex, 60 * 24 * 30);
		}
});
