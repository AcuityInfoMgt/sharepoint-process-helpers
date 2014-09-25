var sharepointProcessHelpers = sharepointProcessHelpers || {};
sharepointProcessHelpers.redirect = sharepointProcessHelpers.redirect || {};

sharepointProcessHelpers.redirect.init = function() {
	if (typeof sharepointProcessHelpers !== 'undefined') {
		if (sharepointProcessHelpers.core.queryObj()['PackageID']) {
			sharepointProcessHelpers.core.getListItemById(sharepointProcessHelpers.core.config.packagesList, sharepointProcessHelpers.core.queryObj()['PackageID'], ['FileRef']).done(function (ListItem) {
				document.location.href = ListItem.get_item('FileRef');
			});
		}
	}
}

_spBodyOnLoadFunctionNames.push("sharepointProcessHelpers.redirect.init");
