import {
  ChevronDown,
  ChevronRight,
  Pencil,
  Plus,
  Trash2,
  X,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import adminService from '../../services/adminService'

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function getItemTitle(item) {
  if (!item) return ''
  return (
    item.title ||
    item.name ||
    item.titleEn ||
    item.titleAz ||
    item.titleRu ||
    item.nameEn ||
    item.slug ||
    'Untitled'
  )
}

export default function AdminServicesTreeTab({
  clinics = [],
  doctors = [],
  packages = [],
  showToast,
}) {
  const [tree, setTree] = useState([])
  const [unmatchedServices, setUnmatchedServices] = useState([])
  const [loading, setLoading] = useState(false)
  const [expandedCats, setExpandedCats] = useState({})
  const [expandedSubs, setExpandedSubs] = useState({})

  // Category Modal State
  const [catModalOpen, setCatModalOpen] = useState(false)
  const [editingCat, setEditingCat] = useState(null)
  const [catLang, setCatLang] = useState('en')
  const [catForm, setCatForm] = useState({
    parentId: '',
    slug: '',
    displayOrder: 0,
    showInHeaderMenu: true,
    showOnHomePage: false,
    isActive: true,
    titleEn: '',
    titleAz: '',
    titleRu: '',
    descriptionEn: '',
    descriptionAz: '',
    descriptionRu: '',
  })

  // 4-Tab Procedure Modal State
  const [procModalOpen, setProcModalOpen] = useState(false)
  const [procTab, setProcTab] = useState('general') // 'general' | 'clinics' | 'doctors' | 'faq'
  const [procLang, setProcLang] = useState('en')
  const [editingProc, setEditingProc] = useState(null)
  const [procForm, setProcForm] = useState({
    categoryId: '',
    slug: '',
    durationText: '',
    displayOrder: 0,
    isMostSearched: false,
    isActive: true,
    relatedPackageId: '',
    titleEn: '',
    titleAz: '',
    titleRu: '',
    aboutEn: '',
    aboutAz: '',
    aboutRu: '',
    candidateEn: '',
    candidateAz: '',
    candidateRu: '',
    preparationEn: '',
    preparationAz: '',
    preparationRu: '',
    stepsEn: '',
    stepsAz: '',
    stepsRu: '',
    resultEn: '',
    resultAz: '',
    resultRu: '',
    precautionsEn: '',
    precautionsAz: '',
    precautionsRu: '',
    packageInfoEn: '',
    packageInfoAz: '',
    packageInfoRu: '',
  })
  const [heroFile, setHeroFile] = useState(null)
  const [promoFile, setPromoFile] = useState(null)

  // Tab 2: Clinics & Prices
  const [clinicPrices, setClinicPrices] = useState([])
  const [priceForm, setPriceForm] = useState({ clinicId: '', priceFrom: '', currency: 'EUR' })

  // Tab 3: Assigned Doctors
  const [assignedDoctorIds, setAssignedDoctorIds] = useState([])
  const [doctorSearch, setDoctorSearch] = useState('')

  // Tab 4: Procedure FAQs
  const [procFaqs, setProcFaqs] = useState([])
  const [faqForm, setFaqForm] = useState({
    questionEn: '',
    answerEn: '',
    questionAz: '',
    answerAz: '',
    questionRu: '',
    answerRu: '',
  })

  const loadTree = async () => {
    setLoading(true)
    try {
      const [rawCats, rawServices] = await Promise.all([
        adminService.getAdminCategories().catch(() => adminService.getCategories()),
        adminService.getAdminServices().catch(() => []),
      ])

      const catsList = Array.isArray(rawCats) ? rawCats : rawCats?.items || []
      const servicesList = Array.isArray(rawServices) ? rawServices : rawServices?.items || []

      const byCategoryId = {}
      servicesList.forEach((srv) => {
        const cid = srv.categoryId || srv.medicalCategoryId
        if (!cid) return
        if (!byCategoryId[cid]) byCategoryId[cid] = []
        byCategoryId[cid].push(srv)
      })

      const matchedIds = new Set()
      const mergeServices = (existing = [], catId) => {
        const extra = byCategoryId[catId] || []
        const map = new Map()
        ;[...existing, ...extra].forEach((s) => {
          if (s?.id) {
            matchedIds.add(s.id)
            map.set(s.id, s)
          }
        })
        return Array.from(map.values())
      }

      const enrichedTree = catsList.map((cat) => {
        const subs = (cat.subCategories || cat.subcategories || []).map((sub) => ({
          ...sub,
          services: mergeServices(sub.services || [], sub.id),
        }))
        return {
          ...cat,
          subCategories: subs,
          services: mergeServices(cat.services || [], cat.id),
        }
      })

      setTree(enrichedTree)
      setUnmatchedServices(servicesList.filter((s) => s?.id && !matchedIds.has(s.id)))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTree()
  }, [])

  const openCategoryModal = (cat = null, parentId = '') => {
    setEditingCat(cat)
    setCatLang('en')
    if (cat) {
      setCatForm({
        parentId: cat.parentId || '',
        slug: cat.slug || '',
        displayOrder: cat.displayOrder ?? 0,
        showInHeaderMenu: cat.showInHeaderMenu ?? true,
        showOnHomePage: cat.showOnHomePage ?? false,
        isActive: cat.isActive ?? true,
        titleEn: cat.titleEn || cat.title || cat.name || '',
        titleAz: cat.titleAz || '',
        titleRu: cat.titleRu || '',
        descriptionEn: cat.descriptionEn || cat.description || '',
        descriptionAz: cat.descriptionAz || '',
        descriptionRu: cat.descriptionRu || '',
      })
    } else {
      setCatForm({
        parentId: parentId || '',
        slug: '',
        displayOrder: 0,
        showInHeaderMenu: true,
        showOnHomePage: false,
        isActive: true,
        titleEn: '',
        titleAz: '',
        titleRu: '',
        descriptionEn: '',
        descriptionAz: '',
        descriptionRu: '',
      })
    }
    setCatModalOpen(true)
  }

  const handleSaveCategory = async (e) => {
    e.preventDefault()
    const payload = {
      ...catForm,
      parentId: catForm.parentId || null,
      slug: catForm.slug || slugify(catForm.titleEn),
      displayOrder: Number(catForm.displayOrder) || 0,
    }
    if (editingCat) {
      await adminService.updateCategory(editingCat.id, payload)
      showToast('Category updated')
    } else {
      await adminService.createCategory(payload)
      showToast('Category created')
    }
    setCatModalOpen(false)
    loadTree()
  }

  const openProcedureModal = async (proc = null, defaultCategoryId = '') => {
    setProcTab('general')
    setProcLang('en')
    setHeroFile(null)
    setPromoFile(null)
    if (proc) {
      const detail = (await adminService.getAdminServiceById(proc.id).catch(() => null)) || proc
      setEditingProc(detail)
      setProcForm({
        categoryId: detail.categoryId || defaultCategoryId || '',
        slug: detail.slug || '',
        durationText: detail.durationText || '',
        displayOrder: detail.displayOrder ?? 0,
        isMostSearched: Boolean(detail.isMostSearched),
        isActive: detail.isActive ?? true,
        relatedPackageId: detail.relatedPackageId || '',
        titleEn: detail.titleEn || detail.title || '',
        titleAz: detail.titleAz || '',
        titleRu: detail.titleRu || '',
        aboutEn: detail.aboutEn || detail.about || '',
        aboutAz: detail.aboutAz || '',
        aboutRu: detail.aboutRu || '',
        candidateEn: detail.candidateEn || detail.candidate || '',
        candidateAz: detail.candidateAz || '',
        candidateRu: detail.candidateRu || '',
        preparationEn: detail.preparationEn || detail.preparation || '',
        preparationAz: detail.preparationAz || '',
        preparationRu: detail.preparationRu || '',
        stepsEn: detail.stepsEn || detail.steps || '',
        stepsAz: detail.stepsAz || '',
        stepsRu: detail.stepsRu || '',
        resultEn: detail.resultEn || detail.result || '',
        resultAz: detail.resultAz || '',
        resultRu: detail.resultRu || '',
        precautionsEn: detail.precautionsEn || detail.precautions || '',
        precautionsAz: detail.precautionsAz || '',
        precautionsRu: detail.precautionsRu || '',
        packageInfoEn: detail.packageInfoEn || detail.packageInfo || '',
        packageInfoAz: detail.packageInfoAz || '',
        packageInfoRu: detail.packageInfoRu || '',
      })
      setClinicPrices(detail.clinicPrices || detail.availableClinics || [])
      setAssignedDoctorIds(
        (detail.assignedDoctorIds || detail.availableDoctors || []).map((d) =>
          typeof d === 'string' ? d : d.id
        )
      )
      const faqs = await adminService.getAdminFaqs(detail.id).catch(() => [])
      setProcFaqs(Array.isArray(faqs) ? faqs : [])
    } else {
      setEditingProc(null)
      setProcForm({
        categoryId: defaultCategoryId || '',
        slug: '',
        durationText: '',
        displayOrder: 0,
        isMostSearched: false,
        isActive: true,
        relatedPackageId: '',
        titleEn: '',
        titleAz: '',
        titleRu: '',
        aboutEn: '',
        aboutAz: '',
        aboutRu: '',
        candidateEn: '',
        candidateAz: '',
        candidateRu: '',
        preparationEn: '',
        preparationAz: '',
        preparationRu: '',
        stepsEn: '',
        stepsAz: '',
        stepsRu: '',
        resultEn: '',
        resultAz: '',
        resultRu: '',
        precautionsEn: '',
        precautionsAz: '',
        precautionsRu: '',
        packageInfoEn: '',
        packageInfoAz: '',
        packageInfoRu: '',
      })
      setClinicPrices([])
      setAssignedDoctorIds([])
      setProcFaqs([])
    }
    setProcModalOpen(true)
  }

  const handleSaveProcedure = async (e) => {
    e.preventDefault()
    const payload = {
      ...procForm,
      slug: procForm.slug || slugify(procForm.titleEn),
      displayOrder: Number(procForm.displayOrder) || 0,
      relatedPackageId: procForm.relatedPackageId || null,
    }
    let saved
    if (editingProc) {
      saved = await adminService.updateService(editingProc.id, payload)
      showToast('Procedure updated')
    } else {
      saved = await adminService.createService(payload)
      showToast('Procedure created')
    }
    const targetId = saved?.id || editingProc?.id
    if (targetId && heroFile) {
      await adminService.uploadServiceHeroImage(targetId, heroFile).catch(() => {})
    }
    if (targetId && promoFile) {
      await adminService.uploadServicePromoBanner(targetId, promoFile).catch(() => {})
    }
    if (saved) {
      const normalizedSaved =
        typeof saved === 'string' ? { id: saved, ...payload } : { ...payload, ...saved }
      setEditingProc(normalizedSaved)
    }
    loadTree()
  }

  const langSuffix = procLang === 'az' ? 'Az' : procLang === 'ru' ? 'Ru' : 'En'
  const catLangSuffix = catLang === 'az' ? 'Az' : catLang === 'ru' ? 'Ru' : 'En'

  return (
    <div className="rounded-[12px] border border-[#e8edf5] bg-white p-6 shadow-xs">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-[2rem] font-bold text-[#0c3a94]">
            Medical Categories &amp; Services (3-Level Tree)
          </h2>
          <p className="text-[1.3rem] text-[#666666]">
            Manage Main Categories → Subcategories → Procedures, Clinic Prices, Doctors &amp; FAQs
          </p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => openCategoryModal(null, '')}
            className="cursor-pointer rounded-[8px] border border-[#3665f6] px-5 py-2.5 text-[1.35rem] font-semibold text-[#3665f6] hover:bg-[#3665f6] hover:text-white"
          >
            + Add Category
          </button>
          <button
            type="button"
            onClick={() => openProcedureModal(null, tree?.[0]?.subCategories?.[0]?.id || tree?.[0]?.id || '')}
            className="zm-btn zm-btn-green rounded-[8px] !px-5 !py-2.5 !text-[1.35rem]"
          >
            <span>+ Add Procedure</span>
          </button>
        </div>
      </div>

      {loading && tree.length === 0 ? (
        <div className="py-10 text-center text-[1.45rem] text-[#666666]">Loading categories...</div>
      ) : (
        <div className="space-y-4">
          {tree.map((cat) => {
            const isCatOpen = expandedCats[cat.id] ?? true
            const subs = cat.subCategories || cat.subcategories || []
            return (
              <div
                key={cat.id}
                className="rounded-[10px] border border-[#e8edf5] bg-[#fafbfc] p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedCats((p) => ({ ...p, [cat.id]: !isCatOpen }))
                    }
                    className="flex cursor-pointer items-center gap-2 text-left text-[1.75rem] font-bold text-[#0c3a94]"
                  >
                    {isCatOpen ? (
                      <ChevronDown className="h-5 w-5" />
                    ) : (
                      <ChevronRight className="h-5 w-5" />
                    )}
                    {getItemTitle(cat)}
                    <span className="rounded-full bg-[#eef3ff] px-2.5 py-0.5 text-[1.15rem] text-[#3665f6]">
                      {subs.length} sub
                    </span>
                  </button>

                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => openCategoryModal(null, cat.id)}
                      className="inline-flex cursor-pointer items-center gap-1 rounded-[6px] bg-[#eef3ff] px-3 py-1.5 text-[1.25rem] font-semibold text-[#3665f6] hover:bg-[#3665f6] hover:text-white"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add Subcategory
                    </button>
                    <button
                      type="button"
                      onClick={() => openCategoryModal(cat, '')}
                      className="cursor-pointer p-1.5 text-[#0a295b] hover:text-[#3665f6]"
                      title="Edit category"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        await adminService.deleteCategory(cat.id)
                        showToast('Category deleted')
                        loadTree()
                      }}
                      className="cursor-pointer p-1.5 text-red-600 hover:text-red-800"
                      title="Delete category"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {isCatOpen && (
                  <div className="mt-4 space-y-3 pl-5">
                    {subs.map((sub) => {
                      const isSubOpen = expandedSubs[sub.id] ?? true
                      const procs = sub.services || []
                      return (
                        <div
                          key={sub.id}
                          className="rounded-[8px] border border-[#e3eaf5] bg-white p-3.5"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                setExpandedSubs((p) => ({ ...p, [sub.id]: !isSubOpen }))
                              }
                              className="flex cursor-pointer items-center gap-2 text-[1.5rem] font-bold text-[#0a295b]"
                            >
                              {isSubOpen ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                              {getItemTitle(sub)}
                            </button>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => openProcedureModal(null, sub.id)}
                                className="inline-flex cursor-pointer items-center gap-1 rounded-[6px] bg-[#eef8e6] px-2.5 py-1 text-[1.2rem] font-semibold text-[#4e8a2c] hover:bg-[#7fbb58] hover:text-white"
                              >
                                <Plus className="h-3.5 w-3.5" /> Add Procedure
                              </button>
                              <button
                                type="button"
                                onClick={() => openCategoryModal(sub, cat.id)}
                                className="cursor-pointer p-1 text-[#0a295b] hover:text-[#3665f6]"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={async () => {
                                  await adminService.deleteCategory(sub.id)
                                  showToast('Subcategory deleted')
                                  loadTree()
                                }}
                                className="cursor-pointer p-1 text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>

                          {isSubOpen && procs.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {procs.map((proc) => (
                                <div
                                  key={proc.id}
                                  className="inline-flex items-center gap-2 rounded-full border border-[#d6e0f0] bg-[#f8faff] px-3.5 py-1.5 text-[1.25rem] font-semibold text-[#0a295b]"
                                >
                                  <span>{getItemTitle(proc)}</span>
                                  <button
                                    type="button"
                                    onClick={() => openProcedureModal(proc, sub.id)}
                                    className="cursor-pointer text-[#3665f6] hover:text-[#0c3a94]"
                                    title="Edit procedure"
                                  >
                                    <Pencil className="h-3.5 w-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={async () => {
                                      await adminService.deleteService(proc.id)
                                      showToast('Procedure deleted')
                                      loadTree()
                                    }}
                                    className="cursor-pointer text-red-500 hover:text-red-700"
                                    title="Delete procedure"
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )
                    })}

                    {/* Direct procedures under top-level category if any */}
                    {cat.services && cat.services.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {cat.services.map((proc) => (
                          <div
                            key={proc.id}
                            className="inline-flex items-center gap-2 rounded-full border border-[#d6e0f0] bg-white px-3.5 py-1.5 text-[1.25rem] font-semibold text-[#0a295b]"
                          >
                            <span>{proc.title}</span>
                            <button
                              type="button"
                              onClick={() => openProcedureModal(proc, cat.id)}
                              className="cursor-pointer text-[#3665f6]"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={async () => {
                                await adminService.deleteService(proc.id)
                                showToast('Procedure deleted')
                                loadTree()
                              }}
                              className="cursor-pointer text-red-500"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}

          {unmatchedServices.length > 0 && (
            <div className="rounded-[10px] border border-[#e8edf5] bg-[#fafbfc] p-4">
              <div className="text-[1.6rem] font-bold text-[#0c3a94]">
                All / Uncategorized Procedures ({unmatchedServices.length})
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {unmatchedServices.map((proc) => (
                  <div
                    key={proc.id}
                    className="inline-flex items-center gap-2 rounded-full border border-[#d6e0f0] bg-white px-3.5 py-1.5 text-[1.25rem] font-semibold text-[#0a295b]"
                  >
                    <span>{getItemTitle(proc)}</span>
                    <button
                      type="button"
                      onClick={() => openProcedureModal(proc, proc.categoryId || '')}
                      className="cursor-pointer text-[#3665f6] hover:text-[#0c3a94]"
                      title="Edit procedure"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        await adminService.deleteService(proc.id)
                        showToast('Procedure deleted')
                        loadTree()
                      }}
                      className="cursor-pointer text-red-500 hover:text-red-700"
                      title="Delete procedure"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* CATEGORY CREATE / EDIT MODAL */}
      {catModalOpen && (
        <div className="fixed inset-0 z-[1300] flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-[620px] overflow-y-auto rounded-[14px] bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-[2rem] font-bold text-[#0c3a94]">
                {editingCat ? 'Edit Category' : 'New Category / Subcategory'}
              </h3>
              <button
                type="button"
                onClick={() => setCatModalOpen(false)}
                className="cursor-pointer p-1 text-[#666666]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-[1.25rem] font-semibold text-[#0a295b]">
                    Parent Category
                  </label>
                  <select
                    value={catForm.parentId}
                    onChange={(e) => setCatForm({ ...catForm, parentId: e.target.value })}
                    className="mt-1 w-full rounded-[8px] border border-[#d1d5db] px-3 py-2 text-[1.4rem]"
                  >
                    <option value="">None (Top-level)</option>
                    {tree.map((c) => (
                      <option key={c.id} value={c.id}>
                        {getItemTitle(c)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[1.25rem] font-semibold text-[#0a295b]">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={catForm.displayOrder}
                    onChange={(e) => setCatForm({ ...catForm, displayOrder: e.target.value })}
                    className="mt-1 w-full rounded-[8px] border border-[#d1d5db] px-3 py-2 text-[1.4rem]"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-[1.35rem] font-medium">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={catForm.showInHeaderMenu}
                    onChange={(e) =>
                      setCatForm({ ...catForm, showInHeaderMenu: e.target.checked })
                    }
                    className="accent-[#3665f6]"
                  />
                  Show in Header Menu
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={catForm.showOnHomePage}
                    onChange={(e) => setCatForm({ ...catForm, showOnHomePage: e.target.checked })}
                    className="accent-[#3665f6]"
                  />
                  Show on Home Page
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={catForm.isActive}
                    onChange={(e) => setCatForm({ ...catForm, isActive: e.target.checked })}
                    className="accent-[#7fbb58]"
                  />
                  Is Active
                </label>
              </div>

              <div className="flex gap-2 border-b border-[#e8edf5] pb-2">
                {['en', 'az', 'ru'].map((lng) => (
                  <button
                    key={lng}
                    type="button"
                    onClick={() => setCatLang(lng)}
                    className={`cursor-pointer rounded-[6px] px-3 py-1 text-[1.25rem] font-bold uppercase ${
                      catLang === lng ? 'bg-[#3665f6] text-white' : 'bg-[#f1f5f9] text-[#0a295b]'
                    }`}
                  >
                    {lng}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-[1.25rem] font-semibold text-[#0a295b]">
                  Title ({catLang.toUpperCase()}) *
                </label>
                <input
                  type="text"
                  required={catLang === 'en'}
                  value={catForm[`title${catLangSuffix}`]}
                  onChange={(e) =>
                    setCatForm({ ...catForm, [`title${catLangSuffix}`]: e.target.value })
                  }
                  className="mt-1 w-full rounded-[8px] border border-[#d1d5db] px-3 py-2 text-[1.4rem]"
                />
              </div>
              <div>
                <label className="block text-[1.25rem] font-semibold text-[#0a295b]">
                  Description ({catLang.toUpperCase()})
                </label>
                <textarea
                  rows={3}
                  value={catForm[`description${catLangSuffix}`]}
                  onChange={(e) =>
                    setCatForm({ ...catForm, [`description${catLangSuffix}`]: e.target.value })
                  }
                  className="mt-1 w-full rounded-[8px] border border-[#d1d5db] px-3 py-2 text-[1.4rem]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCatModalOpen(false)}
                  className="cursor-pointer rounded-[8px] border border-[#d1d5db] px-4 py-2 text-[1.35rem]"
                >
                  Cancel
                </button>
                <button type="submit" className="zm-btn zm-btn-green rounded-[8px] !px-5 !py-2">
                  <span>Save Category</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4-TAB PROCEDURE EDITOR MODAL */}
      {procModalOpen && (
        <div className="fixed inset-0 z-[1300] flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[92vh] w-full max-w-[820px] overflow-y-auto rounded-[14px] bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-[2rem] font-bold text-[#0c3a94]">
                {editingProc ? `Edit Procedure: ${getItemTitle(editingProc)}` : 'Create Procedure'}
              </h3>
              <button
                type="button"
                onClick={() => setProcModalOpen(false)}
                className="cursor-pointer p-1 text-[#666666]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* 4 Modal Tabs */}
            <div className="mb-5 flex flex-wrap gap-2 border-b border-[#e8edf5] pb-3">
              {[
                { id: 'general', label: '1. General & Content' },
                { id: 'clinics', label: '2. Clinics & Prices' },
                { id: 'doctors', label: '3. Assigned Doctors' },
                { id: 'faq', label: '4. Procedure F.A.Q.' },
              ].map((tItem) => (
                <button
                  key={tItem.id}
                  type="button"
                  onClick={() => setProcTab(tItem.id)}
                  className={`cursor-pointer rounded-[8px] px-4 py-2 text-[1.3rem] font-bold ${
                    procTab === tItem.id
                      ? 'bg-[#3665f6] text-white'
                      : 'bg-[#f1f5f9] text-[#0a295b] hover:bg-[#e2e8f0]'
                  }`}
                >
                  {tItem.label}
                </button>
              ))}
            </div>

            {procTab === 'general' && (
              <form onSubmit={handleSaveProcedure} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-[1.25rem] font-semibold">Category *</label>
                    <select
                      required
                      value={procForm.categoryId}
                      onChange={(e) => setProcForm({ ...procForm, categoryId: e.target.value })}
                      className="mt-1 w-full rounded-[8px] border border-[#d1d5db] px-3 py-2 text-[1.35rem]"
                    >
                      <option value="">Select category…</option>
                      {tree.map((c) => {
                        const subs = c.subCategories || c.subcategories || []
                        return subs.length > 0 ? (
                          <optgroup key={c.id} label={getItemTitle(c)}>
                            {subs.map((s) => (
                              <option key={s.id} value={s.id}>
                                {getItemTitle(s)}
                              </option>
                            ))}
                          </optgroup>
                        ) : (
                          <option key={c.id} value={c.id}>
                            {getItemTitle(c)}
                          </option>
                        )
                      })}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[1.25rem] font-semibold">Duration Text</label>
                    <input
                      type="text"
                      value={procForm.durationText}
                      onChange={(e) => setProcForm({ ...procForm, durationText: e.target.value })}
                      placeholder="e.g. 2–3 days"
                      className="mt-1 w-full rounded-[8px] border border-[#d1d5db] px-3 py-2 text-[1.35rem]"
                    />
                  </div>
                  <div>
                    <label className="block text-[1.25rem] font-semibold">Related Package</label>
                    <select
                      value={procForm.relatedPackageId}
                      onChange={(e) =>
                        setProcForm({ ...procForm, relatedPackageId: e.target.value })
                      }
                      className="mt-1 w-full rounded-[8px] border border-[#d1d5db] px-3 py-2 text-[1.35rem]"
                    >
                      <option value="">None</option>
                      {packages.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 text-[1.3rem] font-medium">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={procForm.isMostSearched}
                      onChange={(e) =>
                        setProcForm({ ...procForm, isMostSearched: e.target.checked })
                      }
                    />
                    Most Searched
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={procForm.isActive}
                      onChange={(e) => setProcForm({ ...procForm, isActive: e.target.checked })}
                    />
                    Active
                  </label>
                </div>

                <div className="flex gap-2 border-b border-[#e8edf5] pb-2">
                  {['en', 'az', 'ru'].map((lng) => (
                    <button
                      key={lng}
                      type="button"
                      onClick={() => setProcLang(lng)}
                      className={`cursor-pointer rounded-[6px] px-3 py-1 text-[1.25rem] font-bold uppercase ${
                        procLang === lng
                          ? 'bg-[#3665f6] text-white'
                          : 'bg-[#f1f5f9] text-[#0a295b]'
                      }`}
                    >
                      {lng}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-[1.25rem] font-semibold">
                    Title ({procLang.toUpperCase()}) *
                  </label>
                  <input
                    type="text"
                    required={procLang === 'en'}
                    value={procForm[`title${langSuffix}`]}
                    onChange={(e) =>
                      setProcForm({ ...procForm, [`title${langSuffix}`]: e.target.value })
                    }
                    className="mt-1 w-full rounded-[8px] border border-[#d1d5db] px-3 py-2 text-[1.4rem]"
                  />
                </div>

                {[
                  { key: 'about', label: 'About' },
                  { key: 'candidate', label: 'Candidate' },
                  { key: 'preparation', label: 'Preparation' },
                  { key: 'steps', label: 'Treatment (Steps)' },
                  { key: 'result', label: 'Result' },
                  { key: 'precautions', label: 'Precautions' },
                  { key: 'packageInfo', label: 'Package Info' },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="block text-[1.25rem] font-semibold">
                      {f.label} ({procLang.toUpperCase()})
                    </label>
                    <textarea
                      rows={2}
                      value={procForm[`${f.key}${langSuffix}`]}
                      onChange={(e) =>
                        setProcForm({ ...procForm, [`${f.key}${langSuffix}`]: e.target.value })
                      }
                      className="mt-1 w-full rounded-[8px] border border-[#d1d5db] px-3 py-2 text-[1.35rem]"
                    />
                  </div>
                ))}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-[1.25rem] font-semibold">Hero Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setHeroFile(e.target.files?.[0] || null)}
                      className="mt-1 text-[1.25rem]"
                    />
                  </div>
                  <div>
                    <label className="block text-[1.25rem] font-semibold">Promo Banner</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setPromoFile(e.target.files?.[0] || null)}
                      className="mt-1 text-[1.25rem]"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setProcModalOpen(false)}
                    className="cursor-pointer rounded-[8px] border border-[#d1d5db] px-4 py-2 text-[1.35rem]"
                  >
                    Close
                  </button>
                  <button type="submit" className="zm-btn zm-btn-green rounded-[8px] !px-5 !py-2">
                    <span>Save Procedure</span>
                  </button>
                </div>
              </form>
            )}

            {procTab === 'clinics' && (
              <div className="space-y-5">
                {!editingProc ? (
                  <p className="text-[1.4rem] text-[#666666]">
                    Save the procedure in Tab 1 first to assign clinic prices.
                  </p>
                ) : (
                  <>
                    <div className="flex flex-wrap items-end gap-3">
                      <div className="flex-1">
                        <label className="block text-[1.25rem] font-semibold">Clinic</label>
                        <select
                          value={priceForm.clinicId}
                          onChange={(e) => setPriceForm({ ...priceForm, clinicId: e.target.value })}
                          className="mt-1 w-full rounded-[8px] border border-[#d1d5db] px-3 py-2 text-[1.35rem]"
                        >
                          <option value="">Select clinic…</option>
                          {clinics.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="w-[140px]">
                        <label className="block text-[1.25rem] font-semibold">Price From (€)</label>
                        <input
                          type="number"
                          value={priceForm.priceFrom}
                          onChange={(e) =>
                            setPriceForm({ ...priceForm, priceFrom: e.target.value })
                          }
                          className="mt-1 w-full rounded-[8px] border border-[#d1d5db] px-3 py-2 text-[1.35rem]"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={async () => {
                          if (!priceForm.clinicId || !priceForm.priceFrom) return
                          await adminService.setClinicPrice({
                            medicalServiceId: editingProc.id,
                            clinicId: priceForm.clinicId,
                            priceFrom: Number(priceForm.priceFrom),
                            currency: 'EUR',
                          })
                          showToast('Clinic price saved')
                          openProcedureModal(editingProc)
                        }}
                        className="zm-btn zm-btn-green rounded-[8px] !px-4 !py-2"
                      >
                        <span>Save Price</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {clinicPrices.map((cp) => (
                        <div
                          key={cp.clinicId || cp.id}
                          className="flex items-center justify-between rounded-[8px] border border-[#e8edf5] px-4 py-2.5 text-[1.4rem]"
                        >
                          <span className="font-semibold text-[#0c3a94]">
                            {cp.clinicName || cp.name} — €{cp.priceFrom}
                          </span>
                          <button
                            type="button"
                            onClick={async () => {
                              await adminService.deleteClinicPrice(
                                editingProc.id,
                                cp.clinicId || cp.id
                              )
                              showToast('Price removed')
                              openProcedureModal(editingProc)
                            }}
                            className="cursor-pointer text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {procTab === 'doctors' && (
              <div className="space-y-4">
                {!editingProc ? (
                  <p className="text-[1.4rem] text-[#666666]">
                    Save the procedure in Tab 1 first to assign doctors.
                  </p>
                ) : (
                  <>
                    <input
                      type="text"
                      placeholder="Search doctors..."
                      value={doctorSearch}
                      onChange={(e) => setDoctorSearch(e.target.value)}
                      className="w-full rounded-[8px] border border-[#d1d5db] px-3 py-2 text-[1.4rem]"
                    />
                    <div className="max-h-[260px] space-y-2 overflow-y-auto">
                      {doctors
                        .filter((d) =>
                          (d.fullName || d.name || '')
                            .toLowerCase()
                            .includes(doctorSearch.toLowerCase())
                        )
                        .map((doc) => {
                          const checked = assignedDoctorIds.includes(doc.id)
                          return (
                            <label
                              key={doc.id}
                              className="flex cursor-pointer items-center gap-3 rounded-[8px] border border-[#e8edf5] px-3 py-2 text-[1.35rem]"
                            >
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() =>
                                  setAssignedDoctorIds((prev) =>
                                    checked
                                      ? prev.filter((id) => id !== doc.id)
                                      : [...prev, doc.id]
                                  )
                                }
                              />
                              <span className="font-semibold text-[#0c3a94]">
                                {doc.fullName || doc.name}
                              </span>
                              {doc.clinicName && (
                                <span className="text-[#666666]">({doc.clinicName})</span>
                              )}
                            </label>
                          )
                        })}
                    </div>
                    <button
                      type="button"
                      onClick={async () => {
                        await adminService.assignServiceDoctors(editingProc.id, assignedDoctorIds)
                        showToast('Assigned doctors saved')
                      }}
                      className="zm-btn zm-btn-green rounded-[8px] !px-5 !py-2"
                    >
                      <span>Save Doctors</span>
                    </button>
                  </>
                )}
              </div>
            )}

            {procTab === 'faq' && (
              <div className="space-y-4">
                {!editingProc ? (
                  <p className="text-[1.4rem] text-[#666666]">
                    Save the procedure in Tab 1 first to add procedure FAQs.
                  </p>
                ) : (
                  <>
                    <div className="grid grid-cols-1 gap-3 rounded-[10px] border border-[#e8edf5] bg-[#fafbfc] p-4">
                      <input
                        type="text"
                        placeholder="Question (EN)"
                        value={faqForm.questionEn}
                        onChange={(e) => setFaqForm({ ...faqForm, questionEn: e.target.value })}
                        className="rounded-[8px] border border-[#d1d5db] bg-white px-3 py-2 text-[1.35rem]"
                      />
                      <textarea
                        rows={2}
                        placeholder="Answer (EN)"
                        value={faqForm.answerEn}
                        onChange={(e) => setFaqForm({ ...faqForm, answerEn: e.target.value })}
                        className="rounded-[8px] border border-[#d1d5db] bg-white px-3 py-2 text-[1.35rem]"
                      />
                      <button
                        type="button"
                        onClick={async () => {
                          if (!faqForm.questionEn || !faqForm.answerEn) return
                          await adminService.createFaq({
                            ...faqForm,
                            medicalServiceId: editingProc.id,
                          })
                          setFaqForm({
                            questionEn: '',
                            answerEn: '',
                            questionAz: '',
                            answerAz: '',
                            questionRu: '',
                            answerRu: '',
                          })
                          showToast('FAQ added')
                          openProcedureModal(editingProc)
                        }}
                        className="zm-btn zm-btn-green w-fit rounded-[8px] !px-4 !py-2"
                      >
                        <span>+ Add FAQ</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {procFaqs.map((faq) => (
                        <div
                          key={faq.id}
                          className="flex items-start justify-between gap-3 rounded-[8px] border border-[#e8edf5] p-3"
                        >
                          <div>
                            <div className="text-[1.4rem] font-bold text-[#0c3a94]">
                              {faq.questionEn || faq.question}
                            </div>
                            <div className="mt-1 text-[1.3rem] text-[#555555]">
                              {faq.answerEn || faq.answer}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={async () => {
                              await adminService.deleteFaq(faq.id)
                              showToast('FAQ deleted')
                              openProcedureModal(editingProc)
                            }}
                            className="cursor-pointer text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
