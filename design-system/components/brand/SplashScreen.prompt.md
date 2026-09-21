SplashScreen — covers real work with the mascot waking; leaves when the work settles, never on a timer.
```jsx
<SplashScreen until={document.fonts.ready} onDone={() => setReady(true)} />
```
Mount it INSIDE the frame it should fill (it is position: absolute). Pass work that is genuinely
pending. The reveal always completes once started; the hold is what your promise adds.
