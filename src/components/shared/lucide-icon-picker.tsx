'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import * as LucideIcons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

interface IconPickerProps {
  value?: string
  onChange: (iconName: string) => void
  className?: string
}

interface IconItem {
  kebabName: string
  pascalName: string
  keywords: string[]
}

// Word-level alias map: what user types → which icon name parts it maps to
const aliasMap: Record<string, string[]> = {
  setting: ['settings', 'setting', 'gear', 'cog', 'cogs', 'config', 'configure', 'preferences', 'preference'],
  system: ['settings', 'setting', 'gear', 'cog', 'cogs', 'system', 'tools', 'wrench', 'sliders', 'sliders-horizontal'],
  config: ['settings', 'setting', 'sliders', 'sliders-horizontal', 'sliders-vertical'],
  phone: ['phone', 'phone-call', 'phone-forwarded', 'phone-incoming', 'phone-outgoing', 'phone-missed', 'phone-off', 'telephone'],
  mail: ['mail', 'mailbox', 'inbox', 'email', 'send', 'send-horizontal'],
  message: ['message-square', 'message-circle', 'message-circle-2', 'message-circle-dashed', 'message-circle-plus', 'messages-square', 'chat', 'chat-circle', 'chat-bubble', 'speech'],
  chat: ['message-square', 'message-circle', 'messages-square', 'chat', 'chat-bubble', 'chat-circle'],
  money: ['dollar-sign', 'euro', 'pound-sign', 'yen', 'bitcoin', 'coins', 'coin', 'credit-card', 'wallet', 'banknote', 'cash', 'currency'],
  card: ['credit-card', 'gift', 'wallet', 'banknote'],
  file: ['file', 'file-text', 'file-plus', 'file-minus', 'file-edit', 'file-x', 'file-search', 'file-code', 'file-json', 'files', 'document', 'docs'],
  folder: ['folder', 'folder-open', 'folder-plus', 'folder-minus', 'folder-x', 'archive', 'package', 'directories'],
  image: ['image', 'images', 'photo', 'picture', 'gallery', 'camera', 'aperture', 'frame'],
  video: ['video', 'video-off', 'videotape', 'film', 'clapperboard', 'tv', 'tv-2'],
  check: ['check', 'check-circle', 'check-circle-2', 'check-square', 'check-square-2', 'checks', 'verified', 'badge-check'],
  trash: ['trash', 'trash-2', 'trash-can'],
  edit: ['edit', 'edit-2', 'edit-3', 'pencil', 'pen', 'write', 'note'],
  lock: ['lock', 'lock-keyhole', 'lock-square', 'password', 'shield', 'shield-check', 'shield-alert'],
  globe: ['globe', 'globe-2', 'world', 'international', 'web'],
  user: ['user', 'users', 'user-plus', 'user-minus', 'user-check', 'user-x', 'user-circle', 'person', 'people', 'contact'],
  build: ['building', 'building-2', 'factory', 'office', 'company', 'store', 'shop'],
  heart: ['heart', 'heart-handshake', 'heart-pulse', 'heart-crack', 'heart-off'],
  star: ['star', 'star-half', 'star-half-2'],
  search: ['search', 'find', 'magnifying'],
  bell: ['bell', 'bell-ring', 'bell-plus', 'bell-minus', 'bell-off', 'notification', 'notifications', 'alert'],
  flag: ['flag', 'flag-pennant', 'bookmark', 'bookmark-check', 'tag', 'tags', 'label'],
  home: ['home', 'home-2', 'house', 'house-2'],
  map: ['map', 'map-pin', 'map-pin-2', 'navigation', 'compass', 'location', 'gps', 'pin'],
  play: ['play', 'play-circle', 'pause', 'stop', 'skip', 'rewind', 'fast-forward', 'shuffle', 'repeat'],
  save: ['save', 'floppy', 'download', 'upload'],
  print: ['printer', 'scan', 'print'],
  trash2: ['trash', 'trash-2', 'trash-can', 'bin'],
  shield: ['shield', 'shield-check', 'shield-alert', 'shield-question', 'shield-x', 'shield-plus', 'lock'],
  link: ['link', 'link-2', 'link-2', 'chain', 'chain-link', 'unlink'],
  plus: ['plus', 'plus-circle', 'plus-square', 'add', 'create', 'new'],
  minus: ['minus', 'minus-circle', 'minus-square', 'remove', 'delete', 'subtract'],
  eye: ['eye', 'eye-off', 'visible', 'view', 'show', 'hide'],
  code: ['code', 'code-2', 'terminal', 'code-square', 'bracket', 'brackets', 'angle'],
  server: ['server', 'server-2', 'database', 'hard-drive', 'cpu', 'cluster'],
  cloud: ['cloud', 'cloud-sun', 'cloud-moon', 'cloud-rain', 'cloud-snow', 'cloud-lightning'],
  sun: ['sun', 'sunrise', 'sunset', 'sun-medium', 'sun-dim', 'brightness'],
  moon: ['moon', 'night'],
  star2: ['star', 'star-half'],
  gift: ['gift', 'present'],
  fire: ['flame', 'flame-kindling', 'crown', 'trophy'],
  tool: ['wrench', 'wrench-2', 'hammer', 'screwdriver', 'tools', 'tool'],
  alert: ['alert-circle', 'alert-triangle', 'alert-octagon', 'warning', 'info', 'error', 'danger'],
  info: ['info', 'information', 'help', 'help-circle', 'question'],
  network: ['network', 'networking', 'wifi', 'bluetooth', 'radio', 'signal'],
  activity: ['activity', 'pulse', 'trending-up', 'trending-down', 'chart', 'bar-chart', 'pie-chart'],
  calendar: ['calendar', 'calendar-2', 'calendar-check', 'calendar-plus', 'calendar-x', 'date', 'schedule', 'clock'],
  clock: ['clock', 'clock-2', 'clock-3', 'clock-4', 'time', 'hour'],
  alarm: ['alarm-clock', 'timer', 'hourglass'],

  // Sức khỏe & Y tế
  health: ['heart-pulse', 'activity', 'stethoscope', 'pill', 'syringe', 'cross', 'hospital', 'plus'],
  medical: ['stethoscope', 'pill', 'syringe', 'cross', 'hospital', 'plus', 'activity', 'heart-pulse'],
  hospital: ['hospital', 'cross', 'plus', 'stethoscope'],
  pill: ['pill', 'pill-bottle', 'capsule', 'syringe', 'tablet'],
  tooth: ['tooth', 'smile', 'smile-plus'],

  // Giáo dục & Học tập
  book: ['book', 'book-open', 'book-text', 'books', 'library', 'graduation-cap', 'notebook', 'notebook-pen', 'notebook-text'],
  school: ['graduation-cap', 'book-open', 'school', 'university', 'library'],
  learn: ['book-open', 'book-text', 'graduation-cap', 'lightbulb', 'brain'],
  study: ['book-open', 'book-text', 'books', 'library', 'notebook'],
  pencil: ['pencil', 'pencil-line', 'pen', 'edit', 'note'],
  brain: ['brain', 'brain-circuit', 'lightbulb', 'book-open'],

  // Thương mại & Mua sắm
  shop: ['shopping-bag', 'shopping-cart', 'shopping-basket', 'store', 'bag'],
  cart: ['shopping-cart', 'shopping-basket', 'cart'],
  bag: ['shopping-bag', 'briefcase', 'bag'],
  product: ['package', 'package-2', 'box', 'shopping-bag', 'tag'],
  sale: ['badge-percent', 'tag', 'tags', 'dollar-sign', 'ticket-percent'],
  discount: ['badge-percent', 'tag', 'tags', 'ticket-percent'],
  receipt: ['receipt', 'file-text', 'scroll-text'],

  // Vận chuyển & Du lịch
  car: ['car', 'car-front', 'car-taxi-front', 'truck', 'bus', 'bike'],
  truck: ['truck', 'container'],
  plane: ['plane', 'plane-takeoff', 'plane-landing', 'send'],
  ship: ['ship', 'ship-wheel', 'anchor'],
  bike: ['bike', 'bicycle'],
  map2: ['map', 'map-pin', 'map-pin-2', 'navigation', 'compass', 'route'],
  route: ['route', 'route-off', 'map', 'navigation', 'signpost'],
  compass: ['compass', 'navigation', 'map', 'locate', 'locate-fixed'],

  // Thời tiết & Thiên nhiên
  weather: ['cloud', 'cloud-sun', 'cloud-moon', 'cloud-rain', 'cloud-snow', 'cloud-lightning', 'sun', 'moon', 'rainbow'],
  rain: ['cloud-rain', 'umbrella', 'cloud', 'droplet', 'droplets'],
  snow: ['cloud-snow', 'snowflake', 'cloud'],
  wind: ['wind', 'cloud'],
  tree: ['tree-pine', 'tree-deciduous', 'tree-palm', 'trees', 'leaf'],
  leaf: ['leaf', 'tree-deciduous', 'flower', 'flower-2', 'sprout'],
  fire2: ['flame', 'flame-kindling', 'fire-extinguisher'],

  // Âm nhạc & Giải trí
  music: ['music', 'music-2', 'music-3', 'music-4', 'headphones', 'speaker', 'radio'],
  play2: ['play', 'play-circle', 'pause', 'stop-circle', 'disc', 'album'],
  volume: ['volume', 'volume-1', 'volume-2', 'volume-x', 'speaker', 'mic', 'mic-off'],
  mic: ['mic', 'mic-off', 'audio-lines', 'audio-waveform'],
  headphones: ['headphones', 'music', 'volume-2'],

  // Gia đình & Con người
  family: ['users', 'users-round', 'users-2', 'baby', 'person-standing', 'heart'],
  baby: ['baby', 'heart', 'users'],
  man: ['user', 'person-standing', 'user-round'],
  woman: ['user', 'user-round', 'person-standing'],
  group: ['users', 'users-2', 'users-round', 'group'],

  // Bảo mật & Cảnh báo
  security: ['shield', 'shield-check', 'shield-alert', 'lock', 'lock-keyhole', 'key', 'key-round', 'fingerprint'],
  key: ['key', 'key-round', 'lock', 'lock-keyhole'],
  fingerprint: ['fingerprint', 'scan-face', 'scan-line', 'shield-check'],
  password: ['lock', 'key', 'shield', 'asterisk', 'eye-off'],
  danger: ['alert-triangle', 'alert-octagon', 'siren', 'flame', 'skull'],

  // Thao tác & Công cụ
  filter: ['filter', 'list-filter', 'sliders-horizontal', 'sliders-vertical', 'arrow-up-down'],
  sort: ['arrow-up-down', 'arrow-up-narrow-wide', 'arrow-down-wide-narrow', 'list-filter'],
  refresh: ['refresh-ccw', 'refresh-cw', 'rotate-ccw', 'rotate-cw', 'repeat'],
  sync: ['refresh-ccw', 'refresh-cw', 'rotate-ccw', 'rotate-cw', 'sync'],
  download: ['download', 'arrow-down', 'arrow-down-to-line', 'save'],
  upload: ['upload', 'arrow-up', 'arrow-up-from-line', 'cloud-upload'],
  share: ['share', 'share-2', 'forward', 'send'],
  copy2: ['copy', 'clipboard', 'clipboard-copy', 'files'],
  cut2: ['scissors', 'scissors-line-dashed', 'cut'],
  paste: ['clipboard-paste', 'clipboard', 'copy'],
  undo2: ['undo', 'undo-2', 'rotate-ccw'],
  redo2: ['redo', 'redo-2', 'rotate-cw'],
  zoom: ['zoom-in', 'zoom-out', 'search', 'maximize', 'minimize', 'scan'],
  expand: ['maximize', 'expand', 'chevrons-up-down', 'chevrons-left-right'],
  collapse: ['minimize', 'shrink', 'chevrons-down-up', 'chevrons-right-left'],
  move: ['move', 'move-3d', 'arrows-up-down-left-right', 'hand'],
  drag: ['grip-vertical', 'grip-horizontal', 'move', 'hand'],

  // Layout & UI
  menu: ['menu', 'list', 'align-justify', 'panel-left', 'panel-right'],
  grid: ['layout-grid', 'grid-2x2', 'grid-3x3', 'table-2'],
  list: ['list', 'list-ordered', 'list-checks', 'list-tree', 'menu'],
  table: ['table', 'table-2', 'rows-2', 'columns-2', 'layout-grid'],
  columns: ['columns-2', 'columns-3', 'layout-template', 'panel-left', 'panel-right'],
  rows: ['rows-2', 'rows-3', 'layout-list'],
  sidebar: ['panel-left', 'panel-right', 'panel-left-close', 'panel-right-close', 'layout-template'],
  layout: ['layout-template', 'layout-grid', 'layout-list', 'layout-dashboard', 'layout-panel-top'],

  // Mũi tên & Chuyển động
  arrow: ['arrow-right', 'arrow-left', 'arrow-up', 'arrow-down', 'move-right', 'move-left', 'move-up', 'move-down'],
  arrowRight: ['arrow-right', 'move-right', 'chevron-right', 'circle-arrow-right'],
  arrowLeft: ['arrow-left', 'move-left', 'chevron-left', 'circle-arrow-left'],
  arrowUp: ['arrow-up', 'move-up', 'chevron-up', 'circle-arrow-up', 'arrow-up-from-line', 'arrow-up-to-line'],
  arrowDown: ['arrow-down', 'move-down', 'chevron-down', 'circle-arrow-down', 'arrow-down-from-line', 'arrow-down-to-line'],
  next: ['arrow-right', 'chevron-right', 'circle-arrow-right', 'step-forward'],
  previous: ['arrow-left', 'chevron-left', 'circle-arrow-left', 'step-back'],
  forward: ['arrow-right', 'forward', 'chevron-right', 'redo'],
  back: ['arrow-left', 'undo', 'chevron-left', 'rotate-ccw'],

  // File & Dữ liệu
  doc: ['file-text', 'file', 'file-code', 'file-json', 'file-spreadsheet', 'document'],
  pdf: ['file-text', 'file'],
  excel: ['file-spreadsheet', 'sheet', 'table'],
  csv: ['file-spreadsheet', 'sheet', 'table', 'file-text'],
  zip: ['file-archive', 'file-zipper', 'archive'],
  download2: ['download', 'arrow-down', 'save'],
  import: ['download', 'arrow-down-to-line', 'file-input'],
  export: ['upload', 'arrow-up-from-line', 'file-output', 'share'],

  // Database & Server
  database: ['database', 'database-backup', 'server', 'hard-drive', 'storage'],
  storage: ['hard-drive', 'database', 'server', 'cloud', 'save'],
  backup: ['database-backup', 'save', 'archive', 'copy'],
  api: ['plug', 'plug-2', 'plug-zap', 'cable', 'webhook', 'code-2'],
  webhook: ['webhook', 'plug', 'plug-zap', 'radio'],
  terminal2: ['terminal', 'terminal-square', 'code', 'code-2', 'square-code'],

  // Thời gian
  date: ['calendar', 'calendar-days', 'calendar-2', 'clock'],
  time: ['clock', 'clock-2', 'clock-3', 'clock-4', 'timer', 'hourglass'],
  today: ['calendar-days', 'calendar-check', 'sun'],
  tomorrow: ['calendar-arrow-up', 'arrow-right', 'sun'],
  yesterday: ['calendar-arrow-down', 'arrow-left', 'moon'],
  week: ['calendar-week', 'calendar'],
  month: ['calendar', 'calendar-month'],
  year: ['calendar', 'history'],

  // Trạng thái
  loading: ['loader', 'loader-2', 'loader-3', 'loader-4', 'loader-circle', 'refresh-cw'],
  success: ['check', 'check-circle', 'check-circle-2', 'badge-check', 'circle-check'],
  error2: ['x', 'x-circle', 'circle-x', 'ban', 'octagon-x', 'triangle-alert'],
  warning: ['alert-triangle', 'alert-circle', 'triangle-alert', 'siren'],
  pending: ['clock', 'loader', 'hourglass', 'timer'],
  offline: ['wifi-off', 'plug-zap-off', 'power-off', 'circle-off'],
  online: ['wifi', 'circle-dot', 'circle-check', 'plug'],

  // Thanh toán
  pay: ['credit-card', 'wallet', 'banknote', 'dollar-sign', 'receipt'],
  payment: ['credit-card', 'wallet', 'banknote', 'receipt', 'dollar-sign'],
  invoice: ['receipt', 'file-text', 'file-invoice'],
  bank: ['banknote', 'landmark', 'building', 'wallet', 'piggy-bank'],
  coin: ['coins', 'coin', 'dollar-sign', 'bitcoin', 'circle-dollar-sign'],

  // Phương tiện truyền thông
  social: ['share', 'share-2', 'at-sign', 'hash', 'message-circle'],
  twitter: ['twitter', 'bird', 'message-circle'],
  facebook: ['facebook', 'message-circle'],
  instagram: ['instagram', 'camera', 'image'],
  youtube: ['youtube', 'play', 'video'],
  linkedin: ['linkedin', 'briefcase', 'user'],
  github: ['github', 'code', 'code-2'],

  // Khoa học & Công nghệ
  science: ['flask-conical', 'flask-round', 'atom', 'beaker', 'test-tube', 'microscope'],
  lab: ['flask-conical', 'flask-round', 'beaker', 'test-tube', 'microscope', 'atom'],
  atom: ['atom', 'orbit', 'sparkles', 'zap'],
  ai: ['brain', 'brain-circuit', 'sparkles', 'bot', 'cpu'],
  bot: ['bot', 'bot-message-square', 'sparkles', 'brain'],
  robot: ['bot', 'bot-message-square', 'cpu'],

  // Hình dạng & Biểu tượng
  circle: ['circle', 'circle-dot', 'circle-check', 'circle-x', 'circle-alert', 'circle-arrow-right', 'circle-arrow-left', 'circle-arrow-up', 'circle-arrow-down'],
  square: ['square', 'square-check', 'square-x', 'square-plus', 'square-minus', 'square-arrow-up-right'],
  triangle: ['triangle', 'triangle-alert', 'triangle-right'],
  diamond: ['diamond', 'diamond-percent', 'gem'],
  hex: ['hexagon'],
  star3: ['star', 'sparkle', 'sparkles', 'stars'],

  // Màu sắc
  color: ['palette', 'pipette', 'paintbrush', 'paint-roller', 'brush'],
  paint: ['paintbrush', 'paint-roller', 'paint-bucket', 'palette', 'brush'],
  brush: ['brush', 'paintbrush', 'paint-roller', 'eraser'],

  // Camera & Phương tiện
  camera: ['camera', 'camera-off', 'video', 'video-off', 'aperture'],
  photo: ['camera', 'image', 'aperture', 'frame'],
  record: ['circle-dot', 'record', 'video', 'camera', 'mic'],
  scan2: ['scan', 'scan-line', 'scan-face', 'qr-code', 'barcode'],

  // Khác
  qr: ['qr-code', 'scan', 'scan-line', 'barcode'],
  barcode: ['barcode', 'scan', 'scan-line', 'qr-code'],
  link2: ['link', 'link-2', 'paperclip', 'anchor'],
  paperclip: ['paperclip', 'link', 'link-2', 'paperclip-icon'],
  pin: ['pin', 'map-pin', 'map-pin-2', 'pin-off', 'thumbtack'],
  bookmark2: ['bookmark', 'bookmark-check', 'bookmark-x', 'bookmark-plus'],
  tag2: ['tag', 'tags', 'label', 'hash'],
  label: ['label', 'tag', 'tags'],
  hash: ['hash', 'at-sign', 'tags'],
  at: ['at-sign', 'mail', 'message-circle'],
  percent: ['percent', 'badge-percent', 'tag', 'dollar-sign'],
  question: ['help-circle', 'circle-help', 'message-circle-question', 'info', 'question-mark'],
  help: ['help-circle', 'circle-help', 'life-buoy', 'info', 'message-circle-question'],
  chat2: ['message-circle', 'message-square', 'chat-bubble', 'chat-circle', 'bot-message-square'],
  comment: ['message-circle', 'message-square', 'message-square-text', 'comment'],
  comment2: ['message-circle', 'message-square', 'comment'],

  // Chứng nhận & Giải thưởng
  award: ['award', 'trophy', 'medal', 'crown', 'badge-check', 'ribbon'],
  trophy: ['trophy', 'award', 'medal', 'crown'],
  certificate: ['award', 'badge-check', 'medal', 'ribbon', 'scroll'],
  badge: ['badge', 'badge-check', 'badge-alert', 'badge-dollar-sign', 'badge-percent', 'badge-plus'],
  medal: ['medal', 'award', 'trophy', 'badge'],

  // Khác
  zap: ['zap', 'zap-off', 'bolt', 'flashlight', 'lightbulb'],
  light: ['lightbulb', 'flashlight', 'sun', 'lamp', 'lamp-desk'],
  idea: ['lightbulb', 'sparkles', 'brain', 'bulb'],
  bulb: ['lightbulb', 'bulb', 'lamp', 'lamp-desk'],
  flash: ['zap', 'bolt', 'flashlight', 'camera'],
  energy: ['zap', 'bolt', 'battery', 'battery-charging', 'flame'],
  battery: ['battery', 'battery-charging', 'battery-full', 'battery-low', 'battery-medium', 'battery-warning'],
  power: ['power', 'power-off', 'plug', 'plug-zap', 'zap'],

  // Mật khẩu & Bảo mật
  eye2: ['eye', 'eye-off', 'scan-eye', 'scan-face'],
  hide: ['eye-off', 'lock', 'lock-keyhole'],
  show: ['eye', 'unlock', 'unlock-keyhole'],
  visible: ['eye', 'scan-eye', 'scan-face'],
  hidden: ['eye-off', 'lock', 'lock-keyhole'],

  // Thông báo
  notify: ['bell', 'bell-ring', 'notification', 'message-circle', 'mail'],
  ping: ['bell', 'bell-ring', 'radio', 'megaphone'],
  alert2: ['alert-circle', 'alert-triangle', 'alert-octagon', 'bell', 'siren'],
  siren: ['siren', 'alert-triangle', 'alert-octagon', 'megaphone'],

  // Trang trí
  spark: ['sparkles', 'sparkle', 'star', 'wand', 'wand-2', 'stars'],
  wand: ['wand', 'wand-2', 'sparkles', 'magic'],
  magic: ['wand', 'wand-2', 'sparkles', 'stars'],
  cake: ['cake', 'cake-slice', 'candy', 'candy-cane', 'cookie'],
  gift2: ['gift', 'package', 'package-2', 'present'],
  party: ['party-popper', 'cake', 'gift', 'sparkles', 'confetti'],
  confetti: ['party-popper', 'confetti', 'sparkles', 'stars'],
}

