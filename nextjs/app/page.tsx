import Form from './form';

export default function Home() {
  return (
    <main>
      <div className="container">
        <h1>
          <a id="self-link" href="https://tomasfn87.github.io/url-parser">
            <img height="80px" width="80px" src="https://iili.io/3QLo60P.png" />
          </a>&nbsp; URL Parser
        </h1>
        <Form />
      </div>
    </main>
  );
}
