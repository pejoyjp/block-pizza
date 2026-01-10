

import Banner from "@/components/banner";
import Evaluation from "@/components/banner/evaluation";
import Feedback from "@/components/feedback";
import SpecialOffer from "@/components/menu/special-offer";
import { Button } from "@/components/ui/button";

export default function Home() {



  return (
 
      <div>
        <Banner/>
      
        <SpecialOffer isCenter={true}/>
      
      
        <Evaluation/>
        <Feedback/>
      </div>
     
    
  );
}
