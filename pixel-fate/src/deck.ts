export type TarotType = 'Major' | 'Minor'
export type TarotSuit = 'Wands' | 'Cups' | 'Swords' | 'Pentacles' | null
export type MBTIDimension = 'E/I' | 'S/N' | 'T/F' | 'J/P'

// 导出类型
export type TarotRarity = 'Bronze' | 'Silver' | 'Gold'

// 同时导出值，确保运行时可用
export const TarotRarityValues = {
  Bronze: 'Bronze' as TarotRarity,
  Silver: 'Silver' as TarotRarity,
  Gold: 'Gold' as TarotRarity,
}

export interface TarotCard {
  id: number
  name: string
  type: TarotType
  suit: TarotSuit
  color: string
  dimension: MBTIDimension
  rarity: TarotRarity
  level: number // 1: 平庸, 2: 卓越, 3: 传奇
  image?: string // 新增：图片路径或 URL
  meaning: string // 新增：卡牌含义关键词
}

// 映射卡牌名称到图片 URL (使用 GitHub 上的公共 Rider-Waite 牌组资源)
const getCardImage = (name: string, suit: TarotSuit, id: number): string => {
  // 使用 wsrv.nl 代理来解决 ORB 和 CORS 问题 (weserv 的升级版)
  const baseUrl = 'https://wsrv.nl/?url=cdn.jsdelivr.net/gh/ganesh-v/tarot-cards@master/images/cards/'
  
  // 大阿卡纳 (Major Arcana)
  if (id <= 21) {
    const num = id.toString().padStart(2, '0')
    return `${baseUrl}major/${num}.jpg`
  }
  
  // 小阿卡纳 (Minor Arcana)
  const suitMap: Record<string, string> = {
    'Wands': 'wands',
    'Cups': 'cups',
    'Swords': 'swords',
    'Pentacles': 'pentacles'
  }
  
  const rankNames = [
    'Ace', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 
    'Eight', 'Nine', 'Ten', 'Page', 'Knight', 'Queen', 'King'
  ]
  
  const rank = name.split(' of ')[0]
  const rankIdx = rankNames.indexOf(rank)
  if (rankIdx === -1 || !suit) return `https://picsum.photos/seed/${encodeURIComponent(name)}/200/300`
  
  const rankNum = (rankIdx + 1).toString().padStart(2, '0')
  const suitDir = suitMap[suit]
  
  return `${baseUrl}${suitDir}/${rankNum}.jpg`
}

export interface CardVisual {
  background: string
  borderClass: string
  glowClass: string
  effect: string
  imageFilter: string
  accentColor: string
  textureOpacity: number
  slotColor: string // 新增：卡槽颜色
}

export function getCardVisual(level: number): CardVisual {
  // 材质颜色定义 - 增强质感 (幽邃冷色调)
  const bronzeBase = '#1a0f08' // 暗哑古铜
  const silverBase = '#0f172a' // 月光冷银 (深蓝底)
  const goldBase = '#0a0a05' // 极深金底

  if (level === 3) {
    return {
      background: goldBase,
      borderClass: 'texture-gold-edge',
      glowClass: 'shadow-[0_0_20px_rgba(255,215,0,0.15)]',
      effect: 'gold-shimmer',
      imageFilter: 'saturate(1.2) contrast(1.1) brightness(1.05)',
      accentColor: '#FFD700',
      textureOpacity: 1,
      slotColor: 'rgba(255, 215, 0, 0.3)'
    }
  }

  if (level === 2) {
    return {
      background: silverBase,
      borderClass: 'texture-silver-edge',
      glowClass: 'shadow-[0_0_15px_rgba(192,192,192,0.1)]',
      effect: 'silver-stars',
      imageFilter: 'saturate(1.05) contrast(1.05) brightness(1.05)',
      accentColor: '#C0C0C0',
      textureOpacity: 0.8,
      slotColor: 'rgba(192, 192, 192, 0.2)'
    }
  }

  return {
    background: bronzeBase,
    borderClass: 'texture-bronze-edge',
    glowClass: 'shadow-none',
    effect: 'none',
    imageFilter: 'saturate(0.9) contrast(1) brightness(0.9)',
    accentColor: '#8B4513',
    textureOpacity: 0.6,
    slotColor: 'rgba(139, 69, 19, 0.1)'
  }
}

const suitColorMap: Record<Exclude<TarotSuit, null>, string> = {
  Wands: '#4f46e5', // 靛蓝
  Swords: '#8A2BE2', // 紫色
  Cups: '#3b82f6', // 蓝色
  Pentacles: '#94a3b8', // 银灰
}

const majorColor = '#B19CD9' // 丁香紫

// 等级分配函数：60% 平庸，25% 卓越，15% 传奇
export function assignCardLevel(): number {
  const rand = Math.random()
  if (rand < 0.6) return 1  // 60% 平庸
  if (rand < 0.85) return 2 // 25% 卓越
  return 3  // 15% 传奇
}

// 根据等级获取稀有度
export function levelToRarity(level: number): TarotRarity {
  if (level === 3) return 'Gold'
  if (level === 2) return 'Silver'
  return 'Bronze'
}

