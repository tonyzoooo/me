import type { CollectionAfterChangeHook } from 'payload'

// Triggers a rebuild of the static website after content changes.
// No-op unless WEB_DEPLOY_HOOK_URL is set (a Vercel Deploy Hook URL in production).
export const rebuildWebsite: CollectionAfterChangeHook = async ({ req }) => {
  const hookUrl = process.env.WEB_DEPLOY_HOOK_URL
  if (!hookUrl) return

  try {
    await fetch(hookUrl, { method: 'POST', signal: AbortSignal.timeout(5000) })
    req.payload.logger.info('Triggered website rebuild via deploy hook')
  } catch (error) {
    req.payload.logger.error({
      err: error,
      msg: 'Failed to trigger website rebuild via deploy hook',
    })
  }
}
