import { GradientStop } from "./models/gradient";

export const gradientTo = {
  image: gradientToImage,
  svg: gradientToSVG,
};

const baseDate = new Date(2025, 0, 1).valueOf();

function gradientToImage(
  stops: GradientStop[],
  angleDegrees: number = 0,
  dimensions: { width: number; height: number } = { width: 1920, height: 1080 },
  name: string = ""
) {
  name = encodeURI(name.trim());
  const canvas = document.createElement("canvas");
  canvas.width = dimensions.width;
  canvas.height = dimensions.height;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return;
  }

  const { x1, y1, x2, y2 } = gradientOrientation(canvas.width, canvas.height, angleDegrees);

  const gradient = ctx.createLinearGradient(x1, y1, x2, y2);

  for (let i = 0; i < stops.length; i++) {
    const stop = stops[i]!;
    gradient.addColorStop(stop.offset / 100, stop.color);
  }

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.rect(0, 0, canvas.width, canvas.height);
  ctx.fill();

  const createEl = document.createElement("a");
  canvas.toBlob(
    (blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        createEl.href = url;
        createEl.download = `colorina-gradient-${name}${name.length > 0 ? "-" : ""}${
          new Date().valueOf() - baseDate
        }.png`;
        createEl.click();
        URL.revokeObjectURL(url);
      }
    },
    "image/png",
    1
  );
}

function gradientToSVG(stops: GradientStop[], angleDegrees: number = 0, name: string = "") {
  name = encodeURI(name.trim());

  let fileContent = toSVG(stops, angleDegrees);

  const file = new Blob([fileContent], { type: "image/svg+xml" });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(file);
  link.download = `colorina-gradient-${name}${name.length > 0 ? "-" : ""}${new Date().valueOf() - baseDate}.svg`;
  link.click();
  link.remove();
}
function toSVG(stops: GradientStop[], angleDegrees: number = 0) {
  const width = 1920;
  const height = 1080;

  const { xGrad, yGrad, gradWidth, gradHeight } = gradientOrientation2d(width, height, angleDegrees - 90);
  console.log("xGrad", xGrad, "yGrad", yGrad);
  console.log("xGrad", gradHeight, "yGrad", gradWidth);

  const pasos = stops
    .map((p) => `        <stop offset="${(p.offset / 100).toFixed(3)}" style="stop-color:${p.color};stop-opacity:1"/>`)
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg width="100%" height="100%" viewBox="0 0 ${width} ${height}" version="1.1" xmlns="http://www.w3.org/2000/svg"
     xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/"
      style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">

    <rect x="${(width - gradHeight) / 2}" y="${
    (height - gradWidth) / 2
  }" width="${gradHeight}" height="${gradWidth}"  style="fill:url(#_Linear1);transform-origin: center center; transform: rotate(${
    angleDegrees - 180
  }deg);"/>
    <rect x="0" y="0" width="${width}" height="${height}" stroke="black" fill="none" />

  <defs>
        <linearGradient id="_Linear1" x1="0" y1="${(height - gradWidth) / 2}" x2="0" y2="${
    height - (height - gradWidth) / 2
  }" gradientUnits="userSpaceOnUse" >
${pasos}
        </linearGradient>
    </defs>
</svg>`;
}

function gradientOrientation2d(width: number, height: number, angleDegrees: number) {
  const halfHypotenusa = Math.sqrt(((width / 2) * width) / 2 + ((height / 2) * height) / 2);
  const hypotenusaAngle = Math.atan2(height / 2, width / 2);

  angleDegrees = Math.abs(angleDegrees % 360);
  console.log("angleDegrees", angleDegrees);

  const currRad = (angleDegrees * Math.PI * 2) / 360;
  const angle = currRad + hypotenusaAngle;
  const flipAngle = currRad - hypotenusaAngle;
  const x = Math.abs(Math.cos(angle) * halfHypotenusa);
  const y = Math.abs(Math.sin(angle) * halfHypotenusa);
  const flipX = Math.abs(Math.cos(flipAngle) * halfHypotenusa);
  const flipY = Math.abs(Math.sin(flipAngle) * halfHypotenusa);

  const gradWidth = Math.max(x, flipX) * 2;
  const gradHeight = Math.max(y, flipY) * 2;
  const gradX = (width - gradWidth) / 2;
  const gradY = (height - gradHeight) / 2;

  const newWidth = gradWidth / 2;
  const newCoseno = Math.cos(currRad) * newWidth;
  const newSeno = Math.sin(currRad) * newWidth;

  return {
    x: gradX,
    y: gradY,
    gradWidth,
    gradHeight,
    xGrad: Math.round(Math.abs(newCoseno)),
    yGrad: Math.round(Math.abs(newSeno)),
  };
}

function gradientOrientation(width: number, height: number, angleDegrees: number) {
  const calcSizeX = width / 2;
  const calcSizeY = height / 2;

  const seno = Math.sin(((angleDegrees + 90) * Math.PI * 2) / 360);
  const coseno = Math.cos(((angleDegrees + 90) * Math.PI * 2) / 360);

  const hypotenusa = Math.sqrt(calcSizeX * calcSizeX + calcSizeY * calcSizeY);
  let deltaX = hypotenusa * coseno;
  let maxX = Math.abs(calcSizeY * seno);

  let deltaY = hypotenusa * seno;
  let maxY = Math.abs(calcSizeX * coseno);

  if (deltaY < -calcSizeY) {
    deltaY = Math.max(deltaY, -calcSizeY - maxY);
  } else if (deltaY > calcSizeY) {
    deltaY = Math.min(deltaY, calcSizeY + maxY);
  }

  if (deltaX < -calcSizeX) {
    deltaX = Math.max(deltaX, -calcSizeX - maxX);
  } else if (deltaX > calcSizeX) {
    deltaX = Math.min(deltaX, calcSizeX + maxX);
  }
  const realHypotenusa = Math.sqrt(deltaX * deltaX + deltaY * deltaY) * 2;

  return {
    x1: calcSizeX + deltaX,
    y1: calcSizeY + deltaY,
    x2: calcSizeX - deltaX,
    y2: calcSizeY - deltaY,
    hypotenusa: realHypotenusa,
  };
}
