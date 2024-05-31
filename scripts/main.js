// scripts/main.js
document.addEventListener('DOMContentLoaded', function () {
    const codeEditor = document.getElementById('code-editor');
    const preview = document.getElementById('preview');

    codeEditor.addEventListener('input', function () {
        updatePreview();
    });

    function updatePreview() {
        const htmlContent = codeEditor.value;
        preview.innerHTML = htmlContent;
    }

    // Implement drag-and-drop file upload and preprocessor support here
});
