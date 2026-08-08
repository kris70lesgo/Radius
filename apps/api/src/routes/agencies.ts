import { Router } from 'express'
import { prisma } from '../prisma'
import { asyncHandler } from '../middleware/asyncHandler'
import type { AgencySettings } from '@radius/shared'

const router = Router()

// Mask sensitive fields for GET response
function maskSettings(settings: AgencySettings): AgencySettings {
    const mask = (val?: string) => val ? val.slice(0, 6) + '••••••' : undefined
    return {
        ...settings,
        githubToken: mask(settings.githubToken),
        storageAccessKeyId: mask(settings.storageAccessKeyId),
        storageSecretAccessKey: mask(settings.storageSecretAccessKey),
    }
}

// GET /api/agencies/:id/settings
router.get(
    '/:id/settings',
    asyncHandler(async (req, res) => {
        const agency = await prisma.agency.findUnique({ where: { id: req.params.id } })
        if (!agency) {
            res.status(404).json({ error: 'Agency not found' })
            return
        }
        const settings = (agency.settings ?? {}) as AgencySettings
        res.json(maskSettings(settings))
    })
)

// PUT /api/agencies/:id/settings
router.put(
    '/:id/settings',
    asyncHandler(async (req, res) => {
        const agency = await prisma.agency.findUnique({ where: { id: req.params.id } })
        if (!agency) {
            res.status(404).json({ error: 'Agency not found' })
            return
        }

        const existing = (agency.settings ?? {}) as AgencySettings
        const incoming = req.body as Partial<AgencySettings>

        // Merge: keep existing values for masked/empty fields
        const merged: AgencySettings = { ...existing }
        for (const [key, value] of Object.entries(incoming)) {
            // Skip masked values (contain ••••••) and empty strings
            if (typeof value === 'string' && (value.includes('••••••') || value === '')) continue
            ;(merged as any)[key] = value
        }

        await prisma.agency.update({
            where: { id: req.params.id },
            data: { settings: merged as any },
        })

        res.json({ success: true })
    })
)

export { router as agenciesRouter }
