import { _wcl } from './common-lib.js';
import { _wccss } from './common-css.js';

/*
 * Reference:
 * --------------------------------
 * Adding Push Notifications to a Web App: https://developers.google.com/web/fundamentals/codelabs/push-notifications
 * Web Push CodeLab: https://web-push-codelab.glitch.me/
 * macOS setting: https://stackoverflow.com/questions/36383154/web-push-notifications-not-showing-since-chrome-switched-to-osx-notifications
 * PushEvent: https://developer.mozilla.org/en-US/docs/Web/API/PushEvent
 * showNotification (MDN): https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/showNotification
 */

const defaults = {
  'service-worker-path': '',
  'public-key': ''
};
const custumEvents = {
  subscriptionChange: 'msc-web-push-subscription-change'
};

const template = document.createElement('template');
template.innerHTML = `
<style>
${_wccss}

:host{position:relative;inline-size:fit-content;display:block;}
</style>

<slot name="msc-web-push-trigger">
</slot>
`;

export class MscWebPush extends HTMLElement {
  #data;
  #nodes;
  #config;

  constructor(config) {
    super();

    // template
    this.attachShadow({ mode: 'open', delegatesFocus: true });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    // data
    this.#data = {
      controller: '',
      disableTrigger: false,
      registration: '',
      subscription: null
    };

    // nodes
    this.#nodes = {
      styleSheet: this.shadowRoot.querySelector('style'),
      slot: this.shadowRoot.querySelector('slot')
    };

    // config
    this.#config = {
      ...defaults,
      ...config // new MscWebPush(config)
    };

    // evts
    this._onClick = this._onClick.bind(this);
  }

  async connectedCallback() {
   const { config, error } = await _wcl.getWCConfig(this);

    if (error) {
      console.warn(`${_wcl.classToTagName(this.constructor.name)}: ${error}`);
      this.remove();
      return;
    } else {
      this.#config = {
        ...this.#config,
        ...config
      };
    }

    // upgradeProperty
    Object.keys(defaults).forEach((key) => this._upgradeProperty(key));

    // main key check
    if (!this['service-worker-path'] || !this['public-key']) {
      console.warn(`${_wcl.classToTagName(this.constructor.name)}: "service-worker-path" or "public-key" missing.`);
      this.remove();
      return;
    }

    // register
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.warn(`${_wcl.classToTagName(this.constructor.name)}: browser doesn't support "serviceWorker" or "PushManager".`);
      this.remove();
      return;
    }

    // evts
    this.#data.controller = new AbortController();
    const signal = this.#data.controller.signal;
    this.#nodes.slot.addEventListener('click', this._onClick, { signal });
  }

  disconnectedCallback() {
    if (this.#data?.controller) {
      this.#data.controller.abort();
    }
  }

  _format(attrName, oldValue, newValue) {
    const hasValue = newValue !== null;

    if (!hasValue) {
      this.#config[attrName] = defaults[attrName];
    } else {
      switch (attrName) {
        case 'service-worker-path':
        case 'public-key':
          this.#config[attrName] = newValue;
          break;
      }
    }
  }

  async attributeChangedCallback(attrName, oldValue, newValue) {
    if (!MscWebPush.observedAttributes.includes(attrName)) {
      return;
    }

    this._format(attrName, oldValue, newValue);

    switch (attrName) {
      case 'service-worker-path': {
        try {
          const registration = await navigator.serviceWorker.register(this['service-worker-path']);
          const subscription = await registration.pushManager.getSubscription();
          
          this.#data.registration = registration;
          this.#data.subscription = subscription;
          this._updateUI();
        } catch(err) {
          console.warn(`${_wcl.classToTagName(this.constructor.name)}: ${err.message}`);
        }
        break;
      }
      case 'public-key':
        break;
    }
  }

  static get observedAttributes() {
    return Object.keys(defaults); // MscWebPush.observedAttributes
  }

  _upgradeProperty(prop) {
    let value;

    if (MscWebPush.observedAttributes.includes(prop)) {
      if (Object.prototype.hasOwnProperty.call(this, prop)) {
        value = this[prop];
        delete this[prop];
      } else {
        if (this.hasAttribute(prop)) {
          value = this.getAttribute(prop);
        } else {
          value = this.#config[prop];
        }
      }

      this[prop] = value;
    }
  }

  set ['service-worker-path'](value) {
    if (value) {
      this.setAttribute('service-worker-path', value);
    } else {
      this.removeAttribute('service-worker-path');
    }
  }

  get ['service-worker-path']() {
    return this.#config['service-worker-path'];
  }

  set ['public-key'](value) {
    if (value) {
      this.setAttribute('public-key', value);
    } else {
      this.removeAttribute('public-key');
    }
  }

  get ['public-key']() {
    return this.#config['public-key'];
  }

  get subscribed() {
    return !(this.#data.subscription === null);
  }

  getSubscription() {
    return this.#data.subscription;
  }

  _fireEvent(evtName, detail) {
    this.dispatchEvent(new CustomEvent(evtName,
      {
        bubbles: true,
        composed: true,
        ...(detail && { detail })
      }
    ));
  }

  _urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  _updateUI() {
    this.toggleAttribute('subscribed', this.subscribed);
  }

  async _onClick(evt) {
    const { registration, subscription } = this.#data;

    if (this.#data.disableTrigger) {
      return;
    }

    this.#data.disableTrigger = true;

    evt.preventDefault();

    if (this.subscribed) {
      try {
        await subscription.unsubscribe();
      } catch(err) {
        console.warn(`${_wcl.classToTagName(this.constructor.name)}: ${err.message}`);
      }
    } else {
      try {
        await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: this._urlB64ToUint8Array(this['public-key'])
        });
      } catch(err) {
        console.warn(`${_wcl.classToTagName(this.constructor.name)}: ${err.message}`);
      }
    }

    this.#data.subscription = await this.#data.registration.pushManager.getSubscription();
    this._updateUI();

    this.#data.disableTrigger = false;

    // custom event
    const detail = {
      baseEvent: evt, // original click event
      subscription: this.getSubscription()
    };

    this._fireEvent(custumEvents.subscriptionChange, detail);
  }
}

// define web component
const S = _wcl.supports();
const T = _wcl.classToTagName('MscWebPush');
if (S.customElements && S.shadowDOM && S.template && !window.customElements.get(T)) {
  window.customElements.define(_wcl.classToTagName('MscWebPush'), MscWebPush);
}