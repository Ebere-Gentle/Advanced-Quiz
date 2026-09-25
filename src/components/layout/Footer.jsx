import { BookOpen, Github, Heart, Mail, Shield, Sparkles, Twitter, Zap } from 'lucide-react'

const YEAR = new Date().getFullYear()

export default function Footer({ go, isMaster }) {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="brand-mark">
            <Zap size={18} fill="currentColor" />
          </span>
          <div>
            <strong>Advanced Quiz</strong>
            <small>Ebenezer International School · Weekly Intra-Class Competition</small>
          </div>
        </div>

        <div className="footer-grid">
          <div>
            <span className="footer-title">Platform</span>
            <button onClick={() => go('home')}>Overview</button>
            <button onClick={() => go('teacher')}>Question Bank</button>
            {isMaster && <button onClick={() => go('master')}>Quiz Master</button>}
            <button onClick={() => go('leaderboard')}>Leaderboard</button>
            <button onClick={() => go('join')}>Join Quiz</button>
          </div>

          <div>
            <span className="footer-title">Resources</span>
            <a href="#docs"><BookOpen size={14} /> Documentation</a>
            <a href="#rules"><Shield size={14} /> Competition rules</a>
            <a href="#scoring"><Sparkles size={14} /> Scoring guide</a>
            <a href="#support"><Mail size={14} /> Support</a>
          </div>

          <div>
            <span className="footer-title">Connect</span>
            <a href="#twitter"><Twitter size={14} /> Twitter</a>
            <a href="#github"><Github size={14} /> GitHub</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {YEAR} Advanced Quiz · Ebenezer International School</span>
        <span className="footer-made">
          Built with <Heart size={12} className="heart" /> for Thursday game day
        </span>
      </div>
    </footer>
  )
}
