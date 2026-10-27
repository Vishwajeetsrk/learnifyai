import React from "react";
import { cn } from "@/lib/utils";

interface BrandIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number | string;
}

/**
 * Google Workspace Pro — All 5 core workspace tools unified (Gmail, Calendar, Drive, Docs, Meet)
 */
export function GoogleWorkspaceProIcon({ className, size = 120, ...props }: BrandIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 1216 192"
      className={cn("h-auto shrink-0", className)}
      style={{ width: typeof size === "number" ? `${size}px` : size }}
      aria-label="Google Workspace Pro"
      {...props}
    >
      <path fill="url(#gm-a)" d="M146 44h38v110c0 6.627-5.373 12-12 12h-20a6 6 0 0 1-6-6z" />
      <path fill="#fc413d" d="M46 44H8v110c0 6.627 5.373 12 12 12h20a6 6 0 0 0 6-6z" />
      <path
        fill="url(#gm-b)"
        d="M39.226 30.456c-8.033-6.752-20.018-5.714-26.77 2.319-6.752 8.032-5.714 20.017 2.319 26.77l76.078 63.949a8 8 0 0 0 10.295 0l76.078-63.95c8.032-6.752 9.07-18.737 2.318-26.77-6.752-8.032-18.737-9.07-26.769-2.318L96 78.18z"
      />
      <defs>
        <linearGradient id="gm-a" x1="165" x2="165" y1="44" y2="166" gradientUnits="userSpaceOnUse">
          <stop stopColor="#60d673" />
          <stop offset=".17" stopColor="#42c868" />
          <stop offset=".39" stopColor="#0ebc5f" />
          <stop offset=".62" stopColor="#00a9bb" />
          <stop offset=".86" stopColor="#3c90ff" />
          <stop offset="1" stopColor="#3186ff" />
        </linearGradient>
        <linearGradient id="gm-b" x1="8" x2="184" y1="46.13" y2="46.13" gradientUnits="userSpaceOnUse">
          <stop offset=".08" stopColor="#ff63a0" />
          <stop offset=".3" stopColor="#fc413d" />
          <stop offset=".5" stopColor="#fc413d" />
          <stop offset=".65" stopColor="#fc413d" />
          <stop offset=".72" stopColor="#fc5c30" />
          <stop offset=".86" stopColor="#feb10c" />
          <stop offset=".91" stopColor="#fec700" />
          <stop offset=".96" stopColor="#ffdb0f" />
        </linearGradient>
      </defs>
      <g transform="translate(256)">
        <path
          fill="#bbe2ff"
          d="M32 36.8C32 20.894 44.894 8 60.8 8h70.4C147.106 8 160 20.894 160 36.8v30.4c0 15.906-12.894 28.8-28.8 28.8H60.8C44.894 96 32 83.106 32 67.2z"
        />
        <path
          fill="#3c90ff"
          d="M19.867 49.392C17.818 33.82 29.94 20 45.645 20h100.71c15.706 0 27.827 13.82 25.778 29.392L166 96l6.133 46.608C174.182 158.18 162.061 172 146.355 172H45.645c-15.706 0-27.827-13.82-25.778-29.392L26 96z"
        />
        <mask id="cl-a" width="154" height="152" x="19" y="20" maskUnits="userSpaceOnUse" style={{ maskType: "alpha" }}>
          <path
            fill="#3c90ff"
            d="M19.867 49.392C17.818 33.82 29.94 20 45.645 20h100.71c15.706 0 27.827 13.82 25.778 29.392L166 96l6.133 46.608C174.182 158.18 162.061 172 146.355 172H45.645c-15.706 0-27.827-13.82-25.778-29.392L26 96z"
          />
        </mask>
        <g mask="url(#cl-a)">
          <path fill="url(#cl-b)" d="M0 0h166v76H0z" transform="matrix(1 0 0 -1 13 172)" />
        </g>
        <mask id="cl-c" width="154" height="152" x="19" y="20" maskUnits="userSpaceOnUse" style={{ maskType: "alpha" }}>
          <path
            fill="#3186ff"
            d="M19.867 49.392C17.818 33.82 29.94 20 45.645 20h100.71c15.706 0 27.827 13.82 25.778 29.392L166 96l6.133 46.608C174.182 158.18 162.061 172 146.355 172H45.645c-15.706 0-27.827-13.82-25.778-29.392L26 96z"
          />
        </mask>
        <g mask="url(#cl-c)">
          <path
            fill="url(#cl-d)"
            d="M32 27.2C32 16.596 40.596 8 51.2 8h89.6c10.604 0 19.2 8.596 19.2 19.2V96H32z"
            filter="url(#cl-e)"
          />
        </g>
        <path
          fill="#fff"
          d="M75.353 133.336q-6.282 0-10.777-2.043t-7.61-5.465q-3.065-3.474-4.342-6.793T51.603 115a2.07 2.07 0 0 1 1.021-1.124l5.67-2.247q.714-.357 1.43-.102.714.204 1.685 2.349 1.022 2.145 2.86 4.546a14.3 14.3 0 0 0 4.495 3.728q2.606 1.328 6.435 1.328 6.18 0 9.807-3.575 3.677-3.575 3.677-9.091 0-5.976-3.882-9.194-3.881-3.269-10.266-3.269h-5.362a1.9 1.9 0 0 1-1.328-.51q-.51-.562-.511-1.277v-5.465q0-.767.51-1.277a1.82 1.82 0 0 1 1.329-.562h4.647q5.721 0 9.194-3.116t3.473-8.07q0-4.902-3.116-7.916t-8.58-3.014q-3.065 0-5.312 1.022a11.5 11.5 0 0 0-3.882 2.86 22.7 22.7 0 0 0-2.809 3.78q-1.174 1.941-1.89 2.145-.714.153-1.379-.255l-5.363-2.605q-.664-.358-.868-1.124t1.226-3.575q1.481-2.86 4.494-5.823a21 21 0 0 1 7.049-4.597q4.035-1.635 9.398-1.634 9.96 0 15.782 5.26 5.823 5.21 5.823 13.791 0 5.925-2.86 10.266-2.81 4.34-7.968 6.13v.204q6.231 1.838 9.806 6.741 3.627 4.853 3.626 11.594 0 9.654-6.742 15.834-6.74 6.18-17.57 6.18zm51.25-1.175q-.868 0-1.533-.664a2.25 2.25 0 0 1-.612-1.583V73.118l-11.492 8.274q-.614.46-1.431.307a1.96 1.96 0 0 1-1.225-.766l-3.32-4.7a1.98 1.98 0 0 1-.358-1.43q.153-.816.817-1.276l20.379-14.557q.256-.204.562-.306.307-.153.715-.153h4.291q.868 0 1.379.613.562.56.562 1.43v69.36q0 .92-.664 1.583a2 2 0 0 1-1.533.664z"
        />
        <defs>
          <linearGradient id="cl-b" x1="83" x2="83" y1="76" gradientUnits="userSpaceOnUse">
            <stop stopColor="#4fa0ff" />
            <stop offset="1" stopColor="#3186ff" />
          </linearGradient>
          <linearGradient id="cl-d" x1="89.06" x2="89.06" y1="21.75" y2="96.39" gradientUnits="userSpaceOnUse">
            <stop stopColor="#a9a8ff" />
            <stop offset=".8" stopColor="#3c90ff" />
          </linearGradient>
          <filter id="cl-e" width="152" height="112" x="20" y="-4" colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feGaussianBlur result="effect1_foregroundBlur_37330_7673" stdDeviation="6" />
          </filter>
        </defs>
      </g>
      <g transform="translate(512)">
        <mask id="dr-a" width="168" height="154" x="12" y="18" maskUnits="userSpaceOnUse" style={{ maskType: "alpha" }}>
          <path
            fill="#b43333"
            d="M63.09 37c14.626-25.333 51.193-25.334 65.819 0l45.033 78c14.626 25.334-3.657 57.001-32.91 57.001H50.967c-29.253 0-47.536-31.667-32.91-57.001z"
          />
        </mask>
        <g mask="url(#dr-a)">
          <path fill="url(#dr-b)" d="M206.905 172.02h-91.888l-19.015-32.934 45.944-79.578z" />
          <path fill="url(#dr-c)" d="M-14.919 172.006 50.04 59.494v.002L31.032 92.422h38.02L115 172.004l-129.918.001z" />
          <path fill="url(#dr-d)" d="M96.007-20.085 141.954 59.5l-19.011 32.928H31.048z" />
        </g>
        <defs>
          <linearGradient id="dr-b" x1="193.6" x2="103.09" y1="165.6" y2="111.21" gradientUnits="userSpaceOnUse">
            <stop offset=".09" stopColor="#ffe921" />
            <stop offset="1" stopColor="#fec700" />
          </linearGradient>
          <linearGradient id="dr-c" x1="114.4" x2="15.53" y1="181.61" y2="121.8" gradientUnits="userSpaceOnUse">
            <stop offset=".15" stopColor="#a9a8ff" />
            <stop offset=".33" stopColor="#6d97ff" />
            <stop offset=".48" stopColor="#3186ff" />
          </linearGradient>
          <linearGradient id="dr-d" x1="128.88" x2="28.7" y1="37.88" y2="84.64" gradientUnits="userSpaceOnUse">
            <stop offset=".55" stopColor="#0ebc5f" />
            <stop offset=".85" stopColor="#78c9ff" />
          </linearGradient>
        </defs>
      </g>
      <g transform="translate(768)">
        <mask id="dc-mask0_37242_8762" width="128" height="176" x="32" y="8" maskUnits="userSpaceOnUse" style={{ maskType: "alpha" }}>
          <path
            fill="#3186ff"
            d="M130.334 184H61.6c-8.943 0-13.415 0-16.962-1.404a20 20 0 0 1-11.233-11.234C32 167.815 32 163.343 32 154.4V37.6c0-8.943 0-13.415 1.404-16.963A20 20 0 0 1 44.639 9.404C48.185 8 52.657 8 61.6 8H100l54.793 54.793c1.661 1.661 2.492 2.492 3.13 3.43a12 12 0 0 1 1.862 4.502c.212 1.115.212 2.301.21 4.674-.035 48.918-.057 49.4-.058 78.967 0 8.966 0 13.45-1.405 16.997a20 20 0 0 1-11.233 11.233C143.752 184 139.279 184 130.334 184"
          />
        </mask>
        <g mask="url(#dc-mask0_37242_8762)">
          <path fill="#3186ff" d="M159.94 184H32V8h68l59.999 60z" />
          <g filter="url(#dc-filter0_f_37242_8762)">
            <path fill="url(#dc-paint0_linear_37242_8762)" d="M43 192h106V20H43z" />
          </g>
        </g>
        <path fill="#76bbff" d="M154.995 62.995A14.93 14.93 0 0 0 146 60h-33.2c-7.069 0-12.8-5.73-12.8-12.8V8z" />
        <rect width="64" height="12" x="64.001" y="114" fill="#fff" rx="6" />
        <rect width="48" height="12" x="64.001" y="143" fill="#fff" rx="6" />
        <defs>
          <linearGradient id="dc-paint0_linear_37242_8762" x1="96" x2="54.612" y1="59.284" y2="171.338" gradientUnits="userSpaceOnUse">
            <stop offset=".33" stopColor="#3186ff" />
            <stop offset="1" stopColor="#a9a8ff" />
          </linearGradient>
          <filter id="dc-filter0_f_37242_8762" width="130" height="196" x="31" y="8" colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feGaussianBlur result="effect1_foregroundBlur_37242_8762" stdDeviation="6" />
          </filter>
        </defs>
      </g>
      <g transform="translate(1024)">
        <path
          fill="url(#mt-a)"
          d="M110.015 108.88c-6.829-4.718-6.921-14.778-.179-19.62L165 49.643c7.94-5.701 19-.038 19 9.737v77.755c0 9.675-10.861 15.359-18.821 9.859z"
        />
        <path
          fill="url(#mt-b)"
          d="M8 71c0-24.3 19.7-44 44-44h64c11.046 0 20 8.954 20 20v98c0 11.046-8.954 20-20 20H28c-11.046 0-20-8.954-20-20z"
        />
        <mask id="mt-e" width="129" height="138" x="8" y="27" maskUnits="userSpaceOnUse" style={{ maskType: "luminance" }}>
          <path
            fill="#fff"
            d="M8 71c0-24.3 19.7-44 44-44h64c11.046 0 20 8.954 20 20v98c0 11.046-8.954 20-20 20H28c-11.046 0-20-8.954-20-20z"
          />
        </mask>
        <g filter="url(#mt-c)" mask="url(#mt-e)">
          <path fill="url(#mt-f)" d="m73.906 99.198 110-63.198v124z" />
        </g>
        <circle cx="38" cy="135" r="14" fill="#fff" />
        <defs>
          <linearGradient id="mt-a" x1="128.8" x2="227.2" y1="104.44" y2="104.44" gradientUnits="userSpaceOnUse">
            <stop stopColor="#f6a100" />
            <stop offset="1" stopColor="#ffbe00" />
          </linearGradient>
          <linearGradient id="mt-f" x1="136.22" x2="78.5" y1="91.32" y2="91.19" gradientUnits="userSpaceOnUse">
            <stop offset=".15" stopColor="#ffb5e8" />
            <stop offset="1" stopColor="#ffdbf5" stopOpacity="0" />
          </linearGradient>
          <radialGradient
            id="mt-b"
            cx="0"
            cy="0"
            r="1"
            gradientTransform="matrix(-159.725 0 0 -135.852 160.325 96)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset=".15" stopColor="#ffe921" />
            <stop offset="1" stopColor="#fec700" />
          </radialGradient>
          <filter id="mt-c" width="166" height="180" x="45.91" y="8" colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feGaussianBlur result="effect1_foregroundBlur_37584_9338" stdDeviation="14" />
          </filter>
        </defs>
      </g>
    </svg>
  );
}

