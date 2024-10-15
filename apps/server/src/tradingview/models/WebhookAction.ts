export enum WebhookAction {
  // a_{{message}
  AlertMessage = 'a',

  // alert_{{ticker}}:{{close}}:{{reason}}
  Alert = 'alert',

  // irb_{{ticker}}_{{current_price}
  IndicatorRebalance = 'irb',

  // rbto or rbto_7000
  RebalanceTo = 'rbto',

  // rb_{{ticker}} or rb_{{ticker}}_7000
  Rebalance = 'rb',

  // short_{{ticker}}
  SmartShort = 'short',

  // long_{{ticker}}
  SmartLong = 'long',

  // closeshort_{{ticker}}
  CloseShort = 'cshort',

  // closelong_{{ticker}}
  CloseLong = 'clong',

  // fbuy_{{ticker}}_{{lot}}_{{sl_pip}
  ForexBuy = 'fbuy',

  // fsell_{{ticker}}_{{lot}}_{{sl_pip}
  ForexSell = 'fsell',
}
