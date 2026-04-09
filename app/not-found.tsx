import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="py-24 md:py-32">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-6xl md:text-8xl font-bold text-neutral-200">
          404
        </h1>
        <h2 className="mt-4 text-2xl md:text-3xl font-semibold text-neutral-900">
          页面未找到
        </h2>
        <p className="mt-4 text-neutral-500">
          你访问的页面不存在或已被移除
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center justify-center px-6 py-3 bg-neutral-900 text-white rounded-lg font-medium hover:bg-neutral-800 transition-colors"
        >
          返回首页
        </Link>
      </div>
    </section>
  );
}