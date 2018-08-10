'use strict';

<pricing>
	<p if="{ loadFailed }">Could not load the prices. Please reload the page to try fetching the prices again or have a look at the prices on the <a href="https://www.marcobeierer.com/tools/link-checker-professional" target="_blank">Link Checker Professional info page</a> on my website.</p>
	<p if="{ rows.length == 0 }">Currently loading the prices, please wait a moment.</p>
	<table if="{ rows.length > 0 }" class="table">
		<thead>
			<tr>
				<th>URL Limit</th>
				<th>Price for One Year</th>
			</tr>
		</thead>
		<tbody>
			<tr each="{ row, rowx in rows }">
				<td >{ row.Title }</td>
				<td >{ formatBasePrice(row.BasePrice) }</td>
			</tr>
		</tbody>
	</table>
	<p><em>Please note that all internal and external links count to the quota.</em></p>

	<script>
		var self = this;

		self.rows = [];
		self.loadFailed = false;

		self.on('mount', function() {
			jQuery.ajax({
				method: 'GET',
				url: 'https://api.marcobeierer.com/tokenauthority/v1/data/services',
				dataType: 'json'
			})
			.done(function(data, textStatus, xhr) {
				var lc = data.linkchecker;

				var multiplier = lc.Lifetimes['365'].Multiplier;

				self.rows.push({
					Title: '500 URLs',
					BasePrice: 'Free of charge.',
				});

				for (var key in lc.PageLimits) {
					var value = lc.PageLimits[key];
					self.rows.push(value);
				}

				self.rows.push({
					Title: 'More than 500\'000 URLs',
					BasePrice: 'Please contact me for an offer.',
				});

				self.update();
			})
			.fail(function(xhr) {
				self.loadFailed = true;
				self.update();
			});
		});

		self.formatBasePrice = function(basePrice) {
			if (typeof basePrice != 'number') {
				return basePrice;
			}

			basePrice = basePrice / 100;
			return basePrice + '.00 €';
		}
	</script>
</pricing>
