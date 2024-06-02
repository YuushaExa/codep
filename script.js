   const jsPreprocessor = document.getElementById('js-preprocessor');
            const cssPreprocessor = document.getElementById('css-preprocessor');
            
            let typeScriptLoaded = false;
            let scssLoaded = false;

            function loadScript(src, callback) {
                const script = document.createElement('script');
                script.src = src;
                script.onload = callback;
                document.head.appendChild(script);
            }

            function loadTypeScript() {
                if (!typeScriptLoaded) {
                    loadScript("https://cdnjs.cloudflare.com/ajax/libs/typescript/4.5.5/typescript.min.js", () => {
                        typeScriptLoaded = true;
                        updatePreview();
                    });
                }
            }

            function loadSCSS() {
                if (!scssLoaded) {
                    loadScript("https://cdnjs.cloudflare.com/ajax/libs/sass.js/0.11.1/sass.sync.min.js", () => {
                        scssLoaded = true;
                        updatePreview();
                    });
                }
            }

            function getTranspiledJs(jsCode) {
                if (jsPreprocessor.value === 'typescript') {
                    if (!typeScriptLoaded) {
                        loadTypeScript();
                        return '';
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

            function getTranspiledCss(cssCode) {
                if (cssPreprocessor.value === 'scss') {
                    if (!scssLoaded) {
                        loadSCSS();
                        return '';
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
