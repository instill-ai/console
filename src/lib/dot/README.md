# Context

This lib convert dot notation like `path.to.value` to reference `{ path: { to: value }}`

# Reference

- [Formik - setIn](https://github.com/jaredpalmer/formik/blob/b9cc2536a1edb9f2d69c4cd20ecf4fa0f8059ade/packages/formik/src/utils.ts#L106)
- [Formil - getIn](https://github.com/jaredpalmer/formik/blob/b9cc2536a1edb9f2d69c4cd20ecf4fa0f8059ade/packages/formik/src/utils.ts#L69)
- [Convert a JavaScript string in dot notation into an object reference](https://stackoverflow.com/questions/6393943/convert-a-javascript-string-in-dot-notation-into-an-object-reference)
- [Lodash - BaseSet](https://github.com/lodash/lodash/blob/ddfd9b11a0126db2302cb70ec9973b66baec0975/lodash.js#L3965)

# Caveats

- Currently don't support bracket path `foo[0][1]`, it only support `foo.0.1`
