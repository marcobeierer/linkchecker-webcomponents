riot.tag2('linkchecker-scheduler', '<div if="{token}" class="alert alert-{messageType}"> <raw content="{message}"></raw> </div> <div class="panel panel-default" if="{!token}"> <div class="panel-heading">Description</div> <div class="panel-body"> <p>The scheduler is an additional service for all users who have bought a token for the <a href="https://www.marcobeierer.com/wordpress-plugins/link-checker-professional" target="_blank">Link Checker Professional</a>.</p> <p>If you register your site to the scheduler, a link check is automatically triggered once a day and you receive an email notification with a summary report after the check has finished. If a dead link was found, you can use the default Link Checker interface to fetch the detailed results.</p> </div> </div> <div class="panel panel-primary" if="{token && !registered}"> <div class="panel-heading">Register your website</div> <div class="panel-body"> <p>If you register your site to the scheduler, a link check is automatically triggered once a day and you receive an email notification with a summary report after the check has finished. If a dead link was found, you can use the default Link Checker interface to fetch the detailed results.</p> <form onsubmit="{register}"> <input type="hidden" name="Service" value="Link Checker"> <input type="hidden" name="IntervalInNs" value="86400000000000"> <div style="display: none;" class="form-group"> <label>Website URL</label> <input class="form-control" name="URL" type="text" riot-value="{websiteURL}" readonly="readonly" required> </div> <div class="form-group"> <label>Email address for notifications</label> <input class="form-control" name="Email" riot-value="{email}" required type="{\'email\'}"> </div> <button class="btn btn-default" type="submit">Register</button> </form> </div> </div> <div class="panel panel-primary" if="{token && registered}"> <div class="panel-heading">Deregister your website</div> <div class="panel-body"> <p>Your site is registered to the scheduler and you should receive status emails regularly. Use the button below if you like to disable the automated checks.</p> <p>If you like to <strong>change your email address</strong>, please deregister from the scheduler, update the email address in the register form and then reregister to the scheduler.</p> <form onsubmit="{deregister}"> <input type="hidden" name="Service" value="Link Checker"> <div style="display: none;" class="form-group"> <label>Website URL</label> <input class="form-control" name="URL" type="text" riot-value="{websiteURL}" readonly="readonly" required> </div> <button class="btn btn-default" type="submit">Deregister</button> </form> </div> </div>', '', '', function(opts) {
		var self = this;

		self.registered = false;

		self.websiteURL = opts.websiteUrl || '';
		self.token = opts.token || '';
		self.email = opts.email || '';

		self.loginPageURL = opts.loginPageUrl;
		self.loginFormSelector = opts.loginFormSelector;
		self.loginData = opts.loginData;

		self.apiURL = 'https://api.marcobeierer.com/scheduler/v1/';
		if (opts.dev === '1' || opts.dev === '2') {
			self.apiURL = 'http://marco-desktop:9999/scheduler/v1/';
		}

		this.setMessage = function(text, type) {
			self.message = text;
			self.messageType = type;
			self.update();
		}.bind(this)

		self.setMessage('Loading status.', 'info');

		this.tokenHeader = function() {
			if (self.token != '') {
				return 'BEARER ' + self.token;
			}
			return '';
		}.bind(this)

		this.status = function() {
			if (self.websiteURL == '') {
				return;
			}
			jQuery.ajax({
				method: 'GET',
				url: self.apiURL + '?Service=Link Checker&URL=' + self.websiteURL,
				headers: {
					'Authorization': self.tokenHeader(),
				}
			}).done(function(data, textStatus, xhr) {
				if (xhr.status == 204) {
					self.setMessage('Your website isn\'t registered for the scheduler currently. Please use the form below to register your site.', 'info');
					self.registered = false;
				} else {
					var msg = 'Your website is registered to the scheduler currently. ';
					if (data.LoginPageURL && data.LoginPageURL != '') {
						msg += 'Form login is setup and used by the scheduler. ';
					}
					msg += 'You can use the form below to deregister your site.';

					self.setMessage(msg, 'info');
					self.registered = true;
				}
			}).fail(function(xhr, textStatus, error) {
				if (xhr.status == 401) {
					self.setMessage('The validation of your token failed. The token is invalid or has expired. Please try it again or contact me if the token should be valid.', 'danger');
				} else if (xhr.status == 504 || xhr.status == 503) {
					self.setMessage('The backend server is temporarily unavailable. Please try it again later.', 'danger');
				} else {
					self.setMessage('Something went wrong. Please try it again later.', 'danger');
				}
			}).always(function() {
				self.update();
			});
		}.bind(this)
		self.status();

		this.register = function(e) {
			e.preventDefault();

			var obj = jQuery(e.target).serializeObject();

			obj.IntervalInNs = parseInt(obj.IntervalInNs);
			obj.Credentials = {
				'login_page_url': self.loginPageURL,
				'form_selector': self.loginFormSelector,
				'data': self.loginData
			};

			var data = JSON.stringify(obj);

			jQuery.ajax({
				method: 'POST',
				url: self.apiURL,
				data: data,
				dataType: 'text',
				headers: {
					'Authorization': self.tokenHeader(),
				}
			}).done(function(data, textStatus, xhr) {
				self.setMessage('You have successfully registered your website to the scheduler.', 'success');
				self.registered = true;
			}).fail(function(xhr, textStatus, error) {
				console.log(xhr.status);
				if (xhr.status == 401) {
					self.setMessage('The validation of your token failed. The token is invalid or has expired. Please try it again or contact me if the token should be valid.', 'danger');
				} else if (xhr.status == 504 || xhr.status == 503) {
					self.setMessage('The backend server is temporarily unavailable. Please try it again later.', 'danger');
				} else {
					self.setMessage('Something went wrong. Please try it again later.', 'danger');
				}
			}).always(function() {
				self.update();
			});
		}.bind(this)

		this.deregister = function(e) {
			e.preventDefault();
			var data = jQuery(e.target).serializeJSON();

			jQuery.ajax({
				method: 'DELETE',
				url: self.apiURL,
				data: data,
				dataType: 'text',
				headers: {
					'Authorization': self.tokenHeader(),
				}
			}).done(function(data, textStatus, xhr) {
				self.setMessage('You have successfully deregistered your website from the scheduler.', 'success');
				self.registered = false;
			}).fail(function(xhr, textStatus, error) {
				self.setMessage('Something went wrong. Please try it again later.', 'danger');
			}).always(function() {
				self.update();
			});
		}.bind(this)
});
