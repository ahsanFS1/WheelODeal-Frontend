import React, { useEffect, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import FontFamily from "./extensions/FontFamily";
import FontSize from "./extensions/FontSize";


interface TiptapEditorProps {
  content: string;
  onContentChange: (content: string) => void;
  customStyles?: string;
}

const TiptapEditor: React.FC<TiptapEditorProps> = ({
  content,
  onContentChange,
  customStyles = "",
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      FontFamily,
      FontSize,
    ],
    content,
    editorProps: {
      attributes: {
        class: `prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none ${customStyles}`,
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onContentChange(html);
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, false);
    }
  }, [content, editor]);

  const resetToPlainText = useCallback(() => {
    if (!editor) return;

    // Extract plain text and reset content
    const plainText = editor.getText(); // Get plain text only
    editor.commands.clearContent(); // Remove all formatting and content
    editor.commands.setContent(plainText); // Reapply plain text as content
    onContentChange(plainText); // Propagate plain text to parent
  }, [editor, onContentChange]);

  const adjustFontSize = useCallback(
    (adjustment: number) => {
      if (!editor) return;

      const currentFontSize = parseInt(
        editor.getAttributes("textStyle").fontSize || "16"
      );
      const newFontSize = `${Math.max(currentFontSize + adjustment, 8)}px`; // Minimum font size of 8px

      editor.chain().focus().setFontSize(newFontSize).run();
    },
    [editor]
  );

  const setColor = useCallback(
    (color: string) => {
      editor?.chain().focus().setColor(color).run();
    },
    [editor]
  );

  if (!editor) return null;

  const currentStyle = editor.getAttributes("textStyle");
  const currentFont = currentStyle.fontFamily || "ui-sans-serif";
  const currentSize = currentStyle.fontSize || "16px";
  const currentColor = currentStyle.color || "#000000";

  return (
    <div className="tiptap-editor">
      <div className="flex items-center gap-2 mb-4 bg-[#1B1B21] p-1 rounded-md shadow border border-purple-900/20">
        {/* Bold Button */}
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-purple-800 ${
            editor.isActive("bold") ? "bg-purple-700 text-white" : "text-gray-400"
          }`}
          type="button"
        >
          <b>B</b>
        </button>

        {/* Italic Button */}
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-purple-800 ${
            editor.isActive("italic")
              ? "bg-purple-700 text-white"
              : "text-gray-400"
          }`}
          type="button"
        >
          <i>I</i>
        </button>

        {/* Font Family Selector */}
        <select
          onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()}
          className="p-2 text-gray-400 bg-[#232329] border border-purple-900/20 rounded"
          value={currentFont}
        >
          <option value="ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif">
            UI Sans Serif (Default)
          </option>
          <option value="Arial">Arial</option>
          <option value="Georgia">Georgia</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Courier New">Courier New</option>
        </select>

        {/* Font Size Adjust Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => adjustFontSize(-2)}
            className="p-2 rounded bg-[#232329] text-gray-400 hover:bg-purple-800"
            type="button"
          >
            A-
          </button>
          <button
            onClick={() => adjustFontSize(2)}
            className="p-2 rounded bg-[#232329] text-gray-400 hover:bg-purple-800"
            type="button"
          >
            A+
          </button>
        </div>

        {/* Color Picker */}
        <input
          type="color"
          onChange={(e) => setColor(e.target.value)}
          value={currentColor}
          className="w-10 h-10 rounded border-none"
        />

        {/* Reset to Plain Text Button */}
        <button
            onClick={resetToPlainText}
            className="p-3 rounded bg-gradient-to-r from-red-500 via-red-500 to-pink-600 text-white font-bold hover:from-red-500 hover:via-purple-500 hover:to-indigo-500 shadow-lg shadow-pink-500/20 hover:shadow-indigo-500/50 transform transition-all duration-300 hover:scale-110 active:scale-50"
            title="Reset to Plain Text"
          >
            Reset
          </button>

      </div>

      <div className={`border border-purple-900/20 rounded-md p-4 bg-[#1B1B21] text-gray-200 ${customStyles}`}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default TiptapEditor;