# Improve file browser with owners

## Currently

- `FileBrowser` (`packages/storage/src/components/file-browser/file-browser.tsx`) takes an `owners` prop of `StorageGroupOwner[]` (`{ type, uuid }`), where `type` is a `GroupType` (`user` or `department`).
- `useStorageGroups` sends one `GET /groups` request per owner through `Promise.all`, then flattens the results into a single list.
- `GroupSidebar` renders that list as a flat "Groups" nav: an icon by type, plus `group.label`.
- Limits of the current approach:
  - The sidebar has no notion of an owner: groups are not organized by owner or owner type, and only the icon tells a user group from a department group.
  - A caller passes only `type` and `uuid`, so it cannot control how an owner is displayed; the name comes from `group.label` as stored by the storage service.
  - An owner with no group shows no entry, with no feedback.
  - One failed owner request fails the whole query, so every other owner's groups are lost too.
  - The first group is active by default, and the caller cannot choose which owner opens first.
- The only consumer today is `UserFilePicker`, used by `UserProfilePanel` with the user's own owner and their department.
- Goal: make owners a clear concept in the file browser, so users can see whose files they are browsing and move between owners easily.
- Mockups/references: none yet.

## Acceptance Criteria

- [x] Remove owner props, replace by `limit`
- [x] `limit` is object for prisma where input
- [x] Ex:
  - { OR: [ { type: `user`}, { type: `department`, uuid: `1212`}]}
  - { type: in: [`user`, `department`]}
  - ....
- [x] If `limit` is empty or null -> load all group

## Solutions

- [x] `GET /groups` takes `limit` as a JSON query param, replacing `type` and `uuid`, and passes it to Prisma as `where`
- [x] `limit` is validated against a whitelist (`StorageGroupLimit`: `type`, `uuid`, `AND`, `OR`, `NOT`), so a client cannot filter on other columns or relations
- [x] `listGroups` loads every page, as a `limit` can now match more than one page of groups
- [x] Groups are ordered users first, so `UserProfilePanel` still opens on the user's own group