/**
 * Google Multi-App G Icon — Rich procedural multi-gradient Google glyph
 */
export function GoogleMultiAppIcon({ className, size = 28, ...props }: BrandIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 268.152 273.883"
      className={cn("shrink-0", className)}
      style={{ width: typeof size === "number" ? `${size}px` : size, height: typeof size === "number" ? `${size}px` : size }}
      aria-label="Google Apps"
      {...props}
    >
      <defs>
        <linearGradient id="g-a">
          <stop offset="0" stopColor="#0fbc5c" />
          <stop offset="1" stopColor="#0cba65" />
        </linearGradient>
        <linearGradient id="g-g">
          <stop offset=".231" stopColor="#0fbc5f" />
          <stop offset=".312" stopColor="#0fbc5f" />
          <stop offset=".366" stopColor="#0fbc5e" />
          <stop offset=".458" stopColor="#0fbc5d" />
          <stop offset=".54" stopColor="#12bc58" />
          <stop offset=".699" stopColor="#28bf3c" />
          <stop offset=".771" stopColor="#38c02b" />
          <stop offset=".861" stopColor="#52c218" />
          <stop offset=".915" stopColor="#67c30f" />
          <stop offset="1" stopColor="#86c504" />
        </linearGradient>
        <linearGradient id="g-h">
          <stop offset=".142" stopColor="#1abd4d" />
          <stop offset=".248" stopColor="#6ec30d" />
          <stop offset=".312" stopColor="#8ac502" />
          <stop offset=".366" stopColor="#a2c600" />
          <stop offset=".446" stopColor="#c8c903" />
          <stop offset=".54" stopColor="#ebcb03" />
          <stop offset=".616" stopColor="#f7cd07" />
          <stop offset=".699" stopColor="#fdcd04" />
          <stop offset=".771" stopColor="#fdce05" />
          <stop offset=".861" stopColor="#ffce0a" />
        </linearGradient>
        <linearGradient id="g-f">
          <stop offset=".316" stopColor="#ff4c3c" />
          <stop offset=".604" stopColor="#ff692c" />
          <stop offset=".727" stopColor="#ff7825" />
          <stop offset=".885" stopColor="#ff8d1b" />
          <stop offset="1" stopColor="#ff9f13" />
        </linearGradient>
        <linearGradient id="g-b">
          <stop offset=".231" stopColor="#ff4541" />
          <stop offset=".312" stopColor="#ff4540" />
          <stop offset=".458" stopColor="#ff4640" />
          <stop offset=".54" stopColor="#ff473f" />
          <stop offset=".699" stopColor="#ff5138" />
          <stop offset=".771" stopColor="#ff5b33" />
          <stop offset=".861" stopColor="#ff6c29" />
          <stop offset="1" stopColor="#ff8c18" />
        </linearGradient>
        <linearGradient id="g-d">
          <stop offset=".408" stopColor="#fb4e5a" />
          <stop offset="1" stopColor="#ff4540" />
        </linearGradient>
        <linearGradient id="g-c">
          <stop offset=".132" stopColor="#0cba65" />
          <stop offset=".21" stopColor="#0bb86d" />
          <stop offset=".297" stopColor="#09b479" />
          <stop offset=".396" stopColor="#08ad93" />
          <stop offset=".477" stopColor="#0aa6a9" />
          <stop offset=".568" stopColor="#0d9cc6" />
          <stop offset=".667" stopColor="#1893dd" />
          <stop offset=".769" stopColor="#258bf1" />
          <stop offset=".859" stopColor="#3086ff" />
        </linearGradient>
        <linearGradient id="g-e">
          <stop offset=".366" stopColor="#ff4e3a" />
          <stop offset=".458" stopColor="#ff8a1b" />
          <stop offset=".54" stopColor="#ffa312" />
          <stop offset=".616" stopColor="#ffb60c" />
          <stop offset=".771" stopColor="#ffcd0a" />
          <stop offset=".861" stopColor="#fecf0a" />
          <stop offset=".915" stopColor="#fecf08" />
          <stop offset="1" stopColor="#fdcd01" />
        </linearGradient>
        <linearGradient xlinkHref="#g-a" id="g-s" x1="219.7" x2="254.467" y1="329.535" y2="329.535" gradientUnits="userSpaceOnUse" />
        <radialGradient xlinkHref="#g-b" id="g-m" cx="109.627" cy="135.862" r="71.46" fx="109.627" fy="135.862" gradientTransform="matrix(-1.93688 1.043 1.45573 2.55542 290.525 -400.634)" gradientUnits="userSpaceOnUse" />
        <radialGradient xlinkHref="#g-c" id="g-n" cx="45.259" cy="279.274" r="71.46" fx="45.259" fy="279.274" gradientTransform="matrix(-3.5126 -4.45809 -1.69255 1.26062 870.8 191.554)" gradientUnits="userSpaceOnUse" />
        <radialGradient xlinkHref="#g-d" id="g-l" cx="304.017" cy="118.009" r="47.854" fx="304.017" fy="118.009" gradientTransform="matrix(2.06435 0 0 2.59204 -297.679 -151.747)" gradientUnits="userSpaceOnUse" />
        <radialGradient xlinkHref="#g-e" id="g-o" cx="181.001" cy="177.201" r="71.46" fx="181.001" fy="177.201" gradientTransform="matrix(-.24858 2.08314 2.96249 .33417 -255.146 -331.164)" gradientUnits="userSpaceOnUse" />
        <radialGradient xlinkHref="#g-f" id="g-p" cx="207.673" cy="108.097" r="41.102" fx="207.673" fy="108.097" gradientTransform="matrix(-1.2492 1.34326 -3.89684 -3.4257 880.501 194.905)" gradientUnits="userSpaceOnUse" />
        <radialGradient xlinkHref="#g-g" id="g-r" cx="109.627" cy="135.862" r="71.46" fx="109.627" fy="135.862" gradientTransform="matrix(-1.93688 -1.043 1.45573 -2.55542 290.525 838.683)" gradientUnits="userSpaceOnUse" />
        <radialGradient xlinkHref="#g-h" id="g-j" cx="154.87" cy="145.969" r="71.46" fx="154.87" fy="145.969" gradientTransform="matrix(-.0814 -1.93722 2.92674 -.11625 -215.135 632.86)" gradientUnits="userSpaceOnUse" />
        <filter id="g-q" width="1.097" height="1.116" x="-.048" y="-.058" colorInterpolationFilters="sRGB">
          <feGaussianBlur stdDeviation="1.701" />
        </filter>
        <filter id="g-k" width="1.033" height="1.02" x="-.017" y="-.01" colorInterpolationFilters="sRGB">
          <feGaussianBlur stdDeviation=".242" />
        </filter>
        <clipPath id="g-i" clipPathUnits="userSpaceOnUse">
          <path d="M371.378 193.24H237.083v53.438h77.167c-1.241 7.563-4.026 15.003-8.105 21.786-4.674 7.773-10.451 13.69-16.373 18.196-17.74 13.498-38.42 16.258-52.783 16.258-36.283 0-67.283-23.286-79.285-54.928-.484-1.149-.805-2.335-1.197-3.507a81.115 81.115 0 0 1-4.101-25.448c0-9.226 1.569-18.057 4.43-26.398 11.285-32.897 42.985-57.467 80.179-57.467 7.481 0 14.685.884 21.517 2.648a77.668 77.668 0 0 1 33.425 18.25l40.834-39.712c-24.839-22.616-57.219-36.32-95.844-36.32-30.878 0-59.386 9.553-82.748 25.7-18.945 13.093-34.483 30.625-44.97 50.985-9.753 18.879-15.094 39.8-15.094 62.294 0 22.495 5.35 43.633 15.103 62.337v.126c10.302 19.857 25.368 36.954 43.678 49.988 15.997 11.386 44.68 26.551 84.031 26.551 22.63 0 42.687-4.051 60.375-11.644 12.76-5.478 24.065-12.622 34.301-21.804 13.525-12.132 24.117-27.139 31.347-44.404 7.23-17.265 11.097-36.79 11.097-57.957 0-9.858-.998-19.87-2.689-28.968Z" />
        </clipPath>
      </defs>
      <g clipPath="url(#g-i)" transform="matrix(.95792 0 0 .98525 -90.174 -78.856)">
        <path fill="url(#g-j)" d="M92.076 219.958c.148 22.14 6.501 44.983 16.117 63.424v.127c6.949 13.392 16.445 23.97 27.26 34.452l65.327-23.67c-12.36-6.235-14.246-10.055-23.105-17.026-9.054-9.066-15.802-19.473-20.004-31.677h-.17l.17-.127c-2.765-8.058-3.037-16.613-3.14-25.503Z" filter="url(#g-k)" />
        <path fill="url(#g-l)" d="M237.083 79.025c-6.456 22.526-3.988 44.421 0 57.161 7.457.006 14.64.888 21.45 2.647a77.662 77.662 0 0 1 33.424 18.25l41.88-40.726c-24.81-22.59-54.667-37.297-96.754-37.332Z" filter="url(#g-k)" />
        <path fill="url(#g-m)" d="M236.943 78.847c-31.67 0-60.91 9.798-84.871 26.359a145.533 145.533 0 0 0-24.332 21.15c-1.904 17.744 14.257 39.551 46.262 39.37 15.528-17.936 38.495-29.542 64.056-29.542l.07.002-1.044-57.335c-.048 0-.093-.004-.14-.004Z" filter="url(#g-k)" />
        <path fill="url(#g-n)" d="m341.475 226.379-28.268 19.285c-1.24 7.562-4.028 15.002-8.107 21.786-4.674 7.772-10.45 13.69-16.373 18.196-17.702 13.47-38.328 16.244-52.687 16.255-14.842 25.102-17.444 37.675 1.043 57.934 22.877-.016 43.157-4.117 61.046-11.796 12.931-5.551 24.388-12.792 34.761-22.097 13.706-12.295 24.442-27.503 31.769-45 7.327-17.497 11.245-37.282 11.245-58.734Z" filter="url(#g-k)" />
        <path fill="#3086ff" d="M234.996 191.21v57.498h136.006c1.196-7.874 5.152-18.064 5.152-26.5 0-9.858-.996-21.899-2.687-30.998Z" filter="url(#g-k)" />
        <path fill="url(#g-o)" d="M128.39 124.327c-8.394 9.119-15.564 19.326-21.249 30.364-9.753 18.879-15.094 41.83-15.094 64.324 0 .317.026.627.029.944 4.32 8.224 59.666 6.649 62.456 0-.004-.31-.039-.613-.039-.924 0-9.226 1.57-16.026 4.43-24.367 3.53-10.289 9.056-19.763 16.123-27.926 1.602-2.031 5.875-6.397 7.121-9.016.475-.997-.862-1.557-.937-1.908-.083-.393-1.876-.077-2.277-.37-1.275-.929-3.8-1.414-5.334-1.845-3.277-.921-8.708-2.953-11.725-5.06-9.536-6.658-24.417-14.612-33.505-24.216Z" filter="url(#g-k)" />
        <path fill="url(#g-p)" d="M162.099 155.857c22.112 13.301 28.471-6.714 43.173-12.977l-25.574-52.664a144.74 144.74 0 0 0-26.543 14.504c-12.316 8.512-23.192 18.9-32.176 30.72Z" filter="url(#g-q)" />
        <path fill="url(#g-r)" d="M171.099 290.222c-29.683 10.641-34.33 11.023-37.062 29.29a144.806 144.806 0 0 0 16.792 13.984c15.996 11.386 46.766 26.551 86.118 26.551.046 0 .09-.004.137-.004v-59.157l-.094.002c-14.736 0-26.512-3.843-38.585-10.527-2.977-1.648-8.378 2.777-11.123.799-3.786-2.729-12.9 2.35-16.183-.938Z" filter="url(#g-k)" />
        <path fill="url(#g-s)" d="M219.7 299.023v59.996c5.506.64 11.236 1.028 17.247 1.028 6.026 0 11.855-.307 17.52-.872v-59.748a105.119 105.119 0 0 1-17.477 1.461c-5.932 0-11.7-.686-17.29-1.865Z" filter="url(#g-k)" opacity=".5" />
      </g>
    </svg>
  );
}

