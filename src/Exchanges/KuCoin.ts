import * as utils from "@ekliptor/apputils";
const logger = utils.logger
    , nconf = utils.nconf;
import {MarketOrder, Ticker, Trade, TradeHistory, Currency} from "@ekliptor/bit-models";
import {CcxtExchange} from "./CcxtExchange";
import {ExOptions, OpenOrders, OrderParameters} from "./AbstractExchange";
import * as ccxt from "ccxt";
import * as crypto from "crypto";


export default class KuCoin extends CcxtExchange {
    constructor(options: ExOptions) {
        super(options);
        this.exchangeLabel = Currency.Exchange.KUCOIN;
        this.minTradingValue = 0.001;
        this.fee = 0.001;
        this.currencies.setSwitchCurrencyPair(true);
        let config = this.getExchangeConfig();
        config.password = this.apiKey.passphrase;
        const partnerID = "dfdce34c-7d83-4424-a0bc-0150ffe57809";
        config.headers = {
            // Tag: Wolf  Private key: dfdce34c-7d83-4424-a0bc-0150ffe57809
            "KC-API-PARTNER": partnerID,
            /*"KC-API-PARTNER-SIGN"() { // TODO wait https://github.com/ccxt/ccxt/issues/7176
                return crypto.createHash('sha256')
                    .update(Date.now().toString() + partnerID + this.apiKey.key, 'utf8')
                    .digest('base64');
            }*/
        }
        this.apiClient = new ccxt.kucoin(config);
        this.apiClient.loadMarkets().then(() => {
            this.onExchangeReady();
        }).catch((err) => {
            logger.error("Error loading %s markets", this.className, err);
        });
    }

    // ################################################################
    // ###################### PRIVATE FUNCTIONS #######################

}
