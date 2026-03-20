# Copilot Instructions

- Prefer alias imports with `@/...` for project source modules.
- Do not introduce relative imports such as `./...` or `../...` for source files when an alias path exists.
- Follow existing TypeScript strictness and avoid `any` unless necessary.
- Keep changes focused and avoid unrelated refactors.
