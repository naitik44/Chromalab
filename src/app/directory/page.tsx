export default function DirectoryPage() {
  return (
    <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
      <div className="w-16 h-16 mb-6 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-[0_0_32px_rgba(6,182,212,0.15)]">
        <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </div>
      <h1 className="font-display text-4xl font-bold mb-4">Resource Directory</h1>
      <p className="text-text-secondary max-w-lg mb-8">
        Browse the complete collection of tools, UI kits, typefaces, and utilities curated for professional visual designers.
      </p>
      <div className="flex gap-4">
        <div className="px-4 py-2 bg-surface-raised rounded-md text-sm border border-border-structural">
          Coming Soon in v2.5
        </div>
      </div>
    </div>
  );
}
