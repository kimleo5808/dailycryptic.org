import { Callout } from "@/components/mdx/Callout";
import MDXComponents, { headingSlug } from "@/components/mdx/MDXComponents";
import { BASE_URL } from "@/config/site";
import { Locale, LOCALES } from "@/i18n/routing";
import { getPosts } from "@/lib/getBlogs";
import { articleSchema, breadcrumbSchema, JsonLd } from "@/lib/jsonld";
import { constructMetadata } from "@/lib/metadata";
import { BlogPost } from "@/types/blog";
import dayjs from "dayjs";
import { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote-client/rsc";
import { notFound } from "next/navigation";
import remarkGfm from "remark-gfm";

const mdxOptions = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
  },
};

type Params = Promise<{
  locale: string;
  slug: string;
}>;

const DEFAULT_AUTHOR = "Daily Cryptic Editors";
const WORDS_PER_MINUTE = 230;

/** H2 headings of a markdown post, as plain text, for the table of contents. */
function tableOfContents(markdown: string): { id: string; text: string }[] {
  return [...markdown.matchAll(/^## (.+)$/gm)].map((m) => {
    const text = m[1]
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
      .replace(/[*_`]/g, "")
      .trim();
    return { id: headingSlug(text), text };
  });
}

function readingMinutes(markdown: string): number {
  const words = markdown
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/<[^>]+>/g, " ")
    .split(/\s+/)
    .filter((w) => /[A-Za-z0-9]/.test(w)).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

const isoDate = (d: unknown) => (d instanceof Date ? d.toISOString() : String(d));

type MetadataProps = {
  params: Params;
};

export async function generateMetadata({
  params,
}: MetadataProps): Promise<Metadata> {
  const { locale, slug } = await params;
  let { posts }: { posts: BlogPost[] } = await getPosts(locale);
  const post = posts.find((post) => post.slug === "/" + slug);

  if (!post) {
    return constructMetadata({
      title: "404",
      description: "Page not found",
      noIndex: true,
      locale: locale as Locale,
      path: `/blog/${slug}`,
      canonicalUrl: `/blog/${slug}`,
    });
  }

  return constructMetadata({
    page: "blog",
    title: post.title,
    description: post.description,
    images: post.image ? [post.image] : [],
    locale: locale as Locale,
    path: `/blog/${slug}`,
    canonicalUrl: `/blog/${slug}`,
  });
}

export default async function BlogPage({ params }: { params: Params }) {
  const { locale, slug } = await params;
  let { posts }: { posts: BlogPost[] } = await getPosts(locale);

  const post = posts.find((item) => item.slug === "/" + slug);

  if (!post) {
    return notFound();
  }

  const slugClean = post.slug.replace(/^\//, "");
  const author: string = post.metadata.author || DEFAULT_AUTHOR;
  const updated = post.metadata.updated as unknown;
  const toc = tableOfContents(post.content);
  const minutes = readingMinutes(post.content);

  return (
    <div className="w-full md:w-3/5 px-2 md:px-12">
      <JsonLd
        data={articleSchema({
          title: post.title,
          description: post.description || "",
          url: `${BASE_URL}/blog/${slugClean}`,
          datePublished: isoDate(post.date),
          dateModified: updated ? isoDate(updated) : undefined,
          image: post.image
            ? post.image.startsWith("http") ? post.image : `${BASE_URL}${post.image}`
            : undefined,
          authorName: author,
          authorUrl: `${BASE_URL}/about`,
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          { name: "Blog", url: `${BASE_URL}/blog` },
          { name: post.title, url: `${BASE_URL}/blog/${slugClean}` },
        ])}
      />
      <h1 className="break-words text-4xl font-bold mt-6 mb-4">{post.title}</h1>
      <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
        By{" "}
        <a href="/about" className="font-medium text-slate-700 dark:text-slate-300 hover:underline">
          {author}
        </a>
        {" · "}Published <time dateTime={isoDate(post.date)}>{dayjs(post.date).format("D MMMM YYYY")}</time>
        {updated ? (
          <>
            {" · "}Updated <time dateTime={isoDate(updated)}>{dayjs(updated as string).format("D MMMM YYYY")}</time>
          </>
        ) : null}
        {" · "}
        {minutes} min read
      </p>
      {post.image && (
        <img src={post.image} alt={`Cover image for ${post.title}`} className="rounded-sm w-full" />
      )}
      {post.tags && post.tags.split(",").length ? (
        <div className="flex flex-wrap gap-2">
          {post.tags.split(",").map((tag) => {
            return (
              <div
                key={tag}
                className={`rounded-md bg-gray-200 hover:!no-underline dark:bg-[#24272E] flex px-2.5 py-1.5 text-sm font-medium transition-colors hover:text-black hover:dark:bg-[#15AFD04C] hover:dark:text-[#82E9FF] text-gray-500 dark:text-[#7F818C] outline-none focus-visible:ring transition`}
              >
                {tag.trim()}
              </div>
            );
          })}
        </div>
      ) : (
        <></>
      )}
      {post.description && <Callout>{post.description}</Callout>}
      {toc.length >= 4 && (
        <nav
          aria-label="Table of contents"
          className="my-8 rounded-lg border border-indigo-100 dark:border-indigo-900 bg-indigo-50/50 dark:bg-indigo-950/20 px-6 py-5"
        >
          <p className="mb-3 font-semibold text-slate-800 dark:text-slate-200">In this article</p>
          <ol className="list-decimal pl-5 space-y-1.5 text-sm">
            {toc.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 hover:underline"
                >
                  {item.text}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      )}
      <MDXRemote
        source={post?.content || ""}
        components={MDXComponents}
        options={mdxOptions}
      />
    </div>
  );
}

export async function generateStaticParams() {
  let posts = (await getPosts()).posts;

  // Filter out posts without a slug
  posts = posts.filter((post) => post.slug);

  return LOCALES.flatMap((locale) =>
    posts.map((post) => {
      const slugPart = post.slug.replace(/^\//, "").replace(/^blog\//, "");

      return {
        locale,
        slug: slugPart,
      };
    })
  );
}
