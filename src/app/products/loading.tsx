import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function LoadingProductsPage() {
  return (
    <>
      <SiteHeader />

      <main className="min-h-dvh">
        <div className="mx-auto w-full max-w-6xl space-y-10 px-6 pb-20 pt-14 md:px-10 md:pt-18">
          {/* Header Skeleton */}
          <div className="max-w-3xl space-y-5">
            <div className="h-7 w-48 rounded bg-[var(--color-accent-soft)]" />
            <div className="h-12 w-full max-w-xl rounded bg-[var(--color-border)]" />
            <div className="h-6 w-full max-w-lg rounded bg-[var(--color-border)]" />
          </div>

          {/* Divider Skeleton */}
          <div className="flex items-center justify-center gap-4 py-4">
            <div className="h-px w-24 bg-[var(--color-border)]" />
            <div className="size-3 rounded-full bg-[var(--color-accent-soft)]" />
            <div className="h-px w-24 bg-[var(--color-border)]" />
          </div>

          {/* Filter Pills Skeleton */}
          <div className="flex gap-3">
            <div className="h-9 w-24 rounded-full bg-[var(--color-border)]" />
            <div className="h-9 w-20 rounded-full bg-[var(--color-border)]" />
            <div className="h-9 w-24 rounded-full bg-[var(--color-border)]" />
          </div>

          {/* Product Grid Skeleton */}
          <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="space-y-0 overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)]"
                style={{
                  boxShadow: "0 4px 0 var(--color-accent-soft)",
                }}
              >
                <div className="aspect-[4/5] w-full bg-[var(--color-accent-soft)]" />
                <div className="space-y-4 p-6">
                  <div className="h-7 w-3/4 rounded bg-[var(--color-border)]" />
                  <div className="h-4 w-full rounded bg-[var(--color-border)]" />
                  <div className="flex justify-between border-t border-[var(--color-border)] pt-4">
                    <div className="h-6 w-16 rounded bg-[var(--color-border)]" />
                    <div className="h-5 w-20 rounded bg-[var(--color-border)]" />
                  </div>
                  <div className="h-11 w-full rounded bg-[var(--color-accent-soft)]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
