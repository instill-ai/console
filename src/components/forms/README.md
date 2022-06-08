# About form components

## General guideline

In every component we separately function with sections, this sections have several rules.

- Better to use useMemo state to control the form, reduce the complicate setState within lots of useEffect.
- The state will be arrange at the top of each sections to benefit other maintainer.
- Field on change callback will be put at the end of each section due to they usually need to use other state.
- Each section need to be separated by divider like this one.
- Submit the form using formik onSubmit handler and validator

// ###################################################################
// #                                                                 #
// # 1 - <_title_>                                                   #
// #                                                                 #
// ###################################################################
//
// <_comment_>

### About the naming convention

- Action verifirer: can____ (canDeployModel, canSetupModel)
- Action: handle__ (handleDeployModel, handleSetupModel)

## Pipeline form

Pipeline form is complicated, we can not simply leverage what Formik provided but need to write out own flow and centralize the data we gather using formik state, formik provide very handy form state management.

When you read though pipeline form, it now separatelt to 5 step

- Setup pipeline mode step
- Setup pipeline source step
- Setup pipeline model step
  - use existing model flow
  - create new model flow
- Setup pipeline destination step
- Setup pipeline details step


