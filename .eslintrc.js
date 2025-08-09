import js from '@eslint/js'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import vuePlugin from 'eslint-plugin-vue'
import prettierConfig from 'eslint-config-prettier'

export default [
    js.configs.recommended,
    ...vuePlugin.configs['flat/recommended'],
    prettierConfig,
    {
        files: ['**/*.{js,mjs,cjs,ts,vue}'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
            },
        },
        plugins: {
            '@typescript-eslint': tsPlugin,
        },
        rules: {
            ...tsPlugin.configs.recommended.rules,
            '@typescript-eslint/no-explicit-any': 'warn',
            'vue/script-setup-uses-vars': 'error',
            'no-console': ['warn', { allow: ['warn', 'error'] }],
            'no-debugger': 'error',
        },
    },
    {
        files: ['**/*.vue'],
        languageOptions: {
            parser: vuePlugin.parser,
            parserOptions: {
                parser: tsParser,
            },
        },
    },
]