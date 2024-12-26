import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import rbxts from "isentinel-eslint-plugin-roblox-ts";
import prettierRecommended from "eslint-plugin-prettier/recommended";

const config = tseslint.config(
	eslint.configs.recommended,
	tseslint.configs.recommended,
	prettierRecommended,

	{
		languageOptions: {
			parser: tseslint.parser,
			parserOptions: {
				ecmaVersion: "latest",
				sourceType: "module",
				project: "./tsconfig.json",
				ecmaFeatures: { jsx: true },
			},
		},

		plugins: {
			roblox: rbxts,
		},

		rules: {
			// roblox
			"roblox/no-any": "off",
			"roblox/no-enum-merging": "error",
			"roblox/no-for-in": "error",
			"roblox/no-function-expression-id": "error",
			"roblox/no-getters-or-setters": "error",
			"roblox/no-global-this": "error",
			"roblox/no-namespace-merging": "error",
			"roblox/no-null": "error",
			"roblox/no-object-math": "error",
			"roblox/no-prototype": "error",
			"roblox/no-rbx-postfix-new": "error",
			"roblox/no-regex": "error",
			"roblox/no-value-typeof": "error",
			"roblox/no-private-identifier": "error",
			"roblox/no-spread-destructuring": "error",
			"roblox/no-export-assignment-let": "error",
			"roblox/no-preceding-spread-element": "error",
			"roblox/misleading-luatuple-checks": "warn",
			"roblox/lua-truthiness": "warn",
			"roblox/no-array-pairs": "warn",

			// eslint
			"no-debugger": "error",
			"no-labels": "error",
			"no-sequences": "error",
			"no-sparse-arrays": "warn",
			"no-var": "error",
			"no-void": "error",
			"no-with": "error",
			"prefer-rest-params": "error",
			eqeqeq: "error",

			// typescript
			"@typescript-eslint/ban-types": "off",
			"@typescript-eslint/explicit-function-return-type": "off",
			"@typescript-eslint/explicit-module-boundary-types": "off",
			"@typescript-eslint/no-array-constructor": "off",
			"@typescript-eslint/no-empty-function": "off",
			"@typescript-eslint/no-empty-interface": "off",
			"@typescript-eslint/no-namespace": "off",
			"@typescript-eslint/no-non-null-assertion": "off",
			"@typescript-eslint/no-unused-vars": "off",
			"@typescript-eslint/no-var-requires": "off",
		},

		ignores: ["eslint.config.js"],
	},

	{
		rules: {
			"prettier/prettier": "warn",
			"@typescript-eslint/no-empty-object-type": "off",
		},

		ignores: ["out/**"],
	},
);

export default config;
