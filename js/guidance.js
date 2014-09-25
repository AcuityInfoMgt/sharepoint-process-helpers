sharepointProcessHelpers.guidance = sharepointProcessHelpers.guidance || {};

sharepointProcessHelpers.guidance.config = { 
	guidanceField: 'Guidance', /* field in the Status list that contains the guidance for this status */
};

sharepointProcessHelpers.guidance.getGuidance = function () {
	sharepointProcessHelpers.core.getListItemById(sharepointProcessHelpers.core.config.packagesList, sharepointProcessHelpers.core.queryObj()['ID'], sharepointProcessHelpers.core.config.statusField).done(
		function(ListItem) {
			if (ListItem.get_item(sharepointProcessHelpers.core.config.statusField)) {
				sharepointProcessHelpers.core.getListItemById(sharepointProcessHelpers.core.config.statusesList, ListItem.get_item(sharepointProcessHelpers.core.config.statusField).get_lookupId(), sharepointProcessHelpers.guidance.config.guidanceField).done(
					function(ListItem) {
						/*if(sharepointProcessHelpers.guidance.config.guidanceField.length > 0) {
							$('#sharepoint-process-helpers_guidance').show();
						}*/
						$('#sharepoint-process-helpers_guidance_content').html(ListItem.get_item(sharepointProcessHelpers.guidance.config.guidanceField));
					}
				);
			}
		}
	);
}


  ExecuteOrDelayUntilScriptLoaded(sharepointProcessHelpers.guidance.getGuidance, "sp.js");

