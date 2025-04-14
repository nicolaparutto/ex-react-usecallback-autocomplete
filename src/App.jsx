import { useState, useEffect } from "react"

function App() {

  const [searched, setSearched] = useState("");
  const [products, setProducts] = useState([]);

  const fetchProducts = async (searched) => {

    if (!searched.trim()) {
      setProducts([])
      return;
    }
    try {
      const response = await fetch(`https://boolean-spec-frontend.vercel.app/freetestapi/products?search=${searched}`);
      const data = await response.json();
      setProducts(data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchProducts(searched)
  }, [searched])

  return (
    <>
      <section className="container">
        <div>
          <h1>Trova un prodotto</h1>
          <input
            className="search-bar"
            placeholder="Cerca un prodotto..."
            type="text"
            value={searched}
            onChange={e => setSearched(e.target.value)}
          />
        </div>
        {products.length > 0 && (
          <div className="searched-box">
            <ul className="searched-list">
              {products.map((product) => (
                <li key={product.id}>{product.name}</li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </>
  )
}

export default App