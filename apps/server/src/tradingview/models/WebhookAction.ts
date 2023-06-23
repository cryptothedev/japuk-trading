export enum WebhookAction {
  // alert_{{ticker}}:{{close}}:{{reason}}
  Alert = 'alert',
  RebalanceTo = 'rbto',
  DCA = 'dca',
  SellPercent = 'sell%',
}
