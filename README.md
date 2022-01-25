# msc-web-push

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/msc-web-push) [![DeepScan grade](https://deepscan.io/api/teams/16372/projects/19990/branches/529884/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=16372&pid=19990&bid=529884)

Push messaging provides a simple and effective way to re-engage with your users. Once users subscribed, vendor could push messaging for them. &lt;msc-web-push /> provides a simple usage for developers. It will handle subscription process and UI mutations.

![<msc-web-push />](https://blog.lalacube.com/mei/img/preview/msc-web-push.png)

## Push messageing test

Developers could use the following ways to test push messageing after users subscribed.

- Chrome DevTools

Turn on DevTools and switch panel to Application. Input test data in `Push` input field then press `Push` button.

![Chrome DevTools](https://blog.lalacube.com/mei/img/web_push/devtools.png)

- Web Push Code Lab

Visit [Web Push Code Lab](https://web-push-codelab.glitch.me/). Developers could type `Subscription` & `Message` in <textarea /> then press `SEND PUSH MESSAGE` button.

## Basic Usage

&lt;msc-web-push /> is a web component. All we need to do is put the required script into your HTML document. Then follow &lt;msc-web-push />'s html structure and everything will be all set.

- Required Script

```html
<script
  type="module"
  src="https://your-domain/wc-msc-web-push.js">        
</script>
```

- Structure

Put clickable content inside &lt;msc-web-push /> as its child and set attribute "`slot`" as "`msc-web-push-trigger`". It will have subscribe / unsubscribe feature when user tapped.

```html
<msc-web-push>
  <script type="application/json">
    {
      "service-worker-path": "your-service-worker-path.js",
      "public-key": "your-public-key"
    }
  </script>
  <!-- Place any clickable element. -->
  <a slot="msc-web-push-trigger" ...>
    ...
  </a>
</msc-web-push>
```

Set config through attribute is acceptable. Above structure could change as following code.

```html
<msc-web-push
  service-worker-path="your-service-worker-path.js"
  public-key="your-public-key"
>
  <!-- Place any clickable element. -->
  <a slot="msc-web-push-trigger" ...>
    ...
  </a>
</msc-web-push>
```

Otherwise, developers could also choose remoteconfig to fetch config for &lt;msc-web-push />.

```html
<msc-web-push remoteconfig="https://your-domain/api-path">
  <!-- Place any clickable element. -->
  <a slot="msc-web-push-trigger" ...>
    ...
  </a>
</msc-web-push>
```

## JavaScript Instantiation

&lt;msc-web-push /> could also use JavaScript to create DOM element. Here comes some examples.

```html
<script type="module">
import { MscWebPush } from 'https://your-domain/wc-msc-web-push.js';

// use DOM api
const nodeA = document.createElement('msc-web-push');
document.body.appendChild(nodeA);
nodeA.service-worker-path = 'your-service-worker-path.js';
nodeA.public-key = 'your-public-key';
nodeA.appendChild(
  document.querySelector(".your-clickable-node")
);

// new instance with Class
const nodeB = new MscWebPush();
document.body.appendChild(nodeB);
nodeB.service-worker-path = 'your-service-worker-path.js';
nodeB.public-key = 'your-public-key';
nodeB.appendChild(
  document.querySelector(".your-conclickabletent-node")
);
  
// new instance with Class & default config
const config = {
  service-worker-path="your-service-worker-path.js"
  public-key="your-public-key"
};
const nodeC = new MscWebPush(config);
document.body.appendChild(nodeC);
nodeC.appendChild(
  document.querySelector(".your-conclickabletent-node")
);
</script>
```

## Style Customization

&lt;msc-web-push /> will add attribute "`subscribed`" when user subscribed. That means developers could use the follwoing selector to style the clickable element.

```html
<style>
msc-web-push[subscribed] [slot=msc-web-push-trigger] {
  ...
  ...
  ...
}
</style>
```

## Attributes

&lt;msc-web-push /> supports some attributes to let it become more convenience & useful.

- **service-worker-path**

Set service-worker-path for &lt;msc-web-push />.

```html
<msc-web-push
  service-worker-path="your-service-worker-path.js"
>
  <!-- clickable element -->
  <a slot="msc-web-push-trigger" ...>
    ...
  </a>
</msc-web-push>
```

- **public-key**

Set public-key for &lt;msc-web-push />.

```html
<msc-web-push
  public-key="your-public-key"
>
  <!-- clickable element -->
  <a slot="msc-web-push-trigger" ...>
    ...
  </a>
</msc-web-push>
```


## Properties

| Property Name | Type | Description |
| ----------- | ----------- | ----------- |
| service-worker-path | String | Getter / Setter for service-worker-path. |
| public-key | Boolean | Getter / Setter for public-key. |
| subscribed | Boolean | Getter for subscription status. |

## Method

| Method Signature | Description |
| ----------- | ----------- |
| getSubscription | Get current subscription data. |

## Event

| Event Signature | Description |
| ----------- | ----------- |
| msc-web-push-subscription-change | Fired when <msc-web-push /> subscription changed. |

## Reference
- [&lt;msc-web-push /&gt;](https://blog.lalacube.com/mei/webComponent_msc-web-push.html)
