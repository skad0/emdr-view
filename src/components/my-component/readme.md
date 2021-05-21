# my-component



<!-- Auto Generated Below -->


## Properties

| Property           | Attribute           | Description | Type                  | Default     |
| ------------------ | ------------------- | ----------- | --------------------- | ----------- |
| `audio`            | `audio`             |             | `string`              | `null`      |
| `iconSrc`          | `icon-src`          |             | `string`              | `undefined` |
| `iconType`         | `icon-type`         |             | `"shape" \| "source"` | `'shape'`   |
| `movementDuration` | `movement-duration` |             | `number`              | `60`        |
| `movementPeriod`   | `movement-period`   |             | `number`              | `1000`      |
| `movementPreset`   | `movement-preset`   |             | `"flick" \| "smooth"` | `'flick'`   |


## Events

| Event         | Description | Type                         |
| ------------- | ----------- | ---------------------------- |
| `durationEnd` |             | `CustomEvent<EmdrViewEvent>` |


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
