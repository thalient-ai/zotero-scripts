# Zotero Scripts

This repository contains a collection of custom scripts designed to enhance the functionality of [Zotero](https://www.zotero.org/), a free, easy-to-use tool to help you collect, organize, cite, and share your research sources. All of the scripts are support bulk or batch editing of multiple Zotero items. All of the scripts have detailed logging, are optimized for performance, and include input validation and error handling.

## Scripts Included

| Script | Description | Script README | Script Link |
| --- | --- | --- | --- |
| **Attachment Backup (`attachment_backup.js`)** | Backs up attachments from selected Zotero items to a specified folder. | [README](link-to-attachment-backup-readme) | [Script](link-to-attachment-backup-script) |
| **Duplicate Enhanced (`duplicate_enhanced.js`)** | Detects and handles duplicate items in your Zotero library based on customizable similarity thresholds and weights. | [README](link-to-duplicate-enhanced-readme) | [Script](link-to-duplicate-enhanced-script) |
| **Batch Tagging (`zotero_batch_tag.js`)** | Allows batch tagging operations on selected Zotero items. | [README](link-to-batch-tagging-readme) | [Script](link-to-batch-tagging-script) |
| **Text Case Conversion (`zotero-text-case.js`)** | Converts the case of titles for selected Zotero items. | [README](link-to-text-case-conversion-readme) | [Script](link-to-text-case-conversion-script) |
| **Attachment Rename (`zotero_attachment_rename.js`)** | Renames attachment filenames and/or titles based on the parent item's metadata. | [README](link-to-attachment-rename-readme) | [Script](link-to-attachment-rename-script) |
| **Bulk Edit (`zotero_bulk_edit.js`)** | Facilitates bulk editing of Zotero item fields. | [README](link-to-bulk-edit-readme) | [Script](link-to-bulk-edit-script) |

## Usage

1. Download the desired script(s) from this repository.
2. Open Zotero.
3. Go to `Tools > Developer > Run JavaScript`.
4. Copy and paste the script content into the Zotero JavaScript console.
5. Press `Run`.

### Short Descriptions

#### Attachment Backup (`attachment_backup.js`)
- Have you ever wanted to backup or download multiple attachments from Zotero? Only to realize that Zotero stores attachments in individual folders meaning that you'll have to go to each folder to copy the .pdf or other attachment.
- This script solves that problem by allowing you to select multiple items within Zotero, run the script, and create a copy of the attachment file(s) to a folder of your choosing.

#### Duplicate Enhanced (`duplicate_enhanced.js`)
- Have you found the [built-in duplicate detection](https://www.zotero.org/support/duplicate_detection) Zotero a bit too limited? Items that are duplicates but have slight differences in metadata fields, are not detected as duplicates.
- This script detects duplicates using a similarity calculation of key metadata fields. The user can modify the script to set weights as well as set the similarity threshold through prompts. When a duplicate is detected, the script presents the items and their metadata to the user along with the calculated similarity. The user can then add a unique tag to both, move a duplicate to the trash, or ignore the duplicates.

#### Batch Tagging (`zotero_batch_tag.js`)
- Tags are a very useful feature of Zotero and managing them can become very complicated.
- This script allows users to add, remove, or replace tags on multiple items, with options to select items from the current collection, saved searches, or selected items.

#### Text Case Conversion (`zotero-text-case.js`)
- Zotero has a built-in feature to change an item's title to `Title Case` or `Sentence Case`. However, these options do not handle edge cases well such as abbreviations and acronyms. Additionally, there is no option for `Upper Case` or `Lower Case`.
- This script converts the titles of multiple items to `Title Case`, `Sentence Case`, `Upper Case`, or `Lower Case`, using a custom capitalization dictionary for specific terms and acronyms. The user can add and remove terms from the custom dictionary in the script. The script conforms to the APA rules for `Title Case`. 

#### Attachment Rename (`zotero_attachment_rename.js`)
- Zotero has a built-in option to rename item attachments (e.g., the actual .pdf file) based on a style defined in the Zotero settings and the parent item's metadata. However, this option can only be executed when the attachments are selected. 
- This script makes it easy to rename the attachment filenames and/or titles of multiple items based on their parent item's metadata, with options to choose the scope of items and handle multiple attachments for a single item. Additionally, the script doesn't require that the attachments themselves be selected.

#### Bulk Edit (`zotero_bulk_edit.js`)
- In Zotero, there is no option to edit the fields or metadata of multiple items simultaneously. If you have a large library, you have to edit each item one by one.
- This script allows you to bulk or batch edit the fields, notes, and authors for multiple items. The script allows users to choose the scope of items to edit (i.e., selected items, items in a collection, or items in a saved search). The script offers suggestions and autocomplete when choosing the field to edit. It also supports regular expressions for search and replace. 

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request or open an issue if you have any suggestions or find any bugs.

## License

This project is licensed under the GPL-3.0 License - see the [LICENSE](LICENSE) file for details.

Here is the updated README with short descriptions for each of the scripts: