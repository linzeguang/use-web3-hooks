import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { globalIgnores } from 'eslint/config'
import eslintPluginImport from 'eslint-plugin-import'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import unusedImports from 'eslint-plugin-unused-imports'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser
    },
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite
    ],
    plugins: {
      import: eslintPluginImport,
      'simple-import-sort': simpleImportSort,
      'unused-imports': unusedImports
    },
    rules: {
      // === TypeScript ===
      '@typescript-eslint/no-empty-object-type': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',

      // === unused-imports ===
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': 'warn',

      // === import ===
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error'
    }
  }
])
