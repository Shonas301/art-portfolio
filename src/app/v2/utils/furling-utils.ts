// shared animation utilities for furling page effects

export interface FurlingConfig {
  segmentCount: number
  maxFurlDepth: number
  tensionPhase: number // 0-1, what portion of animation is tension vs release
  peakPosition: {
    forward: number // 0-1, where the curve peaks for forward flip
    backward: number // 0-1, where the curve peaks for backward flip
  }
  flipStartDelay: number // 0-1, when flip rotation begins
  centerLeadAmount: number // how much center segments lead edges (0-1)
  maxTiltAngle: number // degrees
}

// default config for single page flip
export const SINGLE_PAGE_CONFIG: FurlingConfig = {
  segmentCount: 12,
  maxFurlDepth: 120,
  tensionPhase: 0.375, // TENSION_DURATION / TOTAL_DURATION = 0.3 / 0.8
  peakPosition: { forward: 0.65, backward: 0.35 },
  flipStartDelay: 0.2,
  centerLeadAmount: 0.12,
  maxTiltAngle: 8,
}

// config for multi-page riffle (slightly reduced for performance)
export const RIFFLE_CONFIG: FurlingConfig = {
  segmentCount: 10,
  maxFurlDepth: 90,
  tensionPhase: 0.35,
  peakPosition: { forward: 0.6, backward: 0.4 },
  flipStartDelay: 0.15,
  centerLeadAmount: 0.1,
  maxTiltAngle: 6,
}

// easing function for smooth animation
export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

// calculate how much each segment bows toward the viewer (Z depth)
// creates a horizontal curve with the middle bulging out most
export function getSegmentFurlDepth(
  segmentIndex: number,
  direction: 'forward' | 'backward',
  progress: number,
  config: FurlingConfig
): number {
  const normalizedIndex = segmentIndex / (config.segmentCount - 1)

  // get peak position based on direction
  const peakPosition = direction === 'forward'
    ? config.peakPosition.forward
    : config.peakPosition.backward

  // bell curve centered at peak position - this creates the "bow" shape
  const distanceFromPeak = Math.abs(normalizedIndex - peakPosition)
  const curveFactor = Math.exp(-Math.pow(distanceFromPeak * 2.5, 2)) // gaussian curve

  // tension builds then releases
  let furlIntensity: number

  if (progress < config.tensionPhase) {
    // building tension - furl increases
    furlIntensity = Math.sin((progress / config.tensionPhase) * Math.PI * 0.5)
  } else {
    // releasing - furl decreases as page flips
    const releaseProgress = (progress - config.tensionPhase) / (1 - config.tensionPhase)
    furlIntensity = Math.cos(releaseProgress * Math.PI * 0.5)
  }

  return config.maxFurlDepth * curveFactor * furlIntensity
}

// calculate the Y rotation (the main flip) for each segment
// middle segments lead, edges follow for wave-like unfurling
export function getSegmentFlipAngle(
  segmentIndex: number,
  direction: 'forward' | 'backward',
  progress: number,
  config: FurlingConfig
): number {
  const normalizedIndex = segmentIndex / (config.segmentCount - 1)

  // flip starts after tension builds a bit
  const flipProgress = Math.max(0, (progress - config.flipStartDelay) / (1 - config.flipStartDelay))

  // for middle-out: segments near center start first, edges follow
  const centerDistance = Math.abs(normalizedIndex - 0.5) * 2 // 0 at center, 1 at edges
  const segmentDelay = centerDistance * config.centerLeadAmount

  const adjustedProgress = Math.max(0, Math.min(1, (flipProgress - segmentDelay) / (1 - segmentDelay)))

  // ease the flip
  const eased = easeInOutCubic(adjustedProgress)

  // full rotation is 180 degrees
  const targetAngle = direction === 'forward' ? -180 : 180

  return targetAngle * eased
}

// small tilt to enhance the curve appearance
export function getSegmentTilt(
  segmentIndex: number,
  direction: 'forward' | 'backward',
  furlDepth: number,
  config: FurlingConfig
): number {
  const normalizedIndex = segmentIndex / (config.segmentCount - 1)
  const peakPosition = direction === 'forward'
    ? config.peakPosition.forward
    : config.peakPosition.backward

  // tilt based on position relative to the curve peak
  // segments before peak tilt one way, after peak tilt the other
  const tiltDirection = normalizedIndex < peakPosition ? 1 : -1

  // tilt proportional to furl depth for natural curve appearance
  const tiltAmount = (furlDepth / config.maxFurlDepth) * config.maxTiltAngle * tiltDirection

  return tiltAmount
}

// calculate all segment transforms at once
export interface SegmentTransform {
  index: number
  left: string
  width: string
  furlDepth: number
  flipAngle: number
  tiltAngle: number
}

export function calculateSegmentTransforms(
  direction: 'forward' | 'backward',
  progress: number,
  config: FurlingConfig
): SegmentTransform[] {
  const segmentWidth = 100 / config.segmentCount

  return Array.from({ length: config.segmentCount }, (_, i) => {
    const furlDepth = getSegmentFurlDepth(i, direction, progress, config)
    const flipAngle = getSegmentFlipAngle(i, direction, progress, config)
    const tiltAngle = getSegmentTilt(i, direction, furlDepth, config)

    return {
      index: i,
      left: `${i * segmentWidth}%`,
      width: `${segmentWidth + 0.5}%`, // slight overlap to prevent gaps
      furlDepth,
      flipAngle,
      tiltAngle,
    }
  })
}
