'use strict';

riot.tag2('message', '<div if="{text != undefined}" class="alert alert-{type}"> <raw content="{text}"></raw> </div>', '', '', function(opts) {
		var self = this;

		self.plugin = opts.plugin || console.error('no plugin set');

		self.text = opts.text || '';
		self.type = opts.type || '';

		self.plugin.on('set-message', function(text, type) {
			self.text = text;
			self.type = type;

			self.update();
		});
});
