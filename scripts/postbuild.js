import fs from 'node:fs';
import path from 'node:path';

const clientAssetsDir = path.join(process.cwd(), 'dist', 'client', 'assets');
const distClientDir = path.join(process.cwd(), 'dist', 'client');

if (!fs.existsSync(clientAssetsDir)) {
  console.error('dist/client/assets directory does not exist!');
  process.exit(1);
}

const files = fs.readdirSync(clientAssetsDir);

const jsFile = files.find((f) => f.startsWith('index-') && f.endsWith('.js'));
const cssFile = files.find((f) => f.startsWith('styles-') && f.endsWith('.css'));

console.log(`Found JS bundle: ${jsFile}`);
console.log(`Found CSS bundle: ${cssFile}`);

const indexHtmlContent = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <link rel="manifest" href="/manifest.json" />
    <meta name="theme-color" content="#10b981" />
    <title>QuizForge — Oracle PaaS Training</title>
    ${cssFile ? `<link rel="stylesheet" href="/assets/${cssFile}">` : ''}
  </head>
  <body class="bg-background text-foreground antialiased">
    <div id="root"></div>
    ${jsFile ? `<script type="module" src="/assets/${jsFile}"></script>` : ''}
  </body>
</html>
`;

fs.writeFileSync(path.join(distClientDir, 'index.html'), indexHtmlContent);
console.log('Successfully generated dist/client/index.html with production bundles!');
