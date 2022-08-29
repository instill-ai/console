/**
 * Because react-frontmatter is now a ESM package, Jest still need some config to test ESM packages.
 * This is just a workaround, if you want to testreact-frontmatter you may need something else, you
 * could find more information here https://github.com/remarkjs/react-markdown/issues/635
 */

/*eslint-disable */

const remarkFrontmatter = () => {};

export default remarkFrontmatter;
