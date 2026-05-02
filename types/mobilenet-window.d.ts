// Ambient type declarations for TF.js and MobileNet loaded via CDN script tags.
// These are attached to window at runtime — typed loosely so we can call the
// essential surface without pulling in the heavy @tensorflow/* npm types.

interface MobileNetPrediction {
  className: string;
  probability: number;
}

interface MobileNetModel {
  classify(
    img: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement,
    topk?: number
  ): Promise<MobileNetPrediction[]>;
}

interface Window {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tf: any;
  mobilenet: {
    load(config?: Record<string, unknown>): Promise<MobileNetModel>;
  };
}
