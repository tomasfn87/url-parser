export default function Form() {
  return (
    <form id="urlForm">
      <div className="form-group">
        <label htmlFor="urlInput">Enter URL:</label>
        <input id="urlInput" className="form-control" type="text"
          placeholder="https://example.com/path?param=value#fragment" />
        <br />
        <div id="button-container">
          <button type="button" id="parseButton" className="btn btn-primary" disabled>
            Parse
          </button>
          &nbsp;
          <button type="button" id="decodeButton" className="btn btn-primary" disabled>
            Decode
          </button>
        </div>
      </div>
    </form>
  );
}
