// /** @type {import('postcss-load-config').Config} */
// // postcss.config.ts
// import tailwindcss from 'tailwindcss';
// import autoprefixer from 'autoprefixer';

// const config = {
//   plugins: [tailwindcss(), autoprefixer()],
// };

//import tailwindcss from 'tailwindcss';
//import autoprefixer from 'autoprefixer';

const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
export default config;