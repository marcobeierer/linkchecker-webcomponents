'use strict';

<message>
	<div if="{ text != '' && !dismissed }" class="alert alert-{ type } { alert-dismissible: dismissible }">
		<button if="{ dismissible }" type="button" class="close" aria-label="Close"><span aria-hidden="true" onclick="{ dismiss }">&times;</span></button>
		<raw content="{ text }" />
	</div>

	<script>
		var self = this;

		self.plugin = opts.plugin || console.error('no plugin set');

		self.name = opts.name;
		self.text = opts.text || '';
		self.type = opts.type || '';
		self.dismissible = opts.dismissible || false;

		self.dismissed = false;

		self.plugin.on('set-message', function(text, type, name) {
			if ((name != undefined && name != self.name) || (name == undefined && self.name != undefined)) {
				return; // not for this instance
			}

			self.text = text;
			self.type = type;

			self.dismissed = false;

			self.update();
		});

		self.dismiss = function(e) {
			self.dismissed = true;
		}
	</script>
</message>