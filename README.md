# Example web components
I am learning about [web components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components) and so far I really like the technology especially the encapsulation and ease of use.

This project is using [Lit library](https://lit.dev/docs/) and was bootstrapped using 
``` 
npm create vite@latest my-app --template lit-ts
```

## image-swiper
In a recent project I had a requirement to handle a four directional swipe of a bunch of movie posters, left/right to move through the movies and up and down to action selection or rejection.

I used [zingtouch](https://zingchart.github.io/zingtouch/) to capture the swipes and although I couldn't find a typescript declaration file for the library the good thing is that the ugly untyped bits are encapsulated in the image-swiper component.

The component dispatches a custom event called 'imageSwipe' and includes the swipe direction (swipeup, swipedown, swipeleft, swiperight) and the image id.
![alt text](readme1.png)

You can view an example on the index.html page. This uses [Shoelace carousel](https://shoelace.style/components/carousel) to wrap the image-swiper items and some inline js handles the custom events.

``` 
<sl-carousel mouse-dragging="true" style="--aspect-ratio: 780/1171">
        <sl-carousel-item>
          <image-swipe
            id="imageSwipe1"
            imageId="123"
            imageWidth="280"
            imageUrl="https://image.tmdb.org/t/p/original/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg"
          >
          </image-swipe>
        </sl-carousel-item>
        <sl-carousel-item>
          <image-swipe
            id="imageSwipe2"
            imageId="456"
            imageWidth="280"
            imageUrl="https://media.themoviedb.org/t/p/w440_and_h660_face/ntYinolBWGkgmoiLPimtr84xBs1.jpg"
          >
          </image-swipe>
        </sl-carousel-item>
        <sl-carousel-item>
          <image-swipe
            id="imageSwipe3"
            imageId="789"
            imageWidth="280"
            imageUrl="https://media.themoviedb.org/t/p/w440_and_h660_face/mJQHyxT8NxzIuHzWfY4hqDsbUhY.jpg"
          >
          </image-swipe>
        </sl-carousel-item>
      </sl-carousel>
```
