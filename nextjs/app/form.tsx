export default function Form() {
  return (
    <form>
        <input type="text" placeholder="Enter URL here" style={{ width: '80%' }} />
        <br />
        <span>
          <button type="submit">Parse URL</button>
          <button type="submit">Decode URL</button>
        </span>
    </form>
  );
}
