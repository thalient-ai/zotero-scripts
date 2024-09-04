/**
 * This script changes the view to "Zoom by Page Height"
 * @thalient-ai
 * @link https://github.com/windingwind/zotero-actions-tags/discussions/378
 * @see https://github.com/thalient-ai/zotero-scripts/blob/main/zotero_default_zoom/src/actionandtag_default_zoom
 */

// This script sets the zoom of PDF reader tabs or windows to "Zoom by Page Height"

(function () {
  const Zotero = require("Zotero");
  const Zotero_Tabs = require("Zotero_Tabs");

  async function adjustPDFZoom() {
    try {
      Zotero.log("Script execution started.");

      // Increased initial delay to ensure the PDF reader and Zotero objects are fully initialized
      await Zotero.Promise.delay(750); // Adjust delay as needed for your environment

      let reader = null;

      // Check if the PDF is opened in a tab
      if (Zotero_Tabs.selectedID) {
        Zotero.log("PDF opened in a tab.");
        reader = Zotero.Reader.getByTabID(Zotero_Tabs.selectedID);
        if (reader) {
          Zotero.log("Reader found in tab with tabID: " + Zotero_Tabs.selectedID);
        }
      }

      // If not found in a tab, check if the PDF is opened in a window
      if (!reader) {
        Zotero.log("Checking for reader in a window...");

        // Get all window readers from _readers
        let windowReaders = Zotero.Reader._readers.filter(
          (r) => r._internalReader && r._internalReader._primaryView
        );

        if (windowReaders.length > 0) {
          Zotero.log("Found window reader states. Total readers: " + windowReaders.length);

          // Select the last reader in the list (most recently opened)
          reader = windowReaders[windowReaders.length - 1];
          Zotero.log("Targeting the most recently opened reader window.");

          if (!reader) {
            Zotero.logError("Most recent reader object not found.");
            return;
          }
        } else {
          Zotero.logError("No window reader states found.");
          return;
        }
      }

      // Apply zoom setting if reader is found
      if (reader) {
        if (!reader._internalReader || !reader._internalReader._primaryView) {
          Zotero.logError("Internal reader not initialized.");
          return;
        }

        let pdfViewer =
          reader._internalReader._primaryView._iframeWindow.PDFViewerApplication
            .pdfViewer;
        if (pdfViewer) {
          pdfViewer.currentScaleValue = "page-height";
          // options include "page-height", "page-width", "page-fit", and "auto"
          Zotero.log("Zoom set successfully.");
        } else {
          Zotero.logError("PDF viewer not found.");
        }
      } else {
        Zotero.logError("Reader not found or not accessible.");
      }
    } catch (error) {
      Zotero.logError(`Failed to set zoom mode: ${error.message}`);
    }
  }

  // Execute the zoom adjustment function
  adjustPDFZoom();
})();
