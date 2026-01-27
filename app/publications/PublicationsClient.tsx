"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type FeedItem =
  | {
      type: "linkedin";
      title: string;
      date: string;
      description?: string;
      url: string;
      image?: string;
    }
  | {
      type: "article";
      title: string;
      date: string;
      description?: string;
      slug: string;
    };

function LinkedInCard({ item }: { item: Extract<FeedItem, { type: "linkedin" }> }) {
  const LI_BLUE = "#445f7a";

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noreferrer"
      className="group block h-[360px] rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 transition overflow-hidden"
    >
      <div className="relative w-full h-[140px] border-b bg-neutral-100">
        {item.image ? (
          <Image
            src={item.image}
            alt=""
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-neutral-100 via-white to-neutral-100" />
        )}

        <div className="absolute right-3 top-3">
          <span
            className="inline-flex h-6 w-6 items-center justify-center rounded text-[11px] font-bold text-white shadow-sm"
            style={{ backgroundColor: LI_BLUE }}
            aria-hidden
          >
            in
          </span>
        </div>
      </div>

      <div className="p-4 h-[220px] flex flex-col">
        <div className="flex items-center gap-2 min-w-0">
          <Image
            src="/images/lisa_fellinger_linkedin_profile.jpg"
            alt="Lisa Fellinger"
            width={28}
            height={28}
            className="rounded-full object-cover"
          />
          <div className="min-w-0 leading-tight">
            <div className="text-sm font-medium truncate">Lisa Fellinger</div>
            <div className="text-xs text-neutral-500 truncate">Senior Web Analytics Consultant</div>
          </div>
        </div>

        <div className="mt-3 space-y-2">
          <h3 className="text-sm font-semibold leading-snug line-clamp-2">{item.title}</h3>
          {item.description ? (
            <p className="text-sm text-neutral-600 line-clamp-3">{item.description}</p>
          ) : null}
        </div>

        <div className="mt-auto h-8 flex items-center justify-between text-xs text-neutral-500">
          <span>{item.date}</span>
          <span className="inline-flex items-center gap-1 font-medium" style={{ color: LI_BLUE }}>
            View on LinkedIn <span aria-hidden>↗</span>
          </span>
        </div>
      </div>
    </a>
  );
}

function ArticleCard({ item }: { item: Extract<FeedItem, { type: "article" }> }) {
  return (
    <Link
      href={`/publications/${item.slug}`}
      className="group block h-[360px] rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 transition overflow-hidden"
    >
      <div className="w-full h-[140px] border-b bg-gradient-to-br from-neutral-100 via-white to-neutral-100" />

      <div className="p-4 h-[220px] flex flex-col">
        <div className="text-xs text-neutral-500">{item.date}</div>

        <div className="mt-2 space-y-2">
          <h3 className="text-sm font-semibold leading-snug line-clamp-2">{item.title}</h3>
          {item.description ? <p className="text-sm text-neutral-600 line-clamp-3">{item.description}</p> : null}
        </div>

        <div className="mt-auto h-8 flex items-center justify-between text-xs text-neutral-500">
          <span className="font-medium text-neutral-700">Article</span>
          <span className="group-hover:underline">Read article →</span>
        </div>
      </div>
    </Link>
  );
}

export function PublicationsClient({
  initialItems,
  initialNextOffset,
  initialHasMore,
}: {
  initialItems: FeedItem[];
  initialNextOffset: number;
  initialHasMore: boolean;
}) {
  const [items, setItems] = useState<FeedItem[]>(initialItems);
  const [nextOffset, setNextOffset] = useState(initialNextOffset);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);

  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/publications?offset=${nextOffset}&limit=12`, { cache: "no-store" });
      if (!res.ok) throw new Error("fetch_failed");

      const data: {
        items: FeedItem[];
        nextOffset: number;
        hasMore: boolean;
      } = await res.json();

      setItems((prev) => [...prev, ...data.items]);
      setNextOffset(data.nextOffset);
      setHasMore(data.hasMore);
    } finally {
      setLoading(false);
    }
  }, [hasMore, loading, nextOffset]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
       {items.map((item, idx) =>
        item.type === "linkedin" ? (
          <LinkedInCard key={`li:${item.url}:${idx}`} item={item} />
       ) : (
          <ArticleCard key={`a:${item.slug}:${idx}`} item={item} />
       )
   )}
      </div>

      {hasMore ? (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={loadMore}
            disabled={loading}
            className="rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm text-neutral-800 hover:bg-neutral-50 disabled:opacity-60"
          >
            {loading ? "Loading…" : "Load more"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
