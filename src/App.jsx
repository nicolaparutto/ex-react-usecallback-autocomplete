import { useState, useEffect, useCallback } from "react"

function App() {

  const [searched, setSearched] = useState("");
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState();

  // funzione di debouce generica
  function debounce(callback, delay) {
    let timer;
    return (value) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        callback(value)
      }, delay)
    }
  }

  // funzione asincrona per la gestione dei prodotti risultato dalla ricerca nell'input
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
  // richiamo della funzione di debounce, con assegnazione tramite useCallback della funzione di callback + delay
  const debounceFetchProducts = useCallback(
    debounce(fetchProducts, 400)
    , [])

  // richiamo della funzione debounceFetchProducts, soltanto al cambiamento della dipendenza (searched)
  useEffect(() => {
    debounceFetchProducts(searched)
  }, [searched])

  // funzione per la gestione della chiamata, per ricevere i dati relativi ad un singolo prodotto
  async function fetchProduct(productId) {
    setSearched("")
    setProducts([])
    try {
      const response = await fetch(`https://boolean-spec-frontend.vercel.app/freetestapi/products/${productId}`);
      const productData = await response.json();
      setProduct(productData)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <section className="container">
        <div className="search-box">
          <h1 className="title">Trova un prodotto</h1>
          <input
            className="search-bar"
            placeholder="Cerca un prodotto..."
            type="text"
            value={searched}
            onChange={e => setSearched(e.target.value)}
          />
        </div>
        {products.length > 0 && (
          <div className="searched-box ">
            <ul className="searched-list">
              {products.map((product) => (
                <li key={product.id}>
                  <a onClick={() => fetchProduct(product.id)}>
                    <i class="fa-solid fa-magnifying-glass lens"></i>
                    {product.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {product && (
        <section className="container">
          <div className="product-box">
            <div className="product-img">
              <img src={product.image} alt="" />
            </div>
            <div className="product-info">
              <h1>{product.name}</h1>
              <p>{product.description}</p>
              <span>{product.price}€</span>
            </div>
          </div>
        </section>
      )}
    </>
  )
}

export default App