export default defineAppConfig({
  ui: {
    primary: 'blue',
    button: {
      base: "rounded px-4 py-2 text-center uppercase leading-8 border-none cursor-pointer justify-center disabled:[--tw-bg-opacity:0.8]",
      font: "font-normal",
      rounded: "rounded",
      size: {
        xxl: "text-lg",
      },
      default: {
        size: "xxl",
      }
    },
    formGroup: {
      label: {
        base: "block mt-2 text-gray-700 dark:text-gray-200"
      }
    }
  }
})