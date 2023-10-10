# Tahajji
Chrome Extension to override fonts for Urdu Language

![imagename](https://github.com/simptive/tahajji/blob/master/images/small_promo.png)

[Chrome Web Store Link](https://chrome.google.com/webstore/detail/tahajji-urdu-reader/bknnphpbomfgdlmpgmnjhmbakpohppee)

## Description:

Urdu Reader is an open-source browser extension designed to enhance the reading experience of Urdu content on the web. This GitHub project addresses common issues faced by users who are dissatisfied with default Urdu fonts provided by websites or experience compatibility problems with existing extensions on social media pages. Additionally, it caters to Linux users who may find Urdu fonts in the browser challenging to read.

## Key Features:

1. **Independent of the HTML tags:** Efficiently detects Urdu characters wihtout relying on DOM meta data like DIR="rtl". It can even convert Urdu text mixed with other languages.

2. **Handles dynamically loaded content:** It activates after the page is initially completes loading but after that, handles dynamically loaded (AJAX) content without refreshing the page.

3. **Font Customization:** Urdu Reader provides a variety of fonts to choose from, allowing users to select the one that suits their preferences and readability.

4. **Font Size Adjustment:** Users can easily adjust the font size to ensure comfortable reading, catering to their visual needs.

5. **Line Height Control:** The extension also allows users to control the line height, further improving the legibility of Urdu text on webpages.

6. **Saves your settings:** Font selection, size and line-height settings don't need to re-configure everytime.

## Limitations:

* When the Font is applied to an HTML tag that contains other language e.g. English characters, its font is also changed (but still readable in the same language).
* Only global settings, it can't save different setting for each website.

## Setting up the project:
Clone the repostitory and open as a project in your favorite editor. Open Chrome, go to Options > Extensions > Manage Extensions > Load Unpacked and select working directory.

## Contributions:

This open-source project encourages contributions from the developer community to improve and expand its features. Developers can participate by submitting code enhancements, bug fixes, or new font additions to enhance the overall Urdu reading experience for users. Feel free to contribute to the project on GitHub to make Urdu content more accessible and enjoyable for everyone.

Checkout [Issues](https://github.com/simptive/tahajji/issues) for priority tasks.

