---
title: 核心概念
date: 2024-06-04
---

# 概述

由于BrainX是基于LangGraph的UI系统，我们将介绍LangGraph的核心概念。

如果你已经很了解LangGraph了，或者对核心概念没什么兴趣，只想知道如何使用BrainX，那么请直接进入[创建Bot使用](../bot/introduce.md)

# 核心概念

在构建人工智能工作流时，核心问题旨在帮助开发者解决常见问题，特别是使用[ReAct](./react.md)风格的代理和工具调用时需要注意的关键点。

以下是这些核心概念的详细解释：

* [持久化](./persistence.md)（Persistence）：为图（graph）提供“记忆”和弹性，通过保存和加载状态使得系统可以记住历史状态和恢复工作流。
* [时间旅行](./time-travel.md)（Time Travel）：在图状态历史中导航和操作，提供一种机制来回溯和修改状态。
* [异步执行](./async-execution.md)（Async Execution）：异步运行节点，以提高性能，特别是在处理大量数据或长时间运行的任务时。
* [流式响应](./stream-response.md)（Streaming Responses）：实时流式传输代理响应，使用户可以即时接收和处理数据，而不必等待完整响应。
* [可视化](./visualization.md)（Visualization）：直观地展示图的结构和数据流，帮助开发者理解和调试复杂的工作流。
* [配置](./configuration.md)（Configuration）：指示图可以交换可配置组件，使得系统可以根据不同需求进行定制和调整。

## 设计模式（Design Patterns）

在构建和管理复杂的人工智能工作流时，设计模式（Design Patterns）是一套有效的解决方案，它们为常见问题提供了经过验证的方法和最佳实践。

以下是一些常见设计模式的详细说明：

* [子图](./subgraph.md)（Subgraphs）：在一个更大的图中组合子图，使得复杂的工作流模块化和可重用。
* [分支](./branching.md)（Branching）：在图中创建分支逻辑，以实现并行节点执行，提高任务处理的效率。
* [Map-Reduce](./map-reduce.md) 模式 ：将状态的**不同视图分支**出去进行并行节点执行（甚至对同一节点进行并行 N 次），然后汇总结果。
* [人工介入](./human-in-the-loop.md)（Human-in-the-loop）：将人工反馈和干预纳入工作流中，使得系统能够在关键节点通过人工判断和调整来提高处理效果。

在基于 LangChain 的 AgentExecutor 配置中，这些模式和技巧可以有效帮助你在工作流中应用 ReAct
风格的代理，特别是在需要调用工具和处理动态数据时。以下是对这些示例的详细解释和实现方法：

* [强制调用工具优先](./force-calling-a-tool-first.md)（Force Calling a Tool First）：在将控制权交给 ReAct
  代理之前，定义一个固定的工作流来首先调用一个工具。

* [传递运行时值给工具](./pass-run-time-values-to-tools.md)（Pass Run Time Values to Tools）：将仅在运行时才知道的值（如请求者的用户ID）传递给工具。

* [动态直接返回](./dynamic-direct-return.md) Dynamic Direct Return（Dynamic Direct
  Return）：让语言模型决定图在运行一个工具后是否应该结束，或者是否应该继续检查输出并继续执行。

* [生成结构化响应](./respond-in-structured-format.md)（Respond in Structured
  Format）：让语言模型使用工具或填充模式来提供结构化内容的用户响应，这在代理需要生成结构化数据时特别有用。

* [管理代理步骤](./managing-agent-steps.md)（Managing Agent Steps）：格式化工作流的中间步骤，以便代理能够有效地处理和管理这些步骤。

## 使用 Pydantic 模型定义状态（Pydantic State）

使用 Pydantic 模型来定义状态，可以确保状态具有明确的结构和数据验证机制。这种方法能够提高系统的稳定性和可靠性，尤其是在处理复杂数据结构和需要严格数据验证的场景中。

## 使用结构化输出（Structured Output）

生成结构化输出可以确保代理或工具返回的数据具有明确的格式，特别是在需要进一步处理或分析数据时非常有用。结构化输出可以是
JSON、XML 或其他格式的数据结构。
