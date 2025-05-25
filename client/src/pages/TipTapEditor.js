import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

export default function TiptapEditor({ value, onChange }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [value]);

  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "4px",
        backgroundColor: "#fff",
        padding: "12px",
        minHeight: "100px",
        fontSize: "1rem",
      }}
    >
      <EditorContent
        editor={editor}
        style={{
          outline: "none",
          minHeight: "75px",
        }}
      />
    </div>
  );
}
