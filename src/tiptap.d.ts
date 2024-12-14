import "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    setFontFamily: (fontFamily: string) => ReturnType;
    unsetFontFamily: () => ReturnType;
    setFontSize: (fontSize: string) => ReturnType;
    unsetFontSize: () => ReturnType;
  }
}
