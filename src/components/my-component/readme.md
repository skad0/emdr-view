# my-component



<!-- Auto Generated Below -->


## Properties

| Property           | Attribute           | Description | Type                  | Default     |
| ------------------ | ------------------- | ----------- | --------------------- | ----------- |
| `audio`            | `audio`             |             | `string`              | `null`      |
| `iconSize`         | `icon-size`         |             | `number`              | `32`        |
| `iconSpace`        | `icon-space`        |             | `number`              | `4`         |
| `iconSrc`          | `icon-src`          |             | `string`              | `undefined` |
| `iconType`         | `icon-type`         |             | `"shape" \| "source"` | `'shape'`   |
| `isActive`         | `is-active`         |             | `boolean`             | `false`     |
| `iterationsCount`  | `iterations-count`  |             | `number`              | `12`        |
| `movementDuration` | `movement-duration` |             | `number`              | `undefined` |
| `movementPreset`   | `movement-preset`   |             | `"flick" \| "smooth"` | `'smooth'`  |


## Events

| Event          | Description | Type                         |
| -------------- | ----------- | ---------------------------- |
| `durationEnd`  |             | `CustomEvent<EmdrViewEvent>` |
| `movementTick` |             | `CustomEvent<EmdrViewEvent>` |


## Methods

### `isSameComponent(componentKey: string) => Promise<boolean>`



#### Returns

Type: `Promise<boolean>`



### `startMovement() => Promise<void>`



#### Returns

Type: `Promise<void>`



### `stopMovement() => Promise<void>`



#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
