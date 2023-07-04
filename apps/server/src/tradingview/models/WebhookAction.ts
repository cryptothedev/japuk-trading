export enum WebhookAction {
  // alert_{{ticker}}:{{close}}:{{reason}}
  Alert = 'alert',
  // rbto or rbto_7000
  RebalanceTo = 'rbto',
  // dca_500
  DCA = 'dca',
  // sell_5
  SellPercent = 'sell%',
  // short_{{ticker}}
  SmartShort = 'short',
  // long_{{ticker}}
  SmartLong = 'long',
  // rb_{{ticker}} or rb_{{ticker}}_7000
  Rebalance = 'rb',
}
