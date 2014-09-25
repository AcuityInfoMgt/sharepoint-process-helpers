sharepointProcessHelpers.status = sharepointProcessHelpers.status || {};

sharepointProcessHelpers.status.config = {
	statusButtonsField: 'MoveToStatusButtons', /* field in the Statuses list that contains the status move buttons to show at each status */
};

sharepointProcessHelpers.guidance.getStatuses = function () {
	/* optimize - retrieve common fields once in core then reuse */
	sharepointProcessHelpers.core.getListItemById(sharepointProcessHelpers.core.config.packagesList, sharepointProcessHelpers.core.queryObj()['ID'], sharepointProcessHelpers.core.config.statusField).done(
		function(ListItem) {
			if (ListItem.get_item(sharepointProcessHelpers.core.config.statusField)) {
				sharepointProcessHelpers.core.getListItemById(sharepointProcessHelpers.core.config.statusesList, ListItem.get_item(sharepointProcessHelpers.core.config.statusField).get_lookupId(), sharepointProcessHelpers.status.config.statusButtonsField).done(
					function(ListItem) {
						if (ListItem.get_item(sharepointProcessHelpers.status.config.statusButtonsField)) {
							sharepointProcessHelpers.status.addStatusButtons(ListItem.get_item(sharepointProcessHelpers.status.config.statusButtonsField));
						}
					}
				);
			}
		}
	);
}

sharepointProcessHelpers.status.addStatusButtons = function (statuses) {
	/*if (window.bounced !== true) {*/
	$.each(statuses, function(index, value) {
		$('#sharepoint-process-helpers_status_buttons').show();
		var id = value.get_lookupId();
		var title = value.get_lookupValue();
		$('#sharepoint-process-helpers_status_buttons_content').append(
			"<div class='sharepoint-process-helpers_button sharepoint-process-helpers_button_primary sharepoint-process-helpers_status_button' data-status-id='" +
			id + "'>Move to " + title + "</div>");
	});
	/*}*/
}

$(document).on('click', '.sharepoint-process-helpers_status_button', function() {
	var statusId = $(this).data('status-id');
	/*var prerequisiteField = null;*/
	/*sharepointProcessHelpers.core.getListItemById('Statuses', statusId, /*, ['PrerequisiteField',
		'MoveStatusConfirmation'
	]).done(function(ListItem) {*/
		/*var prerequisiteField = ListItem.get_item('PrerequisiteField');
		var moveStatusConfirmation = ListItem.get_item('MoveStatusConfirmation');
		var cancel = false;
		if (prerequisiteField) {
			GetListItemById(sharepointProcessHelpers.core.config.packagesList, queryObj()['ID'], [prerequisiteField]).done(
				function(ListItem) {
					if (!ListItem.get_item(prerequisiteField)) {
						alert(
							"Please fill in the required field."
						)
					} else {
						if (moveStatusConfirmation && !confirm(moveStatusConfirmation)) {
							cancel = true;
						}
						if (!cancel) {
							UpdateListItem(sharepointProcessHelpers.core.config.packagesList, queryObj()['ID'], sharepointProcessHelpers.core.config.statusField,
								statusId).done(function() {
								location.reload();
							});
						}
					}
				});
		} else {
			if (moveStatusConfirmation && !confirm(moveStatusConfirmation)) {
				cancel = true;
			}*/
			/*if (!cancel) {*/
				sharepointProcessHelpers.core.updateListItem(sharepointProcessHelpers.core.config.packagesList, sharepointProcessHelpers.core.queryObj()['ID'], sharepointProcessHelpers.core.config.statusField, statusId).done(
					function() {
						sharepointProcessHelpers.core.addMessage('statusMoved');
						location.reload();
					}
				);
			/*}*/
		/*}*/
	});

if (sharepointProcessHelpers.core.queryObj()['ID']) {
  _spBodyOnLoadFunctionNames.push("sharepointProcessHelpers.guidance.getStatuses");
}
