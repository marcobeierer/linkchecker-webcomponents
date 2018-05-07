'use strict';

riot.tag2('result-row', '<td if="{resources.length > 0}" style="width: 35%;"><a href="{url}" target="_blank">{url}</a></td> <td if="{resources.length > 0}" colspan="4"> <div class="panel panel-default table-responsive" style="margin-bottom: 0;"> <table class="table"> <tbody> <tr each="{resource in resources}" if="{show(resource)}"> <td> <a target="_blank" href="{resource.URL}">{resource.URL}</a> <span if="{resource.IsRedirected}" class="badge">Redirected</span> </td> <td style="width: 9em;">{resource.Type}</td> <td style="width: 9em;" title="{resource.StatusText}">{status(resource)}</td> <td style="width: 13em;"> <virtual if="{!resource.IsUnhandled}"> <div class="btn-group"> <button if="{!resource.IsMarkedAsFixed}" class="btn btn-sm btn-primary" onclick="{markAsFixed}">Mark as Fixed</button> <button if="{resource.IsMarkedAsFixed}" class="btn btn-sm btn-primary" onclick="{markAsFixed}" disabled="{true}">Marked as Fixed</button> <button if="{!resource.IsMarkedAsFixed}" type="button" class="btn btn-sm btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> <span class="caret"></span> <span class="sr-only">Toggle Dropdown</span> </button> <ul class="dropdown-menu dropdown-menu-right"> <li><a href="#" onclick="{markAsFixedOnAllPages}">Mark as fixed on all pages</a></li> </ul> </div> </virtual> <virtual if="{resource.IsUnhandled}"> <button if="{!resource.IsMarkedAsWorking}" class="btn btn-sm btn-primary" onclick="{markAsWorking}">Mark as Working</button> <button if="{resource.IsMarkedAsWorking}" title="The resource was manually checked on {new Date(resource.IsMarkedAsWorking).toLocaleDateString()}. Click the button to update date of last check." disabled="{checkedToday(resource)}" class="btn btn-sm btn-primary" onclick="{markAsWorking}">Checked: {checkedDateString(resource)}</button> </virtual> </td> </tr> </tbody> </table> </div> </td>', '', '', function(opts) {
		var self = this;

		self.url = opts.url || console.error('no url set');
		self.resources = opts.resources || console.error('no resources set');
		self.plugin = opts.plugin || console.error('no plugin set');

		self.on('mount', function() {

			var table = jQuery(self.root).find('.table-responsive')
			table.on('show.bs.dropdown', function () {
				table.css( "overflow", "inherit" );
			});
			table.on('hide.bs.dropdown', function () {
				table.css( "overflow", "auto" );
			})
		});

		self.show = function(resource) {
			return self.parent.showResource(resource);
		}

		self.checkedDateString = function(resource) {
			if (self.checkedToday(resource)) {
				return 'Today';
			}
			return new Date(resource.IsMarkedAsWorking).toLocaleDateString();
		}

		self.checkedToday = function(resource) {
			return new Date(Date.now()).toLocaleDateString() == new Date(resource.IsMarkedAsWorking).toLocaleDateString();
		}

		self.markAsFixed = function(e) {
			e.item.resource.IsMarkedAsFixed = true;

			var key = self.parent.keyForResource(self.url, e.item.resource.URL, e.item.resource.Type);

			lscache.setBucket('linkchecker-fixed-');
			lscache.set(key, true);

			self.parent.update();
		};

		self.markAsFixedOnAllPages = function(e) {
			e.preventDefault();
			self.parent.setMarkedAsFixedOnAllPages(e.item.resource.URL, e.item.resource.Type);
			self.parent.update();
		};

		self.markAsWorking = function(e) {
			var datex = Date.now();
			self.parent.setMarkedAsWorking(e.item.resource.URL, datex);
			self.parent.update();
		};

		self.status = function(resource) {
			if (resource.StatusCode > 0) {
				return resource.StatusCode;
			}
			return resource.StatusText;
		};

});
