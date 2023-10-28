const customElements = ['mjx-container'];


export default {
    base: '/documentation/',
    ignoreDeadLinks: true,
    outDir: '../documentation',
    title: 'Documentation',
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
                { text: 'Overview', link: '/pictures-treatment/' },
                { text: 'Details', link: '/pictures-treatment/details' },
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
                        { text: 'Thin profiles', link: '/airfoil/profiles/thin' },
                        { text: 'Thick profiles', link: '/airfoil/profiles/thick' },
                    ],
                },
            ],
        }
    ]
}