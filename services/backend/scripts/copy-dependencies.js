const { execSync } = require('child_process');
const path = require('path');

const cwd = execSync('pwd').toString('utf8').trim();

if (path.basename(cwd) !== 'logan') throw new Error('Please run this script from the repo root');

const nodeScriptOutput = execSync('cd services/backend && npm run list-dependencies').toString();
const dependenciesString = nodeScriptOutput.match(/\[.+/ms);

if (!dependenciesString[0]) throw new Error('Could not find dependencies');

const dependencies = JSON.parse(dependenciesString[0]);

for (const dependency of dependencies) {
    if (dependency.name === '@logan/backend') continue;
    const relative = path.relative(cwd, dependency.location);
    execSync(`rsync -avq ${relative} ${path.resolve('services/backend/node_modules', dependency.name, '..')}`);
}
