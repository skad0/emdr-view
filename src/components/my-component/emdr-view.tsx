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
  animatable
  objectRef1!: HTMLInputElement
  objectRef2!: HTMLInputElement
  durationTimer: number
  animatable1
  animatable2

  @Prop() iconType: 'source' | 'shape' = 'shape'
  @Prop() iconSrc: string
  @Prop() movementPreset: 'flick' | 'smooth' = 'flick'
  @Prop() movementDuration: number = 60 // seconds
  @Prop() movementPeriod: number = 1000 // ms
  @Prop() audio: string | null = null

  connectedCallback() {
    if (!this.componentKey) {
      // TODO: not secure, provide with dictionary
      this.componentKey = `emdr-view-${nanoid()}`
    }
    if (!this.animationPreset) {
      this.animationPreset = getAnimationPreset(this.movementPreset, {movementPeriod: this.movementPeriod})
    }
  }

  @Event() durationEnd: EventEmitter<EmdrViewEvent>
  onDurationEndHandler() {
    this.durationEnd.emit({componentKey: this.componentKey})
  }

  @Listen('emdr-trigger-start', {target: 'window'})
  async handleEmdrTriggerStart(event: CustomEvent<EmdrViewTrigger>) {
    console.log('emdr-trigger-start')
    const {detail} = event

    if (this.isSameComponent(detail?.componentKey) || !detail.componentKey) {
      await this.startMovement()
    }
  }

  @Listen('emdr-trigger-stop', {target: 'window'})
  async handleEmdrTriggerStop(event: CustomEvent<EmdrViewTrigger>) {
    console.log('emdr-trigger-stop')
    const {detail} = event

    if (this.isSameComponent(detail?.componentKey) || !detail.componentKey) {
      await this.stopMovement()
    }
  }

  componentDidRender() {
    const {animationPreset: {keyframes, duration}} = this
    this.animatable1 = this.objectRef1.animate(keyframes, duration)
    this.animatable1.pause()
    this.animatable2 = this.objectRef2.animate(keyframes, duration)
    this.animatable2.pause()
    this.animatable = this.ref.animate(keyframes, duration)
    this.animatable.pause()
  }

  @Method()
  async startMovement(): Promise<void> {
    console.log('start movement', this.componentKey)
    this.animatable1.play()
    this.animatable2.play()
    this.animatable.play()
    this.durationTimer = setTimeout(async () => {
      await this.stopMovement()
    }, this.movementDuration)
  }

  @Method()
  async stopMovement(): Promise<void> {
    console.log('stop movement', this.componentKey)
    window.clearTimeout(this.durationTimer)
    this.animatable.cancel()
    this.animatable1.cancel()
    this.animatable2.cancel()
  }

  @Method()
  isSameComponent(componentKey: string): Promise<boolean> {
    return Promise.resolve(componentKey === this.componentKey)
  }

  render() {
    const {componentKey} = this

    return (
      <div class={`EmdrView EmdrView-${componentKey}`}>
        <div class='EmdrView-Container' ref={(el) => this.ref = el as HTMLInputElement}>
          <div class='EmdrView-Object' ref={(el) => this.objectRef1 = el as HTMLInputElement}>1</div>
          <div class='EmdrView-Object' ref={(el) => this.objectRef2 = el as HTMLInputElement}>2</div>
        </div>
      </div>
    )
  }
}
