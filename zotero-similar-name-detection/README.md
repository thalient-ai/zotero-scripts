# Zotero Similar Name Detection and Update Script

This script detects similar author names in Zotero items and provides options to replace these names with a new name. This is useful for maintaining consistent metadata in your Zotero library.

## Features

- **Similarity Detection**: Identifies similar author names based on a customizable similarity threshold.
- **User Selection Options**: Allows users to choose whether to update selected items, items in the current collection, or items in a saved search.
- **Detailed Prompts**: Provides clear prompts for renaming similar author names, including explanations on handling abbreviations.
- **Logging**: Provides detailed logs of the process, including any errors encountered and a summary of updated author names.

## Example

If you have multiple items with author names such as "John Doe", "J. D. Doe" and "John D. Doe", the script can detect these as similar and update them to a consistent, user-specified format like "John Doe".

## Installation

1. Download the `similar_name_detection.js` script.
2. Open Zotero.
3. Navigate to `Tools` > `Developer` > `Run JavaScript`.
4. Copy and paste the script into the Zotero JavaScript Runner.
5. Click `Run`.

## Usage

1. **Run the Script**: Follow the installation instructions to run the script.
2. **Select Items**: A prompt will ask you to select items for which you want to detect and update similar author names:
   - Enter `1` to edit selected items.
   - Enter `2` to edit items in the current collection.
   - Enter `3` to edit items in a saved search.
3. **Handle Detected Similar Names**: The script will present options for handling detected similar names:
   - Enter `1` to replace names with a new name.
   - Enter `2` to ignore all similar names.
   - Enter `3` to show all similar names.
   - Enter `4` to adjust the similarity threshold.
4. **Rename Authors**: If renaming, enter the new name with the first name and last name separated by a space (e.g., "John Doe"). The script supports initials, they will be included in the first name field.
5. **Completion**: A message will alert you when the update is complete, providing a summary of the updates made.