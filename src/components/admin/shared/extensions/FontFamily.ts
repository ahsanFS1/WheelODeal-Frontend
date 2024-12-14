import { Extension } from "@tiptap/core";

const FontFamily = Extension.create({
  name: "fontFamily",

  addGlobalAttributes() {
    return [
      {
        types: ["textStyle"],
        attributes: {
          fontFamily: {
            default: "ui-sans-serif",
            parseHTML: (element) => {
              return element.style.fontFamily || null;
            },
            renderHTML: (attributes) => {
              if (!attributes.fontFamily) return {};
              return {
                style: `font-family: ${attributes.fontFamily}`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setFontFamily:
        (fontFamily: string) =>
        ({ commands }) => {
          return commands.setMark("textStyle", { fontFamily });
        },
      unsetFontFamily:
        () =>
        ({ commands }) => {
          return commands.unsetMark("textStyle");
        },
    };
  },
});

export default FontFamily;
