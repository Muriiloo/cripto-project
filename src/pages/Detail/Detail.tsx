import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, } from "react";
import { CoinsProps } from "../Home/Home";
import styles from "./detail.module.css"

const Detail = () => {

  interface ResponseData{
    data: CoinsProps;
  }

  interface ErrorData{
    error: string;
  }

  type DataProps = ResponseData | ErrorData;

  const { cripto } = useParams();
  const navigate = useNavigate();
  const [ coin, setCoin ] = useState<CoinsProps>();
  const [ loading, setLoading ] = useState(true);

  useEffect(()=>{
    async function getCoin() {
      try{

        fetch(`https://api.coincap.io/v2/assets/${cripto}`)
        .then((response)=> response.json())
        .then((data: DataProps)=>{
          
          if("error" in data){
            navigate("/");
            return;
          }

          const price = Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD"
          });
    
          const priceCompact = Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            notation: "compact"
          })


          const resultData = {
            ...data.data,
            formatedPrice: price.format(Number(data.data.priceUsd)),
            marketPrice: priceCompact.format(Number(data.data.marketCapUsd))
          }

          setCoin(resultData);

          setLoading(false);

        })

      }catch(err){
        console.log(err);
        navigate("/");
      }
    }

    getCoin();

  },[cripto])


  if(loading || !coin ){
    return(
      <div className={styles.container}>
        <h3 className={styles.center}>Carregando detalhes da moeda...</h3>
      </div>
    )
  }



  return ( 
    <div className={styles.container}>
      <h1 className={styles.center}>{coin?.name}</h1>
      <h2 className={styles.center}>{coin?.symbol}</h2>

      <section className={styles.content}>

        <img 
          src={`https://assets.coincap.io/assets/icons/${coin?.symbol.toLowerCase()}@2x.png`}
          alt="Logo"
          className={styles.logo}
        />

        <h1>{coin?.name} | {coin.symbol}</h1>
        <p><strong>Preço: </strong>{coin?.formatedPrice}</p>

        <a>
          <strong>Mercado: </strong>{coin?.marketPrice}
        </a>

        <a>
          <strong>Mudança 24h: </strong>
          <span className={Number(coin?.changePercent24Hr) > 0 ? styles.protift : styles.loss}>
            {Number(coin?.changePercent24Hr).toFixed(2)}
            </span>
        </a>

      </section>

    </div>
   );
}
 
export default Detail;