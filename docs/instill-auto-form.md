
## How do we implement `instillEditOnNodeFields`


## The object value filter on TextField

```TypeScript
<Input.Root>
  <Input.Core
    {...field}
    type="text"
    value={
      typeof field.value === "object" ? "" : field.value ?? ""
    }
    autoComplete="off"
    onChange={(e) => {
      field.onChange(e);
      form.trigger(path, { shouldFocus: true });
    }}
    disabled={disabled}
  />
</Input.Root>
```

Sometime when we change the condition, the old value may look like a object for the new fields.

For example, we have a structure like this 

```TypeScript
const oldValue = {
  "inputs": {
    "input": {
      query: "hello-world"
    }
  },
  "task": "foo"
}
```

When we switch the condition from `foo` to `bar` we will remove the old value by setting them to null, but we won't really remove this key-value. But the new structure use `inputs.input` as string. So when react-hook-form directly access it, it will display as `Object Object`

```TypeScript
const newValue = {
  "inputs": {
    "input": {
      query: null
    }
  }
  "task": "bar"
}
```