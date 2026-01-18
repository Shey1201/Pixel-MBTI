import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  fullDeck, 
  shuffleDeck, 
  getCardVisual, 
  getRandomCardByDimension,
  type TarotCard, 
  assignCardLevel, 
  levelToRarity,
  type MBTIDimension
} from './deck'
import PixelAvatar, { type Emotion, type ElementType } from './PixelAvatar'
import { getRandomQuote, getCardReaction, interactionQuotes } from './quotes'

type GamePhase = 'START' | 'SHUFFLING' | 'SPREAD' | 'RESULT'
type SlotKey = 'fire' | 'air' | 'water' | 'earth'

interface SelectedCard extends TarotCard {
  isUpright: boolean
  reforged?: boolean
}

interface Slots {
  fire?: SelectedCard
  air?: SelectedCard
  water?: SelectedCard
  earth?: SelectedCard
}

const slotConfig: Record<SlotKey, { label: string; icon: string; dimension: string }> = {
  fire: { label: '火之槽 (Energy)', icon: '🔥', dimension: 'E/I' },
  air: { label: '风之槽 (Perception)', icon: '🌬️', dimension: 'S/N' },
  water: { label: '水之槽 (Judgment)', icon: '💧', dimension: 'T/F' },
  earth: { label: '土之槽 (Lifestyle)', icon: '🌿', dimension: 'J/P' },
}

const slotOrder: SlotKey[] = ['fire', 'air', 'water', 'earth']

const professionMap: Record<string, string> = {
  INTJ: '星轨架构师',
  INTP: '遗迹考证师',
  ENTJ: '帝国将领',
  ENTP: '浪潮博弈家',
  INFJ: '心灵牧者',
  INFP: '星愿诗人',
  ENFJ: '秩序导师',
  ENFP: '奇想旅者',
  ISTJ: '城防执事',
  ISFJ: '温存护佑者',
  ESTJ: '工坊监工',
  ESFJ: '会盟外交官',
  ISTP: '潜行技师',
  ISFP: '林野画师',
  ESTP: '破阵先锋',
  ESFP: '剧团星子',
}

// 优化的打字机效果组件 - 减少动画频率
const TypewriterText: React.FC<{ text: string, level?: number }> = React.memo(({ text, level }) => {
  const [displayedText, setDisplayedText] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  
  useEffect(() => {
    setDisplayedText('')
    let i = 0
    
    const timer = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1))
      i++
      if (i >= text.length) {
        clearInterval(timer)
        setTimeout(() => setShowCursor(false), 1000)
      }
    }, 120)
    
    return () => {
      clearInterval(timer)
      setShowCursor(true)
    }
  }, [text])

  const textColorClass = useMemo(() => {
    if (level === 3) return 'burning-text font-serif tracking-wider'
    return 'text-moon-silver font-serif opacity-100 font-bold'
  }, [level])

  return (
    <div className={`leading-relaxed break-words whitespace-pre-wrap relative ${textColorClass}`}>
      {displayedText}
      {showCursor && (
        <span 
          className={`inline-block w-0.5 h-3 bg-indigo-400 ml-1 align-middle`}
        />
      )}
    </div>
  )
})

const StardustBackground = React.memo(() => {
  const particles = useMemo(() => Array.from({ length: 6 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: 0.8 + Math.random() * 1.2,
    duration: 30 + Math.random() * 20,
    delay: -Math.random() * 30
  })), [])

  return (
    <div className="stardust-bg">
      {particles.map(p => (
        <div 
          key={p.id}
          className="stardust-particle"
          style={{
            left: p.left,
            top: p.top,
            width: `${p.size}px`,
            height: `${p.size}px`,
            '--duration': `${p.duration}s`,
            animationDelay: `${p.delay}s`
          } as React.CSSProperties}
        />
      ))}
      {/* 优化的环境光 - 进一步降低模糊和透明度 */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[60%] bg-indigo-900/5 blur-[20px] pointer-events-none z-0" />
      <div className="absolute top-0 left-0 w-full h-full bg-indigo-500/5 pointer-events-none z-0" />
    </div>
  )
})

