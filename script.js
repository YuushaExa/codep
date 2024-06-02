document.addEventListener('DOMContentLoaded', () => {
    const files = {
        'index.html': '',
        'style.css': '',
        'script.js': ''
    };

    const fileContentEditor = document.getElementById('file-content');
    const fileList = document.getElementById('file-list');
    const jsPreprocessor = document.getElementById('js-preprocessor');
    const cssPreprocessor = document.getElementById('css-preprocessor');
    const previewFrame = document.getElementById('preview');
    const previewButton = document.getElementById('preview-button');
    const newFileNameInput = document.getElementById('new-file-name');
    const addFileButton = document.getElementById('add-file-button');
    const newFolderNameInput = document.getElementById('new-folder-name');
    const addFolderButton = document.getElementById('add-folder-button');

    let currentFile = 'index.html';
    let typeScriptLoaded = false;
    let scssLoaded = false;

    function saveFileToCache(fileName, content) {
        if ('caches' in window) {
            caches.open('jsfiddle-clone-files').then(cache => {
                const response = new Response(content, {
                    headers: { 'Content-Type': 'text/html' }
                });
                cache.put(new Request(`/${fileName}`, { cache: 'reload' }), response);
            });
        }
    }

    async function loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    async function loadTypeScript() {
        if (!typeScriptLoaded) {
            await loadScript("https://cdnjs.cloudflare.com/ajax/libs/typescript/4.5.5/typescript.min.js");
            typeScriptLoaded = true;
        }
    }

    async function loadSCSS() {
        if (!scssLoaded) {
            await loadScript("https://cdnjs.cloudflare.com/ajax/libs/sass.js/0.11.1/sass.sync.min.js");
            scssLoaded = true;
        }
    }

    async function getTranspiledJs(jsCode) {
        if (jsPreprocessor.value === 'typescript') {
            if (!typeScriptLoaded) {
                await loadTypeScript();
            }
            try {
                return ts.transpile(jsCode);
            } catch (e) {
                console.error('TypeScript transpilation error:', e);
                return `console.error('TypeScript transpilation error:', ${JSON.stringify(e.message)});`;
            }
        }
        return jsCode;
    }

    async function getTranspiledCss(cssCode) {
        if (cssPreprocessor.value === 'scss') {
            if (!scssLoaded) {
                await loadSCSS();
            }
            return new Promise((resolve, reject) => {
                Sass.compile(cssCode, (result) => {
                    if (result.status === 0) {
                        resolve(result.text);
                    } else {
                        console.error('SCSS transpilation error:', result.formatted);
                        resolve(`/* SCSS transpilation error: ${result.formatted} */`);
                    }
                });
            });
        }
        return Promise.resolve(cssCode);
    }

    async function generatePreviewContent() {
        const html = files['index.html'];
        const css = `<style>${await getTranspiledCss(files['style.css'])}</style>`;
        const jsContent = await getTranspiledJs(files['script.js']);
        const js = `<script>${jsContent}\<\/script>`;

        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Preview</title>
                ${css}
            </head>
            <body>
                ${html}
                ${js}
            </body>
            </html>
        `;
    }

    async function updatePreview() {
        const completeContent = await generatePreviewContent();
        const previewDocument = previewFrame.contentDocument || previewFrame.contentWindow.document;
        previewDocument.open();
        previewDocument.write(completeContent);
        previewDocument.close();
    }

    async function openPreviewInNewTab() {
        const completeContent = await generatePreviewContent();
        const newWindow = window.open();
        newWindow.document.open();
        newWindow.document.write(completeContent);
        newWindow.document.close();
    }

    function renderFileList(files, parentElement, level = 0) {
        parentElement.innerHTML = '';
        for (const key in files) {
            const li = document.createElement('li');
            li.textContent = key;
            li.style.marginLeft = `${level * 5}px`;
            li.setAttribute('data-file', key);
            li.addEventListener('click', () => {
                currentFile = key;
                fileContentEditor.value = files[key];
            });

            if (typeof files[key] === 'object') {
                const ul = document.createElement('ul');
                ul.classList.add('nested');
                renderFileList(files[key], ul, level + 1);
                li.appendChild(ul);
            }

            parentElement.appendChild(li);
        }
    }

    fileList.addEventListener('click', event => {
        if (event.target.tagName === 'LI') {
            currentFile = event.target.getAttribute('data-file');
            fileContentEditor.value = files[currentFile];
        }
    });

    fileContentEditor.addEventListener('input', () => {
        files[currentFile] = fileContentEditor.value;
        saveFileToCache(currentFile, fileContentEditor.value);
        updatePreview();
    });

    previewButton.addEventListener('click', openPreviewInNewTab);

    addFileButton.addEventListener('click', () => {
        const fileName = newFileNameInput.value.trim();
        if (fileName && !files[fileName]) {
            files[fileName] = '';
            renderFileList(files, fileList);
            saveFileToCache(fileName, '');
            newFileNameInput.value = '';
        }
    });

    addFolderButton.addEventListener('click', () => {
        const folderName = newFolderNameInput.value.trim();
        if (folderName && !files[folderName]) {
            files[folderName] = {};
            renderFileList(files, fileList);
            saveFileToCache(folderName, '');
            newFolderNameInput.value = '';
        }
    });

    updatePreview();
});
