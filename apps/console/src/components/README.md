## About the component folder

Please refer to [instill.tech](https://github.com/instill-ai/instill.tech/tree/main/src/components) repo

This folder is under rapidly refactoring.

## About form components

### General guideline

In every component we separately function with sections, this sections have several rules.

- Better to use useMemo state to control the form, reduce the complicate setState within lots of useEffect.
- The state will be arrange at the top of each sections to benefit other maintainer.
- Field on change callback will be put at the end of each section due to they usually need to use other state.
- Each section need to be separated by divider like this one.
- Submit the form using formik onSubmit handler and validator

// ###################################################################
// # #
// # 1 - <_title_> #
// # #
// ###################################################################
//
// <_comment_>

#### About the naming convention

- Action verifirer: can\_\_\_\_ (canDeployModel, canSetupModel)
- Action: handle\_\_ (handleDeployModel, handleSetupModel)

### Pipeline form

Pipeline form is complicated, we can not simply leverage what Formik provided but need to write out own flow and centralize the data we gather using formik state, formik provide very handy form state management.

When you read though pipeline form, it now separatelt to 5 step

- Setup pipeline mode step
- Setup pipeline source step
- Setup pipeline model step
  - use existing model flow
  - create new model flow
- Setup pipeline destination step
- Setup pipeline details step

### About the complicated form generation

We are using airbyte potocol to control our destination connectors, they are using quite complicated yaml to generate their form. They generate all the whole formik component by digesting the JsonSchema ([ServiceForm](https://github.com/airbytehq/airbyte/blob/8076b56f3718d6fe054b660a838f2c1c6890ffc2/airbyte-webapp/src/views/Connector/ServiceForm/ServiceForm.tsx)). In my opinion this is not flexible and our form's structure is much complicated than airbyte due to we have the pipeline concept on top of their connection.

The solution will be cell-design in normal formik's form's flow. Take `CreatePipelineForm` for example, We have a giant formik form that hold the full state of the flow, each step have its own logic and upon finish the step, they will fill in the value into formik state and call it the day. Here comes a problem, if we want to validate at the end of the flow, we have to write a giant validation schema to validate every possibility when create the model or the destination connector. This is appearantly not ideal. Below are the proposal for better implementation.

- We should trust the validation of every step and not validate at the end of the flow.
- We will have a flag for every step's validation like `validModel`, at the end of the flow, it only needs to check the value of this kind of flag.
- About the complicated form like model definition and destination connection, we generate them from json-schema and compose a block(not a formik container), it's not a `<form></form>` HTML tag, but a pure functional component. It will digest the user's input, validate the input then submit. After the request is complete, it will fill in the return value(most of the cases, it will fill in the identifier of the resource, take connector for example, it may fill in `source-connectors/hi`) and move on.

In this implementation we could have very flexible block that can install in near every form. and we will call each of this kind of component FormCell.
