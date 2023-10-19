# About new design system

We are undergoing a series of revamps for our design-system, which included several aspects:

1. Compound component first approach. Under the hood, we will use Radix-UI.
2. We are abandoning one style one prop approach due to it being too verbose to use

## Info

- We use pnpm -r publish at the root folder to publish the packages

## How to use the storybook at local

- `pnpm watch:css` and let it run
- `pnpm sb`

## How to deploy storybook

- Because design-system relies on design-tokens, when deploy to Vercel, we need to build the package first from the root with `pnpm ci-build-storybook`
- The output will be put into `/packages/design-system/storybook-static`, we indicate this folder in the Vercel setting

--- 

# Old design system

This is a react design system builds on top of TailwindCSS with several principles:

- Two-level component design: base-level components and exported-level components
- One style one prop approach: The base component will expose style as props as much as possible, one prop will only have one style string

# How to use

1. Install: `yarn add @instill-ai/design-system`
2. Add this package into your main project tailwind.config.js and make sure you have all the necessary style

```js
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@instill-ai/design-system/build/*.js",
  ],
};
```

# How to contribute

### Install typescript intelligence

- We heavily rely on typescript at this moment, before you make any contribution please install typescript intelligence.

### You should write component unit-test for every base-level component

- We haven't embodied this approach

### You should check the export structure.

- We want to abstrct away the file structure, so every component should be exported to its outer folder.
  - If it is components, you should check whether it had already been exported to `@instill-ai/design-system/components` before you move on to the next step

### Build before publish

- You should use `yarn build` script to build the latest version of design-system and change the version of it, then you could publish the package. In the future, after the official 0.1.0 release we will adapt ci for this task.

# Why we choose the utility class approach.

- The utility class is easy to write, it can deliver an application at a relatively quick pace.
- Just CSS, there has no further abstraction users need to learn.
- Get rid of naming overhead: We don't want to re-invent thousands of class names just to select the right element.
- Easy to use pseudo-class: peer, hover, group...etc are all very good functionality we could leverage out of the box.

# The problems we try to solve

- Oversize comes from being over-designed:
  - Traditionally, design systems want to find a one size for all components that leads to over-desige. This may result in a huge component with hundreds of if...else conditionally rendered style.
- Over abstraction
  - Some design systems will try to abstract every layer of element. At the first glance, this can fertilize re-usability and encapsulate the styles, but it will bring up a lot of abstraction and cause unncessary overhead for consumers.
  - They don't want to make the style as props but comes up with other naming convention which causes another layer of abstraction like type={},
  - In this [article](), the author have a suitable example, In our perspective the first example is harder to read than the second one, it has too many layers of abstraction that is exactly what we want to avoid.

```js
<Box padding={5} width="320px" border="sm">
  <Stack gap={2}>
    <Image borderRadius="md" src="https://bit.ly/2k1H1t6" />
    <Row gap={2}>
      <Badge color="#702459">Plus</Badge>
      <Spacer left={2}>
        <Text size="sm" weight="bold" color="#702459">
          VERIFIED &bull; CAPE TOWN
        </Text>
      </Spacer>
    </Row>
    <Text size="xl" weight="semibold">
      Modern, Chic Penthouse with Mountain, City & Sea Views
    </Text>
    <Text>$119/night</Text>
    <Row gap={1}>
      <Icon src={MdStar} color="#ED8936" />
      <Text size="sm">
        <Text size="sm" weight="bold">
          4.84
        </Text>
        (190)
      </Text>
    </Row>
  </Stack>
</Box>
```

```js
<div className="p-5 w-32 rounded">
  <div className="flex">
    <img className="rounded w-full" src="https://bit.ly/2k1H1t6" />
    <div className="flex flex-row mt-2">
      <div className="rounded py-2 px-4 bg-mono-400">
        <div className="text-mono-100">Plus</div>
      </div>
      <div className="text-sm font-bold text-pale-100">
        VERIFIED &bull; CAPE TOWN
      </div>
    </div>
    <span className="text-xl font-semibold">
      Modern, Chic Penthouse with Mountain, City & Sea Views
    </span>
    <span className="text-xl font-semibold">$119/night</span>
    <div className="flex flex-row items-center">
      <Icon src={MdStar} color="#ED8936" />
      <span className="text-sm">
        <span className="font-bold">4.84</span>
        (190)
      </span>
    </div>
  </div>
</div>
```

- Flexibility ends up with slow iteration:
  - If you adopt a single, huge component route, the first thing you need to solve is the design corner case. To fulfill these needs you may add lots of conditions or sub-components here or there in the main component, slowly but steadily your component will be hard to iterate or upgrade.
  - It's hard to read through all the dependency between these props due to they may have other meanings besides CSS styles.

# The principles

We try to solve these problems with two principles

