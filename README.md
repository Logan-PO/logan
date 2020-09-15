# Logan

A personal organizer designed for college students.

## Setup

Install lerna globally: `npm i -g lerna`

## Development Instructions

### Node Modules

Clean node modules: `npm run clean-all`

Reinstall node modules: `npm run bootstrap`

Bootstrap for production: `npm run bootstrap:production`

### Package Installation/Uninstallation

Install a package _globally:_ `npm i <pkg> --save` or `npm i <pkg> --save-dev`

Install a package in a specific module: `lerna add --scope=<internal pkg> <package> [--dev] --no-bootstrap`

To uninstall a package, delete it from the module's `package.json` then clean and rebootstrap.