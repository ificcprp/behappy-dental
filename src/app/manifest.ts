import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Centro Dental BeHappy Ñuñoa",
    short_name: "BeHappy Dental",
    description: "Odontología Avanzada, Ortodoncia Invisalign, Implantes y Citas Online en Ñuñoa, Santiago.",
    start_url: "/",
    display: "standalone",
    background_color: "#faf8f5",
    theme_color: "#faf8f5",
    icons: [
      {
        src: "/images/brand/logo.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/images/brand/logo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
