# `eleventy-plugin-link_to`

[![npm](https://img.shields.io/npm/v/eleventy-plugin-link_to?logo=npm&style=for-the-badge)](<![npm](https://img.shields.io/npm/v/eleventy-plugin-link_to?logo=npm&style=for-the-badge)>)
[![npm](https://img.shields.io/npm/dw/eleventy-plugin-link_to?style=for-the-badge&logo=npm)](https://www.npmjs.com/package/eleventy-plugin-link_to)
[![GitHub stars](https://img.shields.io/github/stars/nhoizey/eleventy-plugin-link_to.svg?style=for-the-badge&logo=github)](https://github.com/nhoizey/eleventy-plugin-link_to/stargazers)
[![Follow @nhoizey@mamot.fr](https://img.shields.io/mastodon/follow/000262395?domain=https%3A%2F%2Fmamot.fr&style=for-the-badge&logo=mastodon&logoColor=white&color=6364FF)](https://mamot.fr/@nhoizey)

A Nunjucks tag to link to another internal content in Eleventy with its slug.

# Installation

The plugin is available on npm: <https://www.npmjs.com/package/eleventy-plugin-link_to>

Install it as a dev dependency in your Eleventy project:

```bash
npm install eleventy-plugin-link_to --save-dev
```

Then add the plugin in your `.eleventy.js` configuration file and make sure Markdown is parsed with Nunjucks instead of [the default Liquid template engine](https://www.11ty.dev/docs/config/#default-template-engine-for-markdown-files):

```javascript
module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(require('eleventy-plugin-link_to'));
  return {
    markdownTemplateEngine: 'njk',
  };
};
```

# Usage

This plugin adds a Nunjucks tag you can use both in Nunjucks layouts and in Markdown content.

Here's the syntax:

```nunjucks
{% link_to "the-content-slug" %}
```

_ℹ️ This is a [Nunjucks custom tag](https://www.11ty.dev/docs/custom-tags/), not an [Eleventy shortcode](https://www.11ty.dev/docs/shortcodes/)._

Let's say you have the following contents:

```
/about.md
/index.md
/notes/2019/03/10/hello.md
/notes/2020/09/05/how-many-plugins.md
/posts/2020/09/22/hello.md
/posts/2020/10/20/new-plugin.md
/tag-page.njk
```

## Use the full slug

You can use `{% link_to "new-plugin" %}` to link to `/posts/2020/10/20/new-plugin/`.

## Use the filePathStem

_ℹ️ In Eleventy, [filePathStem](https://www.11ty.dev/docs/data-eleventy-supplied/#filepathstem) is "mapped from inputPath and is useful if you’ve inherited a project that doesn’t use clean permalinks."_

There are two content with the same `hello` slug, so you can't use `{% link_to "hello" %}`.

You can use `{% link_to "/notes/2019/03/10/hello" %}` instead.

## Use the URL

You can also use `{% link_to "/notes/2019/03/10/hello/" %}`, if you use Eleventy's default permalinks.

## Use only a fragment of a slug/pathStem/URL

You can also use just a fragment of the content's slug (or pathStem, or URL) if you know that there is no ambiguity with another content.

You can for example use `{% link_to "2020/09/22" %}` because there is only one content with a slug containing `2020/09/22`.

---

On [my site](https://nicolas-hoizey.com/), I can use `{% link_to "/eleventy/" %}` because I know the only content on my site with a slug containing `/eleventy/` is [the page of the Eleventy tag](https://nicolas-hoizey.com/tags/eleventy/), which URL is `/tags/eleventy/`.

**⚠ I have to be carreful, if I add an article with the title `Eleventy` later, this link will break!**

If I use only `eleventy` without any `/`, it will currently find the page with the URL `/links/2020/03/17/eleventy-s-new-performance-leaderboard/`, which is the only content with `eleventy` in the slug (the `/tags/eleventy/` page's slug is `tag-page`, see below), and **slugs are parsed before pathStems and URLs**.

# Error messages

If there is any issue finding the content you want to link to, Eleventy build log will contain one of these error messages:

## `Multiple contents have the same slug '…'`

If you use a slug that is common to multiple contents.

For example, with a single `/tag-page.njk` template generating multiple pages with pagination, trying to `{% link_to "tag-page" %}` will give this error:

```bash
[link_to] Multiple contents have the same slug 'tag-page':
- /tag-page
- /tag-page
- …
- /tag-page
- /tag-page
 -> you can use link_to with the filePathStem or URL
```

## `Found multiple slugs containing '…', couldn't decide`

If you use a sub-string present in multiple slugs, you'll get this error:

```bash
[link_to] Found multiple slugs containing 'plugin', couldn't decide:
- how-many-plugins
- new-plugin
```

## `Found multiple paths or URL containing '…', couldn't decide`

If you use a sub-string present in multiple pathStem or URL, you'll get this error:

```bash
[link_to] Found multiple paths or URL containing '2020/09', couldn't decide:
/notes/2020/09/05/how-many-plugins/
/posts/2020/09/22/hello/
```
