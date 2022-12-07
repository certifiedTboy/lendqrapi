import { DeviceMobileCategory } from "../constants/DeviceMobileCategory";

/**
 * @class DevicePlatformDetector
 */
class DevicePlatformDetector {

    /**
     * @method getMobileCategory
     * @static
     * @param {string} userAgent 
     * @returns {DeviceMobileCategory}
     */
    static getMobileCategory(userAgent: string): DeviceMobileCategory {
        const MOBILE_DEVICE_INDICATORS = [
            "mobile", 
            "android", 
            "iphone", 
            "tablet", 
            "ipad", 
            "ipod"
        ];

        return MOBILE_DEVICE_INDICATORS.some(
            (mobileIndicator) => userAgent.toLowerCase().includes(mobileIndicator))
            ? DeviceMobileCategory.MOBILE
            : DeviceMobileCategory.NON_MOBILE
    }

}

export default DevicePlatformDetector;