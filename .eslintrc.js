module.exports = {
    "extends": [
        'airbnb-typescript',
        "plugin:prettier/recommended",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
        "plugin:promise/recommended",
        "prettier"
    ],
    "plugins": [
        "promise",
        "prettier",
        "react"
    ],
    "rules": {
        "no-underscore-dangle": 0
    },
    "parserOptions": {
        "project": './tsconfig.json'
    }
}
