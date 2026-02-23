// src/app/_components/PageShell.js
export default function PageShell({ children }) {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-6 pb-12">
      {children}
    </div>
  );
}