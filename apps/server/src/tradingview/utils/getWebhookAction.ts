import { SwitchNotMatchError } from '@japuk/models'

import { WebhookAction } from '../models/WebhookAction'

export const getWebhookAction = (message: string) => {
  const webhookAction = message.split('_')[0] as WebhookAction
  switch (webhookAction) {
    case WebhookAction.Alert: {
      return WebhookAction.Alert
    }
    case WebhookAction.Rebalance: {
      return WebhookAction.Rebalance
    }
    case WebhookAction.RebalanceTo: {
      return WebhookAction.RebalanceTo
    }
    case WebhookAction.SmartShort: {
      return WebhookAction.SmartShort
    }
    case WebhookAction.SmartLong: {
      return WebhookAction.SmartLong
    }
    case WebhookAction.CloseShort: {
      return WebhookAction.CloseShort
    }
    case WebhookAction.CloseLong: {
      return WebhookAction.CloseLong
    }
    default: {
      throw new SwitchNotMatchError(`${message}:${webhookAction}`)
    }
  }
}
