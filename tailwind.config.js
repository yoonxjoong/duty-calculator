/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",           // 루트에 index.html이 있는 경우
    "./src/**/*.{vue,js,ts}", // src 디렉토리 아래 vue/js/ts 파일들
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
