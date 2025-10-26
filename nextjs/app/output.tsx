import {
  regexp,
  stringifyKeyOptionalValueObj,
  parseUrl,
  correctMediaLink
} from '../lib/urlParser';

export default function ParsedUrl() {
  return (
    <div id="output-container" className="mt-4">
      <h2>Analysis Result:</h2>
        <div className="table-responsive">
          <table id="parsedResult" className="url-table">
            <tbody>
            </tbody>
          </table>
        </div>
    </div>
  );
}
