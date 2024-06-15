## Zotero Bulk Edit Script

### Overview

This JavaScript script allows users to bulk edit records in Zotero by providing an easy-to-use prompt system to search and replace field values across multiple selected items. It supports a wide range of fields and ensures that the editing process is intuitive and user-friendly.

This project builds off of [Schoeneh's](https://github.com/Schoeneh) Zotero Search and Replace script.

### Features

- **Autocomplete Field Selection**: Start typing the name of the field you want to edit, and the script provides a list of matching fields for you to choose from.
- **Wildcard Search**: Use `*` as a wildcard to search for patterns within field values.
- **Case-Insensitive Matching**: The search functionality is case-insensitive, making it easier to find the records you want to edit.
- **Preview Changes**: Before applying changes, the script shows a preview of the old and new values for one of the matching records, allowing you to confirm the bulk edit.
- **Batch Processing**: Edits are applied to all selected items that match the search criteria.

### Usage

1. **Select Items in Zotero**: Begin by selecting the items you want to edit in Zotero.
2. **Run the Script**: Execute the script to start the bulk editing process.
3. **Field Selection**: When prompted, start typing the field name you want to edit. The script will show matching options for you to confirm.
4. **Search and Replace**: Enter the search term (use `*` as a wildcard) and the replacement value.
5. **Confirm Changes**: Review the preview of the changes and confirm to apply the edits.

## Back Uo Your Library
**Back up your local Zotero-library before using my script (or doing any batch-editing)!**
- [Guide by University of Ottawa Library](https://uottawa.libguides.com/how_to_use_zotero/back_up_and_restore)
- [Official Documentation](https://www.zotero.org/support/zotero_data)

### Example

If you want to replace the content of the `Abstract` field for selected items that contain the word "old" with "new":

1. **Field Selection**: Type "abstract" and select "Abstract" from the list.
2. **Search Term**: Enter "old".
3. **Replacement Value**: Enter "new".
4. **Confirm Changes**: Review the preview and confirm to apply the changes to all matching items.
