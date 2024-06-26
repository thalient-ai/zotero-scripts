# Zotero Batch Tag Manager

This script helps manage tags within your Zotero library by allowing you to perform bulk operations, such as adding, removing, or replacing tags across multiple items. This script is designed to handle large collections efficiently while providing detailed feedback and user confirmations.

## Features

- **Add Tags**: Add one or more tags to multiple selected items at once.
- **Remove Tags**: Remove specific tags from multiple selected items with a confirmation prompt before execution.
- **Replace Tags**: Replace one tag with another across multiple selected items, ensuring only items with the original tag are modified.
- **Detailed Logging**: Provides progress feedback and logs detailed actions taken for each item.
- **User Confirmation**: Prompts for confirmation before performing significant operations like removing or replacing tags.

## Installation

1. Clone the repository or (download)[https://github.com/thalient-ai/zotero-scripts/blob/main/zotero-batch-tag/src/zotero_batch_tag.js] the script

2. Open Zotero and navigate to `Tools -> Developer -> Run JavaScript`.

3. Copy and paste the contents of `zotero_batch_tag_manager.js` into the console and run the script.

## Usage

1. **Select Items**:
   - The script prompts you to choose items to process: selected items, items in the current collection, or items from a saved search.
   
![Screenshot](doc/tag_01.png)

2. **Choose Operation**:
   - Add a Tag: Prompts for the tag to be added and applies it to the selected items.
   - Remove a Tag: Prompts for the tag to be removed, confirms the action, and removes it from the selected items.
   - Replace a Tag: Prompts for the old tag and the new tag, confirms the action, and replaces the old tag with the new tag in the selected items.
   
![Screenshot](doc/tag_02.png)

![Screenshot](doc/tag_03.png)

![Screenshot](doc/tag_04.png)

![Screenshot](doc/tag_05.png)

3. **Confirmation and Progress**:
   - For remove and replace operations, the script provides a confirmation prompt with details on the number of items affected.
   - The script logs detailed progress and actions taken for each item.
   
![Screenshot](doc/tag_06.png)

## Example

1. **Adding a Tag**:
   - User selects items to tag.
   - Script prompts for the tag to add.
   - Script adds the specified tag to all selected items and logs the progress.

2. **Removing a Tag**:
   - User selects items from which they want to remove a tag.
   - Script prompts for the tag to remove.
   - Script confirms the action, removes the tag from all relevant items, and logs the progress.

3. **Replacing a Tag**:
   - User selects items in which they want to replace a tag.
   - Script prompts for the old tag and the new tag.
   - Script confirms the action, replaces the old tag with the new tag in all relevant items, and logs the progress.

## Compatibility
All scripts were written for Zotero 7

![Screenshot](doc/zotero_version.png)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request or open an issue if you have any suggestions or find any bugs.

## License

This project is licensed under the GPL-3.0 License - see the [LICENSE](LICENSE) file for details.