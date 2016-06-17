<linkchecker-scheduler>
	<h2>Link Checker Scheduler</h2>

	<div class="alert alert-{ messageType }">
		<span name="message"></span>
	</div>

	<div class="panel panel-default">
		<div class="panel-heading">Description</div>
		<div class="panel-body">
			The scheduler is an additional service for all users who have bought a token for the <a href="https://www.marcobeierer.com/tools/link-checker-professional">Link Checker Professional</a>. If you register your site to the scheduler, a link check is automatically triggered once a day and you receive an email notification with a summary report after the check has finished. If a dead link was found, you could use the default Link Checker interface to fetch the detailed results.
		</div>
	</div>
	
	<div class="panel panel-primary" if="{ !registered }">
		<div class="panel-heading">Register your website</div>
		<div class="panel-body">
			<form onsubmit="{ register }">
				<input type="hidden" name="Service" value="Link Checker" />
				<input type="hidden" name="IntervalInNs" value="86400000000000" />

				<div class="form-group">
					<label>Website URL</label>
					<input class="form-control" name="URL" type="text" value="{ websiteURL }" readonly="readonly" required />
				</div>

				<div class="form-group">
					<label>Email address for notifications</label>
					<input class="form-control" type="email" name="Email" required />
				</div>

				<button class="btn btn-default" type="submit">Register</button>
			</form>
		</div>
	</div>

	<div class="panel panel-primary" if="{ registered }">
		<div class="panel-heading">Deregister your website</div>
		<div class="panel-body">
			<form onsubmit="{ deregister }">
				<input type="hidden" name="Service" value="Link Checker" />

				<div class="form-group">
					<label>Website URL</label>
					<input class="form-control" name="URL" type="text" value="{ websiteURL }" readonly="readonly" required />
				</div>

				<button class="btn btn-default" type="submit">Deregister</button>
			</form>
		</div>
	</div>

	<script>
		var self = this;

		self.registered = false;
		self.websiteURL = opts.websiteUrl || '';
		self.token = opts.token || '';

		self.apiURL = 'https://api.marcobeierer.com/scheduler/v1/';
		if (opts.dev === '1') {
			self.apiURL = 'http://192.168.1.47:9999/scheduler/v1/';
		}

		// TODO merge with linkchecker function
		setMessage(text, type) {
			self.message.innerHTML = text;
			self.messageType = type;
			self.update();
		}

		tokenHeader() {
			if (self.token != '') {
				return 'BEARER ' + self.token;
			}
			return '';
		}

		status() {
			jQuery.ajax({
				method: 'GET',
				url: self.apiURL + '?Service=Link Checker&URL=' + self.websiteURL,
				headers: {
					'Authorization': self.tokenHeader(),
				}
			}).done(function(data, textStatus, xhr) {
				if (xhr.status == 204) { // no content
					self.setMessage('Your website isn\'t registered for the scheduler currently. Please use the form below to register your site.', 'info');
					self.registered = false;
				} else {
					self.setMessage('Your website is registered to the scheduler currently. Please use the form below to deregister your site.', 'info');
					self.registered = true;
				}
			}).fail(function(xhr, textStatus, error) {
				if (xhr.status == 401) { // unauthorized
					self.setMessage('The validation of your token failed. The token is invalid or has expired. Please try it again or contact me if the token should be valid.', 'error');
				} else if (xhr.status == 504 || xhr.status == 503) {
					self.setMessage('The backend server is temporarily unavailable. Please try it again later.', 'error');
				} else {
					self.setMessage('Something went wrong. Please try it again later.', 'error');
				}
			}).always(function() {
				self.update();
			});
		}
		self.status();

		register(e) {
			e.preventDefault();
			var data = $(e.target).serializeJSON();

			jQuery.ajax({
				method: 'POST',
				url: self.apiURL,
				data: data,
				headers: {
					'Authorization': self.tokenHeader(),
				}
			}).then(
				function successCallback(response) {
					self.setMessage('You have successfully registered your website to the scheduler.', 'success');
					self.registered = true;
				},
				function errorCallback(response) { 
					if (response.status == 401) { // unauthorized
						self.setMessage('The validation of your token failed. The token is invalid or has expired. Please try it again or contact me if the token should be valid.', 'error');
					} else if (response.status == 504 || response.status == 503) {
						self.setMessage('The backend server is temporarily unavailable. Please try it again later.', 'error');
					} else {
						self.setMessage('Something went wrong. Please try it again later.', 'error');
					}
				}
			);
		}

		deregister(e) {
			e.preventDefault();
			var data = $(e.target).serializeJSON();

			jQuery.ajax({
				method: 'DELETE',
				url: self.apiURL,
				data: data,
				headers: {
					'Authorization': self.tokenHeader(),
				}
			}).then(
				function successCallback(response) {
					self.setMessage('You have successfully deregistered your website from the scheduler.', 'success');
					self.registered = false;
				},
				function errorCallback(response) { 
					self.setMessage('Something went wrong. Please try it again later.', 'error');
				}
			);
		}
	</script>
</linkchecker-scheduler>
