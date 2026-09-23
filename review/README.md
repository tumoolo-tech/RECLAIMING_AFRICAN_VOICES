# review/ — language review sheets

Generated sheets (`tn.md`, `zu.md`, …) are **not committed** — see [.gitignore](../.gitignore). Make one
when you need it:

```bash
cd app
npm run review:sheet -- tn        # one language
npm run review:sheet -- --all     # all ten non-English languages
```

**Returned sheets are committed.** When a reviewer sends one back, save it as
`review/returned/<code>-<name>-<date>.md`. That file is the record of what a person actually said about
their language, and it should outlive the strings it corrected.

The process, and what to do with a returned sheet: [specs/reviewer-guide.md](../specs/reviewer-guide.md).