/**
 * Microsoft Word Official Icon
 */
export function MsWordIcon({ className, size = 28, ...props }: BrandIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 486 500"
      className={cn("shrink-0", className)}
      style={{ width: typeof size === "number" ? `${size}px` : size, height: typeof size === "number" ? `${size}px` : size }}
      aria-label="Microsoft Word"
      {...props}
    >
      <defs>
        <radialGradient id="w-a" cx="-689.34" cy="753.93" r="13.89" gradientTransform="matrix(47.56 0 0 -20.15 33260.63 15691.18)" gradientUnits="userSpaceOnUse">
          <stop offset=".18" stopColor="#1657f4" />
          <stop offset=".57" stopColor="#0036c4" />
        </radialGradient>
        <radialGradient id="w-c" cx="-730.97" cy="806.4" r="13.89" gradientTransform="matrix(-20.22495 21.28288 52.40647 49.82267 -56559.12 -24498.36)" gradientUnits="userSpaceOnUse">
          <stop offset=".14" stopColor="#d471ff" />
          <stop offset=".83" stopColor="#509df5" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="w-d" cx="-682.21" cy="801.86" r="13.89" gradientTransform="matrix(0 18.62 101.62 0 -81063.08 13022.32)" gradientUnits="userSpaceOnUse">
          <stop offset=".28" stopColor="#4f006f" stopOpacity="0" />
          <stop offset="1" stopColor="#4f006f" />
        </radialGradient>
        <radialGradient id="w-f" cx="-749.58" cy="798.74" r="13.89" gradientTransform="matrix(-28.7167 6.70901 16.06567 68.78884 -33867.69 -49911.37)" gradientUnits="userSpaceOnUse">
          <stop offset=".06" stopColor="#e4a7fe" />
          <stop offset=".54" stopColor="#e4a7fe" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="w-g" cx="-675.64" cy="797.48" r="13.89" gradientTransform="matrix(15.99196 15.99755 15.99476 -15.99476 -1949 23805.98)" gradientUnits="userSpaceOnUse">
          <stop offset=".08" stopColor="#367af2" />
          <stop offset=".87" stopColor="#001a8f" />
        </radialGradient>
        <radialGradient id="w-h" cx="-657.62" cy="854.65" r="13.89" gradientTransform="matrix(0 11.2 12.76 0 -10796.09 7734.8)" gradientUnits="userSpaceOnUse">
          <stop offset=".59" stopColor="#2763e5" stopOpacity="0" />
          <stop offset=".97" stopColor="#58aafe" />
        </radialGradient>
        <linearGradient id="w-b" x1="69.43" x2="388.45" y1="238.11" y2="238.11" gradientTransform="matrix(1 0 0 -1 0 502)" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#66c0ff" />
          <stop offset=".26" stopColor="#0094f0" />
        </linearGradient>
        <linearGradient id="w-e" x1="69.48" x2="485.94" y1="380.04" y2="373.16" gradientTransform="matrix(1 0 0 -1 0 502)" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#9deaff" />
          <stop offset=".2" stopColor="#3bd5ff" />
        </linearGradient>
      </defs>
      <path d="m69.43 376.25 194.4-237.36L486 293.13v158.26c0 26.85-21.76 48.61-48.6 48.61H152.74c-46.01 0-83.31-37.31-83.31-83.33v-40.42Z" fill="url(#w-a)" />
      <path d="M69.43 208.87c0-34.52 27.98-62.5 62.49-62.5h283.11L486 111.11v173.61c0 26.85-21.76 48.61-48.6 48.61H152.74c-46.01 0-83.31 37.31-83.31 83.33v-207.8Z" fill="url(#w-b)" />
      <path d="M69.43 208.87c0-34.52 27.98-62.5 62.49-62.5h283.11L486 111.11v173.61c0 26.85-21.76 48.61-48.6 48.61H152.74c-46.01 0-83.31 37.31-83.31 83.33v-207.8Z" fill="url(#w-c)" fillOpacity=".6" />
      <path d="M69.43 208.87c0-34.52 27.98-62.5 62.49-62.5h283.11L486 111.11v173.61c0 26.85-21.76 48.61-48.6 48.61H152.74c-46.01 0-83.31 37.31-83.31 83.33v-207.8Z" fill="url(#w-d)" fillOpacity=".1" />
      <path d="M69.43 83.33C69.43 37.31 106.73 0 152.74 0H437.4C464.24 0 486 21.76 486 48.61v69.44c0 26.85-21.76 48.61-48.6 48.61H152.74c-46.01 0-83.31 37.31-83.31 83.33V83.33Z" fill="url(#w-e)" />
      <path d="M69.43 83.33C69.43 37.31 106.73 0 152.74 0H437.4C464.24 0 486 21.76 486 48.61v69.44c0 26.85-21.76 48.61-48.6 48.61H152.74c-46.01 0-83.31 37.31-83.31 83.33V83.33Z" fill="url(#w-f)" fillOpacity=".8" />
      <rect width="222.17" height="222.22" y="236.11" rx="45.13" ry="45.13" fill="url(#w-g)" />
      <rect width="222.17" height="222.22" y="236.11" rx="45.13" ry="45.13" fill="url(#w-h)" fillOpacity=".65" />
      <path d="M187.26 283.73 159.92 410.7l-32.69.02-16.14-76.19-16.9 76.19h-33L34.91 283.75h26.95l16.21 83.79 16.11-83.79h33.04l16.87 83.79 15.82-83.79 27.34-.02Z" fill="#fff" />
    </svg>
  );
}

