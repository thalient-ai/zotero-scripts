# Zotero Scripts

This repository contains an assortment of javascripts for Zotero 7. These scripts are designed to help with various bulk / batch operations within Zotero, such as editing metadata, renaming attachments, and detecting similar items.

## Table of Contents

- [Installation](#installation)
- [Scripts](#scripts)
  - [zotero-bulk-edit](#zotero-bulk-edit)
  - [zotero-attachment-rename](#zotero-attachment-rename)
  - [zotero-duplicate-enhanced](#zotero-duplicate-enhanced)
  - [zotero-batch-tag-manager](#zotero-batch-tag-manager)
- [Usage](#usage)
- [Contributing](#contributing)
- [Acknowledgements](#acknowledgements)

## Installation

1. Download the desired script(s) from this repository.
2. Open Zotero.
3. Go to `Tools > Developer > Run JavaScript`.
4. Copy and paste the script content into the Zotero JavaScript console.
5. Press `Run`.

## Scripts

### [zotero-bulk-edit](https://github.com/thalient-ai/zotero-scripts/tree/main/zotero-bulk-edit)

This script allows you to perform bulk edits on various fields of your Zotero items. Bulk editing means you can apply changes to multiple items at once, rather than editing each item individually. This can save time and ensure consistency across your library.

**Features:**
- Search and replace text within fields.
- Support regular expression and wild cards
- Edit the fields of multiple items at once.
- Supports a wide range of fields including titles, abstracts, creator names, and notes.

**Usage:**
1. Choose the field you want to edit.
2. Enter the search term and replacement term.
3. Select the items to edit (selected items, items in a collection, or items in a saved search).

### [zotero-attachment-rename](https://github.com/thalient-ai/zotero-scripts/tree/main/zotero-attachment-rename)

This script allows for you to perform bulk renaming of multiple attachment filenames and or titles based on their parent item’s metadata. 

**Features:**
- Rename attachment filenames and/or titles.
- Option to perform the renaming on all attachments of selected items, active collection, or saved search.
- You don't need to select the attachment itself.

**Usage:**
1. Choose the items to rename (selected items, items in a collection, or items in a saved search).
2. Choose whether to rename filenames, titles, or both.

### [zotero-duplicate-enhanced](https://github.com/thalient-ai/zotero-scripts/tree/main/zotero-duplicate-enhanced)

This script helps in detecting and handling potential duplicate items based on a similarity threshold. This approach will identify duplicates that the built-in logic does not detect.

**Features:**
- Set a similarity threshold for detecting duplicates.
- Compare various fields such as titles, authors, dates, and publishers.
- Tag or move duplicates to the trash.

**Usage:**
1. Set the similarity threshold.
2. Choose the items to compare (selected items, items in a collection, or items in a saved search).
3. Review and handle the detected duplicates.

### [zotero-batch-tag](https://github.com/thalient-ai/zotero-scripts/tree/main/zotero-batch-tag)

This script helps manage tags within your Zotero library by allowing you to perform bulk operations, such as adding, removing, or replacing tags across multiple items. This script is designed to handle large collections efficiently while providing detailed feedback and user confirmations.

**Features:**
- Add one or more tags to multiple selected items at once.
- Remove specific tags from multiple selected items with a confirmation prompt before execution.
- Replace one tag with another across multiple selected items, ensuring only items with the original tag are modified.
- Detailed Logging: Provides progress feedback and logs detailed actions taken for each item.
- User Confirmation: Prompts for confirmation before performing significant operations like removing or replacing tags.

**Usage:**
1. The script prompts you to choose items to process: selected items, items in the current collection, or items from a saved search.
2. Add, Remove, or Replace a Tag
3. Autosuggests tags to choose from for remove or replace operations

## Usage

Refer to each script's README for detailed usage instructions.

## Contributing

Contributions are welcome! Please read the [contributing guidelines](./CONTRIBUTING.md) for more information.

## Acknowledgements

Special thanks to the Zotero community for their support and contributions.