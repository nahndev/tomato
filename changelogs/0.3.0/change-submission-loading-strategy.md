# Change loading strategy of submission

## Currently

- The route `/submissions/[id]` ([page.tsx](../../apps/web/src/app/submissions/[id]/page.tsx)) is a Server Component that only awaits `params` and renders the client [submission-page.tsx](../../apps/web/src/modules/submission/components/submission-page.tsx). Nothing is fetched on the server, so the HTML arrives empty and every request starts in the browser after hydration.
- `SubmissionPage` loads the detail with `useSubmission` ([use-submission.ts](../../apps/web/src/modules/submission/hooks/use-submission.ts)): React Query, key `["submissions", id]`, global `staleTime: 60_000` ([query-provider.tsx](../../apps/web/src/shared/providers/query-provider.tsx)), calling `GET /submissions/:id`. While it loads, a full-screen `Spinner` is shown. Any error (network, 500, …) ends in `notFound()` on the client, so it shows the 404 page.
- Only after the detail resolves does `SubmissionDocProvider` ([submission-doc-provider.tsx](../../apps/web/src/modules/submission/components/submission-doc-provider.tsx)) mount and open the Hocuspocus websocket `submission/<id>`. It renders a second `Spinner` until `onSynced`, so the page loads as a waterfall: JS hydration → REST detail → websocket connect → Yjs sync. Two spinners appear one after the other, and the header is hidden until the doc syncs.
- `GET /submissions/:id` returns everything in one response: the submission, the full `templateVersion.snapshot`, and the dependency `graph`. The graph comes from a recursive CTE plus two queries (`SubmissionDependenciesService.getGraph`), and each of its nodes carries `data` / `dataDisplays`. The page waits for the graph although no component reads it.
- The form renders values from the Yjs doc only (`useSubmissionValues`); the `data` / `dataDisplays` in the REST response go unused on this page.
- The template version is immutable once published, yet it is re-fetched with every submission detail. Opening several submissions of the same version downloads the same snapshot each time.
- The board opens a submission with `router.push` / `Link` ([board-submissions.tsx](../../apps/web/src/modules/board/components/submissions/board-submissions.tsx), [submission-table.tsx](../../apps/web/src/modules/board/components/submissions/submission-table.tsx)). Nothing is prefetched, and the submission rows already in the board's cache are not reused.

## Acceptance Criteria

- [x] Currently, `/submissions/[id]` very large data and redundant data
- [x] Add new api load graph of submissions (by dependencies)
- [x] When load graph, must return all nodes and all edges
- [x] Don't mapping node with submission data, only id and name

## Solutions

- [x] `GET /submissions/:id` no longer reads or returns `graph`: back to submission + `templateVersion` (`SubmissionsService` no longer depends on `SubmissionDependenciesService`); `data` / `dataDisplays` stay
- [x] New endpoint `GET /submissions/:id/graph` in api module `submission-dependencies` (`SubmissionDependenciesController`, now registered in `AppModule`) → `SubmissionDependenciesService.getGraph` (`404` when the submission does not exist) → `SubmissionDependenciesRepository.findGraph`
- [x] All nodes and all edges: the recursive CTE walks both directions over `walk(id)` with `UNION`, which visits each submission once, so it returns the whole connected component and ends on cycles; the depth cap (`SUBMISSION_GRAPH_MAX_DEPTH`) is removed; edges are every dependency whose `source_id` is a node (the component is closed, so their targets are nodes too)
- [x] Nodes are `{ id }` only (`SubmissionGraphNode`), read straight from the CTE: no submission row, data or template is loaded; `name` is skipped for now (a submission has no name column)
- [x] Web: `SubmissionDetail` drops `graph`; `SubmissionGraph` / `SubmissionGraphNode` / `SubmissionDependency` stay in `submission.types.ts` for the future caller, no service or UI yet
- [x] Not covered: the page waterfall (REST detail → websocket → sync), the re-fetched template snapshot and the missing prefetch from the board remain; a very large component is returned in one response (no pagination)
