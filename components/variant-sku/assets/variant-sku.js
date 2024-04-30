import { EVENTS, subscribe } from '@archetype-themes/utils/pubsub'

class VariantSku extends HTMLElement {
  connectedCallback() {
    this.variantChangeUnsubscriber = subscribe(EVENTS.variantChange, this.handleVariantChange.bind(this))
  }

  disconnectedCallback() {
    this.variantChangeUnsubscriber?.()
  }

  handleVariantChange({ detail }) {
    const { html, blockId, variant } = detail

    if (!variant) {
      this.textContent = ''
      return
    }

    const skuSource = html.querySelector(`[data-block-id="${blockId}"] variant-sku`)

    if (skuSource) {
      this.textContent = skuSource.textContent
    }
  }
}

customElements.define('variant-sku', VariantSku)
