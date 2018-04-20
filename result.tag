'use strict'

<result>
	<div class="panel panel-default table-responsive">
		<table class="table table-striped table-responsive">
			<thead>
				<tr>
					<th style="width: 35%;">URL where the broken resources were found</th>
					<th style="width: ">Broken Resources</th>
					<th style="width: 9em;">Type</th>
					<th style="width: 9em;">Status Code</th>
					<th style="width: 11em;">Actions</th>
				</tr>
			</thead>
			<tbody>
				<tr 
					data-is="result-row"
					each="{ paginate(result) }" 
					url="{ foundOnURL }" 
					resources="{ row }"
					plugin="{ plugin }"
				>
				</tr>
			</tbody>
			<tfoot>
				<tr>
					<th style="width: 35%;">URL where the broken resources were found</th>
					<th style="width: ">Broken Resources</th>
					<th style="width: 9em;">Type</th>
					<th style="width: 9em;">Status Code</th>
					<th style="width: 11em;">Actions</th>
				</tr>
			</tfoot>
		</table>
	</div>

	<script>
		var self = this;

		self.plugin = opts.plugin || console.error('no plugin set');
		self.result = opts.result || {};

		self.page = 0;
		self.pageSize = 10;

		self.plugin.on('result-data-ready', function(data) {
			self.render(data);
			console.log(self.result);
			self.update();
		});

		self.plugin.on('no-resources-left', function(url) {
			delete self.result[url];
			self.update(); // reload pagination
		});

		self.render = function(data) {
			if (data.LimitReached) {
				self.setMessage("The URL limit was reached. The Link Checker has not checked your complete website. You could buy a token for the <a href=\"https://www.marcobeierer.com/purchase\">Link Checker Professional</a> to check up to 50'000 URLs.", 'danger');
			} else {
				var message = "Your website has been checked successfully. Please see the result below.";

				if (data.Stats != undefined && !data.Stats.TokenUsed) {
					message += " If you additionally like to check your site for <strong>broken images</strong> or like to use the scheduler for an <strong>automatically triggered daily check</strong>, then have a look at the <a href=\"https://www.marcobeierer.com/purchase\">Link Checker Professional</a>.";
				}

				self.setMessage(message, 'success');
			}

			self.resultsMessage = 'Nothing is broken, everything seems to be fine.';

			var start = new Date();

			var result = {};

			self.addToResult(result, data.DeadLinks, 'Link');
			self.addToResult(result, data.UnhandledLinkedResources, 'Link');
			self.addToResult(result, data.DeadEmbeddedImages, 'Image');
			self.addToResult(result, data.DeadEmbeddedYouTubeVideos, 'Video');
			self.addToResult(result, data.UnhandledEmbeddedResources, 'Resource');

			self.result = result;

			console.log(new Date() - start);
		}

		self.addToResult = function(result, data, type) {
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
					});

					result[foundOnURL] = resultResources.concat(resourcesToAdd);
				}
			}
		}

		self.paginate = function(obj) {
			var keys = Object.keys(obj);

			if (obj == undefined || keys.length == 0) {
				return {};
			}

			var sliced = [];
			
			var start = self.page * self.pageSize;
			var end = (self.page + 1) * self.pageSize;

			for (var i = start; i < end; i++) {
				var key = keys[i];

				var row = {
					FoundOnURL: key,
					Resources: obj[key],
				}

				sliced.push(row);
			}
			console.log(sliced);

			return sliced;
		}

		self.setMessage = function(text, type) {
			self.plugin.trigger('set-message', text, type);
		}
	</script>
</result>
