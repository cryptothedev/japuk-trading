import { SwitchNotMatchError } from '@japuk/models'

import { WebhookAction } from '../models/WebhookAction'

export const getWebhookAction = (message: string) => {
  const webhookAction = message.split('_')[0] as WebhookAction
  switch (webhookAction) {
    case WebhookAction.Alert: {
      return WebhookAction.Alert
    }
    case WebhookAction.RebalanceTo: {
      return WebhookAction.RebalanceTo
    }
    case WebhookAction.DCA: {
      return WebhookAction.DCA
    }
    case WebhookAction.SellPercent: {
      return WebhookAction.SellPercent
    }
    default: {
      throw new SwitchNotMatchError(`${message}:${webhookAction}`)
    }
  }
}
