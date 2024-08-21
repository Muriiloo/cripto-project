import styles from "./home.module.css";
import { BsSearch } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { useState, FormEvent, useEffect } from "react";

interface CoinsProps{
  id: string;
  symbol: string;
  name: string;
  priceUsd: string;
  vwap24Hr: string;
  changePercent24Hr: string;
  rank: string;
  maxSupply: string;
  marketCapUsd: string;
  volumeUsd24hr: string;
  explorer: string;
  formatedPrice?: string;
  marketPrice?: string;
}

interface Data{
  data: CoinsProps[];
}

export function Home() {
  const [input, setInput] = useState("");
  const [ offset, setOffset ] = useState(0);
  const navigate = useNavigate();
  const [ coins, setCoins ] = useState<CoinsProps[]>([]);


  useEffect(()=> {
    getData();
  }, [offset]);

  async function getData(){
    fetch(`https://api.coincap.io/v2/assets?limit=10&offset=${offset}`)
    .then((response)=> response.json())
    .then((data: Data)=>{
      const coinsProps = data.data;


      const price = Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
      });

      const priceCompact = Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        notation: "compact"
      })

      
      const formatedResult = coinsProps.map((item)=>{
        const formated = {
          ...item,
          formatedPrice: price.format(Number(item.priceUsd)),
          marketPrice: priceCompact.format(Number(item.marketCapUsd))
        }

        return formated;
      })

      const listCoins = [...coins, ...formatedResult];

      setCoins(listCoins);


    })
  }

  function handleSubmit(e: FormEvent){
    e.preventDefault(); // não vai recarregar a página

    if(input === '')return;

    navigate(`/detail/${input}`);

    
  }

  function handleMore(){

    if(offset === 0){
      setOffset(10);
      return;
    }

    setOffset(offset + 10);

  }

  return (
    <main className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input type="text" 
        placeholder="Digite o nome da moeda"
        value={input}
        onChange={(e)=> setInput(e.target.value)}
        />
        <button type="submit">
          <BsSearch size={30} color="#FFF" />
        </button>
      </form>

      <table>
        <thead>
          <tr>
            <th scope="col">Moeda</th>
            <th scope="col">Valor do Mercado</th>
            <th scope="col">Preço</th>
            <th scope="col">Mudança 24h</th>
          </tr>
        </thead>

        <tbody id="tbody">
          {coins.length > 0 && coins.map((item)=>(
            <tr className={styles.tr} key={item.id}>
            <td className={styles.tdLabel} data-label="Moeda">
              <div className={styles.name}>
                <img
                  className={styles.logo}
                  alt="logo moeda"
                  src={`https://assets.coincap.io/assets/icons/${item.symbol.toLowerCase()}@2x.png`}
                />
                <Link to={`/detail/${item.id}`}>
                  <span>{item.name}</span> | {item.symbol}
                </Link>
              </div>
            </td>

            <td className={styles.tdLabel} data-label="Valor do Mercado">
              {item.marketPrice}
            </td>

            <td className={styles.tdLabel} data-label="Preço">
              {item.formatedPrice}
            </td>


            <td className={Number(item.changePercent24Hr) > 0 ? styles.tdProfit : styles.tdLoss} data-label="Mudança 24h">
              <span>{Number(item.changePercent24Hr).toFixed(2)}</span>
            </td>
          </tr>
          ))}
        </tbody>
      </table>

      <button className={styles.buttonMore} onClick={handleMore} >
        Carregar mais...
      </button>

    </main>
  );
}
