'use strict';

<feedback>
	<message plugin="{ plugin }" dismissible="true" />

	<div class="row" >
		<div class="col-lg-6">
			<p>The free version of the Link Checker is quite popular since the launch in 2015, but just a small number of users also purchases the professional version. If I could increase the sales, I would be able to dedicate more time to the development of the Link Checker and for example add more features.</p>

			<p>To build a better product and increase the sales, I need to learn more about your specific needs and know what you expect from the Link Checker. Therefore I would like to kindly ask you, if you can tell me, what you like or dislike about the Link Checker and which features you are missing that would make you consider purchasing the professional version?</p>

			<p>I would really appreciate if you could take the time and send me your valuable feedback.</p>
			
			<p>Thank you in advance,<br />
			<a href="https://www.marcobeierer.com/about-me" target="_blank">Marco</a></p>

			<p><em>Please note that the message is sent anonymously and I do not collect any data except the message itself. Therefore, I am not able to reply to your message. If you like to get a reply, please write me an email to <a href="mailto:email@marcobeierer.com">email@marcobeierer.com</a> instead.</em></p>
		</div>
		<div class="col-lg-6">
			<form onsubmit="{ submit }">
				<div class="form-group">
					<textarea name="message" class="form-control" rows="12"></textarea>
				</div>
				<button class="btn btn-primary" type="submit">Send your feedback</button>
			</form>
		</div>
	</div>

	<script>
		var self = this;

		self.plugin = riot.observable();

		self.submit = function(e) {
			e.preventDefault();

			var url = 'https://api.marcobeierer.com/feedback/v1/';
			var data = jQuery(e.target).serializeObject();

			if (data.message == '') {
				self.plugin.trigger('set-message', 'There is no message to send. Please enter your message and try it again.', 'warning');
				return;
			}

			jQuery.ajax({
				method: 'POST',
				url: url,
				dataType: 'json',
				data: JSON.stringify(data),
			}).done(function(data, textStatus, xhr) {
				self.plugin.trigger('set-message', 'Thank you, your message was sent successfully.', 'success');
				jQuery(e.target).trigger('reset');
			}).fail(function() {
				self.plugin.trigger('set-message', 'An error occoured, could not send your message, please try it again.', 'danger');
			});
		};
	</script>
</feedback>