const CardBack = React.memo(() => {
  return (
    <div className="w-full h-full relative group">
      {/* 卡牌背面背景：深邃午夜蓝 (Midnight Blue) */}
      <div className="w-full h-full rounded-[1px] flex items-center justify-center relative overflow-hidden bg-[#080c1d]">
        
        {/* 暗金色边框 (Dark Gold) */}
        <div className="absolute inset-[1px] border-[0.8px] border-[#b8860b]/40 rounded-[0.5px] pointer-events-none drop-shadow-[0_0_1px_rgba(184,134,11,0.5)]" />
        <div className="absolute inset-[3px] border-[0.5px] border-[#b8860b]/20 rounded-[0.5px] pointer-events-none" />

        {/* 装饰性暗金色发光图案 (Dark Gold Glow) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <svg width="100%" height="100%" viewBox="0 0 100 170" className="opacity-90 animate-back-pattern">
            {/* 核心暗金发光圆环 */}
            <circle cx="50" cy="85" r="35" stroke="#b8860b" strokeWidth="0.2" fill="none" opacity="0.4" />
            <circle cx="50" cy="85" r="32" stroke="#b8860b" strokeWidth="0.1" fill="none" opacity="0.2" />
            
            {/* 中心神秘符号 - 暗金 */}
            <g transform="translate(50, 85)">
              <path 
                d="M-12,0 L0,-8 L12,0 L0,8 Z" 
                fill="none" 
                stroke="#b8860b" 
                strokeWidth="0.8" 
                className="drop-shadow-[0_0_2px_rgba(184,134,11,0.8)]"
              />
              
              {/* 中心高亮金点 */}
              <circle r="1.2" fill="#ffd700" className="drop-shadow-[0_0_3px_rgba(255,215,0,0.9)]" />
            </g>

            {/* 星座连线 (Constellation patterns) - 暗金发光 */}
            <g stroke="#b8860b" strokeWidth="0.6" fill="none" opacity="0.9">
              {/* 顶部星群 */}
              <path d="M25,40 L40,30 L60,45 L80,30" className="drop-shadow-[0_0_1px_rgba(184,134,11,0.5)]" />
              <circle cx="25" cy="40" r="0.8" fill="#ffd700" />
              <circle cx="40" cy="30" r="0.8" fill="#ffd700" />
              <circle cx="60" cy="45" r="0.8" fill="#ffd700" />
              <circle cx="80" cy="30" r="0.8" fill="#ffd700" />

              {/* 底部星群 */}
              <path d="M20,135 L40,145 L65,130 L85,145" className="drop-shadow-[0_0_1px_rgba(184,134,11,0.5)]" />
              <circle cx="20" cy="135" r="0.8" fill="#ffd700" />
              <circle cx="40" cy="145" r="0.8" fill="#ffd700" />
              <circle cx="65" cy="130" r="0.8" fill="#ffd700" />
              <circle cx="85" cy="145" r="0.8" fill="#ffd700" />
            </g>
          </svg>
        </div>

        {/* 金属反光 (Glossy finish) */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#ffd700]/10 to-transparent opacity-40 pointer-events-none" />

        {/* 四角金线装饰 - 暗金发亮 */}
        <div className="absolute inset-0 pointer-events-none opacity-80">
          <svg width="100%" height="100%" viewBox="0 0 100 170" fill="none">
            <path d="M5,12 L12,12 L12,5" stroke="#b8860b" strokeWidth="0.8" className="drop-shadow-[0_0_2px_rgba(184,134,11,0.8)]" />
            <path d="M88,5 L88,12 L95,12" stroke="#b8860b" strokeWidth="0.8" className="drop-shadow-[0_0_2px_rgba(184,134,11,0.8)]" />
            <path d="M5,158 L12,158 L12,165" stroke="#b8860b" strokeWidth="0.8" className="drop-shadow-[0_0_2px_rgba(184,134,11,0.8)]" />
            <path d="M88,165 L88,158 L95,158" stroke="#b8860b" strokeWidth="0.8" className="drop-shadow-[0_0_2px_rgba(184,134,11,0.8)]" />
          </svg>
        </div>
      </div>
    </div>
  )
});

export function PixelFateGame() {
  const [phase, setPhase] = useState<GamePhase>('START')
  const phaseRef = useRef<GamePhase>(phase)
  const lastInteractTime = useRef<number>(Date.now())
  
  // 统一震动节流函数
  const throttledVibrate = useCallback((_pattern: number | number[]) => {
    // 移除震动反馈
  }, [])
  
  // 同步 phase 到 ref
  useEffect(() => {
    phaseRef.current = phase
  }, [phase])

  // 自动迁移旧数据：修复历史记录中的旧图片 URL
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('pixelFateHistory')
      if (savedHistory) {
        let historyObj = JSON.parse(savedHistory)
        let changed = false
        if (Array.isArray(historyObj)) {
          historyObj = historyObj.map(record => {
            if (record.cards) {
              record.cards = record.cards.map((card: any) => {
                if (card && card.image && (card.image.includes('weserv.nl') || card.image.includes('raw.githubusercontent.com'))) {
                  changed = true
                  // 使用 wsrv.nl 代理解决 ORB 问题
                  const baseUrl = 'https://wsrv.nl/?url=cdn.jsdelivr.net/gh/ganesh-v/tarot-cards@master/images/cards/'
                  if (card.id <= 21) {
                    const num = card.id.toString().padStart(2, '0')
                    card.image = `${baseUrl}major/${num}.jpg`
                  } else {
                    const suitMap: Record<string, string> = { 'Wands': 'wands', 'Cups': 'cups', 'Swords': 'swords', 'Pentacles': 'pentacles' }
                    const rankNames = ['Ace', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Page', 'Knight', 'Queen', 'King']
                    const rank = card.name ? card.name.split(' of ')[0] : ''
                    const rankIdx = rankNames.indexOf(rank)
                    if (rankIdx !== -1 && card.suit) {
                      const rankNum = (rankIdx + 1).toString().padStart(2, '0')
                      card.image = `${baseUrl}${suitMap[card.suit]}/${rankNum}.jpg`
                    }
                  }
                }
                return card
              })
            }
            return record
          })
          if (changed) {
            localStorage.setItem('pixelFateHistory', JSON.stringify(historyObj))
            setHistory(historyObj)
            console.log('Migrated history image URLs to jsdelivr CDN')
          }
        }
      }
    } catch (e) { console.error('Migration failed:', e) }
  }, [])

  // 优化的闲置互动检测 - 降低检测频率和状态更新
  useEffect(() => {
    let lastInteractionCheck = Date.now()
    const timer = setInterval(() => {
      const now = Date.now()
      // 降低检测频率到每10秒检查一次，且需要15秒无操作才触发
      if (now - lastInteractionCheck >= 10000 && now - lastInteractTime.current > 15000) {
        const mumbles = interactionQuotes.idle
        const msg = mumbles[Math.floor(Math.random() * mumbles.length)]
        // 只在消息确实需要更新时才更新状态
        setAvatarState(prev => {
          if (prev.message === msg) return prev
          return { ...prev, message: msg, emotion: 'normal' }
        })
        lastInteractTime.current = now 
        lastInteractionCheck = now
      }
    }, 10000) // 每10秒检查一次

    return () => clearInterval(timer)
  }, [phase])

  const updateInteractTime = useCallback(() => {
    lastInteractTime.current = Date.now()
  }, [])


  const [deck, setDeck] = useState<TarotCard[]>(() => shuffleDeck(fullDeck))
  const [slots, setSlots] = useState<Slots>({})
  const slotsRef = useRef<Slots>({})
  useEffect(() => { slotsRef.current = slots }, [slots])
  
  const computeMBTI = useCallback((currentSlots: Slots) => {
    const letterByDimension = (dimension: 'E/I' | 'S/N' | 'T/F' | 'J/P', isUpright: boolean) => {
      const [a, b] = dimension.split('/') as [string, string]
      return isUpright ? a : b
    }
    const f = currentSlots.fire ? letterByDimension('E/I', currentSlots.fire.isUpright) : ''
    const a = currentSlots.air ? letterByDimension('S/N', currentSlots.air.isUpright) : ''
    const w = currentSlots.water ? letterByDimension('T/F', currentSlots.water.isUpright) : ''
    const e = currentSlots.earth ? letterByDimension('J/P', currentSlots.earth.isUpright) : ''
    return `${f}${a}${w}${e}`
  }, [])

  const currentMBTI = useMemo(() => computeMBTI(slots), [slots, computeMBTI])
  const cardComposition = useMemo(() => 
    Object.values(slots).filter(Boolean).map(c => ({ level: c!.level })),
    [slots]
  )

  // 导出命运图签 (优化版：离线 Canvas 合成 - 幽邃冷色调)
  const handleExportPoster = async () => {
    throttledVibrate([50, 50, 100])
    
    const mbti = computeMBTI(slots)
    const profession = professionMap[mbti] || '星界旅者'
    const narrative = finalNarrative || generateNarrative(slots)
    
    // 创建离屏 Canvas
    const canvas = document.createElement('canvas')
    canvas.width = 800
    canvas.height = 1400
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // 绘制背景 - 极夜黑与深紫渐变
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height)
    grad.addColorStop(0, '#050505')
    grad.addColorStop(0.5, '#1A0B2E')
    grad.addColorStop(1, '#050505')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // 绘制装饰性光晕 - 深紫冷调
    const radialGrad = ctx.createRadialGradient(canvas.width / 2, 400, 0, canvas.width / 2, 400, 600)
    radialGrad.addColorStop(0, 'rgba(138, 43, 226, 0.15)')
    radialGrad.addColorStop(1, 'transparent')
    ctx.fillStyle = radialGrad
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // 绘制文字 - 冷月白
    ctx.textAlign = 'center'
    ctx.fillStyle = '#E0E0E0'
    ctx.font = '900 28px system-ui'
    ctx.fillText('✦ PIXEL FATE ARCHIVE ✦', canvas.width / 2, 100)
    
    ctx.fillStyle = 'rgba(224, 224, 224, 0.5)'
    ctx.font = '700 18px system-ui'
    ctx.fillText(new Date().toLocaleDateString(), canvas.width / 2, 140)
    
    // 绘制 MBTI - 丁香紫渐变
    ctx.fillStyle = '#B19CD9'
    ctx.font = '900 140px system-ui'
    ctx.shadowBlur = 30
    ctx.shadowColor = 'rgba(138, 43, 226, 0.5)'
    ctx.fillText(mbti, canvas.width / 2, 600)
    ctx.shadowBlur = 0
    
    // 绘制职业 - 冷银
    ctx.fillStyle = '#E0E0E0'
    ctx.font = '900 36px system-ui'
    ctx.fillText(profession, canvas.width / 2, 680)
    
    // 绘制分割线 - 银色渐变
    const lineGrad = ctx.createLinearGradient(200, 0, 600, 0)
    lineGrad.addColorStop(0, 'transparent')
    lineGrad.addColorStop(0.5, 'rgba(224, 224, 224, 0.4)')
    lineGrad.addColorStop(1, 'transparent')
    ctx.strokeStyle = lineGrad
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(200, 750)
    ctx.lineTo(600, 750)
    ctx.stroke()
    
    // 绘制叙述 - 冷月白 (自动换行)
    ctx.fillStyle = '#F8F8FF'
    ctx.font = 'italic 500 26px system-ui'
    const words = narrative.split('')
    let line = ''
    let y = 820
    const lineHeight = 45
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n]
      const metrics = ctx.measureText(testLine)
      if (metrics.width > 640 && n > 0) {
        ctx.fillText(line, canvas.width / 2, y)
        line = words[n]
        y += lineHeight
      } else {
        line = testLine
      }
    }
    ctx.fillText(line, canvas.width / 2, y)
    
    // 底部装饰
    ctx.fillStyle = 'rgba(138, 43, 226, 0.3)'
    ctx.font = '700 16px system-ui'
    ctx.fillText('— THE THREADS OF FATE ARE WOVEN —', canvas.width / 2, canvas.height - 100)
    
    // 导出并下载
    try {
      const dataUrl = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.download = `pixel-fate-${mbti}-${Date.now()}.png`
      link.href = dataUrl
      link.click()
      alert("图签已生成并开始下载")
    } catch (err) {
      console.error(err)
      alert("导出失败，请重试")
    }
   }
 
   const lastResetTime = useRef(0)

  // 优化的卡牌图片预加载 - 分批加载，减少并发
  useEffect(() => {
    const preloadMajorArcana = () => {
      // 使用 wsrv.nl 代理解决 ORB 和 CORS 问题
      const baseUrl = 'https://wsrv.nl/?url=cdn.jsdelivr.net/gh/ganesh-v/tarot-cards@master/images/cards/major/'
      const majorArcanaIds = Array.from({ length: 22 }, (_, i) => i.toString().padStart(2, '0'))
      
      // 分批加载，每批5张，避免同时加载过多图片
      const batchSize = 5
      let currentBatch = 0
      
      const loadBatch = () => {
        const start = currentBatch * batchSize
        const end = Math.min(start + batchSize, majorArcanaIds.length)
        
        for (let i = start; i < end; i++) {
          const img = new Image()
          img.crossOrigin = 'anonymous'
          img.src = `${baseUrl}${majorArcanaIds[i]}.jpg`
        }
        
        currentBatch++
        if (currentBatch * batchSize < majorArcanaIds.length) {
          setTimeout(loadBatch, 1000) // 每批间隔1秒
        }
      }
      
      // 延迟5秒后开始预加载，确保页面加载完成
      setTimeout(loadBatch, 5000)
    }
    
    // 使用更智能的加载时机
    if (document.readyState === 'complete') {
      preloadMajorArcana()
    } else {
      window.addEventListener('load', preloadMajorArcana)
      return () => window.removeEventListener('load', preloadMajorArcana)
    }
  }, [])
  
  // 世界状态
  const [worldState, setWorldState] = useState({
    brightness: 100,
    filter: 'none',
    isShaking: false,
  })

  // 小人状态
  const [avatarState, setAvatarState] = useState({
    level: 1,
    elementBias: null as ElementType,
    emotion: 'normal' as Emotion,
    message: '',
  })

  const [lastDrawnLevel, setLastDrawnLevel] = useState<number | null>(null)

  // 持久化：解锁牌、拥有数量、历史记录与弹窗
  const [ownedCards, setOwnedCards] = useState<Record<number, Record<number, number>>>(() => {
    try {
      const saved = localStorage.getItem('pixelFateOwnedV2')
      if (saved) return JSON.parse(saved)
      // 兼容旧数据
      const old = JSON.parse(localStorage.getItem('pixelFateOwned') || '{}')
      const converted: Record<number, Record<number, number>> = {}
      Object.entries(old).forEach(([id, count]) => {
        converted[Number(id)] = { 1: Number(count) }
      })
      return converted
    } catch (e) {
      console.error(e)
      return {}
    }
  })

  const [codex, setCodex] = useState<Record<string, Set<number>>>(() => {
    try {
      const saved = localStorage.getItem('pixelFateCodex')
      if (saved) {
        const parsed = JSON.parse(saved)
        const result: Record<string, Set<number>> = {}
        Object.entries(parsed).forEach(([mbti, levels]) => {
          result[mbti] = new Set(levels as number[])
        })
        return result
      }
      return {}
    } catch (e) {
      console.error(e)
      return {}
    }
  })

  // 使用防抖技术减少localStorage写入频率
  const ownedCardsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    if (ownedCardsTimeoutRef.current) {
      clearTimeout(ownedCardsTimeoutRef.current)
    }
    ownedCardsTimeoutRef.current = setTimeout(() => {
      localStorage.setItem('pixelFateOwnedV2', JSON.stringify(ownedCards))
    }, 1000) // 1秒防抖
    
    return () => {
      if (ownedCardsTimeoutRef.current) {
        clearTimeout(ownedCardsTimeoutRef.current)
      }
    }
  }, [ownedCards])

  // 使用防抖技术减少codex的localStorage写入频率
  const codexTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    if (codexTimeoutRef.current) {
      clearTimeout(codexTimeoutRef.current)
    }
    codexTimeoutRef.current = setTimeout(() => {
      const serializableCodex: Record<string, number[]> = {}
      Object.entries(codex).forEach(([mbti, levels]) => {
        serializableCodex[mbti] = Array.from(levels)
      })
      localStorage.setItem('pixelFateCodex', JSON.stringify(serializableCodex))
    }, 1000) // 1秒防抖
    
    return () => {
      if (codexTimeoutRef.current) {
        clearTimeout(codexTimeoutRef.current)
      }
    }
  }, [codex])

  const [history, setHistory] = useState<{
    id: number;
    time: string;
    mbti: string;
    profession: string;
    narrative: string;
    cards: (TarotCard & { isUpright: boolean })[];
  }[]>(() => {
    try {
      const h = JSON.parse(localStorage.getItem('pixelFateHistory') || '[]')
      return Array.isArray(h) ? h : []
    } catch (e) {
      console.error('Failed to load history from localStorage:', e)
      return []
    }
  })
  const [showHistory, setShowHistory] = useState(false)
  const [showLibrary, setShowLibrary] = useState(false)
  const [showCodex, setShowCodex] = useState(false)
  const [showInstructions, setShowInstructions] = useState(false)
  const [showPoster, setShowPoster] = useState(false)
  const [posterId, setPosterId] = useState<number | null>(null)
  const handleReset = () => {
    // 冷却机制：防止快速点击触发过多动画 (0.5秒冷却)
    const now = Date.now()
    if (now - lastResetTime.current < 500) return
    lastResetTime.current = now

    setPhase('SHUFFLING')
    // 震动反馈增强洗牌感
    throttledVibrate([50, 30, 50, 30, 100])
    
    // 清除状态
    setSlots({})
    slotsRef.current = {}
    setFinalNarrative('')
    setAvatarState(prev => ({ ...prev, level: 1, elementBias: null, emotion: 'normal', message: '正在洗牌，命运之轮即将重新开启...' }))
    
    // 异步重排并进入下一阶段
    setTimeout(() => {
      setDeck(shuffleDeck(fullDeck))
      setPhase('SPREAD')
      setAvatarState(prev => ({ ...prev, message: '请诚心选择四张命运之牌。' }))
    }, 1500)
  }

  const handleFullReset = () => {
    if (confirm('确定要清空所有记录吗？此操作将清除所有卡牌收集、历史记录和进度，且不可恢复。')) {
      localStorage.clear()
      window.location.reload()
    }
  }

  // 合成逻辑：3张低级同名卡 -> 1张高级同名卡
  const synthesizeCard = useCallback((cardId: number, currentLevel: number) => {
    setOwnedCards(prev => {
      const cardLevels = prev[cardId] || {}
      const count = cardLevels[currentLevel] || 0
      if (count < 3 || currentLevel >= 3) return prev
      
      const nextLevel = currentLevel + 1
      
      // 触发合成动画
      setWorldState(prev => ({ 
        ...prev, 
        brightness: 200
      }))
      
      setTimeout(() => setWorldState(prev => ({ 
        ...prev, 
        brightness: 100
      })), 1500)
      
      return {
        ...prev,
        [cardId]: {
          ...cardLevels,
          [currentLevel]: count - 3,
          [nextLevel]: (cardLevels[nextLevel] || 0) + 1
        }
      }
    })
    
    // 震动反馈
    throttledVibrate([100, 50, 200, 50, 300])
  }, [throttledVibrate])

  // 重构逻辑：消耗一张同级同名卡，重新抽取同维度的卡牌 (锁定 MBTI)
  const [lockedSlots, setLockedSlots] = useState<Set<SlotKey>>(new Set())

  const toggleLock = useCallback((slotKey: SlotKey) => {
    setLockedSlots(prev => {
      const newLocked = new Set(prev)
      if (newLocked.has(slotKey)) {
        newLocked.delete(slotKey)
      } else {
        newLocked.add(slotKey)
        // 播放锁定音效和反馈
        setAvatarState(prev => ({ 
          ...prev, 
          message: interactionQuotes.reforge.lock, 
          emotion: 'normal' 
        }))
      }
      return newLocked
    })
  }, [])

  const reforgeCard = useCallback(async (card: SelectedCard, slotKey: SlotKey) => {
    if (lockedSlots.has(slotKey)) return
    // 检查是否有同级同名卡可以消耗
    const cardData = ownedCards[card.id] || {}
    const count = cardData[card.level] || 0
    
    if (count < 1) {
      setAvatarState(prev => ({ ...prev, message: "重铸需要消耗一张同级同名卡...", emotion: 'panic' }))
      // 即使无法重铸，点击后也标记为已重铸，隐藏按钮，符合用户需求
      setSlots(prev => ({
        ...prev,
        [slotKey]: { ...card, reforged: true }
      }))
      setTimeout(() => setAvatarState(prev => ({ ...prev, message: '', emotion: 'normal' })), 2000)
      return
    }

    updateInteractTime()
    
    // 1. 点击瞬间反馈
    setAvatarState(prev => ({ 
      ...prev, 
      message: interactionQuotes.reforge.start,
      emotion: 'contemplative'
    }))

    // 模拟重组延迟
    await new Promise(resolve => setTimeout(resolve, 1500))

    // 2. 扣除一张旧卡并获得一张新卡（用于后续重构）
    setOwnedCards(prev => {
      const next = { ...prev }
      // 扣除旧卡
      const oldLevels = { ...next[card.id] }
      oldLevels[card.level] = Math.max(0, (oldLevels[card.level] || 1) - 1)
      next[card.id] = oldLevels
      
      // 注意：这里需要等 3. 产生 newCard 后再更新
      return next
    })
    
    // 3. 核心逻辑：锁定维度，获取新卡
    const dimension = slotConfig[slotKey].dimension as any // E/I, S/N etc
    // 重铸逻辑：允许重新抽取等级，而不仅是锁定旧等级，给用户提升稀有度的机会
    const newCard = getRandomCardByDimension(dimension, card.id)
    const isUpright = card.isUpright
    const reforgedCard = { ...newCard, isUpright, reforged: true }

    // 补充：获得新卡所有权，以便可以再次重构
    setOwnedCards(prev => {
      const next = { ...prev }
      const newLevels = { ...next[newCard.id] }
      newLevels[newCard.level] = (newLevels[newCard.level] || 0) + 1
      next[newCard.id] = newLevels
      return next
    })
    
    const upgraded = newCard.level > card.level
    const sameLevel = newCard.level === card.level
    
    setSlots(prev => ({
      ...prev,
      [slotKey]: reforgedCard
    }))
    
    // 4. 结果反馈
    let feedback = interactionQuotes.reforge.mbtiLock
    if (upgraded) feedback = interactionQuotes.reforge.upgrade
    else if (sameLevel) feedback = interactionQuotes.reforge.noChange

    setAvatarState(prev => ({ 
      ...prev, 
      message: feedback, 
      emotion: upgraded ? 'heroic' : sameLevel ? 'normal' : 'panic',
      level: upgraded ? Math.max(prev.level, newCard.level) : prev.level
    }))

    if (upgraded) {
      throttledVibrate([100, 50, 200])
      setWorldState(prev => ({ ...prev, brightness: 150 }))
      setTimeout(() => setWorldState(prev => ({ ...prev, brightness: 100 })), 1000)
    }

    setTimeout(() => setAvatarState(prev => ({ ...prev, message: '', emotion: 'normal' })), 3000)
  }, [ownedCards, slots, computeMBTI, updateInteractTime])

  const applyWorldEffect = useCallback((card: TarotCard, isUpright: boolean) => {
    // 1. 元素偏移判定
    let bias: ElementType = null
    if (card.suit === 'Wands') bias = 'fire'
    else if (card.suit === 'Cups') bias = 'water'
    else if (card.suit === 'Swords') bias = 'air'
    else if (card.suit === 'Pentacles') bias = 'earth'

    // 2. 视觉反馈与情绪
    let newWorldState: any = {}
    let emotion: Emotion = 'normal'

    if (card.level === 3) {
      newWorldState = { brightness: 120 }
      throttledVibrate(200)
    } else if (card.name.includes('Sun') || card.suit === 'Wands') {
      newWorldState = { brightness: 110 }
      emotion = 'heroic'
    } else if (card.name.includes('Moon') || card.suit === 'Cups') {
      newWorldState = { brightness: 90 }
      emotion = 'contemplative'
    } else if (card.name.includes('Tower')) {
      newWorldState = { isShaking: true }
      emotion = 'panic'
      setTimeout(() => setWorldState(prev => ({ ...prev, isShaking: false })), 1500)
    }

    if (Object.keys(newWorldState).length > 0) {
      setWorldState(prev => ({ ...prev, ...newWorldState }))
    }

    // 3. 动态交互对白 - 使用新的 getCardReaction
    const mbti = computeMBTI(slots)
    const reaction = getCardReaction(card, isUpright, mbti, card.level)
    
    setAvatarState(prev => ({ 
      ...prev, 
      elementBias: bias || prev.elementBias,
      emotion: emotion !== 'normal' ? emotion : prev.emotion,
      message: reaction 
    }))
    
    // 如果不是结果阶段，才在3秒后清空
    if (phase !== 'RESULT') {
      setTimeout(() => {
        setAvatarState(prev => {
          // 使用 ref 检查最新的 phase，防止在结果阶段被清空
          if (phaseRef.current === 'RESULT') return prev
          return { ...prev, message: '' }
        })
      }, 3000)
    }
  }, [slots, computeMBTI, phase])

  const [finalNarrative, setFinalNarrative] = useState<string>('')

  const generateNarrative = useCallback((currentSlots: Slots) => {
    const mbti = computeMBTI(currentSlots)
    const totalLevel = Object.values(currentSlots).reduce((acc, c) => acc + (c?.level || 0), 0)
    const avgLevel = Math.ceil(totalLevel / 4)
    const rarity = levelToRarity(avgLevel)
    return getRandomQuote(mbti, rarity)
  }, [computeMBTI])

  const pushHistoryIfComplete = useCallback((currentSlots: Slots, narrative: string) => {
    const mbti = computeMBTI(currentSlots)
    const totalLevel = Object.values(currentSlots).reduce((acc, c) => acc + (c?.level || 0), 0)
    const avgLevel = Math.ceil(totalLevel / 4)
    
    // 更新全图鉴
    setCodex(prev => {
      const next = { ...prev }
      if (!next[mbti]) next[mbti] = new Set()
      next[mbti].add(avgLevel)
      return next
    })

    const record = {
      id: Date.now(),
      time: new Date().toLocaleString(),
      mbti,
      profession: professionMap[mbti] || '未知行者',
      narrative: narrative,
      cards: slotOrder.map(k => currentSlots[k]).filter(Boolean) as (TarotCard & { isUpright: boolean })[],
    }
    setHistory(prev => {
      const next = [...prev, record].slice(-20) // 限制历史记录数量，防止无限增长导致卡顿
      try { localStorage.setItem('pixelFateHistory', JSON.stringify(next)) } catch (e) { console.error(e) }
      return next
    })
  }, [computeMBTI])

  const handleCardClick = useCallback((card: TarotCard) => {
    // 使用 ref 获取最新槽位状态，防止快速点击导致的并发问题
    const currentSlots = slotsRef.current
    const currentFilledCount = Object.keys(currentSlots).length
    
    if (phase !== 'SPREAD' || currentFilledCount >= 4) return

    updateInteractTime()
    
    // 智能寻槽：优先匹配卡牌自身维度，若槽位已占，则自动适配到剩余的空槽位
    let targetSlotKey = slotOrder.find(key => slotConfig[key].dimension === card.dimension && !currentSlots[key])
    if (!targetSlotKey) {
      targetSlotKey = slotOrder.find(key => !currentSlots[key])
    }

    if (!targetSlotKey) return

    // 如果发生了跨维度填充，我们需要同步更新卡牌的维度属性
    const finalDimension = slotConfig[targetSlotKey].dimension
    const adjustedCard = { ...card, dimension: finalDimension as MBTIDimension }

    // 震动反馈
    throttledVibrate(50)

    // 正逆位判定 (50/50)
    const isUpright = Math.random() > 0.5
    
    // 抽卡时重新分配等级
    const cardLevel = assignCardLevel()
    const newSelectedCard: SelectedCard = { ...adjustedCard, isUpright, level: cardLevel }
    
    // 立即更新 ref 和 state
    const newSlots = { ...currentSlots, [targetSlotKey]: newSelectedCard }
    slotsRef.current = newSlots
    setSlots(newSlots)
    
    // 更新拥有数量
    setOwnedCards(prev => {
      const cardLevels = prev[card.id] || {}
      return {
        ...prev,
        [card.id]: {
          ...cardLevels,
          [cardLevel]: (cardLevels[cardLevel] || 0) + 1
        }
      }
    })

    // 移除 setDeck((prev) => prev.filter((c) => c.id !== card.id))，改为不改变 deck 数组，减少重绘

    // 触发动态反馈
    setTimeout(() => setLastDrawnLevel(null), 1500)

    if (cardLevel >= 2) {
      throttledVibrate([100, 50, 150])
      setWorldState(prev => ({ ...prev, brightness: 180 }))
      setTimeout(() => setWorldState(prev => ({ ...prev, brightness: 100 })), 800)
    }

    applyWorldEffect(newSelectedCard, isUpright)

    // 检查是否完成
    const newFilledCount = slotOrder.filter((key) => newSlots[key]).length
    if (newFilledCount === 4) {
      setPhase('RESULT')
      const narrative = generateNarrative(newSlots)
      setFinalNarrative(narrative)
      
      pushHistoryIfComplete(newSlots, narrative)
      
      const avgLevel = Math.ceil(Object.values(newSlots).reduce((acc, c) => acc + (c?.level || 0), 0) / 4)
      const rarity = levelToRarity(avgLevel)
      const resultMsg = interactionQuotes.result[rarity]

      setTimeout(() => {
        setAvatarState(prev => ({ 
          ...prev, 
          level: avgLevel,
          message: resultMsg,
          emotion: 'heroic'
        }))
        
        setTimeout(() => {
          setAvatarState(prev => ({ ...prev, message: narrative }))
        }, 3000)
      }, 2000)
    }
  }, [phase, applyWorldEffect, pushHistoryIfComplete, generateNarrative, updateInteractTime, throttledVibrate])

  // 优化 deckCards 计算：只在初始洗牌时生成，不随抽卡改变位置
  const deckCards = useMemo(() => {
    const totalCards = 30;
    const angleSpan = 60;
    const startAngle = -angleSpan / 2;
    const angleStep = totalCards > 1 ? angleSpan / (totalCards - 1) : 0;
    const radius = 200;

    // 使用 deck 的初始状态生成固定位置
    return deck.slice(0, 30).map((card, index) => {
      const rotate = startAngle + index * angleStep;
      const xOffset = Math.sin((rotate * Math.PI) / 180) * radius;
      const yOffset = (1 - Math.cos((rotate * Math.PI) / 180)) * radius + 30;
      return {
        card,
        index,
        rotate,
        xOffset,
        yOffset,
      };
    });
  }, [phase === 'START' || phase === 'SHUFFLING']); // 仅在开始或洗牌时重新计算位置

  return (
    <div 
      className={`min-h-screen transition-all duration-1000 flex flex-col items-center justify-start px-4 py-8 overflow-x-hidden relative ${worldState.isShaking ? 'animate-shake' : ''}`}
      style={{ 
        backgroundColor: '#1a1a35',
        backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(100, 70, 200, 0.45) 0%, #101025 100%)',
        filter: worldState.filter,
      }}
    >
      {/* 整体画面亮度调节层 */}
      <div className="absolute inset-0 pointer-events-none bg-white/[0.08] z-0" />
      
      {/* 顶部氛围灯光 - 降低模糊半径提升性能 */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-400/15 blur-[100px] rounded-full pointer-events-none" />
      <StardustBackground />
      <div className="page-nebula opacity-80" />
      <div className="noise-texture opacity-[0.04]" />

      {/* 顶部状态栏 - 极简 UI */}
      <header className="w-full max-w-7xl mx-auto z-[100] p-6 flex justify-between items-center mb-4">
        <div className="pointer-events-auto">
          <h1 className="pixel-title-tarot text-2xl font-black flex flex-col leading-none" data-text="PIXEL FATE">
            <span className="text-[10px] text-indigo-400 font-mono mb-0.5 tracking-[0.4em] opacity-80 drop-shadow-[0_0_8px_rgba(129,140,248,0.5)]">ARCANE</span>
            <span>PIXEL FATE</span>
          </h1>
        </div>
        
        <div className="flex gap-3 pointer-events-auto">
            {[
              { label: 'Ritual', icon: '✦', onClick: handleReset },
              { label: 'Codex', icon: '◈', onClick: () => setShowCodex(true) },
              { label: 'Library', icon: '📜', onClick: () => setShowLibrary(true) },
              { label: 'History', icon: '▤', onClick: () => setShowHistory(true) },
              { label: 'Guide', icon: '?', onClick: () => setShowInstructions(true), iconOnly: true },
              { label: '', icon: '↺', onClick: handleFullReset, isSmall: true }
            ].map((btn) => (
              <button 
                key={btn.label || btn.icon}
                onPointerDown={() => { throttledVibrate(10); btn.onClick(); }}
                className={`pixel-btn-standard rounded-lg text-[10px] font-bold text-indigo-300 border-indigo-500/30 uppercase tracking-widest flex items-center gap-2 group ${btn.isSmall ? 'px-2 py-1.5' : (btn.iconOnly ? 'px-3 py-1.5' : 'px-4 py-1.5')}`}
                onClick={btn.onClick}
                title={btn.label}
              >
                <span className="text-indigo-400 opacity-60 group-hover:opacity-100 transition-opacity">{btn.icon}</span>
                {btn.label && !btn.iconOnly && <span className="neon-text text-indigo-200">{btn.label}</span>}
              </button>
            ))}
          </div>
      </header>

      {/* 全局特效层 */}
      <AnimatePresence>
        {lastDrawnLevel && lastDrawnLevel >= 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className={`fixed inset-0 z-[500] pointer-events-none ${
              lastDrawnLevel === 3 
                ? 'bg-gradient-to-b from-yellow-500/20 via-white/40 to-yellow-500/20' 
                : 'bg-white/10'
            } mix-blend-overlay`}
          />
        )}
      </AnimatePresence>


      {/* 游戏主体区域 */}
      <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 animate-in fade-in duration-700 relative z-10 px-4">
        
        {/* 左侧卡片：抽卡与卡槽 */}
        <div className="flex-[1.4] glass-panel-cold rounded-[2rem] p-8 relative overflow-hidden flex flex-col gap-8 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent pointer-events-none" />
          
          {/* 抽卡区域 */}
          <section className="relative h-64 flex flex-col items-center justify-center perspective-1000">
            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-center z-10">
              <span className="text-[8px] font-black text-indigo-400/60 uppercase tracking-[0.5em] mb-2 block">Arcane Deck</span>
              <div className="h-px w-12 bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent mx-auto" />
            </div>

            <motion.div 
              className={`relative w-full h-32 flex justify-center items-center transition-transform duration-700 ${phase === 'SHUFFLING' ? 'scale-110 animate-shuffle' : ''}`}
            >
              {(() => {
                const drawnIds = new Set(Object.values(slots).filter(Boolean).map(s => s!.id))
                const filledCount = drawnIds.size
                const isLocked = filledCount >= 4
                
                return deckCards.map(({ card, index, rotate, xOffset, yOffset }) => { 
                  const isDrawn = drawnIds.has(card.id)
                  
                  return (
                    <button
                      key={card.id}
                      onPointerDown={() => {
                        if (phase === 'SPREAD' && !isDrawn && !isLocked) {
                          handleCardClick(card)
                        }
                      }}
                      style={{
                        transform: `translate(${xOffset}px, ${yOffset}px) rotate(${rotate}deg)`,
                        opacity: isDrawn ? 0 : 1,
                        zIndex: index,
                      }}
                      className={`absolute w-14 h-24 rounded-xl shadow-2xl group overflow-hidden transition-all duration-200 will-change-transform
                        ${isDrawn ? 'pointer-events-none' : (isLocked ? 'cursor-not-allowed opacity-40' : 'cursor-pointer hover:-translate-y-4 hover:scale-105 hover:z-[500]')}`}
                      disabled={(phase !== 'SPREAD' && phase !== 'START') || isDrawn || isLocked}
                    >
                      <CardBack />
                    </button>
                  )
                })
              })()}
            </motion.div>
          </section>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* 卡牌槽位 */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {slotOrder.map(key => (
              <div key={key} className="slot-obsidian-inset p-1">
                <SlotCard 
                  config={slotConfig[key]} 
                  card={slots[key]} 
                  onReforge={(card) => reforgeCard(card, key)}
                  isLocked={lockedSlots.has(key)}
                  onLock={() => toggleLock(key)}
                />
              </div>
            ))}
          </section>
        </div>

        {/* 右侧卡片：小人进化与结果 */}
        <div className="flex-1 glass-panel-cold rounded-[2rem] p-8 relative overflow-hidden flex flex-col items-center shadow-2xl min-h-[500px]">
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/10 via-transparent to-black/60 pointer-events-none" />
          
          {/* 背景符文环 */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-indigo-500/10 rounded-full animate-rune-ring pointer-events-none">
            <div className="absolute inset-0 border border-indigo-500/5 rounded-full scale-90" />
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
              <span className="text-4xl font-serif text-indigo-300/30">᚛ ◈ ᚜</span>
            </div>
          </div>
          
          {/* 小人区域 - 调整位置确保语录可见 */}
          <div className="relative z-10 mt-40 flex flex-col items-center w-full">
            <div className="scale-125 mb-5 relative">
              {/* 魔法阵底座 */}
              <div className="magic-circle-base">
                <div className="magic-circle-outer" />
                <div className="magic-circle-inner" />
              </div>
              
              <PixelAvatar 
                emotion={avatarState.emotion} 
                level={avatarState.level}
                elementBias={avatarState.elementBias}
                mbti={currentMBTI}
                cardComposition={cardComposition}
                currentNarrative={phase === 'RESULT' ? finalNarrative : undefined}
                onSpeak={(msg) => setAvatarState(prev => ({ ...prev, message: msg }))} 
              />
              
              <AnimatePresence>
           {avatarState.message && (
             <motion.div 
               initial={{ opacity: 0, y: 10, scale: 0.9 }}
               animate={{ opacity: 1, y: 0, scale: 1 }}
               exit={{ opacity: 0, y: 10, scale: 0.9 }}
               className="absolute -top-24 left-1/2 -translate-x-1/2 z-50 w-[180px] animate-bubble-pop"
             >
                <div className="frosted-bubble p-2 relative text-[9px]">
                  <div className="relative z-10 text-center leading-relaxed">
                    <TypewriterText text={avatarState.message} level={avatarState.level} />
                  </div>
                  <div className="bubble-divider opacity-40" />
                </div>
             </motion.div>
           )}
         </AnimatePresence>
            </div>

            {/* MBTI 结果显示 - 置于小人下方 */}
            <AnimatePresence>
              {phase === 'RESULT' && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full flex flex-col items-center mt-10 relative"
                >
                <div className="flex flex-col items-center gap-2 mb-6 relative">
                  {/* 全金色形态下的金色 tag 作为右上角小标 */}
                  {avatarState.level === 3 && (
                    <div className="absolute -top-6 -right-12 z-20">
                      <span className="text-[7px] font-black uppercase tracking-[0.2em] text-yellow-500/80 whitespace-nowrap drop-shadow-[0_0_5px_rgba(255,215,0,0.3)]">
                        {professionMap[computeMBTI(slots)] || '星界旅者'}
                      </span>
                    </div>
                  )}
                  
                  {/* 普通形态下显示文字 tag */}
                  {avatarState.level < 3 && (
                    <div className="mb-1">
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500/60">
                        {professionMap[computeMBTI(slots)] || '星界旅者'}
                      </span>
                    </div>
                  )}

                  <span className="pixel-title-tarot text-5xl font-black tracking-tighter" data-text={computeMBTI(slots)}>
                    {computeMBTI(slots)}
                  </span>
                </div>

                <button 
                  onClick={() => {
                    setPosterId(Math.floor(Date.now() / 1000))
                    setShowPoster(true)
                  }}
                  className="px-8 py-3 pixel-btn-standard rounded-full text-[10px] font-black uppercase tracking-[0.2em]"
                >
                  <span className="neon-text">📸 Export Fate Archive</span>
                </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* 历史记录弹窗 (依然保留，作为一个全局查看器) */}
      <AnimatePresence>
        {showHistory && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 flex items-center justify-center z-[200] backdrop-blur-xl"
            onClick={() => setShowHistory(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-[92vw] max-w-4xl glass-panel-cold rounded-[2.5rem] p-8 relative shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black pixel-title-tarot tracking-tighter" data-text="Memory Archive">Memory Archive</h3>
                <button onClick={() => setShowHistory(false)} className="text-slate-500 hover:text-white transition-colors">✕</button>
              </div>
              <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-4 custom-scrollbar">
                {history.length === 0 && (
                  <div className="text-center py-20 text-slate-600 font-bold uppercase tracking-widest text-xs">
                    尚未开启任何命运仪式
                  </div>
                )}
                {history.map(h => (
                  <div key={h.id} className="p-6 rounded-3xl border border-slate-800 bg-slate-800/20 hover:bg-slate-800/40 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                      <div>
                        <div className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-1">{h.time}</div>
                        <div className="text-xl font-black text-indigo-400">{h.mbti} · {h.profession}</div>
                      </div>
                      <div className="flex -space-x-2">
                        {h.cards.map((c, idx) => c && (
                          <div key={`${h.id}-${idx}`} className="w-10 h-14 rounded-lg border-2 border-slate-900 shadow-xl overflow-hidden" style={{ backgroundColor: c.color }}>
                            <CardArt card={c} />
                          </div>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-slate-400 font-medium leading-relaxed">“{h.narrative}”</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 收藏夹弹窗 (卡牌图书馆) */}
      <AnimatePresence>
        {showLibrary && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 flex items-center justify-center z-[200] backdrop-blur-xl"
            onClick={() => setShowLibrary(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-[95vw] max-w-6xl glass-panel-cold rounded-[3rem] p-10 relative shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-10">
                <div className="text-left">
                  <h3 className="text-3xl font-black pixel-title-tarot tracking-tighter" data-text="Card Library">卡牌图书馆</h3>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Archive: 升级与重铸你的命运媒介</p>
                </div>
                <button onClick={() => setShowLibrary(false)} className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 hover:text-white transition-all">✕</button>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-6 max-h-[65vh] overflow-y-auto pr-4 custom-scrollbar">
                {fullDeck.map(card => {
                  const cardData = ownedCards[card.id] || {}
                  return (
                    <div key={card.id} className="group p-4 bg-slate-800/20 rounded-3xl border border-slate-800 space-y-4 hover:border-slate-700 transition-all">
                      <div className="aspect-[1/1.4] rounded-2xl bg-slate-800 relative overflow-hidden p-2">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                        <div className="w-full h-full rounded-xl overflow-hidden" style={{ backgroundColor: card.color }}>
                          <CardArt card={card} level={(ownedCards[card.id]?.[3] ? 3 : ownedCards[card.id]?.[2] ? 2 : ownedCards[card.id]?.[1] ? 1 : 1)} />
                        </div>
                        <span className="absolute bottom-2 left-2 right-2 text-[10px] font-black text-slate-400 text-center uppercase tracking-tighter group-hover:text-slate-200 transition-colors">{card.name}</span>
                      </div>
                      
                      <div className="flex gap-1 items-center justify-between">
                        <div className="flex gap-1 flex-1">
                          {[1, 2, 3].map(lvl => {
                            const count = cardData[lvl] || 0
                            return (
                              <div 
                                key={lvl} 
                                className={`flex-1 h-1.5 rounded-full ${
                                  count > 0 
                                    ? (lvl === 3 ? 'bg-indigo-400' : lvl === 2 ? 'bg-slate-300' : 'bg-indigo-600') 
                                    : 'bg-slate-800'
                                }`} 
                              />
                            )
                          })}
                        </div>
                        {Object.entries(cardData).some(([lvl, count]) => Number(lvl) < 3 && count >= 3) && (
                          <button 
                            onClick={() => synthesizeCard(card.id, Number(Object.entries(cardData).find(([lvl, count]) => Number(lvl) < 3 && count >= 3)![0]))}
                            className="ml-2 w-6 h-6 bg-indigo-500 text-white rounded-lg flex items-center justify-center text-[10px] shadow-[0_0_10px_rgba(129,140,248,0.4)] hover:scale-110 transition-transform"
                          >
                            ⏫
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 性格博物馆弹窗 */}
      <AnimatePresence>
        {showCodex && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 flex items-center justify-center z-[200] backdrop-blur-xl"
            onClick={() => setShowCodex(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-[95vw] max-w-5xl glass-panel-cold rounded-[3rem] p-10 relative shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-10">
                <div className="text-left">
                  <h3 className="text-3xl font-black pixel-title-tarot tracking-tighter" data-text="Personality Codex">性格博物馆</h3>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">MBTI Codex: 收集 16 种灵魂的高阶形态</p>
                </div>
                <button onClick={() => setShowCodex(false)} className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 hover:text-white transition-all">✕</button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-h-[65vh] overflow-y-auto pr-4 custom-scrollbar">
                {Object.keys(professionMap).map(mbti => {
                  const levels = codex[mbti] || new Set()
                  return (
                    <div key={mbti} className="group p-8 bg-slate-800/20 border border-slate-800 rounded-[2.5rem] space-y-6 backdrop-blur-md hover:border-indigo-500/30 transition-all shadow-2xl">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-4xl font-black text-white block tracking-tighter">{mbti}</span>
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{professionMap[mbti]}</span>
                        </div>
                        <div className={`w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-2xl transition-all ${levels.size > 0 ? 'grayscale-0' : 'grayscale opacity-30'}`}>
                          {mbti.includes('E') ? '🔥' : '❄️'}
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
                          <span>进化阶段</span>
                          <span className="text-indigo-400">{levels.size} / 3</span>
                        </div>
                        <div className="flex gap-3">
                          {[1, 2, 3].map(lvl => (
                            <div 
                              key={lvl}
                              className={`flex-1 h-3 rounded-full transition-all duration-700 relative overflow-hidden ${
                                levels.has(lvl) 
                                  ? (lvl === 3 ? 'bg-indigo-400 shadow-[0_0_15px_rgba(129,140,248,0.5)]' : lvl === 2 ? 'bg-slate-200' : 'bg-indigo-600') 
                                  : 'bg-slate-800'
                                }`}
                            >
                              {levels.has(lvl) && lvl === 3 && (
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent w-1/2 animate-shine" />
                              )}
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between items-center pt-2">
                          <span className="text-[9px] font-bold text-slate-600 uppercase tracking-tighter">
                            {levels.has(3) ? '✨ 最终形态已解锁' : levels.has(2) ? '⚡ 进阶形态' : levels.has(1) ? '🌑 初阶形态' : '🔒 尚未发现'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* 命运图签导出弹窗 */}
      <AnimatePresence>
        {showPoster && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/98 flex items-center justify-center z-[300] backdrop-blur-3xl p-4"
            onClick={() => setShowPoster(false)}
          >
            <motion.div 
              initial={{ scale: 0.8, rotateY: 30, opacity: 0 }}
              animate={{ scale: 1, rotateY: 0, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative w-full max-w-[380px] bg-slate-900 rounded-[2.5rem] border-4 border-slate-800 shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col items-center p-6 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 海报背景装饰 */}
              <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/20 via-slate-900 to-slate-900 pointer-events-none" />
              <div className="absolute top-0 left-0 w-full h-1/2 bg-[radial-gradient(circle_at_50%_0%,rgba(129,140,248,0.3)_0%,transparent_70%)] pointer-events-none" />
              
              {/* 装饰边框 */}
              <div className="absolute inset-4 border border-slate-700/50 rounded-[2rem] pointer-events-none" />
              
              <div className="relative z-10 w-full flex flex-col items-center h-full justify-between">
                <div className="space-y-1 mt-4">
                  <div className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">Pixel Fate Archive</div>
                  <div className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">{new Date().toLocaleDateString()}</div>
                </div>

                <div className="py-12 transform scale-125">
                  <PixelAvatar 
                    emotion="heroic" 
                    level={avatarState.level}
                    elementBias={avatarState.elementBias}
                    mbti={currentMBTI}
                    cardComposition={cardComposition}
                    onSpeak={() => {}} 
                  />
                </div>

                <div className="space-y-6 mb-8 w-full">
                  <div className="space-y-2">
                    <h4 className="text-4xl font-black text-white tracking-tighter drop-shadow-lg">
                      {computeMBTI(slots)}
                    </h4>
                    <p className="text-xs font-black text-indigo-400 uppercase tracking-[0.3em] bg-indigo-500/10 py-1.5 px-4 rounded-full inline-block border border-indigo-500/20">
                      {professionMap[computeMBTI(slots)] || '星界旅者'}
                    </p>
                  </div>
                  
                  <div className="relative px-4">
                    <div className="text-slate-500 text-xl absolute -top-4 -left-0 opacity-50">“</div>
                    <p className="text-sm text-slate-200 font-medium leading-relaxed italic px-2">
                      {finalNarrative || generateNarrative(slots)}
                    </p>
                    <div className="text-slate-500 text-xl absolute -bottom-6 -right-0 opacity-50">”</div>
                  </div>

                  {/* 抽出的卡牌缩略图 */}
                  <div className="flex justify-center gap-3 pt-6">
                    {slotOrder.map(k => slots[k]).map((c, i) => c && (
                      <div key={i} className="group relative">
                        <div className="w-10 h-16 rounded-xl border-2 border-slate-700 overflow-hidden relative shadow-2xl transition-transform hover:scale-110" style={{ backgroundColor: c.color }}>
                          <CardArt card={c} />
                          <div className="absolute bottom-1 right-1 flex gap-0.5">
                            {[...Array(c.level)].map((_, i2) => (
                              <div key={i2} className={`w-1 h-1 rounded-full ${c.level === 3 ? 'bg-indigo-400 shadow-[0_0_5px_rgba(129,140,248,0.8)]' : c.level === 2 ? 'bg-slate-300' : 'bg-slate-600'}`} />
                            ))}
                          </div>
                        </div>
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-[6px] font-black text-slate-500 uppercase tracking-tighter bg-slate-800 px-1 rounded-sm">{c.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-auto pb-4 flex flex-col items-center gap-4 w-full">
                  <div className="h-px w-32 bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
                  <div className="flex gap-3 w-full">
                    <button 
                      onClick={() => setShowPoster(false)}
                      className="flex-1 py-4 bg-slate-800 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-700 transition-all"
                    >
                      返回
                    </button>
                    <button 
                      onClick={handleExportPoster}
                      className="flex-[2] py-4 bg-white text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 active:scale-95 transition-all shadow-2xl flex items-center justify-center gap-2"
                    >
                      <span>💾</span>
                      <span>保存至图库</span>
                    </button>
                  </div>
                  {posterId !== null && (
                    <p className="text-[8px] text-slate-600 font-black uppercase tracking-widest">Digital Fate Record // ID: {posterId}</p>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 游戏操作说明弹窗 */}
      <AnimatePresence>
        {showInstructions && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 flex items-center justify-center z-[500] backdrop-blur-xl"
            onClick={() => setShowInstructions(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-[92vw] max-w-2xl glass-panel-cold rounded-[2.5rem] p-10 relative shadow-2xl overflow-hidden border border-indigo-500/20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-8">
                <div className="text-left">
                  <h3 className="text-2xl font-black pixel-title-tarot tracking-tighter" data-text="Arcane Guide">命运指南</h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">如何编织你的命运丝线</p>
                </div>
                <button onClick={() => setShowInstructions(false)} className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 hover:text-white transition-all">✕</button>
              </div>

              <div className="space-y-6 text-sm text-slate-300 custom-scrollbar max-h-[60vh] overflow-y-auto pr-4">
                <div className="space-y-3">
                  <h4 className="text-indigo-400 font-black uppercase tracking-wider text-xs flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                    仪式开启
                  </h4>
                  <p className="leading-relaxed opacity-80">点击顶部 <span className="text-white font-bold">Ritual (✦)</span> 按钮重新洗牌并开启一场全新的命运仪式。诚心冥想，准备迎接未知的启示。</p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-indigo-400 font-black uppercase tracking-wider text-xs flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                    卡牌等级与进化
                  </h4>
                  <p className="leading-relaxed opacity-80">卡牌分为 <span className="text-[#8B4513]">青铜</span>、<span className="text-[#C0C0C0]">白银</span>、<span className="text-[#FFD700]">黄金</span> 三个等级。等级越高，视觉效果越华丽，对最终性格形态的影响也越深远。</p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-indigo-400 font-black uppercase tracking-wider text-xs flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                    重铸与图书馆
                  </h4>
                  <p className="leading-relaxed opacity-80">在 <span className="text-white font-bold">Library (📜)</span> 中，你可以消耗 3 张同等级同名卡合成更高等级。已抽中的卡牌若拥有备份，可进行 <span className="text-indigo-400 font-bold">重铸</span>，在保持维度不变的情况下尝试获得更高品质。</p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-indigo-400 font-black uppercase tracking-wider text-xs flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                    导出命运档案
                  </h4>
                  <p className="leading-relaxed opacity-80">完成仪式后，点击 <span className="text-white font-bold">Export Fate Archive</span> 可生成并保存你的专属命运海报，记录这一刻的星轨指引。</p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-800 text-center">
                <button 
                  onClick={() => setShowInstructions(false)}
                  className="px-10 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-95 shadow-[0_0_20px_rgba(79,70,229,0.4)]"
                >
                  我已领悟
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const CardArt = React.memo(({ card, level, isUpright = true, useGoldCircuit = false }: { card: TarotCard; level?: number; isUpright?: boolean, useGoldCircuit?: boolean }) => {
  const l = level ?? card.level ?? 1
  const visual = getCardVisual(l)
  const [imgError, setImgError] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)

  // 统一图片 URL 处理
  const imageUrl = useMemo(() => {
    return card.image || ''
  }, [card.image])

  // 渲染风格分级 - 简化滤镜
  const filterStyle = useMemo(() => {
    if (l === 3) return 'contrast(1.1) brightness(1.1)'
    if (l === 2) return 'contrast(1.05) brightness(1.05)'
    return 'contrast(1.0) brightness(1.0)'
  }, [l])

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#050505] group font-cinzel pixel-art">
      {/* 羊皮纸底色 - 冷调，简化背景渐变 */}
      <div className="absolute inset-0 opacity-[0.08] mix-blend-multiply pointer-events-none z-15 bg-[#E0E0E0]" />

      {/* 背景材质层 */}
      <div 
        className={`absolute inset-0 transition-opacity duration-700`}
        style={{ 
          background: visual.background,
          opacity: visual.textureOpacity || 0.4 
        }}
      />

      {/* 金色丝线纹路 - 增强卡面质感 */}
      {useGoldCircuit && (
        <div className="absolute inset-0 pointer-events-none opacity-40 z-20">
          <svg width="100%" height="100%" viewBox="0 0 100 150">
            <defs>
              <linearGradient id="gold-line" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#d4af37" stopOpacity="0.2" />
                <stop offset="50%" stopColor="#ffd700" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#d4af37" stopOpacity="0.2" />
              </linearGradient>
            </defs>
            <path d="M10,20 L30,20 L35,15" stroke="url(#gold-line)" strokeWidth="0.2" fill="none" />
            <path d="M90,130 L70,130 L65,135" stroke="url(#gold-line)" strokeWidth="0.2" fill="none" />
            <circle cx="35" cy="15" r="0.5" fill="#ffd700" />
            <circle cx="65" cy="135" r="0.5" fill="#ffd700" />
          </svg>
        </div>
      )}
      
      {/* 卡面内容容器 - 方形比例 (Square) */}
      <div 
        className={`absolute inset-[6px] rounded-[1px] overflow-hidden transition-all duration-1000 ${
          l === 3 ? 'bg-black' : 
          l === 2 ? 'bg-[#0a0d14]' : 
          'bg-[#0f111a]'
        }`}
        style={{ filter: filterStyle }}
      >
        {imageUrl && !imgError ? (
          <motion.div 
            className="w-full h-full relative"
            initial={{ scale: 1.05, opacity: 0 }}
            animate={{ scale: 1, opacity: imgLoaded ? 1 : 0 }}
          >
            <img 
              src={imageUrl} 
              alt={card.name}
              crossOrigin="anonymous"
              className={`w-full h-full object-cover transition-all duration-1000 ${
                l === 3 ? 'opacity-100 saturate-[1.2]' : 
                l === 2 ? 'opacity-95 saturate-[1.1]' : 
                'opacity-90 saturate-[1.0]'
              }`}
              onError={() => setImgError(true)}
              onLoad={() => setImgLoaded(true)}
              style={{ 
                filter: `${visual.imageFilter} ${!isUpright ? 'brightness(0.6) saturate(1.2) contrast(1.1) hue-rotate(240deg)' : ''}`,
                transform: isUpright ? 'none' : 'rotate(180deg)'
              }}
            />
            
            {/* 卡面装饰层 - 增加内容对应感 */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />
            
            {/* 卡牌名称与关键词 - 底部浮现 */}
            <div className="absolute bottom-2 left-0 right-0 px-2 text-center transform transition-transform duration-500 translate-y-1 group-hover:translate-y-0">
              <div className={`text-[7px] font-bold uppercase tracking-[0.2em] mb-0.5 ${l === 3 ? 'text-yellow-200' : 'text-white/90'}`}>
                {card.name}
              </div>
              <div className="text-[5px] text-white/50 italic tracking-wider line-clamp-1">
                {card.meaning}
              </div>
            </div>

            {/* 顶部标识 */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 opacity-30">
              <div className="text-[7px] text-white/80 font-serif uppercase">
                {card.suit || 'MAJOR'}
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#050505] to-[#1a1c2c]">
            <div className="text-center space-y-3 p-4">
              <div className="text-5xl opacity-40">✨</div>
              <div className="text-[10px] font-black text-indigo-200/40 uppercase tracking-[0.3em]">
                {card.name}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 卡面边框 - 品质差异化边框 */}
      <div className={`absolute inset-0 border-[1.5px] rounded-[1px] pointer-events-none transition-all duration-700 ${visual.borderClass} ${visual.glowClass}`}>
        {/* 四角金线装饰 */}
        <div className="absolute inset-0 pointer-events-none opacity-50">
          <svg width="100%" height="100%" viewBox="0 0 100 170" fill="none">
            <path d="M5,12 L12,12 L12,5" stroke="#ffd700" strokeWidth="0.5" />
            <path d="M88,5 L88,12 L95,12" stroke="#ffd700" strokeWidth="0.5" />
            <path d="M5,158 L12,158 L12,165" stroke="#ffd700" strokeWidth="0.5" />
            <path d="M88,165 L88,158 L95,158" stroke="#ffd700" strokeWidth="0.5" />
          </svg>
        </div>
        
        {/* 金色三层叠加效果 */}
        {l === 3 && <div className="texture-gold-edge-inner" />}
        
        {/* 移除旧的流光逻辑，改用 CSS 实现 */}
      </div>
    </div>
  )
})

const SlotCard = React.memo(({ 
  config, 
  card, 
  onReforge, 
  isLocked, 
  onLock, 
}: { 
  config: { label: string; icon: string; dimension: string }; 
  card?: SelectedCard; 
  onReforge?: (card: SelectedCard) => void;
  isLocked?: boolean;
  onLock?: () => void;
}) => {
  if (!card) {
    return (
      <div className="aspect-[1/1.7] w-full border-[1.5px] border-white/5 rounded-xl flex flex-col items-center justify-center text-center p-2 group transition-all relative overflow-hidden bg-[#050505]">
        {/* 槽位内凹感 - 边缘阴影 */}
        <div className="absolute inset-0 shadow-[inset_0_10px_30px_rgba(0,0,0,1)] pointer-events-none" />
        
        {/* 背景材质 - 细腻石材纹理 */}
        <div className="absolute inset-0 bg-noise-texture opacity-5 pointer-events-none" />
        
        {/* 空槽底部的神秘符文光芒 - 改为冷紫色 */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-30 transition-opacity duration-1000">
          <div className="w-20 h-20 bg-indigo-500/10 blur-[30px] rounded-full" />
        </div>
        
        <div className="relative z-10 flex flex-col items-center">
          <motion.span 
            className="text-xl mb-1 grayscale opacity-10 group-hover:grayscale-0 group-hover:opacity-40 transition-all duration-700"
            whileHover={{ scale: 1.1 }}
          >
            {config.icon}
          </motion.span>
          <div className="h-px w-4 bg-white/5 mb-2 group-hover:w-8 group-hover:bg-indigo-500/20 transition-all duration-700" />
          <span className="text-[6px] font-bold uppercase tracking-[0.3em] text-slate-800 group-hover:text-indigo-400/40 transition-colors duration-700">
            {config.label}
          </span>
        </div>
      </div>
    )
  }

  const l = card.level || 1
  const visual = getCardVisual(l)

  // 粒子随机偏移量 - 极致简化版
  const particleConfig = useMemo(() => {
    return {
      gold: [{
        x1: (Math.random() - 0.5) * 10,
        x2: (Math.random() - 0.5) * 20,
        x3: (Math.random() - 0.5) * 30
      }],
      silver: [{
        x: (Math.random() - 0.5) * 25,
        y: (Math.random() - 0.5) * 25
      }]
    }
  }, [])
  
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="aspect-[1/1.7] w-full rounded-xl border-[1.5px] border-white/5 flex flex-col items-center justify-center relative overflow-hidden bg-slate-900/40"
    >
      {/* 槽位容器 */}
      <div className="relative w-full h-full flex flex-col items-center justify-center pt-1">
      <div className="absolute inset-3 border border-white/5 rounded-lg pointer-events-none opacity-10" />

      {/* 槽底符文激活状态 - 极致简化 */}
      <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${l === 3 ? 'opacity-20' : l === 2 ? 'opacity-10' : 'opacity-5'}`}>
        <div 
          className="w-16 h-16 blur-[15px] transition-colors duration-1000 rounded-full" 
          style={{ backgroundColor: visual.slotColor }}
        />
        <div className={`text-4xl select-none opacity-10 font-serif ${l === 3 ? 'text-yellow-400' : l === 2 ? 'text-slate-200' : 'text-slate-500'}`}>
          {l === 3 ? 'ᚦ' : l === 2 ? 'ᚨ' : 'ᛁ'}
        </div>
      </div>

      {/* 四角金线装饰 */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <svg width="100%" height="100%" viewBox="0 0 100 170" fill="none">
          <path d="M5,15 L15,15 L15,5" stroke="#ffd700" strokeWidth="0.5" />
          <path d="M85,5 L85,15 L95,15" stroke="#ffd700" strokeWidth="0.5" />
          <path d="M5,155 L15,155 L15,165" stroke="#ffd700" strokeWidth="0.5" />
          <path d="M85,165 L85,155 L95,155" stroke="#ffd700" strokeWidth="0.5" />
        </svg>
      </div>

      {/* 角落装饰符文 - 简化为静态 */}
      <div className="absolute top-4 left-4 text-[10px] opacity-10 text-white/20 select-none">ᚠ</div>
      <div className="absolute top-4 right-4 text-[10px] opacity-10 text-white/20 select-none">ᚢ</div>
      <div className="absolute bottom-4 left-4 text-[10px] opacity-10 text-white/20 select-none">ᚦ</div>
      <div className="absolute bottom-4 right-4 text-[10px] opacity-10 text-white/20 select-none">ᚨ</div>

      {/* 等级专属环境光效 - 简化 */}
      {(l === 3 || l === 2) && (
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.05]"
          style={{ background: `linear-gradient(to top, ${visual.accentColor}, transparent)` }}
        />
      )}

      {/* 动态星尘背景 - 仅传奇卡牌显示 */}
      {l === 3 && (
        <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden rounded-xl z-0">
          <motion.div
            animate={{
              opacity: [0, 0.4, 0],
              y: [0, -30],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute bottom-0 left-1/2 w-0.5 h-0.5 bg-white rounded-full blur-[1px]"
          />
        </div>
      )}

      <div className="w-full h-full flex flex-col items-center justify-between py-6 px-2 text-center z-10">
        <div className={`text-[8px] font-serif font-black truncate w-full uppercase tracking-[0.4em] transition-colors duration-700 -mt-2 ${
          l === 3 ? 'text-indigo-300' : 
          l === 2 ? 'text-slate-300' : 
          'text-slate-400/80 italic'
        }`}>
          {card.name}
        </div>
        
        <motion.div 
          className={`w-24 h-40 rounded shadow-2xl relative group overflow-hidden transition-all duration-700 ${
            l === 3 ? 'ring-1 ring-white/10 ring-offset-1 ring-offset-slate-900' : 
            l === 2 ? 'ring-1 ring-white/5 ring-offset-1 ring-offset-slate-900' : 
            'ring-1 ring-white/5 ring-offset-1 ring-offset-slate-900'
          } ${visual.glowClass}`} 
          style={{ transform: card.isUpright ? 'none' : 'rotate(180deg)' }}
        >
          <CardArt card={card} level={l} isUpright={card.isUpright} useGoldCircuit={l >= 2} />
          
          {/* 入槽时的冲击特效 - 简化 */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.4, 0] }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-30 pointer-events-none"
            style={{ backgroundColor: `${visual.accentColor}22` }}
          />

          {/* 额外等级特效：金卡粒子 / 银卡星芒爆发 */}
          <AnimatePresence>
            {l === 3 && (
              <>
                {/* 金色粒子爆发 - 极简 */}
                <div className="absolute inset-0 z-50 pointer-events-none overflow-hidden">
                  {particleConfig.gold.slice(0, 2).map((p, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 0 }}
                      animate={{ 
                        opacity: [0, 0.6, 0], 
                        y: [0, -40],
                        x: [p.x1, p.x3]
                      }}
                      transition={{ duration: 3, delay: i * 0.5, ease: "linear", repeat: Infinity }}
                      className="absolute bottom-0 left-1/2 w-0.5 h-0.5 bg-yellow-400 rounded-full"
                    />
                  ))}
                </div>
              </>
            )}
            {l === 2 && (
              <>
                {/* 银色星芒爆发 - 极简 */}
                <div className="absolute inset-0 z-40 pointer-events-none overflow-hidden">
                  {particleConfig.silver.slice(0, 1).map((p, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ 
                        opacity: [0, 0.4, 0], 
                        x: [0, p.x],
                        y: [0, p.y]
                      }}
                      transition={{ duration: 2, ease: "linear" }}
                      className="absolute top-1/2 left-1/2 w-0.5 h-0.5 bg-slate-300 rounded-full"
                    />
                  ))}
                </div>
              </>
            )}
            {l === 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.2, 0] }}
                transition={{ duration: 0.8 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 border border-indigo-900/20 rounded-full"
              />
            )}
          </AnimatePresence>
        </motion.div>

        <div className="flex flex-col items-center gap-1">
          <div className={`text-[6px] font-black uppercase tracking-[0.5em] transition-colors duration-500 ${
            card.isUpright ? 'text-slate-600' : 'text-purple-900/60'
          }`}>
            {card.isUpright ? 'Upright' : 'Reversed'}
          </div>
        </div>
      </div>
      
      {onReforge && !isLocked && !card.reforged && (
        <div className="absolute inset-[1px] bg-black/85 opacity-0 hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center group z-40 rounded-xl border border-indigo-500/20 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
          <button 
            onPointerDown={() => onReforge(card)}
            className="pixel-btn-standard text-indigo-400 text-[8px] font-black px-6 py-2.5 rounded-full shadow-[0_0_20px_rgba(129,140,248,0.2)] border border-indigo-500/30 transform group-hover:scale-105 active:scale-95 transition-all uppercase tracking-[0.2em] whitespace-nowrap"
          >
            <span className="neon-text">✦ 重铸命运之环 ✦</span>
          </button>
        </div>
      )}

      {isLocked && onLock && !card.reforged && (
        <button 
          onPointerDown={(e) => {
            e.stopPropagation();
            onLock();
          }}
          className="absolute top-4 right-4 z-50 w-8 h-8 flex items-center justify-center bg-indigo-500/20 rounded-full border border-indigo-400/30 text-indigo-300 hover:bg-indigo-500/40 transition-all"
        >
          🔓
        </button>
      )}

      </div>
    </motion.div>
  )
})