function pascalToKebab(str: string): string {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/([A-Z])([A-Z][a-z])/g, '$1-$2').toLowerCase()
}

function kebabToPascal(str: string): string {
  return str
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')
}

function tokenize(value: string): string[] {
  return value.toLowerCase().split(/[\s\-_]+/).filter(Boolean)
}

function buildKeywords(kebabName: string, pascalName: string): string[] {
  const parts = kebabName.split('-')
  const allTokens = new Set([...parts])

  // Add full kebab and pascal
  allTokens.add(kebabName)
  allTokens.add(pascalName)
  allTokens.add(pascalName.toLowerCase())

  // Add every non-empty part individually
  for (const part of parts) {
    if (part) allTokens.add(part)
  }

  // Add camelCase splits (e.g. "PhoneCall" → "phone", "call")
  const camelMatch = kebabName.match(/[a-z]+/g)
  if (camelMatch) {
    for (const m of camelMatch) allTokens.add(m)
  }

  return Array.from(allTokens).filter(Boolean)
}

function matchesSearch(icon: IconItem, rawSearch: string): { pass: boolean; score: number } {
  if (!rawSearch.trim()) return { pass: true, score: 1 }

  const searchTokens = tokenize(rawSearch)

  let score = 0
  for (const token of searchTokens) {
    let tokenMatched = false

    // 1. Exact keyword match (full token matches a keyword)
    if (icon.keywords.includes(token)) {
      score += 10
      tokenMatched = true
    }

    // 2. Alias match: token maps to icon name parts
    if (!tokenMatched && aliasMap[token]) {
      const aliases = aliasMap[token]
      for (const alias of aliases) {
        if (icon.keywords.includes(alias) || icon.keywords.some((k) => k.includes(alias) || alias.includes(k))) {
          score += 5
          tokenMatched = true
          break
        }
      }
    }

    // 3. Prefix match: token is prefix of any keyword (system → setting)
    if (!tokenMatched) {
      if (icon.keywords.some((k) => k.startsWith(token) || token.startsWith(k))) {
        score += 3
        tokenMatched = true
      }
    }

    // 4. Substring match: token appears anywhere in any keyword
    if (!tokenMatched) {
      if (icon.keywords.some((k) => k.includes(token))) {
        score += 1
        tokenMatched = true
      }
    }

    if (!tokenMatched) return { pass: false, score: 0 }
  }

  return { pass: true, score }
}