// 大阿卡纳数据
const majorArcanaData: Omit<TarotCard, 'type' | 'color' | 'rarity' | 'level' | 'image'>[] = [
  { id: 0, name: 'The Fool', suit: null, dimension: 'E/I', meaning: '自由, 开始, 冒险' },
  { id: 1, name: 'The Magician', suit: null, dimension: 'S/N', meaning: '创造力, 意志, 潜能' },
  { id: 2, name: 'The High Priestess', suit: null, dimension: 'T/F', meaning: '直觉, 神秘, 内在智慧' },
  { id: 3, name: 'The Empress', suit: null, dimension: 'T/F', meaning: '丰饶, 自然, 母亲' },
  { id: 4, name: 'The Emperor', suit: null, dimension: 'J/P', meaning: '权威, 结构, 父亲' },
  { id: 5, name: 'The Hierophant', suit: null, dimension: 'J/P', meaning: '传统, 信仰, 导师' },
  { id: 6, name: 'The Lovers', suit: null, dimension: 'T/F', meaning: '选择, 关系, 和谐' },
  { id: 7, name: 'The Chariot', suit: null, dimension: 'E/I', meaning: '意志, 胜利, 掌控' },
  { id: 8, name: 'Strength', suit: null, dimension: 'E/I', meaning: '勇气, 柔和力量, 自信' },
  { id: 9, name: 'The Hermit', suit: null, dimension: 'S/N', meaning: '孤独, 内省, 寻求真理' },
  { id: 10, name: 'Wheel of Fortune', suit: null, dimension: 'J/P', meaning: '命运, 周期, 变化' },
  { id: 11, name: 'Justice', suit: null, dimension: 'T/F', meaning: '公正, 真相, 法律' },
  { id: 12, name: 'The Hanged Man', suit: null, dimension: 'S/N', meaning: '牺牲, 暂停, 新视角' },
  { id: 13, name: 'Death', suit: null, dimension: 'J/P', meaning: '结束, 转化, 新生' },
  { id: 14, name: 'Temperance', suit: null, dimension: 'T/F', meaning: '节制, 平衡, 融合' },
  { id: 15, name: 'The Devil', suit: null, dimension: 'E/I', meaning: '束缚, 欲望, 物质主义' },
  { id: 16, name: 'The Tower', suit: null, dimension: 'J/P', meaning: '剧变, 觉醒, 释放' },
  { id: 17, name: 'The Star', suit: null, dimension: 'S/N', meaning: '希望, 灵感, 宁静' },
  { id: 18, name: 'The Moon', suit: null, dimension: 'S/N', meaning: '幻觉, 恐惧, 潜意识' },
  { id: 19, name: 'The Sun', suit: null, dimension: 'E/I', meaning: '快乐, 成功, 活力' },
  { id: 20, name: 'Judgement', suit: null, dimension: 'T/F', meaning: '重生, 呼唤, 评估' },
  { id: 21, name: 'The World', suit: null, dimension: 'J/P', meaning: '完成, 整合, 旅行' },
]

const majorArcana: TarotCard[] = majorArcanaData.map(data => ({
  ...data,
  type: 'Major',
  color: majorColor,
  rarity: 'Bronze',
  level: 1,
  image: getCardImage(data.name, data.suit, data.id)
}))

const minorRanks = [
  'Ace', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 
  'Eight', 'Nine', 'Ten', 'Page', 'Knight', 'Queen', 'King'
] as const

const suitToDimension: Record<Exclude<TarotSuit, null>, MBTIDimension> = {
  Wands: 'E/I',
  Swords: 'S/N',
  Cups: 'T/F',
  Pentacles: 'J/P',
}

const suitMeanings: Record<Exclude<TarotSuit, null>, string> = {
  Wands: '行动, 能量, 热情',
  Swords: '思想, 智力, 冲突',
  Cups: '情感, 关系, 创造力',
  Pentacles: '物质, 金钱, 工作',
}

const buildMinorArcana = (startId: number): TarotCard[] => {
  const suits: Exclude<TarotSuit, null>[] = ['Wands', 'Cups', 'Swords', 'Pentacles']
  const cards: TarotCard[] = []
  let id = startId

  for (const suit of suits) {
    for (const rank of minorRanks) {
      const name = `${rank} of ${suit}`
      cards.push({
        id,
        name,
        type: 'Minor',
        suit,
        color: suitColorMap[suit],
        dimension: suitToDimension[suit],
        rarity: 'Bronze',
        level: 1,
        image: getCardImage(name, suit, id),
        meaning: `${rank}: ${suitMeanings[suit]}`
      })
      id += 1
    }
  }

  return cards
}

export const fullDeck: TarotCard[] = [...majorArcana, ...buildMinorArcana(22)]

/**
 * 洗牌函数 - Fisher-Yates Shuffle
 */
export function shuffleDeck(deck: TarotCard[]): TarotCard[] {
  const newDeck = [...deck]
  for (let i = newDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]]
  }
  return newDeck
}

/**
 * 根据 MBTI 维度随机获取一张卡牌，用于重铸逻辑
 * 确保“灵魂锁定”：MBTI 属性（维度）不变
 */
export function getRandomCardByDimension(dimension: MBTIDimension, excludeId?: number, forcedLevel?: number): TarotCard {
  const candidates = fullDeck.filter(c => c.dimension === dimension && c.id !== excludeId)
  const baseCard = candidates[Math.floor(Math.random() * candidates.length)]
  
  // 如果提供了 forcedLevel，则优先使用；否则随机分配
  const level = forcedLevel || assignCardLevel()
  
  return {
    ...baseCard,
    level,
    rarity: levelToRarity(level)
  }
}

