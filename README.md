Visual Data Preparation (VDP) console

## Todo

- Combine StatusLabel and ModeLabel under a single LabelBase
- Make all the configuration form become self-generated from backend schema
- Source and Destination's component are almost identical, combine their component together
- Complete ConfigureDestination and ConfigureSource form
- When updating cache in react-query, we use code below, this won't retain the order of the old array.

```js
queryClient.setQueryData<Model[]>(["models"], (old) => {
	if (!old) {
		return [newModel];
	}

	return [...old.filter((e) => e.id !== newModel.id), newModel];
});
```

- Error bundary
- Suspense
- Refactor react-query queryKey to make it more reliable, especially model services
- Right now the data type is 
	- PipelineWithRawRecipe -> process -> Pipeline
	- Source -> process -> SourceWithDefinition
	- Try to refactor above with same logic
