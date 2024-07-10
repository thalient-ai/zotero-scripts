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

## Scripts Included

| Script | Description | Script README | Script Link |
| --- | --- | --- | --- |
| **Attachment Backup (`attachment_backup.js`)** | Backs up the attachments of the selected Zotero items to a user-specified folder. | [README](https://github.com/thalient-ai/zotero-scripts/tree/main/zotero-attachment-backup) | [Script](https://github.com/thalient-ai/zotero-scripts/blob/main/zotero-attachment-backup/src/attachment_backup.js) |
| **Attachment Date Added (`attachment_dateAdded.js`)** | Updates the "Date Added" field of parent items to match the earliest "Date Added" of their attachment(s). | [README](https://github.com/thalient-ai/zotero-scripts/blob/main/zotero-attachment-dateAdded/README.md) | [Script](https://github.com/thalient-ai/zotero-scripts/blob/main/zotero-attachment-dateAdded/src/attachment_dateAdded.js) |
| **Attachment Delete (`attachment_delete.js`)** | Deletes the local attachment files for selected items, items in a collection, items in a saved search, or all items in the library. This script is meant for Zotero Sync users. | [README](https://github.com/thalient-ai/zotero-scripts/blob/main/zotero-attachment-delete/README.md) | [Script](https://github.com/thalient-ai/zotero-scripts/blob/main/zotero-attachment-delete/src/attachment_delete.js) |
| **Attachment Rename (`zotero_attachment_rename.js`)** | Batch renaming of attachment filenames and/or titles based on the parent item’s metadata. | [README](https://github.com/thalient-ai/zotero-scripts/tree/main/zotero-attachment-rename) | [Script](https://github.com/thalient-ai/zotero-scripts/blob/main/zotero-attachment-rename/src/zotero_attachment_rename.js) |
| **Batch Tagging (`zotero_batch_tag.js`)** | Add, remove, replace, split, and combine tags for multiple Zotero items. | [README](https://github.com/thalient-ai/zotero-scripts/tree/main/zotero-batch-tag) | [Script](https://github.com/thalient-ai/zotero-scripts/blob/main/zotero-batch-tag/src/zotero_batch_tag.js) |
| **Bulk Edit (`zotero_bulk_edit.js`)** | Edit the metadata (fields, notes, and authors) for multiple Zotero items. | [README](https://github.com/thalient-ai/zotero-scripts/tree/main/zotero-bulk-edit) | [Script](https://github.com/thalient-ai/zotero-scripts/blob/main/zotero-bulk-edit/src/zotero_bulk_edit.js) |
| **Duplicate Enhanced (`duplicate_enhanced.js`)** | Detection of duplicate items in your Zotero library based on customizable similarity thresholds and weights. | [README](https://github.com/thalient-ai/zotero-scripts/tree/main/zotero-duplicate-enhanced) | [Script](https://github.com/thalient-ai/zotero-scripts/blob/main/zotero-duplicate-enhanced/src/duplicate_enhanced.js) |
| **Text Case Conversion (`zotero-text-case.js`)** | Converts the case of titles for selected Zotero items. | [README](https://github.com/thalient-ai/zotero-scripts/tree/main/zotero-text-case) | [Script](https://github.com/thalient-ai/zotero-scripts/blob/main/zotero-text-case/src/zotero-text-case.js) |


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
- Zotero has a built-in option to rename item attachments (e.g., the actual .pdf file) based on a style defined in the Zotero settings and the parent item's metadata. However, this option can only be executed when the attachments are selected. 
- This script makes it easy to rename the attachment filenames and/or titles of multiple items based on their parent item's metadata, with options to choose the scope of items and handle multiple attachments for a single item. Additionally, the script doesn't require that the attachments themselves be selected.

#### [Batch Tagging (`zotero_batch_tag.js`)](https://github.com/thalient-ai/zotero-scripts/blob/main/zotero-batch-tag/src/zotero_batch_tag.js)
- Tags are a very useful feature of Zotero, but managing them can become very complicated.
- This script allows users to add, remove, replace, combine, or split tags across multiple items, with options to select items from the active collection, saved searches, or selected items. When removing tags, you can choose to remove a single tag, multiple tags by search, all tags, or all tags except for those specified.

#### [Bulk Edit (`zotero_bulk_edit.js`)](https://github.com/thalient-ai/zotero-scripts/blob/main/zotero-bulk-edit/src/zotero_bulk_edit.js)
- In Zotero, there is no option to edit the fields or metadata of multiple items simultaneously. If you have a large library, you have to edit each item one by one.
- This script allows you to bulk or batch edit the fields, notes, and authors for multiple items. The script allows users to choose the scope of items to edit (i.e., selected items, items in a collection, or items in a saved search). The script offers suggestions and autocomplete when choosing the field to edit. It also supports regular expressions for search and replace.

#### [Duplicate Enhanced (`duplicate_enhanced.js`)](https://github.com/thalient-ai/zotero-scripts/blob/main/zotero-duplicate-enhanced/src/duplicate_enhanced.js)
- The [built-in duplicate detection](https://www.zotero.org/support/duplicate_detection) in Zotero is very rudimentary and rigid. Items that are duplicates but have slight differences in their metadata are not detected using the built-in method.
- This script detects duplicates using a similarity calculation of key metadata fields. The user can modify the script to set weights as well as set the similarity threshold through prompts. When a duplicate is detected, the script presents the items and their metadata to the user along with the calculated similarity. The user can then add a unique tag to both, move a duplicate to the trash, or ignore the duplicates.

#### [Text Case Conversion (`zotero-text-case.js`)](https://github.com/thalient-ai/zotero-scripts/blob/main/zotero-text-case/src/zotero-text-case.js)
- Zotero has a built-in feature to change an item's title to `Title Case` or `Sentence Case`. However, these options do not handle edge cases well, such as abbreviations and acronyms. Additionally, there is no option for `Upper Case` or `Lower Case`.
- This script converts the titles of multiple items to `Title Case`, `Sentence Case`, `Upper Case`, or `Lower Case`, using a custom capitalization dictionary for specific terms and acronyms. The user can add and remove terms from the custom dictionary in the script. The script conforms to the APA rules for `Title Case`.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request or open an issue if you have any suggestions or find any bugs.

## License

This project is licensed under the GPL-3.0 License - see the [LICENSE](LICENSE) file for details.
