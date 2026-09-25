import { useState } from 'react'
import { ArrowRight, KeyRound } from 'lucide-react'
import Panel from '../ui/Panel'

export default function QuizCodeEntry({ go }) {
  const [code, setCode] = useState('')

  function submit(e) {
    e.preventDefault()
    go('join')
  }

  return (
    <Panel className="code-entry">
      <span className="code-title">ENTER QUIZ CODE</span>
      <p className="code-sub">Join the quiz with your code</p>

      <form onSubmit={submit}>
        <div className="code-input">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Enter 6-digit code"
            maxLength={10}
          />
          <KeyRound size={16} />
        </div>

        <button className="primary-btn wide">
          Join Quiz <ArrowRight size={16} />
        </button>
      </form>
    </Panel>
  )
}
