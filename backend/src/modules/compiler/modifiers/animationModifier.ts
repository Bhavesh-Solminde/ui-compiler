import { AnimationTokens } from '@resumer/shared-types';

export function generateAnimationCss(animation: AnimationTokens): string {
  return `
  --animation-duration: ${animation.duration}ms;
  --animation-easing: ${animation.easing};
  --transition: ${animation.duration}ms ${animation.easing};`;
}
