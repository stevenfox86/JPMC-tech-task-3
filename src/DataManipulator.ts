import { ServerRespond } from './DataStreamer';

export interface Row {
  price_abc: number,
  price_def: number,
  ratio: number,
  timestamp: Date,
  upper_bound: number,
  lower_bound: number,
  trigger_alert: number | undefined,

}


export class DataManipulator {
  // Initially I overlooked removing the [] from after Row[]. If the square brackets are left, then the
  // Row object becomes and array of Row objects and since price_abc is not an array the code does not compile.
  static generateRow(serverResponds: ServerRespond[]): Row {
    
    const priceABC = (serverResponds[0].top_ask.price + serverResponds[0].top_bid.price) /2;
    const priceDEF = (serverResponds[1].top_ask.price + serverResponds[1].top_bid.price) /2;
    const ratio = priceABC / priceDEF;
    // This will never cause a trigger_alert since you are always above or below the ratio of stock_ABC/ stock_DEF by .01
    // const upperBound = ratio + 0.01;
    // const lowerBound = ratio - 0.01;
    
    // This will cause too many trigger alerts since the thresholds are too sensitive.
    // const upperBound = 1 + 0.01;
    // const lowerBound = 1 - 0.01;

    // This will cause too few trigger alerts since the thresholds are too broad. 
    // const upperBound = 1 + 0.1;
    // const lowerBound = 1 - 0.1;

    const upperBound = 1 + 0.05;
    const lowerBound = 1 - 0.05;
    return {
      price_abc: priceABC,
      price_def: priceDEF,
      ratio,
      // ternary definition of timestamp
      timestamp: serverResponds[0].timestamp > serverResponds[1].timestamp?
      serverResponds[0].timestamp : serverResponds[1].timestamp,
      upper_bound: upperBound,
      lower_bound: lowerBound,
      trigger_alert: (ratio > upperBound || ratio < lowerBound) ? ratio : undefined,
    };
  }
}
