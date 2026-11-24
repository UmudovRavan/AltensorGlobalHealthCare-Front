import { Check, Copy } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { BLOG_POSTS } from '../data/blog'
import { useTranslation } from '../hooks/useTranslation'

export default function BlogPage() {
  const { slug } = useParams()
  const [copied, setCopied] = useState(false)
  const { t } = useTranslation()

  if (slug) {
    const post = BLOG_POSTS.find((p) => p.slug === slug) || BLOG_POSTS[0]

    const copyUrl = () => {
      navigator.clipboard?.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }

    return (
      <article className="zm-container py-16">
        <nav className="mb-6 text-[1.3rem] text-[#666666]">
          <Link to="/en" className="text-[#3665f6] hover:underline">{t('about.home')}</Link> /{' '}
          <Link to="/en/blog" className="text-[#3665f6] hover:underline">{t('nav.blog')}</Link> /{' '}
          <span>{post.title}</span>
        </nav>

        <div className="mx-auto max-w-[920px]">
          <p className="text-[1.4rem] font-semibold text-[#0a295b]">
            By <span className="text-[#3665f6]">{post.author}</span> ·{' '}
            <time className="text-[#666666]">{post.date}</time>
          </p>

          <h1 className="mt-3 text-[3.8rem] font-bold leading-[1.12] text-[#0c3a94] md:text-[5.4rem]">
            {post.title}
          </h1>

          {/* Share Bar */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="text-[1.2rem] font-bold uppercase tracking-wider text-[#585858]">
              SHARE
            </span>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-[6px] border border-[#e8e8e8] px-3.5 py-1.5 text-[1.25rem] font-semibold text-[#0a295b] hover:border-[#3665f6] hover:text-[#3665f6]"
            >
              Facebook
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-[6px] border border-[#e8e8e8] px-3.5 py-1.5 text-[1.25rem] font-semibold text-[#0a295b] hover:border-[#3665f6] hover:text-[#3665f6]"
            >
              Twitter
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-[6px] border border-[#e8e8e8] px-3.5 py-1.5 text-[1.25rem] font-semibold text-[#0a295b] hover:border-[#3665f6] hover:text-[#3665f6]"
            >
              LinkedIn
            </a>
            <button
              type="button"
              onClick={copyUrl}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-[6px] border border-[#e8e8e8] px-3.5 py-1.5 text-[1.25rem] font-semibold text-[#0a295b] hover:border-[#3665f6] hover:text-[#3665f6]"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-[#7fbb58]" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copied' : 'Copy URL'}</span>
            </button>
          </div>

          <div className="mt-8 overflow-hidden rounded-[12px]">
            <img
              src={post.image}
              alt={post.title}
              className="h-[400px] w-full object-cover"
            />
          </div>

          {/* Key facts */}
          <div className="mt-10 rounded-[12px] bg-[#f4f7ff] p-7">
            <h2 className="text-[2.2rem] font-bold text-[#0c3a94]">Key facts</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-[1.55rem] text-[#0a295b]">
              {post.keyFacts.map((fact) => (
                <li key={fact}>{fact}</li>
              ))}
            </ul>
          </div>

          {/* Body sections */}
          <div className="mt-10 space-y-8">
            {post.sections.map((sec) => (
              <section key={sec.heading}>
                <h2 className="text-[2.8rem] font-bold text-[#0c3a94]">
                  {sec.heading}
                </h2>
                <p className="mt-3 text-[1.65rem] leading-[1.7] text-[#555555]">
                  {sec.body}
                </p>
              </section>
            ))}
          </div>
        </div>
      </article>
    )
  }

  return (
    <div className="zm-container py-16">
      <nav className="mb-6 text-[1.3rem] text-[#666666]">
        <Link to="/en" className="text-[#3665f6] hover:underline">Home</Link> /{' '}
        <span>Blog</span>
      </nav>

      <h1 className="text-[4.8rem] font-semibold leading-[1] text-[#0c3a94] md:text-[8.2rem]">
        Blog
      </h1>

      <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-3">
        {BLOG_POSTS.map((post) => (
          <article key={post.slug} className="flex flex-col">
            <Link
              to={`/en/blog/${post.slug}`}
              className="block h-[256px] w-full overflow-hidden rounded-[8px]"
            >
              <img
                src={post.image}
                alt={post.title}
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.08]"
              />
            </Link>
            <p className="mt-5 text-[1.4rem] font-medium text-[#0a295b]">
              By <span className="font-semibold text-[#3665f6]">{post.author}</span>
            </p>
            <Link
              to={`/en/blog/${post.slug}`}
              className="mt-2 text-[2.6rem] font-bold leading-[1.2] text-[#0a295b] hover:text-[#3665f6]"
            >
              {post.title}
            </Link>
            <p className="mt-3 line-clamp-4 text-[1.5rem] leading-[1.6] text-[#555555]">
              {post.excerpt}
            </p>
            <div className="mt-auto flex items-center justify-between pt-6">
              <Link
                to={`/en/blog/${post.slug}`}
                className="zm-btn zm-btn-green zm-btn-sm"
              >
                <span>Read more</span>
              </Link>
              <time className="text-[1.2rem] font-medium text-[#666666]">
                {post.date}
              </time>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

