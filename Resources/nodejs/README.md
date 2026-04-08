# Resources/nodejs

Pre-downloaded Node.js testing dependencies for the MYTEAM pipeline.

## Contents

| Package | Version | Purpose |
|---------|---------|---------|
| [playwright](https://playwright.dev) | 1.59.1 | Browser automation for pipeline test scripts |

## Installation

Run the install script to copy these packages to `/tmp/node_modules` (the path expected by all pipeline test scripts):

```bash
bash Resources/nodejs/install.sh
```

Or manually:

```bash
cp -r Resources/nodejs/node_modules /tmp/node_modules
```

## Usage in Test Scripts

All pipeline test scripts import Playwright via:

```js
import { chromium } from '/tmp/node_modules/playwright/index.mjs';
```

## Updating Dependencies

To update or add packages:

```bash
cd Resources/nodejs
npm install <package>@<version>
```

Then commit the updated `node_modules`, `package.json`, and `package-lock.json`.
