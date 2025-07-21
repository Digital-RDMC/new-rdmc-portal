"use client";


import "@/i18n";


function AboutContent() {
  

  return (
    <div className="prose dark:prose-invert container mx-auto p-4">
      <p className="mb-4">
        This is a demonstration of Next.js with internationalization (i18n)
        using react-i18next. It allows for language switching without changing
        the URL.
      </p>
      <p className="mb-4">The current implementation supports:</p>
      <ul className="list-disc pl-6 mb-4">
        <li>English</li>
        <li>French</li>
        <li>Arabic (with RTL support)</li>
      </ul>{" "}
      <p>
        The application automatically detects your browser language preference
        and stores your selection in localStorage.
      </p>
      <p className="mb-4 mt-4">
        You can also share links with a specific language by adding ?lang=en,
        ?lang=fr, or ?lang=ar to the URL.
      </p>
 
    </div>
  );
}

export default function About() {
  return (
   
      <AboutContent />
  
  );
}
