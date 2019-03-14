dist/react-promise-modal.min.js: dist/react-promise-modal.js
	npm run minify

dist/react-promise-modal.js: src/index.js node_modules
	npm run dist

node_modules: package.json
	npm install

publish: dist/react-promise-modal.js dist/react-promise-modal.min.js
	npm publish
