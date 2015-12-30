<linkchecker-with-config>
	<form onsubmit="{ submit }" style="margin-bottom: 20px;">
		<div class="form-group">
			<label>Website URL</label>
			<input name="websiteURL" type="url" class="form-control" placeholder="The URL of the website to check, for example 'https://www.marcobeierer.com'." disabled="{ disabled }" required>
		</div>
		<div class="form-group">
			<label>Token</label>
			<textarea name="token" class="form-control" style="min-height: 100px" placeholder="A token is only necessary to check a website with more than 500 internal or external URLs." disabled="{ disabled }"></textarea>
		</div>
		<button class="btn btn-default" type="submit" disabled="{ disabled }">Check your website</button>
	</form>


	<script>
		var self = this;

		self.disabled = false;

		submit(e) {
			e.preventDefault();
			opts.linkchecker.trigger('start', self.websiteURL.value, self.token.value);
		}

		opts.linkchecker.on('started', function() {
			self.disabled = true;
		});

		opts.linkchecker.on('stopped', function() {
			self.disabled = false;
			self.update();
		});
	</script>
</linkchecker-with-config>
