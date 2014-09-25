var sharepointProcessHelpers = sharepointProcessHelpers || {};
sharepointProcessHelpers.core = sharepointProcessHelpers.core || {};

sharepointProcessHelpers.core.config = {
	packagesList: 'Packages', /* document set library of packages moving through the process */
	statusesList: 'Statuses', /* list of statuses */
	statusField: 'Status', /* field in this record that references the list of statuses */
	confirmationMessages: { /* shown to the user right after they take the specified action */
		'packageApproved': 'You have approved this package.',
		'packageApprovedAndMoved': 'You have approved this package, and it has been moved to the next step.',
		'statusMoved': 'You have moved this package.',
		'commentAdded': 'You have added a comment.'
	}
}

sharepointProcessHelpers.core.checkUserFailed = function() {
	alert(
		"Please reload the page, as an error occurred.\n\nIf this happens again, let the SharePoint team know that user information could not be retrieved."
	);
};

sharepointProcessHelpers.core.init = function(selector, fn) {
	sharepointProcessHelpers.approvals.getApprovals();
	sharepointProcessHelpers.comments.getComments();
	sharepointProcessHelpers.guidance.getGuidance();
	sharepointProcessHelpers.guidance.getStatuses();
	if (sharepointProcessHelpers.core.getMessage()) {
		$('.s4-ba').before('<div class="sharepoint-process-helpers_top-message">' + sharepointProcessHelpers.core.config.confirmationMessages[sharepointProcessHelpers.core.getMessage()] + '</div>');
		sharepointProcessHelpers.core.deleteMessage();
	}
}

sharepointProcessHelpers.core.addMessage = function(message) {
	document.cookie = "sharepoint-process-helpers_message"+"="+message+"; path=/";
}

sharepointProcessHelpers.core.getMessage = function () {
	var nameEQ = "sharepoint-process-helpers_message" + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

sharepointProcessHelpers.core.deleteMessage = function () {
	document.cookie = "sharepoint-process-helpers_message=; path=/";}

sharepointProcessHelpers.core.queryObj = function () {
    var result = {}, queryString = location.search.slice(1),
        re = /([^&=]+)=([^&]*)/g, m;

    while (m = re.exec(queryString)) {
        result[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    }
    return result;
}

sharepointProcessHelpers.core.checkCurrentUser = function() {
	var dfd = $.Deferred(function() {
		if (sharepointProcessHelpers.core.currentUser) {
			dfd.resolve();
		} else {
			var context = SP.ClientContext.get_current();
			var siteColl = context.get_site();
			var web = siteColl.get_rootWeb();
			this._currentUser = web.get_currentUser();
			context.load(this._currentUser);
			context.executeQueryAsync(Function.createDelegate(this, function() {
				sharepointProcessHelpers.core.currentUser = this._currentUser.get_title();
				dfd.resolve();
			}), sharepointProcessHelpers.core.checkUserFailed);
		}
		});
	return dfd.promise();
}

sharepointProcessHelpers.core.getListItemById = function(listName, listItemId,
	fields, site) {
	var dfd = $.Deferred(function() {
		var SPContext;
		if (site) {
			SPContext = new SP.ClientContext(site);
		} else {
			SPContext = new SP.ClientContext.get_current();
		}
		var web = SPContext.get_web();
		var list = web.get_lists().getByTitle(listName);
		var ListItem = list.getItemById(listItemId);
		SPContext.load.apply(this, [ListItem].concat(fields));
		SPContext.executeQueryAsync(function() {
			dfd.resolve(ListItem);
		}, sharepointProcessHelpers.core.updateListItem_Fail);
	});
	return dfd.promise();
};

sharepointProcessHelpers.core.updateListItem = function(listName, listItemId,
	field, value, site) {
	var dfd = $.Deferred(function() {
		var SPContext;
		if (site) {
			SPContext = new SP.ClientContext(site);
		} else {
			SPContext = new SP.ClientContext.get_current();
		}
		var web = SPContext.get_web();
		var list = web.get_lists().getByTitle(listName);
		var ListItem = list.getItemById(listItemId);
		if (field instanceof Array) {
			$.each(field, function(i, item) {
				ListItem.set_item(field[i], value[i]);
			});
		} else {
			ListItem.set_item(field, value);
		}
		ListItem.update();
		SPContext.executeQueryAsync(function() {
			dfd.resolve(ListItem);
		}, sharepointProcessHelpers.core.updateListItem_Fail);
	});
	return dfd.promise();
};

sharepointProcessHelpers.core.updateListItem_Fail = function(sender, args) {
	alert(
		"Please reload the page and try again.\n\nIf it does not work the second time, report this error to support:\n" +
		args.get_message());
};

sharepointProcessHelpers.core.getListItemById_Fail = function(sender, args) {
	alert(
		"Please reload the page and try again.\n\nIf it does not work the second time, report this error to support:\n" +
		args.get_message());
};

sharepointProcessHelpers.core.forEachElement = function(selector, fn) {
  var elements = document.querySelectorAll(selector);
  for (var i = 0; i < elements.length; i++)
    fn(elements[i], i);
}

/*
sharepointProcessHelpers.core.preInit = function() {
	SP.SOD.executeFunc('sp.js', 'SP.ClientContext', sharepointProcessHelpers.core.init);
}*/

SP.SOD.executeFunc('sp.js', 'SP.ClientContext', function () { console.log("Initiating SP.ClientContext") });
SP.SOD.executeOrDelayUntilScriptLoaded(sharepointProcessHelpers.core.init,"sp.js");

/*_spBodyOnLoadFunctionNames.push("sharepointProcessHelpers.core.preInit");*/
