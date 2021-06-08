export interface AnimationPreset {
  keyframes: Keyframe[] | PropertyIndexedKeyframes | null,
  duration: KeyframeAnimationOptions
}

export interface PresetOptions {
  movementPeriod: number
  iconSize: number
  iterationsCount: number
  iconSpace: number
}

export const getPresetByName = (presetName: string, {iconSize, movementPeriod, iconSpace, iterationsCount}: PresetOptions): AnimationPreset => {
  const boxSize = iconSize * 2 + iconSpace
  return {
    flick: {
      keyframes: [
        {left: '0', offset: 0.0}, // 0%
        {left: '0', offset: 0.5}, // 50%
        {left: `calc(100% - ${boxSize}px)`, offset: 0.50001}, // 50.001%
        {left: `calc(100% - ${boxSize}px)`, offset: 1} // 100%
      ],
      duration: {
        direction: 'alternate',
        duration: movementPeriod,
        iterations: iterationsCount
      }
    },
    smooth: {
      keyframes: [
        {left: '0', right: 'auto'},
        {left: `calc(100% - ${boxSize}px)`, right: 'auto'}
      ],
      duration: {
        direction: 'alternate',
        duration: movementPeriod,
        iterations: iterationsCount,
        fill: 'forwards',
        composite: 'add'
      }
    }
  }[presetName] as AnimationPreset
}

export const getAnimationPreset = (presetName: string, {movementPeriod, iconSize, iconSpace, iterationsCount}: PresetOptions): AnimationPreset => {
  try {
    return getPresetByName(presetName, {iconSize, movementPeriod, iconSpace, iterationsCount})
  } catch (e) {
    throw new Error(`Unexisting animation preset name = ${presetName}`)
  }
}
