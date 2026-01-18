import type { TarotRarity, TarotCard } from './deck'

export interface Quote {
  text: string
  rarity: TarotRarity
}

export const mbtiQuotes: Record<string, Quote[]> = {
  // Analysts
  INTJ: [
    { text: "效率是唯一的真理，感情只是冗余的变量。", rarity: 'Bronze' },
    { text: "在我的蓝图中，未来早已被精确计算。你要做的，仅仅是跟上步伐。", rarity: 'Silver' },
    { text: "命运蓝图已然闭合。在思维疆域的尽头，不朽意志即是宇宙唯一的真理。", rarity: 'Gold' },
  ],
  INTP: [
    { text: "有趣，这个理论的底层架构似乎存在逻辑漏洞。", rarity: 'Bronze' },
    { text: "如果宇宙只是一个巨大的模拟器，那我就是那个试图寻找源代码的人。", rarity: 'Silver' },
    { text: "逻辑黑洞正在吞噬谬误。作为维度的观测者，我于系统底层架构中窥见真理之影。", rarity: 'Gold' },
  ],
  ENTJ: [
    { text: "平庸是这个世界的瘟疫。只有强者，才能定义规则。", rarity: 'Bronze' },
    { text: "别谈什么运气，那不过是弱者为失败寻找的华丽借口。", rarity: 'Silver' },
    { text: "秩序已然重构。立于权力巅峰，我将以绝对掌控，在永恒版图上刻下铁血执行的契约。", rarity: 'Gold' },
  ],
  ENTP: [
    { text: "为什么不试试相反的路径？常规总是那么令人昏昏欲睡。", rarity: 'Bronze' },
    { text: "逻辑是用来拆解世界的工具，而我，最擅长把旧规则拆成碎片。", rarity: 'Silver' },
    { text: "狂想风暴已至！作为规则粉碎者，我于奇点爆发中统一所有逻辑悖论。", rarity: 'Gold' },
  ],

  // Diplomats
  INFJ: [
    { text: "每个人心中都有一片深渊，我只是那个提灯的人。", rarity: 'Bronze' },
    { text: "命运的丝线交织缠绕，我能看见那最终的终点。", rarity: 'Silver' },
    { text: "提灯守望者见证灵魂共振。温柔而坚定，我即是引渡众生跨越命运的引路人。", rarity: 'Gold' },
  ],
  INFP: [
    { text: "如果梦境比现实更真实，那我们该在哪里醒来？", rarity: 'Bronze' },
    { text: "每一颗流星都是一个未曾诉说的秘密，我负责将它们编织成诗。", rarity: 'Silver' },
    { text: "星辰梦境在纯粹理想国中回响。万物之灵啊，请随我吟诵这属于孤独的史诗。", rarity: 'Gold' },
  ],
  ENFJ: [
    { text: "孤独的人群需要光，而我愿意成为那束引导方向的辉光。", rarity: 'Bronze' },
    { text: "真诚是通往灵魂的唯一捷径。让我们建立一个更美好的世界。", rarity: 'Silver' },
    { text: "辉光领袖指引星轨。于世界的共鸣中，我以奉献与救赎，开启光之导师的天启。", rarity: 'Gold' },
  ],
  ENFP: [
    { text: "嘿！感觉今天会有超棒的事情发生，对吧？", rarity: 'Bronze' },
    { text: "生活不就是一场巨大的派对吗？让我们把每个无聊的瞬间都点燃！", rarity: 'Silver' },
    { text: "奇迹制造者从不谢幕。在灵感的火花中，我将万花筒般的人生编织进梦想的织造。", rarity: 'Gold' },
  ],

  // Sentinels
  ISTJ: [
    { text: "规则的存在是为了确保混乱不会吞噬文明。请按流程操作。", rarity: 'Bronze' },
    { text: "责任比自由更沉重，但也更真实。我将坚守到最后一刻。", rarity: 'Silver' },
    { text: "钢铁律法即是文明基石。作为永恒契约的无误执行者，我将守卫传统的最后一道防线。", rarity: 'Gold' },
  ],
  ISFJ: [
    { text: "安静地守护着身边的人，就是我最大的心愿。", rarity: 'Bronze' },
    { text: "记忆是时间的礼物，我会把它们妥善收藏，直到永远。", rarity: 'Silver' },
    { text: "圣所守护已开启。我是记忆的容器，亦是生命之盾，护佑永恒的温存。", rarity: 'Gold' },
  ],
  ESTJ: [
    { text: "效率、组织、执行。除此之外的讨论都是在浪费生命。", rarity: 'Bronze' },
    { text: "只有建立严密的层级，系统才能发挥出它应有的力量。", rarity: 'Silver' },
    { text: "效率之神在帝国的骨架上降临。作为秩序的捍卫者，我不破铁幕，唯有绝对忠诚。", rarity: 'Gold' },
  ],
  ESFJ: [
    { text: "大家好才是真的好。让我们为了和谐而共同努力吧。", rarity: 'Bronze' },
    { text: "每个人的需求都值得被倾听，我愿意成为连接彼此的桥梁。", rarity: 'Silver' },
    { text: "和谐之桥横跨众星。于情感的港湾中，我将共鸣的纽带系于万家灯火。", rarity: 'Gold' },
  ],

  // Explorers
  ISTP: [
    { text: "话多没用，直接动手解决问题更快。", rarity: 'Bronze' },
    { text: "机械是有灵魂的，它们比人类更诚实，也更容易修补。", rarity: 'Silver' },
    { text: "寂静之刃切开瞬间的永恒。在绝对冷静中，我于机械灵魂的深处抵达极速的终点。", rarity: 'Gold' },
  ],
  ISFP: [
    { text: "色彩是灵魂的语言。让我在这片空白上留下自己的痕迹。", rarity: 'Bronze' },
    { text: "不需要被定义，我只随风起舞，在自然的律动中寻找自由。", rarity: 'Silver' },
    { text: "色彩流浪者听见了万物共鸣。无声的交响中，我以自由的笔触绘出自然的律动。", rarity: 'Gold' },
  ],
  ESTP: [
    { text: "犹豫就会败北。抓住眼前的机会，现在就出发！", rarity: 'Bronze' },
    { text: "风险是最好的调味品。如果不够刺激，那生活还有什么意义？", rarity: 'Silver' },
    { text: "雷鸣先锋已至！我是荒野的统治者，在瞬间爆发的征服快感中，我即是胜利的信徒。", rarity: 'Gold' },
  ],
  ESFP: [
    { text: "聚光灯在哪里，我就在哪里！让我们尽情狂欢！", rarity: 'Bronze' },
    { text: "这一刻的快乐是永恒的。别想明天，把当下的热情燃尽！", rarity: 'Silver' },
    { text: "极光舞者点燃永恒庆典。在生命的赞歌中，我即是舞台中心最亮的星子。", rarity: 'Gold' },
  ],

  // 兜底数据
  UNKNOWN: [
    { text: "命运的齿轮开始转动，谁也无法预知终点。", rarity: 'Bronze' },
    { text: "在星光的指引下，我们正在跨越不可逾越的鸿沟。", rarity: 'Silver' },
    { text: "万物归一，因果环绕。你所寻找的答案，早已镌刻在灵魂深处。", rarity: 'Gold' },
  ]
}

