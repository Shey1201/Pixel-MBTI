import React, { useMemo, useState } from 'react'
import { motion } from 'framer-motion'

export type Emotion = 'normal' | 'heroic' | 'contemplative' | 'panic'
export type ElementType = 'fire' | 'water' | 'air' | 'earth' | null

interface PixelAvatarProps {
  emotion: Emotion
  level: number // 1: 初阶, 2: 进阶, 3: 终极
  elementBias: ElementType
  mbti: string
  cardComposition?: { level: number }[]  // 新增：卡牌组合信息
  currentNarrative?: string  // 新增：当前叙述内容
  onSpeak: (message: string) => void
}

const PixelAvatar: React.FC<PixelAvatarProps> = React.memo(({ emotion, level, elementBias, mbti, cardComposition, currentNarrative, onSpeak }) => {
  const [isJumping, setIsJumping] = useState(false)

  const handleInteract = () => {
    setIsJumping(true)
    onSpeak(currentNarrative || getTitle())
    setTimeout(() => setIsJumping(false), 500)
  }

  // 根据元素获取颜色主题与粒子效果
  const getElementTheme = () => {
    switch (elementBias) {
      case 'fire': return { primary: 'bg-indigo-600', secondary: 'bg-purple-900', glow: 'shadow-[0_0_15px_rgba(138,43,226,0.3)]', particle: '✨', textColor: 'text-indigo-400' }
      case 'water': return { primary: 'bg-blue-600', secondary: 'bg-slate-900', glow: 'shadow-[0_0_15px_rgba(59,130,246,0.3)]', particle: '💧', textColor: 'text-blue-400' }
      case 'air': return { primary: 'bg-purple-500', secondary: 'bg-indigo-950', glow: 'shadow-[0_0_15px_rgba(168,85,247,0.3)]', particle: '🌬️', textColor: 'text-purple-400' }
      case 'earth': return { primary: 'bg-slate-700', secondary: 'bg-slate-900', glow: 'shadow-[0_0_15px_rgba(71,85,105,0.3)]', particle: '🌑', textColor: 'text-slate-400' }
      default: return { primary: 'bg-slate-600', secondary: 'bg-slate-700', glow: '', particle: '', textColor: 'text-slate-400' }
    }
  }

  // 根据卡牌组合计算视觉层级
  const getVisualTier = (): 'basic' | 'advanced' | 'ultimate' => {
    if (!cardComposition || cardComposition.length === 0) {
      return level === 3 ? 'ultimate' : level === 2 ? 'advanced' : 'basic'
    }
    
    const legendaryCount = cardComposition.filter(c => c.level === 3).length
    const superiorCount = cardComposition.filter(c => c.level === 2).length
    
    if (legendaryCount >= 2) return 'ultimate'  // 2+传奇 = 终极形态
    if (legendaryCount >= 1 || superiorCount >= 2) return 'advanced'  // 1传奇或2+卓越 = 进阶
    return 'basic'  // 全平庸 = 初阶
  }

  const visualTier = getVisualTier()

  // 根据元素获取增强视觉效果
  const getElementVisuals = () => {
    const base = getElementTheme()
    
    if (visualTier === 'ultimate') {
      // 传奇级元素特效
      switch (elementBias) {
        case 'fire':
          return {
            ...base,
            glow: 'shadow-[0_0_20px_rgba(138,43,226,0.5)]',
            particles: ['✨', '🟣'],
            backgroundEffect: 'bg-indigo-900/10'
          }
        case 'water':
          return {
            ...base,
            glow: 'shadow-[0_0_20px_rgba(59,130,246,0.5)]',
            particles: ['💧', '💫'],
            backgroundEffect: 'bg-blue-900/10'
          }
        case 'air':
          return {
            ...base,
            glow: 'shadow-[0_0_20px_rgba(168,85,247,0.5)]',
            particles: ['🌬️', '✨'],
            backgroundEffect: 'bg-purple-900/10'
          }
        case 'earth':
          return {
            ...base,
            glow: 'shadow-[0_0_20px_rgba(71,85,105,0.5)]',
            particles: ['🌑', '✨'],
            backgroundEffect: 'bg-slate-900/10'
          }
        default:
          return base
      }
    }
    
    return base
  }

  const enhancedTheme = getElementVisuals()
  const theme = enhancedTheme

  // 根据情绪与等级选择 CSS 动画类
  const getAvatarAnimationClass = () => {
    if (visualTier === 'ultimate') return 'animate-avatar-ultimate'
    if (visualTier === 'advanced') return 'animate-avatar-advanced'
    switch (emotion) {
      case 'heroic': return 'animate-avatar-heroic'
      case 'contemplative': return 'animate-avatar-contemplative'
      case 'panic': return 'animate-avatar-panic'
      default: return 'animate-avatar-basic'
    }
  }

  const getTitle = () => {
    const titles: Record<string, string[]> = {
      INTJ: ['星轨观察者', '维度架构师', '极境主宰者'],
      INTP: ['遗迹考证师', '真理博弈家', '虚空解构者'],
      ENTJ: ['帝国将领', '秩序裁决官', '恒星执政官'],
      ENTP: ['浪潮博弈家', '逻辑粉碎机', '奇点悖论者'],
      INFJ: ['心灵牧者', '幽影提灯人', '永恒守望者'],
      INFP: ['星愿诗人', '梦境织造者', '灵魂回响家'],
      ENFJ: ['秩序导师', '辉光领袖', '天启引导者'],
      ENFP: ['奇想学徒', '灵感捕手', '梦境织造者'],
      ISTJ: ['城防执事', '钢铁律法师', '永恒之基'],
      ISFJ: ['温存护佑者', '静谧守护人', '生命之盾'],
      ESTJ: ['工坊监工', '效率统治者', '不破铁幕'],
      ESFJ: ['会盟外交官', '和谐编织者', '众星之桥'],
      ISTP: ['潜行技师', '利刃工匠', '绝对零度'],
      ISFP: ['林野画师', '色彩流浪者', '万物共鸣者'],
      ESTP: ['破阵先锋', '极速掠夺者', '雷鸣主宰'],
      ESFP: ['剧团星子', '极光舞者', '永恒庆典'],
    }
    const mbtiTitles = titles[mbti] || ['初阶影人', '进阶行者', '极境掠夺者']
    
    // 如果有传奇卡，优先使用最高级称号
    if (cardComposition && cardComposition.some(c => c.level === 3)) {
      return mbtiTitles[2] || mbtiTitles[level - 1]
    }
    
    return mbtiTitles[level - 1] || mbtiTitles[0]
  }

  return (
    <div className="relative flex flex-col items-center group cursor-pointer" onPointerDown={handleInteract}>
      {/* 终极形态背景意象 - 旋转法阵 - 简化 */}
      {visualTier === 'ultimate' && (
        <>
          <div 
            className={`absolute -inset-12 border border-dashed rounded-full opacity-10 ${theme.primary.replace('bg-', 'border-')} animate-spin-linear`}
            style={{ '--duration': '20s' } as React.CSSProperties}
          />
          <AvatarParticles themePrimary={theme.primary} visualTier={visualTier} />
        </>
      )}

      {/* 进阶形态背景 - 简化 */}
      {visualTier === 'advanced' && (
        <>
          <div 
            className={`absolute -inset-10 border border-dashed rounded-full opacity-5 ${theme.primary.replace('bg-', 'border-')} animate-pulse-opacity`}
            style={{ '--min-opacity': 0.05, '--max-opacity': 0.1, '--duration': '4s' } as React.CSSProperties}
          />
          <AvatarParticles themePrimary={theme.primary} visualTier={visualTier} />
        </>
      )}

      {/* 像素小人主体 */}
      <div 
        className={`relative w-20 h-20 flex items-center justify-center ${isJumping ? '-translate-y-4' : ''} transition-transform duration-300 ${getAvatarAnimationClass()}`}
      >
        {/* 流光特效 (传奇级) - 简化 */}
        {visualTier === 'ultimate' && (
          <div 
            className={`absolute inset-0 rounded-full blur-2xl ${theme.primary.replace('bg-', 'bg-opacity-20 bg-')}`}
          />
        )}

        {/* 像素小人主体 structure */}
        <div className={`relative w-10 h-12 bg-slate-800 rounded-sm border-2 border-slate-900 shadow-xl transition-all duration-700 ${visualTier !== 'basic' ? theme.glow : ''}`}>
          {/* 核心能量核 (仅限终极形态) - 简化 */}
          {visualTier === 'ultimate' && (
            <div 
              className={`absolute inset-1 rounded-sm ${theme.primary} opacity-10 blur-[1px]`}
            />
          )}

          {/* 眼睛 - 随进化改变 */}
          <div className={`absolute top-2 left-2 w-2 h-2 ${visualTier === 'ultimate' ? 'bg-white' : visualTier === 'advanced' ? 'bg-cyan-300' : 'bg-cyan-400'} transition-colors duration-1000`} />
          <div className={`absolute top-2 right-2 w-2 h-2 ${visualTier === 'ultimate' ? 'bg-white' : visualTier === 'advanced' ? 'bg-cyan-300' : 'bg-cyan-400'} transition-colors duration-1000`} />
          
          {/* 装饰层 (进阶形态) */}
          {visualTier !== 'basic' && (
            <>
              {/* 服饰细节 */}
              <div className={`absolute top-5 left-1 right-1 h-1.5 ${theme.primary} opacity-30 rounded-full`} />
              <div className={`absolute bottom-0 w-full h-5 ${theme.secondary} opacity-50 rounded-b-sm`} />
              
              {/* MBTI 特征表达 - 简化 */}
              {mbti.includes('E') && (
                <div 
                  className="absolute -top-2 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-indigo-400/40"
                />
              )}
              {mbti.includes('N') && <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] opacity-60">{theme.particle}</div>}
              {mbti.includes('T') && <div className="absolute top-2 -left-2 w-1.5 h-4 bg-cyan-200/20 rotate-12" />}
              {mbti.includes('J') && <div className="absolute bottom-1 -right-2 w-3 h-3 bg-white/10 rotate-45 border border-white/20" />}
            </>
          )}

          {/* 终极形态浮空道具与特效 - 简化 */}
          {visualTier === 'ultimate' && (
            <>
              <div 
                className={`absolute -right-8 top-2 w-4 h-4 rounded-lg ${theme.primary} opacity-40 blur-[2px] animate-float`}
              />
              <div 
                className={`absolute -left-8 bottom-2 w-3 h-3 rounded-lg ${theme.secondary} opacity-30 blur-[2px] animate-float`}
              />
            </>
          )}
        </div>

        {/* 阴影 */}
        <div className={`absolute -bottom-2 w-8 h-2 bg-black/40 rounded-full blur-md ${visualTier === 'ultimate' ? 'w-10 h-3 bg-black/60' : ''}`} />
      </div>

      {/* 进化称号 */}
      <div className="mt-4 flex flex-col items-center gap-1.5">
        <motion.span 
          key={getTitle()}
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.25em] border-2 shadow-2xl transition-all ${
          visualTier === 'ultimate' ? 'bg-indigo-500/30 border-indigo-400 text-indigo-300 shadow-indigo-500/40 scale-110' :
          visualTier === 'advanced' ? 'bg-purple-500/25 border-purple-400 text-purple-300 shadow-purple-500/30' :
          'bg-slate-800/80 border-slate-700 text-slate-400'
        }`}>
          {getTitle()}
        </motion.span>
      </div>
    </div>
  )
})

export default PixelAvatar

interface AvatarParticlesProps {
  visualTier: 'basic' | 'advanced' | 'ultimate'
  themePrimary: string
}

function AvatarParticles({ visualTier, themePrimary }: AvatarParticlesProps) {
  const randoms = useMemo(() => {
    const seeded = (i: number, offset: number) => {
      const tierSeed = visualTier === 'ultimate' ? 3 : visualTier === 'advanced' ? 2 : 1
      const v = Math.sin((i + 1) * 12.9898 + (offset + 1) * 78.233 + tierSeed * 437.585453)
      const frac = v - Math.floor(v)
      return frac
    }
    const range = visualTier === 'ultimate' ? 80 : 60
    // 减少粒子数量：终极形态最多 4 个，进阶 2 个
    const actualCount = visualTier === 'ultimate' ? 4 : visualTier === 'advanced' ? 2 : 0
    return Array.from({ length: actualCount }).map((_, i) => ({
      x: (seeded(i, 0) - 0.5) * range,
      y: (seeded(i, 1) - 0.5) * range,
      duration: 4 + seeded(i, 2) * 2,
      delay: seeded(i, 3) * 1
    }))
  }, [visualTier])
  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible">
      {randoms.map((r, i) => (
        <div
          key={i}
          className={`absolute left-1/2 top-1/2 w-0.5 h-0.5 rounded-full ${themePrimary} opacity-30 animate-particle-scatter`}
          style={{ 
            '--x': `${r.x}px`, 
            '--y': `${r.y}px`, 
            '--duration': `${r.duration}s`, 
            '--delay': `${r.delay}s` 
          } as React.CSSProperties}
        />
      ))}
    </div>
  )
}
