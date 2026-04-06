function Home() {
  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>🌱 Crop Disease Detection</h1>
      <p>Upload Image (No Login Required)</p>

      <input type="file" />
      <br /><br />

      <button>Detect Disease</button>
    </div>
  );
}

export default Home;