// 实时互动语录
export const interactionQuotes = {
  drawing: [
    "这张...似乎带着某种引力。",
    "指尖传来了命运的震动。",
    "因果正在汇聚。",
    "我听到了星辰的私语。"
  ],
  idle: [
    "犹豫是命运最大的敌人。",
    "时间在指缝间流逝，如同沙漏。",
    "星轨不会等待迟疑之人。",
    "在想什么？命运已经准备好了。",
    "灵魂坚如磐石，即使命运轨迹在重塑。",
    "星轨虽变，初心不改。",
    "你是自己命运的观察者，也是编织者。"
  ],
  result: {
    Bronze: "只是暂时的尘埃，不必在意。",
    Silver: "渐入佳境，命运的轮廓清晰了些。",
    Gold: "看呐，连星辰都在为你闪烁！"
  },
  reforge: {
    start: "逻辑重组中...这次应该能对准焦距。",
    upgrade: "意料之中的优化，这才是完美的图签。",
    noChange: "齿轮磨损了吗？再试一次。",
    mbtiLock: "灵魂之火已锁定，仅重构命运轨迹。",
    lock: "明智的选择。"
  }
}

export const cardComments: Record<string, string[]> = {
  upright: [
    "哦？正位的力量，这预示着某种必然的觉醒。",
    "我能感受到这股能量，它正在修正我们的轨迹。",
    "非常完美，这就是我想要的契机。",
    "光芒正在汇聚，每一步都踏在命运的节点上。",
  ],
  reversed: [
    "逆位的阴影... 命运似乎在开一个并不好笑的玩笑。",
    "扭曲的征兆，我们需要更多的智慧来平息这场波动。",
    "虽然并不顺遂，但这正是重塑自我的机会。",
    "混乱中孕育着新生，不要被眼前的错位所迷惑。",
  ],
}

export const getRandomQuote = (mbti: string, rarity: TarotRarity): string => {
  const quotes = mbtiQuotes[mbti] || mbtiQuotes['UNKNOWN']
  const filtered = quotes.filter(q => q.rarity === rarity)
  return filtered.length > 0 ? filtered[Math.floor(Math.random() * filtered.length)].text : quotes[0].text
}

export const getRandomComment = (isUpright: boolean): string => {
  const list = isUpright ? cardComments.upright : cardComments.reversed
  return list[Math.floor(Math.random() * list.length)]
}

