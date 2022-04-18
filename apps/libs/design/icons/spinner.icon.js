import React from 'react';
import chroma from 'chroma-js';

export const IconSpinner = ({ color }) => {
  const main_color = color ? chroma(color)?.hex() : '#6d799c';
  const shade1 = chroma(main_color)?.darken(1);
  const shade2 = shade1?.desaturate(0.25)?.darken(1);
  const shade3 = shade1?.desaturate(0.5)?.darken(1.25);

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 59.9 59.9">
      <linearGradient
        id="a"
        x1="6.438"
        x2="33.438"
        y1="22.643"
        y2="22.643"
        gradientTransform="rotate(120 29.938 29.937)"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stopColor={main_color} />
        <stop offset="0.428" stopColor={shade1?.hex()} stopOpacity="0.781" />
        <stop offset="0.698" stopColor={shade2?.hex()} stopOpacity="0.412" />
        <stop offset="1" stopColor={shade3?.hex()} stopOpacity="0" />
      </linearGradient>
      <path
        fill="none"
        stroke="url(#a)"
        strokeLinecap="round"
        strokeMiterlimit="10"
        strokeWidth="10"
        d="M34.9 10.6c1.7.4 3.4 1.1 5.1 2.1 9.6 5.5 12.8 17.8 7.3 27.3"
      />
      <linearGradient
        id="b"
        x1="6.438"
        x2="33.438"
        y1="22.643"
        y2="22.643"
        gradientTransform="rotate(-120 29.937 29.938)"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stopColor={main_color} />
        <stop offset="0.428" stopColor={shade1?.hex()} stopOpacity="0.781" />
        <stop offset="0.698" stopColor={shade2?.hex()} stopOpacity="0.412" />
        <stop offset="1" stopColor={shade3?.hex()} stopOpacity="0" />
      </linearGradient>
      <path
        fill="none"
        stroke="url(#b)"
        strokeLinecap="round"
        strokeMiterlimit="10"
        strokeWidth="10"
        d="M44.3 43.9c-1.2 1.3-2.7 2.4-4.3 3.3-9.6 5.5-21.8 2.2-27.3-7.3"
      />
      <linearGradient
        id="c"
        x1="6.438"
        x2="33.438"
        y1="22.643"
        y2="22.643"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stopColor={main_color} />
        <stop offset="0.428" stopColor={shade1?.hex()} stopOpacity="0.781" />
        <stop offset="0.698" stopColor={shade2?.hex()} stopOpacity="0.412" />
        <stop offset="1" stopColor={shade3?.hex()} stopOpacity="0" />
      </linearGradient>
      <path
        fill="none"
        stroke="url(#c)"
        strokeLinecap="round"
        strokeMiterlimit="10"
        strokeWidth="10"
        d="M10.7 35.3c-.5-1.7-.7-3.5-.7-5.4 0-11 9-20 20-20"
      />
    </svg>
  );
};
