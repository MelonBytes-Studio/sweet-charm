import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import oldTsParser from "@typescript-eslint/parser";
import rbxts from "eslint-plugin-roblox-ts";
import prettierRecommended from "eslint-plugin-prettier/recommended";

const config = tseslint.config(
	eslint.configs.recommended,
	tseslint.configs.recommended,
	rbxts.configs.recommended,
	prettierRecommended,

	{
		languageOptions: {
			parser: oldTsParser,
			parserOptions: {
				ecmaVersion: "latest",
				sourceType: "module",
				project: "./tsconfig.json",
				ecmaFeatures: { jsx: true },
			},
		},

		plugins: {
			"roblox-ts": rbxts,
		},

		rules: {
			"prettier/prettier": "warn",
			"@typescript-eslint/no-empty-object-type": "off",
		},

		ignores: ["out/**"],
	},
);

export default config;
