import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'
import globals from 'globals'
import pluginVue from 'eslint-plugin-vue'
import css from '@eslint/css'
import { defineConfig } from 'eslint/config'

import eslintPluginPrettier from 'eslint-plugin-prettier/recommended'

const compat = new FlatCompat()

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,vue}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true }
      }
    }
  },
  pluginVue.configs['flat/essential'],
  { files: ['**/*.css'], plugins: { css }, language: 'css/css', extends: ['css/recommended'] },
  eslintPluginPrettier,
  compat.config({ extends: ['./.eslintrc-auto-import.json'] }),
  {
    rules: {
      'vue/multi-word-component-names': 'off'
    }
  }
])