- Two-level component design:
  - Base-level components: The foundation of every type of component.
    - You can find them in the storybook with path: /Base
    - Base level components won't be exported to be used by exterior consumers.
    - Base components will define all the props and functions the component needs.
  - Exported-level components: Inherits all the props from a base component but may have a pre-defined style, meant to be used by the consumer.
    - You can find them in the storybook with path: /Ui
    - Exported-level components will be consumed with the limited props like onChangeInput, borderStyle, fontFamiliy, or other functional props.
    - We will limit as little style input as possible, to control the visual style of the component.
- One style one prop
  - Every base component will expose as many styles as possible, it seldomly has pre-defined styles.
  - Every exposed style props can only have one style string, we don't accept something like styleName="font-base text-black", we will separate it as fontSize="font-base" and textColor="text-black".

```js
// We won't do this

const square = ({ styleName, children }) => {
  return <div className={styleName}>{children}</div>;
};

// We will do this
// cn is a aggregator, it will compose two string like "hi" "yo" to "hi yo"

const square = ({ width, height, color, children }) => {
  return <div className={cn(width, height, color)}>{children}</div>;
};
```

## How we solve above problems with the three principles

- Oversize comes from being over-designed:
  - The base-level component will have limited condition rendering thanks to Tailwind CSS, it only needs to expose as many as style props as possible for further customization.
- Over abstraction
  - Because we don't need to encapsulate style within layer of components just to manage bunch of css files, we can avoid over abstraction.
- Flexibility ends up with slow iteration:
  - With the two-level component design, we make base-level components act as a single source of truth, every group of the component should only inherit the base-level component
  - The design system team doesn't need to use a single component to face all the needs, they can create the new exported-level components to achieve different corner cases. They can iterate at a relatively fast speed.

# Drawbacks & Known issues

- Dynamic styles
  - Tailwind CSS fell short at calculated style, for example, if we have a width: 80px square and we want to put a dot at around 1/3 - 10px of its width, at the first glance you may think this is easy, we can just use Just-In-Time feature. But due to Tailwind CSS's prune nature, this won't work, at compile time Tailwind CSS can't recognize the dynamic style like that.

```js
const square = ({ width }) => {
  return (
    <div className={`w-[${width}px] relative`}>
      <div className={`dot absolute left-[${width / 3 - 10}px]`} />
    </div>
  );
};
```

- Hard to integrate with 3rd party tooling
  - This is the known issue if the design system wants to adapt to another component library such as react-select. They have to come up with a method to exchange styles across different CSS frameworks because we are using utility classes, these may cause much more issues than the traditional CSS approach.

# Rules

- Don't use short-cut features of javascript, use a library like clsx or classnames
- Include `import React from "react"` in every file use react(To avoid jsx-runtime specific function not compatible issue)
- Everytime you create a new base-level component, you need to create a exported-level component inherit that base-level component to act as manual.
- Use arbitrary number as many as possible when it comes to size related className like fontSize or lineHeight, due to we may use `getTailwindClassNumber()` to extract number from className, currently it not support with something like `text-sm`

# FQA

- I need to input so many style props in a component, why not just gave me a component and a type prop

# About storybook

- Use `{...args}` to set props.

# Code quality

- Every base-level component should have a test suite
- Every base-level and exported-level component should have a story

# Lesson learned

- Don't rely on pseudo-class like `disabled:` or `read-only:`. you should pass disabled and read-only style without these pseudo-class, use simple style and apply it on container instead of input itself.
  - Caveat: TextArea may have the resizing issue
  - Placeholders have to use placeholder: pseudo-class because there don't have another simple method to programmatically address placeholder style
- Don't use some ambiguous story like playground and default, they almost have identical style props, but Default is a fixed style.
  - Only have playground story, make default style available and users can modify as their wishes
  - Caveat: playground is using `Template.bind()` to construct story, its console.log is different from regular console.log
- You may want to remove the whole args props in storybook to make the type check cleaner, but in this way user can't directly change the props' value on storybook UI

## About the design of the base and exported level

- We will always digest as many props at base level as possible, take SingleSelectBase as example, when use InputDescription component, we didn't use BasicInputDescription but InputDescriptionBase to make SingleSelectBase as flexible as possible, but here comes another problem, we need to store the same config for BasicInputDescription at BasicInputDescription and BasicSingleSelece. To solve this problem, we will export a set of BasicInputDescriptionConfig to let other component use the config and reduce the maintance overhead.

## About the passThrough props

Normally we don't accept passThrough props like below. The only exception will be input related field like textarea (BasicTextArea).

> In the future, we will make it has explicit type.

```tsx
type FooProps = {
  id: string
}

const Foo = (props: FooProps) => {
  const {id, ...passThrough} = props

  <input {...passThrough} id={id} />
}
```

## Todo

- Solve accessibility issues
- Think about memorize component
- InputLabel cursor
- If we bundle the design-system as package, we may re-bundle it again with duplicate style css, need to investigate this.
- Adapt instill color into Select component
- Enable strict type checking
- Force every component to use Nullable prop, instead of undefined
- Decide whether to use controlled components or not
- Solve upload field cursor not correctly display
- Extract onChangeInput type from BasicInputFieldAttributes to individual component
