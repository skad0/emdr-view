export interface AnimationPreset {
  keyframes: Keyframe[] | PropertyIndexedKeyframes | null,
  duration: KeyframeAnimationOptions
}

export interface PresetOptions {
  movementPeriod: number
  stickTime: number
  iconSize: number
  iterationsCount: number
  iconSpace: number
}

export const getPresetByName = (presetName: string, {iconSize, movementPeriod, stickTime, iconSpace, iterationsCount}: PresetOptions): AnimationPreset => {
  const boxSize = iconSize * 2 + iconSpace
  const r = {
    flick: {
      keyframes: [
        {left: '0', right: 'auto', offset: 0}, {left: 'auto', right: '0', offset: 1}
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
        iterationStart: stickTime
      }
    }
  }[presetName] as AnimationPreset
  console.log('getPresetByName', r)
  return r
}

export const getAnimationPreset = (presetName: string, {movementPeriod, stickTime, iconSize, iconSpace, iterationsCount}: PresetOptions): AnimationPreset => {
  try {
    return getPresetByName(presetName, {iconSize, movementPeriod, stickTime, iconSpace, iterationsCount})
  } catch (e) {
    throw new Error(`Unexisting animation preset name = ${presetName}`)
  }
}
