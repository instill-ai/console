# About modals in this repo

The ModalBase based on TailwindCSS official UI and React createPortal function. 

# Caveats

- Please make sure there has a empty div with `id="modal-root"` in `_root.ts`.
- Please make sure in every modal there has a title with `id="modal-title"`.
- Try to use props drilling and not rely on context. Thanks to the createPortal function we could control the modal without passing props down to too many layers.

# Reference

- [Tailwind UI - Modal](https://tailwindui.com/components/application-ui/overlays/modals)
- [React - Portal](https://reactjs.org/docs/portals.html)