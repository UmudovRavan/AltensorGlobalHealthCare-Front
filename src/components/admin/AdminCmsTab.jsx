import { CheckCircle2, Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import adminService from '../../services/adminService'

export function AdminCmsTab({ showToast }) {
  const [subTab, setSubTab] = useState('pages') // 'pages' | 'pillars' | 'team' | 'steps'
  const [pages, setPages] = useState([])
  const [pillars, setPillars] = useState([])
  const [team, setTeam] = useState([])
  const [steps, setSteps] = useState([])

  const [pageForm, setPageForm] = useState({
    slug: '',
    parentSlug: 'about-us',
    titleEn: '',
    headingEn: '',
    subtitleEn: '',
    contentEn: '',
    missionTitleEn: '',
    missionTextEn: '',
    displayOrder: 0,
    showInMenu: true,
    isPublished: true,
  })
  const [pillarForm, setPillarForm] = useState({ titleEn: '', descriptionEn: '', displayOrder: 0 })
  const [teamForm, setTeamForm] = useState({
    fullName: '',
    roleEn: '',
    bioEn: '',
    quoteEn: '',
    email: '',
    phone: '',
    isPrimaryCoordinator: false,
  })
  const [stepForm, setStepForm] = useState({
    stepNumber: 1,
    titleEn: '',
    contentEn: '',
    ctaLabelEn: '',
    ctaUrl: '',
  })

  const loadAll = async () => {
    const [p, pil, tm, st] = await Promise.all([
      adminService.getAdminPages().catch(() => []),
      adminService.getPillars().catch(() => []),
      adminService.getTeamMembers().catch(() => []),
      adminService.getHowItWorksSteps().catch(() => []),
    ])
    setPages(Array.isArray(p) ? p : [])
    setPillars(Array.isArray(pil) ? pil : [])
    setTeam(Array.isArray(tm) ? tm : [])
    setSteps(Array.isArray(st) ? st : [])
  }

  useEffect(() => {
    loadAll()
  }, [])

  return (
    <div className="rounded-[12px] border border-[#e8edf5] bg-white p-6 shadow-xs">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-[2rem] font-bold text-[#0c3a94]">About Us &amp; CMS</h2>
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'pages', label: 'Pages' },
            { id: 'pillars', label: 'Value Pillars' },
            { id: 'team', label: 'Team & Coordinator' },
            { id: 'steps', label: 'How It Works Steps' },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setSubTab(t.id)}
              className={`cursor-pointer rounded-[8px] px-4 py-2 text-[1.3rem] font-bold ${
                subTab === t.id ? 'bg-[#3665f6] text-white' : 'bg-[#f1f5f9] text-[#0a295b]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {subTab === 'pages' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="space-y-2 lg:col-span-5">
            {pages.map((p) => {
              const isSystemPage = ['about-us', 'how-it-works', 'contact'].includes(p.slug)
              return (
                <div
                  key={p.slug}
                  className="flex items-center justify-between rounded-[8px] border border-[#e8edf5] px-4 py-3"
                >
                  <button
                    type="button"
                    onClick={() => setPageForm({ ...pageForm, ...p })}
                    className="cursor-pointer text-left"
                  >
                    <div className="text-[1.45rem] font-bold text-[#0c3a94]">
                      {p.titleEn || p.title || p.slug}
                    </div>
                    <div className="text-[1.2rem] text-[#666666]">/{p.slug}</div>
                  </button>
                  {isSystemPage ? (
                    <span className="rounded-full bg-[#eef3ff] px-2.5 py-0.5 text-[1.1rem] font-semibold text-[#3665f6]">
                      System
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          await adminService.deletePage(p.slug)
                          showToast('Page deleted')
                          loadAll()
                        } catch (err) {
                          showToast(err?.message || 'Cannot delete this page')
                        }
                      }}
                      className="cursor-pointer text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              )
            })}
          </div>

          <form
            onSubmit={async (e) => {
              e.preventDefault()
              await adminService.upsertPage(pageForm)
              showToast('Page saved')
              loadAll()
            }}
            className="space-y-3 rounded-[10px] border border-[#e8edf5] bg-[#fafbfc] p-5 lg:col-span-7"
          >
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                required
                placeholder="Slug (e.g. about-us)"
                value={pageForm.slug}
                onChange={(e) => setPageForm({ ...pageForm, slug: e.target.value })}
                className="rounded-[8px] border border-[#d1d5db] bg-white px-3 py-2 text-[1.35rem]"
              />
              <input
                type="text"
                placeholder="Title (EN)"
                value={pageForm.titleEn}
                onChange={(e) => setPageForm({ ...pageForm, titleEn: e.target.value })}
                className="rounded-[8px] border border-[#d1d5db] bg-white px-3 py-2 text-[1.35rem]"
              />
            </div>
            <input
              type="text"
              placeholder="Heading (EN)"
              value={pageForm.headingEn}
              onChange={(e) => setPageForm({ ...pageForm, headingEn: e.target.value })}
              className="w-full rounded-[8px] border border-[#d1d5db] bg-white px-3 py-2 text-[1.35rem]"
            />
            <textarea
              rows={4}
              placeholder="Content (EN / HTML)"
              value={pageForm.contentEn}
              onChange={(e) => setPageForm({ ...pageForm, contentEn: e.target.value })}
              className="w-full rounded-[8px] border border-[#d1d5db] bg-white px-3 py-2 text-[1.35rem]"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Mission Title (EN)"
                value={pageForm.missionTitleEn}
                onChange={(e) => setPageForm({ ...pageForm, missionTitleEn: e.target.value })}
                className="rounded-[8px] border border-[#d1d5db] bg-white px-3 py-2 text-[1.35rem]"
              />
              <input
                type="text"
                placeholder="Mission Text (EN)"
                value={pageForm.missionTextEn}
                onChange={(e) => setPageForm({ ...pageForm, missionTextEn: e.target.value })}
                className="rounded-[8px] border border-[#d1d5db] bg-white px-3 py-2 text-[1.35rem]"
              />
            </div>
            <button type="submit" className="zm-btn zm-btn-green rounded-[8px] !px-5 !py-2">
              <span>Save Page</span>
            </button>
          </form>
        </div>
      )}

      {subTab === 'pillars' && (
        <div className="space-y-5">
          <form
            onSubmit={async (e) => {
              e.preventDefault()
              await adminService.createPillar(pillarForm)
              setPillarForm({ titleEn: '', descriptionEn: '', displayOrder: 0 })
              showToast('Pillar created')
              loadAll()
            }}
            className="flex flex-wrap gap-3"
          >
            <input
              type="text"
              required
              placeholder="Pillar Title (EN)"
              value={pillarForm.titleEn}
              onChange={(e) => setPillarForm({ ...pillarForm, titleEn: e.target.value })}
              className="flex-1 rounded-[8px] border border-[#d1d5db] px-3 py-2 text-[1.35rem]"
            />
            <input
              type="text"
              required
              placeholder="Description (EN)"
              value={pillarForm.descriptionEn}
              onChange={(e) => setPillarForm({ ...pillarForm, descriptionEn: e.target.value })}
              className="flex-[2] rounded-[8px] border border-[#d1d5db] px-3 py-2 text-[1.35rem]"
            />
            <button type="submit" className="zm-btn zm-btn-green rounded-[8px] !px-4 !py-2">
              <span className="inline-flex items-center gap-1">
                <Plus className="h-4 w-4" /> Add Pillar
              </span>
            </button>
          </form>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {pillars.map((pil) => (
              <div
                key={pil.id}
                className="flex items-start justify-between rounded-[8px] border border-[#e8edf5] p-4"
              >
                <div>
                  <div className="text-[1.5rem] font-bold text-[#0c3a94]">
                    {pil.titleEn || pil.title}
                  </div>
                  <div className="mt-1 text-[1.3rem] text-[#555555]">
                    {pil.descriptionEn || pil.description}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    await adminService.deletePillar(pil.id)
                    showToast('Pillar deleted')
                    loadAll()
                  }}
                  className="cursor-pointer text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {subTab === 'team' && (
        <div className="space-y-5">
          <form
            onSubmit={async (e) => {
              e.preventDefault()
              await adminService.createTeamMember(teamForm)
              setTeamForm({
                fullName: '',
                roleEn: '',
                bioEn: '',
                quoteEn: '',
                email: '',
                phone: '',
                isPrimaryCoordinator: false,
              })
              showToast('Team member added')
              loadAll()
            }}
            className="grid grid-cols-1 gap-3 rounded-[10px] border border-[#e8edf5] bg-[#fafbfc] p-4 sm:grid-cols-2"
          >
            <input
              type="text"
              required
              placeholder="Full Name"
              value={teamForm.fullName}
              onChange={(e) => setTeamForm({ ...teamForm, fullName: e.target.value })}
              className="rounded-[8px] border border-[#d1d5db] bg-white px-3 py-2 text-[1.35rem]"
            />
            <input
              type="text"
              placeholder="Role (EN)"
              value={teamForm.roleEn}
              onChange={(e) => setTeamForm({ ...teamForm, roleEn: e.target.value })}
              className="rounded-[8px] border border-[#d1d5db] bg-white px-3 py-2 text-[1.35rem]"
            />
            <input
              type="email"
              placeholder="Email"
              value={teamForm.email}
              onChange={(e) => setTeamForm({ ...teamForm, email: e.target.value })}
              className="rounded-[8px] border border-[#d1d5db] bg-white px-3 py-2 text-[1.35rem]"
            />
            <input
              type="tel"
              placeholder="Phone"
              value={teamForm.phone}
              onChange={(e) => setTeamForm({ ...teamForm, phone: e.target.value })}
              className="rounded-[8px] border border-[#d1d5db] bg-white px-3 py-2 text-[1.35rem]"
            />
            <label className="flex items-center gap-2 text-[1.35rem] font-semibold">
              <input
                type="checkbox"
                checked={teamForm.isPrimaryCoordinator}
                onChange={(e) =>
                  setTeamForm({ ...teamForm, isPrimaryCoordinator: e.target.checked })
                }
              />
              Primary Coordinator
            </label>
            <div className="flex justify-end">
              <button type="submit" className="zm-btn zm-btn-green rounded-[8px] !px-5 !py-2">
                <span>+ Add Team Member</span>
              </button>
            </div>
          </form>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {team.map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between rounded-[8px] border border-[#e8edf5] p-4"
              >
                <div>
                  <div className="text-[1.5rem] font-bold text-[#0c3a94]">
                    {m.fullName}
                    {m.isPrimaryCoordinator && (
                      <span className="ml-2 rounded-full bg-[#eef8e6] px-2.5 py-0.5 text-[1.1rem] text-[#4e8a2c]">
                        Primary Coordinator
                      </span>
                    )}
                  </div>
                  <div className="text-[1.3rem] text-[#666666]">{m.roleEn || m.role}</div>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    await adminService.deleteTeamMember(m.id)
                    showToast('Team member deleted')
                    loadAll()
                  }}
                  className="cursor-pointer text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {subTab === 'steps' && (
        <div className="space-y-5">
          <form
            onSubmit={async (e) => {
              e.preventDefault()
              await adminService.createStep(stepForm)
              setStepForm({
                stepNumber: steps.length + 2,
                titleEn: '',
                contentEn: '',
                ctaLabelEn: '',
                ctaUrl: '',
              })
              showToast('Step added')
              loadAll()
            }}
            className="grid grid-cols-1 gap-3 rounded-[10px] border border-[#e8edf5] bg-[#fafbfc] p-4 sm:grid-cols-2"
          >
            <input
              type="number"
              placeholder="Step #"
              value={stepForm.stepNumber}
              onChange={(e) => setStepForm({ ...stepForm, stepNumber: Number(e.target.value) })}
              className="rounded-[8px] border border-[#d1d5db] bg-white px-3 py-2 text-[1.35rem]"
            />
            <input
              type="text"
              required
              placeholder="Step Title (EN)"
              value={stepForm.titleEn}
              onChange={(e) => setStepForm({ ...stepForm, titleEn: e.target.value })}
              className="rounded-[8px] border border-[#d1d5db] bg-white px-3 py-2 text-[1.35rem]"
            />
            <textarea
              rows={2}
              required
              placeholder="Step Content (EN)"
              value={stepForm.contentEn}
              onChange={(e) => setStepForm({ ...stepForm, contentEn: e.target.value })}
              className="rounded-[8px] border border-[#d1d5db] bg-white px-3 py-2 text-[1.35rem] sm:col-span-2"
            />
            <button type="submit" className="zm-btn zm-btn-green w-fit rounded-[8px] !px-5 !py-2">
              <span>+ Add Step</span>
            </button>
          </form>

          <div className="space-y-2">
            {steps.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between rounded-[8px] border border-[#e8edf5] p-4"
              >
                <div>
                  <span className="font-bold text-[#3665f6]">Step {s.stepNumber}: </span>
                  <span className="font-bold text-[#0c3a94]">{s.titleEn || s.title}</span>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    await adminService.deleteStep(s.id)
                    showToast('Step deleted')
                    loadAll()
                  }}
                  className="cursor-pointer text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export function AdminContactMessagesTab({ showToast }) {
  const [messages, setMessages] = useState([])
  const [filter, setFilter] = useState('all')

  const loadMessages = async () => {
    const data = await adminService.getContactMessages().catch(() => [])
    setMessages(Array.isArray(data) ? data : [])
  }

  useEffect(() => {
    loadMessages()
  }, [])

  const filtered = messages.filter((m) =>
    filter === 'all' ? true : filter === 'handled' ? m.isHandled : !m.isHandled
  )

  return (
    <div className="rounded-[12px] border border-[#e8edf5] bg-white p-6 shadow-xs">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-[2rem] font-bold text-[#0c3a94]">
          Contact Messages ({filtered.length})
        </h2>
        <div className="flex gap-2">
          {['all', 'unread', 'handled'].map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`cursor-pointer rounded-[8px] px-4 py-1.5 text-[1.3rem] font-bold capitalize ${
                filter === f ? 'bg-[#3665f6] text-white' : 'bg-[#f1f5f9] text-[#0a295b]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="py-10 text-center text-[1.45rem] text-[#666666]">
          No contact messages found.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((msg) => (
            <div
              key={msg.id}
              className="flex flex-col justify-between gap-4 rounded-[10px] border border-[#e8edf5] p-4 sm:flex-row sm:items-center"
            >
              <div>
                <div className="text-[1.5rem] font-bold text-[#0c3a94]">
                  {msg.name} <span className="text-[1.3rem] font-normal text-[#666666]">({msg.email})</span>
                </div>
                <p className="mt-1 text-[1.4rem] text-[#555555]">{msg.message}</p>
              </div>
              {!msg.isHandled ? (
                <button
                  type="button"
                  onClick={async () => {
                    await adminService.markContactHandled(msg.id)
                    showToast('Marked as handled')
                    loadMessages()
                  }}
                  className="zm-btn zm-btn-green shrink-0 rounded-[8px] !px-4 !py-2 !text-[1.25rem]"
                >
                  <span>Mark as Handled</span>
                </button>
              ) : (
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#eef8e6] px-3 py-1 text-[1.25rem] font-semibold text-[#4e8a2c]">
                  <CheckCircle2 className="h-4 w-4" /> Handled
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
