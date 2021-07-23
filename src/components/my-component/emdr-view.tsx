import { Component, Prop, h, Listen, Method, EventEmitter, Event, Watch } from '@stencil/core';
import { nanoid } from 'nanoid'

import { Interval } from '../../utils/utils'
import { AnimationPreset, getAnimationPreset } from './animationPresets'

export interface EmdrViewEvent {
  componentKey: string
}
export interface EmdrViewTrigger {
  componentKey?: string
}

@Component({
  tag: 'emdr-view',
  styleUrl: 'emdr-view.css',
  shadow: true,
})
export class EmdrView {
  componentKey: string
  animationPreset: AnimationPreset
  ref: HTMLInputElement
  animatable: Animation
  durationTimer: number
  // timer to next tick
  nextTickTimer: Interval
  // iteration duration + stick time
  movementPeriod: number // ms
  isMovementInProgress = false

  @Prop() iconType: 'source' | 'shape' = 'shape'
  @Prop() iconSize: number = 32
  @Prop() iconSrc: string
  @Prop() iconSpace: number = 4
  @Prop() movementPreset: 'flick' | 'smooth' = 'smooth'
  @Prop() audio: string | null = null
  @Prop() movementDuration: number
  @Prop() iterationsCount: number = 12
  @Prop({mutable: true}) isActive: boolean = false

  @Watch('isActive')
  async setIsActive(newValue) {
    if (newValue === true && this.isMovementInProgress === false) {
      await this.startMovement()
      return
    }
    if (newValue === false && this.isMovementInProgress === true) {
      await this.stopMovement()
      return
    }
  }

  @Watch('iterationsCount') @Watch('movementDuration')
  setIterationsCount() {
    this.calculateMovementPeriod()
    this.setTickTimer()
  }

  @Watch('movementPreset') @Watch('movementDuration') @Watch('iterationsCount') @Watch('iconSize') @Watch('iconSpace') @Watch('isActive')
  setMovementPreset() {
    this.resetAnimationPreset()
  }

  setTickTimer() {
    this.nextTickTimer = Interval(async () => {
      await this.onMovementTickHandler()
    }, this.movementPeriod)
  }

  connectedCallback() {
    if (!this.componentKey) {
      // TODO: not secure, provide with dictionary
      this.componentKey = `emdr-view-${nanoid()}`
    }
    if (!this.movementPeriod) {
      this.calculateMovementPeriod()
    }
    this.setTickTimer()
  }

  async componentDidRender() {
    if (!this.animationPreset) {
      this.animationPreset = getAnimationPreset(this.movementPreset, {
        movementPeriod: this.movementPeriod,
        iterationsCount: this.iterationsCount,
        iconSize: this.iconSize,
        iconSpace: this.iconSpace
      })
    }
  }

  calculateMovementPeriod() {
    this.movementPeriod = this.movementDuration / this.iterationsCount
  }

  resetAnimationPreset() {
    this.animationPreset = null
  }

  initAnimation() {
    const { animationPreset: { keyframes, duration }, ref } = this
    console.log('animationPreset', this.animationPreset)
    this.animatable = ref.animate(keyframes, duration)
  }

  @Event() movementTick: EventEmitter<EmdrViewEvent>
  async onMovementTickHandler() {
    this.animatable.play()
    await this.animatable.ready
    if (this.audio) {
      // play sound
      console.log('play sound')
    }
  }

  @Event() durationEnd: EventEmitter<EmdrViewEvent>
  onDurationEndHandler() {
    console.log('durationEnd')
    this.durationEnd.emit({ componentKey: this.componentKey })
  }

  @Listen('emdr-trigger-start', { target: 'window' })
  async handleEmdrTriggerStart(event: CustomEvent<EmdrViewTrigger>) {
    console.log('emdr-trigger-start')
    const { detail } = event

    if (this.isSameComponent(detail?.componentKey) || !detail.componentKey) {
      await this.startMovement()
    }
  }

  @Listen('emdr-trigger-stop', { target: 'window' })
  async handleEmdrTriggerStop(event: CustomEvent<EmdrViewTrigger>) {
    console.log('emdr-trigger-stop')
    const { detail } = event

    if (this.isSameComponent(detail?.componentKey) || !detail.componentKey) {
      await this.stopMovement()
    }
  }

  @Method()
  async startMovement(): Promise<void> {
    if (!this.animatable) {
      this.initAnimation()
    }
    await this.animatable.ready
    this.isMovementInProgress = true
    if (!this.isActive) this.isActive = true
    const {activeDuration, progress} = this.animatable.effect.getComputedTiming()
    const duration = activeDuration - progress * activeDuration
    this.durationTimer = setTimeout(async () => {
      await this.stopMovement()
      this.onDurationEndHandler()
    }, duration)
    this.nextTickTimer.run()
  }

  @Method()
  async stopMovement(): Promise<void> {
    this.nextTickTimer.stop()
    this.isMovementInProgress = false
    if (this.isActive === true) this.isActive = false
    window.clearTimeout(this.durationTimer)
    this.animatable?.cancel()
  }

  @Method()
  isSameComponent(componentKey: string): Promise<boolean> {
    return Promise.resolve(componentKey === this.componentKey)
  }

  render() {
    const { componentKey, audio, iconSize, iconSpace } = this
    const iconStyle = {
      width: `${iconSize}px`,
      height: `${iconSize}px`
    }

    return (
      <div class={`EmdrView EmdrView-${componentKey}`}>
        <div class='EmdrView-Container'>
          <div class='EmdrView-ObjectContainer' ref={(el) => this.ref = el as HTMLInputElement}>
            <div class='EmdrView-Object' style={iconStyle}></div>
            <div class='EmdrView-Object' style={{...iconStyle, marginLeft: `${iconSpace}px`}}></div>
          </div>
          {audio ? <audio src={audio}></audio> : ''}
        </div>
      </div>
    )
  }
}
