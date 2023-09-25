# SparkVidz

**SparkVidz**: Instant AI-Powered Summaries for Time-Saving Playback!

## Important: How to Set Up and Run the Extension
This section guides you through setting up and running the SparkVidz Chrome extension. For a comprehensive walkthrough, refer to [this article](https://medium.com/pythoniq/write-chrome-extensions-in-python-6c6b0e2e1573).


### Load Your Extension into Chrome
1. Enter `chrome://extensions` in the Chrome address bar.
2. Toggle the "Developer Mode" switch to ON (located at the top right of the page).
3. Click "Load unpacked" and select your extension folder.
4. You'll now see your extension listed.
5. Click on the Extensions (“jigsaw”) icon in the top right of the browser and pin your Extension to the Extensions Launcher.
6. To execute Python in the browser, simply click on your Extension icon!

   
Happy Coding!

## References

- [Write Chrome Extensions in Python](https://medium.com/pythoniq/write-chrome-extensions-in-python-6c6b0e2e1573) - Medium article by [Author's Name].

### Create Your Extension Files
1. Create a new folder for your Extension.
2. Download or clone the [pyscript-local-runtime](https://github.com/PFython/pyscript-local-runtime) repository into your new folder.
3. Add your Python code between the `<py-script>` tags and/or `<py-repl>` in `popup.html`.
4. Modify the `<title>` in `popup.html` and adjust the name and/or description in `manifest.json` as needed.
5. If desired, add custom icons to the `/icons` directory and modify the default icon names in `manifest.json`.

> **Note**: The `pyscript-local-runtime` repository uses PyScript v0.21.3. If you wish to utilize a newer version, you can modify the helper scripts `runtime/setup.sh` (for Linux/Posix) or `runtime/setup.py` (for Windows). With PyScript and Pyodide continually evolving, consider checking out recent tutorials to keep updated with their capabilities and syntax/structure.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Development Information](#development-information)
  - [Dependencies](#dependencies)
- [Contributing](#contributing)
- [License](#license)
- [Credits](#credits)
- [Contact](#contact)

## Overview

SparkVidz transforms long-form videos into structured chapter summaries. Leveraging AI, it intelligently categorizes video content into distinct subtopics, complete with timestamps. This enables users to navigate swiftly to the pivotal moments or topics of interest, ensuring they extract the most value in the least time.

## Features
- **AI-Powered Summarization**: [Details or further elaboration on this feature]
- **Structured Chapter Breakdown**: [Details or further elaboration on this feature]
- [Other feature]: [Details or further elaboration]

## Installation
Instructions on how to install the SparkVidz extension or software.

1. [Step 1]
2. [Step 2]
3. ...

## Usage
Guidance on how to use the SparkVidz tool once installed.

1. [Usage Step 1]
2. [Usage Step 2]
3. ...

## Development Information

### Dependencies
- Pyscript for Python in Chrome extension
- [Other Dependency]

## Contributing
Details on how others can contribute to the SparkVidz project. Typically, you'd explain steps to fork the repo, make changes, and submit a pull request.

## License
Information about the licensing of the project. If you're using a standard license, like the MIT License, you'd mention it here.

## Credits
Acknowledgments for authors, contributors, and any third-party resources used in the project.

## Contact
Information on how to contact the maintainers or contributors of the SparkVidz project.

