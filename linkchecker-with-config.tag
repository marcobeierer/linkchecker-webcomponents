<linkchecker-with-config>
	<form onsubmit="{ submit }" style="margin-bottom: 20px;">
		<div class="form-group">
			<label>Website URL</label>
			<input oninput="{ input }" name="websiteURL" type="url" class="form-control" placeholder="The URL of the website to check, for example 'https://www.marcobeierer.com'.">
		</div>
		<div class="form-group">
			<label>Token</label>
			<textarea oninput="{ input }" name="token" class="form-control" style="min-height: 100px" placeholder="A token is only necessary to check a website with more than 500 internal or external URLs."></textarea>
		</div>
	</form>

	<linkchecker website-url="{ websiteURL.value }" token="{ token.value }"></linkchecker>

	<script>
		var self = this;

		submit(e) {
			e.preventDefault();
		}

		input(e) {
			self.update();
		}
	</script>
</linkchecker-with-config>
