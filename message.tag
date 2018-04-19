'use strict';

<message>
	<div if="{ text != undefined }" class="alert alert-{ type }">
		<raw content="{ text }" />
	</div>

	<script>
		var self = this;

		self.plugin = opts.plugin || console.error('no plugin set');

		self.type = opts.type || '';
		self.text = opts.text || '';

		self.plugin.on('set', function(text, type) {
			self.text = text;
			self.type = type;
			self.update();
		});

	</script>
</message>
