import { defineConfig } from '@vscode/test-cli';

export default defineConfig({
	files: 'out/test/extensionSuite/**/*.test.js',
});
