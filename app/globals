@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-paper font-sans text-ink antialiased;
  }
  h1, h2, h3 {
    @apply font-serif;
  }
}

@layer components {
  .btn-primary {
    @apply inline-flex items-center justify-center rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-60;
  }
  .btn-ghost {
    @apply inline-flex items-center justify-center rounded-md border border-brand px-4 py-2 text-sm font-semibold text-brand transition-colors hover:bg-brand-tint focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-60;
  }
  .btn-danger {
    @apply inline-flex items-center justify-center rounded-md border border-red-300 px-3 py-1.5 text-xs font-semibold text-red-700 transition-colors hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600;
  }
  .input {
    @apply w-full rounded-md border border-ink/20 bg-white px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30;
  }
  .label {
    @apply mb-1 block text-sm font-medium;
  }
  .panel {
    @apply rounded-lg border border-ink/10 bg-white p-5;
  }
}