/**
 * Microsoft Excel Official Icon
 */
export function MsExcelIcon({ className, size = 28, ...props }: BrandIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 486 500"
      className={cn("shrink-0", className)}
      style={{ width: typeof size === "number" ? `${size}px` : size, height: typeof size === "number" ? `${size}px` : size }}
      aria-label="Microsoft Excel"
      {...props}
    >
      <defs>
        <radialGradient id="e-a" cx="-746.66" cy="781.44" r="13.89" gradientTransform="matrix(-28.32596 -29.80763 -23.11916 21.97986 -2596.39 -38900.31)" gradientUnits="userSpaceOnUse">
          <stop offset=".06" stopColor="#379539" />
          <stop offset=".42" stopColor="#297c2d" />
          <stop offset=".7" stopColor="#15561c" />
        </radialGradient>
        <radialGradient id="e-b" cx="-773.19" cy="771.25" r="13.89" gradientTransform="matrix(-11.97612 -11.58137 -8.95853 9.26806 -2155.12 -15858.88)" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#073b10" />
          <stop offset=".99" stopColor="#084a13" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="e-f" cx="-824.11" cy="810.99" r="13.89" gradientTransform="matrix(-9.02 0 0 19.09 -7120.4 -15378.69)" gradientUnits="userSpaceOnUse">
          <stop offset=".29" stopColor="#4eb43b" />
          <stop offset="1" stopColor="#72cc61" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="e-h" cx="-769.14" cy="808.9" r="13.89" gradientTransform="matrix(-16.9077 -13.68182 13.64112 -16.86345 -23523.37 3309.71)" gradientUnits="userSpaceOnUse">
          <stop offset=".44" stopColor="#79e96d" />
          <stop offset="1" stopColor="#d0eb76" />
        </radialGradient>
        <radialGradient id="e-i" cx="-675.64" cy="793.28" r="13.89" gradientTransform="matrix(15.99196 15.99755 45.54153 -45.54797 -25315.85 47178.18)" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#20a85e" />
          <stop offset=".94" stopColor="#09442a" />
        </radialGradient>
        <radialGradient id="e-j" cx="-657.62" cy="853.99" r="13.89" gradientTransform="matrix(0 11.2 12.9 0 -10902.85 7734.8)" gradientUnits="userSpaceOnUse">
          <stop offset=".58" stopColor="#33a662" stopOpacity="0" />
          <stop offset=".97" stopColor="#98f0b0" />
        </radialGradient>
        <linearGradient id="e-c" x1="69.43" x2="260.84" y1="210.33" y2="210.33" gradientTransform="matrix(1 0 0 -1 0 502)" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#52d17c" />
          <stop offset=".33" stopColor="#4aa647" />
        </linearGradient>
        <linearGradient id="e-d" x1="194.4" x2="194.4" y1="335.33" y2="161.68" gradientTransform="matrix(1 0 0 -1 0 502)" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#29852f" />
          <stop offset=".5" stopColor="#4aa647" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="e-e" x1="80.49" x2="311.45" y1="297.22" y2="497.54" gradientTransform="matrix(1 0 0 -1 0 502)" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#66d052" />
          <stop offset="1" stopColor="#85e972" />
        </linearGradient>
        <linearGradient id="e-g" x1="182.11" x2="69.43" y1="377" y2="377" gradientTransform="matrix(1 0 0 -1 0 502)" gradientUnits="userSpaceOnUse">
          <stop offset=".18" stopColor="#c0e075" stopOpacity="0" />
          <stop offset="1" stopColor="#d1eb95" />
        </linearGradient>
      </defs>
      <path d="M69.43 159.72c0-34.52 27.98-62.5 62.49-62.5h354.09v361.11c0 23.01-18.65 41.67-41.66 41.67H152.74c-46.01 0-83.31-37.31-83.31-83.33V159.72Z" fill="url(#e-a)" />
      <path d="M69.43 159.72c0-34.52 27.98-62.5 62.49-62.5h354.09v361.11c0 23.01-18.65 41.67-41.66 41.67H152.74c-46.01 0-83.31-37.31-83.31-83.33V159.72Z" fill="url(#e-b)" fillOpacity=".7" />
      <path d="M69.43 229.17c0-34.52 27.98-62.5 62.49-62.5h187.46c-23.01 0-41.66 18.66-41.66 41.67v83.33c0 23.01-18.65 41.67-41.66 41.67h-83.31c-46.01 0-83.31 37.31-83.31 83.33v-187.5Z" fill="url(#e-c)" />
      <path d="M69.43 229.17c0-34.52 27.98-62.5 62.49-62.5h187.46c-23.01 0-41.66 18.66-41.66 41.67v83.33c0 23.01-18.65 41.67-41.66 41.67h-83.31c-46.01 0-83.31 37.31-83.31 83.33v-187.5Z" fill="url(#e-d)" fillOpacity=".3" />
      <path d="M69.43 83.33C69.43 37.31 106.73 0 152.74 0h166.63v166.67H152.74c-46.01 0-83.31 37.31-83.31 83.33V83.33Z" fill="url(#e-e)" />
      <path d="M69.43 83.33C69.43 37.31 106.73 0 152.74 0h166.63v166.67H152.74c-46.01 0-83.31 37.31-83.31 83.33V83.33Z" fill="url(#e-f)" />
      <path d="M69.43 83.33C69.43 37.31 106.73 0 152.74 0h166.63v166.67H152.74c-46.01 0-83.31 37.31-83.31 83.33V83.33Z" fill="url(#e-g)" />
      <rect width="208.29" height="166.67" x="277.71" rx="41.66" ry="41.66" fill="url(#e-h)" />
      <rect width="222.17" height="222.22" y="236.11" rx="45.13" ry="45.13" fill="url(#e-i)" />
      <rect width="222.17" height="222.22" y="236.11" rx="45.13" ry="45.13" fill="url(#e-j)" fillOpacity=".3" />
      <path d="M169.48 410.71h-34.25l-21.5-40.47c-.77-1.42-1.36-2.54-1.77-3.37-.35-.88-.74-1.89-1.15-3.01h-.35c-.53 1.42-1.03 2.57-1.5 3.45-.47.89-1.03 1.98-1.68 3.28l-22.3 40.11h-32.3l38.76-63.58-36.1-63.4h33.8l19.11 36.13c.77 1.48 1.42 2.78 1.95 3.9.59 1.06 1.18 2.33 1.77 3.81h.35l1.95-4.07c.53-1 1.24-2.33 2.12-3.98l19.82-35.77h32.21l-36.63 62.43 37.7 64.55Z" fill="#fff" />
    </svg>
  );
}

