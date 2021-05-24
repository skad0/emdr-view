import { Component, Prop, h, Listen, Method, EventEmitter, Event } from '@stencil/core';
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
  interval: number

  @Prop() iconType: 'source' | 'shape' = 'shape'
  @Prop() iconSize: number = 32
  @Prop() iconSrc: string
  @Prop() iconSpace: number = 4
  @Prop() movementPreset: 'flick' | 'smooth' = 'smooth'
  @Prop() movementDuration: number = 2*60*100 // ms
  @Prop() movementPeriod: number = 1000 // ms
  @Prop() stickTime: number = 1000 // ms
  @Prop() audio: string | null = null

  connectedCallback() {
    if (!this.componentKey) {
      // TODO: not secure, provide with dictionary
      this.componentKey = `emdr-view-${nanoid()}`
    }
  }

  componentDidRender() {
    if (!this.animationPreset) {
      this.animationPreset = getAnimationPreset(this.movementPreset, {
        stickTime: this.stickTime,
        movementPeriod: this.movementPeriod,
        iconSize: this.iconSize,
        iconSpace: this.iconSpace
      })
    }
    if (!this.animatable) {
      this.initAnimation()
    }
  }

  initAnimation() {
    const { animationPreset: { keyframes, duration }, ref } = this

    this.animatable = ref.animate(keyframes, duration)
    this.animatable.pause()
  }

  @Event() movementTick: EventEmitter<EmdrViewEvent>
  onMovementTickHandler() {
    if (!this.interval) {
      this.interval = setInterval(() => {
        this.onMovementTickHandler()
      }, this.movementPeriod + this.stickTime)
    }
    if (this.audio) {
      // play sound
    }
    this.animatable.pause()
    const stickTimer = setTimeout(() => {
      window.clearTimeout(stickTimer)
      this.animatable.play()
    }, this.stickTime)
  }

  @Event() durationEnd: EventEmitter<EmdrViewEvent>
  onDurationEndHandler() {
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
    this.animatable.play()

    this.durationTimer = setTimeout(async () => {
      await this.stopMovement()
    }, this.movementDuration)
    const firstStick = setTimeout(() => {
      window.clearTimeout(firstStick)
      this.onMovementTickHandler()
    }, this.movementPeriod)
  }

  @Method()
  async stopMovement(): Promise<void> {
    window.clearInterval(this.interval)
    this.animatable.cancel()
    window.clearTimeout(this.durationTimer)
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
