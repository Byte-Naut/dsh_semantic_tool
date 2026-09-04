# dsh Runtime Example

This keyless example loads the built semantic package through a real Cordis Loader configuration, mounts a provider and consumer, calls the model-facing `software_semantic_slice` tool, and checks the returned state against the live fixture.

Run it from the repository root:

```sh
npm run demo:dsh
```

The example intentionally omits an Agent and dynamic Host runner. The result must therefore report `dynamic_packages` as `UNAVAILABLE`; this verifies the coverage behavior rather than fabricating package state.
