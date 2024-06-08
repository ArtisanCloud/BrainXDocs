import {baseURI, developUri, guideUri} from "./index";

const prefixGuide = baseURI + "/" + guideUri
const prefixDevelop = baseURI + "/" + developUri

export const sidebar = [
	{
		text: '使用指南',
		items: [
			{text: '什么是BrainX', link: prefixGuide + '/welcome'},
			{
				text: '快速上手',
				collapsible: true, collapsed: true,
				items: [
					{text: '使用预设的机器人', link: prefixGuide + '/quick-start/preset-robot'},
					{text: '创建自己的机器人', link: prefixGuide + '/quick-start/new-bot'},
				]
			},
			{
				text:'核心',link: prefixGuide + '/core/guide',
				collapsible: true, collapsed: true,
				items: [
					{text: '持久化', link: prefixGuide + '/core/persistence'},
					{text: '时间旅行', link: prefixGuide + '/core/time-travel'},
					{text: '移步执行', link: prefixGuide + '/core/async-execution'},
					{text: '流响应', link: prefixGuide + '/core/stream-response'},
					{text: '可视化', link: prefixGuide + '/core/visualization'},
					{text: '可配置', link: prefixGuide + '/core/configuration'},
				]
			},
			{
				text: '机器人Bot使用',
				collapsible: true, collapsed: true,
				items: [
					{text: '介绍', link: prefixGuide + '/bot/introduce'},
					{text: '人设与上下文', link: prefixGuide + '/bot/persona-and-prompt'},
					{text: 'LLM大语言模型', link: prefixGuide + '/bot/llm'},
					{
						text: '知识库',
						collapsible: true, collapsed: true,
						items: [
							{text: '介绍', link: prefixGuide + '/bot/knowledge/introduce'},
							{text: '使用知识库', link: prefixGuide + '/bot/knowledge/usage'},
						],
					},
					{
						text: '记忆',
						collapsible: true, collapsed: true,
						items: [
							{text: '介绍', link: prefixGuide + '/bot/memory/introduce'},
							{text: '变量', link: prefixGuide + '/bot/memory/var'},
							{text: '数据库', link: prefixGuide + '/bot/memory/database'},
							// {text: '表格', link: prefixGuide + '/quick-start/memory/fileBox'},
						],
					},
					{
						text: '技能',
						collapsible: true, collapsed: true,
						items: [
							{
								text: '插件',
								collapsible: true, collapsed: true,
								items: [
									{text: '概述', link: prefixGuide + '/bot/skill/plugin/introduce'},
									{
										text: '创建插件',
										collapsible: true, collapsed: true,
										items: [
											{text: '使用外部api服务', link: prefixGuide + '/bot/skill/plugin/create/api'},
											{text: '使用json或yaml格式', link: prefixGuide + '/bot/skill/plugin/create/json'},
											// {text: '使用外部api服务', link: prefixGuide + '/bot/skill/plugin/create/ide'},
											// {text: '使用外部api服务', link: prefixGuide + '/bot/skill/plugin/create/code'},
											{text: '添加工具', link: prefixGuide + '/bot/skill/plugin/create/add-tool'},
										],
									},
									{text: '使用插件', link: prefixGuide + '/bot/skill/plugin/usage'},
								]
							},
							{
								text: '工作流',
								collapsible: true, collapsed: true,
								items: [
									{text: '介绍', link: prefixGuide + '/bot/skill/workflow/introduce'},
									{text: '使用插件', link: prefixGuide + '/bot/skill/workflow/usage'},
								]
							},
						],
					},

					{text: '欢迎语', link: prefixGuide + '/bot/welcome'},
					{text: '触发器', link: prefixGuide + '/bot/trigger'},
				]
			},
			{
				text:'商店',
				collapsible: true, collapsed: true,
				items: [
					{text: '概述', link: prefixGuide + '/store/introduce'},
					{text: '发布Bot到商店', link: prefixGuide + '/store/publish-bot'},
					{text: '发布插件到商店', link: prefixGuide + '/store/publish-plugin'},
				]
			}
		]
	},
	{
		text: '开发手册',
		items: [
			{text: '开始启动', link: prefixDevelop + '/start'},
		]
	}
];

