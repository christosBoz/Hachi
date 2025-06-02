import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Box, Typography, Paper } from "@mui/material";

const RichTextEditor = ({ content, onChange }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
  });

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Typography variant="subtitle2" gutterBottom>
        Rich Text Editor
      </Typography>
      <Box
        sx={{
          border: "1px solid #ccc",
          borderRadius: "4px",
          padding: "10px",
          minHeight: "150px",
        }}
      >
        <EditorContent editor={editor} />
      </Box>
    </Paper>
  );
};

export default RichTextEditor;
