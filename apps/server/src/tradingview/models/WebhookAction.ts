export enum WebhookAction {
  // alert_{{ticker}}:{{close}}:{{reason}}
  Alert = 'alert',

  // rbto or rbto_7000
  RebalanceTo = 'rbto',

  // rb_{{ticker}} or rb_{{ticker}}_7000
  Rebalance = 'rb',

  // short_{{ticker}}
  SmartShort = 'short',

  // long_{{ticker}}
  SmartLong = 'long',

  // closeshort_{{ticker}}
  CloseShort = 'closeshort',

  // closelong_{{ticker}}
  CloseLong = 'closelong',
}
