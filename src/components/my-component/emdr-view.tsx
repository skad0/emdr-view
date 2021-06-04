import { Component, Prop, h, Listen, Method, EventEmitter, Event, Watch } from '@stencil/core';
import { nanoid } from 'nanoid'

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
  nextTickTimer: number
  // timer for stick after iteration end
  stickEndTimer: number
  // iteration duration + stick time
  movementPeriod: number // ms
  // iteration duration without stick time
  pureMovementPeriod: number // ms
  isMovementInProgress = false

  @Prop() iconType: 'source' | 'shape' = 'shape'
  @Prop() iconSize: number = 32
  @Prop() iconSrc: string
  @Prop() iconSpace: number = 4
  @Prop() movementPreset: 'flick' | 'smooth' = 'smooth'
  @Prop() stickTime: number = 1000 // ms
  @Prop() audio: string | null = null
  @Prop() movementDuration: number = 2*60*100 + 2 * this.stickTime // ms
  @Prop() iterationsCount: number = 12

  @Watch('iterationsCount')
  setIterationsCount() {
    this.calculateMovementPeriod()
  }

  connectedCallback() {
    if (!this.componentKey) {
      // TODO: not secure, provide with dictionary
      this.componentKey = `emdr-view-${nanoid()}`
    }
    if (!this.movementPeriod) {
      this.calculateMovementPeriod()
    }
  }

  componentDidRender() {
    if (!this.animationPreset) {
      this.animationPreset = getAnimationPreset(this.movementPreset, {
        stickTime: this.stickTime,
        movementPeriod: this.movementPeriod,
        iterationsCount: this.iterationsCount,
        iconSize: this.iconSize,
        iconSpace: this.iconSpace
      })
    }
    if (!this.animatable) {
      this.initAnimation()
    }
  }

  calculateMovementPeriod() {
    this.movementPeriod = this.movementDuration / this.iterationsCount
    console.log('calculateMovementPeriod', this.movementPeriod, this.movementDuration, this.iterationsCount, this.stickTime)
  }

  initAnimation() {
    const { animationPreset: { keyframes, duration }, ref } = this

    this.animatable = ref.animate(keyframes, duration)
    this.animatable.pause()
  }

  @Event() movementTick: EventEmitter<EmdrViewEvent>
  onMovementTickHandler() {
    if (!this.isMovementInProgress) {
      return
    }
    console.log('onMovementTickHandler')
    this.animatable.pause()
    this.stickEndTimer = setTimeout(() => {
      this.nextTickTimer = setTimeout(() => this.onMovementTickHandler(), this.movementPeriod)
      this.animatable.play()
    }, this.stickTime)
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
    console.log('startMovement')
    this.isMovementInProgress = true
    this.animatable.play()

    this.durationTimer = setTimeout(async () => {
      await this.stopMovement()
    }, this.movementDuration + 2 * this.stickTime)
    const firstStick = setTimeout(() => {
      window.clearTimeout(firstStick)
      this.onMovementTickHandler()
    }, this.movementPeriod)
  }

  @Method()
  async stopMovement(): Promise<void> {
    console.log('stopMovement')
    window.clearTimeout(this.durationTimer)
    window.clearTimeout(this.nextTickTimer)
    window.clearTimeout(this.stickEndTimer)
    this.isMovementInProgress = false
    this.animatable.cancel()
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
