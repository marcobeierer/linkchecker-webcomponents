<resulttable>
	<div class="panel panel-default table-responsive">
		<table class="table table-striped">
			<thead>
				<tr>
					<th style="width: 35%;">{ thCol1 }</th>
					<th>{ thCol2 }</th>
					<th style="width: 10em;">{ thCol3 }</th>
				</tr>
			</thead>
			<tbody>
				<tr if="{ !data || Object.keys(data).length === 0 }">
					<td>{ resultsMessage }</td>
					<td></td>
					<td></td>
				</tr>
				<tr each="{ deadResources, foundOnURL in data }">
					<td><a href="{ foundOnURL }" target="_blank">{ foundOnURL }</a></td>
					<td colspan="2">
						<div class="panel panel-default" style="margin-bottom: 0;">
							<table class="table">
								<tr each="{ deadResource in deadResources }">
									<td><a href="{ deadResource.URL }" target="_blank">{ deadResource.URL }</a></td>
									<td style="width: 9em;">{ deadResource.StatusCode }</td>
								</tr>
							</table>
						</div>
					</td>
				</tr>
			</tbody>
			<tfoot>
				<tr>
					<th>{ thCol1 }</th>
					<th>{ thCol2 }</th>
					<th>{ thCol3 }</th>
				</tr>
			</tfoot>
		</table>
	</div>

	<script>
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

	</script>
</resulttable>
