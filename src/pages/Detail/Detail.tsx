import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, } from "react";
import { CoinsProps } from "../Home/Home";

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

        })

      }catch(err){
        console.log(err);
        navigate("/");
      }
    }

    getCoin();

  },[cripto])



  return ( 
    <h1>Teste {cripto}</h1>
   );
}
 
export default Detail;