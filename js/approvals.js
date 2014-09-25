sharepointProcessHelpers.approvals = sharepointProcessHelpers.approvals || {};

sharepointProcessHelpers.approvals.config = {
	approversList: 'Approvers', /* list of approvers. structure prescribed: title, approvedbyfield, approvedonfield */
	enableAutoMoveToStatusOnApproval: true /* you must have a column in your Status list called AutoMoveToStatusOnApproval */
};

sharepointProcessHelpers.approvals.getApprovals = function () {
	sharepointProcessHelpers.core.getListItemById(sharepointProcessHelpers.core.config.packagesList, sharepointProcessHelpers.core.queryObj()['ID'], sharepointProcessHelpers.core.config.statusField).done(
		function(ListItem) {
			if (ListItem.get_item(sharepointProcessHelpers.core.config.statusField)) {
				var fieldsToRetrieveFromStatusesList = (sharepointProcessHelpers.approvals.config.enableAutoMoveToStatusOnApproval) ? ['Approvers', 'AutoMoveToStatusOnApproval'] : ['Approvers']
				sharepointProcessHelpers.core.getListItemById(sharepointProcessHelpers.core.config.statusesList, ListItem.get_item(sharepointProcessHelpers.core.config.statusField).get_lookupId(), fieldsToRetrieveFromStatusesList).done(
					function(ListItem) {
						if (ListItem.get_item('AutoMoveToStatusOnApproval')) {
							sharepointProcessHelpers.approvals.autoMoveToStatusOnApproval = ListItem.get_item('AutoMoveToStatusOnApproval').get_lookupId();
						}
						sharepointProcessHelpers.approvals.processApprovals(ListItem.get_item('Approvers'));
					}
				);
			}
		}
	);
}

sharepointProcessHelpers.approvals.processApprovals = function (approvers) {
	$.each(approvers, function(index, value) {
		sharepointProcessHelpers.core.getListItemById('Approvers', value.get_lookupId(), ['ID', 'ApprovedOnField',
			'ApprovedByField', 'Title'
		]).done(function(ListItem) {
			var approvedOnField = ListItem.get_item('ApprovedOnField');
			var approvedByField  = ListItem.get_item('ApprovedByField');
			var title = ListItem.get_item('Title');
			var id = ListItem.get_item('ID');
			sharepointProcessHelpers.core.getListItemById(sharepointProcessHelpers.core.config.packagesList, sharepointProcessHelpers.core.queryObj()['ID'], [approvedOnField, approvedByField]).done(
				function(ListItem) {
					var approved = false;
					var button = '';
					if (ListItem.get_item(approvedOnField)) {
						approved = true;
					}
					if (approved) {
						$('#sharepoint-process-helpers_approvals').show();
						button +=
							'<div class="sharepoint-process-helpers_approvals_box sharepoint-process-helpers_approvals_approved" data-approver-title="' +
							title + '"><h1>' + title + '</h1>';
						button +=
							'<p><span style="font-size: 1.3em">&#x2713;</span> Approved</p><p>' +
							ListItem.get_item(approvedByField) + '</p>';
						button +=
							'<p><span class="sharepoint-process-helper_fake_link sharepoint-process-helpers_approvals_unapprove" data-approved-on-field="' +
							approvedOnField + '" data-approved-by-field="' + approvedByField +
							'">Un-approve</span></p>';
					} else {
							$('#sharepoint-process-helpers_approvals').show();
							button +=
								'<div class="sharepoint-process-helpers_approvals_box sharepoint-process-helpers_approvals_sent" data-approver-title="' +
								title + '"><h1>' + title + '</h1>';
							button += '<p>Pending approval</p>';
								button += approvalButton(false, true, title, approvedOnField,
									approvedByField, sharepointProcessHelpers.approvals.autoMoveToStatusOnApproval, '', '');
					}
					button += '</div>';
					$('#sharepoint-process-helpers_approvals_content').append(button);
				});
		});
	});
}

$(document).on('click', '.sharepoint-process-helpers_approvals_approve', function() {
	var date_field = $(this).data('approved-on-field');
	var name_field = $(this).data('approved-by-field');
	var title_field = $(this).data('approver-title');
	var move_to_status_field = $(this).data('auto-move-to-status');
	
	if (confirm('You are approving for ' + title_field +
		'. Your name will be logged. Press OK to continue, or Cancel to abort.')) {
		sharepointProcessHelpers.core.checkCurrentUser().done(function() {	
			var field_array = [date_field, name_field];
			var value_array = [new Date(), sharepointProcessHelpers.core.currentUser];
			if (sharepointProcessHelpers.approvals.autoMoveToStatusOnApproval) {
				field_array.push(sharepointProcessHelpers.core.config.statusField);
				value_array.push(move_to_status_field);
			}
			sharepointProcessHelpers.core.updateListItem(sharepointProcessHelpers.core.config.packagesList, sharepointProcessHelpers.core.queryObj()['ID'], field_array, value_array).done(
				function() {
					if (sharepointProcessHelpers.approvals.autoMoveToStatusOnApproval) {
						sharepointProcessHelpers.core.addMessage('packageApprovedAndMoved');
					} else {
						sharepointProcessHelpers.core.addMessage('packageApproved');
					}
					location.reload();
				});
		});
	}
});

$(document).on('click', '.sharepoint-process-helpers_approvals_unapprove', function() {
	var date_field = $(this).data('approved-on-field');
	var name_field = $(this).data('approved-by-field');
	sharepointProcessHelpers.core.updateListItem(sharepointProcessHelpers.core.config.packagesList, sharepointProcessHelpers.core.queryObj()['ID'], [date_field, name_field], [null,
		null
	]).done(function() {
		location.reload();
	});
});

function approvalButton(showApproverTitle, inset, approverTitle,
	approverDateField, approverNameField, moveToStatus, checklistCount,
	checklistApproverId) {
	return '<div class="sharepoint-process-helpers_button sharepoint-process-helpers_button_primary sharepoint-process-helpers_approvals_approve' + (
			inset ? ' sharepoint-process-helpers_button_inset' : '') + '" data-approval-checklist-count="' +
		checklistCount + '" data-approver-id="' + checklistApproverId +
		'" data-approver-title="' + approverTitle +
		'" data-approved-on-field="' + approverDateField +
		'" data-approved-by-field="' + approverNameField +
		'"  data-auto-move-to-status="' + moveToStatus + '">Approve' + (
			showApproverTitle ? ' for ' + approverTitle : '') + '</div>';
}

if (sharepointProcessHelpers.core.queryObj()['ID']) {
  _spBodyOnLoadFunctionNames.push("sharepointProcessHelpers.approvals.getApprovals");
}
