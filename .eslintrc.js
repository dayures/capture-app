const commonRules = {
    indent: [2, 4],
    'max-len': [
        1,
        120,
        4,
        {
            ignoreComments: true,
            ignoreUrls: true,
            ignorePattern: '^\\s*var\\s.+=\\s*require\\s*\\(',
        },
    ],
    complexity: [1, 8],
    'no-prototype-builtins': 'off',
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    'comma-dangle': [
        'error',
        {
            arrays: 'always-multiline',
            objects: 'always-multiline',
            imports: 'always-multiline',
            exports: 'always-multiline',
            functions: 'always-multiline',
        },
    ],
    'no-multi-spaces': ['error', { ignoreEOLComments: true }],
    'no-return-assign': ['error', 'except-parens'],
    'react/jsx-indent': [2, 4],
    'react/jsx-indent-props': [2, 4],
    'react/prefer-es6-class': [1, 'always'],
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
    'react/no-unused-prop-types': [2, { skipShapeProps: true }],
    'react/forbid-prop-types': [0],
    'no-param-reassign': 0,
    'react/prop-types': 0,
    'import/prefer-default-export': 0,
    'react/prefer-stateless-function': 0,
    'no-unused-expressions': 0,
    'no-unused-vars': [
        'error',
        {
            vars: 'all',
            args: 'after-used',
            ignoreRestSiblings: true,
        },
    ],
    'react/jsx-no-bind': 0,
    'react/require-default-props': 0,
    'import/no-extraneous-dependencies': 'off',
    'react/sort-comp': [
        2,
        {
            order: [
                'static-methods',
                'type-annotations',
                'lifecycle',
                'everything-else',
                'render',
            ],
            groups: {
                lifecycle: [
                    'displayName',
                    'propTypes',
                    'contextTypes',
                    'childContextTypes',
                    'mixins',
                    'statics',
                    'defaultProps',
                    'constructor',
                    'getDefaultProps',
                    'getInitialState',
                    'state',
                    'getChildContext',
                    'UNSAFE_componentWillMount',
                    'componentDidMount',
                    'UNSAFE_componentWillReceiveProps',
                    'shouldComponentUpdate',
                    'UNSAFE_componentWillUpdate',
                    'componentDidUpdate',
                    'componentWillUnmount',
                ],
            },
        },
    ],
    'react-hooks/exhaustive-deps': 'error',
    camelcase: [
        'error',
        {
            properties: 'never',
            allow: [
                'UNSAFE_componentWillMount',
                'UNSAFE_componentWillReceiveProps',
                'UNSAFE_componentWillUpdate',
            ],
        },
    ],
    'import/extensions': [
        'error',
        'never',
    ],
};

const config = {
    parser: '@babel/eslint-parser',
    parserOptions: {
        ecmaVersion: 2017,
        sourceType: 'module',
        babelOptions: {
            presets: ['@babel/preset-react'],
        },
    },
    extends: [
        'airbnb',
        'plugin:flowtype/recommended',
        'plugin:react-hooks/recommended',
        'react-app',
    ],
    plugins: ['flowtype'],
    env: {
        browser: true,
        jest: true,
    },
    globals: {
        cy: true,
        before: true,
        document: true,
        window: true,
        it: true,
        expect: true,
        appPackage: true,
        Given: true,
        When: true,
        Then: true,
        And: true,
        Cypress: true,
    },
    rules: { ...commonRules },
    settings: {
        'import/resolver': {
            node: {
                extensions: ['.js', '.mjs', '.ts', '.tsx'],
            },
            webpack: {
                config: 'config/eslint/webpack.config.js',
            },
        },
        'import/core-modules': [
            'rxjs/operators',
        ],
    },
    overrides: [
        {
            files: ['**/*.ts', '**/*.tsx'],
            parserOptions: { project: './tsconfig.json' },
            plugins: [
                '@typescript-eslint',
                'react',
                'react-hooks',
            ],
            extends: [
                'airbnb-typescript',
                'eslint:recommended',
                'plugin:@typescript-eslint/recommended',
            ],
            rules: {
                ...commonRules,
                indent: 'off',
                '@typescript-eslint/indent': [2, 4, { SwitchCase: 1 }],
                '@typescript-eslint/no-explicit-any': 0,
                'no-use-before-define': 'off',
                '@typescript-eslint/no-use-before-define': ['error'],
                'react/jsx-wrap-multilines': 'error',
                'react/prefer-es6-class': [1, 'always'],
                'no-unused-vars': 'off',
                '@typescript-eslint/no-unused-vars': ['error',
                    {
                        vars: 'all',
                        args: 'after-used',
                        ignoreRestSiblings: true,
                    },
                ],
                '@typescript-eslint/explicit-module-boundary-types': 'off',
                '@typescript-eslint/space-before-blocks': 0,
                'flowtype/no-types-missing-file-annotation': 0,
            },
        },
    ],
};

module.exports = config;
