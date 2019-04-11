module.exports = {
    "extends": ["airbnb-base", "plugin:jest/recommended", "plugin:@typescript-eslint/recommended"],
    "parser": "@typescript-eslint/parser",
    rules: {
        strict: 0,
        semi: 2,
        "arrow-parens": [2, "always"],
        "import/no-unresolved": 0, // because typescript already check for it
        "import/extensions": 0,
        "import/prefer-default-export": 0,
        "import/no-extraneous-dependencies": ["error", {
            "devDependencies": [
                "**/*.test.ts",
                "**/testApi.ts",
                '**/*.seed.ts',
                'src/lib/testHelpers.ts',
                'misc/**/*.ts'
            ]
        }],
        "arrow-body-style": 0,
        "max-len": [0],
        "no-empty": ["error", {"allowEmptyCatch": true}],
        "@typescript-eslint/indent": ["error", 2],
        "@typescript-eslint/explicit-function-return-type": 0,
        "@typescript-eslint/no-explicit-any": 0,
        "@typescript-eslint/explicit-member-accessibility": 0,
        "lines-between-class-members": 0,
        "class-methods-use-this": 0,
        "quotes": ["error", "single", {
            "avoidEscape": true,
            "allowTemplateLiterals": true
        }]
    },
    "plugins": [
        "@typescript-eslint",
        "jest"
    ],
    "env": {
        "jest/globals": true
    },
    overrides: {
        files: ['**/*.ts'],
        parser: '@typescript-eslint/parser',
        rules: {
            'no-undef': 'off',
            'no-restricted-globals': 'off'
        }
    }
};