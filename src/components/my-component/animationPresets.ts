export interface AnimationPreset {
  keyframes: Keyframe[] | PropertyIndexedKeyframes | null,
  duration: KeyframeAnimationOptions
}

export const ANIMATION_PRESETS: Record<string, AnimationPreset> = {
  flick: {
    keyframes: [{'flex-direction': 'row-revert'}, {'flex-direction': 'row'}],
    duration: {
      direction: 'alternate'
    }
  },
  smooth: {
    keyframes: [{'flex-direction': 'row-revert'}, {'flex-direction': 'row'}],
    duration: {
      direction: 'alternate',
      easing: 'ease-in-out'
    }
  }
}

export const getAnimationPreset = (presetName: string, {movementPeriod}: {movementPeriod: number}): AnimationPreset => {
  try {
    const preset = ANIMATION_PRESETS[presetName]

    return {
      ...preset,
      ...{
        duration: {
          ...preset.duration,
          delay: movementPeriod
        }
      }
    }
  } catch (e) {
    throw new Error(`Unexisting animation preset name = ${presetName}`)
  }
}
