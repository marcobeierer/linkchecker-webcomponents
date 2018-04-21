<linkchecker-form>
	<form onsubmit="{ submit }" style="margin-bottom: 20px;">
		<div class="form-group">
			<label>Website URL</label>
			<input ref="websiteURL" type="url" class="form-control" placeholder="The URL of the website to check, for example 'https://www.marcobeierer.com'." disabled="{ disabled }" required>
		</div>
		<div class="form-group">
			<label>Token</label>
			<textarea ref="token" class="form-control" style="min-height: 100px" placeholder="A token is only necessary to check a website with more than 500 internal or external links or if you like to use the paid extra features." disabled="{ disabled }"></textarea>
		</div>
		<button class="btn btn-default" type="submit" if="{ !disabled }">Check your website</button>
		<button class="btn btn-danger" onclick="{ stopCheck }" if="{ disabled }">Stop website check</button>
	</form>

	<script>
		var self = this;

		self.disabled = false;

		self.on('mount', function() {
			if (opts.websiteUrl != undefined) {
				this.refs.websiteURL.value = opts.websiteUrl;
			}

			if (opts.token != undefined) {
				this.refs.token.value = opts.token;
				opts.linkchecker.trigger('token-loaded', this.refs.token.value);
			}
		});

		submit(e) {
			e.preventDefault();
			opts.linkchecker.trigger('start', this.refs.websiteURL.value, this.refs.token.value);
		}

		stopCheck(e) {
			e.preventDefault();
			opts.linkchecker.trigger('stop');
		}

		opts.linkchecker.on('started', function() {
			self.disabled = true;
		});

		opts.linkchecker.on('stopped', function() {
			self.disabled = false;
			self.update();
		});
	</script>
</linkchecker-form>
