## About lib/markdown

!!! We had encountered some serious issue when using this method.
https://github.com/EiffelFly/code-hike-remote-docker

We will store stuff related to markdown, remark, mdx here.

### About how we utilize mdx, next-mdx-remote and code-hike.

We want to leverage code-hike style code-block but currently it didn't support its components in the form of react compoment. The only way to utilize it is through mdx compiled string. And it has several disadvantages.

- mdx compiler can only run in server-side/node environment.
- There has no way to represent markdown code-block syntax in template string.

`
```js
// This will result in error
```
`

1. To accomplish this task, we have template store in mdx file format like below.

```mdx
<CH.Code>

```json

{{instill-test-result}}

```

</CH.Code>
```

2. We read the template and replace the placeholder with desired value

```js
const template = fs.readFileSync(templatePath, { encoding: "utf-8" });
const codeStr = template.replaceAll(match, value);
```

3. Then we compile the mdx with next-mdx-remote serialize and desired theme

```js
const theme = JSON.parse(
  fs.readFileSync(
    join(process.cwd(), "src", "styles", "rose-pine-moon.json"),
    { encoding: "utf-8" }
  )
);

const templateSource = await serialize(codeStr, {
  parseFrontmatter: false,
  mdxOptions: {
    useDynamicImport: true,
    remarkPlugins: [
      [
        remarkCodeHike,
        {
          theme,
          lineNumbers: false,
          showCopyButton: true,
          autoImport: false,
        },
      ],
    ],
  },
});
```

## Caveat

- Because mdx compiler can only run in server side, if client side need to dynamic change the value of code-block, you need to request `/api/get-code-hike-template-source` api route to generate the mdx source.