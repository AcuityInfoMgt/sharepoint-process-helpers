SharePoint Process Helpers
=======

**This tool is under development and is not yet stable for production use.**

Include these helpers on a document set homepage to add more interactive features to process trackers in SharePoint. These were originally used in a large organization, automating a process with over 200 stakeholders.

Initially we are targeting SharePoint 2010, but SharePoint 2013 support is likely in the future.

Place the helper files in the Site Assets folder of the site that contains the document set.

## Product roadmap

- Easier setup process
- SharePoint 2013 compatibility

## Core

This is required to use any of the helpers. It doesn’t do anything itself.

Requires jQuery to be declared first. Replace the jQuery src with the location of jQuery on your SharePoint server (you may need to add jQuery to your server).

Add this code in a content editor web part on top of the document set.
```
<script src="/SiteAssets/jquery.min.js" type="text/javascript"></script>
<script src="../../../SiteAssets/sharepoint-process-helpers_core.js" type="text/javascript"></script>
```

## Guidance

Displays customized instructions for each step of a process. The instructions at each step can be different.

Add a multi-line text field to your packages list called Guidance. Allow rich text.

Add this after the core code.

```
<script src="../../../SiteAssets/sharepoint-process-helpers_guidance.js" type="text/javascript"></script>
```

Add this where you would like the guidance to appear:

```
<div class=
"sharepoint-process-helpers_box">
  <div id="sharepoint-process-helpers_guidance_content"></div>
</div>
```

## Comments

Allows users to leave comments on a document set. The comments are stored in a multiline text field in the document set.

Add a Comments field to your packages list.

If you would like to alert different people to comments at each status, add an AutoSendNotificationsTo field on your Statuses list.

To notify different people for each package, add a field(s) to your packages list that would contain those people's names. For instance, you might add an OfficeDirector field to your packages list, and want the person(s) in that field to receive comments for that package.

If you would liek to allow commenters to "CC" others on comments for the package, add a CC field to your packages list.

Add this code after the core code.

```
<script src="../../../SiteAssets/sharepoint-process-helpers_comments.js" type="text/javascript"></script>
```

Add this where you would like the comments to appear:

```
<div class=
"sharepoint-process-helpers_comments sharepoint-process-helpers_box">
	<h2>Comments</h2>

	<div id="sharepoint-process-helper_comment_list">
		<p style="font-style: italic">No comments yet</p>
	</div>

	<div class=
	"sharepoint-process-helpers_button sharepoint-process-helpers_button_primary"
	id="sharepoint-process-helper_show_comment_form">
		Add a Comment
	</div>

	<div id="sharepoint-process-helper_comment_form">
		<p><strong>Enter a comment:</strong></p>

		<p>To: <span id=
		"sharepoint-process-helper_comment_recipients"></span> <a class=
		"sharepoint-process-helper_fake_link" id=
		"sharepoint-process-helper_add_cc">Add recipient</a></p>

		<div>
			<textarea id="sharepoint-process-helper_new_comment_body">
</textarea>
		</div>

		<div class=
		"sharepoint-process-helpers_button sharepoint-process-helpers_button_primary"
		id="sharepoint-process-helper_post_comment">
			Add Comment
		</div>
	</div>
</div>
```

## Status buttons

Shows buttons that allow users to easily change the status of a document set, with one-click. The administrator can customize the status buttons for each step.

Add a MoveToStatusButtons field to your Statuses list. It should be a lookup field to the Statuses list and allow multiple selections.

Add this after the core code.

```
<script src="../../../SiteAssets/sharepoint-process-helpers_status.js" type="text/javascript"></script>
```

Add this where you would like the status buttons to appear:

```
<div id="sharepoint-process-helpers_status_buttons" class="sharepoint-process-helpers_box">
	<h2>Move package</h2>
	<div id="sharepoint-process-helpers_status_buttons_content"></div>
</div>
```

## Approvals

Allows users to approve document sets with one click, and stores those approvals in fields on the document set. A simple alternative to more complex approval flows in SharePoint.

Add an Approvers list, with three fields: Title, ApprovedByField, and ApprovedOnField.

To your packages list, add By and On fields for each approver. For example, OfficeDirectorApprovedBy and OfficeDirectorApprovedOn. These fields will track each approval for a package.

To your Statuses list, add an Approvers field.

Add this after the core code.

```
<script src="../../../SiteAssets/sharepoint-process-helpers_approvals.js" type="text/javascript"></script>
```

Add this where you would like the approval boxes to appear:

```
<div id="sharepoint-process-helpers_approvals" class="sharepoint-process-helpers_box">
	<h2>Approve package</h2>
	<div id="sharepoint-process-helpers_approvals_content"></div>
</div>
```


