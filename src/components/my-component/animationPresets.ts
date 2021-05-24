export interface AnimationPreset {
  keyframes: Keyframe[] | PropertyIndexedKeyframes | null,
  duration: KeyframeAnimationOptions
}

export interface PresetOptions {
  movementPeriod: number
  stickTime: number
  iconSize: number
  iconSpace: number
}

export const getPresetByName = (presetName: string, {iconSize, movementPeriod, iconSpace}: PresetOptions): AnimationPreset => {
  const boxSize = iconSize * 2 + iconSpace
  return {
    flick: {
      keyframes: [
        {left: '0', right: 'auto', offset: 0}, {left: 'auto', right: '0', offset: 1}
      ],
      duration: {
        direction: 'alternate',
        duration: movementPeriod,
        iterations: Infinity
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
        iterations: Infinity
      }
    }
  }[presetName] as AnimationPreset
}

export const getAnimationPreset = (presetName: string, {movementPeriod, stickTime, iconSize, iconSpace}: PresetOptions): AnimationPreset => {
  try {
    return getPresetByName(presetName, {iconSize, movementPeriod, stickTime, iconSpace})
  } catch (e) {
    throw new Error(`Unexisting animation preset name = ${presetName}`)
  }
}
