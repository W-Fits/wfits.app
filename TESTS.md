# Testing Guide

## Running All Tests

Use `turbo` to execute all tests across apps and packages:

```bash
turbo test
```

This command will run tests in both `/apps` and `/packages`.

## Running Tests for a Specific Folder
To test a single project within /apps or /packages, use pnpm:

```bash
pnpm test --filter <folder-name>
```

> Replace <folder-name> with the name of the specific app or package directory (e.g., web or the name of a Python package).

## Testing Frameworks

Use **Jest** for **JavaScript/TypeScript** testing:
- Tests direcory: `__tests__` 
- Tests file naming convetion: `*.test.ts/tsx` 

Use **Pytest** for **Python** testing:
- Tests direcory: `tests` 
- Tests file naming convetion: `test_*.py` 