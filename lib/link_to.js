'use strict';

const chalk = require('chalk');
const error = chalk.red;
const logPrefix = '[link_to] ';

let itemsSlugs = {};
let itemsPaths = {};
let duplicatedSlugs = {};

const initSlugs = collection => {
  if (Object.keys(itemsSlugs).length === 0) {
    collection.forEach(item => {
      if (itemsSlugs[item.fileSlug] !== undefined) {
        // We already have this slug
        // No need to throw an error, there's no arm if this slug is never used in a link
        if (!duplicatedSlugs[item.fileSlug]) {
          // This is the second one, let's move both
          duplicatedSlugs[item.fileSlug] = [];
          duplicatedSlugs[item.fileSlug].push(
            itemsSlugs[item.fileSlug].filePathStem
          );
          itemsSlugs[item.fileSlug] = false;
        }
        duplicatedSlugs[item.fileSlug].push(item.filePathStem);
      } else {
        // This is a valid unique slug
        itemsSlugs[item.fileSlug] = item;
      }
      // Also keep track of the filePathStem and URL for fallback
      itemsPaths[item.filePathStem] = item;
      itemsPaths[item.url] = item;
    });
  }
};

const nunjucksTag = nunjucksEngine => {
  return new (function() {
    this.tags = ['link_to'];

    this.parse = function(parser, nodes, lexer) {
      var tok = parser.nextToken();
      var args = parser.parseSignature(null, true);
      parser.advanceAfterBlockEnd(tok.value);
      return new nodes.CallExtensionAsync(this, 'run', args);
    };

    this.run = function(context, slug, callback) {
      if (!slug) {
        throw new Error(
          error(`
${logPrefix}slug is either null or undefined
`)
        );
      }
      initSlugs(context.ctx.collections.all);

      if (duplicatedSlugs[slug]) {
        throw new Error(
          error(`
${logPrefix}Multiple contents have the same slug '${slug}':
- ${duplicatedSlugs[slug].join('\n- ')}
 -> you can use link_to with the filePathStem or URL
 `)
        );
      }
      let found = itemsSlugs[slug] || itemsPaths[slug];

      if (!found) {
        // If the exact slug is not found, try with partial string
        let partialSlugs = Object.keys(itemsSlugs).filter(
          itemSlug => itemsSlugs[itemSlug] && itemSlug.includes(slug)
        );
        if (partialSlugs.length === 1) {
          // Found the string as part of one single existing slug
          found = itemsSlugs[partialSlugs[0]];
        } else if (partialSlugs.length > 1) {
          // Found the string as part of multiple existing slugs
          throw new Error(
            error(`
${logPrefix}Found multiple slugs containing '${slug}', couldn't decide:
- ${partialSlugs.join('\n- ')}
`)
          );
        } else {
          // No slug containing this string, let's try with pathStems and URLs
          let partialPaths = Object.keys(itemsPaths).filter(itemPath =>
            itemPath.includes(slug)
          );
          if (partialPaths.length === 1) {
            // Found the string as part of one single existing path or URL
            // TODO: show a warning?
            found = itemsPaths[partialPaths[0]];
          } else if (partialPaths.length > 1) {
            // Found the string as part of multiple existing path or URL
            throw new Error(
              error(`
${logPrefix}Found multiple paths or URL containing '${slug}', couldn't decide:
- ${partialPaths.join('\n- ')}
`)
            );
          } else {
            throw new Error(
              error(`
${logPrefix}Couldn't find any content with slug '${slug}'
`)
            );
          }
        }
      }
      callback(
        null,
        new nunjucksEngine.runtime.SafeString(found ? found.url : slug)
      );
    };
  })();
};

module.exports = nunjucksTag;
