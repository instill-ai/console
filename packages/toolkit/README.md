# cortex/toolkit

## How to use

### Install

```bash
pnpm add @instill-ai/toolkit
```

### Import necessary CSS at the root

```js
import "@instill-ai/toolkit/dist/index.css";
```


## Env

When using this toolkit, you need to set up below environment variables

- NEXT_PUBLIC_ENABLE_INSTILL_API_AUTH (boolean)
- NEXT_PUBLIC_QUERY_PAGE_SIZE (number)
- NEXT_PUBLIC_VALIDATE_TOKEN_API_ROUTE (string)
- NEXT_PUBLIC_REFRESH_TOKEN_API_ROUTE (string)
- NEXT_PUBLIC_API_VERSION (string)
- NEXT_PUBLIC_DISABLE_CREATE_UPDATE_DELETE_RESOURCE (boolean)
- NEXT_PUBLIC_LIST_PAGE_SIZE (number)
- NEXT_PUBLIC_AMPLITUDE_KEY (string)
- NEXT_PUBLIC_BASE_API_GATEWAY_URL (string)
- NEXT_SERVER_BASE_API_GATEWAY_URL (string)
- NEXT_PUBLIC_MODEL_API_GATEWAY_URL (string)
- NEXT_SERVER_MODEL_API_GATEWAY_URL (string)
- NEXT_PUBLIC_VDP_API_GATEWAY_URL (string)
- NEXT_SERVER_VDP_API_GATEWAY_URL (string)
- CF_ACCESS_CLIENT_ID (string)
- CF_ACCESS_CLIENT_SECRET (string)

## About controller state

- VDP backend is using etcd to control/record the true_state of the resource and the state query from the resource endpoint is just the user_desired_state.
- But in the form, what we updated is the user_desired_state.
- We are currently not combining these two states into a single object but separating them to make the code more readable.

## About the flow of generating Airbyte connector's form

We are using Airbyte protocol for generating, maintaining, create our connectors, frontend need to come up with a way that have backward compatability and onward support of any Airbyte connectors. Here is how we accomplishing it and the principle behind these implementation.

### Principles and implementation

