import { Link } from 'react-router-dom'
import { BLOG_POSTS } from '../../data/blog'
import { useTranslation } from '../../hooks/useTranslation'
import { SwiperArrowIcon } from '../common/ZagrebIcons'

export default function BlogSection() {
  const { t } = useTranslation()
  return (
    <section className="mt-[150px] md:mt-[220px]">
      <div className="zm-container">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <h2 className="text-[4.8rem] font-semibold leading-[1] text-[#0c3a94] md:text-[8.2rem]">
            {t('nav.blog', 'Blog')}
          </h2>

          <Link
            to="/en/blog"
            className="zm-btn zm-btn-green zm-btn-sm shrink-0 self-start md:self-auto inline-flex items-center gap-2"
          >
            <span>{t('common.viewAll', 'View all')}</span>
            <SwiperArrowIcon className="zm-btn-arrow h-[12px] w-[8px]" />
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-3">
          {BLOG_POSTS.map((post) => (
            <article key={post.slug} className="group flex flex-col">
              <Link
                to={`/en/blog/${post.slug}`}
                className="block h-[256px] w-full overflow-hidden rounded-[8px]"
              >
                <img
                  src={post.image}
                  alt={post.title}
                  className="h-full w-full object-cover transition-transform duration-[400ms] group-hover:scale-[1.08]"
                />
              </Link>

              <p className="mt-5 text-[1.4rem] font-medium text-[#0a295b]">
                By <span className="font-semibold text-[#3665f6]">{post.author}</span>
              </p>

              <Link
                to={`/en/blog/${post.slug}`}
                className="mt-2 text-[2.4rem] font-bold leading-[1.2] text-[#0a295b] transition-colors duration-[400ms] group-hover:text-[#3665f6] md:text-[2.6rem]"
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
    </section>
  )
}

