export enum WebhookAction {
  // alert_{{ticker}}:{{close}}:{{reason}}
  Alert = 'alert',
  // rbto_7000
  RebalanceTo = 'rbto',
  // dca_500
  DCA = 'dca',
  // sell_5
  SellPercent = 'sell%',
  // smshort
  SmartShort = 'smshort',
  // smlong
  SmartLong = 'smlong',
  // rb_{{ticker}}_7000
  Rebalance = 'rb',
}