/**
 * Microsoft Office Multi-Gradient Icon
 */
export function MsOfficeIcon({ className, size = 28, ...props }: BrandIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 78.799 96"
      className={cn("shrink-0", className)}
      style={{ width: typeof size === "number" ? `${size}px` : size, height: typeof size === "number" ? `${(Number(size) * 96) / 78.8}px` : "auto" }}
      aria-label="Microsoft Office"
      {...props}
    >
      <defs>
        <linearGradient id="o-a" gradientUnits="userSpaceOnUse" x1="16.942" x2="85.671" y1="83.36" y2="89.583">
          <stop offset="0" stopColor="#f32b44" />
          <stop offset=".6" stopColor="#a4070a" />
        </linearGradient>
        <linearGradient id="o-b">
          <stop offset="0" stopOpacity=".4" />
          <stop offset="1" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="o-c" gradientUnits="userSpaceOnUse" x1="63.515" x2="33.003" xlinkHref="#o-b" y1="87.298" y2="84.535" />
        <linearGradient id="o-d" gradientUnits="userSpaceOnUse" x1="44.738" x2="-5.901" y1="-3.312" y2="71.527">
          <stop offset="0" stopColor="#800600" />
          <stop offset=".6" stopColor="#c72127" />
          <stop offset=".728" stopColor="#c13959" />
          <stop offset=".847" stopColor="#bc4b81" />
          <stop offset=".942" stopColor="#b95799" />
          <stop offset="1" stopColor="#b85ba2" />
        </linearGradient>
        <linearGradient id="o-e" gradientUnits="userSpaceOnUse" x1="45.823" x2="35.099" xlinkHref="#o-b" y1="-4.81" y2="11.039" />
        <linearGradient id="o-f" gradientUnits="userSpaceOnUse" x1="61.486" x2="61.486" y1="-4.887" y2="88.781">
          <stop offset="0" stopColor="#ffb900" />
          <stop offset=".166" stopColor="#ef8400" />
          <stop offset=".313" stopColor="#e25c01" />
          <stop offset=".429" stopColor="#db4401" />
          <stop offset=".5" stopColor="#d83b01" />
        </linearGradient>
      </defs>
      <path
        d="m19.143 75.558c-2.724 0-4.945 2.121-4.945 4.753 0 1.789 1.031 3.322 2.565 4.14l19.118 10.246a10.11 10.11 0 0 0 4.969 1.303c1.164 0 2.275-.204 3.306-.562l6.531-1.814v-18.091c.027.025-31.519.025-31.545.025z"
        fill="url(#o-a)"
      />
      <path
        d="m19.143 75.558c-2.724 0-4.945 2.121-4.945 4.753 0 1.789 1.031 3.322 2.565 4.14l19.118 10.246a10.11 10.11 0 0 0 4.969 1.303c1.164 0 2.275-.204 3.306-.562l6.531-1.814v-18.091c.027.025-31.519.025-31.545.025z"
        fill="url(#o-c)"
      />
      <path
        d="m43.736.383a9.968 9.968 0 0 0 -2.777-.383c-1.56 0-3.12.307-4.522 1.022-.29.128-31.096 16.864-31.096 16.864-.423.205-.82.46-1.19.716-.052.025-.079.051-.132.077-.238.178-.45.357-.687.536-.106.077-.212.18-.291.256-.132.127-.265.255-.37.383-.37.383-1.005 1.2-1.005 1.2a9.15 9.15 0 0 0 -1.666 5.291v44.46c0 2.633 2.221 4.754 4.945 4.754.687 0 1.322-.128 1.904-.384l8.805-4.778c1.586-.766 2.856-2.07 3.517-3.68.158-.332.29-.74.37-1.15.026-.102.053-.23.053-.332 0-.05.026-.127.026-.178.027-.18.053-.384.053-.562 0-.154.027-.282.027-.435v-23.662-7.385c0-2.07.925-3.935 2.38-5.238 0 0-.688.613 0 0 .687-.613 1.586-1.15 2.644-1.507 1.057-.384 26.072-9.122 26.072-9.122v-14.744z"
        fill="url(#o-d)"
      />
      <path
        d="m43.736.383a9.968 9.968 0 0 0 -2.777-.383c-1.56 0-3.12.307-4.522 1.022-.29.128-31.096 16.864-31.096 16.864-.423.205-.82.46-1.19.716-.052.025-.079.051-.132.077-.238.178-.45.357-.687.536-.106.077-.212.18-.291.256-.132.127-.265.255-.37.383-.37.383-1.005 1.2-1.005 1.2a9.15 9.15 0 0 0 -1.666 5.291v44.46c0 2.633 2.221 4.754 4.945 4.754.687 0 1.322-.128 1.904-.384l8.805-4.778c1.586-.766 2.856-2.07 3.517-3.68.158-.332.29-.74.37-1.15.026-.102.053-.23.053-.332 0-.05.026-.127.026-.178.027-.18.053-.384.053-.562 0-.154.027-.282.027-.435v-23.662-7.385c0-2.07.925-3.935 2.38-5.238 0 0-.688.613 0 0 .687-.613 1.586-1.15 2.644-1.507 1.057-.384 26.072-9.122 26.072-9.122v-14.744z"
        fill="url(#o-e)"
      />
      <path
        d="m71.898 8.35-27.738-7.843c4.019 1.508 6.53 4.906 6.53 9.046 0 0-.025 75.2 0 77.014.027 4.088-2.67 7.589-6.53 8.892.846-.23 27.738-7.717 27.738-7.717 3.992-1.226 6.875-4.804 6.875-9.07v-61.252c.026-4.24-2.883-7.844-6.875-9.07z"
        fill="url(#o-f)"
      />
    </svg>
  );
}
