# About the flow of generating Airbyte connector's form

We are using Airbyte protocol for generating, maintain, create our connectors, frontend need to come up with a way that have backward compatability and onward support of any Airbyte connectors. Here is how we accomplishing it and the principle behind these implementation.

## Principles and implementation

- **Loose couple to all the involved library**
  - We use Formik just as Airbyte, but they had closely coupled with Formik to generate the whole form ([ref](https://github.com/airbytehq/airbyte/blob/59e20f20de73ced59ae2c782612fa7554fc1fced/airbyte-webapp/src/views/Connector/ServiceForm/ServiceForm.tsx)). Every details are controled by the Formik from form's state, validation schema and submit action. In this way they may have hard time if they have much complicated form structure.
- **We try to isolated Airbyte connector's logic**
  - We separate all the types and functions into the folder
  - We make the form act like a small island, they have their own state, action and validation besides from our main form.

## Implementation details

### Store in the `value.configuration` and the value itself

In our backend we have to input flatten data

```js
  {
    tunnel_method: "SSH",
    tunnel_key: "key"
  }
```

But the YUP we build validate the configuration in a object

```js
{
  tunnel_method: {
    tunnel_key: "key";
  }
}
```

So right now we actually have something like this

```js
{
  tunnel_method.tunnel_key: "key"
  configuration: {
    tunnel_method: {
      tunnel_key: "key";
    }
  }
}
```

Due to the time constraint, we haven't figured out how to properly combine this two situation, here are possible direction

1. Rebuild the airbyteSchemaToYup, make result yup flatten
2. Flatten the data at the end, when we need to post the payload

## Issues

- How to validate all the form, including oneOf condition and the nested oneOf

## Useful refernece

- [Airbyte - ServiceForm](https://github.com/airbytehq/airbyte/blob/59e20f20de73ced59ae2c782612fa7554fc1fced/airbyte-webapp/src/views/Connector/ServiceForm/ServiceForm.tsx)
- [Airbyte - Form's types](https://github.com/airbytehq/airbyte/blob/master/airbyte-webapp/src/core/form/types.ts)
- [Airbyte - SchemaToUiWidget](https://github.com/airbytehq/airbyte/blob/59e20f20de73ced59ae2c782612fa7554fc1fced/airbyte-webapp/src/core/jsonSchema/schemaToUiWidget.ts)
  - How they loop though json schema and construct FormBlock(In our terms, it's FormTree)
- [Airbyte - FormSection](https://github.com/airbytehq/airbyte/blob/master/airbyte-webapp/src/views/Connector/ServiceForm/components/Sections/FormSection.tsx)
  - The FormSection is how they control their UI widget
- [Airbyte - Control](https://github.com/airbytehq/airbyte/blob/master/airbyte-webapp/src/views/Connector/ServiceForm/components/Property/Control.tsx)
  - How they generate field based on their type, array, boolean, string, integer, array
- [Airbyte - schemaToYup](https://github.com/airbytehq/airbyte/blob/59e20f20de73ced59ae2c782612fa7554fc1fced/airbyte-webapp/src/core/jsonSchema/schemaToYup.ts)
