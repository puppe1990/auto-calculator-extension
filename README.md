# Auto Calculator Chrome Extension

A simple and lightweight Chrome extension that provides instant mathematical calculations right in your browser.

## Features

- **Instant Calculation**: Enter mathematical expressions and get results immediately
- **Real-time Updates**: Results update as you type
- **Simple Interface**: Clean, minimal popup interface
- **No Permissions Required**: Works without accessing any personal data
- **Lightweight**: Fast and efficient performance

## Installation

### Manual Installation (Developer Mode)

1. **Download the Extension**
   - Clone or download this repository to your local machine

2. **Open Chrome Extensions Page**
   - Open Google Chrome
   - Navigate to `chrome://extensions/`
   - Or go to Menu → More Tools → Extensions

3. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top-right corner

4. **Load the Extension**
   - Click "Load unpacked"
   - Select the folder containing the extension files
   - The extension should now appear in your extensions list

5. **Access the Calculator**
   - Click the extension icon in your Chrome toolbar
   - The calculator popup will open

## Usage

1. **Open the Extension**
   - Click the Auto Calculator icon in your Chrome toolbar

2. **Enter Calculations**
   - Type mathematical expressions in the input field
   - Examples:
     - `2 + 2`
     - `10 * 5`
     - `(3 + 4) * 2`
     - `Math.sqrt(16)`
     - `Math.PI * 2`

3. **View Results**
   - Results appear instantly below the input field
   - Invalid expressions will show "Invalid expression"

## Supported Operations

- **Basic Arithmetic**: Addition (+), Subtraction (-), Multiplication (*), Division (/)
- **Mathematical Functions**: Math.sqrt(), Math.pow(), Math.sin(), Math.cos(), etc.
- **Constants**: Math.PI, Math.E
- **Parentheses**: For grouping operations
- **Decimal Numbers**: Full decimal support

## Files Structure

```
auto-calculator-extension/
├── manifest.json      # Extension configuration
├── popup.html        # Main popup interface
├── popup.js          # JavaScript functionality
├── style.css         # Styling for the popup
└── icon.svg          # Extension icon
```

## Technical Details

- **Manifest Version**: 3 (Latest Chrome extension standard)
- **Permissions**: None required
- **Popup Interface**: Simple HTML/CSS/JavaScript
- **Calculation Engine**: Uses JavaScript's built-in `eval()` function

## Development

### Prerequisites
- Google Chrome browser
- Basic knowledge of HTML, CSS, and JavaScript

### Making Changes
1. Edit the files as needed
2. Go to `chrome://extensions/`
3. Click the refresh icon on the Auto Calculator extension
4. Test your changes

### Customization
- **Styling**: Modify `style.css` to change appearance
- **Functionality**: Edit `popup.js` to add new features
- **Interface**: Update `popup.html` to change the layout

## Security Note

This extension uses JavaScript's `eval()` function to calculate expressions. While this is fine for mathematical calculations, be aware that `eval()` can execute arbitrary code. This extension is designed for simple mathematical operations only.

## Browser Compatibility

- Google Chrome (recommended)
- Other Chromium-based browsers (Edge, Brave, etc.)

## Version History

- **v1.0**: Initial release with basic calculation functionality

## Contributing

Feel free to submit issues, feature requests, or pull requests to improve this extension.

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you encounter any issues or have questions, please open an issue in the repository.

---

**Note**: This extension is designed for educational and personal use. For production environments, consider implementing additional security measures. 