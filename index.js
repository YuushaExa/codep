<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JSFiddle Clone</title>
    <style>
        body {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
        }
        #editor {
            display: flex;
            width: 100%;
            max-width: 1200px;
            margin-bottom: 20px;
        }
        textarea {
            width: 33%;
            height: 300px;
            margin: 5px;
            padding: 10px;
            box-sizing: border-box;
            font-family: monospace;
        }
        iframe {
            width: 100%;
            height: 500px;
            border: 1px solid #ccc;
        }
    </style>
</head>
<body>
    <div id="editor">
        <textarea id="html" placeholder="HTML"></textarea>
        <textarea id="css" placeholder="CSS"></textarea>
        <textarea id="js" placeholder="JavaScript"></textarea>
    </div>
    <iframe id="preview"></iframe>
    <script>
        const htmlEditor = document.getElementById('html');
        const cssEditor = document.getElementById('css');
        const jsEditor = document.getElementById('js');
        const previewFrame = document.getElementById('preview');

        function updatePreview() {
            const html = htmlEditor.value;
            const css = `<style>${cssEditor.value}</style>`;
            const js = `<script>${jsEditor.value}<\/script>`;
            const preview = previewFrame.contentDocument || previewFrame.contentWindow.document;
            preview.open();
            preview.write(html + css + js);
            preview.close();
        }

        htmlEditor.addEventListener('input', updatePreview);
        cssEditor.addEventListener('input', updatePreview);
        jsEditor.addEventListener('input', updatePreview);

        // Initial call to display content on page load
        updatePreview();
    </script>
</body>
</html>