function getIconComponent(iconName?: string): LucideIcon {
  if (!iconName) return LucideIcons.HelpCircle

  const pascalName = kebabToPascal(iconName)
  const icons = LucideIcons as unknown as Record<string, LucideIcon>
  return icons[pascalName] || LucideIcons.HelpCircle
}

export function DynamicIcon({ name, className }: { name?: string; className?: string }) {
  const IconComponent = getIconComponent(name)
  return <IconComponent className={className} />
}

export function IconPicker({ value, onChange, className }: IconPickerProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const wrapperRef = useRef<HTMLDivElement>(null)

  const iconList = useMemo<IconItem[]>(() => {
    return Object.keys(LucideIcons)
      .filter(
        (key) =>
          !['createLucideIcon', 'default', 'icons', 'aliases', 'dynamicIconImports'].includes(key) &&
          /^[A-Z]/.test(key) &&
          !key.endsWith('Icon')
      )
      .sort()
      .map((pascalName) => ({
        kebabName: pascalToKebab(pascalName),
        pascalName,
        keywords: buildKeywords(pascalToKebab(pascalName), pascalName),
      }))
  }, [])

  const filteredIcons = useMemo(() => {
    const results = iconList
      .map((icon) => ({ icon, result: matchesSearch(icon, search) }))
      .filter(({ result }) => result.pass)
      .sort((a, b) => b.result.score - a.result.score)

    return results.map(({ icon }) => icon)
  }, [iconList, search])

  useEffect(() => {
    if (!open) return

    const handleClickOutside = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  const SelectedIcon = getIconComponent(value)

  const handleSelect = (iconName: string) => {
    onChange(iconName)
    setOpen(false)
    setSearch('')
  }

  return (
    <div ref={wrapperRef} className={cn('relative w-full', className)}>
      <Button
        type='button'
        variant='outline'
        role='combobox'
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className='h-10 w-full justify-between bg-white'
      >
        <div className='flex min-w-0 items-center gap-2'>
          <SelectedIcon className='h-5 w-5 shrink-0' />
          <span className='truncate'>{value || 'Chọn icon'}</span>
        </div>
        <LucideIcons.ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
      </Button>

      {open && (
        <div className='absolute left-0 top-full z-50 mt-1 w-[400px] rounded-md border bg-popover text-popover-foreground shadow-md'>
          <div className='border-b p-3'>
            <Input
              autoFocus
              placeholder='Tìm kiếm icon... (VD: system, setting, phone, message)'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='h-9'
            />
            <p className='mt-2 text-xs text-gray-500'>
              Tìm thấy {filteredIcons.length} / {iconList.length} icons
            </p>
          </div>
          <ScrollArea className='h-[300px]'>
            {filteredIcons.length > 0 ? (
              <div className='grid grid-cols-6 gap-2 p-3'>
                {filteredIcons.map((icon) => {
                  const IconComponent = getIconComponent(icon.kebabName)

                  return (
                    <button
                      key={icon.kebabName}
                      type='button'
                      onClick={() => handleSelect(icon.kebabName)}
                      className={cn(
                        'flex h-12 w-full items-center justify-center rounded-md border border-gray-200 transition-colors hover:bg-gray-100',
                        value === icon.kebabName && 'border-primary bg-primary/10'
                      )}
                      title={icon.kebabName}
                    >
                      <IconComponent className='h-5 w-5' />
                    </button>
                  )
                })}
              </div>
            ) : (
              <div className='py-6 text-center text-sm text-gray-500'>Không tìm thấy icon &quot;{search}&quot;</div>
            )}
          </ScrollArea>
        </div>
      )}
    </div>
  )
}

export { IconPicker as LucideIconPicker }
