# Add VirtualSelect shared component

## Currently

- There is no select component that handles large option lists; the regular select renders every option into the DOM, which gets slow with hundreds or thousands of items.
- Goal: add a shared `VirtualSelect` component built on `@tanstack/react-virtual`, rendering only the visible options in the dropdown list.
- It is shared, so it must be reusable across web modules (not tied to any single module).

## Acceptance Criteria

- [x] Install @tanstack/react-virtual
- [x] Create shared component VirtualSelector support select for large data
- [ ]

## Solutions

- [x] Install
- [x] Implement
- [ ] Replace UserSelect using this component
