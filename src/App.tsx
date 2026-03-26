import { useState } from 'react'
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
  | 'fan'

type SocialTone = 'google' | 'youtube' | 'kakao'
type FanTab = 'feed' | 'calendar' | 'shop'

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
  { label: '자동 공지 생성', value: '14', change: '실시간 동기화' },
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
  const [currentView, setCurrentView] = useState<View>('home')
  const [selectedSocial, setSelectedSocial] = useState<SocialTone>('youtube')
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    '팬 커뮤니티',
    '이벤트',
    '멀티 업로드',
    '굿즈 스토어',
  ])
  const [fanTab, setFanTab] = useState<FanTab>('feed')

  const selectedSocialDetail =
    socialButtons.find((button) => button.tone === selectedSocial) ?? socialButtons[0]

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

  const renderHeader = () => (
    <header className="top-nav">
      <button className="brand-lockup" onClick={() => setCurrentView('home')}>
        <span className="brand-badge">IH</span>
        <span className="brand-text">
          <strong>InfluenceHub</strong>
          <span>Creator Room OS</span>
        </span>
      </button>

      <nav className="nav-tabs" aria-label="primary">
        {[
          ['home', '홈'],
          ['signup', '가입'],
          ['room', '팬방 생성'],
          ['features', '기능 설정'],
          ['dashboard', '운영 대시보드'],
          ['fan', '팬 화면'],
        ].map(([id, label]) => (
          <button
            className={currentView === id ? 'nav-tab active' : 'nav-tab'}
            key={id}
            onClick={() => setCurrentView(id as View)}
          >
            {label}
          </button>
        ))}
      </nav>
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
            <button className="primary-action" onClick={() => setCurrentView('signup')}>
              크리에이터로 시작
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
              화면은 연결돼 있고, 지금은 프론트 프로토타입 중심으로 크리에이터
              운영 경험을 먼저 설계한 상태입니다.
            </p>

            <div className="journey-list">
              {onboardingSteps.map((step, index) => (
                <button
                  className="journey-card"
                  key={step}
                  onClick={() =>
                    setCurrentView(
                      index === 0
                        ? 'signup'
                        : index === 1
                          ? 'room'
                          : index === 2
                            ? 'features'
                            : 'dashboard',
                    )
                  }
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
                대시보드 열기
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
        <h2>크리에이터 계정 만들기</h2>
        <p>
          소셜 로그인 진입점을 먼저 고르고, 계정이 연결되면 팬방 생성 단계로
          바로 넘어갑니다. 어떤 플랫폼에서 시작하느냐에 따라 초반 문구와
          권장 설정이 달라집니다.
        </p>

        <div className="highlight-card">
          <span className="mini-label">선택된 로그인</span>
          <strong>{selectedSocialDetail.label}</strong>
          <p>{selectedSocialDetail.detail}</p>
        </div>

        <div className="inline-actions">
          <button className="primary-action" onClick={() => setCurrentView('room')}>
            팬방 만들기 계속
          </button>
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
            <strong>초기 유입을 끊기지 않게 설계</strong>
            <p>버튼 하나만 눌러도 다음 단계 미리보기가 살아 있어 이탈이 적습니다.</p>
          </article>
          <article className="detail-card">
            <span className="mini-label">다음 연결</span>
            <strong>팬방 주소 자동 제안</strong>
            <p>선택된 로그인 채널명 기반으로 방 이름과 주소 후보를 미리 보여줍니다.</p>
          </article>
        </div>
      </div>
    </section>
  )

  const renderRoom = () => (
    <section className="scene-panel">
      <div className="scene-copy">
        <span className="section-label">STEP 02</span>
        <h2>팬방의 첫 인상을 설계</h2>
        <p>
          채널 이름, 팬방 주소, 소개 문구, 운영 톤을 먼저 고정하면 나머지
          화면의 카드와 공지 문구가 그에 맞게 정렬됩니다.
        </p>

        <div className="progress-strip">
          <span className="progress-dot done" />
          <span className="progress-dot active" />
          <span className="progress-dot" />
          <span className="progress-dot" />
        </div>

        <div className="inline-actions">
          <button className="primary-action" onClick={() => setCurrentView('features')}>
            기능 선택으로
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
          {dashboardMetrics.map((metric) => (
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
      </div>
    </section>
  )

  const renderContent = () => (
    <section className="studio-shell">
      <div className="studio-header">
        <div>
          <span className="section-label">PUBLISHING STUDIO</span>
          <h2>콘텐츠 배포 센터</h2>
          <p>영상 업로드, 팬방 공지, 플랫폼별 발행 순서를 한 타임라인에서 관리합니다.</p>
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
              <span className="card-kicker">업로드 에디터</span>
              <h3>오늘의 메인 영상</h3>
            </div>
            <span className="status-badge">Queued</span>
          </div>

          <div className="form-stack">
            <div className="field-block">
              <span className="mini-label">제목</span>
              <div className="field">요즘 개발자들이 진짜 많이 놓치는 설계 포인트 7가지</div>
            </div>
            <div className="field-block">
              <span className="mini-label">설명란</span>
              <div className="field multiline">
                본편 업로드 후 팬방에는 핵심 요약과 비하인드 Q&A 링크가 함께 올라갑니다.
              </div>
            </div>
            <div className="chip-row">
              <span className="info-chip">YouTube 예약</span>
              <span className="info-chip">CHZZK 공지 연동</span>
              <span className="info-chip">팬 푸시 ON</span>
            </div>
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
    </section>
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
            <strong>침착한개발자TV 공식 팬방</strong>
            <span>구독자 12.4만 · 오늘 라이브 예고 있음</span>
          </div>
        </div>

        <div className="fan-actions">
          <button className="primary-action" onClick={() => setCurrentView('dashboard')}>
            방장 화면으로
          </button>
          <button className="secondary-action" onClick={() => setCurrentView('home')}>
            홈으로
          </button>
        </div>
      </div>

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
            <span className="mini-label">오늘의 참여 포인트</span>
            <strong>출석 체크 + Q&A + 이벤트 인증</strong>
            <p>방문 팬이 자연스럽게 콘텐츠를 따라가도록 동선을 짧게 만들었습니다.</p>
          </div>

          <div className="mini-board dark">
            <span className="mini-label">운영자 시점 연결</span>
            <strong>팬 경험과 방장 운영 화면이 맞물림</strong>
            <p>대시보드에서 만든 공지와 이벤트가 팬 홈에서 바로 반영되는 구조입니다.</p>
          </div>
        </aside>
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
      {currentView === 'fan' && renderFan()}
    </main>
  )
}

export default App