- **Loose couple to all the involved library**
  - We use Formik just as Airbyte, but they had closely coupled with Formik to generate the whole form ([ref](https://github.com/airbytehq/airbyte/blob/59e20f20de73ced59ae2c782612fa7554fc1fced/airbyte-webapp/src/views/Connector/ServiceForm/ServiceForm.tsx)). Every details are controled by the Formik from form's state, validation schema and submit action. In this way they may have hard time if they have much complicated form structure.
- **We try to isolated Airbyte connector's logic**
  - We separate all the types and functions into the folder
  - We make the form act like a small island, they have their own state, action and validation besides from our main form.

### Implementation details

#### About selectedConditionMap

- Internally we all use condition.title as selectedItem value. not the const field's value

#### How to get the condition's path

We rely on the field inside of condition with const key and use its path to set correct value. e.g. Snowflake's loading method
  
```js
{
  title: "Data Staging Method",
  path: "loading_method",
  "conditions": [
    {
      "[Recommended] Internal Staging": {
        fieldKey: "loading_method"
        properties: [
          {
            "default": "Internal Staging",
            "description": "",
            "title": "",
            "const": "Internal Staging",
            "_type": "formItem",
            "path": "loading_method.method", // <-- This is the correct path
            "fieldKey": "method",
            "isRequired": true,
            "isSecret": false,
            "multiline": false,
            "type": "string"
            }
            ...
        ]
        ...
      }
    }
  ]
}
}
```  

But sometimes the const field is not there (due to some human error of Airbyte side), we 
need to find the workaround. Normally there are multiple conditions under the conditionForm, we could loop though all the field to find the right one.

#### How to remove old condition configuration when user select new one?

Take this destination for example, what if user select another tunnel_method? How do we update the tunnel_method as whole.

```js
{
  id: "sample",
  name: "destination-connectors/sample,
  uid: "badd8615-d68e-4fc1-8bc1-817766e285ec",
  {
    "description": "",
    "configuration": {
        "database": "foo-1",
        "host": "fooHost",
        "password": "admin",
        "port": 3306,
        "tunnel_method": {
            "ssh_key": "barKey",
            "tunnel_host": "barHost",
            "tunnel_method": "NO_TUNNEL",
            "tunnel_port": 22,
            "tunnel_user": "barUser"
        },
        "username": "yoyoyman"
    },
    "state": "STATE_UNSPECIFIED",
    "tombstone": false,
    "user": "users/local-user",
    "create_time": "2022-09-01T05:55:44.498367Z",
    "update_time": "2022-09-01T05:55:44.498367Z"
  }
}
```

The short answer is we don't bother control the field values at the first place. Because we had built up Yup according to the user selected condition. We can use yup to help us strip un-used/not-wanted/old condition data. 

```js
// This is the original data
{
  "configuration": {
      "database": "we3",
      "host": "yojhojo",
      "password": "ewr",
      "port": 3306,
      "tunnel_method": {
          "ssh_key": "ewr",
          "tunnel_host": "wer",
          "tunnel_method": "SSH_KEY_AUTH",
          "tunnel_port": 22,
          "tunnel_user": "wer",
          "tunnel_user_password": "ewrewr343434"
      },
      "username": "234"
  },
  "database": "we3",
  "host": "yojhojo",
  "password": "ewr",
  "port": 3306,
  "tunnel_method.ssh_key": "ewr",
  "tunnel_method.tunnel_host": "wer",
  "tunnel_method.tunnel_method": "SSH_KEY_AUTH",
  "tunnel_method.tunnel_port": 22,
  "tunnel_method.tunnel_user": "wer",
  "username": "234",
  "tunnel_method": "SSH_KEY_AUTH",
  "tunnel_method.tunnel_user_password": "ewrewr343434"
}

// This is the striped data, we stripe tunnel_method.tunnel_user_password and others not used Ui 
// data (data that is not in configuration)
{
  "configuration": {
    "username": "234",
    "tunnel_method": {
        "tunnel_user": "wer",
        "tunnel_port": 22,
        "tunnel_method": "SSH_KEY_AUTH",
        "tunnel_host": "wer",
        "ssh_key": "ewr"
    },
    "port": 3306,
    "password": "ewr",
    "host": "yojhojo",
    "database": "we3"
  }
}
```

#### How to edit OneOfCondition section when we have initial values?

When user created a new destination and they want to edit it at ConfigurationDestinationForm, how to let them edit OneOfCondition section?

Here is the sample destination response.

```js
{
  id: "sample",
  name: "destination-connectors/sample,
  uid: "badd8615-d68e-4fc1-8bc1-817766e285ec",
  {
    "description": "",
    "configuration": {
        "database": "foo-1",
        "host": "fooHost",
        "password": "admin",
        "port": 3306,
        "tunnel_method": {
            "ssh_key": "barKey",
            "tunnel_host": "barHost",
            "tunnel_method": "NO_TUNNEL",
            "tunnel_port": 22,
            "tunnel_user": "barUser"
        },
        "username": "yoyoyman"
    },
    "state": "STATE_UNSPECIFIED",
    "tombstone": false,
    "user": "users/local-user",
    "create_time": "2022-09-01T05:55:44.498367Z",
    "update_time": "2022-09-01T05:55:44.498367Z"
  }
}
```

Now we have a OneOfCondition field tunnel_method, how can we let the initial form construction knows we should display tunnel_method with "NO_TUNNEL" condition?

- We use selectedConditionMap to store the current selection of condition. When the selectedConditionMap is empty (initial state), we choose the first condition as default.
- When deal with configuration, once we get the initial value we have to map AirbyteFormTree and the configuration values to form the proper initial selectedConditionMap.
- At OneOfConditionSection, when form is not dirty we will initialize correct selected condition.


### Issues

- How to validate all the form, including oneOf condition and the nested oneOf
- SnowFlakes auth_type doesn't have const field

### Caveats

- Be careful of selectedConditionMap, it will affect the yup which will affect the strip value that will be sent as payload too.
- When build the yup, airbyte use condition.title to find the target condition. Take `tunnel_method` for example, it will use tunnel_method's title like `[Recommended] Internal Staging` to find the target value. But we actually send it's value `Internal Staging` to the backend. So next time when we fetch the backend, the data will store `Internal Staging` not the `[Recommended] Internal Staging`

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

## About react query Service

- Data preparation of join (collect pipeline-related recipe details) occurs at react-query hook inside of @services

### About the long-running operation

Currently, there have two long-running operations in the instill backend.

- Create model
  - Upon creation, the model won't be in the model-backend immediately, you need to check the operation status. Once it's finished the model will be in the model-backend that is queryable.
- Deploy model

#### Note

- The returned object will be the operation. You need to query the operation endpoint to access the operation resource. 
- The service will invalidate the whole data query. For example, once a model creation occur, we will invalidate the whole ["model"] key set immediately.
- When you catch the onSuccess signal of react-query service and begin to periodically check the operation endpoint for status. You should update the whole react-query cache once you get the new resource.
- Operation data is volatile, we don't persist it in react-query cache.

## Dot lib

This lib converts dot notation like `path.to.value` to reference `{ path: { to: value }}`

### Reference

- [Formik - setIn](https://github.com/jaredpalmer/formik/blob/b9cc2536a1edb9f2d69c4cd20ecf4fa0f8059ade/packages/formik/src/utils.ts#L106)
- [Formil - getIn](https://github.com/jaredpalmer/formik/blob/b9cc2536a1edb9f2d69c4cd20ecf4fa0f8059ade/packages/formik/src/utils.ts#L69)
- [Convert a JavaScript string in dot notation into an object reference](https://stackoverflow.com/questions/6393943/convert-a-javascript-string-in-dot-notation-into-an-object-reference)
- [Lodash - BaseSet](https://github.com/lodash/lodash/blob/ddfd9b11a0126db2302cb70ec9973b66baec0975/lodash.js#L3965)

### Caveats

- Currently don't support bracket path `foo[0][1]`, it only support `foo.0.1`
- `Error: Element type is invalid: expected a string` Please double check your peerDeps. For example, this package should have instill-ai/design-system and instill-ai/design-token as its peerDeps.
- We use pnpm -r publish at the root folder to publish the packages