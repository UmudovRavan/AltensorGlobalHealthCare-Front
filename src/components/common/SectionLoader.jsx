export default function SectionLoader({ fullPage = false }) {
  return (
    <div
      className={`flex w-full items-center justify-center ${
        fullPage ? 'min-h-[55vh] py-20' : 'py-14'
      }`}
      role="status"
      aria-label="Loading"
    >
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#3665f6] border-t-transparent" />
    </div>
  )
}
