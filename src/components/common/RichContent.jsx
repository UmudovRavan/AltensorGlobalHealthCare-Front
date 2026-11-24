function sanitizeHtml(html) {
  if (typeof html !== 'string') return ''
  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, '')
    .replace(/\son\w+\s*=\s*(['"]).*?\1/gi, '')
    .replace(/\son\w+\s*=\s*[^\s>]+/gi, '')
    .replace(/javascript:/gi, '')
}

export default function RichContent({ content, className = '' }) {
  if (!content || typeof content !== 'string') return null
  const trimmed = content.trim()
  if (!trimmed) return null

  const looksLikeHtml = /<\/?[a-z][\s\S]*>/i.test(trimmed)
  if (looksLikeHtml) {
    return (
      <div
        className={`space-y-4 text-[1.55rem] leading-[1.7] text-[#555555] [&_h3]:mt-4 [&_h3]:text-[1.8rem] [&_h3]:font-bold [&_h3]:text-[#0c3a94] [&_li]:ml-5 [&_li]:list-disc [&_p]:mb-3 [&_strong]:font-semibold [&_strong]:text-[#0a295b] ${className}`}
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(trimmed) }}
      />
    )
  }

  const paragraphs = trimmed
    .split(/\n{2,}|\r\n\r\n/)
    .map((p) => p.trim())
    .filter(Boolean)

  return (
    <div className={`space-y-4 text-[1.55rem] leading-[1.7] text-[#555555] ${className}`}>
      {paragraphs.map((para, idx) => (
        <p key={idx} className="whitespace-pre-line">
          {para}
        </p>
      ))}
    </div>
  )
}
