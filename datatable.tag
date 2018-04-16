'use strict';

<datatable>
	<div class="panel panel-default table-responsive" style="margin-bottom: { opts.marginBottom }">
		<table class="table { opts.tableClass }">
			<thead if="{ showTableHeader }">
				<tr>
					<th each={ column, index in columns } style="width: { column.width }">
						{ tr(column.label) }
					</th>
				</tr>
			</thead>
			<tbody>
				<tr if="{ !data || (Array.isArray(data) && data.length == 0) || Object.keys(data).length == 0 }">
					<td colspan="{ columns.length }">{ message }</td>
				</tr>
				<tr class="{ rowClassCallback(elem) }" each="{ elem, index in data }">
					<td each="{ column, index2 in columns }" colspan="{ column.colspan }" if="{ column.showBody == undefined }" style="width: { column.width }">
						<virtual if="{ column.linkCallback == undefined }">
							<span if="{ column.callback != undefined && column.type == 'subtable' }">
								<datatable message="{ column.message }" columns="{ column.callback(elem, index) }" data="{ elem }" actions="{ actions }" no-table-footer no-table-header margin-bottom="0"></datatable>
							</span>

							<span if="{ column.callback != undefined && column.type != 'subtable'}">
								{ column.callback(elem, index) }
							</span>

							<span if="{ column.callback == undefined && elem[column.value] != undefined }">
								{ elem[column.value] }
							</span>

							<span if="{ column.callback == undefined && elem[column.label] != undefined }">
								{ elem[column.label] }
							</span>
						</virtual>

						<a if="{ column.linkCallback != undefined }" href="{ column.linkCallback(elem, index) }" target="_blank">
							<span if="{ column.callback != undefined && column.type != 'subtable'}">
								{ column.callback(elem, index) }
							</span>
							<span if="{ column.callback == undefined && elem[column.label] != undefined }">
								{ elem[column.label] }
							</span>
							<span if={ column.isRedirectedCallback != undefined && column.isRedirectedCallback(elem) } class="badge">Redirected</span>
						</a>

						<virtual each="{ action in actions }" if="{ column.label == 'Actions' }">
							<a if="{ action.action == 'callback' }" 
								disabled="{ action.isDisabledCallback !== undefined && action.isDisabledCallback(elem) }" 
								onclick="{ action.callback.bind(this, elem) }" 
								class="btn btn-sm btn-{ action.btnType }">
								{ (action.labelCallback !== undefined && action.labelCallback(elem)) || tr(action.label) }</a>

							<a href="{ action.url }/?id={ encodeURIComponent(elem['ID']) }" if="{ action.action == 'link' }"  class="btn-flat">{ tr(action.label) }</a>
							<a data-toggle="modal" data-target="{ action.target }" onclick="{ modalOpened }" if="{ action.action == 'modal-link' }" class="btn">{ tr(action.label) }</a>
						</virtual>
					</td>
				</tr>
			</tbody>
			<tfoot if="{ showTableFooter }">
				<tr>
					<th each={ column, index in columns }>
						{ tr(column.label) }
					</th>
				</tr>
			</tfoot>
		</table>
	</div>

	<script>
		var self = this;

		self.columns = opts.columns || [];
		self.columnNames = opts.columnNames;
		self.events = opts.events || riot.observable();

		self.disableLinking = opts.disableLinking === 'true';
		self.rowClassCallback = opts.rowClassCallback || function() {};

		self.showTableHeader = opts.noTableHeader === undefined;
		self.showTableFooter = opts.noTableFooter === undefined;

		self.data = opts.data;

		self.tr = opts.trFunc || function(str) {
			return str;
		};

		self.modalOpened = function(e) {
			self.events.trigger('modal-opened', e, this.elem, self);
		}

		self.linkBaseURL = opts.linkBaseurl || '';
		self.actions = opts.actions;

		if (opts.url == undefined) {
			self.url = '';
		} else {
			self.url = replacePlaceholdersWithQueryVariables(opts.url);
		}

		self.message = 'No data loaded or available yet.';

		self.on('mount', function() {
			self.events.on('create', onCreate);

			if (opts.actions !== undefined) {
				self.actions = opts.actions;
			}
		});

		self.on('unmount', function() {
			self.events.off('create', onCreate);
		});

		self.on('update', function() {
			if (opts.message !== undefined) {
				self.message = opts.message;
			}

			if (opts.actions !== undefined) {
				self.actions = opts.actions;
			}
		});

		var onCreate = function(elem) {
			self.data.unshift(elem);
			self.update();
		};
	</script>
</datatable>
