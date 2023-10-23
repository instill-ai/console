# About this repo

This is a PoC of InstillAI Auto-generated form. 

## Implementation details

### About form validation

We set the `mode` and `reValidateMode` of react-hook-form re to `onSubmit` to block the error when user switch an oneOf field's condition cause Zod to have literal validation issue. 

https://github.com/EiffelFly/auto-gen-form-playground/assets/57251712/b52d82b5-20bb-418d-9442-23f264518eee

But at the same time, we also want to validate user's input on change to clean up a path toward auto-saving feature. We manually trigger react-hook-form validation onChange in every fields.

### About reset value when user switch condition

We need to remove old value when user switch condition