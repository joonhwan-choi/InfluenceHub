import { useEffect, useState, type ChangeEvent } from 'react'
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

type SocialTone = 'google' | 'youtube' | 'kakao'
type FanTab = 'feed' | 'calendar' | 'shop'
type PrivacyStatus = 'private' | 'unlisted' | 'public'

type SocialButton = {
  label: string
  tone: SocialTone
  detail: string
}

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
}

type AuthUrlResponse = {
  auth_url: string
  redirect_uri: string
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

const statCards = [
  { label: '활성 팬방', value: '126', meta: '유튜버별 독립 공간' },
  { label: '자동 공지율', value: '92%', meta: '업로드와 연동' },
  { label: '평균 체류 시간', value: '18m', meta: '팬 콘텐츠 소비 지표' },
]

const socialButtons: SocialButton[] = [
  {
    label: 'Google로 시작',
    tone: 'google',
    detail: '구글 채널 운영자에게 익숙한 가장 빠른 시작 방식',
  },
  {
    label: 'YouTube로 연결',
    tone: 'youtube',
    detail: '채널 업로드 흐름과 팬방 공지를 직접 연결하는 진입',
  },
  {
    label: 'Kakao로 시작',
    tone: 'kakao',
    detail: '국내 팬 커뮤니티 전환에 유리한 간편 로그인',
  },
]

const onboardingSteps = [
  'SNS 로그인으로 크리에이터 회원가입',
  '내 채널 이름과 팬방 주소 생성',
  '원하는 기능 모듈만 ON',
  '첫 업로드 후 팬방 공지 자동 생성',
]

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

const platformCatalog = [
  {
    name: 'YouTube',
    status: 'Connected',
    detail: 'Data API + Upload API 키 등록 완료',
    tone: 'youtube',
  },
  {
    name: 'CHZZK',
    status: 'Ready',
    detail: '라이브 예고 공지와 팬방 연결 예정',
    tone: 'neutral',
  },
  {
    name: 'X',
    status: 'Planned',
    detail: '영상 공개 직후 짧은 알림 포스트 배포',
    tone: 'dark',
  },
  {
    name: 'Instagram',
    status: 'Planned',
    detail: '릴스/스토리용 짧은 티저 알림 배포',
    tone: 'instagram',
  },
  {
    name: 'Facebook',
    status: 'Planned',
    detail: '커뮤니티 링크 카드와 게시글 미러링',
    tone: 'facebook',
  },
  {
    name: 'TikTok',
    status: 'Research',
    detail: '클립형 숏폼 티저 업로드 자동화 검토',
    tone: 'dark',
  },
  {
    name: 'Threads',
    status: 'Planned',
    detail: '짧은 근황 알림과 공개 직후 반응 수집',
    tone: 'light',
  },
  {
    name: 'Discord',
    status: 'Ready',
    detail: 'Webhook 기반 커뮤니티 알림 채널 연동',
    tone: 'neutral',
  },
  {
    name: 'Twitch',
    status: 'Idea',
    detail: '라이브 전환 시 팬방 공지와 일정 동기화',
    tone: 'purple',
  },
]

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

const fanFeed = [
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

function App() {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'
  const [currentView, setCurrentView] = useState<View>('home')
  const [selectedSocial, setSelectedSocial] = useState<SocialTone>('youtube')
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
  const [privacyStatus, setPrivacyStatus] = useState<PrivacyStatus>('private')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadStatus, setUploadStatus] = useState('아직 업로드 전')
  const [uploadError, setUploadError] = useState('')
  const [isLoadingChannel, setIsLoadingChannel] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null)
  const [isStartingGoogleLogin, setIsStartingGoogleLogin] = useState(false)
  const [authFeedback, setAuthFeedback] = useState('아직 구글 로그인 전')
  const [isCreatorLoggedIn, setIsCreatorLoggedIn] = useState(false)
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
  const [fanEmail, setFanEmail] = useState('')
  const [fanNickname, setFanNickname] = useState('')
  const [fanStatus, setFanStatus] = useState('팬 로그인 전')
  const [fanError, setFanError] = useState('')
  const [isJoiningInvite, setIsJoiningInvite] = useState(false)

  const selectedSocialDetail =
    socialButtons.find((button) => button.tone === selectedSocial) ?? socialButtons[0]
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

  const toggleFeature = (featureName: string) => {
    setSelectedFeatures((current) =>
      current.includes(featureName)
        ? current.filter((name) => name !== featureName)
        : [...current, featureName],
    )
  }

  const goToDashboard = () => {
    if (selectedFeatures.length === 0) {
      setSelectedFeatures(['팬 커뮤니티'])
    }
    setCurrentView('dashboard')
  }

  const openCreatorStart = () => {
    setCurrentView(isCreatorLoggedIn ? 'content' : 'signup')
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
    ? 'Creator Control Room'
    : isFanLoggedIn
      ? 'Fan Membership Pass'
      : 'Creator Room OS'
  const headerRoleLabel = isCreatorLoggedIn ? 'CREATOR MODE' : isFanLoggedIn ? 'FAN MODE' : ''
  const headerTabs: Array<[View, string]> = isCreatorLoggedIn
    ? [
        ['home', '홈'],
        ['content', '내 채널'],
        ['room', '팬방 정보'],
        ['features', '기능 설정'],
        ['dashboard', '운영 대시보드'],
        ['fan', '팬 화면'],
      ]
    : isFanLoggedIn
      ? [
          ['home', '홈'],
          ['fan', '내 팬방'],
          ['invite', '초대 링크'],
          ['privacy', '개인정보'],
          ['terms', '약관'],
        ]
      : [
          ['home', '홈'],
          ['signup', '가입'],
          ['room', '팬방 생성'],
          ['features', '기능 설정'],
          ['dashboard', '운영 대시보드'],
          ['privacy', '개인정보'],
          ['terms', '약관'],
          ['fan', '팬 화면'],
        ]

  const persistCreatorSession = (sessionToken: string) => {
    localStorage.setItem(creatorSessionStorageKey, sessionToken)
    setIsCreatorLoggedIn(true)
  }

  const clearCreatorSession = () => {
    localStorage.removeItem(creatorSessionStorageKey)
    setConnectedChannel(null)
    setIsCreatorLoggedIn(false)
    setAuthFeedback('로그아웃됨')
  }

  const persistFanSession = (sessionToken: string) => {
    localStorage.setItem(fanSessionStorageKey, sessionToken)
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

  const handleFanJoin = async () => {
    if (!inviteCode.trim()) {
      setFanError('초대 링크 코드가 필요합니다.')
      return
    }

    if (!fanEmail.trim() || !fanNickname.trim()) {
      setFanError('이메일과 닉네임을 입력하세요.')
      return
    }

    setIsJoiningInvite(true)
    setFanError('')
    setFanStatus('팬 가입 처리 중')

    try {
      const response = await fetch(`${apiBaseUrl}/api/v1/fans/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inviteCode,
          email: fanEmail.trim(),
          nickname: fanNickname.trim(),
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || '팬 가입에 실패했습니다.')
      }

      const data = (await response.json()) as FanAuthResponse
      setFanSession(data)
      persistFanSession(data.session_token)
      setSelectedFanRoomId(data.joined_rooms[0]?.room_slug ?? 'salt-toast')
      setCurrentView('fan')
      setFanStatus(`${data.nickname}님 팬 가입 완료`)
    } catch (error) {
      const message = error instanceof Error ? error.message : '팬 가입에 실패했습니다.'
      setFanError(message)
      setFanStatus('팬 가입 실패')
    } finally {
      setIsJoiningInvite(false)
    }
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0] ?? null
    setSelectedFile(nextFile)
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
    const message = params.get('message')
    const appToken = params.get('appToken')
    const pathname = window.location.pathname

    if (
      view === 'content' ||
      view === 'signup' ||
      view === 'dashboard' ||
      view === 'fan'
    ) {
      setCurrentView(view)
    }

    if (youtubeState === 'connected') {
      if (appToken) {
        persistCreatorSession(appToken)
      }
      setCurrentView('content')
      setAuthFeedback('구글 로그인 완료, 연결된 유튜브 채널 정보를 불러왔습니다.')
      void loadLatestConnection()
    }

    if (youtubeState === 'error') {
      setCurrentView('signup')
      setAuthFeedback(message || '구글 로그인 중 오류가 발생했습니다.')
    }

    if (view || youtubeState || message) {
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
  }, [])

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
              onClick={() => setCurrentView(id)}
            >
              {label}
            </button>
          ))}
          {headerRoleLabel ? <span className="nav-role-chip">{headerRoleLabel}</span> : null}
        </nav>

        {isCreatorLoggedIn ? (
          <button className="header-logout" onClick={handleCreatorLogout}>
            크리에이터 로그아웃
          </button>
        ) : null}

        {isFanLoggedIn && !isCreatorLoggedIn ? (
          <button className="header-logout" onClick={handleFanLogout}>
            팬 로그아웃
          </button>
        ) : null}
      </div>
    </header>
  )

  const renderHome = () => (
    <>
      <section className="hero-panel">
        <div className="hero-copy">
          <div className="eyebrow-row">
            <span className="eyebrow-pill">INFLUENCEHUB</span>
            <span className="eyebrow-note">Creator Room Operating System</span>
          </div>

          <h1>
            유튜버가 방장이 되는
            <br />
            팬 커뮤니티 운영 허브
          </h1>

          <p className="hero-description">
            유튜브 밖에서 흩어진 팬 경험을 하나의 공식 공간으로 모읍니다.
            크리에이터는 팬방을 만들고, 필요한 운영 모듈만 붙여 직접 수익과
            소통 흐름을 관리합니다.
          </p>

          <div className="hero-actions">
            <button className="primary-action" onClick={openCreatorStart}>
              {isCreatorLoggedIn ? '내 채널 관리하기' : '크리에이터로 시작'}
            </button>
            <button className="secondary-action" onClick={() => setCurrentView('fan')}>
              팬 입장 화면 보기
            </button>
          </div>

          <div className="stat-grid">
            {statCards.map((card) => (
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
                <span className="card-kicker">온보딩 미리보기</span>
                <h2>가입부터 운영까지 한 흐름</h2>
              </div>
              <span className="status-badge">MVP</span>
            </div>

            <p className="card-intro">
              {isCreatorLoggedIn
                ? '이미 로그인된 크리에이터 기준으로 채널 관리와 운영 화면으로 바로 이어집니다.'
                : '화면은 연결돼 있고, 지금은 프론트 프로토타입 중심으로 크리에이터 운영 경험을 먼저 설계한 상태입니다.'}
            </p>

            <div className="journey-list">
              {onboardingSteps.map((step, index) => (
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
              <button className="tiny-action" onClick={() => setCurrentView('dashboard')}>
                {isCreatorLoggedIn ? '운영 계속하기' : '대시보드 열기'}
              </button>
            </div>

            <div className="room-layout">
              <div className="room-main">
                <span className="section-label">자동 생성 공지</span>
                <h3>새 영상이 업로드됐습니다</h3>
                <p>
                  오늘 업로드된 영상이 유튜브와 치지직에 동시에 반영됐고,
                  팬방에는 공지가 자동 등록됩니다.
                </p>
                <div className="platform-tags">
                  <span>YouTube</span>
                  <span>CHZZK</span>
                  <span>팬 알림 발송</span>
                </div>
              </div>

              <aside className="room-side">
                <span className="section-label">현재 활성 모듈</span>
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
          <span className="section-label">온보딩 흐름</span>
          <h2>방을 만들고 필요한 기능만 붙이는 구조</h2>
          <p>
            모든 방이 똑같을 필요는 없습니다. 크리에이터가 운영 방식에 맞게
            모듈을 켜고, 팬은 하나의 공식 공간에서 콘텐츠와 소통을 함께
            소비합니다.
          </p>
        </div>

        <div className="step-list">
          {onboardingSteps.map((step, index) => (
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
    <section className="scene-panel light">
      <div className="scene-copy">
        <span className="section-label dark">STEP 01</span>
        <h2>{isCreatorLoggedIn ? '연결된 크리에이터 계정' : '크리에이터 계정 만들기'}</h2>
        <p>
          {isCreatorLoggedIn
            ? '이미 로그인된 상태이므로 다시 가입할 필요가 없습니다. 연결된 채널 정보와 운영 화면으로 바로 이동하면 됩니다.'
            : '소셜 로그인 진입점을 먼저 고르고, 계정이 연결되면 팬방 생성 단계로 바로 넘어갑니다. 어떤 플랫폼에서 시작하느냐에 따라 초반 문구와 권장 설정이 달라집니다.'}
        </p>

        <div className="highlight-card">
          <span className="mini-label">선택된 로그인</span>
          <strong>{selectedSocialDetail.label}</strong>
          <p>{selectedSocialDetail.detail}</p>
        </div>

        <div className="notice-preview">
          <span className="mini-label">OAuth2 상태</span>
          <strong>{authFeedback}</strong>
          <p>
            {isCreatorLoggedIn
              ? '현재 세션이 살아 있어 홈과 가입 화면에서 같은 로그인 흐름을 반복하지 않고 운영 화면으로 이어집니다.'
              : '크리에이터가 구글로 로그인하면 YouTube 채널을 연결하고, 돌아오자마자 채널명, 설명, 구독자 수가 운영 화면에 채워집니다.'}
          </p>
        </div>

        <div className="inline-actions">
          {isCreatorLoggedIn ? (
            <button className="primary-action" onClick={() => setCurrentView('content')}>
              연결된 채널 보러가기
            </button>
          ) : (
            <button className="primary-action" onClick={() => void startCreatorGoogleLogin()}>
              {isStartingGoogleLogin ? 'Google로 이동 중...' : 'Google로 로그인하고 채널 가져오기'}
            </button>
          )}
          <button className="secondary-action dark" onClick={() => setCurrentView('home')}>
            홈으로
          </button>
        </div>
      </div>

      <div className="scene-card">
        <div className="card-header">
          <div>
            <span className="card-kicker">회원가입</span>
            <h2>로그인 방식 선택</h2>
          </div>
          <span className="status-badge">Live UI</span>
        </div>

        <div className="social-list">
          {socialButtons.map((button) => (
            <button
              className={
                selectedSocial === button.tone
                  ? `social-button ${button.tone} selected`
                  : `social-button ${button.tone}`
              }
              key={button.label}
              onClick={() => setSelectedSocial(button.tone)}
            >
              <span>{button.label}</span>
              <small>{button.detail}</small>
            </button>
          ))}
        </div>

        <div className="detail-grid">
          <article className="detail-card">
            <span className="mini-label">권장 이유</span>
            <strong>구글 로그인과 유튜브 채널 연결을 한 번에 처리</strong>
            <p>로그인 후 바로 앱으로 돌아오고, 최신 채널 정보를 콘텐츠 센터에 채워 넣습니다.</p>
          </article>
          <article className="detail-card">
            <span className="mini-label">다음 연결</span>
            <strong>{isCreatorLoggedIn ? '중복 로그인 방지' : '팬방 주소 자동 제안'}</strong>
            <p>
              {isCreatorLoggedIn
                ? '로그인된 상태에서 홈으로 돌아가도 다시 처음부터 반복하지 않고 채널 관리 화면으로 연결합니다.'
                : '연결된 채널명과 설명을 기준으로 방 이름, 소개, 운영 카드가 이어집니다.'}
            </p>
          </article>
        </div>

        <div className="legal-note">
          <span>계속 진행하면 아래 문서에 동의하는 것으로 간주됩니다.</span>
          <div className="legal-link-row">
            <button className="legal-link" onClick={() => setCurrentView('privacy')}>
              개인정보처리방침
            </button>
            <button className="legal-link" onClick={() => setCurrentView('terms')}>
              애플리케이션 서비스 약관
            </button>
          </div>
        </div>
      </div>
    </section>
  )

  const renderRoom = () => (
    <section className="scene-panel">
      <div className="scene-copy">
        <span className="section-label">STEP 02</span>
        <h2>{isCreatorLoggedIn ? '팬방 기본 정보를 확인' : '팬방의 첫 인상을 설계'}</h2>
        <p>
          {isCreatorLoggedIn
            ? '연결된 유튜브 채널 기준으로 팬방 기본 정보가 잡혀 있습니다. 필요하면 기능 설정이나 운영 화면으로 바로 넘어가면 됩니다.'
            : '채널 이름, 팬방 주소, 소개 문구, 운영 톤을 먼저 고정하면 나머지 화면의 카드와 공지 문구가 그에 맞게 정렬됩니다.'}
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
          <button className="secondary-action" onClick={() => setCurrentView('signup')}>
            이전 단계
          </button>
        </div>
      </div>

      <div className="scene-card dark-card">
        <div className="dual-pane">
          <section className="editor-card">
            <span className="card-kicker">팬방 기본 정보</span>
            <div className="room-form-preview">
              <label>
                채널 이름
                <div className="field">침착한개발자TV</div>
              </label>
              <label>
                팬방 주소
                <div className="field muted">influencehub.io/room/devtv</div>
              </label>
              <label>
                방 소개
                <div className="field multiline">
                  영상 공지, 팬 소통, 실시간 이벤트, 굿즈 드롭까지 한곳에서
                  운영합니다.
                </div>
              </label>
            </div>
          </section>

          <section className="editor-card accent">
            <span className="card-kicker">미리보기</span>
            <div className="creator-chip">
              <span className="chip-avatar">TV</span>
              <div>
                <strong>침착한개발자TV</strong>
                <span>차분한 운영 톤 · 팬과 자주 대화하는 방</span>
              </div>
            </div>
            <div className="preview-bubbles">
              <div className="preview-bubble">오늘 업로드 알림이 자동 등록됩니다.</div>
              <div className="preview-bubble">이벤트 탭은 추후 켤 수 있습니다.</div>
              <div className="preview-bubble strong">팬 입장 전 첫 인상을 여기서 결정합니다.</div>
            </div>
          </section>
        </div>
      </div>
    </section>
  )

  const renderFeatures = () => (
    <section className="scene-panel light">
      <div className="scene-copy">
        <span className="section-label dark">STEP 03</span>
        <h2>운영 방식에 맞는 기능 모듈 선택</h2>
        <p>
          클릭하면 즉시 켜지고 꺼지는 구조로 만들었습니다. 지금은 프론트
          프로토타입이지만, 나중에 실제 설정 API만 붙이면 거의 같은 UX로 갈 수
          있습니다.
        </p>

        <div className="selection-summary">
          <span className="mini-label">현재 활성화</span>
          <strong>{selectedFeatures.length}개 모듈 선택됨</strong>
          <p>{selectedFeatures.join(' · ')}</p>
        </div>

        <div className="inline-actions">
          <button className="primary-action" onClick={goToDashboard}>
            대시보드 생성
          </button>
          <button className="secondary-action dark" onClick={() => setCurrentView('room')}>
            이전 단계
          </button>
        </div>
      </div>

      <div className="scene-card">
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
    <section className="dashboard-shell">
      <div className="dashboard-sidebar">
        <span className="section-label">CREATOR ROOM</span>
        <h2>운영 대시보드</h2>
        <p>
          업로드, 공지, 이벤트, 매출, 팬 반응을 하나의 패널에서 보는 흐름으로
          정리했습니다.
        </p>

        <div className="sidebar-menu">
          <button className="sidebar-link active">개요</button>
          <button className="sidebar-link" onClick={() => setCurrentView('content')}>
            콘텐츠 배포
          </button>
          <button className="sidebar-link" onClick={() => setCurrentView('community')}>
            팬 커뮤니티
          </button>
          <button className="sidebar-link" onClick={() => setCurrentView('events')}>
            이벤트 운영
          </button>
          <button className="sidebar-link" onClick={() => setCurrentView('store')}>
            굿즈 관리
          </button>
          <button className="sidebar-link" onClick={() => setCurrentView('fan')}>
            팬 화면 보기
          </button>
        </div>
      </div>

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

  const renderContent = () => (
    <section className="studio-shell">
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
          <button className="primary-action" onClick={() => setCurrentView('dashboard')}>
            대시보드로
          </button>
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
              {isCreatorLoggedIn ? (
                <button className="secondary-action dark" onClick={handleCreatorLogout}>
                  로그아웃
                </button>
              ) : (
                <button className="primary-action" onClick={() => void startCreatorGoogleLogin()}>
                  {isStartingGoogleLogin ? 'Google로 이동 중...' : '구글 로그인 다시 하기'}
                </button>
              )}
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

      <div className="split-grid">
        <section className="studio-panel">
          <div className="panel-head">
            <div>
              <span className="card-kicker">인플루언스허브 업로드</span>
              <h3>오늘의 메인 영상</h3>
            </div>
            <span className="status-badge">Queued</span>
          </div>

          <div className="form-stack">
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
            <div className="chip-row">
              <span className="info-chip">업로드 파일 1개</span>
              <span className="info-chip">썸네일 자동 첨부</span>
              <span className="info-chip">공지 초안 자동 생성</span>
            </div>
            <div className="upload-action-row">
              <button className="primary-action" onClick={() => void handleUpload()} type="button">
                {isUploading ? '업로드 중...' : 'YouTube 업로드'}
              </button>
              <span className="helper-copy">{uploadStatus}</span>
            </div>
            {uploadError ? <p className="feedback-message error">{uploadError}</p> : null}
            {uploadResult ? (
              <article className="upload-result-card">
                <span className="mini-label">업로드 결과</span>
                <strong>{uploadResult.title}</strong>
                <p>공개 상태: {uploadResult.privacy_status}</p>
                <a className="result-link" href={uploadResult.watch_url} rel="noreferrer" target="_blank">
                  유튜브에서 보기
                </a>
              </article>
            ) : null}
          </div>
        </section>

        <section className="studio-panel">
          <div className="panel-head">
            <div>
              <span className="card-kicker">발행 순서</span>
              <h3>예약 타임라인</h3>
            </div>
          </div>

          <div className="timeline-list">
            {contentTimeline.map((item) => (
              <article className="timeline-row" key={item.title}>
                <span className="timeline-time">{item.time}</span>
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.body}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      <section className="studio-panel">
        <div className="panel-head">
          <div>
            <span className="card-kicker">멀티 플랫폼 카탈로그</span>
            <h3>확장 가능한 배포 채널</h3>
          </div>
        </div>

        <div className="platform-grid">
          {platformCatalog.map((platform) => (
            <article className={`platform-card ${platform.tone}`} key={platform.name}>
              <span className="platform-status">{platform.status}</span>
              <strong>{platform.name}</strong>
              <p>{platform.detail}</p>
            </article>
          ))}
        </div>

        <div className="integration-legal">
          <span>
            플랫폼 연동 전 심사 및 정책 고지를 위해 아래 법률 문서 링크를 함께 제공할 수 있습니다.
          </span>
          <div className="legal-link-row">
            <button className="legal-link" onClick={() => setCurrentView('privacy')}>
              개인정보처리방침 보기
            </button>
            <button className="legal-link" onClick={() => setCurrentView('terms')}>
              서비스 약관 보기
            </button>
          </div>
        </div>
      </section>
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

  const renderCommunity = () => (
    <section className="studio-shell">
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
          <button className="secondary-action" onClick={() => setCurrentView('dashboard')}>
            대시보드로
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
            {communityPosts.map((post) => (
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

  const renderEvents = () => (
    <section className="studio-shell">
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
          <button className="secondary-action" onClick={() => setCurrentView('dashboard')}>
            대시보드로
          </button>
        </div>
      </div>

      <div className="three-grid">
        {eventSteps.map((step, index) => (
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

  const renderStore = () => (
    <section className="studio-shell">
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
          <button className="secondary-action" onClick={() => setCurrentView('dashboard')}>
            대시보드로
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
            {storeItems.map((item) => (
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

  const renderFan = () => (
    <section className="fan-scene">
      <div className="fan-hero">
        <div className="creator-chip">
          <span className="chip-avatar">TV</span>
          <div>
            <strong>{activeFanRoom.label}</strong>
            <span>{activeFanRoom.meta} · {activeFanRoom.joinedVia}</span>
          </div>
        </div>

        <div className="fan-actions">
          <button
            className="primary-action"
            onClick={() => setCurrentView(fanSession ? 'home' : 'dashboard')}
          >
            {fanSession ? '메인으로' : '방장 화면으로'}
          </button>
          {fanSession ? (
            <button className="secondary-action" onClick={handleFanLogout}>
              팬 로그아웃
            </button>
          ) : (
            <button className="secondary-action" onClick={() => setCurrentView('home')}>
              홈으로
            </button>
          )}
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
              {fanFeed.map((moment) => (
                <article className="fan-moment-card" key={moment.title}>
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
        <p>
          영상 설명란이나 라이브 고정 댓글의 링크를 누르면 여기로 들어옵니다. 팬 가입을
          완료하면 해당 팬방에 바로 입장하고, 이후 다른 크리에이터 팬방도 같은 계정으로
          추가 가입할 수 있습니다.
        </p>

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

            <div className="form-stack">
              <div className="field-block">
                <span className="mini-label">이메일</span>
                <input
                  className="text-input"
                  value={fanEmail}
                  onChange={(event) => setFanEmail(event.target.value)}
                  placeholder="fan@example.com"
                />
              </div>
              <div className="field-block">
                <span className="mini-label">닉네임</span>
                <input
                  className="text-input"
                  value={fanNickname}
                  onChange={(event) => setFanNickname(event.target.value)}
                  placeholder="팬 닉네임"
                />
              </div>
            </div>

            <div className="inline-actions">
              <button className="primary-action" onClick={() => void handleFanJoin()}>
                {isJoiningInvite ? '팬 가입 중...' : '팬으로 가입하고 입장'}
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

  return (
    <main className="page-shell app-shell">
      {renderHeader()}
      {currentView === 'home' && renderHome()}
      {currentView === 'signup' && renderSignup()}
      {currentView === 'room' && renderRoom()}
      {currentView === 'features' && renderFeatures()}
      {currentView === 'dashboard' && renderDashboard()}
      {currentView === 'content' && renderContent()}
      {currentView === 'community' && renderCommunity()}
      {currentView === 'events' && renderEvents()}
      {currentView === 'store' && renderStore()}
      {currentView === 'privacy' && renderPrivacy()}
      {currentView === 'terms' && renderTerms()}
      {currentView === 'invite' && renderInvite()}
      {currentView === 'fan' && renderFan()}
      {renderFooter()}
    </main>
  )
}

export default App
