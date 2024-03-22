import { subscribe } from '@archetype-themes/scripts/utils/pubsub';
import { PUB_SUB_EVENTS } from 'components/block-variant-picker';

class BlockBuyButtons extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.variantChangeUnsubscriber = subscribe(PUB_SUB_EVENTS.variantChange, (event) => {
      const { html, variant } = event.data;
      if (!variant) {
        this.setUnavailable();
        return;
      }
      this.updateVariantInput(variant);
      this.renderProductInfo(html);
    });
  }

  disconnectedCallback() {
    this.variantChangeUnsubscriber?.();
  }

  renderProductInfo(html) {
    const addButtonUpdated = html.getElementById(`ProductSubmitButton-${this.dataset.sectionId}`);
    this.toggleAddButton(
      addButtonUpdated ? addButtonUpdated.hasAttribute('disabled') : true,
      this.getLocales().soldOut
    );
  }

  getLocales() {
    this.locales = this.locales || JSON.parse(this.querySelector('[type="application/json"]').textContent);
    return this.locales;
  }

  toggleAddButton(disable = true, text, modifyClass = true) {
    const productForm = document.getElementById(`product-form-${this.dataset.sectionId}`);
    if (!productForm) return;
    const addButton = productForm.querySelector('[name="add"]');
    const addButtonText = productForm.querySelector('[name="add"] > span');
    if (!addButton) return;

    if (disable) {
      addButton.setAttribute('disabled', 'disabled');
      if (text) addButtonText.textContent = text;
    } else {
      addButton.removeAttribute('disabled');
      addButtonText.textContent = this.getLocales().addToCart;
    }

    if (!modifyClass) return;
  }

  setUnavailable() {
    const button = document.getElementById(`product-form-${this.dataset.sectionId}`);
    const addButton = button.querySelector('[name="add"]');
    const addButtonText = button.querySelector('[name="add"] > span');

    if (!addButton) return;
    addButtonText.textContent = this.getLocales().unavailable;
  }

  updateVariantInput(variant) {
    const productForms = document.querySelectorAll(
      `#product-form-${this.dataset.sectionId}, #product-form-installment-${this.sectionId}`
    );
    productForms.forEach((productForm) => {
      const input = productForm.querySelector('input[name="id"]');
      input.value = variant.id;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }
}

customElements.define('block-buy-buttons', BlockBuyButtons);