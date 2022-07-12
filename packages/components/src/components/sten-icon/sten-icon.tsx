import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'sten-icon',
  styleUrl: 'sten-icon.css',
  shadow: true,
})
export class StenIcon {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
