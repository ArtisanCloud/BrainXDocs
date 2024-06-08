import {baseURI, developUri, guideUri, version} from "./index";


export const navbar = [
	{text: '首页', link: '/'},
	{
		text: '使用指南',
		link: baseURI + '/' + guideUri + '/welcome',
		// activeMatch: `^\/zh\/(start)\/(?!qa)`
		activeMatch: '^' + baseURI + '/(' + guideUri + ')/'
	},
	{
		text: '开发手册',
		link: baseURI + '/' + developUri + '/start',
		// activeMatch: `^\/zh\/(start)\/(?!qa)`
		activeMatch: '^' + baseURI + '/(' + developUri + ')/'
	},

]


