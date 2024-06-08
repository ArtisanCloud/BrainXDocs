import {defineConfig} from 'vitepress'
import {navbar} from "../navbar";
import {sidebar} from "../sidebar";


// https://vitepress.dev/reference/site-config
export default defineConfig({
	title: "BrainX Docs",
	description: "A LLM Bots Documentation",
	themeConfig: {
		// https://vitepress.dev/reference/default-theme-config
		logo: "/images/logo-small.png", siteTitle: "BrainX",
		nav: navbar,
		sidebar: sidebar,

		socialLinks: [
			{icon: 'github', link: 'https://github.com/ArtisanCloud/BrainX'}
		],

		footer: {
			message: 'Released under the Apache-2.0 license',
			copyright: `Copyright © 2021-${new Date().getFullYear()} ArtisanCloud`
		}
	}
})
