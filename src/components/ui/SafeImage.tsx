import { useState, type ImgHTMLAttributes } from "react";

const PLACEHOLDER =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450"><rect width="800" height="450" fill="#1e1b4b"/><rect width="800" height="450" fill="url(#g)"/><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#6366f1" stop-opacity=".15"/><stop offset="100%" stop-color="#8b5cf6" stop-opacity=".3"/></linearGradient></defs></svg>`,
  );

export function SafeImage(props: ImgHTMLAttributes<HTMLImageElement>) {
  const [errored, setErrored] = useState(false);

  return (
    <img
      {...props}
      loading={props.loading ?? "lazy"}
      decoding={props.decoding ?? "async"}
      src={errored ? PLACEHOLDER : props.src}
      onError={(e) => {
        setErrored(true);
        props.onError?.(e);
      }}
    />
  );
}
