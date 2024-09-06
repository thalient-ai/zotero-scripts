# Zotero Scripts

This repository contains a collection of custom scripts designed to enhance the functionality of [Zotero](https://www.zotero.org/), a free, easy-to-use tool to help you collect, organize, cite, and share your research sources.

These are scripts that I use to manage my own Zotero library. They provide various functionalities that are not currently available in Zotero but may be planned as features for a later date.

I have incorporated detailed logging, optimization, error handling, and input validation into each script. While I cannot guarantee compatibility with all versions of Zotero, cover all edge cases, or ensure flawless operation for every user's library, I am happy to assist with any issues that may arise.

The advantage of these scripts is that they support bulk and batch operations:

- **Bulk Editing**: This involves selecting multiple items and applying changes to fields such as titles, tags, authors, or notes all at once. For example, if you need to add the same tag to 50 items, bulk editing allows you to do this in a single action.
- **Batch Editing**: Similar to bulk editing, batch editing typically implies a sequence of edits or a series of automated steps that are applied to a group of selected items. It can involve more complex modifications, such as using regular expressions to find and replace text across multiple fields.

## Compatibility
All scripts were written for Zotero 7

![Screenshot](doc/zotero_version.png)

## Scripts

I am providing two sets of scripts. The first set of scripts are run in Zotero's `Run Javascript` Developer Tool. The second set of scripts are compatible with WindingWind's [Actions and Tags](https://github.com/windingwind/zotero-actions-tags) plugin.
 
### `Run Javascript` Scripts
| Script | Description | Script README | Script Link |
| --- | --- | --- | --- |
| **Attachment Backup (`attachment_backup.js`)** | Copy attachment files for selected items to a user-specified folder. | [README](https://github.com/thalient-ai/zotero-scripts/tree/main/zotero-attachment-backup) | [Script](https://github.com/thalient-ai/zotero-scripts/blob/main/zotero-attachment-backup/src/attachment_backup.js) |
| **Attachment Date Added (`attachment_dateAdded.js`)** | Update the "Date Added" field of parent items to match the "Date Added" of their attachment(s). | [README](https://github.com/thalient-ai/zotero-scripts/blob/main/zotero-attachment-dateAdded/README.md) | [Script](https://github.com/thalient-ai/zotero-scripts/blob/main/zotero-attachment-dateAdded/src/attachment_dateAdded.js) |
| **Attachment Delete (`attachment_delete.js`)** | Delete the local attachment files for selected items. This script is intended for Zotero Sync users. | [README](https://github.com/thalient-ai/zotero-scripts/blob/main/zotero-attachment-delete/README.md) | [Script](https://github.com/thalient-ai/zotero-scripts/blob/main/zotero-attachment-delete/src/attachment_delete.js) |
| **Attachment Download (`attachment_download.js`)** | When using Zotero Sync, this script allows you to selectively download attachments in bulk. | Placeholder | [Script](https://github.com/thalient-ai/zotero-scripts/blob/main/zotero-attachment-download/src/attachment_download.js) |
| **Attachment Rename (`zotero_attachment_rename.js`)** | Rename attachment filenames and/or titles based on the parent item metadata. | [README](https://github.com/thalient-ai/zotero-scripts/tree/main/zotero-attachment-rename) | [Script](https://github.com/thalient-ai/zotero-scripts/blob/main/zotero-attachment-rename/src/zotero_attachment_rename.js) |
| **Batch Tagging (`zotero_batch_tag.js`)** | Add, remove, replace, split, and combine tags for multiple items. The script now supports converting the text case of multiple tags (lower, upper, title, and sentence). | [README](https://github.com/thalient-ai/zotero-scripts/tree/main/zotero-batch-tag) | [Script](https://github.com/thalient-ai/zotero-scripts/blob/main/zotero-batch-tag/src/zotero_batch_tag.js) |
| **Bulk Edit (`zotero_bulk_edit.js`)** | Edit the metadata (fields, notes, and authors) or item type (document, book, journal article...)  for multiple items. | [README](https://github.com/thalient-ai/zotero-scripts/tree/main/zotero-bulk-edit) | [Script](https://github.com/thalient-ai/zotero-scripts/blob/main/zotero-bulk-edit/src/zotero_bulk_edit.js) |
| **Duplicate Enhanced (`duplicate_enhanced.js`)** | Detect, merge, or tag duplicate items in your Zotero library based on similar metadata. | [README](https://github.com/thalient-ai/zotero-scripts/tree/main/zotero-duplicate-enhanced) | [Script](https://github.com/thalient-ai/zotero-scripts/blob/main/zotero-duplicate-enhanced/src/duplicate_enhanced.js) |
| **Similar Name Detection (`similar_name_detection.js`)** | Detect and rename similar author names | [README](https://github.com/thalient-ai/zotero-scripts/tree/main/zotero-similar-name-detection) | [Script](https://github.com/thalient-ai/zotero-scripts/blob/main/zotero-similar-name-detection/src/similar_name_detection.js) |
| **Text Case Conversion (`zotero-text-case.js`)** | Convert the text case of titles for selected Zotero items. | [README](https://github.com/thalient-ai/zotero-scripts/tree/main/zotero-text-case) | [Script](https://github.com/thalient-ai/zotero-scripts/blob/main/zotero-text-case/src/zotero-text-case.js) |

### [Actions and Tags](https://github.com/windingwind/zotero-actions-tags) Plugin Scripts
The Actions and Tags plugin enables you to add these scripts to the plugin and either execute them via the context menu (i.e., right click menu), map them to a keyboard shortcut, or have them execute automatically via a workflow. It is a huge quality of life improvement. Review the plugin's homepage for usage instructions.

| Script | Description | Script Link |
| --- | --- | --- |
| **Attachment Backup** | Copy attachment files for selected items to a user-specified folder. | [Script](https://github.com/thalient-ai/zotero-scripts/blob/main/zotero-attachment-backup/src/actionandtag_attachment_backup.js) |
| **Attachment Date Added** | Update the "Date Added" field of parent items to match the "Date Added" of their attachment(s). | [Script](https://github.com/thalient-ai/zotero-scripts/blob/main/zotero-attachment-dateAdded/src/actionandtag_dateAdded.js) |
| **Attachment Delete** | Delete the local attachment files for selected items. This script is intended for Zotero Sync users. | [Script](https://github.com/thalient-ai/zotero-scripts/blob/main/zotero-attachment-delete/src/actionandtag_attachment_delete.js) |
| **Attachment Rename** | Rename attachment filenames and/or titles based on the parent item metadata. | [Script](https://github.com/thalient-ai/zotero-scripts/blob/main/zotero-attachment-rename/src/actionandtag_attachment_rename.js) |
| **Attachment Title Sync** | Rename attachment titles to match attachment filenames. | [Script](https://github.com/thalient-ai/zotero-scripts/blob/main/zotero-attachment-rename/src/actionandtag_attachment_title_sync.js) |
| **Batch Tagging** | Add, remove, replace, split, and combine tags for multiple items. | [Script](https://github.com/thalient-ai/zotero-scripts/blob/main/zotero-batch-tag/src/actionandtag_batch_tag.js) |
| **Bulk Edit** | Edit the metadata (fields, notes, and authors) or item type (document, book, journal article...)  for multiple items. | [Script](https://github.com/thalient-ai/zotero-scripts/blob/main/zotero-bulk-edit/src/actionandtag_bulk_edit.js) |
| **Duplicate Enhanced** | Detect, merge, or tag duplicate items in your Zotero library based on similar metadata. | [Script](https://github.com/thalient-ai/zotero-scripts/blob/main/zotero-duplicate-enhanced/src/actionandtag_duplicate.js) |
| **Zoom by Page Height** | Sets the view of PDF reader tabs and windows to "Zoom by Page Height" | [Script](https://github.com/windingwind/zotero-actions-tags/discussions/378) |
| **Zutilo Copy** | Duplicates the copy functionality from Zutilo, copies an Item's metadata to the clipboard | [Script](https://github.com/windingwind/zotero-actions-tags/discussions/383) |
| **Zutilo Paste** | Duplicates the paste functionality from Zutil, pastes an items fields, type, creators, or tags to other items | [Script](https://github.com/windingwind/zotero-actions-tags/discussions/384) |

## Usage

1. Download or copy the desired script(s) from this repository.
2. Open Zotero.
3. Go to `Tools > Developer > Run JavaScript`.
4. Copy and paste the script content into the Zotero JavaScript console. The `.js` files can be opened in a text editor like Notepad++.
5. Press `Run`.

If you clone or fork the repository, you can add the scripts (.js) to your Zotero library by going to `File` -> `Add Attachment` -> `Add Link to File...`. This will add the script to your library, but pull it from your local GitHub directory.

## Short Descriptions

#### [Attachment Backup (`attachment_backup.js`)](https://github.com/thalient-ai/zotero-scripts/blob/main/zotero-attachment-backup/src/attachment_backup.js)
- Have you ever wanted to back up or download multiple attachments from Zotero, only to realize that Zotero stores attachments in individual folders? Meaning that you would need to go to each folder in the Zotero directory and manually copy the .pdf or other attachment.
- This script solves that problem by allowing you to select multiple items within Zotero, run the script, and create a copy of the attachment file(s) to a folder of your choosing.

#### [Attachment Date Added (`attachment_dateAdded.js`)](https://github.com/thalient-ai/zotero-scripts/blob/main/zotero-attachment-dateAdded/src/attachment_dateAdded.js)
- Keeping track of when files were added to your Zotero library can be important for organization and research. An issue arises when you add files to your library on one date but create the parent item of those files at a later date. Both the attachment file and the parent item have their own separate "Date Added" fields. Meaning that the "Date Added" of the parent item may differ from the "Date Added" of the child attachment.
- This script updates the "Date Added" field of parent items to match the "Date Added" of their attachments. If there are multiple attachments, the earliest "Date Added" will be selected.

#### [Attachment Delete (`attachment_delete.js`)](https://github.com/thalient-ai/zotero-scripts/blob/main/zotero-attachment-delete/src/attachment_delete.js)
- When [Zotero Sync](https://www.zotero.org/support/sync) is used, your Zotero library is automatically backed up. You may have limited storage on your local devices and may want to trim how many files your local instance of Zotero is storing on your computer, especially for larger libraries. When using Zotero Sync, you can remove local attachments (.pdfs) and configure Zotero to choose to download attachments as needed.
- This script allows you to delete local attachment files for selected items without affecting your Zotero library. The script assumes that you are using Zotero Sync and that all of your data is successfully backed up. This script is for advanced users.

#### [Attachment Rename (`zotero_attachment_rename.js`)](https://github.com/thalient-ai/zotero-scripts/blob/main/zotero-attachment-rename/src/zotero_attachment_rename.js)
- Zotero has a built-in option to rename item attachments (e.g., the actual .pdf file) based on a style defined in the Zotero settings and the parent item's metadata. However, this option can only be executed when the attachments are selected. Additionally, the latest Zotero 7 beta renames attachment titles according to their file type (e.g., PDF, EPUB, etc.).
- This script makes it easy to rename the attachment filenames and/or titles of multiple items based on their parent item's metadata, with options to choose the scope of items and handle multiple attachments for a single item. Additionally, the script doesn't require that the attachments themselves be selected.

#### [Batch Tagging (`zotero_batch_tag.js`)](https://github.com/thalient-ai/zotero-scripts/blob/main/zotero-batch-tag/src/zotero_batch_tag.js)
- Tags are a very useful feature of Zotero, but managing them can become very complicated.
- This script allows users to add, remove, replace, combine, or split tags across multiple items, with options to select items from the active collection, saved searches, or selected items. When removing tags, you can choose to remove a single tag, multiple tags by search, all tags, or all tags except for those specified. The script now supports modifying the text case (lower, upper, title, sentence) of all tags used across selected items, within an active collection or saved search.

#### [Bulk Edit (`zotero_bulk_edit.js`)](https://github.com/thalient-ai/zotero-scripts/blob/main/zotero-bulk-edit/src/zotero_bulk_edit.js)
- In Zotero, there is no option to edit the item types or metadata fields of multiple items simultaneously. If you have a large library, you have to edit each item one by one.
- This script allows you to bulk or batch edit the item types (e.g., book, document, journal article), metadata fields (title, author, date, etc.), and notes for multiple items. The script allows users to choose the scope of items to edit (i.e., selected items, items in a collection, or items in a saved search). The script offers suggestions and autocomplete when choosing the field to edit. It also supports regular expressions for search and replace.

#### [Duplicate Enhanced (`duplicate_enhanced.js`)](https://github.com/thalient-ai/zotero-scripts/blob/main/zotero-duplicate-enhanced/src/duplicate_enhanced.js)
- The [built-in duplicate detection](https://www.zotero.org/support/duplicate_detection) in Zotero is very rudimentary and rigid. Items that are duplicates but have slight differences in their metadata are not detected using the built-in method.
- This script detects duplicates using a similarity calculation of key metadata fields. The user can modify the script to set weights as well as set the similarity threshold through prompts. When a duplicate is detected, the script presents the items and their metadata to the user along with the calculated similarity. The user can then add a unique tag to both, move a duplicate to the trash, or ignore the duplicates.

#### [Similar Name Detection (`similar_name_detection.js`)](https://github.com/thalient-ai/zotero-scripts/blob/main/zotero-similar-name-detection/src/similar_name_detection.js)
- An author's name may appear differently across multiple items. For example, "John Doe", "John J. Doe", "J. J. Doe". 
- This script compares author names across multiple items and detects similar names like the example above. The script then provides the option to rename those author names using a user-defined consistent format.

#### [Text Case Conversion (`zotero-text-case.js`)](https://github.com/thalient-ai/zotero-scripts/blob/main/zotero-text-case/src/zotero-text-case.js)
- Zotero has a built-in feature to change an item's title to `Title Case` or `Sentence Case`. However, these options do not handle edge cases well, such as abbreviations and acronyms. Additionally, there is no option for `Upper Case` or `Lower Case`.
- This script converts the titles of multiple items to `Title Case`, `Sentence Case`, `Upper Case`, or `Lower Case`. The script also includes a custom capitalization dictionary to specially handle user-defined terms and acronyms. The user can add and remove terms from the custom dictionary in the script. The script conforms to the APA rules for `Title Case`.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request or open an issue if you have any suggestions or find any bugs.

## License

This project is licensed under the GPL-3.0 License - see the [LICENSE](LICENSE) file for details.
