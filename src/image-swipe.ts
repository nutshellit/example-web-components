import { html, css, LitElement } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import ZingTouch from 'zingtouch';

@customElement('image-swipe')
export class ImageSwipe extends LitElement {
  static styles = css`
    .imageWrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
    }
    .componentImage {
        border-radius: 10px;
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
    }
  `;

  @property({ type: String })
  imageUrl = '';

  @property({ type: Number })
  imageWidth = 200;

  @property({ type: Number })
  imageId = 0;

  @state()
  private swipeProgress: SwipeProgress;

  @state()
  private swipeEventTriggered: boolean;

  @query('.componentImage')
  _componentImage!: HTMLImageElement;

  activeRegion: any = {};

  constructor() {
    super();
    this.swipeProgress = {
      swipeProgressPercent: 0,
      swipeInProgress: false,
      lastPanEvent: new Date(),
      swipedDirection: SwipeDirection.nop
    };
    this.swipeEventTriggered = false;
    // setup a timer to cleanup any invalid swipes
    setInterval(() => this.cleanupSwipe(), 100);
  }

  connectedCallback() {
    super.connectedCallback();
    this.activeRegion = ZingTouch.Region(this);
    this.activeRegion.bind(this, 'pan', this.handleSwipe);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.activeRegion.unbind(this);
  }

  handleSwipe(e: any) {
    let thisHeight = e.target.offsetHeight;
    let distanceFromOrigin = e.detail.data[0].distanceFromOrigin;
    let swipeProgressPercent = distanceFromOrigin / thisHeight;
    let swipeDirection = getSwipeDirection(e.detail.data[0].currentDirection);
    this._componentImage.style.transform = getImageSwipeTransform(this.swipeProgress);
    this.swipeProgress = {
      swipeProgressPercent: swipeProgressPercent,
      swipeInProgress: true,
      lastPanEvent: new Date(),
      swipedDirection: swipeDirection
    };

    if (!this.swipeEventTriggered && shouldTriggerSwipeEvent(this.swipeProgress)) {
      this.swipeEventTriggered = true
      const options = {
        detail: {
          direction: this.swipeProgress.swipedDirection, imageId: this.imageId
        },
        bubbles: true,
        composed: true
      };
      this.dispatchEvent(new CustomEvent('imageSwipe', options));
    }

  }

  cleanupSwipe() {
    if (!this.swipeProgress.swipeInProgress) {
      return;
    }

    let now = new Date();
    let diff = now.getTime() - this.swipeProgress.lastPanEvent.getTime();
    if (diff > 200) {
      this.swipeProgress = {
        swipeProgressPercent: 0,
        swipeInProgress: false,
        lastPanEvent: new Date(),
        swipedDirection: SwipeDirection.nop
      };
      this._componentImage.style.transform = '';
      this.swipeEventTriggered = false;
    }
  }

  render() {
    return html`<div class="imageWrapper">
        <img class='componentImage' src="${this.imageUrl}" width="${this.imageWidth}">
      </div>`;
  }
}

const shouldTriggerSwipeEvent = (swipeProgress: SwipeProgress): boolean => {
  if (swipeProgress.swipedDirection === SwipeDirection.nop) {
    return false;
  }

  if (swipeProgress.swipedDirection === SwipeDirection.up || swipeProgress.swipedDirection === SwipeDirection.down) {
    return swipeProgress.swipeProgressPercent > 0.45
  }

  //handle left and right swipe
  return swipeProgress.swipeProgressPercent > 0.28
}

const getImageSwipeTransform = (swipeProgress: SwipeProgress): string => {
  const factor = Math.ceil(swipeProgress.swipeProgressPercent * 100);
  const movement = factor * 8;
  switch (swipeProgress.swipedDirection) {
    case SwipeDirection.up:
      return `perspective(100px) translate3d(0,${-movement}px,${-factor}px)`;
    case SwipeDirection.down:
      return `perspective(100px) translate3d(0, ${movement}px,${-factor}px)`;
    case SwipeDirection.left:
      return `translateX(${-movement}px)`;
    case SwipeDirection.right:
      return `translateX(${movement}px)`;
    default:
      return '';
  }
}

const getSwipeDirection = (direction: number): SwipeDirection => {
  switch (true) {
    case (direction > 45 && direction < 120):
      return SwipeDirection.up;
    case (direction > 220 && direction < 320):
      return SwipeDirection.down;
    case (direction > 120 && direction < 220):
      return SwipeDirection.left;
    case (direction > 320 || direction < 45):
      return SwipeDirection.right;
    default:
      return SwipeDirection.nop;
  }
}

type SwipeProgress = {
  swipeProgressPercent: number
  swipedDirection: SwipeDirection;
  swipeInProgress: boolean;
  lastPanEvent: Date;
}

enum SwipeDirection {
  up = "swipeup",
  down = "swipedown",
  left = "swipeleft",
  right = "swiperight",
  nop = "nop"
}

declare global {
  interface HTMLElementTagNameMap {
    'image-swipe': ImageSwipe;
  }
}