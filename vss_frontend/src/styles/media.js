export const mediaQuery = (maxWidth) => `
  @media (max-width: ${maxWidth}px)
`;

export const minMediaQuery = (minWidth) => `
  @media (min-width: ${minWidth}px)
`;

const media = {
  // max-width
  large: mediaQuery(1248),
  medium: mediaQuery(1024),
  small: mediaQuery(768),
  custom: mediaQuery,
  mobile: mediaQuery(1200),
  // min-width
  minLarge: minMediaQuery(1248),
  minMedium: minMediaQuery(1024),
  minSmall: minMediaQuery(768),
  minCustom: minMediaQuery,
  minMobile: minMediaQuery(1200),
  
};

export default media;
