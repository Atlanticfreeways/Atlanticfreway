import { Router } from 'express';
import { SafetyController } from '../controllers/safetyController';
import { AlertMonitorService } from '../services/alertMonitor';

const router = Router();

// Core endpoints
router.get('/status', SafetyController.getGlobalStatus);
router.get('/map', SafetyController.getMapData);
router.get('/destination/:countryCode', SafetyController.getDestinationSafety);

// New endpoints
router.get('/search', SafetyController.searchDestination);
router.get('/health-alerts', SafetyController.getHealthAlerts);
router.post('/refresh', SafetyController.refreshData);

// Manual Trigger for Testing Alerts
router.post('/trigger-alerts', async (_req, res) => {
    try {
        const result = await AlertMonitorService.checkAllBookings();
        return res.json({ success: true, result });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Alert check failed' });
    }
});

export default router;
