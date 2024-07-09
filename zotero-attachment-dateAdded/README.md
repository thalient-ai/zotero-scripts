# Update Parent Item "Date Added" Script for Zotero

This script updates the "Date Added" field of parent items in Zotero to match the earliest "Date Added" date of their attachments. This can be useful for maintaining accurate metadata in your Zotero library.

## Features

- **Automatic Date Update**: Adjusts the "Date Added" field of parent items to reflect the earliest date among their attachments.
- **User Selection Options**: Allows users to choose whether to update selected items, items in the current collection, or items in a saved search.
- **Logging**: Provides detailed logs of the process, including any errors encountered.

## Example

If you have a parent item added on `2024-01-01` with three attachments added on `2024-01-02`, `2024-01-03`, and `2023-12-31`, the script will update the parent item's "Date Added" field to `2023-12-31`. This is useful for those who add files to Zotero and then at a later date create a parent item. This will ensure that the parent item uses the same "Date Added" value as the file attachment.

## Installation

1. Download the `attachment_dateAdded.js` script.
2. Open Zotero.
3. Navigate to `Tools` > `Developer` > `Run JavaScript`.
4. Copy and paste the script into the Zotero JavaScript Runner.
5. Click `Run`.

## Usage

1. **Run the Script**: Follow the installation instructions to run the script.
2. **Select Items**: A prompt will ask you to select items for which you want to update the "Date Added" field:
   - Enter `1` to edit selected items.
   - Enter `2` to edit items in the current collection.
   - Enter `3` to edit items in a saved search.
3. **Confirmation**: The script will process the items and update the "Date Added" field as necessary.
4. **Completion**: A message will alert you when the update is complete.

## Logging

The script logs various details during its execution, including:
- The number of items processed.
- The original and updated "Date Added" values for parent items.
- Any errors encountered during the process.

## Error Handling

If an error occurs during execution, an alert will display the error message. The script will log the error details in the console for further troubleshooting.

## Performance

The script tracks and logs the total time taken for execution, providing insights into performance.

## Contribution

Feel free to fork this repository and submit pull requests. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License - see the LICENSE file for details.