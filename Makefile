.PHONY: run test test1

run:
	npx tsc && node dist/index.js

test1:
	npx vitest run

test:
	npx vitest