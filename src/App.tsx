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
  | 'platforms'
  | 'privacy'
  | 'terms'
  | 'invite'
  | 'fan'

type FanTab = 'feed' | 'calendar' | 'shop'
type FanBoardFilter = string
type PrivacyStatus = 'private' | 'unlisted' | 'public'
type PublishComposerMode = 'video' | 'post'
type AuthMethod = 'social' | 'email'
type DashboardSection = 'overview' | 'content' | 'community' | 'events' | 'store' | 'platforms'
type BannerStyle = 'focus' | 'soft' | 'broadcast'
type ButtonStyle = 'rounded' | 'solid' | 'outlined'
type CardDensity = 'compact' | 'comfortable' | 'airy'
type RoomSettingsSection = 'theme' | 'platforms' | 'modules'
type FanRoomType = 'community-board' | 'feed' | 'chat' | 'challenge' | 'fan-creation' | 'archive'
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

type FanRoomTypePreset = {
  id: FanRoomType
  name: string
  purpose: string
  description: string
  recommendedFor: string
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
  notice_title: string
}

type YoutubeCommentResult = {
  videoId: string
  commentId: string
  commentUrl: string
  message: string
}

type YoutubeRecentVideoItem = {
  videoId: string
  title: string
  description: string
  thumbnailUrl: string
  watchUrl: string
  publishedAt: string
  liveBroadcastContent: string
}

type YoutubeRecentVideoApiItem = {
  video_id: string
  title: string
  description: string
  thumbnail_url: string
  watch_url: string
  published_at: string
  live_broadcast_content: string
}

type InstagramPublishResult = {
  status: string
  mediaId: string
  permalink: string
}

type AuthUrlResponse = {
  auth_url: string
  redirect_uri: string
}

type FanAuthUrlResponse = {
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
  room_layout_type: FanRoomType
  discord_webhook_url: string
  discord_enabled: boolean
  instagram_account_id: string
  instagram_access_token: string
  instagram_enabled: boolean
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
  like_count: number
  comment_count: number
  report_count: number
  liked_by_viewer: boolean
  highlighted: boolean
}

type CommunityCommentItem = {
  comment_id: number
  author_name: string
  content: string
  created_at: string
}

type EventSummaryItem = {
  event_id: number
  title: string
  detail: string
  schedule_label: string
  visible: boolean
}

type StoreItemSummary = {
  product_id: number
  name: string
  description: string | null
  image_url: string | null
  external_url: string | null
  price_text: string | null
  status_label: string | null
  sales_label: string | null
  source_label: string | null
  visible: boolean
}

type StoreImportPreview = {
  source_url: string
  product_name: string
  description: string
  image_url: string
  price_text: string
  source_label: string
  note: string
}

