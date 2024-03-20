export enum WebhookAction {
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
}
