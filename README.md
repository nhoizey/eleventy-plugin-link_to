# eleventy-plugin-link_to

A nunjucks tag to link to another internal content in Eleventy

# Installation

To install the plugin, install it as a dev dependency in your Eleventy project:

```bash
npm install eleventy-plugin-link_to --save-dev
```

And add this to your `.eleventy.js` configuration file:

```javascript
eleventyConfig.addPlugin(require('eleventy-plugin-link_to'));
```

# Usage

## Use the full slug

…

## Use the filePathStem

…

## Use the URL

…

## Use only a fragment or a slug/pathStem/URL

You can use a fragment of the content's slug (or pathStem, or URL) if you know that there is no ambiguity with another content.

For example, I can use `{% link_to /eleventy/ %}` because I know the only content on my site with a slug containing `/eleventy/` is the page of the Eleventy tag, which URL is `/tags/eleventy/`.

**⚠ Be carreful, if an article with the title `Eleventy` is added later, this link will break!**

# Error messages

## If you use a slug that is common to multiple contents

With a single `/tag-page.njk` generating multiple pages with pagination, trying to `{% link_to(tag-page) %}` will give this error:

```bash
[link_to] Multiple contents have the same slug 'tag-page':
- /tag-page
- /tag-page
- …
- /tag-page
- /tag-page
 -> you can use link_to with the filePathStem or URL
```

## If you use a sub-string present in multiple slugs

```bash
[link_to] Found multiple slugs containing 'css-grid', couldn't decide:
- sophisticated-partitioning-with-css-grid
- intrinsically-responsive-css-grid-with-minmax-and-min-
- breaking-out-with-css-grid-layout
- breaking-out-with-css-grid-explained
- full-bleed-layout-using-css-grid
```
