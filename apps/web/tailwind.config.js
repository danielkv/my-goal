/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        colors: {
            gray: {
                100: '#F5F5F5',
                200: '#D3D3D3',
                300: '#ABABAB',
                400: '#999999',
                500: '#666666',
                600: '#323232',
                700: '#262626',
                800: '#202020',
                900: '#101010',
            },
            red: {
                50: '#FDB9C4',
                100: '#FB9AAA',
                200: '#F87A8F',
                300: '#F55C75',
                400: '#F23E5B',
                500: '#EE2042',
                600: '#C81734',
                700: '#A00F27',
                800: '#77091B',
                900: '#4C0511',
            },
            black: '#000000',
            white: '#ffffff',
        },

        extend: {
            width: {
                a4: '210mm',
            },
            height: {
                a4: '297mm',
            },
            backgroundImage: {
                'intro-section': "url('/images/bg-init.png')",
                'contact-section': "url('/images/contact.png')",
            },
        },
    },
    variants: {
        fontSize: ({ after }) => after(['em']),
    },
    plugins: [
        require('tailwindcss/plugin')(function ({ addVariant }) {
            addVariant('em', ({ container }) => {
                container.walkRules((rule) => {
                    rule.selector = `.em\\:${rule.selector.slice(1)}`
                    rule.walkDecls((decl) => {
                        decl.value = decl.value.replace('rem', 'em')
                    })
                })
            })
        }),
    ],
}
