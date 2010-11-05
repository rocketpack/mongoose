
EXPRESSO = support/expresso/bin/expresso -I lib --serial

TESTS = tests/*.test.js

test:
	@$(EXPRESSO) $(TESTS) $(TEST_FLAGS)

test-cov:
	@$(MAKE) TEST_FLAGS=--cov test

benchmark:
	@node benchmark/bm.js

.PHONY: test test-cov benchmark
