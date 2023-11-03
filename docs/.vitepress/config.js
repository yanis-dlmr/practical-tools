const customElements = ['mjx-container'];


export default {
    base: '/documentation/',
    ignoreDeadLinks: true,
    outDir: '../documentation',
    title: 'Practical Tools',
    description: 'Trying to make a perfect documentation to make that website amazing!',
    themeConfig: {
        logo: '/favicon.ico',
        sidebar: {
            '/': getMainSidebar(),
        },
        search: {
            provider: 'local',
            options: {
                miniSearch: {
                    /**
                     * @type {Pick<import('minisearch').Options, 'extractField' | 'tokenize' | 'processTerm'>}
                     */
                    options: {
                    /* ... */
                    },
                    /**
                     * @type {import('minisearch').SearchOptions}
                     * @default
                     * { fuzzy: 0.2, prefix: true, boost: { title: 4, text: 2, titles: 1 } }
                     */
                    searchOptions: {
                    /* ... */
                    }
                }
            }
        },
    },
    markdown: {
        config: (md) => {
            md.use(require('markdown-it-mathjax3'));
        },
    },
    vue: {
        template: {
            compilerOptions: {
                isCustomElement: (tag) => customElements.includes(tag),
            },
        },
    }
}


function getMainSidebar() {
    return [
        {
            text: 'What is that website',
            items: [
                { text: 'Overview', link: '/about/' },
                { text: 'Contact', link: '/about/contact' }
            ],
        },
        {
            text: 'Pictures Treatment',
            items: [
                { text: 'Overview', link: '/pictures/' }
            ],
        },
        {
            text: 'Airfoil analysis',
            items: [
                { text: 'Overview', link: '/airfoil/' },
                {
                    text: 'Profiles',
                    collapsed: true,
                    items: [
                        { text: 'Overview', link: '/airfoil/profiles/' },
                        { text: 'NACA 4-digits', link: '/airfoil/profiles/naca-4-digits' },
                        { text: 'NACA 5-digits', link: '/airfoil/profiles/naca-5-digits' },
                    ],
                },
                {
                    text: 'Theorical approach',
                    collapsed: true,
                    items: [
                        { text: 'Overview', link: '/airfoil/theorical-approach/' },
                        { text: 'Thin Airfoil Theory', link: '/airfoil/theorical-approach/thin' },
                        { text: 'Vortex Panel Method', link: '/airfoil/theorical-approach/vortex-panel' },
                    ],
                },
            ],
        }
    ]
}