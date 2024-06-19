# Zotero Scripts

This repository contains an assortment of javascripts for Zotero 7. These scripts are designed to help with various bulk/batch operations within Zotero, such as editing metadata, renaming attachments, and detecting duplicate items.

## Table of Contents

- [Installation](#installation)
- [Scripts](#scripts)
  - [zotero-bulk-edit](#zotero-bulk-edit)
  - [zotero-attachment-rename](#zotero-attachment-rename)
  - [zotero-duplicate-enhanced](#zotero-duplicate-enhanced)
- [Usage](#usage)
- [Contributing](#contributing)

## Installation

1. Download the desired script(s) from this repository.
2. Open Zotero.
3. Go to `Tools > Developer > Run JavaScript`.
4. Copy and paste the script content into the Zotero JavaScript console.
5. Press `Run`.

## Scripts

### zotero-bulk-edit

This script allows you to perform bulk edits on various fields of your Zotero items. Bulk editing means you can apply changes to multiple items at once, rather than editing each item individually. This can save time and ensure consistency across your library.

**Key Problem Solved**: Manually editing multiple items in Zotero can be time-consuming and prone to inconsistencies. This script automates the process, ensuring accuracy and saving time.

**Features:**
- Edit multiple fields at once.
- Search and replace text within fields.
- Supports a wide range of fields including titles, abstracts, and notes.

**Usage:**
1. Choose the field you want to edit.
2. Enter the search term and replacement term.
3. Select the items to edit (selected items, items in a collection, or items in a saved search).

[Read more about zotero-bulk-edit](https://github.com/thalient-ai/zotero-scripts/tree/main/zotero-bulk-edit)

### zotero-attachment-rename

This script renames attachment filenames and titles based on their parent item’s metadata. It can be performed on selected items, all items within a collection, or all items within a saved search.

**Key Problem Solved**: Zotero does not automatically rename attachment filenames and titles to match parent item metadata, leading to disorganized and hard-to-find attachments. This script ensures consistency and easier management of attachments.

**Features:**
- Rename attachment filenames.
- Rename attachment titles.
- Option to rename both filenames and titles.

**Usage:**
1. Choose the items to rename (selected items, items in a collection, or items in a saved search).
2. Choose whether to rename filenames, titles, or both.

[Read more about zotero-attachment-rename](https://github.com/thalient-ai/zotero-scripts/tree/main/zotero-attachment-rename)

### zotero-duplicate-enhanced

This script helps in detecting and handling potential duplicate items based on a similarity threshold.

**Key Problem Solved**: Zotero’s default duplicate detection may miss duplicates due to strict matching criteria. This script enhances detection by comparing multiple fields with customizable weights.

**Features:**
- Set a similarity threshold for detecting duplicates.
- Compare various fields such as titles, authors, dates, and publishers.
- Tag or move duplicates to the trash.

**Usage:**
1. Set the similarity threshold.
2. Choose the items to compare (selected items, items in a collection, or items in a saved search).
3. Review and handle the detected duplicates.

[Read more about zotero-duplicate-enhanced](https://github.com/thalient-ai/zotero-scripts/tree/main/zotero-duplicate-enhanced)

## Usage

1. Follow the [Installation](#installation) instructions.
2. Refer to each script's README for detailed usage instructions.

## Contributing

Contributions are welcome! Please read the [contributing guidelines](./CONTRIBUTING.md) for more information.
