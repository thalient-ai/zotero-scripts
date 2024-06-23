Based on the style of the provided README.md and the content of the `attachment_backup.js` script, here is a detailed README for `attachment_backup.js`:

---

# Attachment Backup Script

This script backs up attachments from selected Zotero items to a specified folder.

## Features

- **Scope Selection**: Prompts the user to select the scope of items to process (selected items, items in the current collection, or items in a saved search).
- **Backup Destination**: Allows the user to select a folder where the attachments will be copied.
- **Attachment Handling**: Handles multiple attachments per item and supports renaming to avoid duplicate filenames.
- **Detailed Logging**: Logs the time taken for each operation and provides detailed error handling and messages.

## Usage

1. **Download the Script**: Download `attachment_backup.js` from the repository.
2. **Open Zotero**: Launch the Zotero application.
3. **Run JavaScript**:
    - Go to `Tools > Developer > Run JavaScript`.
    - Copy and paste the content of `attachment_backup.js` into the Zotero JavaScript console.
    - Press `Run`.

### Example

To back up attachments from selected items:

1. Select the items in Zotero.
2. Run the script.
3. Choose the option to process selected items.
4. Select the destination folder for the backup.
5. Confirm the backup operation.

## Detailed Script Description

The script performs the following steps:

1. **Initialization**: Logs the start time and sets up the Zotero pane.
2. **Scope Selection**: Prompts the user to select the scope of items to process.
    - Options: Selected items, items in the current collection, or items in a saved search.
3. **Retrieve Items**: Retrieves items based on the user’s selection.
4. **Separate Items**: Separates parent items and orphan attachments.
5. **Destination Folder**: Prompts the user to select a backup folder.
6. **Confirmation**: Asks the user to confirm the backup operation.
7. **Backup Process**:
    - Counts total attachments.
    - Backs up attachments by copying files to the selected folder.
    - Handles file name conflicts by appending a counter to duplicate file names.
8. **Completion**: Logs completion time and alerts the user that the backup process is complete.

## Error Handling

- Provides detailed error messages and logs them to the console.
- Prompts the user if invalid options are selected.
- Ensures valid folder paths are selected and handles long path names.

## Functions Overview

- `getValidEditOption()`: Prompts the user to select the scope of items to process.
- `getItemsToEdit(editOption, zoteroPane)`: Retrieves items based on the user's selection.
- `getFolderPath()`: Prompts the user to select a folder for the backup.
- `countAttachments(parentItems, orphanAttachments)`: Counts the total number of attachments.
- `backupAttachments(parentItems, orphanAttachments, folderPath)`: Backs up the attachments to the specified folder.
- `processAttachments(attachmentIDs, folderPath)`: Processes and copies each attachment to the backup folder.
- `handleFileCopy(source, destination)`: Handles the file copy process, including managing duplicate filenames.
- `handleDuplicateFile(file)`: Handles duplicate filenames by appending a counter.
- `normalizePath(path)`: Normalizes the file path for consistency.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request or open an issue if you have any suggestions or find any bugs.

## License

This project is licensed under the GPL-3.0 License - see the [LICENSE](LICENSE) file for details.

---

Feel free to customize the content further based on your specific needs and preferences.