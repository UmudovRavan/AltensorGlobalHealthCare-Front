import {
  Building2,
  FolderTree,
  ImagePlus,
  Loader2,
  Package,
  Sparkles,
  Stethoscope,
  UploadCloud,
  X,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from '../../hooks/useTranslation'
import { resolveMediaUrl } from '../../services/apiClient'

function ImageDropzone({
  label,
  hint,
  file,
  existingUrl,
  onFileSelect,
  aspect = 'wide',
}) {
  const { t } = useTranslation()
  const inputRef = useRef(null)
  const [dragOver, setDragOver] = useState(false)
  const [objectUrl, setObjectUrl] = useState('')

  useEffect(() => {
    if (!file) {
      setObjectUrl('')
      return undefined
    }
    const url = URL.createObjectURL(file)
    setObjectUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const previewSrc = objectUrl || resolveMediaUrl(existingUrl) || ''

  const handleFiles = (files) => {
    const picked = files?.[0]
    if (picked && picked.type.startsWith('image/')) {
      onFileSelect(picked)
    }
  }

  return (
    <div>
      <label className="mb-1.5 block text-[1.25rem] font-semibold text-[#0a295b]">
        {label}
      </label>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            inputRef.current?.click()
          }
        }}
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragOver(false)
          handleFiles(e.dataTransfer.files)
        }}
        className={`group relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[12px] border-2 border-dashed transition-all ${
          aspect === 'square' ? 'h-[148px]' : 'h-[148px]'
        } ${
          dragOver
            ? 'border-[#3665f6] bg-[#eef3ff]'
            : 'border-[#cbd5e1] bg-[#f8faff] hover:border-[#3665f6] hover:bg-[#f0f5ff]'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/svg+xml"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        {previewSrc ? (
          <>
            <img
              src={previewSrc}
              alt={label}
              className={`h-full w-full ${
                aspect === 'square' ? 'object-contain p-2' : 'object-cover'
              }`}
            />
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-[#061838]/55 opacity-0 transition-opacity group-hover:opacity-100">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-[1.2rem] font-semibold text-[#0c3a94] shadow">
                <UploadCloud className="h-4 w-4" /> {t('admin.modal.change')}
              </span>
              {file && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onFileSelect(null)
                  }}
                  className="inline-flex cursor-pointer items-center gap-1 rounded-full bg-red-600 px-3 py-1.5 text-[1.2rem] font-semibold text-white shadow hover:bg-red-700"
                >
                  <X className="h-3.5 w-3.5" /> {t('admin.modal.remove')}
                </button>
              )}
            </div>
            {file && (
              <span className="absolute bottom-2 left-2 rounded-md bg-black/65 px-2 py-0.5 text-[1.1rem] font-medium text-white">
                {file.name} ({Math.max(1, Math.round(file.size / 1024))} KB)
              </span>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center px-4 text-center">
            <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-[#e6eeff] text-[#3665f6] transition-transform group-hover:scale-105">
              <ImagePlus className="h-5 w-5" />
            </div>
            <p className="text-[1.25rem] font-semibold text-[#0c3a94]">
              {t('admin.modal.clickDrag')}
            </p>
            <p className="mt-0.5 text-[1.1rem] text-[#64748b]">{hint}</p>
          </div>
        )}
      </div>
    </div>
  )
}

const inputClass =
  'w-full rounded-[10px] border border-[#d6deeb] bg-white px-3.5 py-2.5 text-[1.35rem] text-[#0a295b] outline-none transition-colors focus:border-[#3665f6] focus:ring-2 focus:ring-[#3665f6]/15'

const labelClass = 'mb-1.5 block text-[1.25rem] font-semibold text-[#0a295b]'

const MODAL_META = {
  clinic: {
    icon: Building2,
    badge: 'Partner Network',
    createTitle: 'Add Partner Clinic',
    editTitle: 'Edit Partner Clinic',
    subtitle: 'Configure hospital profile, contact details, logo & cover media.',
  },
  doctor: {
    icon: Stethoscope,
    badge: 'Medical Team',
    createTitle: 'Add Medical Specialist',
    editTitle: 'Edit Medical Specialist',
    subtitle: 'Assign specialist to a clinic, upload portrait photo & credentials.',
  },
  category: {
    icon: FolderTree,
    badge: 'Medical Directory',
    createTitle: 'Create Medical Category',
    editTitle: 'Edit Medical Category',
    subtitle: 'Organize treatments and procedures into structured specialties.',
  },
  service: {
    icon: Sparkles,
    badge: 'Procedures',
    createTitle: 'Add Medical Procedure',
    editTitle: 'Edit Medical Procedure',
    subtitle: 'Publish a treatment or diagnostic procedure under a category.',
  },
  package: {
    icon: Package,
    badge: 'All-In-One Care',
    createTitle: 'Create Treatment Package',
    editTitle: 'Edit Treatment Package',
    subtitle: 'Bundle treatment, accommodation & transfers with transparent pricing.',
  },
}

export default function AdminEntityModal({
  modalType,
  editingEntity,
  submitting,
  onClose,
  clinics,
  categories,
  clinicForm,
  setClinicForm,
  clinicLogoFile,
  setClinicLogoFile,
  clinicCoverFile,
  setClinicCoverFile,
  onSubmitClinic,
  doctorForm,
  setDoctorForm,
  doctorPhotoFile,
  setDoctorPhotoFile,
  onSubmitDoctor,
  categoryForm,
  setCategoryForm,
  onSubmitCategory,
  serviceForm,
  setServiceForm,
  onSubmitService,
  packageForm,
  setPackageForm,
  packageCoverFile,
  setPackageCoverFile,
  onSubmitPackage,
}) {
  const { t } = useTranslation()
  if (!modalType) return null

  const meta = MODAL_META[modalType] || MODAL_META.clinic
  const Icon = meta.icon
  const isEditing = Boolean(editingEntity)

  const handleFormSubmit = (e) => {
    if (modalType === 'clinic') return onSubmitClinic(e)
    if (modalType === 'doctor') return onSubmitDoctor(e)
    if (modalType === 'category') return onSubmitCategory(e)
    if (modalType === 'service') return onSubmitService(e)
    if (modalType === 'package') return onSubmitPackage(e)
    e.preventDefault()
  }

  return (
    <div
      className="fixed inset-0 z-[1400] flex items-center justify-center bg-[#061838]/55 p-4 backdrop-blur-[3px]"
      onClick={(e) => {
        if (e.target === e.currentTarget && !submitting) onClose()
      }}
    >
      <div
        className={`flex max-h-[90vh] w-full flex-col overflow-hidden rounded-[18px] border border-[#dbe4f3] bg-white shadow-2xl ${
          modalType === 'category' ? 'max-w-[580px]' : 'max-w-[780px]'
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between bg-gradient-to-r from-[#0c3a94] via-[#1748ad] to-[#295ee0] px-7 py-5 text-white">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] bg-white/15 ring-1 ring-white/25">
              <Icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="inline-block rounded-full bg-white/15 px-2.5 py-0.5 text-[1.05rem] font-semibold tracking-wide uppercase">
                {meta.badge}
              </span>
              <h3 className="mt-1 text-[2.1rem] leading-tight font-bold">
                {isEditing ? meta.editTitle : meta.createTitle}
              </h3>
              <p className="mt-0.5 text-[1.25rem] text-white/80">{meta.subtitle}</p>
            </div>
          </div>
          <button
            type="button"
            disabled={submitting}
            onClick={onClose}
            className="cursor-pointer rounded-full p-1.5 text-white/80 transition-colors hover:bg-white/15 hover:text-white disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <form
          id="admin-entity-form"
          onSubmit={handleFormSubmit}
          className="flex-1 space-y-6 overflow-y-auto px-7 py-6"
        >
          {/* CLINIC FORM */}
          {modalType === 'clinic' && (
            <>
              <div className="rounded-[12px] border border-[#e8edf5] bg-[#f8faff] p-4">
                <p className="mb-3 text-[1.2rem] font-bold tracking-wider text-[#3665f6] uppercase">
                  Media &amp; Branding
                </p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <ImageDropzone
                    label="Clinic Logo"
                    hint="PNG, SVG or JPG (square)"
                    aspect="square"
                    file={clinicLogoFile}
                    existingUrl={editingEntity?.data?.logoUrl}
                    onFileSelect={setClinicLogoFile}
                  />
                  <ImageDropzone
                    label="Clinic Cover Photo"
                    hint="JPG or WebP (16:9 recommended)"
                    aspect="wide"
                    file={clinicCoverFile}
                    existingUrl={editingEntity?.data?.coverImageUrl}
                    onFileSelect={setClinicCoverFile}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Clinic Name *</label>
                  <input
                    required
                    placeholder="e.g. Medikol Polyclinic"
                    value={clinicForm.name}
                    onChange={(e) => setClinicForm({ ...clinicForm, name: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>URL Slug</label>
                  <input
                    placeholder="auto-generated if empty"
                    value={clinicForm.slug}
                    onChange={(e) => setClinicForm({ ...clinicForm, slug: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>City</label>
                  <input
                    placeholder="Zagreb"
                    value={clinicForm.city}
                    onChange={(e) => setClinicForm({ ...clinicForm, city: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Address</label>
                  <input
                    placeholder="Street & building number"
                    value={clinicForm.address}
                    onChange={(e) => setClinicForm({ ...clinicForm, address: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Phone</label>
                  <input
                    placeholder="+385 1 ..."
                    value={clinicForm.phone}
                    onChange={(e) => setClinicForm({ ...clinicForm, phone: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Email</label>
                  <input
                    type="email"
                    placeholder="info@clinic.hr"
                    value={clinicForm.email}
                    onChange={(e) => setClinicForm({ ...clinicForm, email: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Description (EN)</label>
                <textarea
                  rows={3}
                  placeholder="Overview of clinic accreditations, specialties, and facilities..."
                  value={clinicForm.descriptionEn}
                  onChange={(e) =>
                    setClinicForm({ ...clinicForm, descriptionEn: e.target.value })
                  }
                  className={inputClass}
                />
              </div>
            </>
          )}

          {/* DOCTOR FORM */}
          {modalType === 'doctor' && (
            <>
              <div className="rounded-[12px] border border-[#e8edf5] bg-[#f8faff] p-4">
                <div className="grid grid-cols-1 items-center gap-5 sm:grid-cols-3">
                  <div>
                    <ImageDropzone
                      label="Doctor Portrait Photo"
                      hint="JPG, PNG or WebP"
                      aspect="square"
                      file={doctorPhotoFile}
                      existingUrl={editingEntity?.data?.photoUrl}
                      onFileSelect={setDoctorPhotoFile}
                    />
                  </div>
                  <div className="space-y-3 sm:col-span-2">
                    <div>
                      <label className={labelClass}>Partner Clinic *</label>
                      <select
                        required
                        value={doctorForm.clinicId}
                        onChange={(e) =>
                          setDoctorForm({ ...doctorForm, clinicId: e.target.value })
                        }
                        className={inputClass}
                      >
                        <option value="">Select Clinic *</option>
                        {clinics.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Doctor Full Name *</label>
                      <input
                        required
                        placeholder="e.g. Dr. Aida Filipcic"
                        value={doctorForm.fullName}
                        onChange={(e) =>
                          setDoctorForm({ ...doctorForm, fullName: e.target.value })
                        }
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Academic Title</label>
                  <input
                    placeholder="e.g. Prof. Dr. sc."
                    value={doctorForm.titleEn}
                    onChange={(e) => setDoctorForm({ ...doctorForm, titleEn: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Specialization (EN) *</label>
                  <input
                    required
                    placeholder="e.g. Orthopaedics & Traumatology"
                    value={doctorForm.specializationEn}
                    onChange={(e) =>
                      setDoctorForm({ ...doctorForm, specializationEn: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Experience (Years)</label>
                  <input
                    type="number"
                    min={0}
                    max={70}
                    value={doctorForm.experienceYears}
                    onChange={(e) =>
                      setDoctorForm({ ...doctorForm, experienceYears: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Contact Email</label>
                  <input
                    type="email"
                    placeholder="doctor@clinic.hr"
                    value={doctorForm.email}
                    onChange={(e) => setDoctorForm({ ...doctorForm, email: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Biography &amp; Credentials (EN)</label>
                <textarea
                  rows={3}
                  placeholder="Education, board certifications, surgical focus..."
                  value={doctorForm.bioEn}
                  onChange={(e) => setDoctorForm({ ...doctorForm, bioEn: e.target.value })}
                  className={inputClass}
                />
              </div>
            </>
          )}

          {/* CATEGORY FORM */}
          {modalType === 'category' && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Category Name (EN) *</label>
                <input
                  required
                  placeholder="e.g. Cardiology"
                  value={categoryForm.titleEn}
                  onChange={(e) =>
                    setCategoryForm({ ...categoryForm, titleEn: e.target.value })
                  }
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Category Name (AZ)</label>
                <input
                  placeholder="e.g. Kardiologiya"
                  value={categoryForm.titleAz}
                  onChange={(e) =>
                    setCategoryForm({ ...categoryForm, titleAz: e.target.value })
                  }
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Category Name (RU)</label>
                <input
                  placeholder="Optional Russian title"
                  value={categoryForm.titleRu}
                  onChange={(e) =>
                    setCategoryForm({ ...categoryForm, titleRu: e.target.value })
                  }
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>URL Slug</label>
                <input
                  placeholder="auto-generated if empty"
                  value={categoryForm.slug}
                  onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Description (EN)</label>
                <textarea
                  rows={3}
                  placeholder="Brief overview of this medical specialty..."
                  value={categoryForm.descriptionEn}
                  onChange={(e) =>
                    setCategoryForm({ ...categoryForm, descriptionEn: e.target.value })
                  }
                  className={inputClass}
                />
              </div>
            </div>
          )}

          {/* SERVICE FORM */}
          {modalType === 'service' && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={labelClass}>Medical Category *</label>
                <select
                  required
                  value={serviceForm.categoryId}
                  onChange={(e) =>
                    setServiceForm({ ...serviceForm, categoryId: e.target.value })
                  }
                  className={inputClass}
                >
                  <option value="">Select Category *</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Service Title (EN) *</label>
                <input
                  required
                  placeholder="e.g. Knee Arthroscopy"
                  value={serviceForm.titleEn}
                  onChange={(e) => setServiceForm({ ...serviceForm, titleEn: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Service Title (AZ)</label>
                <input
                  placeholder="e.g. Diz artroskopiyası"
                  value={serviceForm.titleAz}
                  onChange={(e) => setServiceForm({ ...serviceForm, titleAz: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Estimated Duration</label>
                <input
                  placeholder="e.g. 1-2 hours"
                  value={serviceForm.durationText}
                  onChange={(e) =>
                    setServiceForm({ ...serviceForm, durationText: e.target.value })
                  }
                  className={inputClass}
                />
              </div>
              <div className="flex items-end pb-1">
                <label className="flex cursor-pointer items-center gap-2.5 rounded-[10px] border border-[#d6deeb] bg-[#f8faff] px-4 py-2.5 text-[1.3rem] font-semibold text-[#0a295b]">
                  <input
                    type="checkbox"
                    checked={Boolean(serviceForm.isMostSearched)}
                    onChange={(e) =>
                      setServiceForm({ ...serviceForm, isMostSearched: e.target.checked })
                    }
                    className="h-4 w-4 accent-[#3665f6]"
                  />
                  Highlight in Most Searched
                </label>
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>About Procedure (EN)</label>
                <textarea
                  rows={3}
                  placeholder="Clinical details, recovery time, and patient expectations..."
                  value={serviceForm.aboutEn}
                  onChange={(e) => setServiceForm({ ...serviceForm, aboutEn: e.target.value })}
                  className={inputClass}
                />
              </div>
            </div>
          )}

          {/* PACKAGE FORM */}
          {modalType === 'package' && (
            <>
              <div className="rounded-[12px] border border-[#e8edf5] bg-[#f8faff] p-4">
                <ImageDropzone
                  label="Package Cover Image"
                  hint="JPG or WebP (16:9 recommended)"
                  aspect="wide"
                  file={packageCoverFile}
                  existingUrl=""
                  onFileSelect={setPackageCoverFile}
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Package Title (EN) *</label>
                  <input
                    required
                    placeholder="e.g. Executive Cardiac Check-Up"
                    value={packageForm.titleEn}
                    onChange={(e) =>
                      setPackageForm({ ...packageForm, titleEn: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Package Title (AZ)</label>
                  <input
                    placeholder="Optional Azerbaijani title"
                    value={packageForm.titleAz}
                    onChange={(e) =>
                      setPackageForm({ ...packageForm, titleAz: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Starting Price (EUR) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={packageForm.priceFrom}
                    onChange={(e) =>
                      setPackageForm({ ...packageForm, priceFrom: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>What&apos;s Included (EN)</label>
                  <input
                    placeholder="e.g. Diagnostics, 2 nights hotel, VIP transfer"
                    value={packageForm.includesEn}
                    onChange={(e) =>
                      setPackageForm({ ...packageForm, includesEn: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>Description (EN)</label>
                  <textarea
                    rows={3}
                    placeholder="Detailed breakdown of the all-in-one treatment package..."
                    value={packageForm.descriptionEn}
                    onChange={(e) =>
                      setPackageForm({ ...packageForm, descriptionEn: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>
              </div>
            </>
          )}
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-[#e8edf5] bg-[#fafbfe] px-7 py-4">
          <button
            type="button"
            disabled={submitting}
            onClick={onClose}
            className="cursor-pointer rounded-[10px] border border-[#d6deeb] bg-white px-5 py-2.5 text-[1.35rem] font-semibold text-[#475569] transition-colors hover:bg-[#f1f5f9] disabled:opacity-50"
          >
            {t('admin.modal.cancel')}
          </button>
          <button
            type="submit"
            form="admin-entity-form"
            disabled={submitting}
            className="zm-btn zm-btn-green inline-flex items-center gap-2 rounded-[10px] !px-6 !py-2.5 !text-[1.35rem] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            <span>
              {submitting
                ? t('admin.modal.saving')
                : isEditing
                  ? t('admin.modal.saveChanges')
                  : t('admin.modal.createSave')}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

