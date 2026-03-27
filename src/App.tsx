import { useEffect, useRef, useState, type ChangeEvent, type CSSProperties } from 'react'
import './App.css'

type View =
  | 'home'
  | 'signup'
  | 'room'
  | 'features'
  | 'dashboard'
  | 'content'
  | 'community'
  | 'events'
  | 'store'
  | 'privacy'
  | 'terms'
  | 'invite'
  | 'fan'

type FanTab = 'feed' | 'calendar' | 'shop'
type PrivacyStatus = 'private' | 'unlisted' | 'public'
type PublishComposerMode = 'video' | 'post'
type AuthMode = 'influencer' | 'fan'
type AuthMethod = 'social' | 'email'
type DashboardSection = 'overview' | 'content' | 'community' | 'events' | 'store'
type BannerStyle = 'focus' | 'soft' | 'broadcast'
type ButtonStyle = 'rounded' | 'solid' | 'outlined'
type CardDensity = 'compact' | 'comfortable' | 'airy'
type RoomThemeId =
  | 'hub-classic'
  | 'sunset-sand'
  | 'midnight-gold'
  | 'mint-pop'
  | 'berry-cream'
  | 'sky-blue'

type FeatureModule = {
  name: string
  description: string
  liveMetric: string
}

type FanRoom = {
  id: string
  creator: string
  label: string
  meta: string
  joinedVia: string
}

type FanFeedItem = {
  title: string
  text: string
  badge: string
  imageUrl?: string
}

type ChannelConnection = {
  connection_id: number
  channel_id: string
  channel_title: string
  channel_description: string
  room_name: string
  room_slug: string
  subscriber_count: string
}

type UploadResult = {
  video_id: string
  title: string
  privacy_status: string
  watch_url: string
  notice_title: string
}

type YoutubeCommentResult = {
  videoId: string
  commentId: string
  commentUrl: string
  message: string
}

type AuthUrlResponse = {
  auth_url: string
  redirect_uri: string
}

type FanAuthUrlResponse = {
  auth_url: string
  redirect_uri: string
}

type GoogleAuthUrlResponse = {
  auth_url: string
  redirect_uri: string
}

type PendingGoogleProfile = {
  email: string
  name: string
  picture: string
}

type CreatorSession = {
  session_token: string
  expires_at: string
  connection_id: number
  channel_id: string
  channel_title: string
  channel_description: string
  room_name: string
  room_slug: string
  subscriber_count: string
}

type FanJoinedRoom = {
  membership_id: number
  creator_name: string
  room_name: string
  room_slug: string
  joined_via: string
}

type FanAuthResponse = {
  session_token: string
  expires_at: string
  email: string
  nickname: string
  joined_rooms: FanJoinedRoom[]
}

type InviteDetailResponse = {
  invite_code: string
  title: string
  source_label: string
  room_name: string
  room_slug: string
  creator_name: string
  room_description: string
}

type InviteLinkSummary = {
  invite_link_id: number
  invite_code: string
  title: string
  source_label: string
  open_count: number
  join_count: number
  active: boolean
  invite_url: string
}

type CreatorInviteDashboardResponse = {
  total_open_count: number
  total_join_count: number
  multi_room_fan_count: number
  invite_links: InviteLinkSummary[]
}

type CreatorFanMember = {
  membership_id: number
  fan_email: string
  fan_nickname: string
  joined_via: string
  tier: string
}

type RoomThemePreset = {
  id: RoomThemeId
  name: string
  tone: string
  accent: string
  heroBackground: string
  panelBackground: string
  textColor: string
  mutedColor: string
}

type CreatorAppearanceSettings = {
  bannerStyle: BannerStyle
  buttonStyle: ButtonStyle
  cardDensity: CardDensity
}

type CreatorRoomSettingsResponse = {
  room_theme_id: RoomThemeId
  banner_style: BannerStyle
  button_style: ButtonStyle
  card_density: CardDensity
  selected_features: string[]
}

type PublishJobHistoryItem = {
  publish_job_id: number
  platform: string
  status: string
  title: string
  target_url: string | null
  scheduled_at: string
  created_at: string
}

type CommunityPostItem = {
  post_id: number
  post_type: string
  title: string
  content: string
  author_name: string
  created_at: string
  image_url?: string
}

type EventSummaryItem = {
  title: string
  detail: string
}

type StoreItemSummary = {
  name: string
  stock: string
  sales: string
}

type PlatformTone = 'youtube' | 'neutral' | 'dark' | 'instagram' | 'facebook' | 'light' | 'purple'

type PlatformCatalogItem = {
  name: string
  status: string
  detail: string
  tone: PlatformTone
  supportsPost: boolean
  supportsVideo: boolean
}

type PlatformSetupState = {
  clientValue: string
  secretValue: string
  isEnabled: boolean
  statusLabel: string
  supportsPost: boolean
  supportsVideo: boolean
}

const featureCatalog: FeatureModule[] = [
  {
    name: '팬 커뮤니티',
    description: '공지, 자유게시판, 댓글, 공감으로 기본 팬방 운영을 시작합니다.',
    liveMetric: '오늘 신규 댓글 182',
  },
  {
    name: '이벤트',
    description: '응모, 추첨, 미션 인증을 열고 팬 참여를 끌어올립니다.',
    liveMetric: '진행 중 이벤트 2개',
  },
  {
    name: '굿즈 스토어',
    description: '방 안에서 바로 굿즈를 판매하고 주문 현황을 관리합니다.',
    liveMetric: '드롭 예정 상품 4개',
  },
  {
    name: '멀티 업로드',
    description: '영상 1개를 유튜브, 치지직 같은 채널로 동시에 배포합니다.',
    liveMetric: '예약 배포 3건',
  },
  {
    name: '멤버십 라운지',
    description: '유료 팬만 보는 전용 글과 혜택 공지를 분리 운영합니다.',
    liveMetric: '멤버십 등급 3개',
  },
  {
    name: '라이브 채팅',
    description: '방송 전후 실시간 채팅방을 열어 집중 유입을 만듭니다.',
    liveMetric: '예정된 라이브 1개',
  },
]

const dashboardMetrics = [
  { label: '오늘 방문 팬', value: '3,284', change: '+18%' },
  { label: '새 글 반응', value: '1,902', change: '+31%' },
  { label: '굿즈 매출', value: '₩2.8M', change: '+12%' },
  { label: '초대된 팬 수', value: '842', change: '링크 전환율 37%' },
]

const toolCards = [
  {
    id: 'content' as const,
    title: '콘텐츠 배포 센터',
    text: '업로드 스케줄, 멀티 플랫폼 발행, 자동 공지 생성 초안까지 한 화면에서 조정합니다.',
    badge: 'Publishing',
  },
  {
    id: 'community' as const,
    title: '팬 커뮤니티 운영',
    text: '공지, 자유글, 베스트 댓글, 멤버십 전용 피드를 분리해 운영합니다.',
    badge: 'Community',
  },
  {
    id: 'events' as const,
    title: '이벤트 플래너',
    text: '응모, 인증, 추첨, 당첨 발표까지 단계별 카드로 관리합니다.',
    badge: 'Engagement',
  },
  {
    id: 'store' as const,
    title: '굿즈 스토어 보드',
    text: '드롭 일정, 상품 재고, 알림 신청과 주문 추세를 동시에 봅니다.',
    badge: 'Commerce',
  },
]

const activityFeed = [
  {
    title: '새 영상 업로드 감지',
    body: 'YouTube 영상이 올라오자 30초 안에 팬방 공지 초안이 자동 생성됐습니다.',
    time: '방금 전',
  },
  {
    title: '이벤트 참여 급상승',
    body: '사전 알림을 받은 팬 482명이 미션 인증 이벤트에 바로 진입했습니다.',
    time: '12분 전',
  },
  {
    title: '굿즈 드롭 대기열 생성',
    body: '한정 수량 공지로 대기열이 열렸고, 재입고 알림 신청이 붙었습니다.',
    time: '48분 전',
  },
]

const invitePerformance = [
  {
    title: '오늘 영상 설명란 링크',
    body: '영상 공개 후 1,124명이 초대 링크를 열었고, 418명이 팬 가입을 완료했습니다.',
    time: '18:42',
  },
  {
    title: '라이브 고정 댓글 링크',
    body: '라이브 중 링크 유입 팬 233명 중 129명이 팬방 입장까지 완료했습니다.',
    time: '어제',
  },
  {
    title: '커뮤니티 탭 이벤트 링크',
    body: '이벤트 참여 유입으로 92명이 신규 팬방 가입을 마쳤습니다.',
    time: '이번 주',
  },
]

const inviteFunnelCards = [
  { label: '초대 링크 오픈', value: '1,124', meta: '영상 설명란 + 라이브 고정 댓글' },
  { label: '팬 가입 완료', value: '418', meta: '신규 팬 전환' },
  { label: '다른 팬방 추가 가입', value: '126', meta: '멀티 크리에이터 팬' },
]

const fanRooms: FanRoom[] = [
  {
    id: 'salt-toast',
    creator: '소금토스트',
    label: '소금토스트 공식 팬방',
    meta: '오늘 라이브 예고 있음',
    joinedVia: '라이브 고정 댓글 초대 링크',
  },
  {
    id: 'devtv',
    creator: '침착한개발자TV',
    label: '침착한개발자TV 공식 팬방',
    meta: 'Q&A 공지 새로 올라옴',
    joinedVia: '영상 설명란 초대 링크',
  },
  {
    id: 'travel-lab',
    creator: '트래블랩',
    label: '트래블랩 팬 클럽',
    meta: '굿즈 선공개 진행 중',
    joinedVia: '인스타 스토리 초대 링크',
  },
]

const contentTimeline = [
  {
    time: '18:30',
    title: 'YouTube 본편 예약',
    body: '제목, 썸네일, 설명란, 해시태그까지 초안 완료',
  },
  {
    time: '18:33',
    title: 'CHZZK 공지 카드 생성',
    body: '팬방 공지에 라이브 알림 배너가 함께 붙습니다.',
  },
  {
    time: '18:45',
    title: '팬방 푸시 예약',
    body: '멤버십 팬 우선, 일반 팬 후순위로 알림이 나갑니다.',
  },
]

const platformCatalog: PlatformCatalogItem[] = [
  {
    name: 'YouTube',
    status: 'Connected',
    detail: 'Data API + Upload API 키 등록 완료',
    tone: 'youtube',
    supportsPost: false,
    supportsVideo: true,
  },
  {
    name: 'CHZZK',
    status: 'Ready',
    detail: '라이브 예고 공지와 팬방 연결 예정',
    tone: 'neutral',
    supportsPost: false,
    supportsVideo: false,
  },
  {
    name: 'X',
    status: 'Planned',
    detail: '영상 공개 직후 짧은 알림 포스트 배포',
    tone: 'dark',
    supportsPost: true,
    supportsVideo: true,
  },
  {
    name: 'Instagram',
    status: 'Planned',
    detail: '릴스/스토리용 짧은 티저 알림 배포',
    tone: 'instagram',
    supportsPost: true,
    supportsVideo: true,
  },
  {
    name: 'Facebook',
    status: 'Planned',
    detail: '커뮤니티 링크 카드와 게시글 미러링',
    tone: 'facebook',
    supportsPost: true,
    supportsVideo: true,
  },
  {
    name: 'TikTok',
    status: 'Research',
    detail: '클립형 숏폼 티저 업로드 자동화 검토',
    tone: 'dark',
    supportsPost: true,
    supportsVideo: true,
  },
  {
    name: 'Threads',
    status: 'Planned',
    detail: '짧은 근황 알림과 공개 직후 반응 수집',
    tone: 'light',
    supportsPost: true,
    supportsVideo: true,
  },
  {
    name: 'Discord',
    status: 'Ready',
    detail: 'Webhook 기반 커뮤니티 알림 채널 연동',
    tone: 'neutral',
    supportsPost: true,
    supportsVideo: true,
  },
  {
    name: 'Twitch',
    status: 'Idea',
    detail: '라이브 전환 시 팬방 공지와 일정 동기화',
    tone: 'purple',
    supportsPost: false,
    supportsVideo: false,
  },
]

const platformFieldLabels: Record<string, { client: string; secret: string }> = {
  YouTube: { client: 'Client ID', secret: 'API Key' },
  CHZZK: { client: '채널 키', secret: 'Webhook URL' },
  X: { client: 'App Key', secret: 'App Secret' },
  Instagram: { client: 'App ID', secret: 'Access Token' },
  Facebook: { client: 'Page ID', secret: 'Access Token' },
  TikTok: { client: 'Client Key', secret: 'Client Secret' },
  Threads: { client: '앱 식별자', secret: '연동 토큰' },
  Discord: { client: '서버 이름', secret: 'Webhook URL' },
  Twitch: { client: 'Client ID', secret: 'OAuth Token' },
}

const youtubeIntegrationSteps = [
  {
    title: '채널 API 키 등록',
    body: 'Google Cloud에서 발급한 API key와 업로드 권한을 InfluenceHub에 등록합니다.',
  },
  {
    title: '업로드 템플릿 저장',
    body: '제목 규칙, 설명란, 기본 태그, 썸네일 규칙을 한 번 저장합니다.',
  },
  {
    title: '한 번 업로드하면 자동 배포',
    body: 'InfluenceHub에 파일을 올리면 YouTube 업로드, 팬방 공지, 푸시 발송까지 묶어서 실행합니다.',
  },
]

const creatorSessionStorageKey = 'influencehub.creator-session-token'
const fanSessionStorageKey = 'influencehub.fan-session-token'
const googleProfileStorageKey = 'influencehub.google-profile'
const roomThemeStorageKey = 'influencehub.room-theme'
const creatorAppearanceStorageKey = 'influencehub.creator-appearance'

const importedChannelPreview = {
  title: '침착한개발자TV',
  handle: '@devtv',
  description:
    '개발과 제품을 쉽게 풀어 설명하는 채널입니다. 본편 업로드 후 팬방에서 Q&A와 비하인드 글을 함께 운영합니다.',
}

const communityPosts = [
  {
    label: '공지',
    title: '오늘 저녁 8시 업로드 후 팬방 Q&A 오픈',
    meta: '댓글 124 · 공감 811',
  },
  {
    label: '자유글',
    title: '오늘 티저 장면 중 가장 좋았던 컷 골라보기',
    meta: '댓글 89 · 공감 302',
  },
  {
    label: '멤버십',
    title: '비하인드 사진 12장 선공개',
    meta: '댓글 41 · 공감 520',
  },
]

const eventSteps = [
  {
    title: '참여 공지 오픈',
    detail: '팬방 상단 배너와 새 글 알림을 동시에 발행',
  },
  {
    title: '미션 인증 수집',
    detail: '댓글, 이미지, 해시태그 조건별 응모를 자동 분류',
  },
  {
    title: '추첨 및 발표',
    detail: '당첨자 카드 생성 후 DM/공지 템플릿 발송',
  },
]

const storeItems = [
  {
    name: '사인 포토팩',
    stock: '잔여 38개',
    sales: '오늘 124건',
  },
  {
    name: '한정 후드 집업',
    stock: '잔여 12개',
    sales: '오늘 42건',
  },
  {
    name: '데스크 매트',
    stock: '재입고 예정',
    sales: '알림 신청 291명',
  },
]

const fanFeed: FanFeedItem[] = [
  {
    title: '방장 공지',
    text: '오늘 저녁 8시 업로드 영상 공개 후, 팬방 Q&A도 바로 열릴 예정입니다.',
    badge: 'NEW',
  },
  {
    title: '미션 인증 이벤트',
    text: '댓글 인증만 해도 추첨으로 사인 굿즈를 받을 수 있습니다.',
    badge: 'LIVE',
  },
  {
    title: '멤버십 전용 티저',
    text: '다음 프로젝트 비하인드 사진이 선공개되었습니다.',
    badge: 'PLUS',
  },
]

const fanCalendar = [
  { day: '오늘', title: '20:00 영상 공개 + 팬방 Q&A' },
  { day: '내일', title: '멤버십 전용 미리듣기 공개' },
  { day: '토요일', title: '굿즈 드롭 사전 알림 발송' },
]

const fanShopHighlights = [
  { title: '사인 포토팩', detail: '팬방 한정 1차 오픈 · 38개 남음' },
  { title: '후드 집업', detail: '오늘 밤 10시 드롭 · 알림 설정 가능' },
  { title: '데스크 매트', detail: '재입고 요청 291명' },
]

const postTypeToBadge: Record<string, string> = {
  NOTICE: 'NEW',
  EVENT: 'LIVE',
  FREE: 'POST',
  QUESTION: 'Q&A',
}

const roomThemePresets: RoomThemePreset[] = [
  {
    id: 'hub-classic',
    name: '허브 클래식',
    tone: '기본 InfluenceHub 톤',
    accent: '#ff7a45',
    heroBackground: 'linear-gradient(160deg, #13263f 0%, #0e182a 100%)',
    panelBackground: 'linear-gradient(160deg, #182d47 0%, #111b2d 100%)',
    textColor: '#f5f1e8',
    mutedColor: 'rgba(245, 241, 232, 0.68)',
  },
  {
    id: 'sunset-sand',
    name: '선셋 샌드',
    tone: '밝고 무난한 브랜드형',
    accent: '#f08a4b',
    heroBackground: 'linear-gradient(135deg, #fff2df 0%, #f7dcc3 100%)',
    panelBackground: 'linear-gradient(160deg, #fffaf1 0%, #f1dfcb 100%)',
    textColor: '#1c2432',
    mutedColor: 'rgba(28, 36, 50, 0.68)',
  },
  {
    id: 'midnight-gold',
    name: '미드나잇 골드',
    tone: '고급스럽고 진한 운영형',
    accent: '#d4a84f',
    heroBackground: 'linear-gradient(160deg, #261d18 0%, #141113 100%)',
    panelBackground: 'linear-gradient(160deg, #34271f 0%, #1a1718 100%)',
    textColor: '#f6e9ce',
    mutedColor: 'rgba(246, 233, 206, 0.74)',
  },
  {
    id: 'mint-pop',
    name: '민트 팝',
    tone: '상큼하고 활동적인 커뮤니티형',
    accent: '#17c3b2',
    heroBackground: 'linear-gradient(135deg, #e6fff7 0%, #c7f4ea 100%)',
    panelBackground: 'linear-gradient(160deg, #f4fffb 0%, #d4f4ec 100%)',
    textColor: '#163130',
    mutedColor: 'rgba(22, 49, 48, 0.68)',
  },
  {
    id: 'berry-cream',
    name: '베리 크림',
    tone: '부드럽고 팬 친화적인 감성형',
    accent: '#d56aa0',
    heroBackground: 'linear-gradient(135deg, #fff1f6 0%, #f5dbe7 100%)',
    panelBackground: 'linear-gradient(160deg, #fff7fa 0%, #eed8e4 100%)',
    textColor: '#34202b',
    mutedColor: 'rgba(52, 32, 43, 0.66)',
  },
  {
    id: 'sky-blue',
    name: '스카이 블루',
    tone: '깔끔하고 대중적인 방송형',
    accent: '#4b8ef0',
    heroBackground: 'linear-gradient(135deg, #ecf5ff 0%, #d8e8ff 100%)',
    panelBackground: 'linear-gradient(160deg, #f7fbff 0%, #dfe9f8 100%)',
    textColor: '#1b2a42',
    mutedColor: 'rgba(27, 42, 66, 0.66)',
  },
]

