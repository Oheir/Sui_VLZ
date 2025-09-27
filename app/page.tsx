import App from "./App/App";
import "./Page.css"; // import the CSS file

export default function Home() {
  return (
    <div className="page-background">
      <div className="container">
        <div className="header-text">
          <h1 className="title">Welcome to Shallot</h1>
          <p className="subtitle">
            Here you can vote and create polls for the community, freely and anonimously          </p>
        </div>

        <div className="app-wrapper">
          <App />
        </div>
      </div>
    </div>
  );
}
