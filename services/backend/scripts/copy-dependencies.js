const { execSync } = require('child_process');
const path = require('path');

const dependencies = JSON.parse(execSync('lerna la --scope @logan/backend --include-dependencies --json').toString());

const cwd = execSync('pwd').toString('utf8').trim();

for (const dependency of dependencies) {
    if (dependency.name === '@logan/backend') continue;
    const relative = path.relative(cwd, dependency.location);
    execSync(`rsync -avq ${relative} ${path.resolve('services/backend/node_modules', dependency.name, '..')}`);
}
