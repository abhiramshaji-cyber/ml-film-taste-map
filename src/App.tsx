import TasteMap from "./demo/TasteMap";

const NOTES =
  "https://github.com/abhiramshaji-cyber/ml-film-taste-map#how-it-works";

export default function App() {
  return (
    <main className="page">
      <header className="hero">
        <span className="badge">Machine learning lab</span>
        <h1 className="display">Film taste map</h1>
        <p className="tagline">
          Rate five films, then watch a recommender learn your taste, epoch by
          epoch.
        </p>
        <a className="link" href={NOTES}>
          How it works <span aria-hidden="true">→</span>
        </a>
      </header>
      <div className="demo">
        <TasteMap />
      </div>
    </main>
  );
}
