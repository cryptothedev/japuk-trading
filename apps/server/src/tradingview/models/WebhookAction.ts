export enum WebhookAction {
  // alert_{{ticker}}:{{close}}:{{reason}}
  Alert = 'alert',
  // rbto or rbto_7000
  RebalanceTo = 'rbto',
  // short_{{ticker}}
  SmartShort = 'short',
  // long_{{ticker}}
  SmartLong = 'long',
  // rb_{{ticker}} or rb_{{ticker}}_7000
  Rebalance = 'rb',
}
