# Rough Draw
Rough Draw creates a sketchy, hand-drawn version of any image using RoughJS and a WASM version of OpenCV.

[Visit Website](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths) to try it. 

## Technique

OpenCV is used to detect shapes (contours) in an image. At first, the image is transformed to grayscale and then a threshold function is applied.

If _double pass_ is selected, an inverse threshold is also applied. Think of a double pass akin to applying a low-pass and a high-pass filter to a signal.

Contours are then extracted from the image followed by extracting the average color inside that contour.

The contour points are then passed to RoughJS which renders a sketchy version of the shape. The shape is then hachure-filled with the shape's average color.

## License
[MIT License](https://github.com/pshihn/rough-draw/blob/master/LICENSE) (c) [Preet Shihn](https://twitter.com/preetster)
