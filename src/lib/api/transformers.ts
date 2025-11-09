import type { Image, PexelsPhoto, PixabayImage, UnsplashPhoto } from "@/types";

export function convertUnsplashToImage(unsplashPhoto: UnsplashPhoto): Image {
  return {
    id: `unsplash_${unsplashPhoto.id}`,
    url: unsplashPhoto.urls.regular,
    thumbnailUrl: unsplashPhoto.urls.small,
    width: unsplashPhoto.width,
    height: unsplashPhoto.height,
    photographer: unsplashPhoto.user.name,
    photographerUrl: unsplashPhoto.user.links.html,
    source: "unsplash",
    sourceUrl: unsplashPhoto.links.html,
    alt: unsplashPhoto.alt_description || undefined,
    tags: unsplashPhoto.tags?.map((tag) => tag.title),
  };
}

export function convertPexelsToImage(pexelsPhoto: PexelsPhoto): Image {
  return {
    id: `pexels_${pexelsPhoto.id}`,
    url: pexelsPhoto.src.large,
    thumbnailUrl: pexelsPhoto.src.medium,
    width: pexelsPhoto.width,
    height: pexelsPhoto.height,
    photographer: pexelsPhoto.photographer,
    photographerUrl: pexelsPhoto.photographer_url,
    source: "pexels",
    sourceUrl: pexelsPhoto.url,
    alt: pexelsPhoto.alt,
  };
}

export function convertPixabayToImage(pixabayImage: PixabayImage): Image {
  return {
    id: `pixabay_${pixabayImage.id}`,
    url: pixabayImage.largeImageURL,
    thumbnailUrl: pixabayImage.webformatURL,
    width: pixabayImage.imageWidth,
    height: pixabayImage.imageHeight,
    photographer: pixabayImage.user,
    photographerUrl: `https://pixabay.com/users/${pixabayImage.user}-${pixabayImage.user_id}/`,
    source: "pixabay",
    sourceUrl: pixabayImage.pageURL,
    tags: pixabayImage.tags.split(",").map((tag) => tag.trim()),
  };
}
