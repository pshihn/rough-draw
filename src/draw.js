export async function draw(imageSource, shapeCount, thresholdValue, increaseContrast, inverseThreshold) {
  shapeCount = shapeCount || 15;
  thresholdValue = thresholdValue || 110;

  // Load image
  const src = cv.imread(imageSource);

  // process image for contouring
  const temp = new cv.Mat();
  cv.cvtColor(src, temp, cv.COLOR_RGBA2GRAY);

  // enhance contrast
  if (increaseContrast) {
    const tileGridSize = new cv.Size(8, 8);
    const clahe = new cv.CLAHE(40, tileGridSize);
    clahe.apply(temp, temp);
    clahe.delete();
  }

  // Apply thresholding
  cv.threshold(temp, temp, thresholdValue, 255, inverseThreshold ? cv.THRESH_BINARY_INV : cv.THRESH_BINARY);

  // Create contours
  const contours = new cv.MatVector();
  const hierarchy = new cv.Mat();
  cv.findContours(temp, contours, hierarchy, cv.RETR_TREE, cv.CHAIN_APPROX_SIMPLE);

  // Select the contours to draw
  // sort by area
  const areas = [];
  for (let i = 0; i < contours.size(); ++i) {
    const cnt = contours.get(i);
    const area = cv.contourArea(cnt, false);
    if (area) {
      // Extract mean inside the contour
      const mask = cv.Mat.zeros(temp.rows, temp.cols, cv.CV_8UC1);
      cv.drawContours(mask, contours, i, new cv.Scalar(255, 255, 255), -1);
      const color = cv.mean(src, mask);
      mask.delete();
      areas.push({ index: i, area, color });
    }
    cnt.delete();
  }
  areas.sort((a, b) => {
    return b.area - a.area;
  });
  if (areas.length > shapeCount) {
    areas.splice(shapeCount);
  }
  areas.sort((a, b) => {
    return a.index - b.index;
  });

  // Extract paths
  const svgPaths = [];
  for (const d of areas) {
    let pathData = '';
    const cnt = contours.get(d.index);
    const channels = cnt.channels() || 0;
    for (let r = 0; r < cnt.rows; r++) {
      for (let c = 0; c < cnt.cols; c++) {
        if (!pathData.length) {
          pathData = `M${cnt.intAt(r, c * channels)},${cnt.intAt(r, c * channels + 1)}`;
        } else {
          pathData = `${pathData} L${cnt.intAt(r, c * channels)},${cnt.intAt(r, c * channels + 1)}`;
        }
      }
    }
    cnt.delete();
    pathData = `${pathData} Z`;
    svgPaths.push({
      d: pathData,
      color: `rgb(${Math.floor(d.color[0])}, ${Math.floor(d.color[1])}, ${Math.floor(d.color[2])})`
    });
  }
  const imageSize = [temp.size().width, temp.size().height];

  // Release memory
  contours.delete();
  hierarchy.delete();
  temp.delete();
  src.delete();

  return {
    size: imageSize,
    paths: svgPaths
  };
}