import { useCanvasValue } from "../components/state-provider";
import { fetchImageSize } from "../utils/image-size.utils";
import { fitImageRect } from "../utils/rect.utils";

export function useAddImage() {
  const { value, addImage } = useCanvasValue();

  return async (src: string, alt?: string) => {
    const size = await fetchImageSize(src);
    addImage({ src, alt, ...fitImageRect(size, value.frame) });
  };
}
