'use strict';

const chalk = require('chalk');
const error = chalk.red;
const logPrefix = '[link_to] ';

let itemsSlugs = {};
let itemsPaths = {};
let duplicatedSlugs = {};

const initSlugs = (collection) => {
  if (Object.keys(itemsSlugs).length === 0) {
    collection.forEach((item) => {
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

module.exports = {
  link_to: (nunjucksEngine) => {
    return new (function () {
      this.tags = ['link_to'];

      this.parse = function (parser, nodes, lexer) {
        var tok = parser.nextToken();
        var args = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(tok.value);
        return new nodes.CallExtensionAsync(this, 'run', args);
      };

      this.run = function (context, slug, callback) {
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
        found = itemsSlugs[slug] || itemsPaths[slug];

        // If the exact slug is not found, try with partial string
        if (found === undefined) {
          let partialSlugs = Object.keys(itemsSlugs).filter(
            (itemSlug) =>
              itemsSlugs[itemSlug] &&
              itemsSlugs[itemSlug].fileSlug.includes(slug)
          );
          if (partialSlugs.length === 0) {
            throw new Error(
              error(`
${logPrefix}Couldn't find any content with slug '${slug}'
`)
            );
          }
          if (partialSlugs.length > 1) {
            throw new Error(
              error(
                `
${logPrefix}Found multiple slugs containing '${slug}', couldn't decide:
- ${partialSlugs.join('\n- ')}
`
              )
            );
          }
          found = partialSlugs[0];
        }

        callback(null, new nunjucksEngine.runtime.SafeString(found.url));
      };
    })();
  },
};
