'use strict';

const link_to = require('./lib/link_to.js');

module.exports = (eleventyConfig) => {
  eleventyConfig.addNunjucksTag('link_to', link_to);
};
