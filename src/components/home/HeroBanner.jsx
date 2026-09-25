import { ArrowRight, PlayCircle, Radio, Users } from 'lucide-react'

const AVATARS = [
  'https://i.pravatar.cc/120?img=12',
  'https://i.pravatar.cc/120?img=32',
  'https://i.pravatar.cc/120?img=45',
  'https://i.pravatar.cc/120?img=58',
]

export default function HeroBanner({ go, staff, isMaster }) {
  return (
    <section className="hb">
      <div className="hb-bg" aria-hidden="true" />

      <div className="hb-inner">
        <div className="hb-left">
          <span className="hb-eyebrow">WEEKLY INTER-CLASS</span>

          <h1 className="hb-title">
            <span className="hb-title-top">ADVANCED</span>
            <span className="hb-title-big">QUIZ</span>
          </h1>

          <h2 className="hb-tag">Compete. Challenge. Conquer.</h2>

          <p className="hb-desc">
            The ultimate academic quiz competition platform for curious minds
            and champion teams.
          </p>

          <div className="hb-pills">
            <span className="hb-pill live">
              <i /> Round 3 is Live Now!
            </span>
            <span className="hb-pill">
              <Users size={13} /> 12 Classes Online
            </span>
          </div>

          <div className="hb-actions">
            <button className="hb-btn primary" onClick={() => go('join')}>
              Enter Quiz Code <ArrowRight size={16} />
            </button>
            <button className="hb-btn ghost">
              How to Play <PlayCircle size={16} />
            </button>
          </div>
        </div>

        <div className="hb-right">
          <div className="hb-glow" aria-hidden="true" />

          <div className="hb-stage">
            <div className="hb-banner">
              <span>KNOWLEDGE</span>
              <strong>IS POWER!</strong>
            </div>

            <div className="hb-players">
              {AVATARS.map((src, i) => (
                <div className={`hb-player p${i}`} key={i}>
                  <div className="hb-player-score">
                    {[120, 150, 180, 160][i]}
                  </div>
                  <img src={src} alt="" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
