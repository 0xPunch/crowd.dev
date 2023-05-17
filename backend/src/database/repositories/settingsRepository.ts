import _get from 'lodash/get'
import SequelizeRepository from './sequelizeRepository'
import AuditLogRepository from './auditLogRepository'
import { IRepositoryOptions } from './IRepositoryOptions'

export default class SettingsRepository {
  static async findOrCreateDefault(defaults, options: IRepositoryOptions) {
    const currentUser = SequelizeRepository.getCurrentUser(options)

    const tenant = SequelizeRepository.getCurrentTenant(options)
    const [settings] = await options.database.settings.findOrCreate({
      where: { id: tenant.id, tenantId: tenant.id },
      defaults: {
        ...defaults,
        id: tenant.id,
        tenantId: tenant.id,
        createdById: currentUser ? currentUser.id : null,
      },
      transaction: SequelizeRepository.getTransaction(options),
    })

    return this._populateRelations(settings, options)
  }

  static async save(data, options: IRepositoryOptions) {
    const transaction = SequelizeRepository.getTransaction(options)

    const currentUser = SequelizeRepository.getCurrentUser(options)

    const tenant = SequelizeRepository.getCurrentTenant(options)

    data.backgroundImageUrl = _get(data, 'backgroundImages[0].downloadUrl', null)
    data.logoUrl = _get(data, 'logos[0].downloadUrl', null)

    const [settings] = await options.database.settings.findOrCreate({
      where: { id: tenant.id, tenantId: tenant.id },
      defaults: {
        ...data,
        id: tenant.id,
        tenantId: tenant.id,
        createdById: currentUser ? currentUser.id : null,
      },
      transaction,
    })

    await settings.update(data, {
      transaction,
    })

    await AuditLogRepository.log(
      {
        entityName: 'settings',
        entityId: settings.id,
        action: AuditLogRepository.UPDATE,
        values: data,
      },
      options,
    )

    return this._populateRelations(settings, options)
  }

  static getActivityChannels(options: IRepositoryOptions) {
    return options.currentTenant?.settings[0]?.activityChannels
  }

  static async _populateRelations(record, options: IRepositoryOptions) {
    if (!record) {
      return record
    }

    const segment = SequelizeRepository.getStrictlySingleActiveSegment(options)

    const settings = record.get({ plain: true })

    settings.activityTypes = segment.activityTypes

    return settings
  }
}
