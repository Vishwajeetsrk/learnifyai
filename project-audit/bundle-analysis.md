# Bundle Analysis

Vite has chunked the application into roughly ~90 asynchronous \`.mjs\` payload blocks ensuring that heavy integrations like \`html2canvas\` and \`xlsx\` only load when requested by the browser.
