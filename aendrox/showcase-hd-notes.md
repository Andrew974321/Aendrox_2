# HD showcase and typography

The former flattened showcase image is now responsive HTML text and links around a 1254 x 1254 chrome gear asset. The services section also uses live text so every homepage section shares the same typography. The gear is displayed at up to 520 CSS pixels, providing more than 2x source resolution at its largest use.

Asset: public/assets/chrome-gear-hd.png
Tool: built-in image_gen, using showcase-supplied.png as the edit reference.
Prompt: Recreate the reference's large chrome gear as one front-facing, high-resolution silver gear on pure black. Preserve the industrial teeth, polished concentric rim, graphite material, and upper-left highlights. Leave the center flat black; remove all text, charts, logos, and symbols so live HTML can supply them.

Fonts: existing locally hosted Space Grotesk 500 for headings and Inter 400/500 for body/UI.
Scale: section headings clamp(30px, 3vw, 43px), card headings 21px, body 14px, controls 12px, labels 10px. Hero and page-title headings retain their display hierarchy. Compact gear-dashboard text adapts to fit smaller screens.

All decorative artwork uses lighten blending against the existing --bg (#08090b). Typography and links remain selectable, keyboard accessible, and sharp at any zoom.
