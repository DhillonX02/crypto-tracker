import {useState, useEffect} from 'react'

function App() {
  const [isLoading, setIsLoading] = useState(true);

  // hide the loading message after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() =>{
      setIsLoading(false);
    },2000);

    return () => clearTimeout(timer);
  },[]);

  return (
    <div>
      <h1>Crypto Tracker</h1>
      <p>temprary message</p>

      {isLoading ? (
        <p>loading coins...</p>
      ) : (
        <section>
          <h2>Top Cryptocurrencies</h2>
        </section>
      )
    }

      <div>
        <input type="search" placeholder="search"/>
        <button>Search</button>
      </div>
    </div>
  )
}

export default App;