sharepointProcessHelpers.comments = sharepointProcessHelpers.comments || {};
	sharepointProcessHelpers.comments.config = { 
	universalCommentRecipients: ['Author'], /* fields on this record whose users will receive comments */
	notifyAtStatusField: 'PeopleToNotifyAtThisStatus', /* field on this status whose users will receive comments */
	statusesList: 'Statuses', /* list of statuses */
	statusField: 'Status', /* field in this record that references the list of statuses */
	enableCC: false, /* Allow users to CC others */
	ccView: '../cc.aspx', /* View that allows users to set CC; all other fields should be hidden at this view */
	commentsField: 'Comments'
};

sharepointProcessHelpers.comments.commentRecipients = [];
	
sharepointProcessHelpers.core.checkUserFailed = function() {
	alert(
		"Please reload the page, as an error occurred.\n\nIf this happens again, let the SharePoint team know that user information could not be retrieved."
	);
};

sharepointProcessHelpers.comments.appendCommentRecipients = function (recipients) {
	if (recipients instanceof Array) {
		$.each(recipients, function(index, value) {
			if ($.inArray(value.$c_1, sharepointProcessHelpers.comments.commentRecipients) == -1) {
				sharepointProcessHelpers.comments.commentRecipients.push(value.$c_1);
			}
		});
	} else if (recipients) {
		if ($.inArray(recipients.$c_1, sharepointProcessHelpers.comments.commentRecipients) !== -1) {
			sharepointProcessHelpers.comments.commentRecipients.push(recipients.$c_1);
		}
	}
	sharepointProcessHelpers.comments.getCommentRecipients();
};

sharepointProcessHelpers.comments.getCommentRecipients = function () {
	var recipients = sharepointProcessHelpers.comments.commentRecipients.join('; ');
	$('#sharepoint-process-helper_comment_recipients').html(recipients);
	return recipients;
};

sharepointProcessHelpers.comments.reloadComments = function () {
	sharepointProcessHelpers.comments.commentRecipients = [];
	sharepointProcessHelpers.comments.getComments();
};

/* 
Get and update items with SharePoint object model
http://blogs.ibs.com/Fred.Gohsman/Lists/Posts/Post.aspx?ID=2#RetrieveListItem 
*/

sharepointProcessHelpers.comments.updateCommentRecipients = function () {
	sharepointProcessHelpers.core.getListItemById(sharepointProcessHelpers.core.config.packagesList, sharepointProcessHelpers.core.queryObj()['ID'], sharepointProcessHelpers.comments.config.universalCommentRecipients.concat(sharepointProcessHelpers.core.config.statusField)).done(
		function(ListItem) {
			$.each(sharepointProcessHelpers.comments.config.universalCommentRecipients, function(index, value) {
				sharepointProcessHelpers.comments.appendCommentRecipients(ListItem.get_item(value));
			});
			
			/* Status-based comment notifications */
			if (sharepointProcessHelpers.core.config.statusField && ListItem.get_item(sharepointProcessHelpers.core.config.statusField)) {
				sharepointProcessHelpers.core.getListItemById(sharepointProcessHelpers.core.config.statusesList, ListItem.get_item(sharepointProcessHelpers.core.config.statusField).get_lookupId(), [
					sharepointProcessHelpers.comments.config.notifyAtStatusField
				]).done(function(ListItem) {
					if (ListItem.get_item(sharepointProcessHelpers.comments.config.notifyAtStatusField)) {
						sharepointProcessHelpers.comments.appendCommentRecipients(ListItem.get_item(sharepointProcessHelpers.comments.config.notifyAtStatusField));
					}
				});
			}
		});
};

sharepointProcessHelpers.comments.getComments = function () {
	sharepointProcessHelpers.core.getListItemById(sharepointProcessHelpers.core.config.packagesList, sharepointProcessHelpers.core.queryObj()['ID'], [sharepointProcessHelpers.comments.config.commentsField]).done(
		function(ListItem) {
			var comments = ListItem.get_item(sharepointProcessHelpers.comments.config.commentsField);
			if (comments) {
				$('#sharepoint-process-helper_comment_list').html(comments.replace(/\n/g, "<br />"));
			}
			sharepointProcessHelpers.comments.updateCommentRecipients();
		});
};

$(document).on('click', '#sharepoint-process-helper_show_comment_form', function() {
	/*release: update comment recipients here */
	$(this).hide();
	$('#sharepoint-process-helper_comment_form').slideDown();
	$('#sharepoint-process-helper_new_comment_body').focus();
});

$(document).on('click', '#sharepoint-process-helper_post_comment', function() {
	if ($('#sharepoint-process-helper_new_comment_body').val() === '') {
		alert('Please enter a comment.');
	} else {
		sharepointProcessHelpers.comments.addComment($('#sharepoint-process-helper_new_comment_body').val()).done(function() {
			sharepointProcessHelpers.core.addMessage('commentAdded');
			location.reload();
		});
	}
});

sharepointProcessHelpers.comments.addComment = function (commentText) {
	var dfd = $.Deferred(function() {
		sharepointProcessHelpers.core.checkCurrentUser().done(function() {
			
			var dateObject = new Date();
			var date = dateObject.getMonth() + 1 + '/' + dateObject.getDate() + '/' +
				dateObject.getFullYear();
			sharepointProcessHelpers.core.getListItemById(sharepointProcessHelpers.core.config.packagesList, sharepointProcessHelpers.core.queryObj()['ID'], [sharepointProcessHelpers.comments.config.commentsField]).done(function(
				ListItem) {
				sharepointProcessHelpers.core.updateListItem(sharepointProcessHelpers.core.config.packagesList, sharepointProcessHelpers.core.queryObj()['ID'], sharepointProcessHelpers.comments.config.commentsField, sharepointProcessHelpers.core.currentUser +
					' on ' + date + ': ' + commentText + '\n\n' + (ListItem.get_item(
						sharepointProcessHelpers.comments.config.commentsField) || '')).done(function() {
					dfd.resolve(ListItem);
				});
			});
		});
	});
	return dfd.promise();
};

$(document).on('click', '#sharepoint-process-helper_add_cc', function() {
	var modalOptions = {
		title: "Add CC",
		url: sharepointProcessHelpers.comments.config.ccView + "?id=" + sharepointProcessHelpers.core.queryObj()['ID'],
		dialogReturnValueCallback: function() {
			sharepointProcessHelpers.comments.reloadComments();
		}
	};
	SP.UI.ModalDialog.showModalDialog(modalOptions);
});

if (sharepointProcessHelpers.core.queryObj()['ID']) {
  _spBodyOnLoadFunctionNames.push("sharepointProcessHelpers.comments.getComments");
}
