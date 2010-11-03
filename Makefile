
EXPRESSO = support/expresso/bin/expresso -I lib --serial

<<<<<<< HEAD
TESTS = tests/*.js
=======
TESTS = tests/*.test.js
>>>>>>> f0f9a7c750e53d330a08514f45b8a7639a0c3b7c

test:
	@$(EXPRESSO) $(TESTS) $(TEST_FLAGS)

test-cov:
	@$(MAKE) TEST_FLAGS=--cov test

benchmark:
	@node benchmark/bm.js

.PHONY: test test-cov benchmark