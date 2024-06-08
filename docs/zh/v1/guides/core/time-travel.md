---
title: 获取/更新状态
date: 2024-06-04
---

# 获取/更新状态

一旦你开始对图进行检查点记录，你就可以在任何时候轻松地获取或更新代理的状态。

这样做有几个好处：

1. 你可以在中断到用户时展示状态，让他们接受一个动作。
2. 你可以倒回流程图，来重现或避免问题。
3. 你可以修改状态，来嵌入你的代理到一个更大的系统中，或者让用户更好地控制其行为。

用于实现这些功能的关键方法是：

[get_state](https://langchain-ai.github.io/langgraph/reference/graphs/#langgraph.graph.graph.CompiledGraph.get_state)：从目标配置中获取值
[update_state](https://langchain-ai.github.io/langgraph/reference/graphs/#langgraph.graph.graph.CompiledGraph.update_state)：将给定的值应用到目标状态上

注意：这需要传入一个检查点。

以下是一个快速示例。

> 注意：在本教程中，我们将从头开始创建我们的代理，以保持透明（但冗长）。你也可以使用 create_react_agent(model, tools=tool,
> checkpointer=checkpointer)
> [（API 文档）](https://langchain-ai.github.io/langgraph/reference/prebuilt/#create_react_agent)构造函数实现类似的功能。
> 如果你习惯于 LangChain
> 的 [AgentExecutor](https://python.langchain.com/v0.1/docs/modules/agents/concepts/#agentexecutor) 类，这可能更合适。

## 设置

安装依赖包

```shell
!pip install --quiet -U langgraph langchain_anthropic

```

接下来，我们需要设置 OpenAI（我们将使用的 LLM）和 Tavily（我们将使用的搜索工具）的 API 密钥。

```python
import os
import getpass

def _set_env(var: str):
    if not os.environ.get(var):
        os.environ[var] = getpass.getpass(f"{var}: ")

_set_env("ANTHROPIC_API_KEY")

```


## 设置状态

State状态是所有节点的接口。

```python

from typing_extensions import TypedDict
from typing import Annotated
from langgraph.graph.message import add_messages

# Add messages essentially does this with more
# robust handling
# def add_messages(left: list, right: list):
#     return left + right


class State(TypedDict):
    messages: Annotated[list, add_messages]

```


## 设置工具

我们首先会定义我们想要使用的工具。对于这个简单的示例，我们将创建一个占位符搜索引擎。然而，创建自己的工具非常简单 - 请参阅这里的文档以了解如何操作。

```python

from langchain_core.tools import tool


@tool
def search(query: str):
    """Call to surf the web."""
    # This is a placeholder for the actual implementation
    return ["The weather is cloudy with a chance of meatballs."]


tools = [search]

```


现在我们可以创建我们的工具节点[（ToolNode）](https://langchain-ai.github.io/langgraph/reference/prebuilt/?h=tool+node#create_react_agent)。这个对象实际上运行了 LLM 要求使用的工具（也称为函数）。


```python

from langgraph.prebuilt import ToolNode

tool_node = ToolNode(tools)

```

## 设置模型

现在我们需要加载聊天模型来支持我们的代理。对于下面的设计，它必须满足两个条件：

* 它应该能够处理消息（因为我们的状态包含一系列聊天消息）
* 它应该能够处理工具调用。

> 注意：这些模型要求并不是使用 LangGraph 的通用要求 - 它们只是这个示例的要求。


```python
from langchain_openai import ChatOpenAI

temperature = 0.5
streaming = False

# We will set streaming=True so that we can stream tokens
# See the streaming section for more information on this.
llm_name = 'gpt-3.5-turbo'
OPENAI_API_KEY="YOU_OPENAPI_KEY"

model = ChatOpenAI(
        model=llm_name,
        temperature=temperature,
        streaming=streaming,
        api_key=OPENAI_API_KEY,
    )

```

在完成这些操作后，我们应确保模型知道它可以调用这些工具。

我们可以通过将 LangChain 工具转换为适用于 OpenAI 函数调用的格式，然后将它们绑定到模型类来实现这一点

```python

model = model.bind_tools(tools)

```


## 定义工作流程图

现在我们需要在我们的流程图中定义几个不同的节点。在 langgraph 中，一个节点可以是一个函数function或可运行runnable的对象。对于这个任务，我们需要两个主要的节点：

1. 代理节点：负责决定是否要执行某些操作。
2. 调用工具的函数节点：如果代理决定执行某些操作，那么这个节点将执行该操作。

我们还需要定义一些边。其中一些边可能是有条件的。它们之所以有条件，是因为根据节点的输出，可能会采取多种路径之一。所采取的路径直到运行该节点时才知道（由 LLM 决定）。

1. 条件边：在调用代理之后，我们应该执行以下操作之一：

a. 如果代理说要采取行动，那么应该调用函数来调用工具。
b. 如果代理说它已经完成了，那么它应该结束。

2. 普通边：在调用工具后，应该总是返回到代理，以决定接下来要做什么。

让我们来定义这些节点，以及一个函数来决定采用哪种条件边。


```python

from typing import Literal


# Define the function that determines whether to continue or not
def should_continue(state: State) -> Literal["continue", "end"]:
    last_message = state["messages"][-1]
    # If there is no function call, then we finish
    if not last_message.tool_calls:
        return "end"
    # Otherwise if there is, we continue
    else:
        return "continue"

```

现在我们可以把所有的东西放在一起，定义图了！


```python
from langgraph.graph import StateGraph, END

# Define a new graph
workflow = StateGraph(State)


# Define the two nodes we will cycle between
def call_model(state: State) -> State:
    return {"messages": model.invoke(state["messages"])}


workflow.add_node("agent", call_model)
workflow.add_node("action", tool_node)

# Set the entrypoint as `agent`
# This means that this node is the first one called
workflow.set_entry_point("agent")

# We now add a conditional edge
workflow.add_conditional_edges(
    # First, we define the start node. We use `agent`.
    # This means these are the edges taken after the `agent` node is called.
    "agent",
    # Next, we pass in the function that will determine which node is called next.
    should_continue,
    # Finally we pass in a mapping.
    # The keys are strings, and the values are other nodes.
    # END is a special node marking that the graph should finish.
    # What will happen is we will call `should_continue`, and then the output of that
    # will be matched against the keys in this mapping.
    # Based on which one it matches, that node will then be called.
    {
        # If `tools`, then we call the tool node.
        "continue": "action",
        # Otherwise we finish.
        "end": END,
    },
)

# We now add a normal edge from `tools` to `agent`.
# This means that after `tools` is called, `agent` node is called next.
workflow.add_edge("action", "agent")

```

## 持久化

要添加持久化功能，我们在编译图时传入一个检查点。

```python

from langgraph.checkpoint.sqlite import SqliteSaver

memory = SqliteSaver.from_conn_string(":memory:")

```

```python

# Finally, we compile it!
# This compiles it into a LangChain Runnable,
# meaning you can use it as you would any other runnable
app = workflow.compile(checkpointer=memory)

```

```python

from IPython.display import Image, display

try:
    display(Image(app.get_graph().draw_mermaid_png()))
except:
    # This requires some extra dependencies and is optional
    pass
    
```

## 与代理交互

现在我们可以与代理进行交互，并看到它记得之前的消息！

```python
from langchain_core.messages import HumanMessage

config = {"configurable": {"thread_id": "2"}}
input_message = HumanMessage(content="hi! I'm bob")
for event in app.stream({"messages": [input_message]}, config, stream_mode="values"):
    event["messages"][-1].pretty_print()
```

================================ Human Message =================================

hi! I'm bob
================================== Ai Message ==================================

Hello Bob! How can I assist you today?



在这里，你可以看到 "agent" 节点已经运行，然后 "should_continue" 返回了 "end"，所以图在那里停止执行。

现在让我们获取当前状态。


```python
app.get_state(config).values

```
{'messages': [HumanMessage(content="hi! I'm bob", id='7e0283ec-aa94-4f3c-9478-3480cffa9c8b'),
AIMessage(content='Hello Bob! How can I assist you today?', response_metadata={'token_usage': {'completion_tokens': 11, 'prompt_tokens': 48, 'total_tokens': 59}, 'model_name': 'gpt-3.5-turbo', 'system_fingerprint': None, 'finish_reason': 'stop', 'logprobs': None}, id='run-b9ddc8b7-5e69-42cd-bbeb-bd99c8d5ab9d-0', usage_metadata={'input_tokens': 48, 'output_tokens': 11, 'total_tokens': 59})]}

当前状态是我们之前看到的两条消息：
1. 我们发送的 HumanMessage，
2. 我们从模型那里收到的 AIMessage。

下一个值是空的，因为图已经终止（转移到了 end）。


```python
app.get_state(config).next

```
()

图在没有中断的情况下到达了终点，所以下一个节点的列表为空。

## 让它执行一下工具吧。

```python
config = {"configurable": {"thread_id": "2"}}
input_message = HumanMessage(content="what is the weather in sf currently")
for event in app.stream({"messages": [input_message]}, config, stream_mode="values"):
    event["messages"][-1].pretty_print()
```

================================ Human Message =================================

what is the weather in sf currently
================================== Ai Message ==================================
Tool Calls:
search (call_Zi2dTaubStppBo6u1eXlIDRf)
Call ID: call_Zi2dTaubStppBo6u1eXlIDRf
Args:
query: weather in San Francisco
================================= Tool Message =================================
Name: search

["The weather is cloudy with a chance of meatballs."]
================================== Ai Message ==================================

Currently, the weather in San Francisco is cloudy with a chance of meatballs. How can I help you further, Bob?


我们可以看到它计划执行工具（即 "agent" 节点），然后 "should_continue" 边返回了 "continue"，所以我们继续到达了 "action" 节点，它执行了工具，然后 "agent" 节点发出了最终响应，导致 "should_continue" 边返回了 "end"。让我们看看如何能够更好地控制这一过程。

## 在工具前面暂停

在下面的代码中，我们将添加 interrupt_before=["action"]，这意味着在执行任何操作之前我们会暂停。这是一个很好的时机，允许用户纠正和更新状态！当你想要让人在回路中验证（和可能更改）要执行的操作时，这非常有用


```python
app_w_interrupt = workflow.compile(checkpointer=memory, interrupt_before=["action"])

```

```python
config = {"configurable": {"thread_id": "4"}}
input_message = HumanMessage(content="what is the weather in sf currently")
for event in app_w_interrupt.stream(
    {"messages": [input_message]}, config, stream_mode="values"
):
    event["messages"][-1].pretty_print()
```

================================ Human Message =================================

what is the weather in sf currently
================================== Ai Message ==================================
Tool Calls:
search (call_WAOLl8z59LBse2PwVl0homnX)
Call ID: call_WAOLl8z59LBse2PwVl0homnX
Args:
query: weather in San Francisco
search (call_uH7sqqFfKTDHsNqbiU7mhecT)
Call ID: call_uH7sqqFfKTDHsNqbiU7mhecT
Args:
query: current weather in San Francisco


这次执行了与之前相同的 "agent" 节点，你可以在 LangSmith 跟踪中看到 "should_continue" 返回了 "continue"，但根据我们上面的设置，它暂停了执行。

请注意，这次下一个值填充了 "action"。这意味着如果我们恢复图的执行，它将从动作节点开始。

```python
current_values = app_w_interrupt.get_state(config)
current_values.next
```

('action',)

因为我们要求在达到动作节点之前中断图的执行，如果我们要恢复执行，下一个要执行的节点将是 "action" 节点。

```python
current_values.values["messages"][-1].tool_calls

```

[{'name': 'search',
'args': {'query': 'weather in San Francisco'},
'id': 'call_WAOLl8z59LBse2PwVl0homnX'},
{'name': 'search',
'args': {'query': 'current weather in San Francisco'},
'id': 'call_uH7sqqFfKTDHsNqbiU7mhecT'}]

```python
to_replay.next

```
('action',)

要从这个位置重新播放，我们只需要将其配置传递回代理即可。

```python
for event in app_w_interrupt.stream(None, to_replay.config):
    for v in event.values():
        print(v)
```

{'messages': [ToolMessage(content='["The weather is cloudy with a chance of meatballs."]', name='search', tool_call_id='call_gEPPBax3RvUKClkbwJY5bE97')]}
{'messages': AIMessage(content='The current weather in San Francisco is cloudy with a chance of meatballs.', response_metadata={'token_usage': {'completion_tokens': 16, 'prompt_tokens': 85, 'total_tokens': 101}, 'model_name': 'gpt-3.5-turbo', 'system_fingerprint': None, 'finish_reason': 'stop', 'logprobs': None}, id='run-81d55461-d330-4c5b-842e-ade4682c3b0e-0', usage_metadata={'input_tokens': 85, 'output_tokens': 16, 'total_tokens': 101})}

这与之前的运行类似，只是这次使用了原始的搜索查询，而不是我们修改过的查询。

分支出一个过去的状态

使用 LangGraph 的检查点记录，你不仅可以重新播放过去的状态，还可以从先前的位置分支出来，让代理探索替代的轨迹，或者让用户“版本控制”工作流中的更改。

```python

from langchain_core.messages import AIMessage

branch_config = app_w_interrupt.update_state(
    to_replay.config,
    {
        "messages": [
            AIMessage(content="All done here!", id=to_replay.values["messages"][-1].id)
        ]
    },
)
```

```python
branch_state = app_w_interrupt.get_state(branch_config)

```

```python
branch_state.values

```
{'messages': [HumanMessage(content='what is the weather in sf currently', id='2b184b10-5de1-40e2-9658-3e8457d3cf14'),
AIMessage(content='All done here!', id='run-bb48c5d1-6232-4c4a-af09-b68fa958c1e8-0')]}

```python

branch_state.next

```

()

这显示了现在的 "should_continue" 边对这个替换的消息做出了反应，现在将结果更改为 "end"，从而结束了计算。
