#!/usr/bin/env node
const drc = require('docker-registry-client');
const { DockerfileParser } = require('dockerfile-ast');
const { readFileSync, statSync } = require('fs');
const glob = require('glob');
const semver = require('semver');
const { hideBin } = require('yargs/helpers');
const yargs = require('yargs/yargs');

const listTags = name => new Promise((resolve, reject) => {
  const client = drc.createClientV2({ name });
  client.listTags(function (err, tags) {
    client.close();
    if (err) {
      reject(err);
      return;
    }
    resolve(tags);
  });
});

const { argv } = yargs(hideBin(process.argv))
  .option('sed', {
    type: 'boolean',
  });

const filePaths = argv._.length > 0 ? glob.sync(argv._[0]) : ['Dockerfile'];
const { sed } = argv;
const names = new Set();
const tagsByName = new Map();

(async () => {
  for (filePath of filePaths) {
    if (!statSync(filePath).isFile()) {
      continue;
    }
    const content = readFileSync(filePath, { encoding: 'utf8' });
    const dockerfile = DockerfileParser.parse(content);
    const FROMs = dockerfile.getFROMs();
    const stages = FROMs.map(FROM => FROM.getBuildStage()).filter(stage => stage != null);
    for (const FROM of FROMs) {
      const name = FROM.getImageName();
      if (FROM.getRegistry() != null || name === 'scratch' || names.has(name) || stages.includes(name)) {
        continue;
      }
      names.add(name);
      tagsByName.set(name, (await listTags(name)).tags);
    }

    for (const FROM of FROMs) {
      if (FROM.getRegistry() != null) {
        continue;
      }
      const name = FROM.getImageName();
      if (!name || name === 'scratch' || stages.includes(name)) {
        continue;
      }
      const originalTag = FROM.getImageTag();
      if (!originalTag) {
        continue;
      }
      const coercedOriginalTag = semver.coerce(originalTag);
      if (!coercedOriginalTag) {
        continue;
      }
      const originalTagSuffix = originalTag.startsWith(coercedOriginalTag.version) ? originalTag.slice(coercedOriginalTag.version.length) : null;
      if (originalTagSuffix == null) {
        continue;
      }
      const tags = tagsByName.get(name);
      const coercedTags = tags.map(tag => semver.coerce(tag));
      const foundVersion = semver.maxSatisfying(coercedTags.filter((t, i) => t && tags[i] === `${t.raw}${originalTagSuffix}`).map(t => t.version), `^${coercedOriginalTag.version}`);
      const foundTag = tags.find(t => t === `${foundVersion}${originalTagSuffix}`);
      if (foundTag === originalTag) {
        continue;
      }
      const imageRange = FROM.getImageRange();
      if (sed) {
        console.log(`sed -i '${imageRange.start.line + 1}s#${name}:${originalTag}#${name}:${foundTag}#' ${filePath}`);
      } else {
        console.log(`${filePath}:${imageRange.start.line + 1},${imageRange.start.character + 1} ${name}:${foundTag}`);
      }
    }
  }
})()
