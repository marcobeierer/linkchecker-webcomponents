'use strict'

<result>
	<nav aria-label="...">
		<ul class="pager">
			<li class="previous { disabled: !hasPreviousPage() }"><a href="#" onclick="{ previousPage }"><span aria-hidden="true">&larr;</span> Previous</a></li>
			<li class="next { disabled: !hasNextPage() }"><a href="#" onclick="{ nextPage }">Next <span aria-hidden="true">&rarr;</span></a></li>
		</ul>
	</nav>

	<div class="panel panel-default table-responsive">
		<table class="table table-striped table-responsive">
			<thead>
				<tr>
					<th style="width: 35%;">URL where the broken resources were found</th>
					<th style="width: ">Broken Resources</th>
					<th style="width: 9em;">Type</th>
					<th style="width: 9em;">Status</th>
					<th style="width: 11em;">Actions</th>
				</tr>
			</thead>
			<tbody>
				<tr 
					data-is="result-row"
					plugin="{ plugin }"
					each="{ item in paginate() }" 
					url="{ item.FoundOnURL }" 
					resources="{ item.Resources }"
				>
				</tr>
			</tbody>
			<tfoot>
				<tr>
					<th style="width: 35%;">URL where the broken resources were found</th>
					<th style="width: ">Broken Resources</th>
					<th style="width: 9em;">Type</th>
					<th style="width: 9em;">Status</th>
					<th style="width: 11em;">Actions</th>
				</tr>
			</tfoot>
		</table>
	</div>

	<nav aria-label="...">
		<ul class="pager">
			<li class="previous { disabled: !hasPreviousPage() }"><a href="#" onclick="{ previousPage }"><span aria-hidden="true">&larr;</span> Previous</a></li>
			<li class="next { disabled: !hasNextPage() }"><a href="#" onclick="{ nextPage }">Next <span aria-hidden="true">&rarr;</span></a></li>
		</ul>
	</nav>

	<script>
		var self = this;

		self.plugin = opts.plugin || console.error('no plugin set');
		self.result = [];

		self.page = 0;
		self.pageSize = 10;

		// TODO store them in localStorage
		self.showLinks = true;
		self.showImages = true;
		self.showVideos = true;
		self.showUnhandled = true;
		self.showWorkingRedirects = false;

		self.showMarkedAsFixed = false;
		self.showMarkedAsWorking = true;

		self.paginate = function(arr) {
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

			return Math.ceil(countRows / self.pageSize);  // The Math.ceil() function returns the smallest integer greater than or equal to a given number.
		};

		self.nextPage = function(e) {
			e.preventDefault();
			if (self.hasNextPage()) {
				self.page++;
				self.update();
			}
		}

		self.previousPage = function(e) {
			e.preventDefault();
			if (self.hasPreviousPage()) {
				self.page--;
				self.update();
			}
		}

		self.hasNextPage = function() {
			return self.page < (self.countPages() - 1);

		}

		self.hasPreviousPage = function() {
			return self.page > 0;
		}

		self.hasSomethingToShow = function(resources) {
			return resources.some(function(resource) {
				return self.showResource(resource);
			});
		};

		// also used from result-row
		self.showResource = function(resource) {
			var type = resource.Type;

			if (resource.IsMarkedAsFixed && !self.showMarkedAsFixed) {
				return false;
			}

			if (resource.IsMarkedAsWorking && !self.showMarkedAsWorking) {
				return false;
			}

			// < 300 because values between 300 and 400 cannot be counted as working; they have an unknown state
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
			return self.page * self.pageSize;
		};

		self.end = function() {
			return (self.page + 1) * self.pageSize;
		};

		self.plugin.on('result-data-ready', function(data) {
			self.onload(data);
			self.update();
		});

		self.onload = function(data) {
			if (data.LimitReached) {
				self.setMessage("The URL limit was reached. The Link Checker has not checked your complete website. You could buy a token for the <a href=\"https://www.marcobeierer.com/purchase\">Link Checker Professional</a> to check up to 50'000 URLs.", 'danger');
			} else {
				var message = "Your website has been checked successfully. Please see the result below.";

				// TODO does not work
				if (data.Stats != undefined && !data.Stats.TokenUsed) {
					message += " If you additionally like to check your site for <strong>broken images</strong> or like to use the scheduler for an <strong>automatically triggered daily check</strong>, then have a look at the <a href=\"https://www.marcobeierer.com/purchase\">Link Checker Professional</a>.";
				}

				self.setMessage(message, 'success');
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

				resultx.push(row); // TODO assumes render is just called once
			}

			//console.log(self.result);
			self.result = resultx;

			console.log(new Date() - start);
		}

		self.addToResult = function(result, data, type, unhandled) {
			if (!jQuery.isEmptyObject(data)) {
				for (var foundOnURL in data) {
					var resultResources = result[foundOnURL];
					var resourcesToAdd = data[foundOnURL];

					if (resultResources === undefined) {
						resultResources = [];
					}

					// should never be undefined
					if (resourcesToAdd === undefined) {
						resourcesToAdd = [];
					}

					resourcesToAdd.forEach(function(resource) {
						resource.Type = type;
						resource.IsUnhandled = unhandled;
						
						var key = self.keyForResource(foundOnURL, resource.URL, resource.Type);
						lscache.setBucket('linkchecker-fixed-');
						if (lscache.get(key) === true) {
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

		// also called in result-row
		self.keyForResource = function(foundOnURL, resourceURL, resourceType) {
			// Type because there could for example be a Link and Image with some URL
			return foundOnURL + resourceURL + resourceType;
		}

		self.setMessage = function(text, type) {
			self.plugin.trigger('set-message', text, type);
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
			lscache.set(resourceURL, datex, 60 * 24 * 30); // in minutes; 60 * 24 * 30 is one month
		}
	</script>
</result>
