import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{html,js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{html,js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{html,js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        //purpeshade: {
        //400: '#9b4d96',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
} satisfies Config;

// // echo "module.exports = {
// //   content: [
// //     './index.html', 
// //     './src/**/*.{js,jsx,ts,tsx}',
// //   ],
// //   theme: {
// //     extend: {},
// //   },
// //   plugins: [],
// // }" > tailwind.config.js



// module.exports = {
//   content: [
//     //'./index.html', 
//     './src/**/*.{html,js,jsx,ts,tsx}', 
//   ],
//   theme: {
//     extend: {
//       // colors: {
//       //   'purpleshade-400': '#9b4dca', // Example, replace with your actual color
//       // },
//     },
//   },
//   plugins: [],
// };
