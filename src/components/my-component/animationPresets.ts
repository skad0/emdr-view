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
        {left: '0', right: 'auto', offset: 0}, {left: `calc(100% - ${boxSize}px)`, right: '0', offset: 1}
      ],
      duration: {
        direction: 'alternate',
        duration: movementPeriod,
        iterations: iterationsCount,
        //fill: 'forwards',
        easing: `steps(1)`
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
  console.log('getPresetByName', r, presetName)
  return r
}

export const getAnimationPreset = (presetName: string, {movementPeriod, stickTime, iconSize, iconSpace, iterationsCount}: PresetOptions): AnimationPreset => {
  try {
    return getPresetByName(presetName, {iconSize, movementPeriod, stickTime, iconSpace, iterationsCount})
  } catch (e) {
    throw new Error(`Unexisting animation preset name = ${presetName}`)
  }
}
