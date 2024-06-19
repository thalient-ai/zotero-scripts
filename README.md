# Zotero Scripts

This repository contains an assortment of JavaScript scripts for enhancing your Zotero 7 experience. These scripts are designed to help with various bulk operations within Zotero, such as editing metadata, renaming attachments, and detecting similar items.

## Table of Contents

- [Installation](#installation)
- [Scripts](#scripts)
  - [zotero-bulk-edit](#zotero-bulk-edit)
  - [zotero-attachment-rename](#zotero-attachment-rename)
  - [zotero-duplicate-similar](#zotero-duplicate-similar)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Installation

1. Download the desired script(s) from this repository.
2. Open Zotero.
3. Go to `Tools > Developer > Run JavaScript`.
4. Copy and paste the script content into the Zotero JavaScript console.
5. Press `Run`.

## Scripts

### zotero-bulk-edit

This script allows you to perform bulk edits on various fields of your Zotero items.

**Features:**
- Edit multiple fields at once.
- Search and replace text within fields.
- Supports a wide range of fields including titles, abstracts, and notes.

**Usage:**
1. Choose the field you want to edit.
2. Enter the search term and replacement term.
3. Select the items to edit (selected items, items in a collection, or items in a saved search).

[Read more about zotero-bulk-edit](./scripts/zotero-bulk-edit/README.md)

### zotero-attachment-rename

This script renames attachment files and titles based on their parent item’s metadata.

**Features:**
- Rename attachment filenames.
- Rename attachment titles.
- Option to rename both filenames and titles.

**Usage:**
1. Choose the items to rename (selected items, items in a collection, or items in a saved search).
2. Choose whether to rename filenames, titles, or both.

[Read more about zotero-attachment-rename](./scripts/zotero-attachment-rename/README.md)

### zotero-duplicate-similar

This script helps in detecting and handling potential duplicate items based on a similarity threshold.

**Features:**
- Set a similarity threshold for detecting duplicates.
- Compare various fields such as titles, authors, dates, and publishers.
- Tag or move duplicates to the trash.

**Usage:**
1. Set the similarity threshold.
2. Choose the items to compare (selected items, items in a collection, or items in a saved search).
3. Review and handle the detected duplicates.

[Read more about zotero-duplicate-similar](./scripts/zotero-duplicate-similar/README.md)

## Usage

1. Follow the [Installation](#installation) instructions.
2. Refer to each script's README for detailed usage instructions.

## Contributing

Contributions are welcome! Please read the [contributing guidelines](./CONTRIBUTING.md) for more information.

## License

This repository is licensed under the MIT License. See the [LICENSE](./LICENSE) file for more information.
