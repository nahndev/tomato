# Add a component that shows the dependency graph of a submission

## Currently

- The api already serves the graph: `GET /submissions/:id/graph` ([submission-dependencies.controller.ts](../../apps/api/src/modules/submission-dependencies/submission-dependencies.controller.ts)) returns the whole connected component of the submission, `{ nodes, edges }`; `404` when the submission does not exist (see [change-submission-loading-strategy.md](./change-submission-loading-strategy.md)).
- Nodes are `{ id }` only (`SubmissionGraphNode`): no name, template, board or data. The submission has no name column, so a node has nothing readable to show besides its uuid.
- Edges are full dependency rows (`SubmissionDependency`): `sourceId`, `targetId`, `type` (`SubmissionDependencyType`: `parent`, `reference` in `@tomato/constants`), `refer`, `idempotencyKey`, `meta`.
- The returned component may contain cycles and has no size limit (no depth cap, no pagination), so it can be large.
- On the web, `SubmissionGraph` / `SubmissionGraphNode` / `SubmissionDependency` exist in [submission.types.ts](../../apps/web/src/modules/submission/submission.types.ts), but nothing uses them: [submission.service.ts](../../apps/web/src/modules/submission/services/submission.service.ts) only has `getSubmission`, [submission.keys.ts](../../apps/web/src/modules/submission/submission.keys.ts) only has `detail`, and there is no hook for the graph.
- `/submissions/[id]` ([submission-page.tsx](../../apps/web/src/modules/submission/components/submission-page.tsx)) renders the header ([submission-header.tsx](../../apps/web/src/modules/submission/components/submission-header.tsx): back button, template name, version, connection status) and the form only; there is no place that shows which submissions this one depends on or which depend on it, and no way to navigate between related submissions.
- The board list (`/system/boards/[id]`) shows submissions as a flat table with no hint of their dependencies.
- No graph / diagram library is installed in `apps/web` or `@tomato/ui` (no React Flow, dagre, elk, d3), and shadcn/ui has no graph component.
- Dependencies cannot be created from the app yet (no create / delete endpoint), so graphs only exist from seeded or hand-inserted rows.

## Acceptance Criteria

- [x] On left-sidebar of submission, show new component `SubmissionGraph`
- [x] Load graph dependence of `submissions`
- [x] Build utils class Graph::toTree into tree with rules
  - [x] Load nodes without dependence, add `Node` to tree
  - [x] Load children base on node, add all `Node`s to tree as children of current node
  - [x] If node loaded, add a `ReferNode` and don't load children for this node-type
  - [x] Shown base on depth
  - [x] Render all nodes
- [x] Render tree
- [x] The component accept a value={uuid} is current selected submission

## Solutions

- [x] Direction: an edge `source → target` means the source depends on the target, so in the tree a node's children are the submissions that depend on it (the `sourceId` of every edge whose `targetId` is the node)
- [x] `Graph` ([graph.ts](../../apps/web/src/modules/submission/utils/graph.ts)) is built from a `SubmissionGraph`; `toTree()` returns `SubmissionTreeNode[]` (`id`, `kind`, `depth`, `edge`, `children`)
  - roots are the nodes with no outgoing edge, in node order (uuid v7, so creation order); children follow the same order
  - depth-first: the first time a node is reached it becomes a `node` (`SubmissionTreeNodeKind.NODE`) and its dependents are expanded; every later time it is a `refer` leaf (`REFER`) that is not expanded, so a node with several dependencies appears once in full and cycles end
  - nodes only reachable through a cycle have no root, so every still unvisited node becomes an extra root afterwards: every node is rendered
  - `edge` is the dependency that placed the node under its parent (`null` for roots); `edge.id ?? id` is a unique React key since each node is expanded only once
- [x] Data: `getSubmissionGraph` (`GET /submissions/:id/graph`), `submissionKeys.graph(id)`, `useSubmissionGraph(id)`; after a fetch the same graph is written to the cache of every node (they share the connected component), so opening another node of the tree does not refetch it
- [x] `SubmissionGraph` ([submission-graph.tsx](../../apps/web/src/modules/submission/components/submission-graph.tsx)), `value` = the current submission id: the tree in the left sidebar, a skeleton while loading, nested lists indented per level with a guide line (`border-l`), a chevron to collapse / expand a node with children (local state, kept while navigating since the sidebar stays mounted); each row is a `variant-ghost` `Link` to the submission labelled with the last `SUBMISSION_SHORT_ID_LENGTH` (8) characters of the id (the leading ones are the uuid v7 timestamp and collide for siblings), and a tooltip with the full id, the edge `type` and "Already shown in the tree" on a refer row (the type is not on the row: a 16rem sidebar has no room for it at deep levels); the Radix viewport's `display: table` wrapper is forced to `block` so rows shrink to the sidebar and the label truncates; the `value` row is selected (`aria-current="page"`, on every row of that submission, `node` or `refer`), `refer` rows have a link icon
- [x] Layout: the sidebar lives in `app/submissions/layout.tsx` → `SubmissionLayout` (reads `id` with `useParams`), above the `[id]` segment, so it stays mounted while navigating between submissions; its top row (`h-14`, aligned with `SubmissionHeader`) holds the back button (always links to the board list `/system/boards`); `SubmissionPage` only renders the header and the form in the remaining column
- [x] Tests: [graph.spec.ts](../../apps/web/src/modules/submission/utils/graph.spec.ts) (single node, nesting, order, refer node, cycle without root, cycle below a root)
- [x] Not covered: nodes have no readable name (no name column, the api returns `{ id }` only); the whole tree is rendered expanded with no collapse or virtualization, so a very large component renders every row
