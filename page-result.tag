'use strict';

<page-result>
		<td style="width: 35%;">{ url }</td>
		<td colspan="4">
			<div class="panel panel-default table-responsive" style="margin-bottom: 0;">
				<table class="table">
					<tbody>
						<tr each="{ data }">
							<td><a target="_blank" href="{ URL }">{ URL }</a></td>
							<td style="width: 9em;">{ Type }</td>
							<td style="width: 9em;">{ StatusCode }</td>
							<td style="width: 10em;"><a class="btn btn-sm btn-primary">Mark as Fixed</a></td>
						</tr>
					</tbody>
				</table>
			</div>
		</td>

	<script>
		var self = this;

		self.data = opts.data || console.error('no data set');
		self.url = opts.url || console.error('no url set');

		self.on('mount', function() {
		});

		//console.log(self.data.length);

		console.log(self.data);

	</script>
</page-result>
