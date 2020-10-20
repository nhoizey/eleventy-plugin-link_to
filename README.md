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

This plugin adds a Nunjucks tag you can use both in Nunjucks layouts and in Markdown content.

Here's the syntax:

```nunjucks
{% link_to "the-prodigal-techbro" %}
```

## Use the full slug

I can use `{% link_to "the-prodigal-techbro" %}` to link to [`/links/2020/10/12/the-prodigal-techbro/`](https://nicolas-hoizey.com/links/2020/10/12/the-prodigal-techbro/) (read it).

## Use the filePathStem

In Eleventy, [filePathStem](https://www.11ty.dev/docs/data-eleventy-supplied/#filepathstem) is "mapped from inputPath and is useful if you’ve inherited a project that doesn’t use clean permalinks."

For example, I can use `{% link_to "/links/2020/10/12/the-prodigal-techbro/index" %}`.

## Use the URL

For example, I can link to the second note I wrote on 27th March 2020 with `{% link_to "/notes/2020/03/27/1/" %}` .

## Use only a fragment or a slug/pathStem/URL

You can use a fragment of the content's slug (or pathStem, or URL) if you know that there is no ambiguity with another content.

For example, I can use `{% link_to "/eleventy/" %}` because I know the only content on my site with a slug containing `/eleventy/` is [the page of the Eleventy tag](https://nicolas-hoizey.com/tags/eleventy/), which URL is `/tags/eleventy/`.

**⚠ Be carreful, if an article with the title `Eleventy` is added later, this link will break!**

If I use only `eleventy` without any `/`, it will currently find the page with this URL: `/links/2020/03/17/eleventy-s-new-performance-leaderboard/`, which is the only content with `eleventy` in the slug (the `/tags/eleventy/` page's slug is `tag-page`, see below), and slugs are parsed before pathStems and URLs.

# Error messages

If there is any issue finding the content you want to link to, Eleventy build log will contain one of these error messages:

## If you use a slug that is common to multiple contents

With a single `/tag-page.njk` generating multiple pages with pagination, trying to `{% link_to "tag-page" %}` will give this error:

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

## If you use a sub-string present in multiple pathStem or URL

```bash
[link_to] Found multiple paths or URL containing '2020/', couldn't decide:
- /articles/2001/01/23/lettre-de-2020/index
- /articles/2001/01/23/lettre-de-2020/
- /notes/2020/01/01/1/index
- /notes/2020/01/01/1/
- /articles/2020/01/10/can-we-monitor-user-happiness-on-the-web-with-performance-tools/index
- …
```
