import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next 16 restricts next/image's `quality` prop to this allowlist
    // (default: [75] only) — 90 is used for the about page's "large"
    // hobby photo, so it has to be explicitly allowed here or it's
    // silently clamped back down to 75.
    qualities: [75, 90],
  },
};

export default nextConfig;
