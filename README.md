# Zotero Scripts

This repository contains a collection of custom scripts designed to enhance the functionality of [Zotero](https://www.zotero.org/), a free, easy-to-use tool to help you collect, organize, cite, and share your research sources. All of the scripts support bulk or batch editing of multiple Zotero items. All of the scripts have detailed logging, are optimized for performance (for especially large libraries), and include input validation and error handling.

## Compatibility
All scripts were written for Zotero 7

![Screenshot](doc/zotero_version.png)

## Scripts Included

| Script | Description | Script README | Script Link |
| --- | --- | --- | --- |
| **Attachment Backup (`attachment_backup.js`)** | Backs up attachments from selected Zotero items to a specified folder. | [README](https://github.com/thalient-ai/zotero-scripts/tree/main/zotero-attachment-backup) | [Script](https://github.com/thalient-ai/zotero-scripts/blob/main/zotero-attachment-backup/src/attachment_backup.js) |
| **Attachment Date Added (`attachment_dateAdded.js`)** | Updates the "Date Added" field of parent items to match the earliest "Date Added" date of their attachments. | [README](https://github.com/thalient-ai/zotero-scripts/blob/main/zotero-attachment-dateAdded/README.md) | [Script](https://github.com/thalient-ai/zotero-scripts/blob/main/zotero-attachment-dateAdded/src/attachment_dateAdded.js) |
| **Attachment Delete (`attachment_delete.js`)** | Deletes local attachment files for selected items, items in a collection, items in a saved search, or all items in the library. | [README](https://github.com/thalient-ai/zotero-scripts/blob/main/zotero-attachment-delete/README.md) | [Script](https://github.com/thalient-ai/zotero-scripts/blob/main/zotero-attachment-delete/src/attachment_delete.js) |
| **Attachment Rename (`zotero_attachment_rename.js`)** | Renames attachment filenames and/or titles based on the parent item’s metadata. | [README](https://github.com/thalient-ai/zotero-scripts/tree/main/zotero-attachment-rename) | [Script](https://github.com/thalient-ai/zotero-scripts/blob/main/zotero-attachment-rename/src/zotero_attachment_rename.js) |
| **Batch Tagging (`zotero_batch_tag.js`)** | Allows batch tagging operations on selected Zotero items. | [README](https://github.com/thalient-ai/zotero-scripts/tree/main/zotero-batch-tag) | [Script](https://github.com/thalient-ai/zotero-scripts/blob/main/zotero-batch-tag/src/zotero_batch_tag.js) |
| **Bulk Edit (`zotero_bulk_edit.js`)** | Allows bulk or batch editing of fields, notes, and authors for multiple Zotero items. | [README](https://github.com/thalient-ai/zotero-scripts/tree/main/zotero-bulk-edit) | [Script](https://github.com/thalient-ai/zotero-scripts/blob/main/zotero-bulk-edit/src/zotero_bulk_edit.js) |
| **Duplicate Enhanced (`duplicate_enhanced.js`)** | Detects and handles duplicate items in your Zotero library based on customizable similarity thresholds and weights. | [README](https://github.com/thalient-ai/zotero-scripts/tree/main/zotero-duplicate-enhanced) | [Script](https://github.com/thalient-ai/zotero-scripts/blob/main/zotero-duplicate-enhanced/src/duplicate_enhanced.js) |
| **Text Case Conversion (`zotero-text-case.js`)** | Converts the case of titles for selected Zotero items. | [README](https://github.com/thalient-ai/zotero-scripts/tree/main/zotero-text-case) | [Script](https://github.com/thalient-ai/zotero-scripts/blob/main/zotero-text-case/src/zotero-text-case.js) |


## Usage

1. Download the desired script(s) from this repository.
2. Open Zotero.
3. Go to `Tools > Developer > Run JavaScript`.
4. Copy and paste the script content into the Zotero JavaScript console. The `.js` files can be opened in a text editor like Notepad++.
5. Press `Run`.

If you clone or fork the repository, you can add the scripts (.js) to your Zotero library by going to `File` -> `Add Attachment` -> `Add Link to File...`. This will add the script to your library, but pull it from your local GitHub directory.

Here are the short descriptions for all of the scripts, sorted alphabetically by script name:

## Short Descriptions

#### Attachment Backup (`attachment_backup.js`)
- Have you ever wanted to back up or download multiple attachments from Zotero, only to realize that Zotero stores attachments in individual folders, meaning that you'll have to go to each folder to copy the .pdf or other attachment?
- This script solves that problem by allowing you to select multiple items within Zotero, run the script, and create a copy of the attachment file(s) to a folder of your choosing.

#### Attachment Date Added (`attachment_dateAdded.js`)
- Keeping track of when files were added to your Zotero library can be important for organization and research.
- This script updates the "Date Added" field of parent items to match the earliest "Date Added" date of their attachments, ensuring that your metadata reflects the earliest associated date.

#### Attachment Delete (`attachment_delete.js`)
- Managing storage and ensuring that only necessary files are kept can be a hassle in large Zotero libraries, especially when you have limited local storage. This script is for those who are using Zotero Sync and would like to remove local files that are already backed up.
- This script allows you to delete local attachment files for selected items, items in a collection, items in a saved search, or all items in the library, with user prompts and confirmations to prevent accidental deletions.

#### Attachment Rename (`zotero_attachment_rename.js`)
- Zotero has a built-in option to rename item attachments (e.g., the actual .pdf file) based on a style defined in the Zotero settings and the parent item's metadata. However, this option can only be executed when the attachments are selected. 
- This script makes it easy to rename the attachment filenames and/or titles of multiple items based on their parent item's metadata, with options to choose the scope of items and handle multiple attachments for a single item. Additionally, the script doesn't require that the attachments themselves be selected.

#### Batch Tagging (`zotero_batch_tag.js`)
- Tags are a very useful feature of Zotero, and managing them can become very complicated.
- This script allows users to add, remove, or replace tags on multiple items, with options to select items from the current collection, saved searches, or selected items.

#### Bulk Edit (`zotero_bulk_edit.js`)
- In Zotero, there is no option to edit the fields or metadata of multiple items simultaneously. If you have a large library, you have to edit each item one by one.
- This script allows you to bulk or batch edit the fields, notes, and authors for multiple items. The script allows users to choose the scope of items to edit (i.e., selected items, items in a collection, or items in a saved search). The script offers suggestions and autocomplete when choosing the field to edit. It also supports regular expressions for search and replace.

#### Duplicate Enhanced (`duplicate_enhanced.js`)
- Have you found the [built-in duplicate detection](https://www.zotero.org/support/duplicate_detection) in Zotero a bit too limited? Items that are duplicates but have slight differences in metadata fields are not detected as duplicates.
- This script detects duplicates using a similarity calculation of key metadata fields. The user can modify the script to set weights as well as set the similarity threshold through prompts. When a duplicate is detected, the script presents the items and their metadata to the user along with the calculated similarity. The user can then add a unique tag to both, move a duplicate to the trash, or ignore the duplicates.

#### Text Case Conversion (`zotero-text-case.js`)
- Zotero has a built-in feature to change an item's title to `Title Case` or `Sentence Case`. However, these options do not handle edge cases well, such as abbreviations and acronyms. Additionally, there is no option for `Upper Case` or `Lower Case`.
- This script converts the titles of multiple items to `Title Case`, `Sentence Case`, `Upper Case`, or `Lower Case`, using a custom capitalization dictionary for specific terms and acronyms. The user can add and remove terms from the custom dictionary in the script. The script conforms to the APA rules for `Title Case`.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request or open an issue if you have any suggestions or find any bugs.

## License

This project is licensed under the GPL-3.0 License - see the [LICENSE](LICENSE) file for details.
