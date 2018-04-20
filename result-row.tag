'use strict';

<result-row>
	<td if="{ resources.length > 0}" style="width: 35%;">{ url }</td>
	<td if="{ resources.length > 0}" colspan="4">
		<div class="panel panel-default table-responsive" style="margin-bottom: 0;">
			<table class="table">
				<tbody>
					<tr each="{ resources }">
						<td><a target="_blank" href="{ URL }">{ URL }</a> <span if="{ IsRedirected }" class="badge">Redirected</span></td>
						<td style="width: 9em;">{ Type }</td>
						<td style="width: 9em;">{ StatusCode }</td>
						<td style="width: 10em;">
							<button class="btn btn-sm btn-primary" onclick="{ markAsFixed }">Mark as Fixed</button>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</td>

	<script>
		var self = this;

		self.url = opts.url || console.error('no url set');
		self.resources = opts.resources || console.error('no resources set');
		self.plugin = opts.plugin || console.error('no plugin set');

		self.on('mount', function() {
		});

		self.markAsFixed = function(e) {
			// TODO safe in db and reload on load

			self.resources = self.resources.filter(function(elem) {
				return elem.URL !== e.item.URL;
			});

			if (self.resources.length == 0) {
				self.plugin.trigger('no-resources-left', self.url);
			}

			self.update();
		};

		//console.log(self.data.length);
		//console.log(self.data);

	</script>
</result-row>
