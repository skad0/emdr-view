import { Component, Prop, h, Listen, Method, EventEmitter, Event } from '@stencil/core';
import { nanoid } from 'nanoid'

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

  @Prop() iconType: 'source' | 'shape' = 'shape'
  @Prop() iconSrc: string
  @Prop() movementPreset: 'flick' | 'smooth' = 'flick'
  @Prop() movementDuration: number = 60 // seconds
  @Prop() movementPeriod: number = 1000 // ms
  @Prop() audio: string | null = null

  connectedCallback() {
    if (!this.componentKey) {
      this.componentKey = `emdr-view-${nanoid()}`
    }
  }

  @Event() durationEnd: EventEmitter<EmdrViewEvent>
  onDurationEndHandler() {
    this.durationEnd.emit({componentKey: this.componentKey})
  }

  @Listen('emdr-trigger-start', {target: 'window'})
  handleEmdrTriggerStart(event: CustomEvent<EmdrViewTrigger>) {
    const {detail} = event

    if (this.isSameComponent(detail?.componentKey)) {
      this.startMovement()
      return
    }

    this.startMovement()
  }

  @Listen('emdr-trigger-stop', {target: 'window'})
  handleEmdrTriggerStop(event: CustomEvent<EmdrViewTrigger>) {
    const {detail} = event

    if (this.isSameComponent(detail?.componentKey)) {
      this.stopMovement()
      return
    }

    this.stopMovement()
  }

  @Method()
  async startMovement(): Promise<void> {
    console.log('start movement', this.componentKey)
  }

  @Method()
  async stopMovement(): Promise<void> {
    console.log('stop movement', this.componentKey)
  }

  @Method()
  isSameComponent(componentKey: string): Promise<boolean> {
    return Promise.resolve(componentKey === this.componentKey)
  }

  render() {
    return <div>{this.componentKey}</div>;
  }
}