// 根据卡牌等级和MBTI生成个性化反应
export const getCardReaction = (
  _card: TarotCard, 
  _isUpright: boolean, 
  mbti: string,
  cardLevel: number
): string => {
  const reactions: Record<string, Record<number, string[]>> = {
    INTJ: {
      1: ["基础的能量... 勉强可用。", "平庸的牌，但至少方向正确。"],
      2: ["不错，这股力量值得利用。", "卓越的品质，正合我意。"],
      3: ["星轨对齐，不朽意志收束一切。", "命运蓝图已展开！秩序终极形态显现。"]
    },
    INTP: {
      1: ["基础数据，可以分析。", "平庸但可用的信息源。"],
      2: ["有趣的结构，值得深入研究。", "卓越的发现，逻辑清晰。"],
      3: ["逻辑黑洞吞噬所有不确定性。", "维度的观测者已就位，真理无所遁形。"]
    },
    ENTJ: {
      1: ["基础资源，可以整合。", "平庸，但能为我所用。"],
      2: ["卓越的工具，正合我意。", "强大的力量，值得掌控。"],
      3: ["权力巅峰就在脚下。", "秩序已重构，永恒版图已在掌中。"]
    },
    ENTP: {
      1: ["基础素材，可以实验。", "平庸但有趣的可能性。"],
      2: ["卓越的悖论，值得探索。", "强大的逻辑，可以拆解。"],
      3: ["狂想风暴正卷起规则的残骸。", "奇点已爆发，逻辑悖论即是真理。"]
    },
    INFJ: {
      1: ["基础的能量流动...", "平庸但蕴含着深意。"],
      2: ["卓越的洞察，我能感受到。", "强大的共鸣，命运在指引。"],
      3: ["提灯守望者见证灵魂的觉醒。", "温柔而坚定，我们正走向命运的引路之光。"]
    },
    INFP: {
      1: ["基础的情感...", "平庸但真实。"],
      2: ["卓越的美，我能感受到。", "强大的灵感，值得编织。"],
      3: ["星辰梦境在灵魂深处回响。", "这是属于孤独者的史诗，理想国在此建立。"]
    },
    ENFJ: {
      1: ["基础的联系...", "平庸但可以建立桥梁。"],
      2: ["卓越的和谐，值得引导。", "强大的共鸣，可以汇聚。"],
      3: ["辉光领袖指引众生。", "世界的共鸣已达到巅峰，光之导师在此宣告。"]
    },
    ENFP: {
      1: ["基础的可能性...", "平庸但充满潜力！"],
      2: ["卓越的灵感！太棒了！", "强大的能量，值得探索！"],
      3: ["奇迹制造者从不令观众失望。", "灵感的火花已点燃万花筒般的梦想。"]
    },
    ISTJ: {
      1: ["基础的结构...", "平庸但符合规则. "],
      2: ["卓越的秩序，值得维护。", "强大的系统，可以依赖。"],
      3: ["钢铁律法不容丝毫误差。", "文明基石已铸就，永恒契约已生效。"]
    },
    ISFJ: {
      1: ["基础的守护...", "平庸但可以保护。"],
      2: ["卓越的关怀，值得付出。", "强大的守护，可以依赖。"],
      3: ["圣所守护已完全展开。", "记忆的容器将永恒保存这份温存。"]
    },
    ESTJ: {
      1: ["基础的组织...", "平庸但可以管理。"],
      2: ["卓越的效率，值得执行。", "强大的系统，可以优化。"],
      3: ["效率之神在上，系统已达巅峰状态。", "不破铁幕后，唯有绝对的忠诚与秩序。"]
    },
    ESFJ: {
      1: ["基础的和谐...", "平庸但可以建立。"],
      2: ["卓越的协调，值得维护。", "强大的团结，可以依赖。"],
      3: ["和谐之桥连接每一个孤独的灵魂。", "众星之聚，让共鸣照亮情感的港湾。"]
    },
    ISTP: {
      1: ["基础的工具...", "平庸但可以用。"],
      2: ["卓越的机械，值得操作。", "强大的工具，可以修复。"],
      3: ["寂静之刃已出鞘。", "机械的灵魂在瞬间的永恒中轰鸣。"]
    },
    ISFP: {
      1: ["基础的色彩...", "平庸但可以表达。"],
      2: ["卓越的美，值得创作。", "强大的灵感，可以描绘。"],
      3: ["色彩流浪者在自然的律动中漫步。", "无声的交响正在万物共鸣中奏响。"]
    },
    ESTP: {
      1: ["基础的行动...", "平庸但可以尝试。"],
      2: ["卓越的刺激，值得冒险。", "强大的能量，可以征服。"],
      3: ["雷鸣先锋在此宣告胜利。", "征服的快感即是荒野统治者的信条。"]
    },
    ESFP: {
      1: ["基础的快乐...", "平庸但可以享受。"],
      2: ["卓越的庆典，值得参与！", "强大的能量，可以分享！"],
      3: ["极光舞者点燃了永恒的庆典。", "生命的赞歌中，我即是舞台中心的焦点。"]
    },
  }
  
  const mbtiReactions = reactions[mbti] || reactions['INTJ']
  const levelReactions = mbtiReactions[cardLevel] || mbtiReactions[1]
  
  return levelReactions[Math.floor(Math.random() * levelReactions.length)]
}
