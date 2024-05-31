// scripts/main.js
document.addEventListener('DOMContentLoaded', function () {
    const codeEditor = document.getElementById('code-editor');
    const preview = document.getElementById('preview');
    const fileSystem = document.getElementById('file-system');

    codeEditor.addEventListener('input', function () {
        updatePreview();
    });

    function updatePreview() {
        const htmlContent = codeEditor.value;
        preview.innerHTML = htmlContent;
    }

    // Attach functions to the window object to make them globally accessible
    window.createNewFolder = function () {
        const folderName = prompt('Enter folder name:');
        if (folderName) {
            const folder = document.createElement('li');
            folder.innerHTML = `<span>${folderName}</span><ul></ul>`;
            folder.classList.add('folder');
            fileSystem.appendChild(folder);
        }
    }

    window.createNewFile = function () {
        const fileName = prompt('Enter file name:');
        if (fileName) {
            const file = document.createElement('li');
            file.innerHTML = `<span>${fileName}</span>`;
            file.classList.add('file');
            fileSystem.appendChild(file);
        }
    }

    // Make folder expandable
    fileSystem.addEventListener('click', function (event) {
        if (event.target.tagName === 'SPAN') {
            const parent = event.target.parentElement;
            if (parent.classList.contains('folder')) {
                parent.classList.toggle('expanded');
            }
        }
    });
});
