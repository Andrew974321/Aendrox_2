// Platform highlights
// illuminate the image's own pixels to stay registered at every screen size.
const ART = '/assets/about/brain-clean.webp';

export function BrainVisual() {
  return (
    <div className="brain-visual">
      <picture>
        <source srcSet={ART} type="image/webp" />
        <img src="/assets/about/brain-clean.png" alt="Glowing chrome brain above an animated circular light platform" width="1566" height="1005" fetchPriority="high" decoding="async" />
      </picture>
      <div className="brain-light-pass brain-ring-light" aria-hidden="true" />
      <div className="brain-light-pass brain-core-light" aria-hidden="true" />
    </div>
  );
}


