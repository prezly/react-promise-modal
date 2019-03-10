dist/index.js: src/index.js node_modules
	npm run build

node_modules: package.json
	npm install
