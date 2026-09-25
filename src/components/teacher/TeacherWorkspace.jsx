import { useState } from 'react'
import { BookOpen, RefreshCw } from 'lucide-react'
import { useQuestionBank } from '../../hooks/useQuestionBank'
import QuestionFilters from './QuestionFilters'
import QuestionEditor from './QuestionEditor'
import QuestionList from './QuestionList'
import EmptyState from '../ui/EmptyState'
import Eyebrow from '../ui/Eyebrow'

export default function TeacherWorkspace({ staff, assignedSubjects }) {
  const firstSubject = assignedSubjects[0]

  const [filters, setFilters] = useState({
    subjectId: firstSubject?.id || '',
    className: 'SS 2',
    termName: 'First Term',
    weekNumber: 1,
  })

  const bank = useQuestionBank(filters)

  if (!assignedSubjects.length) {
    return (
      <main className="workspace">
        <EmptyState icon={BookOpen} eyebrow="TEACHER WORKSPACE"
          title="No subject has been assigned.">
          <p>
            Your authenticated account is active, but the Quiz Master has not
            assigned a subject to your staff profile.
          </p>
        </EmptyState>
      </main>
    )
  }

  return (
    <main className="workspace">
      <div className="page-heading">
        <div>
          <Eyebrow muted>TEACHER WORKSPACE</Eyebrow>
          <h1>Question Bank</h1>
          <p>{staff.full_name} · Prepare and submit weekly competition questions.</p>
        </div>

        <button className="secondary-btn" onClick={bank.loadQuestions}>
          <RefreshCw size={15} /> Refresh
        </button>
      </div>

      <div className="workspace-grid">
        <QuestionFilters
          filters={filters}
          setFilters={setFilters}
          assignedSubjects={assignedSubjects}
          questionCount={bank.questions.length}
          publishedCount={bank.questions.filter((q) => q.status === 'published').length}
        />

        <QuestionEditor
          draft={bank.draft}
          setDraft={bank.setDraft}
          editingId={bank.editingId}
          saving={bank.saving}
          error={bank.error}
          message={bank.message}
          onSave={bank.saveQuestion}
          onReset={bank.resetDraft}
        />
      </div>

      <QuestionList
        questions={bank.questions}
        loading={bank.loading}
        onEdit={bank.editQuestion}
        onDelete={bank.deleteQuestion}
      />
    </main>
  )
}
