import { defineCloudflareConfig } from "@opennextjs/cloudflare/config";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

/**
 * Prerendered pages are served from Workers static assets (a read-only
 * cache; files land under the worker-only cdn-cgi/_next_cache path).
 *
 * The R2 cache it replaces cost one Cloudflare API call per page on every
 * deploy, and this account's sister sites deploy at the same times, so the
 * uploads kept hitting the account-wide 1,200-requests-per-5-minutes limit
 * (HTTP 429). Static assets go up in a few batched, resumable requests.
 *
 * Read-only is fine here: nothing revalidates at runtime (OpenNext's default
 * revalidation queue is a no-op). Date pages older than the prerendered
 * window (dynamicParams = true) are rendered on each request instead of
 * being stored. Their R2 entries were keyed by build ID anyway, so every
 * deploy (several a day) already threw them away.
 */
export default defineCloudflareConfig({
	incrementalCache: staticAssetsIncrementalCache,
});
