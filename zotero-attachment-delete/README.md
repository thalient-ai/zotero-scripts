# Delete Attachment Files Script for Zotero

This script deletes local attachment files for selected items in Zotero. It provides options to delete attachments from selected items, items in the current collection, items in a saved search, or all items in the library.

## Example

This script is primarily for those have limited storage on their device. It is for those who use Zotero Sync which backups their Zotero library and attachments to a server. The script will remove local attachments (i.e., files) without affecting the Zotero library.

The script will delete only the local attachment files and skip the linked attachments, providing a detailed summary at the end.

## Features

- **Flexible Deletion Scope**: Allows users to choose the scope of items for which attachments will be deleted.
- **Attachment Handling**: Differentiates between local files and linked attachments, ensuring linked attachments are not deleted.
- **User Confirmation**: Prompts the user for confirmation before proceeding with the deletion.
- **Detailed Summary**: Provides a summary of the deletion process, including counts of items processed, attachments deleted, and linked attachments skipped.

## Installation

1. Download the `attachment_delete.js` script.
2. Open Zotero.
3. Navigate to `Tools` > `Developer` > `Run JavaScript`.
4. Copy and paste the script into the Zotero JavaScript Runner.
5. Click `Run`.

## Usage

1. **Run the Script**: Follow the installation instructions to run the script.
2. **Select Deletion Scope**: A prompt will ask you to select the scope for deleting attachments:
   - Enter `1` to delete attachments for selected items.
   - Enter `2` to delete attachments for all items in the current collection.
   - Enter `3` to delete attachments for all items in a saved search.
   - Enter `4` to delete attachments for all items in the library.
3. **Confirmation**: The script will display a summary of the items and attachments to be deleted and ask for confirmation.
4. **Deletion Process**: The script will proceed to delete the attachment files and provide a detailed summary of the process.

## Logging

The script logs various details during its execution, including:
- The number of items processed.
- The number of attachments processed and deleted.
- Any linked attachments skipped.
- Any errors encountered during the process.

## Error Handling

If an error occurs during execution, an alert will display the error message. The script will log the error details in the console for further troubleshooting.

## Performance

The script tracks and logs the total time taken for execution, providing insights into performance.

## Contribution

Feel free to fork this repository and submit pull requests. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License - see the LICENSE file for details.