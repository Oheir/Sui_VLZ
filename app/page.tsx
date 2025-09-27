import App from "./App/App";
import "./Page.css"; // import the CSS file

export default function Home() {
  return (
    <div className="page-background">
      <div className="container">
        <div className="header-text">
          <h1 className="title">Welcome to Counter App</h1>
          <p className="subtitle">
            A beautiful and modern counter application built with Next.js,
            Tailwind CSS, and shadcn/ui components.
          </p>
        </div>

        <div className="app-wrapper">
          <App />
        </div>
      </div>
    </div>
  );
}