type StoreImageUploadResponse = {
  image_url: string
  file_name: string
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

const isRenderableImageUrl = (value?: string | null) =>
  typeof value === 'string' && /^https?:\/\/\S+/i.test(value.trim())

const isTestCommunityPost = (post: CommunityPostItem) =>
  post.title.trim() === '이미지 저장 테스트' || post.content.includes('image_url 필드 저장 확인')

const platformRequiresCredentials = (platformName: string) =>
  platformName === 'Instagram' || platformName === 'Discord'

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

const fanRoomTypePresets: FanRoomTypePreset[] = [
  {
    id: 'community-board',
    name: '게시판형',
    purpose: '침하하처럼 팬들끼리 커뮤니티가 쌓이는 구조',
    description: '공지, 자유글, 인기글, 질문, 짤/밈을 중심으로 추천과 댓글이 쌓입니다.',
    recommendedFor: '입담형 · 예능형 · 팬덤 결속형',
  },
  {
    id: 'feed',
    name: '피드형',
    purpose: '인플루언서 중심으로 콘텐츠를 소비하는 단일 타임라인',
    description: '짧은 영상, 이미지, 스토리 느낌의 업로드를 한 줄 피드로 소비합니다.',
    recommendedFor: '패션 · 뷰티 · 라이프스타일',
  },
  {
    id: 'chat',
    name: '채팅형',
    purpose: '실시간으로 반응이 빠르게 흐르는 소통형 구조',
    description: '라이브 연동 채팅, 주제방, 공지 핀 중심으로 빠르게 대화가 이어집니다.',
    recommendedFor: '방송형 · 스트리머 · 실시간 소통형',
  },
  {
    id: 'challenge',
    name: '챌린지형',
    purpose: '출석과 미션으로 체류시간을 끌어올리는 참여형 구조',
    description: '오늘의 미션, 인증 게시판, 출석체크, 랭킹으로 팬 참여를 유도합니다.',
    recommendedFor: '운동 · 공부 · 루틴형',
  },
  {
    id: 'fan-creation',
    name: '팬작업형',
    purpose: '팬아트, 밈, 편집물 같은 2차 창작이 메인이 되는 구조',
    description: '팬아트, 짤/밈, 편집 영상, 인플루언서 PICK이 중심이 됩니다.',
    recommendedFor: '캐릭터성 강한 크리에이터 · 밈 생성형',
  },
  {
    id: 'archive',
    name: '아카이브형',
    purpose: '신규 팬도 쉽게 들어오는 정리형 라이브러리 구조',
    description: '입문 가이드, 명장면, 방송 요약, FAQ를 카테고리로 정리합니다.',
    recommendedFor: '장기 활동형 · 정보형 채널',
  },
]

const fanRoomTypeUi = {
  'community-board': {
    heroLabel: '게시판형 팬방',
    boardLabel: '게시판',
    boardTitle: '커뮤니티 메뉴',
    feedTitle: '게시판',
    communityTitle: '팬들끼리 글과 댓글로 노는 커뮤니티',
    communitySpotlight: '지금 인기글',
    composerLabel: '팬 게시글 작성',
    composerTitle: '팬들끼리 자유롭게 글을 올릴 수 있습니다.',
    composerPlaceholderTitle: '제목을 입력하세요',
    composerPlaceholderBody: '오늘 본 영상 이야기나 팬방 잡담을 남겨보세요',
    emptyTitle: '이 게시판에는 아직 글이 없습니다',
    emptyDescription: '다른 게시판을 보거나 첫 글을 올려서 팬방 대화를 시작해 보세요.',
    actionTitle: '침하하처럼 팬들끼리 놀 수 있는 구조',
    actionCards: [
      { label: 'POST', title: '글 올리기', description: '공지, 자유글, 질문, 짤을 바로 남길 수 있습니다.' },
      { label: 'REACT', title: '추천 누르기', description: '재밌는 글은 추천해서 인기글로 올릴 수 있습니다.' },
      { label: 'TALK', title: '댓글 달기', description: '팬들끼리 댓글로 반응을 주고받습니다.' },
      { label: 'BEST', title: '베스트 보기', description: '추천이 많이 쌓인 글을 바로 볼 수 있습니다.' },
      { label: 'EVENT', title: '일정 체크하기', description: '라이브, 팬미팅, 이벤트 일정을 같이 봅니다.' },
      { label: 'SHOP', title: '굿즈 둘러보기', description: '팬방 한정 굿즈나 드롭 상품을 확인합니다.' },
    ],
    boards: [
      { key: 'ALL', label: '전체 글' },
      { key: 'BEST', label: '인기글' },
      { key: 'NOTICE', label: '공지' },
      { key: 'FREE', label: '자유게시판' },
      { key: 'QUESTION', label: '질문/상담' },
      { key: 'MEME', label: '짤/밈' },
    ],
  },
  feed: {
    heroLabel: '피드형 팬방',
    boardLabel: '피드',
    boardTitle: '피드 메뉴',
    feedTitle: '메인 피드',
    communityTitle: '인플루언서 중심으로 빠르게 소비하는 피드',
    communitySpotlight: '지금 반응 좋은 포스트',
    composerLabel: '팬 피드 업로드',
    composerTitle: '스토리처럼 짧은 감상과 반응을 남길 수 있습니다.',
    composerPlaceholderTitle: '짧은 한 줄 제목',
    composerPlaceholderBody: '오늘 올라온 사진이나 영상에 대한 반응을 남겨보세요',
    emptyTitle: '아직 메인 피드가 비어 있습니다',
    emptyDescription: '첫 피드가 올라오면 여기서 바로 이어서 반응을 남길 수 있습니다.',
    actionTitle: '짧은 영상과 이미지 반응 중심 팬 피드',
    actionCards: [
      { label: 'STORY', title: '짧은 피드 남기기', description: '스토리처럼 짧은 반응을 바로 올릴 수 있습니다.' },
      { label: 'LIKE', title: '좋아요 남기기', description: '좋아하는 포스트에 빠르게 반응합니다.' },
      { label: 'POLL', title: '투표 참여하기', description: '다음 콘텐츠나 룩을 팬 투표로 고릅니다.' },
      { label: 'PIN', title: '고정 포스트 보기', description: '방장이 고정한 핵심 포스트를 확인합니다.' },
      { label: 'EVENT', title: '일정 체크하기', description: '업로드 일정과 라이브 일정을 함께 봅니다.' },
      { label: 'SHOP', title: '굿즈 둘러보기', description: '피드에 소개된 굿즈 링크로 이어집니다.' },
    ],
    boards: [
      { key: 'ALL', label: '메인 피드' },
      { key: 'BEST', label: '인기 포스트' },
      { key: 'NOTICE', label: '고정 포스트' },
      { key: 'FREE', label: '짧은 후기' },
      { key: 'QUESTION', label: '투표/질문' },
    ],
  },
  chat: {
    heroLabel: '채팅형 팬방',
    boardLabel: '채팅',
    boardTitle: '실시간 메뉴',
    feedTitle: '실시간 채팅 흐름',
    communityTitle: '메시지 흐름이 빠른 실시간 팬 소통 구조',
    communitySpotlight: '지금 대화 많은 방',
    composerLabel: '채팅 메시지 남기기',
    composerTitle: '짧은 메시지와 실시간 반응으로 분위기를 만듭니다.',
    composerPlaceholderTitle: '짧은 주제 한 줄',
    composerPlaceholderBody: '실시간 채팅처럼 짧고 빠르게 메시지를 남겨보세요',
    emptyTitle: '아직 채팅 흐름이 없습니다',
    emptyDescription: '첫 메시지가 올라오면 실시간 대화가 여기서 쌓입니다.',
    actionTitle: '라이브 채팅처럼 빠르게 반응을 주고받는 공간',
    actionCards: [
      { label: 'LIVE', title: '실시간 채팅 참여', description: '바로 메시지를 남기고 다른 팬과 이어서 얘기합니다.' },
      { label: 'PIN', title: '공지 핀 보기', description: '방장이 고정한 중요한 메시지를 확인합니다.' },
      { label: 'TOPIC', title: '주제방 이동', description: '게임, 일상, 라이브 등 주제별 대화방을 나눕니다.' },
      { label: 'REACT', title: '리액션 남기기', description: '메시지마다 빠르게 리액션을 남깁니다.' },
      { label: 'EVENT', title: '라이브 일정 보기', description: '곧 열릴 생방송 일정을 체크합니다.' },
      { label: 'SHOP', title: '드롭 알림 받기', description: '실시간 드롭 굿즈를 놓치지 않게 봅니다.' },
    ],
    boards: [
      { key: 'ALL', label: '실시간 채팅' },
      { key: 'BEST', label: '핫 토픽' },
      { key: 'NOTICE', label: '공지 핀' },
      { key: 'FREE', label: '잡담방' },
      { key: 'QUESTION', label: '질문방' },
    ],
  },
  challenge: {
    heroLabel: '챌린지형 팬방',
    boardLabel: '미션',
    boardTitle: '챌린지 메뉴',
    feedTitle: '오늘의 챌린지',
    communityTitle: '미션과 출석으로 팬 참여를 끌어올리는 구조',
    communitySpotlight: '지금 반응 좋은 인증글',
    composerLabel: '인증글 올리기',
    composerTitle: '오늘의 미션이나 출석 인증을 바로 올릴 수 있습니다.',
    composerPlaceholderTitle: '오늘 인증 제목',
    composerPlaceholderBody: '운동, 공부, 루틴, 출석 인증을 남겨보세요',
    emptyTitle: '아직 챌린지 인증글이 없습니다',
    emptyDescription: '첫 인증글이 올라오면 팬들의 참여 흐름이 열립니다.',
    actionTitle: '미션, 출석, 랭킹으로 계속 들어오게 만드는 팬방',
    actionCards: [
      { label: 'MISSION', title: '오늘의 미션 보기', description: '지금 참여할 수 있는 미션을 바로 확인합니다.' },
      { label: 'CHECK', title: '출석 체크하기', description: '연속 참여 streak를 쌓습니다.' },
      { label: 'POST', title: '인증글 올리기', description: '사진이나 글로 오늘 미션 완료를 인증합니다.' },
      { label: 'RANK', title: '랭킹 보기', description: '참여 점수와 배지를 비교합니다.' },
      { label: 'EVENT', title: '보상 일정 확인', description: '챌린지 마감과 보상 일정을 확인합니다.' },
      { label: 'SHOP', title: '혜택 굿즈 보기', description: '뱃지나 보상형 상품을 같이 봅니다.' },
    ],
    boards: [
      { key: 'ALL', label: '오늘의 미션' },
      { key: 'BEST', label: '인기 인증글' },
      { key: 'NOTICE', label: '공지/규칙' },
      { key: 'FREE', label: '출석체크' },
      { key: 'QUESTION', label: '질문/응원' },
    ],
  },
  'fan-creation': {
    heroLabel: '팬작업형 팬방',
    boardLabel: '팬작업',
    boardTitle: '창작 메뉴',
    feedTitle: '팬 창작 게시판',
    communityTitle: '팬아트, 밈, 편집물로 팬 콘텐츠가 쌓이는 구조',
    communitySpotlight: '지금 화제인 팬작업',
    composerLabel: '팬작업 올리기',
    composerTitle: '팬아트, 짤, 밈, 편집물을 팬방에 올릴 수 있습니다.',
    composerPlaceholderTitle: '작품 제목',
    composerPlaceholderBody: '팬아트, 짤, 편집 영상 소개를 적어보세요',
    emptyTitle: '아직 등록된 팬작업이 없습니다',
    emptyDescription: '첫 번째 팬 창작물이 올라오면 여기서 큐레이션됩니다.',
    actionTitle: '2차 창작과 밈이 중심이 되는 팬 제작형 팬방',
    actionCards: [
      { label: 'ART', title: '팬아트 올리기', description: '그림, 캡처, 짤 이미지를 공유합니다.' },
      { label: 'MEME', title: '짤/밈 공유하기', description: '캐릭터성과 세계관을 살린 밈을 올립니다.' },
      { label: 'CLIP', title: '편집물 소개하기', description: '영상 편집물이나 리액션 링크를 공유합니다.' },
      { label: 'PICK', title: 'PICK 작품 보기', description: '방장이 고른 인기 팬작업을 모아봅니다.' },
      { label: 'EVENT', title: '콘테스트 일정 보기', description: '팬작업 이벤트 마감일을 확인합니다.' },
      { label: 'SHOP', title: '창작 굿즈 보기', description: '작품 기반 굿즈나 드롭 소식을 봅니다.' },
    ],
    boards: [
      { key: 'ALL', label: '전체 작품' },
      { key: 'BEST', label: '인기 작품' },
      { key: 'NOTICE', label: '공지/가이드' },
      { key: 'FREE', label: '짤/밈' },
      { key: 'QUESTION', label: '리액션/질문' },
    ],
  },
  archive: {
    heroLabel: '아카이브형 팬방',
    boardLabel: '아카이브',
    boardTitle: '아카이브 메뉴',
    feedTitle: '입문 가이드',
    communityTitle: '입문 가이드와 명장면을 정리하는 라이브러리 구조',
    communitySpotlight: '지금 많이 보는 정리글',
    composerLabel: '정리글 올리기',
    composerTitle: '명장면 요약, 입문 가이드, FAQ를 정리할 수 있습니다.',
    composerPlaceholderTitle: '정리글 제목',
    composerPlaceholderBody: '입문용 가이드나 명장면 요약을 남겨보세요',
    emptyTitle: '아직 정리된 아카이브가 없습니다',
    emptyDescription: '첫 가이드가 올라오면 신규 팬도 바로 따라올 수 있습니다.',
    actionTitle: '신규 팬이 빠르게 적응할 수 있게 정리하는 팬방',
    actionCards: [
      { label: 'GUIDE', title: '입문 가이드 보기', description: '처음 들어온 팬도 빠르게 적응할 수 있습니다.' },
      { label: 'SCENE', title: '명장면 보기', description: '대표 장면과 밈 포인트를 모아봅니다.' },
      { label: 'SUMMARY', title: '방송 요약 읽기', description: '길었던 방송도 핵심만 빠르게 봅니다.' },
      { label: 'FAQ', title: 'FAQ 확인하기', description: '자주 묻는 질문과 팬 문화 설명을 봅니다.' },
      { label: 'EVENT', title: '다음 일정 보기', description: '앞으로의 라이브와 업로드 일정을 확인합니다.' },
      { label: 'SHOP', title: '관련 굿즈 보기', description: '입문 굿즈나 대표 상품을 같이 봅니다.' },
    ],
    boards: [
      { key: 'ALL', label: '입문 가이드' },
      { key: 'BEST', label: '명장면 모음' },
      { key: 'NOTICE', label: '공지/규칙' },
      { key: 'FREE', label: '방송 요약' },
      { key: 'QUESTION', label: 'FAQ' },
    ],
  },
} satisfies Record<
  FanRoomType,
  {
    heroLabel: string
    boardLabel: string
    boardTitle: string
    feedTitle: string
    communityTitle: string
    communitySpotlight: string
    composerLabel: string
    composerTitle: string
    composerPlaceholderTitle: string
    composerPlaceholderBody: string
    emptyTitle: string
    emptyDescription: string
    actionTitle: string
    actionCards: { label: string; title: string; description: string }[]
    boards: { key: string; label: string }[]
  }
>

const contentTimeline = [
  {
    time: 'READY',
    title: '예약 배포 대기',
    body: '예약 시간을 넣고 등록하면 실제 배포 이력이 여기에 쌓입니다.',
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
    detail: '이미지 피드 + 캡션 게시글 배포',
    tone: 'instagram',
    supportsPost: true,
    supportsVideo: false,
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
  Instagram: { client: 'Instagram Account ID', secret: 'Long-lived Access Token' },
  Facebook: { client: 'Page ID', secret: 'Access Token' },
  TikTok: { client: 'Client Key', secret: 'Client Secret' },
  Threads: { client: '앱 식별자', secret: '연동 토큰' },
  Discord: { client: '서버 이름', secret: 'Webhook URL' },
  Twitch: { client: 'Client ID', secret: 'OAuth Token' },
}

const creatorSessionStorageKey = 'influencehub.creator-session-token'
const fanSessionStorageKey = 'influencehub.fan-session-token'
const roomThemeStorageKey = 'influencehub.room-theme'
const creatorAppearanceStorageKey = 'influencehub.creator-appearance'

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
  const [editingCommunityPostId, setEditingCommunityPostId] = useState<number | null>(null)
  const [instagramMediaUrl, setInstagramMediaUrl] = useState('')
  const [instagramPublishStatus, setInstagramPublishStatus] = useState('아직 Instagram 배포 전')
  const [instagramPublishResult, setInstagramPublishResult] = useState<InstagramPublishResult | null>(null)
  const [commentTargetUrl, setCommentTargetUrl] = useState('')
  const [commentStatus, setCommentStatus] = useState('아직 댓글 배포 전')
  const [commentResult, setCommentResult] = useState<YoutubeCommentResult | null>(null)
  const [youtubeRecentVideos, setYoutubeRecentVideos] = useState<YoutubeRecentVideoItem[]>([])
  const [uploadStatus, setUploadStatus] = useState('아직 업로드 전')
  const [uploadError, setUploadError] = useState('')
  const [scheduleStatus, setScheduleStatus] = useState('예약 등록 전')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null)
  const [publishHistory, setPublishHistory] = useState<PublishJobHistoryItem[]>([])
  const [selectedPlatformName, setSelectedPlatformName] = useState('YouTube')
  const [isStartingGoogleLogin, setIsStartingGoogleLogin] = useState(false)
  const [authFeedback, setAuthFeedback] = useState('아직 구글 로그인 전')
  const [isCreatorLoggedIn, setIsCreatorLoggedIn] = useState(false)
  const [communityFeed, setCommunityFeed] = useState<CommunityPostItem[]>([])
  const [eventBoard, setEventBoard] = useState<EventSummaryItem[]>([])
  const [eventTitle, setEventTitle] = useState('')
  const [eventDetail, setEventDetail] = useState('')
  const [eventScheduleLabel, setEventScheduleLabel] = useState('오늘')
  const [eventStatus, setEventStatus] = useState('아직 이벤트 등록 전')
  const [isSavingEvent, setIsSavingEvent] = useState(false)
  const [editingEventId, setEditingEventId] = useState<number | null>(null)
  const [storeBoard, setStoreBoard] = useState<StoreItemSummary[]>([])
  const [storeSourceUrl, setStoreSourceUrl] = useState('')
  const [storeProductName, setStoreProductName] = useState('')
  const [storeProductDescription, setStoreProductDescription] = useState('')
  const [storeProductImageUrl, setStoreProductImageUrl] = useState('')
  const [storeProductImageFile, setStoreProductImageFile] = useState<File | null>(null)
  const [storeProductPriceText, setStoreProductPriceText] = useState('')
  const [storeProductStatusLabel, setStoreProductStatusLabel] = useState('판매 준비')
  const [storeProductSalesLabel, setStoreProductSalesLabel] = useState('외부 링크 판매')
  const [storeProductSourceLabel, setStoreProductSourceLabel] = useState('직접 등록')
  const [storeImportStatus, setStoreImportStatus] = useState('상품 링크를 붙여넣으면 초안이 자동으로 채워집니다.')
  const [storeSaveStatus, setStoreSaveStatus] = useState('아직 상품 등록 전')
  const [storeImportPreview, setStoreImportPreview] = useState<StoreImportPreview | null>(null)
  const [isImportingStoreLink, setIsImportingStoreLink] = useState(false)
  const [isUploadingStoreImage, setIsUploadingStoreImage] = useState(false)
  const [isSavingStoreProduct, setIsSavingStoreProduct] = useState(false)
  const [editingStoreProductId, setEditingStoreProductId] = useState<number | null>(null)
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
  const [fanPostTitle, setFanPostTitle] = useState('')
  const [fanPostBody, setFanPostBody] = useState('')
  const [fanPostStatus, setFanPostStatus] = useState('아직 팬 게시글 작성 전')
  const [fanFeedSort, setFanFeedSort] = useState<'latest' | 'popular'>('latest')
  const [fanBoardFilter, setFanBoardFilter] = useState<FanBoardFilter>('ALL')
  const [selectedFanPostId, setSelectedFanPostId] = useState<number | null>(null)
  const [fanCommentsByPostId, setFanCommentsByPostId] = useState<Record<number, CommunityCommentItem[]>>({})
  const [fanCommentDrafts, setFanCommentDrafts] = useState<Record<number, string>>({})
  const [isStartingFanGoogleLogin, setIsStartingFanGoogleLogin] = useState(false)
  const [selectedRoomTheme, setSelectedRoomTheme] = useState<RoomThemeId>('hub-classic')
  const [selectedFanRoomType, setSelectedFanRoomType] = useState<FanRoomType>('community-board')
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
    Instagram: { clientValue: '', secretValue: '', isEnabled: false, statusLabel: 'Inactive', supportsPost: true, supportsVideo: false },
    Facebook: { clientValue: '', secretValue: '', isEnabled: false, statusLabel: 'Inactive', supportsPost: true, supportsVideo: true },
    TikTok: { clientValue: '', secretValue: '', isEnabled: false, statusLabel: 'Inactive', supportsPost: true, supportsVideo: true },
    Threads: { clientValue: '', secretValue: '', isEnabled: false, statusLabel: 'Inactive', supportsPost: true, supportsVideo: true },
    Discord: { clientValue: '', secretValue: '', isEnabled: false, statusLabel: 'Inactive', supportsPost: true, supportsVideo: true },
    Twitch: { clientValue: '', secretValue: '', isEnabled: false, statusLabel: 'Inactive', supportsPost: false, supportsVideo: false },
  })
  const [bannerStyle, setBannerStyle] = useState<BannerStyle>('focus')
  const [buttonStyle, setButtonStyle] = useState<ButtonStyle>('rounded')
  const [cardDensity, setCardDensity] = useState<CardDensity>('comfortable')
  const [roomSettingsSection, setRoomSettingsSection] = useState<RoomSettingsSection>('theme')
  const [selectedPublishPlatforms, setSelectedPublishPlatforms] = useState<string[]>(['YouTube'])
  const [discordWebhookUrl, setDiscordWebhookUrl] = useState('')
  const [instagramAccountId, setInstagramAccountId] = useState('')
  const [instagramAccessToken, setInstagramAccessToken] = useState('')
  const [hasHydratedCreatorSettings, setHasHydratedCreatorSettings] = useState(false)
  const roleMenuRef = useRef<HTMLDivElement | null>(null)
  const fanPostComposerRef = useRef<HTMLElement | null>(null)
  const fanPostTitleInputRef = useRef<HTMLInputElement | null>(null)

  const activeRoomTheme =
    roomThemePresets.find((preset) => preset.id === selectedRoomTheme) ?? roomThemePresets[0]
  const activeFanRoomType =
    fanRoomTypePresets.find((preset) => preset.id === selectedFanRoomType) ?? fanRoomTypePresets[0]
  const activeFanRoomUi = fanRoomTypeUi[selectedFanRoomType]
  const useRoomThemeSurface = currentView === 'fan'
  const isClassicRoomTheme = selectedRoomTheme === 'hub-classic'
  const creatorExperienceClasses = `banner-${bannerStyle} buttons-${buttonStyle} density-${cardDensity}`

  const creatorPreviewRoom: FanRoom[] =
    isCreatorLoggedIn && connectedChannel
      ? [
          {
            id: connectedChannel.room_slug,
            creator: connectedChannel.channel_title,
            label: connectedChannel.room_name,
            meta: communityFeed[0]?.title ?? '팬방 미리보기',
            joinedVia: '인플루언서 미리보기',
          },
        ]
      : []
  const displayedFanRooms =
    fanSession?.joined_rooms.length
      ? fanSession.joined_rooms.map((room) => ({
          id: room.room_slug,
          creator: room.creator_name,
          label: room.room_name,
          meta: '가입 완료된 팬방',
          joinedVia: room.joined_via,
        }))
      : creatorPreviewRoom
  const activeFanRoom =
    displayedFanRooms.find((room) => room.id === selectedFanRoomId) ?? displayedFanRooms[0] ?? null
  const selectedPlatformConfig = platformSetup[selectedPlatformName]
  const selectedPlatformLabels = platformFieldLabels[selectedPlatformName] ?? {
    client: '연결 값',
    secret: '보안 값',
  }
  const enabledPlatforms = platformCatalog.filter((platform) => platformSetup[platform.name]?.isEnabled)
  const connectedPlatforms = enabledPlatforms.filter((platform) => {
    if (platform.name === 'YouTube') {
      return connectedChannel !== null
    }

    if (platform.name === 'Instagram') {
      return Boolean(instagramAccountId.trim() && instagramAccessToken.trim())
    }

    if (platform.name === 'Discord') {
      return Boolean(discordWebhookUrl.trim())
    }

    return true
  })
  const publishablePlatforms = enabledPlatforms.filter((platform) =>
    publishComposerMode === 'video' ? platform.supportsVideo : platform.supportsPost,
  )
  const isInstagramSelectedForPublish = selectedPublishPlatforms.includes('Instagram')
  const youtubePublishHistory = publishHistory.filter((job) => job.platform === 'YOUTUBE')
  const youtubeShortsCount = youtubePublishHistory.filter((job) =>
    /shorts|쇼츠/i.test(job.title),
  ).length
  const youtubeLongformCount = Math.max(youtubePublishHistory.length - youtubeShortsCount, 0)
  const visibleFanFeed = communityFeed.filter((post) => !isTestCommunityPost(post)).slice(0, 10)
  const fanVideoHighlights = youtubeRecentVideos.slice(0, 5)
  const canWriteFanCommunity = Boolean(fanSession || isCreatorLoggedIn)
  const filteredFanFeed = visibleFanFeed.filter((post) => {
    if (fanBoardFilter === 'ALL') {
      return true
    }
    if (fanBoardFilter === 'BEST') {
      return post.highlighted
    }
    if (fanBoardFilter === 'MEME') {
      return post.post_type === 'FREE'
    }
    return post.post_type === fanBoardFilter
  })
  const selectedFanPost =
    filteredFanFeed.find((post) => post.post_id === selectedFanPostId) ?? filteredFanFeed[0] ?? null
  const fanBoardColumns = [
    filteredFanFeed.filter((_, index) => index % 2 === 0),
    filteredFanFeed.filter((_, index) => index % 2 === 1),
  ]
  const formatRelativeTime = (value: string) => {
    const target = new Date(value).getTime()
    if (Number.isNaN(target)) {
      return ''
    }

    const diffMinutes = Math.max(1, Math.floor((Date.now() - target) / 60000))
    if (diffMinutes < 60) {
      return `${diffMinutes}분 전`
    }

    const diffHours = Math.floor(diffMinutes / 60)
    if (diffHours < 24) {
      return `${diffHours}시간 전`
    }

    const diffDays = Math.floor(diffHours / 24)
    if (diffDays < 7) {
      return `${diffDays}일 전`
    }

    return new Date(value).toLocaleDateString('ko-KR', {
      month: 'numeric',
      day: 'numeric',
    })
  }
  const youtubeCommunityDraft = `${postTitle.trim() || '유튜브 커뮤니티 제목'}\n\n${postBody.trim() || '유튜브 커뮤니티 본문'}`
  const visibleStoreBoard = storeBoard.filter((item) => item.visible)
  const visibleEventBoard = eventBoard.filter((item) => item.visible)
  const fanTierCounts = {
    GENERAL: fanMembers.filter((member) => member.tier === 'GENERAL').length,
    VIP: fanMembers.filter((member) => member.tier === 'VIP').length,
    BIG_SPENDER: fanMembers.filter((member) => member.tier === 'BIG_SPENDER').length,
    CORE_CREW: fanMembers.filter((member) => member.tier === 'CORE_CREW').length,
  }

  const dashboardMetricCards = [
    {
      label: '연결 채널',
      value: connectedChannel ? '1개' : '0개',
      change: connectedChannel?.channel_title ?? '채널 연결 필요',
    },
    {
      label: '커뮤니티 글',
      value: `${communityFeed.filter((post) => !isTestCommunityPost(post)).length}개`,
      change: visibleFanFeed[0]?.title ?? '아직 등록 없음',
    },
    {
      label: '노출 굿즈',
      value: `${visibleStoreBoard.length}개`,
      change: visibleStoreBoard[0]?.name ?? '등록 상품 없음',
    },
    {
      label: '초대된 팬 수',
      value: inviteDashboard ? `${inviteDashboard.total_join_count}` : '0',
      change: inviteDashboard
        ? `멀티 팬 ${inviteDashboard.multi_room_fan_count}명`
        : '초대 링크 생성 후 집계',
    },
  ]
  const inviteSummaryCards = [
    {
      label: '초대 링크 오픈',
      value: `${inviteDashboard?.total_open_count ?? 0}`,
      meta: inviteDashboard ? '전체 링크 합산' : '생성된 링크 없음',
    },
    {
      label: '팬 가입 완료',
      value: `${inviteDashboard?.total_join_count ?? 0}`,
      meta: inviteDashboard ? '초대 링크 가입 수' : '가입 집계 대기',
    },
    {
      label: '다른 팬방 추가 가입',
      value: `${inviteDashboard?.multi_room_fan_count ?? 0}`,
      meta: inviteDashboard ? '멀티 팬 계정' : '멀티 팬 없음',
    },
  ]
  const fanTierSummaryCards = [
    { label: 'GENERAL', value: `${fanTierCounts.GENERAL}명`, meta: '기본 팬' },
    { label: 'VIP', value: `${fanTierCounts.VIP}명`, meta: '핵심 응원 팬' },
    { label: 'BIG_SPENDER', value: `${fanTierCounts.BIG_SPENDER}명`, meta: '굿즈/이벤트 강한 팬' },
    { label: 'CORE_CREW', value: `${fanTierCounts.CORE_CREW}명`, meta: '코어 팬 그룹' },
  ]
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
    if (!selectedPlatformConfig.clientValue.trim()) {
      updatePlatformSetup(selectedPlatformName, { statusLabel: '값 필요' })
      return
    }

    if (selectedPlatformName !== 'Discord' && !selectedPlatformConfig.secretValue.trim()) {
      updatePlatformSetup(selectedPlatformName, { statusLabel: '값 필요' })
      return
    }

    updatePlatformSetup(selectedPlatformName, { statusLabel: 'Ready' })
    if (selectedPlatformName === 'Discord') {
      setDiscordWebhookUrl(selectedPlatformConfig.clientValue)
    }
    if (selectedPlatformName === 'Instagram') {
      setInstagramAccountId(selectedPlatformConfig.clientValue)
      setInstagramAccessToken(selectedPlatformConfig.secretValue)
    }
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

  const openRoomSettingsSection = (section: RoomSettingsSection) => {
    setRoomSettingsSection(section)
    setCurrentView('room')
  }

  const openCreatorStart = () => {
    setCurrentView(isCreatorLoggedIn ? 'dashboard' : isFanLoggedIn ? 'fan' : 'signup')
  }

  const openCreatorOnboardingStep = (index: number) => {
    if (isCreatorLoggedIn) {
      if (index === 0) {
        setCurrentView('dashboard')
        return
      }
      if (index === 1) {
        setCurrentView('dashboard')
        return
      }
      openRoomSettingsSection('modules')
      return
    }

    if (index === 2) {
      setCurrentView('room')
      setRoomSettingsSection('modules')
      return
    }

    setCurrentView(index === 0 ? 'signup' : index === 1 ? 'room' : 'dashboard')
  }

  const isFanLoggedIn = fanSession !== null
  const headerSubtitle = isCreatorLoggedIn
    ? 'Influencer Control Room'
    : isFanLoggedIn
      ? 'Fan Membership Pass'
      : 'Influencer Room OS'
  const headerAccountLabel = isCreatorLoggedIn
    ? connectedChannel?.channel_title ?? '내 계정'
    : isFanLoggedIn
      ? fanSession?.nickname ?? '팬 계정'
      : ''
  const headerAccountMeta = isCreatorLoggedIn
    ? '인플루언서'
    : isFanLoggedIn
      ? `${fanSession?.joined_rooms.length ?? 0}개 팬방`
      : ''
  const headerTabs: Array<[View, string]> = isCreatorLoggedIn
    ? [
        ['home', '홈'],
        ['room', '설정'],
        ['dashboard', '운영'],
        ['fan', '팬 화면'],
      ]
    : isFanLoggedIn
      ? [['home', '홈'], ['fan', '내 팬방'], ['invite', '초대 링크']]
      : [
          ['home', '홈'],
          ['signup', '로그인'],
        ]

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
      setSelectedFanRoomType(data.room_layout_type ?? 'community-board')
      setDiscordWebhookUrl(data.discord_webhook_url ?? '')
      setInstagramAccountId(data.instagram_account_id ?? '')
      setInstagramAccessToken(data.instagram_access_token ?? '')
      setPlatformSetup((current) => ({
        ...current,
        Discord: {
          ...current.Discord,
          clientValue: data.discord_webhook_url ?? '',
          isEnabled: data.discord_enabled,
          statusLabel: data.discord_enabled ? 'Connected' : 'Inactive',
        },
        Instagram: {
          ...current.Instagram,
          clientValue: data.instagram_account_id ?? '',
          secretValue: data.instagram_access_token ?? '',
          isEnabled: data.instagram_enabled,
          statusLabel: data.instagram_enabled ? 'Connected' : 'Inactive',
        },
      }))
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

  const loadYoutubeRecentVideos = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/v1/youtube/latest-videos?limit=5`)
      if (!response.ok) {
        throw new Error('최신 유튜브 영상을 불러오지 못했습니다.')
      }

      const data = (await response.json()) as YoutubeRecentVideoApiItem[]
      setYoutubeRecentVideos(
        data.map((item) => ({
          videoId: item.video_id,
          title: item.title,
          description: item.description,
          thumbnailUrl: item.thumbnail_url,
          watchUrl: item.watch_url,
          publishedAt: item.published_at,
          liveBroadcastContent: item.live_broadcast_content,
        })),
      )
    } catch {
      setYoutubeRecentVideos([])
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

  const loadRoomCommunityPosts = async (roomSlug?: string) => {
    const targetRoomSlug = roomSlug ?? selectedFanRoomId
    if (!targetRoomSlug) {
      setCommunityFeed([])
      return
    }

    try {
      const fanSessionToken = localStorage.getItem(fanSessionStorageKey)
      const response = await fetch(
        `${apiBaseUrl}/api/v1/community/rooms/${targetRoomSlug}/posts?sort=${fanFeedSort}`,
        {
          headers: fanSessionToken
            ? {
                Authorization: `Bearer ${fanSessionToken}`,
              }
            : undefined,
        },
      )
      if (!response.ok) {
        throw new Error('팬방 글을 불러오지 못했습니다.')
      }
      const data = (await response.json()) as CommunityPostItem[]
      setCommunityFeed(data)
    } catch {
      setCommunityFeed([])
    }
  }

  const loadFanComments = async (postId: number) => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/v1/community/posts/${postId}/comments`)
      if (!response.ok) {
        throw new Error('댓글을 불러오지 못했습니다.')
      }
      const data = (await response.json()) as CommunityCommentItem[]
      setFanCommentsByPostId((current) => ({ ...current, [postId]: data }))
    } catch {
      setFanCommentsByPostId((current) => ({ ...current, [postId]: [] }))
    }
  }

  const startEditingCommunityPost = (post: CommunityPostItem) => {
    setEditingCommunityPostId(post.post_id)
    setPostTitle(post.title)
    setPostBody(post.content)
    setPostPreviewUrl(post.image_url ?? null)
    setPostStatus('수정 모드로 불러왔습니다.')
    setCurrentView('community')
  }

  const resetCommunityComposer = () => {
    setEditingCommunityPostId(null)
    setPostTitle('오늘 유튜브 커뮤니티에 올릴 한 줄')
    setPostBody('본편 올라가기 전에 현장 스틸 먼저 올립니다. 오늘 밤 라이브에서 비하인드 더 풀게요.')
    setSelectedPostImage(null)
    setPostPreviewUrl(null)
    setPostStatus('새 게시글 작성 모드입니다.')
  }

  const handleCreateFanPost = async () => {
    const fanSessionToken = localStorage.getItem(fanSessionStorageKey)
    const creatorSessionToken = localStorage.getItem(creatorSessionStorageKey)
    if (!fanSessionToken && !creatorSessionToken) {
      setFanPostStatus('먼저 로그인해 주세요.')
      return
    }

    if (!selectedFanRoomId) {
      setFanPostStatus('먼저 팬방을 선택해 주세요.')
      return
    }

    if (!fanPostTitle.trim()) {
      setFanPostStatus('게시글 제목이 필요합니다.')
      return
    }

    if (!fanPostBody.trim()) {
      setFanPostStatus('게시글 본문이 필요합니다.')
      return
    }

    setFanPostStatus('팬 게시글을 올리는 중입니다...')

    try {
      const requestBody = JSON.stringify({
        title: fanPostTitle.trim(),
        content: fanPostBody.trim(),
      })
      const response = fanSessionToken
        ? await fetch(`${apiBaseUrl}/api/v1/community/rooms/${selectedFanRoomId}/posts`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${fanSessionToken}`,
              'Content-Type': 'application/json',
            },
            body: requestBody,
          })
        : await fetch(`${apiBaseUrl}/api/v1/community/mine`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${creatorSessionToken}`,
              'Content-Type': 'application/json',
            },
            body: requestBody,
          })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || '팬 게시글 등록에 실패했습니다.')
      }

      const createdPost = (await response.json()) as CommunityPostItem
      setCommunityFeed((current) => [createdPost, ...current])
      setFanBoardFilter('ALL')
      setSelectedFanPostId(createdPost.post_id)
      void loadFanComments(createdPost.post_id)
      setFanPostTitle('')
      setFanPostBody('')
      setFanPostStatus('팬 게시글 등록 완료')
    } catch (error) {
      const message = error instanceof Error ? error.message : '팬 게시글 등록에 실패했습니다.'
      setFanPostStatus(message)
    }
  }

  const handleToggleFanReaction = async (postId: number) => {
    const fanSessionToken = localStorage.getItem(fanSessionStorageKey)
    if (!fanSessionToken) {
      setFanPostStatus('팬 로그인 후 추천할 수 있습니다.')
      return
    }

    try {
      const response = await fetch(`${apiBaseUrl}/api/v1/community/posts/${postId}/reactions/toggle`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${fanSessionToken}`,
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || '추천 처리에 실패했습니다.')
      }

      const data = (await response.json()) as { post_id: number; like_count: number; liked_by_viewer: boolean }
      setCommunityFeed((current) =>
        current.map((post) =>
          post.post_id === data.post_id
            ? { ...post, like_count: data.like_count, liked_by_viewer: data.liked_by_viewer }
            : post,
        ),
      )
    } catch (error) {
      const message = error instanceof Error ? error.message : '추천 처리에 실패했습니다.'
      setFanPostStatus(message)
    }
  }

  const handleCreateFanComment = async (postId: number) => {
    const fanSessionToken = localStorage.getItem(fanSessionStorageKey)
    if (!fanSessionToken) {
      setFanPostStatus('팬 로그인 후 댓글을 달 수 있습니다.')
      return
    }

    const draft = fanCommentDrafts[postId]?.trim() ?? ''
    if (!draft) {
      setFanPostStatus('댓글 내용을 입력해 주세요.')
      return
    }

    try {
      const response = await fetch(`${apiBaseUrl}/api/v1/community/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${fanSessionToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: draft,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || '댓글 등록에 실패했습니다.')
      }

      const data = (await response.json()) as CommunityCommentItem
      setFanCommentsByPostId((current) => ({
        ...current,
        [postId]: [...(current[postId] ?? []), data],
      }))
      setCommunityFeed((current) =>
        current.map((post) =>
          post.post_id === postId ? { ...post, comment_count: post.comment_count + 1 } : post,
        ),
      )
      setFanCommentDrafts((current) => ({ ...current, [postId]: '' }))
      setFanPostStatus('댓글 등록 완료')
    } catch (error) {
      const message = error instanceof Error ? error.message : '댓글 등록에 실패했습니다.'
      setFanPostStatus(message)
    }
  }

  const handleToggleCommunityHighlight = async (post: CommunityPostItem) => {
    const creatorSessionToken = localStorage.getItem(creatorSessionStorageKey)
    if (!creatorSessionToken) {
      setPostStatus('먼저 인플루언서 로그인이 필요합니다.')
      return
    }

    try {
      const response = await fetch(`${apiBaseUrl}/api/v1/community/mine/${post.post_id}/highlight`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${creatorSessionToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          highlighted: !post.highlighted,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || '베스트 글 상태 변경에 실패했습니다.')
      }

      const updated = (await response.json()) as CommunityPostItem
      setCommunityFeed((current) => current.map((item) => (item.post_id === updated.post_id ? updated : item)))
      setPostStatus(updated.highlighted ? '베스트 글로 고정했습니다.' : '베스트 고정을 해제했습니다.')
    } catch (error) {
      const message = error instanceof Error ? error.message : '베스트 글 상태 변경에 실패했습니다.'
      setPostStatus(message)
    }
  }

  const handleReportCommunityPost = async (postId: number) => {
    const fanSessionToken = localStorage.getItem(fanSessionStorageKey)
    if (!fanSessionToken) {
      setFanPostStatus('팬 로그인 후 신고할 수 있습니다.')
      return
    }

    try {
      const response = await fetch(`${apiBaseUrl}/api/v1/community/posts/${postId}/report`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${fanSessionToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reason: '팬 신고',
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || '게시글 신고에 실패했습니다.')
      }

      setCommunityFeed((current) =>
        current.map((post) =>
          post.post_id === postId ? { ...post, report_count: post.report_count + 1 } : post,
        ),
      )
      setFanPostStatus('게시글 신고 접수 완료')
    } catch (error) {
      const message = error instanceof Error ? error.message : '게시글 신고에 실패했습니다.'
      setFanPostStatus(message)
    }
  }

  const handleUpdateCommunityPost = async () => {
    const creatorSessionToken = localStorage.getItem(creatorSessionStorageKey)
    if (!creatorSessionToken || editingCommunityPostId === null) {
      setPostStatus('수정할 게시글이 없습니다.')
      return
    }

    try {
      const response = await fetch(`${apiBaseUrl}/api/v1/community/mine/${editingCommunityPostId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${creatorSessionToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: postTitle,
          content: postBody,
          image_url: postPreviewUrl,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || '게시글을 수정하지 못했습니다.')
      }

      const updated = (await response.json()) as CommunityPostItem
      setCommunityFeed((previous) => previous.map((item) => (item.post_id === updated.post_id ? updated : item)))
      setPostStatus('게시글이 수정되었습니다.')
      setEditingCommunityPostId(null)
    } catch (error) {
      const message = error instanceof Error ? error.message : '게시글을 수정하지 못했습니다.'
      setPostStatus(message)
    }
  }

  const handleDeleteCommunityPost = async (postId: number) => {
    const creatorSessionToken = localStorage.getItem(creatorSessionStorageKey)
    if (!creatorSessionToken) {
      setPostStatus('먼저 인플루언서 로그인이 필요합니다.')
      return
    }

    try {
      const response = await fetch(`${apiBaseUrl}/api/v1/community/mine/${postId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${creatorSessionToken}`,
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || '게시글을 삭제하지 못했습니다.')
      }

      setCommunityFeed((previous) => previous.filter((item) => item.post_id !== postId))
      if (editingCommunityPostId === postId) {
        resetCommunityComposer()
      }
      setPostStatus('게시글이 삭제되었습니다.')
    } catch (error) {
      const message = error instanceof Error ? error.message : '게시글을 삭제하지 못했습니다.'
      setPostStatus(message)
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

  const handleCreateEvent = async () => {
    const creatorSessionToken = localStorage.getItem(creatorSessionStorageKey)
    if (!creatorSessionToken) {
      setEventStatus('먼저 인플루언서 로그인이 필요합니다.')
      return
    }

    if (!eventTitle.trim() || !eventDetail.trim()) {
      setEventStatus('이벤트 제목과 설명을 입력해주세요.')
      return
    }

    setIsSavingEvent(true)
    setEventStatus('이벤트를 저장하는 중입니다...')

    try {
      const isEditing = editingEventId !== null
      const response = await fetch(`${apiBaseUrl}/api/v1/events/mine${isEditing ? `/${editingEventId}` : ''}`, {
        method: isEditing ? 'PATCH' : 'POST',
        headers: {
          Authorization: `Bearer ${creatorSessionToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: eventTitle,
          detail: eventDetail,
          schedule_label: eventScheduleLabel,
          visible: true,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || '이벤트를 저장하지 못했습니다.')
      }

      const saved = (await response.json()) as EventSummaryItem
      setEventBoard((previous) => {
        if (isEditing) {
          return previous.map((item) => (item.event_id === saved.event_id ? saved : item))
        }
        return [saved, ...previous]
      })
      setEventTitle('')
      setEventDetail('')
      setEventScheduleLabel('오늘')
      setEditingEventId(null)
      setEventStatus(isEditing ? '이벤트가 수정되었습니다.' : '이벤트가 등록되었습니다.')
    } catch (error) {
      const message = error instanceof Error ? error.message : '이벤트를 저장하지 못했습니다.'
      setEventStatus(message)
    } finally {
      setIsSavingEvent(false)
    }
  }

  const startEditingEvent = (item: EventSummaryItem) => {
    setEditingEventId(item.event_id)
    setEventTitle(item.title)
    setEventDetail(item.detail)
    setEventScheduleLabel(item.schedule_label)
    setEventStatus('수정 모드로 불러왔습니다.')
  }

  const resetEventComposer = () => {
    setEditingEventId(null)
    setEventTitle('')
    setEventDetail('')
    setEventScheduleLabel('오늘')
    setEventStatus('새 이벤트 등록 모드입니다.')
  }

  const handleToggleEventVisibility = async (item: EventSummaryItem) => {
    const creatorSessionToken = localStorage.getItem(creatorSessionStorageKey)
    if (!creatorSessionToken) {
      setEventStatus('먼저 인플루언서 로그인이 필요합니다.')
      return
    }

    try {
      const response = await fetch(`${apiBaseUrl}/api/v1/events/mine/${item.event_id}/visibility`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${creatorSessionToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ visible: !item.visible }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || '노출 상태를 바꾸지 못했습니다.')
      }

      const updated = (await response.json()) as EventSummaryItem
      setEventBoard((previous) => previous.map((current) => (current.event_id === updated.event_id ? updated : current)))
      setEventStatus(updated.visible ? '팬 일정 노출로 변경되었습니다.' : '팬 일정 숨김으로 변경되었습니다.')
    } catch (error) {
      const message = error instanceof Error ? error.message : '노출 상태를 바꾸지 못했습니다.'
      setEventStatus(message)
    }
  }

  const handleDeleteEvent = async (eventId: number) => {
    const creatorSessionToken = localStorage.getItem(creatorSessionStorageKey)
    if (!creatorSessionToken) {
      setEventStatus('먼저 인플루언서 로그인이 필요합니다.')
      return
    }

    try {
      const response = await fetch(`${apiBaseUrl}/api/v1/events/mine/${eventId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${creatorSessionToken}`,
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || '이벤트 삭제에 실패했습니다.')
      }

      setEventBoard((previous) => previous.filter((item) => item.event_id !== eventId))
      if (editingEventId === eventId) {
        resetEventComposer()
      }
      setEventStatus('이벤트가 삭제되었습니다.')
    } catch (error) {
      const message = error instanceof Error ? error.message : '이벤트 삭제에 실패했습니다.'
      setEventStatus(message)
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

  const handleImportStoreLink = async () => {
    const creatorSessionToken = localStorage.getItem(creatorSessionStorageKey)
    if (!creatorSessionToken) {
      setStoreImportStatus('먼저 인플루언서 로그인이 필요합니다.')
      return
    }

    if (!storeSourceUrl.trim()) {
      setStoreImportStatus('가져올 상품 링크를 먼저 넣어주세요.')
      return
    }

    setIsImportingStoreLink(true)
    setStoreImportStatus('링크에서 상품 정보를 불러오는 중입니다...')

    try {
      const response = await fetch(`${apiBaseUrl}/api/v1/store/import-preview`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${creatorSessionToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source_url: storeSourceUrl,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || '상품 링크를 읽어오지 못했습니다.')
      }

      const data = (await response.json()) as StoreImportPreview
      setStoreImportPreview(data)
      setStoreProductName(data.product_name)
      setStoreProductDescription(data.description)
      setStoreProductImageUrl(data.image_url)
      setStoreProductPriceText(data.price_text)
      setStoreProductSourceLabel(data.source_label)
      setStoreProductStatusLabel('판매 링크 연결')
      setStoreProductSalesLabel('외부 스토어 판매')
      setStoreImportStatus(data.note)
    } catch (error) {
      const message = error instanceof Error ? error.message : '상품 링크를 읽어오지 못했습니다.'
      setStoreImportPreview(null)
      setStoreImportStatus(message)
    } finally {
      setIsImportingStoreLink(false)
    }
  }

  const handleCreateStoreProduct = async () => {
    const creatorSessionToken = localStorage.getItem(creatorSessionStorageKey)
    if (!creatorSessionToken) {
      setStoreSaveStatus('먼저 인플루언서 로그인이 필요합니다.')
      return
    }

    if (!storeProductName.trim()) {
      setStoreSaveStatus('상품 이름이 필요합니다.')
      return
    }

    setIsSavingStoreProduct(true)
    setStoreSaveStatus('상품을 저장하는 중입니다...')

    try {
      const isEditing = editingStoreProductId !== null
      const response = await fetch(
        `${apiBaseUrl}/api/v1/store/mine${isEditing ? `/${editingStoreProductId}` : ''}`,
        {
          method: isEditing ? 'PATCH' : 'POST',
        headers: {
          Authorization: `Bearer ${creatorSessionToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: storeProductName,
          description: storeProductDescription,
          image_url: storeProductImageUrl,
          external_url: storeSourceUrl,
          price_text: storeProductPriceText,
          status_label: storeProductStatusLabel,
          sales_label: storeProductSalesLabel,
          source_label: storeProductSourceLabel,
          visible: true,
        }),
        },
      )

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || '상품 등록에 실패했습니다.')
      }

      const savedProduct = (await response.json()) as StoreItemSummary
      setStoreBoard((previous) => {
        if (isEditing) {
          return previous.map((item) => (item.product_id === savedProduct.product_id ? savedProduct : item))
        }
        return [savedProduct, ...previous]
      })
      setStoreSaveStatus(isEditing ? '상품이 수정되었습니다.' : '상품이 등록되었습니다.')
      if (!storeImportPreview) {
        setStoreSourceUrl('')
      }
      setStoreImportPreview(null)
      setEditingStoreProductId(null)
      setStoreProductName('')
      setStoreProductDescription('')
      setStoreProductImageUrl('')
      setStoreProductPriceText('')
      setStoreProductStatusLabel('판매 준비')
      setStoreProductSalesLabel('외부 링크 판매')
      setStoreProductSourceLabel('직접 등록')
    } catch (error) {
      const message = error instanceof Error ? error.message : '상품 등록에 실패했습니다.'
      setStoreSaveStatus(message)
    } finally {
      setIsSavingStoreProduct(false)
    }
  }

  const handleUploadStoreImage = async () => {
    const creatorSessionToken = localStorage.getItem(creatorSessionStorageKey)
    if (!creatorSessionToken) {
      setStoreSaveStatus('먼저 인플루언서 로그인이 필요합니다.')
      return
    }

    if (!storeProductImageFile) {
      setStoreSaveStatus('업로드할 이미지 파일을 먼저 선택해 주세요.')
      return
    }

    setIsUploadingStoreImage(true)
    setStoreSaveStatus('상품 이미지를 업로드하는 중입니다...')

    try {
      const formData = new FormData()
      formData.append('file', storeProductImageFile)

      const response = await fetch(`${apiBaseUrl}/api/v1/store/upload-image`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${creatorSessionToken}`,
        },
        body: formData,
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || '이미지 업로드에 실패했습니다.')
      }

      const data = (await response.json()) as StoreImageUploadResponse
      setStoreProductImageUrl(data.image_url)
      setStoreSaveStatus('이미지 업로드 완료')
    } catch (error) {
      const message = error instanceof Error ? error.message : '이미지 업로드에 실패했습니다.'
      setStoreSaveStatus(message)
    } finally {
      setIsUploadingStoreImage(false)
    }
  }

  const startEditingStoreProduct = (item: StoreItemSummary) => {
    setEditingStoreProductId(item.product_id)
    setStoreSourceUrl(item.external_url ?? '')
    setStoreProductName(item.name)
    setStoreProductDescription(item.description ?? '')
    setStoreProductImageUrl(item.image_url ?? '')
    setStoreProductImageFile(null)
    setStoreProductPriceText(item.price_text ?? '')
    setStoreProductStatusLabel(item.status_label ?? '판매 준비')
    setStoreProductSalesLabel(item.sales_label ?? '외부 링크 판매')
    setStoreProductSourceLabel(item.source_label ?? '직접 등록')
    setStoreSaveStatus('수정 모드로 불러왔습니다.')
  }

  const resetStoreComposer = () => {
    setEditingStoreProductId(null)
    setStoreImportPreview(null)
    setStoreSourceUrl('')
    setStoreProductName('')
    setStoreProductDescription('')
    setStoreProductImageUrl('')
    setStoreProductImageFile(null)
    setStoreProductPriceText('')
    setStoreProductStatusLabel('판매 준비')
    setStoreProductSalesLabel('외부 링크 판매')
    setStoreProductSourceLabel('직접 등록')
    setStoreSaveStatus('새 상품 등록 모드입니다.')
  }

  const handleToggleStoreVisibility = async (item: StoreItemSummary) => {
    const creatorSessionToken = localStorage.getItem(creatorSessionStorageKey)
    if (!creatorSessionToken) {
      setStoreSaveStatus('먼저 인플루언서 로그인이 필요합니다.')
      return
    }

    try {
      const response = await fetch(`${apiBaseUrl}/api/v1/store/mine/${item.product_id}/visibility`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${creatorSessionToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          visible: !item.visible,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || '노출 상태를 바꾸지 못했습니다.')
      }

      const updated = (await response.json()) as StoreItemSummary
      setStoreBoard((previous) => previous.map((current) => (current.product_id === updated.product_id ? updated : current)))
      setStoreSaveStatus(updated.visible ? '팬 화면 노출로 변경되었습니다.' : '팬 화면 숨김으로 변경되었습니다.')
    } catch (error) {
      const message = error instanceof Error ? error.message : '노출 상태를 바꾸지 못했습니다.'
      setStoreSaveStatus(message)
    }
  }

  const handleDeleteStoreProduct = async (productId: number) => {
    const creatorSessionToken = localStorage.getItem(creatorSessionStorageKey)
    if (!creatorSessionToken) {
      setStoreSaveStatus('먼저 인플루언서 로그인이 필요합니다.')
      return
    }

    try {
      const response = await fetch(`${apiBaseUrl}/api/v1/store/mine/${productId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${creatorSessionToken}`,
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || '상품 삭제에 실패했습니다.')
      }

      setStoreBoard((previous) => previous.filter((item) => item.product_id !== productId))
      if (editingStoreProductId === productId) {
        resetStoreComposer()
      }
      setStoreSaveStatus('상품이 삭제되었습니다.')
    } catch (error) {
      const message = error instanceof Error ? error.message : '상품 삭제에 실패했습니다.'
      setStoreSaveStatus(message)
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
      setUploadError('게시글 제목을 입력하세요.')
      return
    }

    if (!postBody.trim()) {
      setUploadError('게시글 본문을 입력하세요.')
      return
    }

    try {
      setUploadError('')
      setInstagramPublishResult(null)

      const completedChannels: string[] = []

      if (selectedPublishPlatforms.includes('Instagram')) {
        const creatorSessionToken = localStorage.getItem(creatorSessionStorageKey)

        if (!creatorSessionToken) {
          throw new Error('Instagram 배포에는 인플루언서 로그인이 필요합니다.')
        }

        if (!instagramMediaUrl.trim()) {
          throw new Error('Instagram은 공개 이미지 URL이 필요합니다.')
        }

        setInstagramPublishStatus('Instagram으로 발행 중')

        const instagramResponse = await fetch(`${apiBaseUrl}/api/v1/instagram/publish`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${creatorSessionToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: postTitle.trim(),
            caption: postBody.trim(),
            mediaUrl: instagramMediaUrl.trim(),
          }),
        })

        if (!instagramResponse.ok) {
          const errorPayload = (await instagramResponse.json().catch(() => null)) as
            | { message?: string }
            | null
          throw new Error(errorPayload?.message ?? 'Instagram 게시글을 배포하지 못했습니다.')
        }

        const instagramData = (await instagramResponse.json()) as InstagramPublishResult
        setInstagramPublishResult(instagramData)
        setInstagramPublishStatus('Instagram 배포 완료')
        completedChannels.push('Instagram')
      } else {
        setInstagramPublishStatus('Instagram 미선택')
      }

      try {
        await navigator.clipboard.writeText(youtubeCommunityDraft)
        setPostStatus(
          completedChannels.length > 0
            ? `${completedChannels.join(' · ')} 배포 완료 · 초안 복사 완료`
            : '커뮤니티 초안 복사 완료',
        )
      } catch {
        setPostStatus(
          completedChannels.length > 0
            ? `${completedChannels.join(' · ')} 배포 완료`
            : '초안 준비 완료',
        )
        setUploadError('복사는 브라우저 권한 문제로 실패했습니다. 아래 초안을 직접 복사하면 됩니다.')
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : '게시글 배포에 실패했습니다.'
      setPostStatus('게시글 작업 실패')
      setInstagramPublishStatus('Instagram 배포 실패')
      setUploadError(message)
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
      if (selectedPublishPlatforms.includes('Discord')) {
        const creatorSessionToken = localStorage.getItem(creatorSessionStorageKey)
        if (creatorSessionToken) {
          const discordResponse = await fetch(`${apiBaseUrl}/api/v1/discord/publish`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${creatorSessionToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              title: `${data.title} 업로드 완료`,
              body: `${data.privacy_status} 상태로 업로드되었습니다.`,
              targetUrl: data.watch_url,
            }),
          })

          if (!discordResponse.ok) {
            const discordPayload = (await discordResponse.json().catch(() => null)) as { message?: string } | null
            setUploadError(discordPayload?.message ?? 'Discord 동시 배포에 실패했습니다.')
          }
        }
      }
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
      setCurrentView('dashboard')
      setAuthFeedback('구글 로그인 완료, 연결된 유튜브 채널 정보를 불러왔습니다.')
      void loadLatestConnection()
    }

    if (youtubeState === 'error') {
      setCurrentView('signup')
      setAuthFeedback(message || '구글 로그인 중 오류가 발생했습니다.')
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
        setCurrentView('dashboard')
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

  useEffect(() => {
    if (currentView !== 'fan') {
      return
    }

    if (selectedFanRoomId) {
      void loadRoomCommunityPosts(selectedFanRoomId)
    }
  }, [currentView, selectedFanRoomId, fanFeedSort])

  useEffect(() => {
    if (filteredFanFeed.length === 0) {
      setSelectedFanPostId(null)
      return
    }

    if (!filteredFanFeed.some((post) => post.post_id === selectedFanPostId)) {
      setSelectedFanPostId(filteredFanFeed[0].post_id)
    }
  }, [filteredFanFeed, selectedFanPostId])

  useEffect(() => {
    if (currentView !== 'fan' && !isCreatorLoggedIn) {
      return
    }

    void loadYoutubeRecentVideos()
  }, [currentView, isCreatorLoggedIn, connectedChannel?.channel_id])

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
    if (currentView === 'features') {
      setRoomSettingsSection('modules')
    }
  }, [currentView])

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
    setSelectedPublishPlatforms((current) => {
      const next = current.filter((platformName) =>
        publishablePlatforms.some((platform) => platform.name === platformName),
      )
      return next.length === current.length ? current : next
    })
  }, [publishComposerMode, platformSetup])

  useEffect(() => {
    const nextDefaultBoard = activeFanRoomUi.boards[0]?.key ?? 'ALL'
    const hasCurrentBoard = activeFanRoomUi.boards.some((board) => board.key === fanBoardFilter)
    if (!hasCurrentBoard) {
      setFanBoardFilter(nextDefaultBoard)
    }
  }, [selectedFanRoomType])

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
        room_layout_type: selectedFanRoomType,
        discord_webhook_url: discordWebhookUrl,
        discord_enabled: platformSetup.Discord.isEnabled,
        instagram_account_id: instagramAccountId,
        instagram_access_token: instagramAccessToken,
        instagram_enabled: platformSetup.Instagram.isEnabled,
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
    selectedFanRoomType,
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

  const accountMenuVisible = isCreatorLoggedIn || isFanLoggedIn

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
          {accountMenuVisible ? (
            <div className="role-menu-wrap" ref={roleMenuRef}>
              <button
                className="nav-account-chip"
                onClick={() => setIsRoleMenuOpen((current) => !current)}
                type="button"
              >
                <span className="nav-account-copy">
                  <strong>{headerAccountLabel}</strong>
                  <span>{headerAccountMeta}</span>
                </span>
              </button>
              {isRoleMenuOpen ? (
                <div className="role-menu-dropdown">
                  {isCreatorLoggedIn ? (
                    <button className="role-menu-item" onClick={handleCreatorLogout} type="button">
                      로그아웃
                    </button>
                  ) : null}
                  {isFanLoggedIn && !isCreatorLoggedIn ? (
                    <button className="role-menu-item" onClick={handleFanLogout} type="button">
                      로그아웃
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
                <strong>{activeFanRoom?.creator ?? '없음'}</strong>
                <span className="stat-meta">{activeFanRoom?.label ?? '가입한 팬방이 없습니다.'}</span>
              </article>
              <article className="stat-card">
                <span className="stat-label">최근 입장 경로</span>
                <strong>{activeFanRoom ? 'Invite' : '대기'}</strong>
                <span className="stat-meta">{activeFanRoom?.joinedVia ?? '초대 링크 가입 후 표시됩니다.'}</span>
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

              {displayedFanRooms.length > 0 ? (
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
              ) : (
                <div className="notice-preview compact-highlight">
                  <span className="mini-label">가입한 팬방 없음</span>
                  <strong>아직 입장한 팬방이 없습니다.</strong>
                  <p>초대 링크를 통해 팬방에 가입하면 이 목록에 자동으로 추가됩니다.</p>
                </div>
              )}
            </section>

            <section className="room-preview-card">
              <div className="preview-topbar">
                <div className="creator-chip">
                  <span className="chip-avatar">FAN</span>
                  <div>
                    <strong>{activeFanRoom?.creator ?? '팬방 미리보기'}</strong>
                    <span>{activeFanRoom?.joinedVia ?? '가입 후 최근 입장 경로가 표시됩니다.'}</span>
                  </div>
                </div>
                <button className="tiny-action" onClick={() => setCurrentView('fan')}>
                  팬방 열기
                </button>
              </div>

              <div className="role-home-stack">
                <article className="role-home-note">
                  <span className="section-label">최근 공지</span>
                  <strong>{visibleFanFeed[0]?.title ?? '아직 등록된 공지가 없습니다.'}</strong>
                  <p>{visibleFanFeed[0]?.content ?? '커뮤니티 글이 올라오면 여기서 바로 최근 소식을 확인할 수 있습니다.'}</p>
                </article>
                <article className="role-home-note">
                  <span className="section-label">다음 액션</span>
                  <strong>{visibleStoreBoard[0]?.name ?? visibleEventBoard[0]?.title ?? '다음 액션 대기 중'}</strong>
                  <p>
                    {visibleStoreBoard[0]?.description ??
                      visibleEventBoard[0]?.detail ??
                      '굿즈나 일정이 등록되면 팬 화면에서 바로 이어서 볼 수 있습니다.'}
                  </p>
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
            <h2>로그인</h2>
          </div>
          <span className="status-badge">LIVE UI</span>
        </div>

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
            <button className="primary-action auth-main-button" onClick={() => void startCreatorGoogleLogin()}>
              {isStartingGoogleLogin ? 'Google로 이동 중...' : 'Google로 로그인'}
            </button>
            <p className="auth-helper-copy">로그인하면 바로 인플루언서 채널 연결과 운영 화면으로 이어집니다.</p>
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

        <div className="notice-preview auth-status-card">
          <span className="mini-label">상태</span>
          <strong>{isCreatorLoggedIn ? authFeedback : fanStatus}</strong>
          <p>인플루언서는 여기서 로그인하고, 팬은 초대 링크를 통해 바로 팬방에 입장합니다.</p>
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
        <span className="section-label">SETTINGS HUB</span>
        <h2>설정</h2>
        <p>팬방 테마, 배포 채널, 운영 구성을 한 곳에서 관리합니다.</p>

        <div className="selection-summary settings-save-card">
          <span className="mini-label">현재 상태</span>
          <strong>{connectedChannel?.room_name ?? '팬방 기본 설정'} </strong>
          <p>
            테마 {activeRoomTheme.name} · 채널 {enabledPlatforms.length}개 활성화 · 기능 {selectedFeatures.length}개 사용 중
          </p>
        </div>

        <div className="inline-actions">
          <button className="primary-action" onClick={() => openRoomSettingsSection('theme')}>
            테마부터 보기
          </button>
          <button className="secondary-action" onClick={() => setCurrentView('content')}>
            채널로 돌아가기
          </button>
        </div>

        <div className="settings-nav-list">
          <button
            className={roomSettingsSection === 'theme' ? 'settings-nav-item active' : 'settings-nav-item'}
            onClick={() => setRoomSettingsSection('theme')}
            type="button"
          >
            <strong>팬방 테마 설정</strong>
            <span>컬러, 배너, 버튼, 카드 밀도</span>
          </button>
          <button
            className={roomSettingsSection === 'platforms' ? 'settings-nav-item active' : 'settings-nav-item'}
            onClick={() => setRoomSettingsSection('platforms')}
            type="button"
          >
            <strong>플랫폼 설정</strong>
            <span>연결값 입력, 테스트, 활성화 관리</span>
          </button>
          <button
            className={roomSettingsSection === 'modules' ? 'settings-nav-item active' : 'settings-nav-item'}
            onClick={() => setRoomSettingsSection('modules')}
            type="button"
          >
            <strong>운영 구성</strong>
            <span>필요한 기능만 켜고 화면 구성을 정리</span>
          </button>
        </div>
      </div>

      {roomSettingsSection === 'theme' ? (
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
      ) : null}

      {roomSettingsSection === 'platforms' ? (
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
            {selectedPlatformName === 'Discord' ? (
              <div className="notice-preview compact-highlight">
                <span className="mini-label">Discord 웹훅</span>
                <strong>Discord는 Webhook URL 하나로 바로 연결합니다.</strong>
                <p>Webhook URL을 넣고 연결 테스트 후 활성화하면, 콘텐츠 배포에서 선택해서 같이 보낼 수 있습니다.</p>
              </div>
            ) : null}
            {selectedPlatformName === 'Instagram' ? (
              <div className="notice-preview compact-highlight">
                <span className="mini-label">Instagram 발행 조건</span>
                <strong>지금은 이미지 피드 + 캡션 게시글만 연결합니다.</strong>
                <p>Instagram Account ID와 Long-lived Access Token을 넣고 활성화하면, 콘텐츠 배포에서 공개 이미지 URL 기준으로 실제 발행할 수 있습니다.</p>
              </div>
            ) : null}
          </section>
        </div>
      </section>
      ) : null}

      {roomSettingsSection === 'modules' ? (
        <div className="scene-card dark-card">
          <div className="dual-pane">
            <section className="editor-card">
              <span className="card-kicker">운영 구성</span>
              <h3>운영 방식에 맞는 기능만 선택</h3>
              <p className="settings-panel-copy">
                팬방에서 실제로 쓸 기능만 남기면 대시보드와 팬 화면이 더 선명하게 정리됩니다.
              </p>

              <div className="selection-summary settings-save-card">
                <span className="mini-label">팬방 유형</span>
                <strong>{activeFanRoomType.name}</strong>
                <p>{activeFanRoomType.purpose}</p>
              </div>

              <div className="room-type-grid">
                {fanRoomTypePresets.map((preset) => {
                  const selected = preset.id === selectedFanRoomType
                  return (
                    <button
                      className={selected ? 'room-type-card active' : 'room-type-card'}
                      key={preset.id}
                      onClick={() => setSelectedFanRoomType(preset.id)}
                      type="button"
                    >
                      <div className="feature-card-top">
                        <span className="mini-label">{selected ? '선택됨' : '팬방 유형'}</span>
                        <span className={selected ? 'toggle on' : 'toggle'}>{selected ? 'ON' : 'OFF'}</span>
                      </div>
                      <strong>{preset.name}</strong>
                      <p>{preset.description}</p>
                      <span className="feature-metric">{preset.recommendedFor}</span>
                    </button>
                  )
                })}
              </div>

              <div className="selection-summary settings-save-card">
                <span className="mini-label">현재 활성화</span>
                <strong>{selectedFeatures.length}개 모듈 선택됨</strong>
                <p>{selectedFeatures.join(' · ')}</p>
              </div>

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
                        <span className={enabled ? 'toggle on' : 'toggle'}>{enabled ? 'ON' : 'OFF'}</span>
                      </div>
                      <strong>{feature.name}</strong>
                      <p>{feature.description}</p>
                      <span className="feature-metric">{feature.liveMetric}</span>
                    </button>
                  )
                })}
              </div>
            </section>

            <section className="editor-card accent">
              <span className="card-kicker">적용 결과</span>
              <div className="notice-preview compact-highlight">
                <span className="mini-label">선택한 팬방 유형</span>
                <strong>{activeFanRoomType.name}</strong>
                <p>{activeFanRoomType.description}</p>
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
                <span className="mini-label">운영 메모</span>
                <strong>필요 없는 기능은 꺼두는 편이 더 깔끔합니다.</strong>
                <p>팬 화면과 운영 대시보드에서 실제로 쓰는 카드만 남겨서 진입 흐름을 가볍게 유지합니다.</p>
              </div>

              <div className="inline-actions">
                <button className="primary-action" onClick={goToDashboard}>
                  대시보드 시작하기
                </button>
                <button className="secondary-action" onClick={() => setRoomSettingsSection('theme')}>
                  테마로 돌아가기
                </button>
              </div>
            </section>
          </div>
        </div>
      ) : null}
    </section>
  )

  const renderDashboard = () => (
    <section className={`dashboard-shell creator-workspace ${creatorExperienceClasses}`}>
      {renderDashboardSidebar('overview')}

      <div className="dashboard-main">
        <div className="metrics-grid">
          {dashboardMetricCards.map((metric) => (
            <article className="metric-card" key={metric.label}>
              <span className="mini-label">{metric.label}</span>
              <strong>{metric.value}</strong>
              <span className="metric-change">{metric.change}</span>
            </article>
          ))}
        </div>

        <div className="dashboard-panels">
          <section className="summary-panel">
            <div className="panel-head">
              <div>
                <span className="card-kicker">팬방 스냅샷</span>
                <h3>지금 운영 중인 구성</h3>
              </div>
              <button className="tiny-action" onClick={() => openRoomSettingsSection('modules')}>
                운영 구성 수정
              </button>
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
              <span className="mini-label">자동 공지 상태</span>
              <strong>새 영상 업로드 시 팬방 공지가 같이 생성됩니다</strong>
              <p>
                YouTube 업로드 감지 후 제목과 링크가 반영된 공지 카드가 자동으로 붙습니다.
              </p>
            </div>
          </section>

          <section className="summary-panel">
            <div className="panel-head">
              <div>
                <span className="card-kicker">팬 초대</span>
                <h3>링크 성과와 빠른 생성</h3>
              </div>
            </div>

            <div className="selected-module-list">
              {inviteSummaryCards.map((card) => (
                <div className="selected-module" key={card.label}>
                  <div>
                    <strong>{card.label}</strong>
                    <span>{card.meta}</span>
                  </div>
                  <strong>{card.value}</strong>
                </div>
              ))}
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
                <span className="card-kicker">최근 초대 링크</span>
                <h3>바로 확인할 링크 목록</h3>
              </div>
            </div>

            <div className="activity-list">
              {inviteDashboard?.invite_links.length ? (
                inviteDashboard.invite_links.slice(0, 3).map((item) => {
                if ('invite_link_id' in item) {
                  return (
                    <article className="activity-card" key={item.invite_link_id}>
                      <span className="activity-time">{item.invite_code}</span>
                      <strong>{item.title}</strong>
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
                return null
                })
              ) : (
                <div className="notice-preview compact-highlight">
                  <span className="mini-label">최근 초대 링크 없음</span>
                  <strong>아직 생성된 초대 링크가 없습니다.</strong>
                  <p>위에서 링크 제목과 유입 위치를 정한 뒤 첫 초대 링크를 만들어보세요.</p>
                </div>
              )}
            </div>
          </section>

          <section className="summary-panel">
            <div className="panel-head">
              <div>
                <span className="card-kicker">팬 등급</span>
                <h3>핵심 팬 그룹 현황</h3>
              </div>
            </div>

            <div className="activity-list">
              {fanMembers.length > 0 ? (
                fanMembers.slice(0, 4).map((fanMember) => (
                  <article className="activity-card" key={fanMember.membership_id || fanMember.fan_email}>
                    <span className="activity-time">{fanMember.joined_via}</span>
                    <strong>{fanMember.fan_nickname}</strong>
                    <p>{fanMember.tier} · {fanMember.fan_email}</p>
                    <div className="inline-actions compact-actions">
                      {['GENERAL', 'VIP', 'BIG_SPENDER', 'CORE_CREW'].map((tier) => (
                        <button
                          className="tiny-action"
                          key={tier}
                          onClick={() => void handleUpdateFanTier(fanMember.membership_id, tier)}
                        >
                          {tier}
                        </button>
                      ))}
                    </div>
                  </article>
                ))
              ) : (
                <div className="notice-preview compact-highlight">
                  <span className="mini-label">팬 그룹 없음</span>
                  <strong>아직 분류된 팬 멤버가 없습니다.</strong>
                  <p>초대 링크로 팬이 들어오면 여기서 등급을 나눠 운영할 수 있습니다.</p>
                </div>
              )}
            </div>

            <div className="selected-module-list">
              {fanTierSummaryCards.map((card) => (
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
              <span className="mini-label">등급 운영 메모</span>
              <strong>{fanTierStatus}</strong>
              <p>VIP, 큰손, 코어 팬 그룹을 나눠두면 이벤트와 굿즈 오픈 대상을 더 쉽게 나눌 수 있습니다.</p>
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
      <p>채널 운영, 플랫폼 연결, 배포 작업을 같은 허브 안에서 관리합니다.</p>

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
        <button
          className={activeSection === 'platforms' ? 'sidebar-link active' : 'sidebar-link'}
          onClick={() => setCurrentView('platforms')}
        >
          플랫폼 관리
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
          <p>활성화된 채널을 선택해서 영상과 게시글을 한 번에 배포합니다.</p>
        </div>
        <div className="inline-actions compact">
          <button className="secondary-action" onClick={() => setCurrentView('fan')}>
            팬 화면 미리보기
          </button>
        </div>
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
          게시글 배포
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
              <h3>{publishComposerMode === 'video' ? '오늘의 메인 영상' : '게시글 초안과 외부 배포'}</h3>
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
                  <span className="mini-label">게시글 제목</span>
                  <input
                    className="text-input"
                    value={postTitle}
                    onChange={(event) => setPostTitle(event.target.value)}
                    placeholder="Instagram 캡션과 초안에 쓸 제목을 입력하세요"
                  />
                </div>
                <div className="field-block">
                  <span className="mini-label">게시글 본문</span>
                  <textarea
                    className="text-area"
                    value={postBody}
                    onChange={(event) => setPostBody(event.target.value)}
                    placeholder="Instagram 캡션, 댓글 초안, 공지 문구로 함께 쓸 내용을 적어보세요"
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
                {isInstagramSelectedForPublish ? (
                  <div className="field-block">
                    <span className="mini-label">Instagram 공개 이미지 URL</span>
                    <input
                      className="text-input"
                      value={instagramMediaUrl}
                      onChange={(event) => setInstagramMediaUrl(event.target.value)}
                      placeholder="https://.../cover.jpg"
                    />
                    <span className="helper-copy">
                      Instagram은 공개 접근 가능한 이미지 URL이 있어야 실제 발행할 수 있습니다.
                    </span>
                  </div>
                ) : null}
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
                  <span className="info-chip">선택 채널 게시글 실행</span>
                  <span className="info-chip">Instagram 캡션 발행</span>
                  <span className="info-chip">고정 댓글 바로 배포</span>
                  <span className="info-chip">유튜브 초안 복사</span>
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
                  : '선택 채널 게시글 실행'}
              </button>
              {publishComposerMode === 'post' ? (
                <button className="secondary-action" onClick={() => void handlePublishYoutubeComment()} type="button">
                  고정 댓글 배포
                </button>
              ) : null}
              <span className="helper-copy">
                {publishComposerMode === 'video'
                  ? uploadStatus
                  : `${postStatus}${instagramPublishStatus !== '아직 Instagram 배포 전' ? ` · ${instagramPublishStatus}` : ''}${commentStatus !== '아직 댓글 배포 전' ? ` · ${commentStatus}` : ''}`}
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
                <span className="mini-label">게시글 작업 상태</span>
                <strong>{postTitle.trim() || '게시글 제목 미입력'}</strong>
                <p>{postStatus}</p>
                <p>{selectedPostImage ? '이미지 초안 1장 준비 완료' : '텍스트만으로도 초안 생성은 가능합니다.'}</p>
                {instagramPublishResult ? (
                  <a className="result-link" href={instagramPublishResult.permalink} rel="noreferrer" target="_blank">
                    Instagram 게시글 보기
                  </a>
                ) : null}
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
              <h3>{publishComposerMode === 'video' ? '미리보기와 체크' : '게시글 초안 미리보기'}</h3>
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
                  <strong>{publishComposerMode === 'video' ? '영상 미리보기' : '게시글 이미지 초안'}</strong>
                  <p>
                    {publishComposerMode === 'video'
                      ? '파일을 고르면 여기서 업로드 전에 바로 확인할 수 있습니다.'
                      : '사진을 고르면 Instagram 캡션용 이미지 초안을 먼저 볼 수 있습니다.'}
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
                    <span className="mini-label">게시글 제목</span>
                    <strong>{postTitle.trim() || '제목 미입력'}</strong>
                    <p>{postBody.trim() ? '본문 입력 완료' : '본문을 더 적을 수 있습니다.'}</p>
                  </article>
                  <article className="upload-check-card">
                    <span className="mini-label">캡션 요약</span>
                    <strong>{postBody.trim().slice(0, 26) || '본문 미입력'}</strong>
                    <p>{postBody.trim().length > 26 ? 'Instagram 캡션과 고정 댓글 초안으로 함께 활용합니다.' : '짧은 한 줄 알림도 바로 만들 수 있습니다.'}</p>
                  </article>
                  {isInstagramSelectedForPublish ? (
                    <article className="upload-check-card">
                      <span className="mini-label">Instagram 공개 URL</span>
                      <strong>{instagramMediaUrl.trim() || '미입력'}</strong>
                      <p>{instagramMediaUrl.trim() ? 'Instagram 발행 가능한 공개 이미지 URL이 연결되었습니다.' : 'Instagram 게시글 발행에는 공개 이미지 URL이 필요합니다.'}</p>
                    </article>
                  ) : null}
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
                  {publishComposerMode === 'video' ? '발행 순서' : '게시글 실행 초안'}
                </span>
                <h3>{publishComposerMode === 'video' ? '예약 타임라인' : '복사해서 바로 올릴 초안'}</h3>
              </div>
            </div>
            {publishComposerMode === 'video' ? (
              <>
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
                {publishHistory.filter((job) => job.status === 'READY' || job.status === 'PROCESSING').length === 0 ? (
                  <article className="timeline-row" key={contentTimeline[0].title}>
                    <span className="timeline-time">{contentTimeline[0].time}</span>
                    <div>
                      <strong>{contentTimeline[0].title}</strong>
                      <p>{contentTimeline[0].body}</p>
                    </div>
                  </article>
                ) : null}
              </>
            ) : (
              <article className="post-preview-card">
                {postPreviewUrl ? (
                  <img alt={postTitle || '게시글 미리보기'} className="post-preview-card-image" src={postPreviewUrl} />
                ) : null}
                <span className="fan-badge">DRAFT</span>
                <strong>{postTitle.trim() || '게시글 제목을 입력하세요'}</strong>
                <p>{postBody.trim() || 'Instagram 캡션이나 고정 댓글에 쓸 본문 초안이 여기에 미리 보입니다.'}</p>
                <textarea className="text-area compact-preview" readOnly value={youtubeCommunityDraft} />
              </article>
            )}
          </div>

          <div className="timeline-list">
            <div className="panel-head">
              <div>
                <span className="card-kicker">
                  {publishComposerMode === 'video' ? '최근 발행 이력' : '게시글 반영 상태'}
                </span>
                <h3>{publishComposerMode === 'video' ? '업로드 기록' : 'Instagram / YouTube 반영 상태'}</h3>
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
                <span className="timeline-time">POST</span>
                <div>
                  <strong>
                    {instagramPublishStatus !== '아직 Instagram 배포 전'
                      ? instagramPublishStatus
                      : commentStatus}
                  </strong>
                  <p>Instagram은 공개 이미지 URL 기준으로 실제 발행하고, YouTube는 댓글만 여기서 바로 배포할 수 있습니다.</p>
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
            {communityFeed.filter((post) => !isTestCommunityPost(post)).length > 0 ? (
              communityFeed.filter((post) => !isTestCommunityPost(post)).map((post) => (
                <article className="board-card" key={post.post_id}>
                  <span className="board-label">{post.post_type}</span>
                  {post.highlighted ? <span className="info-chip">BEST</span> : null}
                  <strong>{post.title}</strong>
                  <p>{post.author_name} · {new Date(post.created_at).toLocaleString('ko-KR')}</p>
                  <p>추천 {post.like_count} · 댓글 {post.comment_count} · 신고 {post.report_count}</p>
                  <div className="inline-actions compact-actions">
                    <button className="secondary-action" onClick={() => startEditingCommunityPost(post)} type="button">
                      수정
                    </button>
                    <button className="secondary-action" onClick={() => void handleToggleCommunityHighlight(post)} type="button">
                      {post.highlighted ? '베스트 해제' : '베스트 고정'}
                    </button>
                    <button className="secondary-action" onClick={() => void handleDeleteCommunityPost(post.post_id)} type="button">
                      삭제
                    </button>
                  </div>
                </article>
              ))
            ) : (
              <article className="board-card">
                <span className="board-label">EMPTY</span>
                <strong>아직 등록된 게시글이 없습니다</strong>
                <p>콘텐츠 배포나 팬 커뮤니티 화면에서 첫 글을 올리면 여기에 표시됩니다.</p>
              </article>
            )}
          </div>
        </section>

        <section className="studio-panel dark-surface">
          <div className="panel-head">
            <div>
              <span className="card-kicker">공지 작성기</span>
              <h3>{editingCommunityPostId ? '게시글 수정' : '업로드 후 자동 초안'}</h3>
            </div>
          </div>

          <div className="composer-card">
            <strong>{postTitle.trim() || '게시글 제목을 입력하세요'}</strong>
            <p>{postBody.trim() || '게시글 본문을 입력하세요.'}</p>
            <div className="inline-actions compact-actions">
              <button className="primary-action" onClick={() => void handleUpdateCommunityPost()} type="button">
                {editingCommunityPostId ? '수정 저장' : '수정할 글을 먼저 선택'}
              </button>
              {editingCommunityPostId ? (
                <button className="secondary-action" onClick={resetCommunityComposer} type="button">
                  수정 취소
                </button>
              ) : null}
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
        <section className="studio-panel">
          <div className="panel-head">
            <div>
              <span className="card-kicker">이벤트 등록</span>
              <h3>팬 일정 추가</h3>
            </div>
          </div>
          <div className="field-block">
            <label htmlFor="event-title">이벤트 제목</label>
            <input
              className="text-input"
              id="event-title"
              onChange={(event) => setEventTitle(event.target.value)}
              placeholder="예: 미션 인증 이벤트 오픈"
              type="text"
              value={eventTitle}
            />
          </div>
          <div className="field-block">
            <label htmlFor="event-schedule">일정 라벨</label>
            <input
              className="text-input"
              id="event-schedule"
              onChange={(event) => setEventScheduleLabel(event.target.value)}
              placeholder="예: 오늘, 내일, 토요일"
              type="text"
              value={eventScheduleLabel}
            />
          </div>
          <div className="field-block">
            <label htmlFor="event-detail">설명</label>
            <textarea
              className="text-area"
              id="event-detail"
              onChange={(event) => setEventDetail(event.target.value)}
              placeholder="팬에게 보여줄 이벤트 설명을 입력하세요"
              value={eventDetail}
            />
          </div>
          <div className="inline-actions compact-actions">
            <button className="primary-action" disabled={isSavingEvent} onClick={() => void handleCreateEvent()} type="button">
              {isSavingEvent ? '저장 중...' : editingEventId ? '이벤트 수정' : '이벤트 등록'}
            </button>
            {editingEventId ? (
              <button className="secondary-action" onClick={resetEventComposer} type="button">
                새 이벤트로 전환
              </button>
            ) : null}
            <span className="helper-copy">{eventStatus}</span>
          </div>
        </section>

        {(eventBoard.length > 0 ? eventBoard : []).map((step, index) => (
          <section className="studio-panel" key={step.title}>
            <span className="step-index">0{index + 1}</span>
            <h3>{step.title}</h3>
            <p>{step.detail}</p>
            <div className="mini-board soft">
              <strong>{step.schedule_label}</strong>
              <p>{step.visible ? '팬 일정 탭에 노출 중' : '운영 전용 숨김 상태'}</p>
            </div>
            <div className="inline-actions compact-actions">
              <button className="secondary-action" onClick={() => startEditingEvent(step)} type="button">
                수정
              </button>
              <button className="secondary-action" onClick={() => void handleToggleEventVisibility(step)} type="button">
                {step.visible ? '숨기기' : '노출하기'}
              </button>
              <button className="secondary-action" onClick={() => void handleDeleteEvent(step.event_id)} type="button">
                삭제
              </button>
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
          <p>직접 등록하거나 외부 상품 링크를 붙여넣어 굿즈 카탈로그를 채웁니다.</p>
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
              <span className="card-kicker">상품 등록</span>
              <h3>링크 가져오기 + 직접 수정</h3>
            </div>
          </div>

          <div className="field-block">
            <label htmlFor="store-source-url">상품 링크 붙여넣기</label>
            <div className="platform-inline-row">
              <input
                className="text-input"
                id="store-source-url"
                onChange={(event) => setStoreSourceUrl(event.target.value)}
                placeholder="https://smartstore.naver.com/... 같은 상품 링크"
                type="url"
                value={storeSourceUrl}
              />
              <button
                className="secondary-action"
                disabled={isImportingStoreLink}
                onClick={() => void handleImportStoreLink()}
                type="button"
              >
                {isImportingStoreLink ? '가져오는 중...' : '링크 가져오기'}
              </button>
            </div>
            <p className="helper-copy">{storeImportStatus}</p>
          </div>

          <div className="detail-grid">
            <div className="field-block">
              <label htmlFor="store-product-name">상품 이름</label>
              <input
                className="text-input"
                id="store-product-name"
                onChange={(event) => setStoreProductName(event.target.value)}
                placeholder="상품명을 입력하세요"
                type="text"
                value={storeProductName}
              />
            </div>
            <div className="field-block">
              <label htmlFor="store-product-price">가격 표시</label>
              <input
                className="text-input"
                id="store-product-price"
                onChange={(event) => setStoreProductPriceText(event.target.value)}
                placeholder="예: 29,900원"
                type="text"
                value={storeProductPriceText}
              />
            </div>
            <div className="field-block">
              <label htmlFor="store-product-image">이미지 URL</label>
              <input
                className="text-input"
                id="store-product-image"
                onChange={(event) => setStoreProductImageUrl(event.target.value)}
                placeholder="가져온 이미지 URL이 여기 채워집니다"
                type="url"
                value={storeProductImageUrl}
              />
            </div>
            <div className="field-block">
              <label htmlFor="store-product-image-file">이미지 파일 업로드</label>
              <div className="platform-inline-row">
                <input
                  className="text-input"
                  id="store-product-image-file"
                  onChange={(event) => setStoreProductImageFile(event.target.files?.[0] ?? null)}
                  type="file"
                  accept="image/*"
                />
                <button
                  className="secondary-action"
                  disabled={isUploadingStoreImage || !storeProductImageFile}
                  onClick={() => void handleUploadStoreImage()}
                  type="button"
                >
                  {isUploadingStoreImage ? '업로드 중...' : '이미지 업로드'}
                </button>
              </div>
              <p className="helper-copy">
                {storeProductImageFile
                  ? `${storeProductImageFile.name} 선택됨`
                  : '링크 자동수집이 막히면 파일 업로드로 바로 등록할 수 있습니다.'}
              </p>
            </div>
            <div className="field-block">
              <label htmlFor="store-product-source">출처 라벨</label>
              <input
                className="text-input"
                id="store-product-source"
                onChange={(event) => setStoreProductSourceLabel(event.target.value)}
                placeholder="예: 네이버 쇼핑 링크"
                type="text"
                value={storeProductSourceLabel}
              />
            </div>
            <div className="field-block">
              <label htmlFor="store-product-status">상태 라벨</label>
              <input
                className="text-input"
                id="store-product-status"
                onChange={(event) => setStoreProductStatusLabel(event.target.value)}
                placeholder="예: 판매 준비"
                type="text"
                value={storeProductStatusLabel}
              />
            </div>
            <div className="field-block">
              <label htmlFor="store-product-sales">판매 라벨</label>
              <input
                className="text-input"
                id="store-product-sales"
                onChange={(event) => setStoreProductSalesLabel(event.target.value)}
                placeholder="예: 외부 링크 판매"
                type="text"
                value={storeProductSalesLabel}
              />
            </div>
          </div>

          <div className="field-block">
            <label htmlFor="store-product-description">상품 설명</label>
            <textarea
              className="text-area"
              id="store-product-description"
              onChange={(event) => setStoreProductDescription(event.target.value)}
              placeholder="가져온 설명을 그대로 쓰거나 직접 수정할 수 있습니다"
              value={storeProductDescription}
            />
          </div>

          <div className="inline-actions compact-actions">
            <button
              className="primary-action"
              disabled={isSavingStoreProduct}
              onClick={() => void handleCreateStoreProduct()}
              type="button"
            >
              {isSavingStoreProduct ? '저장 중...' : editingStoreProductId ? '상품 수정' : '상품 등록'}
            </button>
            {editingStoreProductId ? (
              <button className="secondary-action" onClick={resetStoreComposer} type="button">
                새 상품으로 전환
              </button>
            ) : null}
            <span className="helper-copy">{storeSaveStatus}</span>
          </div>
        </section>

        <section className="studio-panel dark-surface">
          <div className="panel-head">
            <div>
              <span className="card-kicker">등록된 상품</span>
              <h3>굿즈 카탈로그</h3>
            </div>
          </div>

          {storeBoard.length > 0 ? (
            <div className="catalog-list">
              {storeBoard.map((item) => (
                <article className="catalog-card rich" key={item.product_id}>
                  {item.image_url ? <img alt={item.name} className="catalog-thumb" src={item.image_url} /> : null}
                  <div className="catalog-copy">
                    <strong>{item.name}</strong>
                    <span>{item.price_text ?? item.status_label ?? '가격 정보 없음'}</span>
                    <p>{item.description ?? item.sales_label ?? '등록된 상품 설명이 없습니다.'}</p>
                    <div className="chip-row">
                      {item.source_label ? <span className="info-chip">{item.source_label}</span> : null}
                      {item.sales_label ? <span className="info-chip">{item.sales_label}</span> : null}
                      <span className="info-chip">{item.visible ? '팬 화면 노출 중' : '팬 화면 숨김'}</span>
                    </div>
                    <div className="inline-actions compact-actions">
                      <button className="secondary-action" onClick={() => startEditingStoreProduct(item)} type="button">
                        수정
                      </button>
                      <button className="secondary-action" onClick={() => void handleToggleStoreVisibility(item)} type="button">
                        {item.visible ? '숨기기' : '노출하기'}
                      </button>
                      <button className="secondary-action" onClick={() => void handleDeleteStoreProduct(item.product_id)} type="button">
                        삭제
                      </button>
                    </div>
                    {item.external_url ? (
                      <a className="inline-link" href={item.external_url} rel="noreferrer" target="_blank">
                        원본 상품 보기
                      </a>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="drop-hero">
              <strong>아직 등록된 굿즈가 없습니다</strong>
              <p>네이버 쇼핑 링크를 붙여넣거나 직접 이름과 설명을 넣어 첫 상품을 만들어보세요.</p>
            </div>
          )}
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

  const renderPlatformsMain = () => (
    <section className={`studio-shell creator-workspace ${creatorExperienceClasses}`}>
      <div className="studio-header">
        <div>
          <span className="section-label">PLATFORM BOARD</span>
          <h2>플랫폼 관리</h2>
          <p>설정에서 연결한 플랫폼의 상태와 채널 정보를 한 화면에서 확인합니다.</p>
        </div>
        <div className="inline-actions compact">
          <button className="secondary-action" onClick={() => openRoomSettingsSection('platforms')}>
            설정으로
          </button>
        </div>
      </div>

      <div className="metrics-grid">
        <article className="metric-card">
          <span className="mini-label">YouTube 구독자</span>
          <strong>{connectedChannel ? `${connectedChannel.subscriber_count}명` : '미연결'}</strong>
          <span className="metric-change">{connectedChannel?.channel_title ?? '채널 연결 필요'}</span>
        </article>
        {platformSetup.Instagram.isEnabled ? (
          <article className="metric-card">
            <span className="mini-label">Instagram</span>
            <strong>{instagramAccountId.trim() && instagramAccessToken.trim() ? '연동됨' : '미연결'}</strong>
            <span className="metric-change">
              {instagramAccountId.trim() && instagramAccessToken.trim() ? '팔로워 집계 연동 예정' : '플랫폼 설정 필요'}
            </span>
          </article>
        ) : null}
        <article className="metric-card">
          <span className="mini-label">활성 채널</span>
          <strong>{connectedPlatforms.length}개</strong>
          <span className="metric-change">
            {connectedPlatforms.length > 0
              ? connectedPlatforms.map((platform) => platform.name).join(' · ')
              : '아직 없음'}
          </span>
        </article>
      </div>

      <section className="studio-panel dark-surface">
        <div className="panel-head">
          <div>
            <span className="card-kicker">연결된 채널</span>
            <h3>연결된 플랫폼 현황</h3>
          </div>
        </div>

        {connectedPlatforms.length > 0 ? (
          <div className="platform-overview-grid">
            {connectedPlatforms.map((platform) => (
              <article className="platform-overview-card" key={platform.name}>
                <div className="panel-head">
                  <div>
                    <span className="card-kicker">{platform.name}</span>
                    <h3>
                      {platform.name === 'YouTube'
                        ? connectedChannel?.channel_title ?? '채널 연결됨'
                        : platform.name === 'Instagram'
                          ? 'Instagram 채널 연결됨'
                          : `${platform.name} 연결됨`}
                    </h3>
                  </div>
                  <span className="status-badge">Connected</span>
                </div>

                <div className="selected-module-list">
                  {platform.name === 'YouTube' ? (
                    <>
                      <div className="selected-module">
                        <strong>구독자</strong>
                        <span>{connectedChannel ? `${connectedChannel.subscriber_count}명` : '집계 대기 중'}</span>
                      </div>
                      <div className="selected-module">
                        <strong>채널 설명</strong>
                        <span>{connectedChannel?.channel_description?.trim() || '채널 설명 없음'}</span>
                      </div>
                      <div className="selected-module">
                        <strong>팬방 연결</strong>
                        <span>{connectedChannel?.room_name ?? '연결 대기 중'}</span>
                      </div>
                    </>
                  ) : null}

                  {platform.name === 'Instagram' ? (
                    <>
                      <div className="selected-module">
                        <strong>연결 상태</strong>
                        <span>정상 연결됨</span>
                      </div>
                      <div className="selected-module">
                        <strong>계정 식별자</strong>
                        <span>{instagramAccountId || '설정값 없음'}</span>
                      </div>
                      <div className="selected-module">
                        <strong>팔로워</strong>
                        <span>집계 연동 예정</span>
                      </div>
                    </>
                  ) : null}

                  {platform.name !== 'YouTube' && platform.name !== 'Instagram' ? (
                    <>
                      <div className="selected-module">
                        <strong>상태</strong>
                        <span>{platformSetup[platform.name]?.statusLabel ?? 'Connected'}</span>
                      </div>
                      <div className="selected-module">
                        <strong>배포 지원</strong>
                        <span>
                          {platform.supportsVideo ? '영상 가능' : '영상 미지원'} ·{' '}
                          {platform.supportsPost ? '게시글 가능' : '게시글 미지원'}
                        </span>
                      </div>
                      <div className="selected-module">
                        <strong>설명</strong>
                        <span>{platform.detail}</span>
                      </div>
                      {platformRequiresCredentials(platform.name) ? (
                        <div className="selected-module">
                          <strong>연결 준비</strong>
                          <span>설정에서 입력한 연결 값 기준으로 동작합니다.</span>
                        </div>
                      ) : null}
                    </>
                  ) : null}
                </div>

                {platform.name === 'YouTube' ? (
                  <div className="platform-totals">
                    <article className="platform-total-card">
                      <span className="mini-label">롱폼 업로드</span>
                      <strong>{youtubeLongformCount}개</strong>
                    </article>
                    <article className="platform-total-card">
                      <span className="mini-label">숏츠 업로드</span>
                      <strong>{youtubeShortsCount}개</strong>
                    </article>
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        ) : (
          <div className="notice-preview compact-highlight">
            <span className="mini-label">연결된 플랫폼 없음</span>
            <strong>아직 활성화된 플랫폼이 없습니다.</strong>
            <p>설정에서 플랫폼을 연결하고 활성화하면 이 화면에 정보가 나타납니다.</p>
          </div>
        )}
      </section>
    </section>
  )

  const renderPlatforms = () => (
    <section className="dashboard-shell">
      {renderDashboardSidebar('platforms')}
      <div className="dashboard-main">{renderPlatformsMain()}</div>
    </section>
  )

  const renderFan = () =>
    !fanSession && !isCreatorLoggedIn ? (
      <section className="scene-panel light">
        <div className="scene-copy">
          <span className="section-label dark">FAN ENTRY</span>
          <h2>팬방은 초대 링크로 입장합니다</h2>
          <p>별도 팬 로그인 화면 대신, 영상 설명란이나 라이브 링크를 통해 바로 팬방에 들어옵니다.</p>

          <div className="highlight-card">
            <span className="mini-label">현재 상태</span>
            <strong>{fanStatus}</strong>
            <p>초대 링크를 열면 가입 후 바로 이 팬 화면으로 이어집니다.</p>
          </div>

          <div className="inline-actions">
            <button className="primary-action" onClick={() => setCurrentView('invite')}>
              초대 링크로 입장하기
            </button>
            <button className="secondary-action dark" onClick={() => setCurrentView('home')}>
              홈으로
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
              <span className="mini-label">입장 방식</span>
              <strong>링크가 팬 자격이 됩니다</strong>
              <p>따로 팬 로그인 화면을 거치지 않고, 초대 링크를 열어 바로 이어집니다.</p>
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
              <strong>{activeFanRoom?.label ?? '아직 선택된 팬방이 없습니다'}</strong>
              <span style={{ color: activeRoomTheme.mutedColor }}>
                {activeFanRoom ? `${activeFanRoom.meta} · ${activeFanRoom.joinedVia}` : '초대 링크 가입 후 팬방 정보가 표시됩니다.'}
              </span>
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
            <strong>{activeFanRoom?.creator ?? '팬방 대기 중'}</strong>
            <p>
              {visibleFanFeed[0]?.title
                ? `${visibleFanFeed[0].title} 같은 최근 소식이 여기서 이어집니다.`
                : '새 공지, 일정, 굿즈 드롭이 생기면 여기서 먼저 보입니다.'}
            </p>
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

      {fanVideoHighlights.length > 0 ? (
        <section className="fan-video-strip">
          <div className="panel-head">
            <div>
              <span className="card-kicker">최신 영상</span>
              <h3>{connectedChannel?.channel_title ?? activeFanRoom?.creator ?? '최근 유튜브 업로드'}</h3>
            </div>
          </div>

          <div className="fan-video-showcase">
            {(() => {
              const featuredVideo = fanVideoHighlights[0]
              const sideVideos = fanVideoHighlights.slice(1, 5)
              const getVideoLabel = (video: YoutubeRecentVideoItem, index: number) =>
                video.liveBroadcastContent === 'live'
                  ? '최신 생방송'
                  : /shorts|쇼츠/i.test(video.title)
                    ? '최신 숏츠'
                    : index === 0
                      ? '최신 영상'
                      : '최신 업로드'

              return (
                <>
                  <a
                    className="fan-video-featured"
                    href={featuredVideo.watchUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <div className="fan-video-featured-top">
                      <span className="fan-video-youtube">YouTube</span>
                      <strong>{getVideoLabel(featuredVideo, 0)}</strong>
                    </div>
                    <div className="fan-video-featured-media">
                      {featuredVideo.thumbnailUrl ? (
                        <img
                          alt={featuredVideo.title}
                          className="fan-video-thumb"
                          loading="lazy"
                          src={featuredVideo.thumbnailUrl}
                        />
                      ) : (
                        <div className="fan-video-thumb fan-video-thumb-fallback">최신 영상</div>
                      )}
                      <div className="fan-video-overlay fan-video-overlay-featured">
                        <span className="fan-video-play">▶</span>
                      </div>
                    </div>
                    <div className="fan-video-featured-copy">
                      <h4>{featuredVideo.title}</h4>
                      <p>{connectedChannel?.channel_title ?? activeFanRoom?.creator ?? 'YouTube 채널'}</p>
                      <span className="fan-video-watch-pill">유튜브에서 바로 보기</span>
                    </div>
                  </a>

                  <div className="fan-video-list">
                    {sideVideos.map((video, index) => (
                      <a
                        className="fan-video-list-item"
                        href={video.watchUrl}
                        key={video.videoId || `${video.title}-${index + 1}`}
                        rel="noreferrer"
                        target="_blank"
                      >
                        <div className="fan-video-list-thumb-wrap">
                          {video.thumbnailUrl ? (
                            <img
                              alt={video.title}
                              className="fan-video-list-thumb"
                              loading="lazy"
                              src={video.thumbnailUrl}
                            />
                          ) : (
                            <div className="fan-video-list-thumb fan-video-thumb-fallback">
                              {getVideoLabel(video, index + 1)}
                            </div>
                          )}
                          <span className="fan-video-list-play">▶</span>
                        </div>
                        <div className="fan-video-list-copy">
                          <span className="mini-label">{getVideoLabel(video, index + 1)}</span>
                          <strong>{video.title}</strong>
                          <p>{connectedChannel?.channel_title ?? activeFanRoom?.creator ?? 'YouTube 채널'}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                </>
              )
            })()}
          </div>
        </section>
      ) : null}

      <div className="fan-layout fan-layout-wide">
        <aside className="fan-left-menu">
          <section className="fan-menu-panel">
            <div className="panel-head">
              <div>
                <span className="card-kicker">팬방 선택</span>
                <h3>가입한 팬방</h3>
              </div>
            </div>

            {displayedFanRooms.length > 0 ? (
              <div className="fan-room-menu">
                {displayedFanRooms.map((room) => (
                  <button
                    className={room.id === selectedFanRoomId ? 'fan-menu-button active' : 'fan-menu-button'}
                    key={room.id}
                    onClick={() => setSelectedFanRoomId(room.id)}
                    type="button"
                  >
                    <span className="mini-label">{room.joinedVia}</span>
                    <strong>{room.creator}</strong>
                    <p>{room.label}</p>
                  </button>
                ))}
              </div>
            ) : (
              <div className="mini-board">
                <span className="mini-label">팬방 없음</span>
                <strong>아직 입장한 팬방이 없습니다.</strong>
                <p>초대 링크를 통해 팬방에 가입하면 이 메뉴에 바로 추가됩니다.</p>
              </div>
            )}
          </section>

          <section className="fan-menu-panel">
            <div className="panel-head">
              <div>
                <span className="card-kicker">커뮤니티</span>
                <h3>{activeFanRoomUi.boardTitle}</h3>
              </div>
            </div>

            <div className="fan-room-menu">
              <button
                className={fanTab === 'feed' ? 'fan-menu-button active' : 'fan-menu-button'}
                onClick={() => setFanTab('feed')}
                type="button"
              >
                <span className="mini-label">BOARD</span>
                <strong>{activeFanRoomUi.feedTitle}</strong>
                <p>팬 글과 공지를 보는 메인 게시판</p>
              </button>
              <button
                className={fanTab === 'calendar' ? 'fan-menu-button active' : 'fan-menu-button'}
                onClick={() => setFanTab('calendar')}
                type="button"
              >
                <span className="mini-label">SCHEDULE</span>
                <strong>일정</strong>
                <p>다가오는 방송과 이벤트 일정</p>
              </button>
              <button
                className={fanTab === 'shop' ? 'fan-menu-button active' : 'fan-menu-button'}
                onClick={() => setFanTab('shop')}
                type="button"
              >
                <span className="mini-label">GOODS</span>
                <strong>굿즈</strong>
                <p>팬방에서 열리는 상품과 드롭</p>
              </button>
            </div>
          </section>

        </aside>

        <section className="fan-feed">
          <div className="panel-head">
            <div>
              <span className="card-kicker">{activeFanRoomUi.heroLabel}</span>
              <h3>
                {fanTab === 'feed'
                  ? fanBoardFilter === 'ALL'
                    ? activeFanRoomUi.feedTitle
                    : fanBoardFilter === 'BEST'
                      ? `${activeFanRoomUi.boards.find((board) => board.key === 'BEST')?.label ?? '베스트'}`
                      : fanBoardFilter === 'NOTICE'
                        ? `${activeFanRoomUi.boards.find((board) => board.key === 'NOTICE')?.label ?? '공지'}`
                        : fanBoardFilter === 'FREE'
                          ? `${activeFanRoomUi.boards.find((board) => board.key === 'FREE')?.label ?? '자유글'}`
                          : fanBoardFilter === 'QUESTION'
                            ? `${activeFanRoomUi.boards.find((board) => board.key === 'QUESTION')?.label ?? '질문'}`
                            : `${activeFanRoomUi.boards.find((board) => board.key === fanBoardFilter)?.label ?? activeFanRoomUi.feedTitle}`
                  : fanTab === 'calendar'
                    ? '다가오는 일정'
                    : '팬방 한정 굿즈'}
              </h3>
            </div>
          </div>

          {fanTab === 'feed' ? (
            <div className="fan-board-topline">
              <div className="fan-board-tabs">
                {activeFanRoomUi.boards.map((board) => (
                  <button
                    className={fanBoardFilter === board.key ? 'fan-board-tab active' : 'fan-board-tab'}
                    key={board.key}
                    onClick={() => {
                      setFanTab('feed')
                      setFanBoardFilter(board.key as FanBoardFilter)
                    }}
                    type="button"
                  >
                    {board.label}
                  </button>
                ))}
              </div>

              <div className="chip-row">
                <button
                  className={fanFeedSort === 'latest' ? 'info-chip interactive-chip active' : 'info-chip interactive-chip'}
                  onClick={() => setFanFeedSort('latest')}
                  type="button"
                >
                  최신순
                </button>
                <button
                  className={fanFeedSort === 'popular' ? 'info-chip interactive-chip active' : 'info-chip interactive-chip'}
                  onClick={() => setFanFeedSort('popular')}
                  type="button"
                >
                  인기순
                </button>
              </div>
            </div>
          ) : null}

          {fanTab === 'feed' && (
            <>
              <article className="mini-board" ref={fanPostComposerRef}>
                <span className="mini-label">{activeFanRoomUi.composerLabel}</span>
                <strong>
                  {canWriteFanCommunity ? activeFanRoomUi.composerTitle : '로그인하면 바로 글을 올릴 수 있습니다.'}
                </strong>
                {canWriteFanCommunity ? (
                  <div className="form-stack">
                    <input
                      className="text-input"
                      onChange={(event) => setFanPostTitle(event.target.value)}
                      placeholder={activeFanRoomUi.composerPlaceholderTitle}
                      ref={fanPostTitleInputRef}
                      value={fanPostTitle}
                    />
                    <textarea
                      className="text-area"
                      onChange={(event) => setFanPostBody(event.target.value)}
                      placeholder={activeFanRoomUi.composerPlaceholderBody}
                      value={fanPostBody}
                    />
                    <div className="inline-actions compact-actions">
                      <button className="primary-action" onClick={() => void handleCreateFanPost()} type="button">
                        {activeFanRoomUi.composerLabel}
                      </button>
                      <span className="helper-copy">{fanPostStatus}</span>
                    </div>
                  </div>
                ) : (
                  <div className="inline-actions compact-actions">
                    <button className="primary-action" onClick={() => setCurrentView('signup')} type="button">
                      로그인하고 글쓰기
                    </button>
                    <span className="helper-copy">로그인 후 바로 글을 쓰고 추천과 댓글도 남길 수 있습니다.</span>
                  </div>
                )}
              </article>

              {filteredFanFeed.length > 0 ? (
                <div className="fan-board-shell">
                  <div className="fan-board-columns">
                    {fanBoardColumns.map((column, columnIndex) => (
                      <div className="fan-board-column" key={`column-${columnIndex}`}>
                        {column.map((post) => (
                          <button
                            className={selectedFanPost?.post_id === post.post_id ? 'fan-board-row active' : 'fan-board-row'}
                            key={`${post.post_id}-${post.title}`}
                            onClick={() => {
                              setSelectedFanPostId(post.post_id)
                              void loadFanComments(post.post_id)
                            }}
                            type="button"
                          >
                            <div className="fan-board-row-main">
                              <span className="fan-board-type">
                                {post.highlighted ? 'BEST' : postTypeToBadge[post.post_type] ?? 'POST'}
                              </span>
                              <strong className="fan-board-title">{post.title}</strong>
                            </div>
                            <div className="fan-board-row-meta">
                              <span className="fan-board-metric">💬 {post.comment_count}</span>
                              <span className="fan-board-metric">👍 {post.like_count}</span>
                              <span className="fan-board-author">{post.author_name}</span>
                              <span className="fan-board-time">{formatRelativeTime(post.created_at)}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>

                  {selectedFanPost ? (
                    <article className="fan-board-detail">
                      <div className="chip-row">
                        <span className="fan-badge">{postTypeToBadge[selectedFanPost.post_type] ?? 'POST'}</span>
                        {selectedFanPost.highlighted ? <span className="info-chip">BEST</span> : null}
                        <span className="mini-label">
                          {selectedFanPost.author_name} · {formatRelativeTime(selectedFanPost.created_at)}
                        </span>
                      </div>
                      <strong>{selectedFanPost.title}</strong>
                      {isRenderableImageUrl(selectedFanPost.image_url) ? (
                        <img
                          alt={selectedFanPost.title}
                          className="fan-moment-media"
                          onError={(event) => {
                            event.currentTarget.style.display = 'none'
                          }}
                          src={selectedFanPost.image_url}
                        />
                      ) : null}
                      <p>{selectedFanPost.content}</p>
                      <div className="chip-row">
                        <button
                          className="info-chip interactive-chip"
                          onClick={() => void handleToggleFanReaction(selectedFanPost.post_id)}
                          type="button"
                        >
                          {selectedFanPost.liked_by_viewer
                            ? `추천 취소 · ${selectedFanPost.like_count}`
                            : `추천 · ${selectedFanPost.like_count}`}
                        </button>
                        <button
                          className="info-chip interactive-chip"
                          onClick={() => void loadFanComments(selectedFanPost.post_id)}
                          type="button"
                        >
                          댓글 {selectedFanPost.comment_count}
                        </button>
                        <button
                          className="info-chip interactive-chip"
                          onClick={() => void handleReportCommunityPost(selectedFanPost.post_id)}
                          type="button"
                        >
                          신고 {selectedFanPost.report_count}
                        </button>
                      </div>
                      <div className="comment-stack">
                        {(fanCommentsByPostId[selectedFanPost.post_id] ?? []).map((comment) => (
                          <div className="comment-row" key={comment.comment_id}>
                            <strong>{comment.author_name}</strong>
                            <p>{comment.content}</p>
                          </div>
                        ))}
                        {fanSession ? (
                          <div className="comment-compose">
                            <input
                              className="text-input"
                              onChange={(event) =>
                                setFanCommentDrafts((current) => ({ ...current, [selectedFanPost.post_id]: event.target.value }))
                              }
                              placeholder="댓글을 입력하세요"
                              value={fanCommentDrafts[selectedFanPost.post_id] ?? ''}
                            />
                            <button
                              className="secondary-action"
                              onClick={() => void handleCreateFanComment(selectedFanPost.post_id)}
                              type="button"
                            >
                              댓글 달기
                            </button>
                          </div>
                        ) : null}
                      </div>
                    </article>
                  ) : null}
                </div>
              ) : (
                <div className="mini-board">
                  <span className="mini-label">{activeFanRoomUi.boardLabel} 비어 있음</span>
                  <strong>{activeFanRoomUi.emptyTitle}</strong>
                  <p>{activeFanRoomUi.emptyDescription}</p>
                </div>
              )}
            </>
          )}

          {fanTab === 'calendar' && (
            visibleEventBoard.length > 0 ? (
              <div className="calendar-list">
                {visibleEventBoard.map((item) => (
                  <article className="calendar-card" key={item.event_id}>
                    <span>{item.schedule_label}</span>
                    <strong>{item.title}</strong>
                  </article>
                ))}
              </div>
            ) : (
              <div className="mini-board">
                <span className="mini-label">일정 준비 전</span>
                <strong>아직 등록된 이벤트가 없습니다</strong>
                <p>운영 화면에서 일정을 등록하면 팬 일정 탭에 바로 표시됩니다.</p>
              </div>
            )
          )}

          {fanTab === 'shop' && (
            visibleStoreBoard.length > 0 ? (
              <div className="catalog-list">
                {visibleStoreBoard.map((item) => (
                  <article className="catalog-card rich" key={item.product_id}>
                    {item.image_url ? <img alt={item.name} className="catalog-thumb" src={item.image_url} /> : null}
                    <div className="catalog-copy">
                      <strong>{item.name}</strong>
                      <p>{item.price_text ?? item.description ?? '팬방 굿즈'}</p>
                      {item.external_url ? (
                        <a className="inline-link" href={item.external_url} rel="noreferrer" target="_blank">
                          상품 링크 열기
                        </a>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="mini-board">
                <span className="mini-label">굿즈 준비 전</span>
                <strong>아직 등록된 상품이 없습니다</strong>
                <p>방장이 굿즈를 등록하면 여기에서 바로 보이게 됩니다.</p>
              </div>
            )
          )}
        </section>

        <aside className="fan-side-panel">
          <div className="mini-board">
            <span className="mini-label">팬 입장 방식</span>
            <strong>{activeFanRoom?.joinedVia ?? '입장 대기 중'}</strong>
            <p>
              팬은 초대 링크를 통해 들어오고, 가입이 끝나면 여러 크리에이터 팬방 중
              원하는 방을 선택해 이동할 수 있습니다.
            </p>
          </div>

          <div className="mini-board dark">
            <span className="mini-label">운영자 시점 연결</span>
            <strong>
              {inviteDashboard
                ? `초대 팬 ${inviteDashboard.total_join_count}명 · 멀티 팬 ${inviteDashboard.multi_room_fan_count}명`
                : '초대 링크 생성 후 운영 집계가 열립니다'}
            </strong>
            <p>
              {inviteDashboard
                ? '대시보드에서 링크별 유입과 가입 수를 확인하고, 팬은 같은 계정으로 여러 인플루언서 팬방에 입장합니다.'
                : '초대 링크를 만들면 여기서 팬 유입과 멀티 팬 가입 흐름을 함께 확인할 수 있습니다.'}
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
    <main
      className={`page-shell app-shell${useRoomThemeSurface ? ' room-themed' : ''}${useRoomThemeSurface && isClassicRoomTheme ? ' room-theme-classic' : ''}`}
      style={themedPageStyle}
    >
      {renderHeader()}
      {currentView === 'home' && renderHome()}
      {currentView === 'signup' && renderSignup()}
      {(currentView === 'room' || currentView === 'features') &&
        (isCreatorLoggedIn
          ? renderRoom()
          : renderCreatorAccessGuard(
              '설정 화면은 인플루언서 전용입니다',
              '팬방 컬러, 채널 연결 정보, 운영 기본값은 실제 인플루언서 채널을 연결한 뒤에만 조정할 수 있습니다.',
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
      {currentView === 'platforms' &&
        (isCreatorLoggedIn
          ? renderPlatforms()
          : renderCreatorAccessGuard(
              '플랫폼 관리는 크리에이터 전용입니다',
              '채널 연결, 상태 확인, 활성화 관리는 운영자 역할에서만 다루는 것이 자연스럽습니다.',
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