function App() {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'
  const [currentView, setCurrentView] = useState<View>('home')
  const [authMode, setAuthMode] = useState<AuthMode>('influencer')
  const [authMethod, setAuthMethod] = useState<AuthMethod>('social')
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    '팬 커뮤니티',
    '이벤트',
    '멀티 업로드',
    '굿즈 스토어',
  ])
  const [fanTab, setFanTab] = useState<FanTab>('feed')
  const [selectedFanRoomId, setSelectedFanRoomId] = useState<string>('salt-toast')
  const [connectedChannel, setConnectedChannel] = useState<ChannelConnection | null>(null)
  const [uploadTitle, setUploadTitle] = useState('누나 서울구경')
  const [uploadDescription, setUploadDescription] = useState(
    'InfluenceHub에서 테스트 업로드한 영상입니다.',
  )
  const [publishComposerMode, setPublishComposerMode] = useState<PublishComposerMode>('video')
  const [privacyStatus, setPrivacyStatus] = useState<PrivacyStatus>('private')
  const [useScheduledPublish, setUseScheduledPublish] = useState(false)
  const [scheduledPublishAt, setScheduledPublishAt] = useState(() => {
    const date = new Date()
    date.setHours(date.getHours() + 2)
    date.setMinutes(0, 0, 0)
    const timezoneOffset = date.getTimezoneOffset() * 60000
    return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 16)
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadPreviewUrl, setUploadPreviewUrl] = useState<string | null>(null)
  const [postTitle, setPostTitle] = useState('오늘 유튜브 커뮤니티에 올릴 한 줄')
  const [postBody, setPostBody] = useState(
    '본편 올라가기 전에 현장 스틸 먼저 올립니다. 오늘 밤 라이브에서 비하인드 더 풀게요.',
  )
  const [selectedPostImage, setSelectedPostImage] = useState<File | null>(null)
  const [postPreviewUrl, setPostPreviewUrl] = useState<string | null>(null)
  const [postStatus, setPostStatus] = useState('아직 초안 생성 전')
  const [commentTargetUrl, setCommentTargetUrl] = useState('')
  const [commentStatus, setCommentStatus] = useState('아직 댓글 배포 전')
  const [commentResult, setCommentResult] = useState<YoutubeCommentResult | null>(null)
  const [uploadStatus, setUploadStatus] = useState('아직 업로드 전')
  const [uploadError, setUploadError] = useState('')
  const [scheduleStatus, setScheduleStatus] = useState('예약 등록 전')
  const [isLoadingChannel, setIsLoadingChannel] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null)
  const [publishHistory, setPublishHistory] = useState<PublishJobHistoryItem[]>([])
  const [selectedPlatformName, setSelectedPlatformName] = useState('YouTube')
  const [isStartingGoogleLogin, setIsStartingGoogleLogin] = useState(false)
  const [authFeedback, setAuthFeedback] = useState('아직 구글 로그인 전')
  const [isCreatorLoggedIn, setIsCreatorLoggedIn] = useState(false)
  const [communityFeed, setCommunityFeed] = useState<CommunityPostItem[]>([])
  const [eventBoard, setEventBoard] = useState<EventSummaryItem[]>([])
  const [storeBoard, setStoreBoard] = useState<StoreItemSummary[]>([])
  const [inviteDashboard, setInviteDashboard] = useState<CreatorInviteDashboardResponse | null>(null)
  const [inviteTitle, setInviteTitle] = useState('영상 설명란 초대')
  const [inviteSourceLabel, setInviteSourceLabel] = useState('영상 설명란')
  const [inviteStatus, setInviteStatus] = useState('초대 링크 생성 전')
  const [isCreatingInvite, setIsCreatingInvite] = useState(false)
  const [fanMembers, setFanMembers] = useState<CreatorFanMember[]>([])
  const [fanTierStatus, setFanTierStatus] = useState('팬 등급 분류 전')
  const [fanSession, setFanSession] = useState<FanAuthResponse | null>(null)
  const [inviteDetail, setInviteDetail] = useState<InviteDetailResponse | null>(null)
  const [inviteCode, setInviteCode] = useState('')
  const [fanStatus, setFanStatus] = useState('팬 로그인 전')
  const [fanError, setFanError] = useState('')
  const [isJoiningInvite, setIsJoiningInvite] = useState(false)
  const [isStartingFanGoogleLogin, setIsStartingFanGoogleLogin] = useState(false)
  const [pendingGoogleProfile, setPendingGoogleProfile] = useState<PendingGoogleProfile | null>(null)
  const [selectedRoomTheme, setSelectedRoomTheme] = useState<RoomThemeId>('hub-classic')
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false)
  const [platformSetup, setPlatformSetup] = useState<Record<string, PlatformSetupState>>({
    YouTube: {
      clientValue: 'yt-client-8f3c••••••••••',
      secretValue: 'AIzaSyD9••••••••••••••••',
      isEnabled: true,
      statusLabel: 'Connected',
      supportsPost: false,
      supportsVideo: true,
    },
    CHZZK: { clientValue: '', secretValue: '', isEnabled: false, statusLabel: 'Inactive', supportsPost: false, supportsVideo: false },
    X: { clientValue: '', secretValue: '', isEnabled: false, statusLabel: 'Inactive', supportsPost: true, supportsVideo: true },
    Instagram: { clientValue: '', secretValue: '', isEnabled: false, statusLabel: 'Inactive', supportsPost: true, supportsVideo: true },
    Facebook: { clientValue: '', secretValue: '', isEnabled: false, statusLabel: 'Inactive', supportsPost: true, supportsVideo: true },
    TikTok: { clientValue: '', secretValue: '', isEnabled: false, statusLabel: 'Inactive', supportsPost: true, supportsVideo: true },
    Threads: { clientValue: '', secretValue: '', isEnabled: false, statusLabel: 'Inactive', supportsPost: true, supportsVideo: true },
    Discord: { clientValue: '', secretValue: '', isEnabled: false, statusLabel: 'Inactive', supportsPost: true, supportsVideo: true },
    Twitch: { clientValue: '', secretValue: '', isEnabled: false, statusLabel: 'Inactive', supportsPost: false, supportsVideo: false },
  })
  const [bannerStyle, setBannerStyle] = useState<BannerStyle>('focus')
  const [buttonStyle, setButtonStyle] = useState<ButtonStyle>('rounded')
  const [cardDensity, setCardDensity] = useState<CardDensity>('comfortable')
  const [selectedPublishPlatforms, setSelectedPublishPlatforms] = useState<string[]>(['YouTube'])
  const [hasHydratedCreatorSettings, setHasHydratedCreatorSettings] = useState(false)
  const roleMenuRef = useRef<HTMLDivElement | null>(null)

  const activeRoomTheme =
    roomThemePresets.find((preset) => preset.id === selectedRoomTheme) ?? roomThemePresets[0]
  const useRoomThemeSurface = currentView === 'fan'
  const isClassicRoomTheme = selectedRoomTheme === 'hub-classic'
  const creatorExperienceClasses = `banner-${bannerStyle} buttons-${buttonStyle} density-${cardDensity}`

  const displayedFanRooms =
    fanSession?.joined_rooms.map((room) => ({
      id: room.room_slug,
      creator: room.creator_name,
      label: room.room_name,
      meta: '가입 완료된 팬방',
      joinedVia: room.joined_via,
    })) ?? fanRooms
  const activeFanRoom =
    displayedFanRooms.find((room) => room.id === selectedFanRoomId) ?? displayedFanRooms[0]
  const selectedPlatformConfig = platformSetup[selectedPlatformName]
  const selectedPlatformLabels = platformFieldLabels[selectedPlatformName] ?? {
    client: '연결 값',
    secret: '보안 값',
  }
  const enabledPlatforms = platformCatalog.filter((platform) => platformSetup[platform.name]?.isEnabled)
  const publishablePlatforms = enabledPlatforms.filter((platform) =>
    publishComposerMode === 'video' ? platform.supportsVideo : platform.supportsPost,
  )
  const visibleFanFeed: FanFeedItem[] =
    isCreatorLoggedIn && communityFeed.length > 0
      ? communityFeed.slice(0, 3).map((post) => ({
          title: post.title,
          text: post.content,
          badge: postTypeToBadge[post.post_type] ?? 'POST',
          imageUrl: post.image_url,
        }))
      : fanFeed
  const youtubeCommunityDraft = `${postTitle.trim() || '유튜브 커뮤니티 제목'}\n\n${postBody.trim() || '유튜브 커뮤니티 본문'}`
  const homeStatCards = [
    {
      label: '연결 채널',
      value: connectedChannel ? connectedChannel.channel_title : '미연결',
      meta: connectedChannel
        ? `구독자 ${connectedChannel.subscriber_count}명`
        : 'Google 로그인 후 채널 연동',
    },
    {
      label: '활성 기능',
      value: `${selectedFeatures.length}개`,
      meta: selectedFeatures.length > 0 ? selectedFeatures.join(' · ') : '아직 선택 전',
    },
    {
      label: '초대 링크',
      value: inviteDashboard ? `${inviteDashboard.invite_links.length}개` : '0개',
      meta: inviteDashboard
        ? `팬 가입 ${inviteDashboard.total_join_count}명`
        : '로그인 후 초대 링크 생성 가능',
    },
  ]

  const toggleFeature = (featureName: string) => {
    setSelectedFeatures((current) =>
      current.includes(featureName)
        ? current.filter((name) => name !== featureName)
        : [...current, featureName],
    )
  }

  const updatePlatformSetup = (platformName: string, nextState: Partial<PlatformSetupState>) => {
    setPlatformSetup((current) => ({
      ...current,
      [platformName]: {
        ...current[platformName],
        ...nextState,
      },
    }))
  }

  const handleTestPlatformConnection = () => {
    if (!selectedPlatformConfig.clientValue.trim() || !selectedPlatformConfig.secretValue.trim()) {
      updatePlatformSetup(selectedPlatformName, { statusLabel: '값 필요' })
      return
    }

    updatePlatformSetup(selectedPlatformName, { statusLabel: 'Ready' })
  }

  const handleTogglePlatformActivation = () => {
    const nextEnabled = !selectedPlatformConfig.isEnabled
    updatePlatformSetup(selectedPlatformName, {
      isEnabled: nextEnabled,
      statusLabel: nextEnabled ? 'Connected' : 'Inactive',
    })
    setSelectedPublishPlatforms((current) => {
      if (!nextEnabled) {
        return current.filter((platformName) => platformName !== selectedPlatformName)
      }
      if (current.includes(selectedPlatformName)) {
        return current
      }
      return [...current, selectedPlatformName]
    })
  }

  const togglePublishPlatform = (platformName: string) => {
    setSelectedPublishPlatforms((current) =>
      current.includes(platformName)
        ? current.filter((name) => name !== platformName)
        : [...current, platformName],
    )
  }

  const goToDashboard = () => {
    if (selectedFeatures.length === 0) {
      setSelectedFeatures(['팬 커뮤니티'])
    }
    setCurrentView('dashboard')
  }

  const openCreatorStart = () => {
    setCurrentView(isCreatorLoggedIn ? 'content' : isFanLoggedIn ? 'fan' : 'signup')
  }

  const openCreatorOnboardingStep = (index: number) => {
    if (isCreatorLoggedIn) {
      setCurrentView(index === 0 ? 'content' : index === 1 ? 'dashboard' : 'features')
      return
    }

    setCurrentView(
      index === 0 ? 'signup' : index === 1 ? 'room' : index === 2 ? 'features' : 'dashboard',
    )
  }

  const isFanLoggedIn = fanSession !== null
  const headerSubtitle = isCreatorLoggedIn
    ? 'Influencer Control Room'
    : isFanLoggedIn
      ? 'Fan Membership Pass'
      : 'Influencer Room OS'
  const headerRoleLabel = isCreatorLoggedIn ? 'INFLUENCER MODE' : isFanLoggedIn ? 'FAN MODE' : ''
  const headerTabs: Array<[View, string]> = isCreatorLoggedIn
    ? [
        ['home', '홈'],
        ['content', '내 채널'],
        ['room', '설정'],
        ['features', '기능 설정'],
        ['dashboard', '운영 대시보드'],
        ['fan', '팬 화면'],
      ]
    : isFanLoggedIn
      ? [
          ['home', '홈'],
          ['fan', '내 팬방'],
          ['invite', '초대 링크'],
        ]
      : [
          ['home', '홈'],
          ['signup', '로그인'],
        ]

  const startSelectedAuthFlow = async () => {
    if (!pendingGoogleProfile) {
      await startUnifiedGoogleLogin()
      return
    }

    if (authMode === 'influencer') {
      await startCreatorGoogleLogin()
      return
    }

    await completeFanMode()
  }

  const persistCreatorSession = (sessionToken: string) => {
    localStorage.setItem(creatorSessionStorageKey, sessionToken)
    setIsCreatorLoggedIn(true)
  }

  const clearCreatorSession = () => {
    localStorage.removeItem(creatorSessionStorageKey)
    setConnectedChannel(null)
    setIsCreatorLoggedIn(false)
    setHasHydratedCreatorSettings(false)
    setAuthFeedback('로그아웃됨')
  }

  const persistFanSession = (sessionToken: string) => {
    localStorage.setItem(fanSessionStorageKey, sessionToken)
  }

  const persistGoogleProfile = (profile: PendingGoogleProfile) => {
    localStorage.setItem(googleProfileStorageKey, JSON.stringify(profile))
    setPendingGoogleProfile(profile)
  }

  const clearGoogleProfile = () => {
    localStorage.removeItem(googleProfileStorageKey)
    setPendingGoogleProfile(null)
  }

  const clearFanSession = () => {
    localStorage.removeItem(fanSessionStorageKey)
    setFanSession(null)
    setSelectedFanRoomId('salt-toast')
    setFanStatus('팬 로그아웃됨')
  }

  const handleCreatorLogout = () => {
    const sessionToken = localStorage.getItem(creatorSessionStorageKey)
    if (sessionToken) {
      void fetch(`${apiBaseUrl}/api/v1/auth/logout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      })
    }

    clearCreatorSession()
    setIsRoleMenuOpen(false)
    setCurrentView('home')
  }

  const handleFanLogout = () => {
    const sessionToken = localStorage.getItem(fanSessionStorageKey)
    if (sessionToken) {
      void fetch(`${apiBaseUrl}/api/v1/fans/logout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      })
    }

    clearFanSession()
    setIsRoleMenuOpen(false)
    setCurrentView('home')
  }

  const fetchCurrentCreatorSession = async (
    sessionToken: string,
    options?: { silent?: boolean },
  ) => {
    setIsLoadingChannel(true)
    if (!options?.silent) {
      setUploadError('')
    }

    try {
      const response = await fetch(`${apiBaseUrl}/api/v1/auth/me`, {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      })
      if (!response.ok) {
        throw new Error('로그인 세션을 확인하지 못했습니다.')
      }

      const data = (await response.json()) as CreatorSession
      const connection: ChannelConnection = {
        connection_id: data.connection_id,
        channel_id: data.channel_id,
        channel_title: data.channel_title,
        channel_description: data.channel_description,
        room_name: data.room_name,
        room_slug: data.room_slug,
        subscriber_count: data.subscriber_count,
      }

      setConnectedChannel(connection)
      persistCreatorSession(data.session_token)
      setAuthFeedback(`로그인 유지 중 · ${data.channel_title} 채널이 연결되어 있습니다.`)
      void loadCreatorInviteDashboard(data.session_token)
      void loadCreatorFanMembers(data.session_token)
      void loadCreatorRoomSettings(data.session_token)
      void loadPublishHistory(data.session_token)
      void loadCreatorCommunityPosts(data.session_token)
      void loadEventBoard(data.session_token)
      void loadStoreBoard(data.session_token)
      if (!uploadTitle.trim()) {
        setUploadTitle(`${connection.channel_title} 새 영상`)
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : '로그인 세션을 확인하지 못했습니다.'
      setIsCreatorLoggedIn(false)
      localStorage.removeItem(creatorSessionStorageKey)
      if (!options?.silent) {
        setUploadError(message)
      }
    } finally {
      setIsLoadingChannel(false)
    }
  }

  const loadLatestConnection = async (options?: { silent?: boolean }) => {
    const sessionToken = localStorage.getItem(creatorSessionStorageKey)
    if (!sessionToken) {
      if (!options?.silent) {
        setUploadError('먼저 구글 로그인으로 크리에이터 세션을 만들어야 합니다.')
      }
      return
    }

    await fetchCurrentCreatorSession(sessionToken, options)
  }

  const loadCreatorInviteDashboard = async (sessionToken?: string) => {
    const creatorSessionToken = sessionToken ?? localStorage.getItem(creatorSessionStorageKey)
    if (!creatorSessionToken) {
      return
    }

    try {
      const response = await fetch(`${apiBaseUrl}/api/v1/invites/mine`, {
        headers: {
          Authorization: `Bearer ${creatorSessionToken}`,
        },
      })

      if (!response.ok) {
        throw new Error('초대 링크 대시보드를 불러오지 못했습니다.')
      }

      const data = (await response.json()) as CreatorInviteDashboardResponse
      setInviteDashboard(data)
    } catch (error) {
      const message = error instanceof Error ? error.message : '초대 링크 대시보드를 불러오지 못했습니다.'
      setInviteStatus(message)
    }
  }

  const loadCreatorFanMembers = async (sessionToken?: string) => {
    const creatorSessionToken = sessionToken ?? localStorage.getItem(creatorSessionStorageKey)
    if (!creatorSessionToken) {
      return
    }

    try {
      const response = await fetch(`${apiBaseUrl}/api/v1/creator/fans`, {
        headers: {
          Authorization: `Bearer ${creatorSessionToken}`,
        },
      })

      if (!response.ok) {
        throw new Error('팬 목록을 불러오지 못했습니다.')
      }

      const data = (await response.json()) as CreatorFanMember[]
      setFanMembers(data)
    } catch (error) {
      const message = error instanceof Error ? error.message : '팬 목록을 불러오지 못했습니다.'
      setFanTierStatus(message)
    }
  }

  const loadCreatorRoomSettings = async (sessionToken?: string) => {
    const creatorSessionToken = sessionToken ?? localStorage.getItem(creatorSessionStorageKey)
    if (!creatorSessionToken) {
      return
    }

    try {
      const response = await fetch(`${apiBaseUrl}/api/v1/creator/settings`, {
        headers: {
          Authorization: `Bearer ${creatorSessionToken}`,
        },
      })

      if (!response.ok) {
        throw new Error('저장된 운영 설정을 불러오지 못했습니다.')
      }

      const data = (await response.json()) as CreatorRoomSettingsResponse
      setSelectedRoomTheme(data.room_theme_id)
      setBannerStyle(data.banner_style)
      setButtonStyle(data.button_style)
      setCardDensity(data.card_density)
      if (data.selected_features.length > 0) {
        setSelectedFeatures(data.selected_features)
      }
      setHasHydratedCreatorSettings(true)
    } catch (error) {
      const message = error instanceof Error ? error.message : '저장된 운영 설정을 불러오지 못했습니다.'
      setAuthFeedback(message)
    }
  }

  const loadPublishHistory = async (sessionToken?: string) => {
    const creatorSessionToken = sessionToken ?? localStorage.getItem(creatorSessionStorageKey)
    if (!creatorSessionToken) {
      return
    }

    try {
      const response = await fetch(`${apiBaseUrl}/api/v1/publish-jobs/recent`, {
        headers: {
          Authorization: `Bearer ${creatorSessionToken}`,
        },
      })

      if (!response.ok) {
        throw new Error('업로드 이력을 불러오지 못했습니다.')
      }

      const data = (await response.json()) as PublishJobHistoryItem[]
      setPublishHistory(data)
    } catch (error) {
      const message = error instanceof Error ? error.message : '업로드 이력을 불러오지 못했습니다.'
      setUploadError(message)
    }
  }

  const loadCreatorCommunityPosts = async (sessionToken?: string) => {
    const creatorSessionToken = sessionToken ?? localStorage.getItem(creatorSessionStorageKey)
    if (!creatorSessionToken) {
      return
    }

    try {
      const response = await fetch(`${apiBaseUrl}/api/v1/community/mine`, {
        headers: {
          Authorization: `Bearer ${creatorSessionToken}`,
        },
      })

      if (!response.ok) {
        throw new Error('커뮤니티 글을 불러오지 못했습니다.')
      }

      const data = (await response.json()) as CommunityPostItem[]
      setCommunityFeed(data)
    } catch {
      setCommunityFeed([])
    }
  }

  const loadEventBoard = async (sessionToken?: string) => {
    const creatorSessionToken = sessionToken ?? localStorage.getItem(creatorSessionStorageKey)
    if (!creatorSessionToken) {
      return
    }

    try {
      const response = await fetch(`${apiBaseUrl}/api/v1/events/mine`, {
        headers: {
          Authorization: `Bearer ${creatorSessionToken}`,
        },
      })

      if (!response.ok) {
        throw new Error('이벤트 보드를 불러오지 못했습니다.')
      }

      const data = (await response.json()) as EventSummaryItem[]
      setEventBoard(data)
    } catch {
      setEventBoard([])
    }
  }

  const loadStoreBoard = async (sessionToken?: string) => {
    const creatorSessionToken = sessionToken ?? localStorage.getItem(creatorSessionStorageKey)
    if (!creatorSessionToken) {
      return
    }

    try {
      const response = await fetch(`${apiBaseUrl}/api/v1/store/mine`, {
        headers: {
          Authorization: `Bearer ${creatorSessionToken}`,
        },
      })

      if (!response.ok) {
        throw new Error('스토어 보드를 불러오지 못했습니다.')
      }

      const data = (await response.json()) as StoreItemSummary[]
      setStoreBoard(data)
    } catch {
      setStoreBoard([])
    }
  }

  const persistCreatorSettings = async (
    sessionToken: string,
    settings: CreatorRoomSettingsResponse,
    options?: { silent?: boolean },
  ) => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/v1/creator/settings`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${sessionToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || '운영 설정 저장에 실패했습니다.')
      }
    } catch (error) {
      if (!options?.silent) {
        const message = error instanceof Error ? error.message : '운영 설정 저장에 실패했습니다.'
        setAuthFeedback(message)
      }
    }
  }

  const handleCreateInviteLink = async () => {
    const creatorSessionToken = localStorage.getItem(creatorSessionStorageKey)
    if (!creatorSessionToken) {
      setInviteStatus('먼저 크리에이터 로그인이 필요합니다.')
      return
    }

    if (!inviteTitle.trim() || !inviteSourceLabel.trim()) {
      setInviteStatus('링크 제목과 유입 위치를 입력하세요.')
      return
    }

    setIsCreatingInvite(true)
    setInviteStatus('초대 링크 생성 중')

    try {
      const response = await fetch(`${apiBaseUrl}/api/v1/invites`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${creatorSessionToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: inviteTitle.trim(),
          sourceLabel: inviteSourceLabel.trim(),
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || '초대 링크 생성에 실패했습니다.')
      }

      const createdInvite = (await response.json()) as InviteLinkSummary
      setInviteStatus(`초대 링크 생성 완료 · ${createdInvite.invite_code}`)
      setInviteTitle('')
      setInviteSourceLabel('')
      void loadCreatorInviteDashboard(creatorSessionToken)
    } catch (error) {
      const message = error instanceof Error ? error.message : '초대 링크 생성에 실패했습니다.'
      setInviteStatus(message)
    } finally {
      setIsCreatingInvite(false)
    }
  }

  const handleCopyInviteLink = async (inviteUrl: string) => {
    try {
      await navigator.clipboard.writeText(inviteUrl)
      setInviteStatus('초대 링크 복사 완료')
    } catch {
      setInviteStatus(`직접 복사하세요: ${inviteUrl}`)
    }
  }

  const handleDeactivateInviteLink = async (inviteLinkId: number) => {
    const creatorSessionToken = localStorage.getItem(creatorSessionStorageKey)
    if (!creatorSessionToken) {
      setInviteStatus('먼저 크리에이터 로그인이 필요합니다.')
      return
    }

    setInviteStatus('초대 링크 비활성화 중')

    try {
      const response = await fetch(`${apiBaseUrl}/api/v1/invites/${inviteLinkId}/deactivate`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${creatorSessionToken}`,
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || '초대 링크 비활성화에 실패했습니다.')
      }

      setInviteStatus('초대 링크 비활성화 완료')
      void loadCreatorInviteDashboard(creatorSessionToken)
    } catch (error) {
      const message = error instanceof Error ? error.message : '초대 링크 비활성화에 실패했습니다.'
      setInviteStatus(message)
    }
  }

  const handleUpdateFanTier = async (membershipId: number, tier: string) => {
    const creatorSessionToken = localStorage.getItem(creatorSessionStorageKey)
    if (!creatorSessionToken) {
      setFanTierStatus('먼저 크리에이터 로그인이 필요합니다.')
      return
    }

    setFanTierStatus(`${tier} 등급으로 변경 중`)

    try {
      const response = await fetch(`${apiBaseUrl}/api/v1/creator/fans/${membershipId}/tier`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${creatorSessionToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tier }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || '팬 등급 변경에 실패했습니다.')
      }

      setFanTierStatus(`${tier} 등급으로 변경 완료`)
      void loadCreatorFanMembers(creatorSessionToken)
    } catch (error) {
      const message = error instanceof Error ? error.message : '팬 등급 변경에 실패했습니다.'
      setFanTierStatus(message)
    }
  }

  const fetchFanSession = async (sessionToken: string, options?: { silent?: boolean }) => {
    if (!options?.silent) {
      setFanError('')
    }

    try {
      const response = await fetch(`${apiBaseUrl}/api/v1/fans/me`, {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      })

      if (!response.ok) {
        throw new Error('팬 세션을 확인하지 못했습니다.')
      }

      const data = (await response.json()) as FanAuthResponse
      setFanSession(data)
      persistFanSession(data.session_token)
      setSelectedFanRoomId(data.joined_rooms[0]?.room_slug ?? 'salt-toast')
      setFanStatus(`${data.nickname}님 팬 세션 유지 중`)
    } catch (error) {
      localStorage.removeItem(fanSessionStorageKey)
      setFanSession(null)
      const message = error instanceof Error ? error.message : '팬 세션을 확인하지 못했습니다.'
      if (!options?.silent) {
        setFanError(message)
      }
    } finally {
    }
  }

  const loadInviteDetail = async (nextInviteCode: string) => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/v1/invites/${nextInviteCode}`)
      if (!response.ok) {
        throw new Error('초대 링크 정보를 불러오지 못했습니다.')
      }

      const data = (await response.json()) as InviteDetailResponse
      setInviteDetail(data)
      setInviteCode(nextInviteCode)
      setCurrentView('invite')
      setFanStatus(`${data.creator_name} 팬방 초대 링크 열림`)
      setFanError('')
    } catch (error) {
      const message = error instanceof Error ? error.message : '초대 링크 정보를 불러오지 못했습니다.'
      setFanError(message)
    }
  }

  const startFanGoogleLogin = async (nextInviteCode?: string) => {
    setIsStartingFanGoogleLogin(true)
    setFanError('')
    setFanStatus(nextInviteCode ? '팬 가입용 Google 로그인으로 이동 중' : '팬 로그인용 Google으로 이동 중')

    try {
      const query = nextInviteCode ? `?inviteCode=${encodeURIComponent(nextInviteCode)}` : ''
      const response = await fetch(`${apiBaseUrl}/api/v1/fans/auth-url${query}`)
      if (!response.ok) {
        throw new Error('팬 Google 로그인 주소를 만들지 못했습니다.')
      }

      const data = (await response.json()) as FanAuthUrlResponse
      window.location.assign(data.auth_url)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : '팬 Google 로그인을 시작하지 못했습니다.'
      setFanError(message)
      setFanStatus(nextInviteCode ? '팬 가입 시작 실패' : '팬 로그인 시작 실패')
      setIsStartingFanGoogleLogin(false)
    }
  }

  const startUnifiedGoogleLogin = async () => {
    setIsStartingGoogleLogin(true)
    setAuthFeedback('Google 로그인 페이지로 이동 중')

    try {
      const response = await fetch(`${apiBaseUrl}/api/v1/auth/google/auth-url`)
      if (!response.ok) {
        throw new Error('공통 Google 로그인 주소를 만들지 못했습니다.')
      }

      const data = (await response.json()) as GoogleAuthUrlResponse
      window.location.assign(data.auth_url)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Google 로그인을 시작하지 못했습니다.'
      setAuthFeedback(message)
      setIsStartingGoogleLogin(false)
    }
  }

  const completeFanMode = async () => {
    if (!pendingGoogleProfile) {
      setFanError('먼저 Google 로그인이 필요합니다.')
      return
    }

    setFanError('')
    setFanStatus('팬 모드로 전환 중')

    try {
      const response = await fetch(`${apiBaseUrl}/api/v1/fans/google-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pendingGoogleProfile),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || '팬 모드 전환에 실패했습니다.')
      }

      const data = (await response.json()) as FanAuthResponse
      setFanSession(data)
      persistFanSession(data.session_token)
      setSelectedFanRoomId(data.joined_rooms[0]?.room_slug ?? 'salt-toast')
      clearGoogleProfile()
      setCurrentView('fan')
      setFanStatus(`${data.nickname}님 팬 로그인 완료`)
    } catch (error) {
      const message = error instanceof Error ? error.message : '팬 모드 전환에 실패했습니다.'
      setFanError(message)
      setFanStatus('팬 모드 전환 실패')
    }
  }

  const handleEmailLogin = () => {
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setAuthFeedback('이메일과 비밀번호를 입력하세요.')
      return
    }

    setAuthFeedback('일반 로그인 연동은 다음 단계에서 붙일 예정입니다.')
  }

  const handleFanJoin = async () => {
    if (!inviteCode.trim()) {
      setFanError('초대 링크 코드가 필요합니다.')
      return
    }

    setIsJoiningInvite(true)
    await startFanGoogleLogin(inviteCode)
    setIsJoiningInvite(false)
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0] ?? null
    setSelectedFile(nextFile)
  }

  const handlePostImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0] ?? null
    setSelectedPostImage(nextFile)
  }

  useEffect(() => {
    if (!selectedFile) {
      setUploadPreviewUrl(null)
      return
    }

    const objectUrl = URL.createObjectURL(selectedFile)
    setUploadPreviewUrl(objectUrl)

    return () => {
      URL.revokeObjectURL(objectUrl)
    }
  }, [selectedFile])

  useEffect(() => {
    if (!selectedPostImage) {
      setPostPreviewUrl(null)
      return
    }

    const objectUrl = URL.createObjectURL(selectedPostImage)
    setPostPreviewUrl(objectUrl)

    return () => {
      URL.revokeObjectURL(objectUrl)
    }
  }, [selectedPostImage])

  useEffect(() => {
    if (uploadResult?.watch_url) {
      setCommentTargetUrl(uploadResult.watch_url)
      return
    }

    const latestYoutubeJob = publishHistory.find(
      (job) => job.platform === 'YOUTUBE' && job.target_url,
    )
    if (latestYoutubeJob?.target_url) {
      setCommentTargetUrl(latestYoutubeJob.target_url)
    }
  }, [uploadResult, publishHistory])

  const handlePublishPost = async () => {
    if (!postTitle.trim()) {
      setUploadError('유튜브 글 제목을 입력하세요.')
      return
    }

    if (!postBody.trim()) {
      setUploadError('유튜브 글 본문을 입력하세요.')
      return
    }

    try {
      await navigator.clipboard.writeText(youtubeCommunityDraft)
      setPostStatus('유튜브 커뮤니티 초안 복사 완료')
      setUploadError('')
    } catch {
      setPostStatus('초안 준비 완료')
      setUploadError('복사는 브라우저 권한 문제로 실패했습니다. 아래 초안을 직접 복사하면 됩니다.')
    }
  }

  const handlePublishYoutubeComment = async () => {
    if (!commentTargetUrl.trim()) {
      setUploadError('댓글을 달 YouTube 영상 URL이 필요합니다.')
      return
    }

    if (!postBody.trim()) {
      setUploadError('댓글 본문으로 사용할 내용을 입력하세요.')
      return
    }

    try {
      const response = await fetch(`${apiBaseUrl}/api/v1/youtube/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videoUrl: commentTargetUrl.trim(),
          message: postBody.trim(),
        }),
      })

      if (!response.ok) {
        const errorPayload = (await response.json().catch(() => null)) as { message?: string } | null
        throw new Error(errorPayload?.message ?? '유튜브 고정 댓글을 배포하지 못했습니다. YouTube를 다시 연결해 주세요.')
      }

      const data = (await response.json()) as YoutubeCommentResult
      setCommentResult(data)
      setCommentStatus('유튜브 댓글 배포 완료')
      setUploadError('')
    } catch (error) {
      const message = error instanceof Error ? error.message : '유튜브 댓글 배포에 실패했습니다.'
      setCommentStatus('댓글 배포 실패')
      setUploadError(message)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError('업로드할 mp4 파일을 먼저 선택하세요.')
      return
    }

    if (!uploadTitle.trim()) {
      setUploadError('영상 제목을 입력하세요.')
      return
    }

    setIsUploading(true)
    setUploadError('')
    setUploadStatus('YouTube로 전송 중')
    setUploadResult(null)

    try {
      const formData = new FormData()
      formData.append('title', uploadTitle.trim())
      formData.append('description', uploadDescription.trim())
      formData.append('privacyStatus', privacyStatus)
      formData.append('file', selectedFile)

      const response = await fetch(`${apiBaseUrl}/api/v1/youtube/upload`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || '업로드에 실패했습니다.')
      }

      const data = (await response.json()) as UploadResult
      setUploadResult(data)
      setUploadStatus('업로드 완료')
      setPublishHistory((current) => [
        {
          publish_job_id: Date.now(),
          platform: 'YOUTUBE',
          status: 'SUCCESS',
          title: data.title,
          target_url: data.watch_url,
          scheduled_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
        },
        ...current.filter((job) => job.title !== data.title || job.target_url !== data.watch_url),
      ].slice(0, 10))
      void loadPublishHistory()
      void loadCreatorCommunityPosts()
      if (!connectedChannel) {
        void loadLatestConnection()
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : '업로드에 실패했습니다.'
      setUploadError(message)
      setUploadStatus('업로드 실패')
    } finally {
      setIsUploading(false)
    }
  }

  const handleSchedulePublish = async () => {
    const creatorSessionToken = localStorage.getItem(creatorSessionStorageKey)
    if (!creatorSessionToken) {
      setScheduleStatus('먼저 인플루언서 로그인이 필요합니다.')
      return
    }

    if (!uploadTitle.trim()) {
      setScheduleStatus('예약할 영상 제목을 먼저 입력하세요.')
      return
    }

    setScheduleStatus('타임라인에 예약 등록 중')

    try {
      const response = await fetch(`${apiBaseUrl}/api/v1/publish-jobs/schedule`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${creatorSessionToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: uploadTitle.trim(),
          scheduledAt: scheduledPublishAt ? new Date(scheduledPublishAt).toISOString().slice(0, 19) : '',
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || '예약 등록에 실패했습니다.')
      }

      const data = (await response.json()) as PublishJobHistoryItem
      setPublishHistory((current) => [data, ...current].slice(0, 10))
      setScheduleStatus('예약 타임라인 등록 완료')
      void loadPublishHistory()
    } catch (error) {
      const message = error instanceof Error ? error.message : '예약 등록에 실패했습니다.'
      setScheduleStatus(message)
    }
  }

  const startCreatorGoogleLogin = async () => {
    setIsStartingGoogleLogin(true)
    setUploadError('')
    setAuthFeedback('Google 로그인 페이지로 이동 중')

    try {
      const response = await fetch(`${apiBaseUrl}/api/v1/youtube/auth-url`)
      if (!response.ok) {
        throw new Error('구글 로그인 주소를 만들지 못했습니다.')
      }

      const data = (await response.json()) as AuthUrlResponse
      window.location.assign(data.auth_url)
    } catch (error) {
      const message = error instanceof Error ? error.message : '구글 로그인을 시작하지 못했습니다.'
      setAuthFeedback(message)
      setUploadError(message)
      setIsStartingGoogleLogin(false)
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const view = params.get('view')
    const youtubeState = params.get('youtube')
    const fanOAuthState = params.get('fan')
    const googleState = params.get('google')
    const message = params.get('message')
    const appToken = params.get('appToken')
    const fanAppToken = params.get('fanAppToken')
    const googleEmail = params.get('googleEmail')
    const googleName = params.get('googleName')
    const googlePicture = params.get('googlePicture')
    const pathname = window.location.pathname

    if (
      view === 'content' ||
      view === 'signup' ||
      view === 'dashboard' ||
      view === 'fan'
    ) {
      setCurrentView(view)
    }

    if (pathname === '/privacy') {
      setCurrentView('privacy')
    }

    if (pathname === '/terms') {
      setCurrentView('terms')
    }

    if (youtubeState === 'connected') {
      if (appToken) {
        persistCreatorSession(appToken)
      }
      clearGoogleProfile()
      setCurrentView('content')
      setAuthFeedback('구글 로그인 완료, 연결된 유튜브 채널 정보를 불러왔습니다.')
      void loadLatestConnection()
    }

    if (youtubeState === 'error') {
      setCurrentView('signup')
      setAuthFeedback(message || '구글 로그인 중 오류가 발생했습니다.')
    }

    if (googleState === 'connected' && googleEmail && googleName) {
      persistGoogleProfile({
        email: googleEmail,
        name: googleName,
        picture: googlePicture ?? '',
      })
      setCurrentView('signup')
      setAuthFeedback('Google 로그인 완료')
    }

    if (googleState === 'error') {
      setCurrentView('signup')
      setAuthFeedback(message || 'Google 로그인 중 오류가 발생했습니다.')
    }

    if (fanOAuthState === 'connected') {
      if (fanAppToken) {
        persistFanSession(fanAppToken)
        void fetchFanSession(fanAppToken, { silent: true })
      }
      setCurrentView('fan')
      setFanStatus('Google 팬 로그인 완료')
      setFanError('')
    }

    if (fanOAuthState === 'error') {
      setCurrentView(pathname.startsWith('/invite/') ? 'invite' : 'fan')
      setFanStatus('Google 팬 로그인 실패')
      setFanError(message || '팬 Google 로그인 중 오류가 발생했습니다.')
    }

    if (
      view ||
      youtubeState ||
      fanOAuthState ||
      googleState ||
      message ||
      appToken ||
      fanAppToken ||
      googleEmail ||
      googleName ||
      googlePicture
    ) {
      window.history.replaceState({}, document.title, window.location.pathname)
    }

    if (pathname.startsWith('/invite/')) {
      const nextInviteCode = pathname.replace('/invite/', '').trim()
      if (nextInviteCode) {
        void loadInviteDetail(nextInviteCode)
      }
    }

    if (!youtubeState) {
      const storedSessionToken = localStorage.getItem(creatorSessionStorageKey)
      if (storedSessionToken) {
        setCurrentView('content')
        setAuthFeedback('이전 로그인 상태를 복원하는 중')
        void fetchCurrentCreatorSession(storedSessionToken, { silent: true })
      }
    }

    const storedFanSessionToken = localStorage.getItem(fanSessionStorageKey)
    if (storedFanSessionToken) {
      const storedCreatorSessionToken = localStorage.getItem(creatorSessionStorageKey)
      if (!storedCreatorSessionToken && !pathname.startsWith('/invite/')) {
        setCurrentView('fan')
      }
      void fetchFanSession(storedFanSessionToken, { silent: true })
    }

    const storedGoogleProfile = localStorage.getItem(googleProfileStorageKey)
    if (storedGoogleProfile) {
      try {
        setPendingGoogleProfile(JSON.parse(storedGoogleProfile) as PendingGoogleProfile)
      } catch {
        localStorage.removeItem(googleProfileStorageKey)
      }
    }
  }, [])

  useEffect(() => {
    if (currentView === 'privacy' || currentView === 'terms') {
      const targetPath = currentView === 'privacy' ? '/privacy' : '/terms'
      if (window.location.pathname !== targetPath) {
        window.history.replaceState({}, document.title, targetPath)
      }
      return
    }

    if (window.location.pathname === '/privacy' || window.location.pathname === '/terms') {
      window.history.replaceState({}, document.title, '/')
    }
  }, [currentView])

  useEffect(() => {
    const storedRoomTheme = localStorage.getItem(roomThemeStorageKey)
    if (storedRoomTheme && roomThemePresets.some((preset) => preset.id === storedRoomTheme)) {
      setSelectedRoomTheme(storedRoomTheme as RoomThemeId)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(roomThemeStorageKey, selectedRoomTheme)
  }, [selectedRoomTheme])

  useEffect(() => {
    const storedAppearance = localStorage.getItem(creatorAppearanceStorageKey)
    if (!storedAppearance) {
      return
    }

    try {
      const parsed = JSON.parse(storedAppearance) as Partial<CreatorAppearanceSettings>
      if (parsed.bannerStyle === 'focus' || parsed.bannerStyle === 'soft' || parsed.bannerStyle === 'broadcast') {
        setBannerStyle(parsed.bannerStyle)
      }
      if (parsed.buttonStyle === 'rounded' || parsed.buttonStyle === 'solid' || parsed.buttonStyle === 'outlined') {
        setButtonStyle(parsed.buttonStyle)
      }
      if (parsed.cardDensity === 'compact' || parsed.cardDensity === 'comfortable' || parsed.cardDensity === 'airy') {
        setCardDensity(parsed.cardDensity)
      }
    } catch {
      localStorage.removeItem(creatorAppearanceStorageKey)
    }
  }, [])

  useEffect(() => {
    const appearanceSettings: CreatorAppearanceSettings = {
      bannerStyle,
      buttonStyle,
      cardDensity,
    }
    localStorage.setItem(creatorAppearanceStorageKey, JSON.stringify(appearanceSettings))
  }, [bannerStyle, buttonStyle, cardDensity])

  useEffect(() => {
    if (!isCreatorLoggedIn || !hasHydratedCreatorSettings) {
      return
    }

    const sessionToken = localStorage.getItem(creatorSessionStorageKey)
    if (!sessionToken) {
      return
    }

    void persistCreatorSettings(
      sessionToken,
      {
        room_theme_id: selectedRoomTheme,
        banner_style: bannerStyle,
        button_style: buttonStyle,
        card_density: cardDensity,
        selected_features: selectedFeatures,
      },
      { silent: true },
    )
  }, [
    isCreatorLoggedIn,
    hasHydratedCreatorSettings,
    selectedRoomTheme,
    bannerStyle,
    buttonStyle,
    cardDensity,
    selectedFeatures,
  ])

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!roleMenuRef.current?.contains(event.target as Node)) {
        setIsRoleMenuOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsRoleMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  useEffect(() => {
    const root = document.documentElement
    const body = document.body

    if (!useRoomThemeSurface) {
      root.classList.remove('room-themed-root')
      body.classList.remove('room-themed-root')
      root.style.removeProperty('--room-theme-hero')
      root.style.removeProperty('--room-theme-panel')
      root.style.removeProperty('--room-theme-accent')
      root.style.removeProperty('--room-theme-text')
      root.style.removeProperty('--room-theme-muted')
      return
    }

    root.classList.add('room-themed-root')
    body.classList.add('room-themed-root')
    root.style.setProperty('--room-theme-hero', activeRoomTheme.heroBackground)
    root.style.setProperty('--room-theme-panel', activeRoomTheme.panelBackground)
    root.style.setProperty('--room-theme-accent', activeRoomTheme.accent)
    root.style.setProperty('--room-theme-text', activeRoomTheme.textColor)
    root.style.setProperty('--room-theme-muted', activeRoomTheme.mutedColor)
  }, [activeRoomTheme, useRoomThemeSurface])

  const renderHeader = () => (
    <header className="top-nav">
      <button
        className="brand-lockup"
        onClick={() => setCurrentView(isCreatorLoggedIn ? 'dashboard' : isFanLoggedIn ? 'fan' : 'home')}
      >
        <span className="brand-badge">IH</span>
        <span className="brand-text">
          <strong>InfluenceHub</strong>
          <span>{headerSubtitle}</span>
        </span>
      </button>

      <div className="nav-actions">
        <nav className="nav-tabs" aria-label="primary">
          {headerTabs.map(([id, label]) => (
            <button
              className={currentView === id ? 'nav-tab active' : 'nav-tab'}
              key={id}
              onClick={() => {
                setCurrentView(id)
                setIsRoleMenuOpen(false)
              }}
            >
              {label}
            </button>
          ))}
          {headerRoleLabel ? (
            <div className="role-menu-wrap" ref={roleMenuRef}>
              <button
                className="nav-role-chip"
                onClick={() => setIsRoleMenuOpen((current) => !current)}
                type="button"
              >
                {headerRoleLabel}
              </button>
              {isRoleMenuOpen ? (
                <div className="role-menu-dropdown">
                  {isCreatorLoggedIn ? (
                    <button className="role-menu-item" onClick={handleCreatorLogout} type="button">
                      인플루언서 로그아웃
                    </button>
                  ) : null}
                  {isFanLoggedIn && !isCreatorLoggedIn ? (
                    <button className="role-menu-item" onClick={handleFanLogout} type="button">
                      팬 로그아웃
                    </button>
                  ) : null}
                </div>
              ) : null}
            </div>
          ) : null}
        </nav>
      </div>
    </header>
  )

  const renderCreatorAccessGuard = (
    title: string,
    description: string,
    primaryLabel = '크리에이터 로그인으로 이동',
  ) => (
    <section className="scene-panel light">
      <div className="scene-copy">
        <span className="section-label dark">CREATOR ACCESS</span>
        <h2>{title}</h2>
        <p>{description}</p>

        <div className="highlight-card">
          <span className="mini-label">현재 상태</span>
          <strong>{isFanLoggedIn ? '팬 모드로 로그인됨' : '비로그인 상태'}</strong>
          <p>
            운영 화면은 크리에이터 채널과 팬방을 직접 관리하는 영역이라 역할이 분리돼야
            자연스럽습니다.
          </p>
        </div>

        <div className="inline-actions">
          <button className="primary-action" onClick={openCreatorStart}>
            {primaryLabel}
          </button>
          <button className="secondary-action dark" onClick={() => setCurrentView(isFanLoggedIn ? 'fan' : 'home')}>
            {isFanLoggedIn ? '내 팬방으로 돌아가기' : '홈으로'}
          </button>
        </div>
      </div>

      <div className="scene-card access-card">
        <div className="card-header">
          <div>
            <span className="card-kicker">권한 안내</span>
            <h2>역할별 화면을 분리했습니다</h2>
          </div>
          <span className="status-badge">Locked</span>
        </div>

        <div className="detail-grid">
          <article className="detail-card">
            <span className="mini-label">크리에이터 전용</span>
            <strong>채널 연결, 초대 링크, 팬 분류, 업로드 관리</strong>
            <p>운영 기능은 로그인한 크리에이터 채널 기준으로만 열립니다.</p>
          </article>
          <article className="detail-card">
            <span className="mini-label">팬 전용</span>
            <strong>가입한 팬방, 초대 링크, 팬방 선택</strong>
            <p>팬은 여러 인플루언서 팬방을 오가며 참여하는 흐름에 집중합니다.</p>
          </article>
        </div>
      </div>
    </section>
  )

  const renderFanHome = () => {
    const joinedRooms = fanSession?.joined_rooms ?? []

    return (
      <>
        <section className="hero-panel">
          <div className="hero-copy role-home-card">
            <div className="eyebrow-row">
              <span className="eyebrow-pill">INFLUENCEHUB</span>
              <span className="eyebrow-note">Fan Membership Home</span>
            </div>

            <h1>
              가입한 팬방을
              <br />
              한 화면에서
              <br />
              오가며 보는 홈
            </h1>

            <p className="hero-description">
              팬 모드에서는 크리에이터 운영 화면보다 내가 가입한 팬방, 최근 초대 링크,
              다음 일정과 굿즈 오픈 같은 팬 중심 정보가 먼저 보여야 자연스럽습니다.
            </p>

            <div className="hero-actions">
              <button className="primary-action" onClick={() => setCurrentView('fan')}>
                내 팬방 보기
              </button>
              <button className="secondary-action" onClick={() => setCurrentView('invite')}>
                최근 초대 링크 보기
              </button>
            </div>

            <div className="stat-grid">
              <article className="stat-card">
                <span className="stat-label">가입한 팬방</span>
                <strong>{joinedRooms.length}</strong>
                <span className="stat-meta">같은 팬 계정으로 여러 방 이동</span>
              </article>
              <article className="stat-card">
                <span className="stat-label">현재 선택 팬방</span>
                <strong>{activeFanRoom.creator}</strong>
                <span className="stat-meta">{activeFanRoom.label}</span>
              </article>
              <article className="stat-card">
                <span className="stat-label">최근 입장 경로</span>
                <strong>Invite</strong>
                <span className="stat-meta">{activeFanRoom.joinedVia}</span>
              </article>
            </div>
          </div>

          <div className="preview-stack">
            <section className="signup-card">
              <div className="card-header">
                <div>
                  <span className="card-kicker">내 팬방</span>
                  <h2>{fanSession?.nickname ?? '팬'}님이 가입한 방</h2>
                </div>
                <span className="status-badge">FAN</span>
              </div>

              <div className="journey-list">
                {displayedFanRooms.map((room) => (
                  <button
                    className="journey-card"
                    key={room.id}
                    onClick={() => {
                      setSelectedFanRoomId(room.id)
                      setCurrentView('fan')
                    }}
                  >
                    <span>{room.creator.slice(0, 1)}</span>
                    <strong>{room.label}</strong>
                  </button>
                ))}
              </div>
            </section>

            <section className="room-preview-card">
              <div className="preview-topbar">
                <div className="creator-chip">
                  <span className="chip-avatar">FAN</span>
                  <div>
                    <strong>{activeFanRoom.creator}</strong>
                    <span>{activeFanRoom.joinedVia}</span>
                  </div>
                </div>
                <button className="tiny-action" onClick={() => setCurrentView('fan')}>
                  팬방 열기
                </button>
              </div>

              <div className="role-home-stack">
                <article className="role-home-note">
                  <span className="section-label">최근 공지</span>
                  <strong>오늘 밤 8시 새 영상 공개 + 팬방 Q&amp;A</strong>
                  <p>업로드 직후 팬방 공지와 일정 카드가 같이 열리도록 구성했습니다.</p>
                </article>
                <article className="role-home-note">
                  <span className="section-label">다음 액션</span>
                  <strong>굿즈 선오픈 알림 받기</strong>
                  <p>팬방 탭에서 일정과 굿즈를 오가며 필요한 방을 바로 선택하면 됩니다.</p>
                </article>
              </div>
            </section>
          </div>
        </section>

        <section className="workflow-panel">
          <div className="workflow-copy">
            <span className="section-label">FAN FLOW</span>
            <h2>초대 링크로 들어와 팬방을 추가하는 흐름</h2>
            <p>
              팬은 영상 설명란이나 라이브 고정 댓글의 초대 링크를 타고 가입한 뒤, 여러
              인플루언서 팬방을 같은 계정으로 오가며 소비합니다.
            </p>
          </div>

          <div className="step-list">
            {[
              '영상·라이브 초대 링크 진입',
              '팬 계정으로 간단 가입',
              '가입한 팬방 목록에 자동 추가',
              '원하는 팬방을 선택해 다시 입장',
            ].map((step, index) => (
              <article className="step-card" key={step}>
                <span className="step-index">0{index + 1}</span>
                <p>{step}</p>
              </article>
            ))}
          </div>
        </section>
      </>
    )
  }

  const renderHome = () =>
    isFanLoggedIn && !isCreatorLoggedIn ? (
      renderFanHome()
    ) : (
      <>
      <section className="hero-panel">
        <div className="hero-copy">
          <div className="eyebrow-row">
            <span className="eyebrow-pill">INFLUENCEHUB</span>
            <span className="eyebrow-note">Creator Room Operating System</span>
          </div>

          <h1>
            콘텐츠 밖의 팬 경험까지
            <br />
            하나의 허브로
          </h1>

          <p className="hero-description">
            InfluenceHub는 콘텐츠 공개 이후의 팬 유입, 커뮤니티, 이벤트, 굿즈 운영을
            한 화면으로 묶는 인플루언서 운영 허브입니다.
          </p>

          <div className="hero-actions">
            <button className="primary-action" onClick={openCreatorStart}>
              {isCreatorLoggedIn ? '내 채널 관리하기' : '지금 시작하기'}
            </button>
            <button className="secondary-action" onClick={() => setCurrentView('signup')}>
              로그인
            </button>
          </div>

          <div className="stat-grid">
            {homeStatCards.map((card) => (
              <article className="stat-card" key={card.label}>
                <span className="stat-label">{card.label}</span>
                <strong>{card.value}</strong>
                <span className="stat-meta">{card.meta}</span>
              </article>
            ))}
          </div>
        </div>

        <div className="preview-stack">
          <section className="signup-card">
            <div className="card-header">
              <div>
                <span className="card-kicker">WHY INFLUENCEHUB</span>
                <h2>운영 흐름을 한곳에 모읍니다</h2>
              </div>
              <span className="status-badge">MVP</span>
            </div>

            <p className="card-intro">
              {isCreatorLoggedIn
                ? '연결된 채널 기준으로 팬 운영과 배포 흐름을 바로 이어갈 수 있습니다.'
                : '콘텐츠 공개 후 팬이 들어오고 다시 돌아오는 흐름까지 한 번에 관리합니다.'}
            </p>

            <div className="journey-list">
              {[
                '새 콘텐츠 공개와 동시에 팬 공지 연결',
                '초대 링크로 팬 유입과 가입 전환 추적',
                '팬방, 이벤트, 굿즈를 한 흐름으로 운영',
                '팬 등급과 코어 팬 그룹까지 직접 관리',
              ].map((step, index) => (
                <button
                  className="journey-card"
                  key={step}
                  onClick={() => openCreatorOnboardingStep(index)}
                >
                  <span>0{index + 1}</span>
                  <strong>{step}</strong>
                </button>
              ))}
            </div>
          </section>

          <section className="room-preview-card">
            <div className="preview-topbar">
              <div className="creator-chip">
                <span className="chip-avatar">TV</span>
                <div>
                  <strong>침착한개발자TV</strong>
                  <span>방장 · 구독자 12.4만</span>
                </div>
              </div>
              <button className="tiny-action" onClick={openCreatorStart}>
                {isCreatorLoggedIn ? '운영 계속하기' : '시작하기'}
              </button>
            </div>

            <div className="room-layout">
              <div className="room-main">
                <span className="section-label">서비스 미리보기</span>
                <h3>업로드 뒤의 운영까지 이어집니다</h3>
                <p>
                  영상 공개, 팬 공지, 라이브 예고, 초대 링크, 굿즈 오픈까지 같은 흐름 안에서
                  이어집니다.
                </p>
                <div className="platform-tags">
                  <span>YouTube</span>
                  <span>팬방</span>
                  <span>이벤트</span>
                  <span>굿즈</span>
                </div>
              </div>

              <aside className="room-side">
                <span className="section-label">핵심 기능</span>
                <div className="module-list">
                  {featureCatalog.slice(0, 4).map((module) => {
                    const enabled = selectedFeatures.includes(module.name)

                    return (
                      <article className="module-card" key={module.name}>
                        <div className="module-heading">
                          <strong>{module.name}</strong>
                          <span className={enabled ? 'toggle on' : 'toggle'}>
                            {enabled ? 'ON' : 'OFF'}
                          </span>
                        </div>
                        <p>{module.description}</p>
                      </article>
                    )
                  })}
                </div>
              </aside>
            </div>
          </section>
        </div>
      </section>

      <section className="workflow-panel">
        <div className="workflow-copy">
            <span className="section-label">PLATFORM OVERVIEW</span>
            <h2>콘텐츠 이후의 운영을 연결합니다</h2>
          <p>
            팬이 어디로 들어오고, 무엇을 보고, 어떻게 다시 돌아오는지까지 하나의 흐름으로
            설계할 수 있습니다.
          </p>
        </div>

        <div className="step-list">
          {[
            '콘텐츠 공개 뒤 팬 유입 연결',
            '초대 링크로 팬방 입장 전환',
            '커뮤니티와 이벤트로 참여 축적',
            '굿즈와 멤버십으로 관계 확장',
          ].map((step, index) => (
            <article className="step-card" key={step}>
              <span className="step-index">0{index + 1}</span>
              <p>{step}</p>
            </article>
          ))}
        </div>
      </section>
    </>
    )

  const renderSignup = () => (
    <section className="scene-panel light auth-shell">
      <div className="scene-card auth-form-card">
        <div className="card-header">
          <div>
            <span className="card-kicker">LOGIN</span>
            <h2>{pendingGoogleProfile ? '모드 선택' : '로그인'}</h2>
          </div>
          <span className="status-badge">LIVE UI</span>
        </div>

        {!pendingGoogleProfile ? (
          <>
            <div className="auth-method-row">
              <button
                className={authMethod === 'social' ? 'auth-method-tab active' : 'auth-method-tab'}
                onClick={() => setAuthMethod('social')}
                type="button"
              >
                SNS 로그인
              </button>
              <button
                className={authMethod === 'email' ? 'auth-method-tab active' : 'auth-method-tab'}
                onClick={() => setAuthMethod('email')}
                type="button"
              >
                일반 로그인
              </button>
            </div>

            {authMethod === 'social' ? (
              <div className="auth-block">
                <button className="primary-action auth-main-button" onClick={() => void startUnifiedGoogleLogin()}>
                  {isStartingGoogleLogin ? 'Google로 이동 중...' : 'Google로 로그인'}
                </button>
                <p className="auth-helper-copy">로그인 뒤 인플루언서 또는 팬 모드를 고릅니다.</p>
              </div>
            ) : (
              <div className="form-stack auth-form-stack">
                <div className="field-block">
                  <span className="mini-label">이메일</span>
                  <input
                    className="text-input"
                    onChange={(event) => setLoginEmail(event.target.value)}
                    placeholder="you@example.com"
                    value={loginEmail}
                  />
                </div>
                <div className="field-block">
                  <span className="mini-label">비밀번호</span>
                  <input
                    className="text-input"
                    onChange={(event) => setLoginPassword(event.target.value)}
                    placeholder="비밀번호 입력"
                    type="password"
                    value={loginPassword}
                  />
                </div>
                <button className="primary-action auth-main-button" onClick={handleEmailLogin}>
                  일반 로그인
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="auth-block">
            <div className="highlight-card auth-profile-card">
              <span className="mini-label">로그인 완료</span>
              <strong>{pendingGoogleProfile.name}</strong>
              <p>{pendingGoogleProfile.email}</p>
            </div>

            <div className="detail-grid auth-mode-grid">
              <button
                className={authMode === 'influencer' ? 'detail-card auth-mode-card active' : 'detail-card auth-mode-card'}
                onClick={() => setAuthMode('influencer')}
                type="button"
              >
                <span className="mini-label">인플루언서</span>
                <strong>채널 연결하고 시작</strong>
                <p>운영 화면으로 이어집니다.</p>
              </button>
              <button
                className={authMode === 'fan' ? 'detail-card auth-mode-card active' : 'detail-card auth-mode-card'}
                onClick={() => setAuthMode('fan')}
                type="button"
              >
                <span className="mini-label">팬</span>
                <strong>팬방으로 들어가기</strong>
                <p>가입한 팬방을 불러옵니다.</p>
              </button>
            </div>

            <button className="primary-action auth-main-button" onClick={() => void startSelectedAuthFlow()}>
              {isStartingFanGoogleLogin ? '이동 중...' : authMode === 'influencer' ? '인플루언서 모드로 계속' : '팬 모드로 계속'}
            </button>
          </div>
        )}

        <div className="notice-preview auth-status-card">
          <span className="mini-label">상태</span>
          <strong>{isCreatorLoggedIn ? authFeedback : fanStatus}</strong>
          <p>{pendingGoogleProfile ? '모드를 고르면 다음 화면으로 바로 이어집니다.' : 'Google 또는 일반 로그인으로 시작할 수 있습니다.'}</p>
        </div>

        <div className="inline-actions">
          <button className="secondary-action dark" onClick={() => setCurrentView('home')}>
            홈으로
          </button>
        </div>
      </div>

      <div className="scene-copy auth-visual-panel">
        <span className="section-label dark">INFLUENCEHUB</span>
        <h2>콘텐츠 밖의 관계를 이어가는 공간</h2>
        <p>
          공지, 초대 링크, 커뮤니티, 이벤트, 굿즈까지 같은 흐름으로 이어집니다.
        </p>

        <div className="auth-visual-stage">
          <div className="auth-visual-orb auth-visual-orb-one" />
          <div className="auth-visual-orb auth-visual-orb-two" />

          <article className="auth-figure influencer-figure">
            <span className="auth-figure-badge">INFLUENCER</span>
            <strong>방장</strong>
            <p>새 영상 공개</p>
          </article>

          <article className="auth-figure fan-figure">
            <span className="auth-figure-badge">FAN</span>
            <strong>팬</strong>
            <p>초대 링크 입장</p>
          </article>

          <article className="auth-chat-card auth-chat-card-main">
            <span className="mini-label">공지</span>
            <strong>오늘 밤 8시 본편 공개</strong>
            <p>업로드 후 팬방 공지와 링크가 동시에 열립니다.</p>
          </article>

          <article className="auth-chat-card auth-chat-card-sub">
            <span className="mini-label">팬 반응</span>
            <strong>Q&amp;A 열렸어요?</strong>
            <p>팬은 같은 계정으로 팬방에 다시 들어옵니다.</p>
          </article>
        </div>
      </div>
    </section>
  )

  const renderRoom = () => (
    <section className={`scene-panel creator-workspace ${creatorExperienceClasses}`}>
      <div className="scene-copy">
        <span className="section-label">ROOM SETTINGS</span>
        <h2>{isCreatorLoggedIn ? '팬방 설정' : '팬방의 첫 인상을 정리합니다'}</h2>
        <p>
          {isCreatorLoggedIn
            ? '채널에 맞는 테마와 운영 옵션을 먼저 잡아두면 팬 화면과 운영 화면이 같은 톤으로 맞춰집니다.'
            : '채널 이름, 팬방 주소, 소개 톤을 먼저 정리하면 이후 화면이 그 기준으로 이어집니다.'}
        </p>

        <div className="progress-strip">
          <span className="progress-dot done" />
          <span className="progress-dot active" />
          <span className="progress-dot" />
          <span className="progress-dot" />
        </div>

        <div className="inline-actions">
          <button className="primary-action" onClick={() => setCurrentView('features')}>
            {isCreatorLoggedIn ? '기능 설정으로' : '기능 선택으로'}
          </button>
          <button className="secondary-action" onClick={() => setCurrentView('content')}>
            채널로 돌아가기
          </button>
        </div>
      </div>

      <div className="scene-card dark-card">
        <div className="dual-pane">
          <section className="editor-card">
            <span className="card-kicker">방 컬러 커스텀</span>
            <div className="theme-preset-grid">
              {roomThemePresets.map((preset) => (
                <button
                  className={preset.id === selectedRoomTheme ? 'theme-preset-card active' : 'theme-preset-card'}
                  key={preset.id}
                  onClick={() => setSelectedRoomTheme(preset.id)}
                  type="button"
                >
                  <div
                    className="theme-swatch"
                    style={{
                      background: preset.heroBackground,
                      boxShadow: `inset 0 0 0 1px ${preset.accent}33`,
                    }}
                  >
                    <span style={{ backgroundColor: preset.accent }} />
                    <span style={{ backgroundColor: preset.textColor, opacity: 0.9 }} />
                    <span style={{ backgroundColor: 'rgba(255, 255, 255, 0.76)' }} />
                  </div>
                  <strong>{preset.name}</strong>
                  <p>{preset.tone}</p>
                </button>
              ))}
            </div>

            <div className="notice-preview settings-save-card">
              <span className="mini-label">저장된 설정</span>
              <strong>{activeRoomTheme.name}</strong>
              <p>테마와 운영 옵션은 저장되어 다음 접속 때도 그대로 유지됩니다.</p>
            </div>

            <div className="settings-option-grid">
              <section className="settings-option-group">
                <span className="mini-label">배너 스타일</span>
                <div className="settings-chip-row">
                  {[
                    ['focus', '포커스'],
                    ['soft', '소프트'],
                    ['broadcast', '브로드캐스트'],
                  ].map(([value, label]) => (
                    <button
                      className={bannerStyle === value ? 'settings-chip active' : 'settings-chip'}
                      key={value}
                      onClick={() => setBannerStyle(value as BannerStyle)}
                      type="button"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </section>

              <section className="settings-option-group">
                <span className="mini-label">버튼 스타일</span>
                <div className="settings-chip-row">
                  {[
                    ['rounded', '라운드'],
                    ['solid', '솔리드'],
                    ['outlined', '아웃라인'],
                  ].map(([value, label]) => (
                    <button
                      className={buttonStyle === value ? 'settings-chip active' : 'settings-chip'}
                      key={value}
                      onClick={() => setButtonStyle(value as ButtonStyle)}
                      type="button"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </section>

              <section className="settings-option-group">
                <span className="mini-label">카드 밀도</span>
                <div className="settings-chip-row">
                  {[
                    ['compact', '컴팩트'],
                    ['comfortable', '기본'],
                    ['airy', '여유'],
                  ].map(([value, label]) => (
                    <button
                      className={cardDensity === value ? 'settings-chip active' : 'settings-chip'}
                      key={value}
                      onClick={() => setCardDensity(value as CardDensity)}
                      type="button"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </section>
            </div>
          </section>

          <section className="editor-card accent">
            <span className="card-kicker">미리보기</span>
            <div
              className="settings-room-preview"
              style={{
                background: activeRoomTheme.heroBackground,
                color: activeRoomTheme.textColor,
              }}
            >
              <div className="creator-chip settings-preview-chip">
                <span className="chip-avatar" style={{ background: activeRoomTheme.accent, color: '#fffaf1' }}>
                  TV
                </span>
                <div>
                  <strong>{connectedChannel?.channel_title ?? '침착한개발자TV'}</strong>
                  <span style={{ color: activeRoomTheme.mutedColor }}>
                    {connectedChannel?.room_name ?? '공식 팬방'} · {activeRoomTheme.name}
                  </span>
                </div>
              </div>
              <div className="preview-bubbles">
                <div
                  className="preview-bubble"
                  style={{ background: activeRoomTheme.panelBackground, color: activeRoomTheme.textColor }}
                >
                  오늘 업로드 알림이 자동 등록됩니다.
                </div>
                <div
                  className="preview-bubble"
                  style={{ background: activeRoomTheme.panelBackground, color: activeRoomTheme.textColor }}
                >
                  이벤트와 굿즈 카드도 같은 톤으로 이어집니다.
                </div>
                <div
                  className="preview-bubble strong"
                  style={{
                    background: activeRoomTheme.accent,
                    color: activeRoomTheme.id === 'midnight-gold' ? '#1b2130' : '#fffaf1',
                  }}
                >
                  팬 입장 전 첫 인상을 여기서 결정합니다.
                </div>
              </div>
            </div>

            <div className="room-form-preview settings-meta-list">
              <label>
                채널 이름
                <div className="field">{connectedChannel?.channel_title ?? '침착한개발자TV'}</div>
              </label>
              <label>
                팬방 주소
                <div className="field muted">influencehub.io/room/{connectedChannel?.room_slug ?? 'devtv'}</div>
              </label>
              <label>
                적용 테마
                <div className="field multiline">
                  {activeRoomTheme.name} · {activeRoomTheme.tone}
                </div>
              </label>
              <label>
                운영 프리셋
                <div className="field multiline">
                  배너 {bannerStyle} · 버튼 {buttonStyle} · 카드 {cardDensity}
                </div>
              </label>
            </div>
          </section>
        </div>
      </div>

      <section className="scene-card dark-card settings-platform-panel">
        <div className="panel-head">
          <div>
            <span className="card-kicker">배포 채널 관리</span>
            <h3>확장 가능한 배포 채널</h3>
          </div>
        </div>

        <div className="platform-management-grid">
          <div className="platform-grid">
            {platformCatalog.map((platform) => {
              const state = platformSetup[platform.name]

              return (
                <button
                  className={
                    platform.name === selectedPlatformName
                      ? `platform-card ${platform.tone} active-selection`
                      : `platform-card ${platform.tone}`
                  }
                  key={platform.name}
                  onClick={() => setSelectedPlatformName(platform.name)}
                  type="button"
                >
                  <span className="platform-status">{state?.statusLabel ?? platform.status}</span>
                  <strong>{platform.name}</strong>
                  <p>{platform.detail}</p>
                </button>
              )
            })}
          </div>

          <section className="platform-config-panel">
            <div className="panel-head">
              <div>
                <span className="card-kicker">선택된 채널</span>
                <h3>{selectedPlatformName} 연결 설정</h3>
              </div>
              <span className={selectedPlatformConfig.isEnabled ? 'status-badge' : 'status-badge muted'}>
                {selectedPlatformConfig.statusLabel}
              </span>
            </div>

            <div className="credential-grid">
              <div className="field-block">
                <span className="mini-label">{selectedPlatformLabels.client}</span>
                <input
                  className="text-input"
                  value={selectedPlatformConfig.clientValue}
                  onChange={(event) =>
                    updatePlatformSetup(selectedPlatformName, { clientValue: event.target.value })
                  }
                  placeholder={`${selectedPlatformName} ${selectedPlatformLabels.client}`}
                />
              </div>
              <div className="field-block">
                <span className="mini-label">{selectedPlatformLabels.secret}</span>
                <input
                  className="text-input"
                  value={selectedPlatformConfig.secretValue}
                  onChange={(event) =>
                    updatePlatformSetup(selectedPlatformName, { secretValue: event.target.value })
                  }
                  placeholder={`${selectedPlatformName} ${selectedPlatformLabels.secret}`}
                />
              </div>
            </div>

            <div className="chip-row">
              <span className="info-chip">
                {selectedPlatformConfig.isEnabled ? '현재 활성화됨' : '현재 비활성화'}
              </span>
              <span className="info-chip">
                {selectedPlatformConfig.supportsVideo ? '영상 배포 가능' : '영상 API 미지원'}
              </span>
              <span className="info-chip">
                {selectedPlatformConfig.supportsPost ? '게시글 배포 가능' : '게시글 API 미지원'}
              </span>
            </div>

            <div className="inline-actions">
              <button className="secondary-action" onClick={handleTestPlatformConnection} type="button">
                연결 테스트
              </button>
              <button className="primary-action" onClick={handleTogglePlatformActivation} type="button">
                {selectedPlatformConfig.isEnabled ? '비활성화' : '활성화'}
              </button>
            </div>

            <div className="notice-preview compact-highlight">
              <span className="mini-label">운영 메모</span>
              <strong>{selectedPlatformName}은 필요한 값이 들어간 뒤에만 활성화하세요.</strong>
              <p>콘텐츠 배포 센터에서는 여기서 활성화한 채널만 선택해서 한번에 배포할 수 있습니다.</p>
            </div>
          </section>
        </div>
      </section>
    </section>
  )

  const renderFeatures = () => (
    <section className={`scene-panel creator-workspace ${creatorExperienceClasses}`}>
      <div className="scene-copy">
        <span className="section-label">MODULE SETUP</span>
        <h2>운영 방식에 맞는 기능 선택</h2>
        <p>
          필요한 기능만 남겨 대시보드와 팬 화면을 더 선명하게 구성합니다.
        </p>

        <div className="selection-summary">
          <span className="mini-label">현재 활성화</span>
          <strong>{selectedFeatures.length}개 모듈 선택됨</strong>
          <p>{selectedFeatures.join(' · ')}</p>
        </div>

        <div className="inline-actions">
          <button className="primary-action" onClick={goToDashboard}>
            대시보드 시작하기
          </button>
          <button className="secondary-action" onClick={() => setCurrentView('room')}>
            팬방 설정으로
          </button>
        </div>
      </div>

      <div className="scene-card creator-control-card">
        <div className="feature-grid">
          {featureCatalog.map((feature) => {
            const enabled = selectedFeatures.includes(feature.name)

            return (
              <button
                className={enabled ? 'feature-select-card enabled' : 'feature-select-card'}
                key={feature.name}
                onClick={() => toggleFeature(feature.name)}
              >
                <div className="feature-card-top">
                  <span className="mini-label">{enabled ? '활성화됨' : '비활성'}</span>
                  <span className={enabled ? 'toggle on' : 'toggle'}>
                    {enabled ? 'ON' : 'OFF'}
                  </span>
                </div>
                <strong>{feature.name}</strong>
                <p>{feature.description}</p>
                <span className="feature-metric">{feature.liveMetric}</span>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )

  const renderDashboard = () => (
    <section className={`dashboard-shell creator-workspace ${creatorExperienceClasses}`}>
      {renderDashboardSidebar('overview')}

      <div className="dashboard-main">
        <div className="metrics-grid">
          {[
            ...dashboardMetrics.slice(0, 3),
            {
              label: '초대된 팬 수',
              value: inviteDashboard ? `${inviteDashboard.total_join_count}` : '842',
              change: inviteDashboard
                ? `멀티 팬 ${inviteDashboard.multi_room_fan_count}명`
                : '링크 전환율 37%',
            },
          ].map((metric) => (
            <article className="metric-card" key={metric.label}>
              <span className="mini-label">{metric.label}</span>
              <strong>{metric.value}</strong>
              <span className="metric-change">{metric.change}</span>
            </article>
          ))}
        </div>

        <div className="tool-grid">
          {toolCards.map((card) => (
            <button className="tool-card" key={card.id} onClick={() => setCurrentView(card.id)}>
              <span className="mini-label">{card.badge}</span>
              <strong>{card.title}</strong>
              <p>{card.text}</p>
            </button>
          ))}
        </div>

        <div className="dashboard-panels">
          <section className="timeline-panel">
            <div className="panel-head">
              <div>
                <span className="card-kicker">실시간 운영 로그</span>
                <h3>오늘 자동화된 흐름</h3>
              </div>
              <button className="tiny-action" onClick={() => setCurrentView('features')}>
                모듈 수정
              </button>
            </div>

            <div className="activity-list">
              {activityFeed.map((item) => (
                <article className="activity-card" key={item.title}>
                  <span className="activity-time">{item.time}</span>
                  <strong>{item.title}</strong>
                  <p>{item.body}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="summary-panel">
            <div className="panel-head">
              <div>
                <span className="card-kicker">현재 팬방 구성</span>
                <h3>선택된 모듈</h3>
              </div>
            </div>

            <div className="selected-module-list">
              {selectedFeatures.map((feature) => (
                <div className="selected-module" key={feature}>
                  <strong>{feature}</strong>
                  <span>운영 중</span>
                </div>
              ))}
            </div>

            <div className="notice-preview">
              <span className="mini-label">자동 공지 미리보기</span>
              <strong>새 영상 업로드: 팬방 공지 초안 생성 완료</strong>
              <p>
                YouTube 업로드 감지 후 제목, 썸네일, 링크가 반영된 공지 카드가
                만들어졌습니다.
              </p>
            </div>
          </section>
        </div>

        <div className="dashboard-panels">
          <section className="timeline-panel">
            <div className="panel-head">
              <div>
                <span className="card-kicker">팬 초대 링크</span>
                <h3>초대된 팬 유입 추적</h3>
              </div>
            </div>

            <div className="activity-list">
              {(inviteDashboard?.invite_links.length
                ? inviteDashboard.invite_links.map((link) => ({
                    ...link,
                  }))
                : invitePerformance
              ).map((item) => {
                if ('invite_link_id' in item) {
                  return (
                    <article className="activity-card" key={item.invite_link_id}>
                      <span className="activity-time">{item.invite_code}</span>
                      <strong>
                        {item.title} {item.active ? '' : '(비활성)'}
                      </strong>
                      <p>
                        {item.source_label} · 열림 {item.open_count}명 · 가입 {item.join_count}명
                      </p>
                      <div className="inline-actions compact-actions">
                        <button
                          className="tiny-action"
                          onClick={() => void handleCopyInviteLink(item.invite_url)}
                        >
                          링크 복사
                        </button>
                        {item.active ? (
                          <button
                            className="tiny-action"
                            onClick={() => void handleDeactivateInviteLink(item.invite_link_id)}
                          >
                            비활성화
                          </button>
                        ) : null}
                      </div>
                    </article>
                  )
                }

                return (
                  <article className="activity-card" key={item.title}>
                    <span className="activity-time">{item.time}</span>
                    <strong>{item.title}</strong>
                    <p>{item.body}</p>
                  </article>
                )
              })}
            </div>
          </section>

          <section className="summary-panel">
            <div className="panel-head">
              <div>
                <span className="card-kicker">팬 초대 퍼널</span>
                <h3>링크 성과 요약</h3>
              </div>
            </div>

            <div className="selected-module-list">
              {(inviteDashboard
                ? [
                    {
                      label: '초대 링크 오픈',
                      value: `${inviteDashboard.total_open_count}`,
                      meta: '전체 링크 합산',
                    },
                    {
                      label: '팬 가입 완료',
                      value: `${inviteDashboard.total_join_count}`,
                      meta: '초대 링크 가입 수',
                    },
                    {
                      label: '다른 팬방 추가 가입',
                      value: `${inviteDashboard.multi_room_fan_count}`,
                      meta: '멀티 팬 계정',
                    },
                  ]
                : inviteFunnelCards
              ).map((card) => (
                <div className="selected-module" key={card.label}>
                  <div>
                    <strong>{card.label}</strong>
                    <span>{card.meta}</span>
                  </div>
                  <strong>{card.value}</strong>
                </div>
              ))}
            </div>

            <div className="notice-preview">
              <span className="mini-label">초대 링크 예시</span>
              <strong>
                {inviteDashboard?.invite_links[0]?.invite_url ?? 'influencehub.app/invite/salt-toast-live'}
              </strong>
              <p>
                유튜버가 영상 설명란이나 라이브 고정 댓글에 이 링크를 올리면, 팬은
                해당 링크로 들어와 팬 가입을 완료하고 바로 팬방에 입장합니다.
              </p>
            </div>

            <div className="form-stack">
              <div className="field-block">
                <span className="mini-label">링크 제목</span>
                <input
                  className="text-input"
                  value={inviteTitle}
                  onChange={(event) => setInviteTitle(event.target.value)}
                  placeholder="예: 라이브 고정 댓글 초대"
                />
              </div>
              <div className="chip-row">
                {[
                  ['영상 설명란 초대', '영상 설명란'],
                  ['라이브 고정 댓글 초대', '라이브 고정 댓글'],
                  ['커뮤니티 탭 초대', '커뮤니티 탭'],
                ].map(([title, source]) => (
                  <button
                    className="info-chip interactive-chip"
                    key={source}
                    onClick={() => {
                      setInviteTitle(title)
                      setInviteSourceLabel(source)
                    }}
                    type="button"
                  >
                    {source}
                  </button>
                ))}
              </div>
              <div className="field-block">
                <span className="mini-label">유입 위치</span>
                <input
                  className="text-input"
                  value={inviteSourceLabel}
                  onChange={(event) => setInviteSourceLabel(event.target.value)}
                  placeholder="예: 영상 설명란"
                />
              </div>
              <div className="inline-actions">
                <button className="primary-action" onClick={() => void handleCreateInviteLink()}>
                  {isCreatingInvite ? '링크 생성 중...' : '초대 링크 만들기'}
                </button>
                <span className="helper-copy">{inviteStatus}</span>
              </div>
            </div>
          </section>
        </div>

        <div className="dashboard-panels">
          <section className="timeline-panel">
            <div className="panel-head">
              <div>
                <span className="card-kicker">팬 분류 보드</span>
                <h3>VIP · 큰손 · 침철단 같은 코어 팬 관리</h3>
              </div>
            </div>

            <div className="activity-list">
              {(fanMembers.length
                ? fanMembers
                : [
                    {
                      membership_id: 0,
                      fan_email: 'corefan@example.com',
                      fan_nickname: '침철단 1호',
                      joined_via: '라이브 고정 댓글',
                      tier: 'CORE_CREW',
                    },
                  ]
              ).map((fanMember) => (
                <article className="activity-card" key={fanMember.membership_id || fanMember.fan_email}>
                  <span className="activity-time">{fanMember.joined_via}</span>
                  <strong>
                    {fanMember.fan_nickname} · {fanMember.tier}
                  </strong>
                  <p>{fanMember.fan_email}</p>
                  <div className="inline-actions compact-actions">
                    {['GENERAL', 'VIP', 'BIG_SPENDER', 'CORE_CREW'].map((tier) => (
                      <button
                        className="tiny-action"
                        disabled={fanMember.membership_id === 0}
                        key={tier}
                        onClick={() => void handleUpdateFanTier(fanMember.membership_id, tier)}
                      >
                        {tier}
                      </button>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="summary-panel">
            <div className="panel-head">
              <div>
                <span className="card-kicker">등급 운영 메모</span>
                <h3>팬 레벨링 기준</h3>
              </div>
            </div>

            <div className="selected-module-list">
              {[
                ['GENERAL', '기본 팬'],
                ['VIP', '자주 참여하는 팬'],
                ['BIG_SPENDER', '굿즈/후원 전환이 큰 팬'],
                ['CORE_CREW', '침철단처럼 이름 붙인 핵심 팬 그룹'],
              ].map(([label, meta]) => (
                <div className="selected-module" key={label}>
                  <strong>{label}</strong>
                  <span>{meta}</span>
                </div>
              ))}
            </div>

            <div className="notice-preview">
              <span className="mini-label">최근 등급 변경</span>
              <strong>{fanTierStatus}</strong>
              <p>
                팬 등급을 나누면 이벤트 우선 초대, 굿즈 선오픈, 멤버십 공지 대상을 쉽게
                분리할 수 있습니다.
              </p>
            </div>
          </section>
        </div>
      </div>
    </section>
  )

  const renderDashboardSidebar = (activeSection: DashboardSection) => (
    <div className="dashboard-sidebar">
      <span className="section-label">INFLUENCER ROOM</span>
      <h2>운영 대시보드</h2>
      <p>메뉴는 고정하고, 오른쪽 작업 패널만 바뀌게 정리했습니다.</p>

      <div className="sidebar-menu">
        <button
          className={activeSection === 'overview' ? 'sidebar-link active' : 'sidebar-link'}
          onClick={() => setCurrentView('dashboard')}
        >
          개요
        </button>
        <button
          className={activeSection === 'content' ? 'sidebar-link active' : 'sidebar-link'}
          onClick={() => setCurrentView('content')}
        >
          콘텐츠 배포
        </button>
        <button
          className={activeSection === 'community' ? 'sidebar-link active' : 'sidebar-link'}
          onClick={() => setCurrentView('community')}
        >
          팬 커뮤니티
        </button>
        <button
          className={activeSection === 'events' ? 'sidebar-link active' : 'sidebar-link'}
          onClick={() => setCurrentView('events')}
        >
          이벤트 운영
        </button>
        <button
          className={activeSection === 'store' ? 'sidebar-link active' : 'sidebar-link'}
          onClick={() => setCurrentView('store')}
        >
          굿즈 관리
        </button>
        <button className="sidebar-link" onClick={() => setCurrentView('fan')}>
          팬 화면 보기
        </button>
      </div>
    </div>
  )

  const renderContentMain = () => (
    <section className={`studio-shell creator-workspace ${creatorExperienceClasses}`}>
      <div className="studio-header">
        <div>
          <span className="section-label">PUBLISHING STUDIO</span>
          <h2>콘텐츠 배포 센터</h2>
          <p>
            유튜브를 먼저 연결하고, 나중에 다른 플랫폼도 같은 업로드 흐름에
            붙일 수 있게 설계한 멀티 배포 센터입니다.
          </p>
        </div>
        <div className="inline-actions compact">
          <button className="secondary-action" onClick={() => setCurrentView('fan')}>
            팬 화면 미리보기
          </button>
        </div>
      </div>

      <div className="studio-layout">
        <section className="studio-panel dark-surface">
          <div className="panel-head">
            <div>
              <span className="card-kicker">유튜브 우선 연동</span>
              <h3>YouTube 채널 연결</h3>
            </div>
            <span className="status-badge">Connected</span>
          </div>

          <div className="integration-stack">
            <article className="integration-hero">
              <span className="mini-label">등록된 채널</span>
              {connectedChannel ? (
                <>
                  <strong>{connectedChannel.channel_title}</strong>
                  <p>
                    구독자 {connectedChannel.subscriber_count}명 · 팬방 `{connectedChannel.room_name}`에
                    연결된 크리에이터 채널입니다.
                  </p>
                </>
              ) : (
                <>
                  <strong>침착한개발자TV · @devtv</strong>
                  <p>
                    Google OAuth 연결과 YouTube Data API 설정이 끝난 상태입니다.
                    업로드용 권한과 공개 상태 기본값도 저장돼 있습니다.
                  </p>
                </>
              )}
            </article>

            <article className="channel-import-card">
              <span className="mini-label">채널 불러오기 결과</span>
              {connectedChannel ? (
                <>
                  <strong>
                    {connectedChannel.channel_title}{' '}
                    <span>{connectedChannel.subscriber_count} subscribers</span>
                  </strong>
                  <p>{connectedChannel.channel_description || '채널 설명이 아직 비어 있습니다.'}</p>
                </>
              ) : (
                <>
                  <strong>
                    {importedChannelPreview.title} <span>{importedChannelPreview.handle}</span>
                  </strong>
                  <p>{importedChannelPreview.description}</p>
                </>
              )}
            </article>

            {connectedChannel ? (
              <div className="channel-facts-grid">
                <article className="detail-card">
                  <span className="mini-label">채널 ID</span>
                  <strong>{connectedChannel.channel_id}</strong>
                  <p>Google 로그인 이후 선택된 실제 YouTube 채널 식별자입니다.</p>
                </article>
                <article className="detail-card">
                  <span className="mini-label">팬방 슬러그</span>
                  <strong>{connectedChannel.room_slug}</strong>
                  <p>채널명 기준으로 생성된 크리에이터 팬방 주소입니다.</p>
                </article>
              </div>
            ) : null}

            <div className="credential-grid">
              <div className="field-block">
                <span className="mini-label">Client ID</span>
                <div className="field masked">yt-client-8f3c••••••••••</div>
              </div>
              <div className="field-block">
                <span className="mini-label">API Key</span>
                <div className="field masked">AIzaSyD9••••••••••••••••</div>
              </div>
            </div>

            <div className="chip-row">
              <span className="info-chip">Upload API 연결</span>
              <span className="info-chip">기본 공개값: 예약</span>
              <span className="info-chip">팬방 공지 연동</span>
              <span className="info-chip">푸시 발송 ON</span>
            </div>

            <div className="inline-actions">
              {!isCreatorLoggedIn ? (
                <button className="primary-action" onClick={() => void startCreatorGoogleLogin()}>
                  {isStartingGoogleLogin ? 'Google로 이동 중...' : '구글 로그인 다시 하기'}
                </button>
              ) : null}
              <button className="secondary-action small" onClick={() => void loadLatestConnection()}>
                {isLoadingChannel ? '채널 불러오는 중...' : '내 채널 다시 불러오기'}
              </button>
              {connectedChannel ? (
                <span className="helper-copy">
                  팬방 `{connectedChannel.room_name}`과 연결된 최신 채널을 기준으로 업로드합니다.
                </span>
              ) : (
                <span className="helper-copy">아직 프론트에 채널 정보를 불러오지 않았습니다.</span>
              )}
            </div>
          </div>
        </section>

        <section className="studio-panel">
          <div className="panel-head">
            <div>
              <span className="card-kicker">업로드 한번으로 실행</span>
              <h3>자동 배포 플로우</h3>
            </div>
          </div>

          <div className="autopublish-list">
            {youtubeIntegrationSteps.map((step, index) => (
              <article className="autopublish-card" key={step.title}>
                <span className="autopublish-index">0{index + 1}</span>
                <div>
                  <strong>{step.title}</strong>
                  <p>{step.body}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      <div className="composer-switch-row">
        <button
          className={publishComposerMode === 'video' ? 'privacy-toggle active' : 'privacy-toggle'}
          onClick={() => setPublishComposerMode('video')}
          type="button"
        >
          영상 배포
        </button>
        <button
          className={publishComposerMode === 'post' ? 'privacy-toggle active' : 'privacy-toggle'}
          onClick={() => setPublishComposerMode('post')}
          type="button"
        >
          유튜브 글
        </button>
      </div>

      <section className="studio-panel">
        <div className="panel-head">
          <div>
            <span className="card-kicker">배포 대상 선택</span>
            <h3>설정된 채널 중에서 한번에 배포하기</h3>
          </div>
        </div>

        {publishablePlatforms.length > 0 ? (
          <>
            <div className="platform-grid">
              {publishablePlatforms.map((platform) => (
                <button
                  className={
                    selectedPublishPlatforms.includes(platform.name)
                      ? `platform-card ${platform.tone} active-selection`
                      : `platform-card ${platform.tone}`
                  }
                  key={`publish-${platform.name}`}
                  onClick={() => togglePublishPlatform(platform.name)}
                  type="button"
                >
                  <span className="platform-status">
                    {selectedPublishPlatforms.includes(platform.name) ? 'Selected' : 'Ready'}
                  </span>
                  <strong>{platform.name}</strong>
                  <p>
                    {publishComposerMode === 'video'
                      ? platform.supportsVideo
                        ? '영상 배포 가능'
                        : '영상 배포 미지원'
                      : platform.supportsPost
                        ? '게시글/알림 배포 가능'
                        : '게시글 배포 미지원'}
                  </p>
                </button>
              ))}
            </div>

            <div className="chip-row">
              <span className="info-chip">선택됨 {selectedPublishPlatforms.length}개</span>
              <span className="info-chip">
                {selectedPublishPlatforms.length > 0
                  ? selectedPublishPlatforms.join(' · ')
                  : '최소 1개 채널 선택'}
              </span>
            </div>
          </>
        ) : (
          <div className="notice-preview compact-highlight">
            <span className="mini-label">배포 채널 없음</span>
            <strong>현재 이 타입으로 배포 가능한 활성 채널이 없습니다.</strong>
            <p>설정에서 플랫폼을 활성화하면 콘텐츠 배포 센터에서 선택해서 한번에 배포할 수 있습니다.</p>
          </div>
        )}
      </section>

      <div className="split-grid">
        <section className="studio-panel">
          <div className="panel-head">
            <div>
              <span className="card-kicker">인플루언스허브 업로드</span>
              <h3>{publishComposerMode === 'video' ? '오늘의 메인 영상' : '유튜브 글 초안과 댓글'}</h3>
            </div>
            <span className="status-badge">{publishComposerMode === 'video' ? 'Queued' : 'Draft Ready'}</span>
          </div>

          <div className="form-stack">
            {publishComposerMode === 'video' ? (
              <>
                <div className="field-block">
                  <span className="mini-label">제목</span>
                  <input
                    className="text-input"
                    value={uploadTitle}
                    onChange={(event) => setUploadTitle(event.target.value)}
                    placeholder="영상 제목을 입력하세요"
                  />
                </div>
                <div className="field-block">
                  <span className="mini-label">설명란</span>
                  <textarea
                    className="text-area"
                    value={uploadDescription}
                    onChange={(event) => setUploadDescription(event.target.value)}
                    placeholder="영상 설명을 입력하세요"
                  />
                </div>
                <div className="field-block">
                  <span className="mini-label">영상 파일</span>
                  <label className="upload-dropzone">
                    <input accept="video/mp4" className="file-input" onChange={handleFileChange} type="file" />
                    <strong>{selectedFile ? selectedFile.name : 'mp4 파일 선택'}</strong>
                    <span>
                      {selectedFile
                        ? `${(selectedFile.size / 1024 / 1024).toFixed(1)}MB · 업로드 준비 완료`
                        : '260MB 안팎 대용량 영상도 바로 전송할 수 있습니다.'}
                    </span>
                  </label>
                </div>
                <div className="field-block">
                  <span className="mini-label">공개 범위</span>
                  <div className="privacy-toggle-row">
                    {(['private', 'unlisted', 'public'] as PrivacyStatus[]).map((option) => (
                      <button
                        className={privacyStatus === option ? 'privacy-toggle active' : 'privacy-toggle'}
                        key={option}
                        onClick={() => setPrivacyStatus(option)}
                        type="button"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="field-block">
                  <span className="mini-label">추가 옵션</span>
                  <button
                    className={useScheduledPublish ? 'privacy-toggle active' : 'privacy-toggle'}
                    onClick={() => setUseScheduledPublish((current) => !current)}
                    type="button"
                  >
                    {useScheduledPublish ? '예약 배포 사용 중' : '예약 배포 사용'}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="field-block">
                  <span className="mini-label">커뮤니티 글 제목</span>
                  <input
                    className="text-input"
                    value={postTitle}
                    onChange={(event) => setPostTitle(event.target.value)}
                    placeholder="유튜브 커뮤니티에 쓸 제목을 입력하세요"
                  />
                </div>
                <div className="field-block">
                  <span className="mini-label">커뮤니티 글 본문</span>
                  <textarea
                    className="text-area"
                    value={postBody}
                    onChange={(event) => setPostBody(event.target.value)}
                    placeholder="유튜브 커뮤니티 글 또는 고정 댓글에 쓸 내용을 적어보세요"
                  />
                </div>
                <div className="field-block">
                  <span className="mini-label">초안용 이미지</span>
                  <label className="upload-dropzone">
                    <input accept="image/*" className="file-input" onChange={handlePostImageChange} type="file" />
                    <strong>{selectedPostImage ? selectedPostImage.name : '이미지 파일 선택'}</strong>
                    <span>
                      {selectedPostImage
                        ? `${(selectedPostImage.size / 1024 / 1024).toFixed(1)}MB · 초안 준비 완료`
                        : '유튜브 커뮤니티 글에 함께 넣을 이미지 초안을 미리 확인할 수 있습니다.'}
                    </span>
                  </label>
                </div>
                <div className="field-block">
                  <span className="mini-label">댓글 연결 영상 URL</span>
                  <input
                    className="text-input"
                    value={commentTargetUrl}
                    onChange={(event) => setCommentTargetUrl(event.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                </div>
              </>
            )}
            {publishComposerMode === 'video' && useScheduledPublish ? (
              <div className="field-block">
                <span className="mini-label">예약 시간</span>
                <input
                  className="text-input"
                  type="datetime-local"
                  value={scheduledPublishAt}
                  onChange={(event) => setScheduledPublishAt(event.target.value)}
                />
              </div>
            ) : null}
            <div className="chip-row">
              {publishComposerMode === 'video' ? (
                <>
                  <span className="info-chip">업로드 파일 1개</span>
                  <span className="info-chip">썸네일 자동 첨부</span>
                  <span className="info-chip">공지 초안 자동 생성</span>
                </>
              ) : (
                <>
                  <span className="info-chip">커뮤니티 글 초안 복사</span>
                  <span className="info-chip">고정 댓글 바로 배포</span>
                  <span className="info-chip">최신 업로드 URL 자동 연결</span>
                </>
              )}
            </div>
            <div className="upload-action-row">
              {publishComposerMode === 'video' && useScheduledPublish ? (
                <button className="secondary-action" onClick={() => void handleSchedulePublish()} type="button">
                  예약 타임라인 등록
                </button>
              ) : null}
              <button
                className="primary-action"
                onClick={() => {
                  if (publishComposerMode === 'video') {
                    void handleUpload()
                    return
                  }
                  void handlePublishPost()
                }}
                type="button"
              >
                {publishComposerMode === 'video'
                  ? isUploading
                    ? '업로드 중...'
                    : 'YouTube 업로드'
                  : '커뮤니티 초안 복사'}
              </button>
              {publishComposerMode === 'post' ? (
                <button className="secondary-action" onClick={() => void handlePublishYoutubeComment()} type="button">
                  고정 댓글 배포
                </button>
              ) : null}
              <span className="helper-copy">
                {publishComposerMode === 'video'
                  ? uploadStatus
                  : `${postStatus}${commentStatus !== '아직 댓글 배포 전' ? ` · ${commentStatus}` : ''}`}
              </span>
            </div>
            {publishComposerMode === 'video' && useScheduledPublish ? (
              <span className="helper-copy">{scheduleStatus}</span>
            ) : null}
            {uploadError ? <p className="feedback-message error">{uploadError}</p> : null}
            {publishComposerMode === 'video' && uploadResult ? (
              <article className="upload-result-card">
                <span className="mini-label">업로드 결과</span>
                <strong>{uploadResult.title}</strong>
                <p>공개 상태: {uploadResult.privacy_status}</p>
                <p>자동 공지: {uploadResult.notice_title}</p>
                <a className="result-link" href={uploadResult.watch_url} rel="noreferrer" target="_blank">
                  유튜브에서 보기
                </a>
              </article>
            ) : null}
            {publishComposerMode === 'post' ? (
              <article className="upload-result-card">
                <span className="mini-label">유튜브 글 준비 상태</span>
                <strong>{postTitle.trim() || '게시글 제목 미입력'}</strong>
                <p>{postStatus}</p>
                <p>{selectedPostImage ? '이미지 초안 1장 준비 완료' : '텍스트만으로도 커뮤니티 글 초안 생성이 가능합니다.'}</p>
                {commentResult ? (
                  <a className="result-link" href={commentResult.commentUrl} rel="noreferrer" target="_blank">
                    배포된 댓글 보기
                  </a>
                ) : null}
              </article>
            ) : null}
          </div>
        </section>

        <section className="studio-panel">
          <div className="panel-head">
            <div>
              <span className="card-kicker">업로드 전 확인</span>
              <h3>{publishComposerMode === 'video' ? '미리보기와 체크' : '커뮤니티 초안 미리보기'}</h3>
            </div>
          </div>

          <div className="upload-preview-panel">
            <div className="upload-preview-stage">
              {publishComposerMode === 'video' && uploadPreviewUrl ? (
                <video className="upload-preview-video" controls preload="metadata" src={uploadPreviewUrl} />
              ) : null}
              {publishComposerMode === 'post' && postPreviewUrl ? (
                <div className="post-preview-stage">
                  <img alt={postTitle || '게시글 첨부 이미지'} className="post-preview-image" src={postPreviewUrl} />
                </div>
              ) : null}
              {(publishComposerMode === 'video' && !uploadPreviewUrl) ||
              (publishComposerMode === 'post' && !postPreviewUrl) ? (
                <div className="upload-preview-empty">
                  <strong>{publishComposerMode === 'video' ? '영상 미리보기' : '커뮤니티 글 이미지 초안'}</strong>
                  <p>
                    {publishComposerMode === 'video'
                      ? '파일을 고르면 여기서 업로드 전에 바로 확인할 수 있습니다.'
                      : '사진을 고르면 유튜브 커뮤니티에 올릴 이미지 초안을 먼저 볼 수 있습니다.'}
                  </p>
                </div>
              ) : null}
            </div>

            <div className="upload-checklist">
              {publishComposerMode === 'video' ? (
                <>
                  <article className="upload-check-card">
                    <span className="mini-label">업로드 제목</span>
                    <strong>{uploadTitle.trim() || '제목 미입력'}</strong>
                    <p>{uploadDescription.trim() ? '설명란 입력 완료' : '설명란을 더 적을 수 있습니다.'}</p>
                  </article>
                  <article className="upload-check-card">
                    <span className="mini-label">공개 범위</span>
                    <strong>{privacyStatus}</strong>
                    <p>
                      {privacyStatus === 'private'
                        ? '검수용 업로드에 적합'
                        : privacyStatus === 'unlisted'
                          ? '링크 공유용 업로드'
                          : '즉시 공개 업로드'}
                    </p>
                  </article>
                  {useScheduledPublish ? (
                    <article className="upload-check-card">
                      <span className="mini-label">예약 시간</span>
                      <strong>{scheduledPublishAt ? new Date(scheduledPublishAt).toLocaleString('ko-KR') : '미정'}</strong>
                      <p>예약 타임라인 등록 시 이 시간이 기준으로 저장됩니다.</p>
                    </article>
                  ) : null}
                  <article className="upload-check-card">
                    <span className="mini-label">파일 정보</span>
                    <strong>{selectedFile ? selectedFile.name : '파일 미선택'}</strong>
                    <p>
                      {selectedFile
                        ? `${(selectedFile.size / 1024 / 1024).toFixed(1)}MB · 업로드 준비 완료`
                        : 'mp4 파일을 먼저 선택하세요.'}
                    </p>
                  </article>
                </>
              ) : (
                <>
                  <article className="upload-check-card">
                    <span className="mini-label">커뮤니티 글 제목</span>
                    <strong>{postTitle.trim() || '제목 미입력'}</strong>
                    <p>{postBody.trim() ? '본문 입력 완료' : '본문을 더 적을 수 있습니다.'}</p>
                  </article>
                  <article className="upload-check-card">
                    <span className="mini-label">커뮤니티 글 요약</span>
                    <strong>{postBody.trim().slice(0, 26) || '본문 미입력'}</strong>
                    <p>{postBody.trim().length > 26 ? '유튜브 커뮤니티 글과 고정 댓글 초안으로 함께 활용합니다.' : '짧은 한 줄 공지도 바로 만들 수 있습니다.'}</p>
                  </article>
                  <article className="upload-check-card">
                    <span className="mini-label">댓글 연결 영상</span>
                    <strong>{commentTargetUrl.trim() || '영상 URL 미입력'}</strong>
                    <p>{commentTargetUrl.trim() ? '고정 댓글 배포 대상 영상이 연결되어 있습니다.' : '댓글을 달 YouTube 영상 URL을 넣어주세요.'}</p>
                  </article>
                  <article className="upload-check-card">
                    <span className="mini-label">초안 이미지</span>
                    <strong>{selectedPostImage ? selectedPostImage.name : '이미지 미선택'}</strong>
                    <p>
                      {selectedPostImage
                        ? `${(selectedPostImage.size / 1024 / 1024).toFixed(1)}MB · 초안 준비 완료`
                        : '사진 없이 텍스트 중심 커뮤니티 글 초안만 써도 됩니다.'}
                    </p>
                  </article>
                </>
              )}
            </div>
          </div>

          <div className="timeline-list">
            <div className="panel-head">
              <div>
                <span className="card-kicker">
                  {publishComposerMode === 'video' ? '발행 순서' : '유튜브 커뮤니티 초안'}
                </span>
                <h3>{publishComposerMode === 'video' ? '예약 타임라인' : '복사해서 바로 올릴 초안'}</h3>
              </div>
            </div>
            {publishComposerMode === 'video' ? (
              <>
                {contentTimeline.map((item) => (
                  <article className="timeline-row" key={item.title}>
                    <span className="timeline-time">{item.time}</span>
                    <div>
                      <strong>{item.title}</strong>
                      <p>{item.body}</p>
                    </div>
                  </article>
                ))}
                {publishHistory
                  .filter((job) => job.status === 'READY' || job.status === 'PROCESSING')
                  .slice(0, 4)
                  .map((job) => (
                    <article className="timeline-row" key={`scheduled-${job.publish_job_id}`}>
                      <span className="timeline-time">
                        {new Date(job.scheduled_at).toLocaleString('ko-KR', {
                          month: 'numeric',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      <div>
                        <strong>{job.title}</strong>
                        <p>{job.platform} · {job.status === 'READY' ? '예약 대기 중' : '처리 중'}</p>
                      </div>
                    </article>
                  ))}
              </>
            ) : (
              <article className="post-preview-card">
                {postPreviewUrl ? (
                  <img alt={postTitle || '게시글 미리보기'} className="post-preview-card-image" src={postPreviewUrl} />
                ) : null}
                <span className="fan-badge">DRAFT</span>
                <strong>{postTitle.trim() || '게시글 제목을 입력하세요'}</strong>
                <p>{postBody.trim() || '유튜브 커뮤니티에 올릴 본문 초안이 여기에 미리 보입니다.'}</p>
                <textarea className="text-area compact-preview" readOnly value={youtubeCommunityDraft} />
              </article>
            )}
          </div>

          <div className="timeline-list">
            <div className="panel-head">
              <div>
                <span className="card-kicker">
                  {publishComposerMode === 'video' ? '최근 발행 이력' : '댓글 배포 상태'}
                </span>
                <h3>{publishComposerMode === 'video' ? '업로드 기록' : '유튜브 반영 상태'}</h3>
              </div>
            </div>
            {publishComposerMode === 'video' ? (
              publishHistory.length > 0 ? (
                publishHistory.map((job) => (
                  <article className="timeline-row" key={job.publish_job_id}>
                    <span className="timeline-time">{job.platform}</span>
                    <div>
                      <strong>{job.title}</strong>
                      <p>
                        {job.status} · {new Date(job.created_at).toLocaleString('ko-KR')}
                      </p>
                      {job.target_url ? (
                        <a className="result-link" href={job.target_url} rel="noreferrer" target="_blank">
                          결과 보기
                        </a>
                      ) : null}
                    </div>
                  </article>
                ))
              ) : (
                <article className="timeline-row">
                  <span className="timeline-time">READY</span>
                  <div>
                    <strong>아직 업로드 이력이 없습니다</strong>
                    <p>첫 업로드를 실행하면 최근 발행 기록이 여기에 쌓입니다.</p>
                  </div>
                </article>
              )
            ) : (
              <article className="timeline-row">
                <span className="timeline-time">YT</span>
                <div>
                  <strong>{commentStatus}</strong>
                  <p>커뮤니티 글은 복사 후 유튜브 스튜디오에 올리고, 댓글은 여기서 바로 배포할 수 있습니다.</p>
                </div>
              </article>
            )}
          </div>
        </section>
      </div>

    </section>
  )

  const renderContent = () => (
    <section className="dashboard-shell">
      {renderDashboardSidebar('content')}
      <div className="dashboard-main">{renderContentMain()}</div>
    </section>
  )

  const renderPrivacy = () => (
    <section className="doc-shell">
      <div className="doc-hero">
        <span className="section-label">LEGAL</span>
        <h2>개인정보처리방침</h2>
        <p>
          InfluenceHub는 크리에이터 팬 커뮤니티 운영 서비스를 제공하기 위해 필요한
          최소한의 개인정보를 수집하고, 플랫폼 연동과 콘텐츠 배포 기능 제공 목적에
          한해 이용합니다.
        </p>
      </div>

      <div className="doc-card">
        <article className="doc-section">
          <h3>1. 수집 항목</h3>
          <p>
            회사는 회원가입 및 플랫폼 연동 과정에서 이메일, 닉네임, 프로필 이미지,
            연결된 외부 플랫폼 채널 정보, 채널 설명, 업로드 및 배포 이력, 서비스 이용 기록,
            접속 로그, 기기/브라우저 정보 등을 수집할 수 있습니다.
          </p>
        </article>
        <article className="doc-section">
          <h3>2. 이용 목적</h3>
          <p>
            회원 식별, 팬방 생성 및 운영, YouTube 등 외부 플랫폼 연동, 콘텐츠 자동 배포,
            공지 생성, 고객 문의 대응, 서비스 품질 개선, 통계 분석 및 부정 이용 방지를 위해
            개인정보를 이용합니다.
          </p>
        </article>
        <article className="doc-section">
          <h3>3. 보유 기간</h3>
          <p>
            회원 탈퇴 시 원칙적으로 지체 없이 삭제합니다. 다만 전자상거래, 소비자 보호,
            세금계산, 분쟁 대응 등 관련 법령에 따라 일정 기간 보관이 필요한 정보는 해당 기간 동안
            별도 분리 보관할 수 있습니다.
          </p>
        </article>
        <article className="doc-section">
          <h3>4. 제3자 제공 및 위탁</h3>
          <p>
            법령상 근거 또는 이용자 동의가 있는 경우를 제외하고 제3자에게 제공하지 않습니다.
            다만 YouTube, CHZZK 등 외부 플랫폼 연동, 클라우드 인프라 운영, 알림 발송, 파일 저장 등
            서비스 제공에 필요한 범위에서 처리 위탁 또는 API 호출이 발생할 수 있습니다.
          </p>
        </article>
        <article className="doc-section">
          <h3>5. 이용자 권리</h3>
          <p>
            이용자는 언제든지 개인정보 조회, 수정, 삭제, 처리 정지를 요청할 수 있으며,
            회사는 관련 법령에 따라 이를 처리합니다.
          </p>
        </article>
        <article className="doc-section">
          <h3>6. 문의처</h3>
          <p>
            개인정보와 관련한 문의, 열람, 정정, 삭제 요청은 서비스 내 문의 채널 또는 운영자 이메일을
            통해 접수할 수 있으며, 회사는 지체 없이 검토 후 답변합니다.
          </p>
        </article>
      </div>
    </section>
  )

  const renderTerms = () => (
    <section className="doc-shell">
      <div className="doc-hero">
        <span className="section-label">LEGAL</span>
        <h2>애플리케이션 서비스 약관</h2>
        <p>
          본 약관은 InfluenceHub가 제공하는 크리에이터 팬 커뮤니티 운영 서비스의 이용과
          관련하여 회사와 이용자 간 권리, 의무 및 책임 사항을 규정합니다.
        </p>
      </div>

      <div className="doc-card">
        <article className="doc-section">
          <h3>1. 서비스 제공 내용</h3>
          <p>
            팬방 생성, 플랫폼 연동, 콘텐츠 업로드, 자동 공지 생성, 이벤트 운영, 굿즈 운영 등
            크리에이터 운영 도구를 제공합니다.
          </p>
        </article>
        <article className="doc-section">
          <h3>2. 계정 관리</h3>
          <p>
            이용자는 정확하고 최신의 정보를 제공해야 하며, 계정, 비밀번호, 연동된 외부 플랫폼 권한
            관리 책임을 부담합니다.
          </p>
        </article>
        <article className="doc-section">
          <h3>3. 외부 플랫폼 정책 준수</h3>
          <p>
            YouTube, CHZZK, X, Instagram 등 외부 서비스 연동 시 각 플랫폼의 정책, API 이용
            약관, 인증 절차를 함께 준수해야 합니다.
          </p>
        </article>
        <article className="doc-section">
          <h3>4. 금지 행위</h3>
          <p>
            불법 콘텐츠 업로드, 타인 권리 침해, 허위 정보 등록, 비정상 자동화, 외부 플랫폼 정책
            위반 행위는 금지됩니다.
          </p>
        </article>
        <article className="doc-section">
          <h3>5. 서비스 변경 및 제한</h3>
          <p>
            운영상 필요, 외부 플랫폼 정책 변경, 기술적 장애 등의 사유로 서비스 일부가 변경되거나
            제한될 수 있습니다.
          </p>
        </article>
        <article className="doc-section">
          <h3>6. 책임 제한</h3>
          <p>
            회사는 외부 플랫폼 정책 변경, API 제한, 이용자 귀책 사유, 불가항력으로 인한 서비스 중단이나
            게시 실패에 대해 법령이 허용하는 범위 내에서 책임을 제한할 수 있습니다.
          </p>
        </article>
        <article className="doc-section">
          <h3>7. 약관의 개정</h3>
          <p>
            회사는 관련 법령을 위반하지 않는 범위에서 본 약관을 개정할 수 있으며, 중요한 변경이 있는 경우
            서비스 내 공지 또는 개별 통지를 통해 사전에 안내합니다.
          </p>
        </article>
      </div>
    </section>
  )

  const renderFooter = () => (
    <footer className="site-footer">
      <span>InfluenceHub Legal</span>
      <div className="legal-link-row">
        <button className="legal-link" onClick={() => setCurrentView('privacy')}>
          개인정보처리방침
        </button>
        <button className="legal-link" onClick={() => setCurrentView('terms')}>
          애플리케이션 서비스 약관
        </button>
      </div>
    </footer>
  )

  const renderCommunityMain = () => (
    <section className={`studio-shell creator-workspace ${creatorExperienceClasses}`}>
      <div className="studio-header">
        <div>
          <span className="section-label">COMMUNITY OPS</span>
          <h2>팬 커뮤니티 운영</h2>
          <p>공지, 자유글, 멤버십 전용 글을 같은 보드에서 관리하는 운영 화면입니다.</p>
        </div>
        <div className="inline-actions compact">
          <button className="primary-action" onClick={() => setCurrentView('fan')}>
            팬 홈에서 보기
          </button>
        </div>
      </div>

      <div className="split-grid">
        <section className="studio-panel">
          <div className="panel-head">
            <div>
              <span className="card-kicker">게시판 큐</span>
              <h3>오늘 반응 높은 글</h3>
            </div>
          </div>

          <div className="board-list">
            {(communityFeed.length > 0
              ? communityFeed.map((post) => ({
                  label: post.post_type,
                  title: post.title,
                  meta: `${post.author_name} · ${new Date(post.created_at).toLocaleString('ko-KR')}`,
                }))
              : communityPosts
            ).map((post) => (
              <article className="board-card" key={post.title}>
                <span className="board-label">{post.label}</span>
                <strong>{post.title}</strong>
                <p>{post.meta}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="studio-panel dark-surface">
          <div className="panel-head">
            <div>
              <span className="card-kicker">공지 작성기</span>
              <h3>업로드 후 자동 초안</h3>
            </div>
          </div>

          <div className="composer-card">
            <strong>오늘 밤 8시 본편 공개 + 팬방 Q&A</strong>
            <p>
              본편 공개 직후 Q&A 스레드가 열립니다. 영상 보고 바로 궁금한 점 남겨주세요.
            </p>
            <div className="chip-row">
              <span className="info-chip">상단 고정</span>
              <span className="info-chip">푸시 발송</span>
              <span className="info-chip">멤버십 우선 알림</span>
            </div>
          </div>
        </section>
      </div>
    </section>
  )

  const renderCommunity = () => (
    <section className="dashboard-shell">
      {renderDashboardSidebar('community')}
      <div className="dashboard-main">{renderCommunityMain()}</div>
    </section>
  )

  const renderEventsMain = () => (
    <section className={`studio-shell creator-workspace ${creatorExperienceClasses}`}>
      <div className="studio-header">
        <div>
          <span className="section-label">EVENT PLANNER</span>
          <h2>이벤트 운영 보드</h2>
          <p>참여 시작부터 인증 수집, 추첨 발표까지 한 번에 보이는 카드 흐름입니다.</p>
        </div>
        <div className="inline-actions compact">
          <button className="primary-action" onClick={() => setCurrentView('fan')}>
            팬 참여 화면 보기
          </button>
        </div>
      </div>

      <div className="three-grid">
        {(eventBoard.length > 0 ? eventBoard : eventSteps).map((step, index) => (
          <section className="studio-panel" key={step.title}>
            <span className="step-index">0{index + 1}</span>
            <h3>{step.title}</h3>
            <p>{step.detail}</p>
            <div className="mini-board soft">
              <strong>{index === 0 ? '노출 채널 3곳' : index === 1 ? '인증 482건' : '발표 대기 20명'}</strong>
              <p>{index === 0 ? '팬방 상단, 푸시, 커뮤니티 카드' : index === 1 ? '댓글/이미지/해시태그 자동 수집' : '당첨 카드와 DM 템플릿 생성 완료'}</p>
            </div>
          </section>
        ))}
      </div>
    </section>
  )

  const renderEvents = () => (
    <section className="dashboard-shell">
      {renderDashboardSidebar('events')}
      <div className="dashboard-main">{renderEventsMain()}</div>
    </section>
  )

  const renderStoreMain = () => (
    <section className={`studio-shell creator-workspace ${creatorExperienceClasses}`}>
      <div className="studio-header">
        <div>
          <span className="section-label">STORE BOARD</span>
          <h2>굿즈 스토어 보드</h2>
          <p>상품 드롭 일정, 재고, 알림 신청과 판매량을 운영자 시점에서 확인합니다.</p>
        </div>
        <div className="inline-actions compact">
          <button className="primary-action" onClick={() => setCurrentView('fan')}>
            팬 스토어 보기
          </button>
        </div>
      </div>

      <div className="split-grid">
        <section className="studio-panel">
          <div className="panel-head">
            <div>
              <span className="card-kicker">상품 상태</span>
              <h3>오늘 판매 라인업</h3>
            </div>
          </div>

          <div className="catalog-list">
            {(storeBoard.length > 0 ? storeBoard : storeItems).map((item) => (
              <article className="catalog-card" key={item.name}>
                <strong>{item.name}</strong>
                <span>{item.stock}</span>
                <p>{item.sales}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="studio-panel dark-surface">
          <div className="panel-head">
            <div>
              <span className="card-kicker">드롭 관리</span>
              <h3>다음 오픈 배너</h3>
            </div>
          </div>

          <div className="drop-hero">
            <strong>한정 후드 집업 tonight 10:00</strong>
            <p>팬방 방문자에게 먼저 노출되고, 알림 신청자에게는 15분 전 푸시가 갑니다.</p>
            <div className="chip-row">
              <span className="info-chip">재고 120</span>
              <span className="info-chip">알림 신청 684</span>
              <span className="info-chip">멤버십 선오픈</span>
            </div>
          </div>
        </section>
      </div>
    </section>
  )

  const renderStore = () => (
    <section className="dashboard-shell">
      {renderDashboardSidebar('store')}
      <div className="dashboard-main">{renderStoreMain()}</div>
    </section>
  )

  const renderFan = () =>
    !fanSession && !isCreatorLoggedIn ? (
      <section className="scene-panel light">
        <div className="scene-copy">
          <span className="section-label dark">FAN LOGIN</span>
          <h2>팬 로그인</h2>
          <p>가입한 팬방으로 다시 들어오세요.</p>

          <div className="highlight-card">
            <span className="mini-label">현재 상태</span>
            <strong>{fanStatus}</strong>
            <p>Google 계정으로 바로 이어집니다.</p>
          </div>

          <div className="inline-actions">
            <button className="primary-action" onClick={() => void startFanGoogleLogin()}>
              {isStartingFanGoogleLogin ? 'Google로 이동 중...' : 'Google로 팬 로그인'}
            </button>
            <button className="secondary-action dark" onClick={() => setCurrentView('invite')}>
              초대 링크로 가입하기
            </button>
          </div>
        </div>

        <div className="scene-card">
          <div className="card-header">
            <div>
              <span className="card-kicker">Google OAuth</span>
              <h2>Google로 계속하기</h2>
            </div>
            <span className="status-badge">Fan Auth</span>
          </div>

          <div className="detail-grid">
            <article className="detail-card">
              <span className="mini-label">처음 가입</span>
              <strong>초대 링크로 입장</strong>
              <p>Google 로그인 후 바로 팬방에 들어갑니다.</p>
            </article>
            <article className="detail-card">
              <span className="mini-label">다시 로그인</span>
              <strong>팬방 목록 복원</strong>
              <p>같은 Google 계정으로 다시 들어옵니다.</p>
            </article>
          </div>

          {fanError ? <p className="feedback-message error">{fanError}</p> : null}
        </div>
      </section>
    ) : (
      <section
        className={`fan-scene${isClassicRoomTheme ? ' fan-scene-classic' : ''} fan-theme-${selectedRoomTheme}`}
      >
      <div
        className="fan-hero"
        style={{
          background: activeRoomTheme.heroBackground,
          color: activeRoomTheme.textColor,
        }}
      >
        <div className="fan-hero-copy">
          <div className="fan-hero-topline">
            <span className="fan-hero-pill">FAN ROOM</span>
            <span className="fan-hero-meta">LIVE COMMUNITY PREVIEW</span>
          </div>

          <div className="creator-chip">
            <span className="chip-avatar" style={{ background: activeRoomTheme.accent, color: '#fffaf1' }}>TV</span>
            <div>
              <strong>{activeFanRoom.label}</strong>
              <span style={{ color: activeRoomTheme.mutedColor }}>{activeFanRoom.meta} · {activeFanRoom.joinedVia}</span>
            </div>
          </div>

          <div className="fan-hero-badges">
            <span>공지</span>
            <span>일정</span>
            <span>굿즈</span>
            <span>초대 링크</span>
          </div>
        </div>

        <div className="fan-hero-side">
          <div className="fan-hero-stat-card">
            <span className="mini-label">이번 주 팬 룸 포인트</span>
            <strong>{activeFanRoom.creator}</strong>
            <p>새 공지, 일정, 굿즈 드롭까지 같은 톤으로 이어집니다.</p>
          </div>

          <div className="fan-actions">
            <button className="primary-action" onClick={() => setCurrentView('home')}>
              {fanSession ? '팬 홈으로' : '인플루언서 홈으로'}
            </button>
            {fanSession ? (
              <button className="secondary-action" onClick={handleFanLogout}>
                팬 로그아웃
              </button>
            ) : isCreatorLoggedIn ? (
              <button className="secondary-action" onClick={() => setCurrentView('content')}>
                운영 화면으로
              </button>
            ) : (
              <button className="secondary-action" onClick={() => setCurrentView('home')}>
                홈으로
              </button>
            )}
          </div>
        </div>
      </div>

      <section className="fan-room-switcher">
        <div className="panel-head">
          <div>
            <span className="card-kicker">팬방 선택</span>
            <h3>가입한 팬방을 오가며 보기</h3>
          </div>
        </div>

        <div className="fan-room-grid">
          {displayedFanRooms.map((room) => (
            <button
              className={room.id === selectedFanRoomId ? 'fan-room-card active' : 'fan-room-card'}
              key={room.id}
              onClick={() => setSelectedFanRoomId(room.id)}
            >
              <span className="mini-label">{room.joinedVia}</span>
              <strong>{room.creator}</strong>
              <p>{room.label}</p>
            </button>
          ))}
        </div>
      </section>

      <div className="fan-tab-row">
        <button
          className={fanTab === 'feed' ? 'fan-tab active' : 'fan-tab'}
          onClick={() => setFanTab('feed')}
        >
          홈 피드
        </button>
        <button
          className={fanTab === 'calendar' ? 'fan-tab active' : 'fan-tab'}
          onClick={() => setFanTab('calendar')}
        >
          일정
        </button>
        <button
          className={fanTab === 'shop' ? 'fan-tab active' : 'fan-tab'}
          onClick={() => setFanTab('shop')}
        >
          굿즈
        </button>
      </div>

      <div className="fan-layout">
        <section className="fan-feed">
          <div className="panel-head">
            <div>
              <span className="card-kicker">팬 홈</span>
              <h3>
                {fanTab === 'feed'
                  ? '지금 뜨는 소식'
                  : fanTab === 'calendar'
                    ? '다가오는 일정'
                    : '팬방 한정 굿즈'}
              </h3>
            </div>
          </div>

          {fanTab === 'feed' && (
            <div className="fan-moment-list">
              {visibleFanFeed.map((moment) => (
                <article className="fan-moment-card" key={moment.title}>
                  {moment.imageUrl ? <img alt={moment.title} className="fan-moment-media" src={moment.imageUrl} /> : null}
                  <span className="fan-badge">{moment.badge}</span>
                  <strong>{moment.title}</strong>
                  <p>{moment.text}</p>
                </article>
              ))}
            </div>
          )}

          {fanTab === 'calendar' && (
            <div className="calendar-list">
              {fanCalendar.map((item) => (
                <article className="calendar-card" key={item.title}>
                  <span>{item.day}</span>
                  <strong>{item.title}</strong>
                </article>
              ))}
            </div>
          )}

          {fanTab === 'shop' && (
            <div className="catalog-list">
              {fanShopHighlights.map((item) => (
                <article className="catalog-card" key={item.title}>
                  <strong>{item.title}</strong>
                  <p>{item.detail}</p>
                </article>
              ))}
            </div>
          )}
        </section>

        <aside className="fan-side-panel">
          <div className="mini-board">
            <span className="mini-label">팬 입장 방식</span>
            <strong>{activeFanRoom.joinedVia}</strong>
            <p>
              팬은 초대 링크를 통해 들어오고, 가입이 끝나면 여러 크리에이터 팬방 중
              원하는 방을 선택해 이동할 수 있습니다.
            </p>
          </div>

          <div className="mini-board dark">
            <span className="mini-label">운영자 시점 연결</span>
            <strong>초대된 팬 수와 멀티 팬 가입이 같이 보임</strong>
            <p>
              대시보드에서 링크별 유입과 가입 수를 확인하고, 팬은 같은 계정으로 여러
              인플루언서 팬방에 입장합니다.
            </p>
          </div>
        </aside>
      </div>
    </section>
    )

  const renderInvite = () => (
    <section className="scene-panel light">
      <div className="scene-copy">
        <span className="section-label dark">INVITE</span>
        <h2>{inviteDetail ? `${inviteDetail.creator_name} 팬방 초대` : '팬 초대 링크'}</h2>
        <p>Google로 빠르게 가입하고 바로 입장합니다.</p>

        <div className="highlight-card">
          <span className="mini-label">현재 상태</span>
          <strong>{fanStatus}</strong>
          <p>{inviteDetail ? `${inviteDetail.source_label}에서 유입된 팬 초대입니다.` : '초대 링크를 불러오는 중입니다.'}</p>
        </div>

        {fanSession ? (
          <div className="notice-preview">
            <span className="mini-label">가입된 팬방</span>
            <strong>{fanSession.joined_rooms.length}개 팬방 가입됨</strong>
            <p>같은 팬 계정으로 여러 인플루언서 팬방을 선택해서 들어갈 수 있습니다.</p>
          </div>
        ) : null}
      </div>

      <div className="scene-card">
        <div className="card-header">
          <div>
            <span className="card-kicker">팬 가입</span>
            <h2>{inviteDetail?.room_name ?? '초대 링크 확인'}</h2>
          </div>
          <span className="status-badge">{inviteDetail ? 'Invite Live' : 'Loading'}</span>
        </div>

        {inviteDetail ? (
          <>
            <div className="detail-grid">
              <article className="detail-card">
                <span className="mini-label">방장</span>
                <strong>{inviteDetail.creator_name}</strong>
                <p>{inviteDetail.room_description}</p>
              </article>
              <article className="detail-card">
                <span className="mini-label">팬방 주소</span>
                <strong>{inviteDetail.room_slug}</strong>
                <p>가입 후 팬 목록에서 바로 선택해 다시 들어올 수 있습니다.</p>
              </article>
            </div>

            <div className="highlight-card compact-highlight">
              <span className="mini-label">가입 방식</span>
              <strong>Google 계정으로 바로 시작</strong>
              <p>한 번 가입하면 다음부터도 같은 계정으로 들어옵니다.</p>
            </div>

            <div className="inline-actions">
              <button className="primary-action" onClick={() => void handleFanJoin()}>
                {isJoiningInvite || isStartingFanGoogleLogin
                  ? 'Google로 이동 중...'
                  : 'Google로 팬 가입하고 입장'}
              </button>
              {fanSession ? (
                <button className="secondary-action dark" onClick={() => setCurrentView('fan')}>
                  가입한 팬방 보기
                </button>
              ) : null}
            </div>

            {fanError ? <p className="feedback-message error">{fanError}</p> : null}
          </>
        ) : (
          <p className="card-intro">초대 링크 정보를 불러오는 중입니다.</p>
        )}
      </div>
    </section>
  )

  const themedPageStyle = useRoomThemeSurface
    ? ({
        '--room-theme-hero': activeRoomTheme.heroBackground,
        '--room-theme-panel': activeRoomTheme.panelBackground,
        '--room-theme-accent': activeRoomTheme.accent,
        '--room-theme-text': activeRoomTheme.textColor,
        '--room-theme-muted': activeRoomTheme.mutedColor,
      } as CSSProperties)
    : undefined

  return (
    <main className={`page-shell app-shell${useRoomThemeSurface ? ' room-themed' : ''}`} style={themedPageStyle}>
      {renderHeader()}
      {currentView === 'home' && renderHome()}
      {currentView === 'signup' && renderSignup()}
      {currentView === 'room' &&
        (isCreatorLoggedIn
          ? renderRoom()
          : renderCreatorAccessGuard(
              '설정 화면은 인플루언서 전용입니다',
              '팬방 컬러, 채널 연결 정보, 운영 기본값은 실제 인플루언서 채널을 연결한 뒤에만 조정할 수 있습니다.',
            ))}
      {currentView === 'features' &&
        (isCreatorLoggedIn
          ? renderFeatures()
          : renderCreatorAccessGuard(
              '기능 설정은 크리에이터가 직접 정하는 영역입니다',
              '팬 커뮤니티, 이벤트, 멀티 업로드, 굿즈 모듈은 운영자만 켜고 끌 수 있게 분리했습니다.',
            ))}
      {currentView === 'dashboard' &&
        (isCreatorLoggedIn
          ? renderDashboard()
          : renderCreatorAccessGuard(
              '운영 대시보드는 로그인한 크리에이터에게만 열립니다',
              '초대 링크 성과, 팬 등급 분류, 매출과 운영 지표는 연결된 크리에이터 채널 기준으로만 보여야 자연스럽습니다.',
            ))}
      {currentView === 'content' &&
        (isCreatorLoggedIn
          ? renderContent()
          : renderCreatorAccessGuard(
              '콘텐츠 배포 센터는 크리에이터 로그인 후 사용할 수 있습니다',
              '파일 업로드, 유튜브 연동, 자동 공지 생성은 실제 연결된 채널이 있어야 의미가 있기 때문에 잠가두는 것이 맞습니다.',
            ))}
      {currentView === 'community' &&
        (isCreatorLoggedIn
          ? renderCommunity()
          : renderCreatorAccessGuard(
              '커뮤니티 운영 화면은 크리에이터만 볼 수 있습니다',
              '공지 작성, 멤버십 피드, 운영 큐는 팬 화면과 분리된 관리자 영역으로 유지했습니다.',
            ))}
      {currentView === 'events' &&
        (isCreatorLoggedIn
          ? renderEvents()
          : renderCreatorAccessGuard(
              '이벤트 운영 보드는 크리에이터 전용입니다',
              '참여 수집, 추첨 발표, 미션 운영은 팬 입장이 아니라 운영자 역할에서만 관리됩니다.',
            ))}
      {currentView === 'store' &&
        (isCreatorLoggedIn
          ? renderStore()
          : renderCreatorAccessGuard(
              '굿즈 관리 보드는 크리에이터 전용입니다',
              '상품 재고와 드롭 관리 정보는 팬에게 그대로 노출되기보다 운영자 보드에서 관리되는 편이 자연스럽습니다.',
            ))}
      {currentView === 'privacy' && renderPrivacy()}
      {currentView === 'terms' && renderTerms()}
      {currentView === 'invite' && renderInvite()}
      {currentView === 'fan' && renderFan()}
      {renderFooter()}
    </main>
  )
}

export default App
