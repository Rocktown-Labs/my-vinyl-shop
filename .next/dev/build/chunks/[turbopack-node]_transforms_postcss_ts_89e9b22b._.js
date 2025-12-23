module.exports = [
"[turbopack-node]/transforms/postcss.ts { CONFIG => \"[project]/dev/RocktownLabs/projects/my-vinyl-shop/postcss.config.mjs [postcss] (ecmascript)\" } [postcss] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "chunks/8e0ad__pnpm_e71f28ed._.js",
  "chunks/[root-of-the-server]__0e80859f._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[turbopack-node]/transforms/postcss.ts { CONFIG => \"[project]/dev/RocktownLabs/projects/my-vinyl-shop/postcss.config.mjs [postcss] (ecmascript)\" } [postcss] (ecmascript)");
    });
});
}),
];