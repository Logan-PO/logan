const { execSync } = require('child_process');
const path = require('path');

const cwd = execSync('pwd').toString('utf8').trim();
if (path.basename(cwd) !== 'logan') throw new Error('Please run this script from the repo root');

const dependencies = JSON.parse(
    execSync(
        'node_modules/.bin/lerna la --scope packages/backend --include-dependencies --json --loglevel silent'
    ).toString()
);

for (const dependency of dependencies) {
    if (dependency.name === 'packages/backend') continue;
    const relative = path.relative(cwd, dependency.location);
    execSync(`rsync -avq ${relative} ${path.resolve('services/backend/node_modules', dependency.name, '..')}`);
}
